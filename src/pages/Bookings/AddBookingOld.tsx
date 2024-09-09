import { ChangeEvent, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export default function AddBooking() {
  const [isPickupNoteOpen, setIsPickupNoteOpen] = useState(false);
  const [isDestinationNoteOpen, setIsDestinationNoteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLeadChecked, setIsLeadChecked] = useState<boolean>(false);
  const [tempViaPoints, setTempViaPoints] = useState<string[]>([]);
  const [isAsap, setIsAsap] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Google Map Integration By Saqlain
  const pickupLocationRef = useRef<HTMLInputElement | null>(null);
  const destinationLocationRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null,
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null,
  );

  const handlePickupNotes = () => {
    setIsPickupNoteOpen(!isPickupNoteOpen);
  };

  const handleDestinationNotes = () => {
    setIsDestinationNoteOpen(!isDestinationNoteOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const addViaPoint = () => {
    if (tempViaPoints.length < 5) {
      setTempViaPoints([...tempViaPoints, '']);
    }
  };

  const removeTempViaPoint = (index: number) => {
    const updatedTempViaPoints = tempViaPoints.filter((_, i) => i !== index);
    setTempViaPoints(updatedTempViaPoints);
  };

  const handleViaPointChange = (index: number, value: string) => {
    const updatedTempViaPoints = [...tempViaPoints];
    updatedTempViaPoints[index] = value;
    setTempViaPoints(updatedTempViaPoints);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLeadChecked(e.target.checked);
  };

  const checkPickupStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAsap(e.target.checked);
    if (e.target.checked) {
      setSelectedDate(currentDate());
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // Current Date if ASAP is True
  const currentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Google Map Integration
  useEffect(() => {
    // Initialize Google Map
    const initMap = () => {
      const mapOptions: google.maps.MapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(51.509865, -0.118092), // Default center (London, UK)
      };

      mapRef.current = new google.maps.Map(
        document.getElementById('googleMap') as HTMLElement,
        mapOptions,
      );

      // Initialize Directions service and renderer
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
      directionsRendererRef.current.setMap(mapRef.current);
    };

    // Initialize Autocomplete
    const initializeAutocomplete = (
      inputRef: React.RefObject<HTMLInputElement>,
      markerRef: React.RefObject<google.maps.Marker | null>,
      markerColor: string,
      onPlaceChanged: (location: google.maps.LatLng) => void,
    ) => {
      if (window.google && window.google.maps) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current!,
          {
            componentRestrictions: { country: 'uk' }, // Restrict to UK
          },
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('Selected Place:', place);

          if (place.geometry) {
            const location = place.geometry.location;

            // Set map center to the selected place and zoom in
            mapRef.current?.setCenter(location);
            mapRef.current?.setZoom(14);

            // Create or update the marker with the specified color
            if (markerRef.current) {
              markerRef.current.setPosition(location);
            } else {
              markerRef.current = new google.maps.Marker({
                position: location,
                map: mapRef.current,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: markerColor,
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: 'white',
                },
              });
              markerRef.current.setMap(mapRef.current);
            }

            // Call the provided callback function
            onPlaceChanged(location);
          }
        });
      }
    };

    const handlePlaceChange = () => {
      if (
        pickupMarkerRef.current &&
        destinationMarkerRef.current &&
        directionsServiceRef.current &&
        directionsRendererRef.current
      ) {
        const pickupLocation = pickupMarkerRef.current.getPosition();
        const destinationLocation = destinationMarkerRef.current.getPosition();

        if (pickupLocation && destinationLocation) {
          const request: google.maps.DirectionsRequest = {
            origin: pickupLocation,
            destination: destinationLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsServiceRef.current.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRendererRef.current?.setDirections(result);

              // Adjust map bounds to include both pickup and destination points
              const bounds = new google.maps.LatLngBounds();
              bounds.extend(pickupLocation);
              bounds.extend(destinationLocation);
              mapRef.current?.fitBounds(bounds);
            } else {
              console.error('Directions request failed due to ', status);
            }
          });
        }
      }
    };

    // Initialize map and autocomplete for both pickup and destination
    if (window.google && window.google.maps) {
      initMap();
      initializeAutocomplete(
        pickupLocationRef,
        pickupMarkerRef,
        'blue',
        handlePlaceChange,
      );
      initializeAutocomplete(
        destinationLocationRef,
        destinationMarkerRef,
        'red',
        handlePlaceChange,
      );
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 mb-2">
              {/* User's location section */}
              <div className="flex flex-col gap-2 shadow-3 shadow-yellow-500 rounded-lg p-5 mb-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold mb-4">User's Location</h1>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-700 text-sm font-bold text-yellow-500 mr-5">
                      Pickup Status:
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Future
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isAsap}
                          onChange={checkPickupStatus}
                        />
                        <div
                          className={`relative w-11 h-6 rounded-full peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800
            ${isAsap ? 'bg-yellow-400' : 'bg-black'} 
            after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            ${
              isAsap
                ? 'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full'
                : 'peer-checked:after:translate-x-0 rtl:peer-checked:after:-translate-x-0'
            }`}
                        ></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          ASAP
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="pickupDate"
                    >
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={isAsap ? currentDate() : selectedDate}
                      id="pickupDate"
                      readOnly={isAsap ? true : false}
                      onChange={handleDateChange}
                      className="shadow-3  appearance-none outline-none focus:shadow-yellow-500 rounded w-full py-2 px-3 text-gray-700 leading-tight"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="pickupHour"
                      >
                        Pickup Hour
                      </label>
                      <div className="flex items-center ">
                        <div className="relative">
                          <select
                            id="pickupHour"
                            className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 py-[7px] px-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 max-h-24 overflow-y-auto"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option
                                key={i}
                                value={i.toString().padStart(2, '0')}
                              >
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="pickupTime"
                      >
                        Pickup Time
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <select
                            id="pickupTime"
                            className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 py-[7px] px-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 max-h-24 overflow-y-auto"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option
                                key={i}
                                value={i.toString().padStart(2, '0')}
                              >
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="pickupLocation"
                    >
                      Pickup Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        ref={pickupLocationRef}
                        id="pickupLocation"
                        className="shadow-3 appearance-none outline-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-yellow-500"
                        placeholder="Enter Pickup Location"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center p-3 bg-yellow-500 hover:bg-yellow-600 w-12">
                        <button
                          id="addNoteButton"
                          className="text-2xl pl-[2px] text-white hover:text-gray-700 transition-transform duration-300"
                          onClick={handlePickupNotes}
                        >
                          <i className="fa-regular fa-note-sticky"></i>
                        </button>
                        <span
                          className="absolute -top-6 right-0 p-1 text-xs text-white bg-gray-700 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none"
                          id="noteTooltip"
                        >
                          Notes
                        </span>
                      </div>
                    </div>

                    <div
                      id="notePopup"
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isPickupNoteOpen
                          ? 'max-h-40 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                      style={{
                        transitionProperty: 'max-height, opacity',
                        marginTop: isPickupNoteOpen ? '0.5rem' : '0',
                      }}
                    >
                      <div
                        className="p-4 border rounded-lg bg-white shadow-lg transition-opacity duration-300 ease-in-out"
                        style={{
                          opacity: isPickupNoteOpen ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                      >
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="noteInput"
                        >
                          Enter Note
                        </label>
                        <textarea
                          style={{ resize: 'none' }}
                          id="noteInput"
                          className="w-full p-2 border rounded-lg outline-none shadow-3 focus:shadow-yellow-500"
                          rows={3}
                          placeholder="Enter your note here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Destination Location*/}
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="pickupLocation"
                    >
                      Destination Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="pickupLocation"
                        ref={destinationLocationRef}
                        className="shadow-3 focus:shadow-yellow-500 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight outline-none"
                        placeholder="Enter Pickup Location"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center p-3 bg-yellow-500 hover:bg-yellow-600 w-12">
                        <button
                          id="addNoteButton"
                          className="text-white text-2xl pl-[2px] hover:text-gray-700 transition-transform duration-300"
                          onClick={handleDestinationNotes}
                        >
                          <i className="fa-regular fa-note-sticky"></i>
                        </button>
                        <span
                          className="absolute -top-6 right-0 p-1 text-xs text-white bg-gray-700 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none"
                          id="noteTooltip"
                        >
                          Notes
                        </span>
                      </div>
                    </div>

                    <div
                      id="notePopup"
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isDestinationNoteOpen
                          ? 'max-h-40 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                      style={{
                        transitionProperty: 'max-height, opacity',
                        marginTop: isDestinationNoteOpen ? '0.5rem' : '0',
                      }}
                    >
                      <div
                        className="p-4 border rounded-lg bg-white shadow-lg transition-opacity duration-300 ease-in-out"
                        style={{
                          opacity: isDestinationNoteOpen ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                      >
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="noteInput"
                        >
                          Enter Note
                        </label>
                        <textarea
                          style={{ resize: 'none' }}
                          id="noteInput"
                          className="w-full p-2 border rounded-lg outline-none shadow-3 focus:shadow-yellow-500"
                          rows={3}
                          placeholder="Enter your note here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Via Points */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="my-3">
                      <button
                        onClick={toggleModal}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Via Points ({tempViaPoints.length})
                      </button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                      <div
                        id="viaPointsModal"
                        className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                      >
                        <div className="relative p-4 w-full max-w-xl">
                          <div className="bg-black rounded-lg shadow-lg dark:bg-gray-700 px-4">
                            {/* Modal header */}
                            <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add Via Points
                              </h3>
                              <button
                                onClick={toggleModal}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                <svg
                                  className="w-3 h-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                                <span className="sr-only">Close modal</span>
                              </button>
                            </div>

                            {/* Modal body */}
                            <div className="p-4">
                              <div className="flex justify-end">
                                <button
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full"
                                  onClick={addViaPoint}
                                  disabled={tempViaPoints.length >= 5}
                                >
                                  + Add Via Point
                                </button>
                              </div>
                              {tempViaPoints.map((point, index) => (
                                <div key={index} className="relative my-4">
                                  <input
                                    type="text"
                                    value={point}
                                    onChange={(e) =>
                                      handleViaPointChange(
                                        index,
                                        e.target.value,
                                      )
                                    }
                                    className="shadow-3 focus:shadow-yellow-500 outline-none appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                                    placeholder={`Enter Via Point ${index + 1}`}
                                  />
                                  <button
                                    className="absolute inset-y-0 right-0 flex items-center pl-3.5 text-2xl text-white bg-red-500 hover:bg-red-600 w-12"
                                    onClick={() => removeTempViaPoint(index)}
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Trip Type
                    </label>
                    <div className="flex items-center space-x-4 px-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="tripType"
                          value="oneWay"
                          style={{ transform: 'scale(1.5)' }}
                        />
                        <span className="ml-3">One Way</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="tripType"
                          value="return"
                          style={{ transform: 'scale(1.5)' }}
                        />
                        <span className="ml-3">Return</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio"
                          name="tripType"
                          value="wr"
                          style={{ transform: 'scale(1.5)' }}
                        />
                        <span className="ml-3">W/R</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Section */}
              <div className="flex flex-col gap-2 shadow-3 shadow-yellow-500 rounded-lg p-5 mb-3">
                <h1 className="text-2xl font-bold mb-4">Vehicle Details</h1>
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <div className="rounded-lg">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="multipleVehicles"
                      >
                        Select Multiple Vehicles
                      </label>
                      <div className="relative">
                        <select
                          id="multipleVehicles"
                          className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg shadow-3 focus:shadow-yellow-500 block w-full p-2.5"
                        >
                          <option value="" disabled>
                            Select Multiple vehicles
                          </option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Truck">Truck</option>
                          <option value="Van">Van</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="passengers"
                        className="text-gray-700 text-sm font-bold"
                      >
                        Passengers
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="passengers"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                        placeholder="Passengers"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="luggage"
                        className="text-gray-700 text-sm font-bold"
                      >
                        Luggage
                      </label>
                      <input
                        type="number"
                        id="luggage"
                        min="1"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="Luggage"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="hlugguge"
                        className="text-gray-700 text-sm font-bold"
                      >
                        H. Luggage
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="hlugguge"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="Hand Luggage"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="allocateDriver"
                      >
                        Allocate Driver
                      </label>
                      <select
                        id="allocateDriver"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none shadow-3 focus:shadow-yellow-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option selected>Choose a driver</option>
                        <option value="Driver1">Driver 1</option>
                        <option value="Driver2">Driver 2</option>
                        <option value="Driver3">Driver 3</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="companyAccount"
                      >
                        Company Account
                      </label>
                      <select
                        id="companyAccount"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none shadow-3 focus:shadow-yellow-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option selected>Choose a company</option>
                        <option value="Driver1">Company 1</option>
                        <option value="Company2">Company 2</option>
                        <option value="Company3">Company 3</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg">
                    {/* 1st Row: Lead Time Input */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        style={{ transform: 'scale(1.5)' }}
                        id="leadTime"
                        className="mr-2"
                        checked={isLeadChecked}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor="leadTime"
                        className="block text-gray-700 text-sm font-bold mr-4"
                      >
                        Lead
                      </label>
                      <input
                        type="number"
                        id="leadTime"
                        min="1"
                        disabled={!isLeadChecked}
                        placeholder="Lead time"
                        className="shadow appearance-none border rounded w-20 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <span className="ml-2 text-gray-700">mins</span>
                    </div>

                    <div className="flex items-center my-6">
                      <input
                        type="checkbox"
                        style={{ transform: 'scale(1.5)' }}
                        id="autoDispatch"
                        className="mr-2"
                      />
                      <label
                        htmlFor="autoDispatch"
                        className="block text-gray-700 text-sm font-bold"
                      >
                        Auto Dispatch
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        style={{ transform: 'scale(1.5)' }}
                        id="bidding"
                        className="mr-2"
                      />
                      <label
                        htmlFor="bidding"
                        className="block text-gray-700 text-sm font-bold"
                      >
                        Bidding
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Section */}
              <div className="flex flex-col gap-2 shadow-3 shadow-yellow-500 rounded-lg p-5 mb-3">
                <h1 className="text-2xl font-bold mb-4">Fares Details</h1>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fares"
                      >
                        Fares &#163;
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="fares"
                        className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                        placeholder="Fares"
                      />
                    </div>
                    <div className="">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="companyPrice"
                      >
                        Company Price &#163;
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="companyPrice"
                        className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                        placeholder="Company Price"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="acParkCharge"
                        className="text-gray-700 text-sm font-bold"
                      >
                        A/C Parking Charges
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="acParkCharge"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="A/C Parking Charges"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="A/CWaitingCharges"
                        className="text-gray-700 text-sm font-bold"
                      >
                        A/C Waiting Charges
                      </label>
                      <input
                        type="number"
                        id="A/CWaitingCharges"
                        min="1"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="A/C Waiting Charges"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="drvParkCharge"
                      >
                        DRV Parking Charges &#163;
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="drvParkCharge"
                        className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                        placeholder="DRV Parking Charges"
                      />
                    </div>
                    <div className="">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="w/t"
                      >
                        W/T &#163;
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="w/t"
                        className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                        placeholder="W/T"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="dRVWaitingCharges"
                        className="text-gray-700 text-sm font-bold"
                      >
                        DRV Waiting Charges &#163;
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="dRVWaitingCharges"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="DRV Waiting Charges"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="extraCharges"
                        className="text-gray-700 text-sm font-bold"
                      >
                        Extra Charges &#163;
                      </label>
                      <input
                        type="number"
                        id="extraCharges"
                        min="1"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="Extra Charges"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="dRVWaitingCharges"
                        className="text-gray-700 text-sm font-bold"
                      >
                        Total Charges &#163;
                      </label>
                      <input
                        type="number"
                        min="1"
                        id="dRVWaitingCharges"
                        className="border rounded-lg px-3 py-2 text-gray-700 shadow-3 focus:shadow-yellow-500 outline-none"
                        placeholder="Total Charges"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* User's Details Section */}
              <div className="flex flex-col gap-2 shadow-3 shadow-yellow-500 rounded-lg p-5 mb-3">
                <h1 className="text-2xl font-bold mb-4">User's Details</h1>
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      min="1"
                      id="name"
                      className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telNo"
                    >
                      Telephone Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      id="telNo"
                      className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                      placeholder="Telephone Number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="mob"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      min="1"
                      id="mob"
                      className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                      placeholder="Mobile Number"
                    />
                  </div>
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      type="number"
                      min="1"
                      id="email"
                      className="border w-full rounded-lg px-3 py-2 text-gray-700 shadow focus:shadow-yellow-500 outline-none"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Section */}
            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-0 h-[430px]">
                <div
                  id="googleMap"
                  style={{ width: '100%', height: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
