import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useAddBookingMutation } from '../../redux/usersData/booking';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGetDriverDetailsQuery } from '../../redux/usersData/driverDetails';
interface Vehicle {
  _id: string;
  name: string;
  passengers: number;
  suit_cases: number;
  hand_bags: number;
  image: string | null;
  status: string;
  fleetType: string;
  fleetValue: string;
  default: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface FormData {
  pickupStatus: string;
  date: string;
  time: string;
  address: string;
  flightNumber: string;
  comingFrom: string;
  viaPoint1: string;
  viaPoint2: string;
  viaPoint3: string;
  viaPoint4: string;
  viaPoint5: string;
  destination: string;
  instructions: string;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  account: string;
  pin: string;
  vehicleType: string;
  passengers: string | number;
  luggage: string | number;
  handLuggage: string | number;
  driver: string;
  isLeadChecked: boolean;
  leadTime: string;
  autoDispatch: boolean;
  bidding: boolean;
  trip: string;
  tripDate: string;
  tripTime: string;
  quotation: boolean;
  rideCharges: number;
  accountCharges: number;
  pickupCharges: number;
  dropOffCharges: number;
  drvWaitingCharges: number;
  drvParkingCharges: number;
  extraCharges: number;
  totalCharges: number;
  paymentType: string;
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  };
  specialRequirements: string;
}

export default function AddBooking() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const [addBooking] = useAddBookingMutation();
  const [driverData, setDriverData] = useState([]);

  const { data: allDriverData } = useGetDriverDetailsQuery(undefined);

  const [totalCharges, setTotalCharges] = useState(0);

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

  const [isPickup, setIsPickup] = useState<boolean>(false);
  const [isDestinationFilled, setIsDestinationFilled] =
    useState<boolean>(false);
  const [isAirPort, setIsAirPort] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | null>('one way');

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [viaPoint1, setViaPoint1] = useState<string>('');
  const [viaPoint2, setViaPoint2] = useState<string>('');
  const [viaPoint3, setViaPoint3] = useState<string>('');
  const [viaPoint4, setViaPoint4] = useState<string>('');
  const [viaPoint5, setViaPoint5] = useState<string>('');

  const viaPoint1Ref = useRef<HTMLInputElement | null>(null);
  const viaPoint2Ref = useRef<HTMLInputElement | null>(null);
  const viaPoint3Ref = useRef<HTMLInputElement | null>(null);
  const viaPoint4Ref = useRef<HTMLInputElement | null>(null);
  const viaPoint5Ref = useRef<HTMLInputElement | null>(null);

  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [totalDistance, setTotalDistance] = useState<number>(0);

  const [postCodePickPoint, setPostCodePickPoint] = useState<string>('');
  const [dataPickPointFare, setDataPickPointFare] = useState<string>('');
  const [postCodeDestPoint, setPostCodeDestPoint] = useState<string>('');
  const [dataDestPointFare, setDataDestPointFare] = useState<string>('');
  const [dataFare, setDataFare] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    pickupStatus: 'ASAP',
    date: '',
    time: '',
    address: '',
    flightNumber: '',
    comingFrom: '',
    viaPoint1: '',
    viaPoint2: '',
    viaPoint3: '',
    viaPoint4: '',
    viaPoint5: '',
    destination: '',
    instructions: '',
    name: '',
    email: '',
    phone: '',
    mobile: '',
    account: '',
    pin: '',
    vehicleType: '',
    passengers: '',
    luggage: '',
    handLuggage: '',
    driver: '',
    isLeadChecked: false,
    leadTime: '',
    autoDispatch: false,
    bidding: false,
    trip: '',
    tripDate: '',
    tripTime: '',
    quotation: false,
    rideCharges: 0,
    accountCharges: 0,
    pickupCharges: 0,
    dropOffCharges: 0,
    drvWaitingCharges: 0,
    drvParkingCharges: 0,
    extraCharges: 0,
    totalCharges: 0,
    paymentType: '',
    cardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
    specialRequirements: '',
  });

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Driver 1', location: { lat: 51.6553, lng: -0.396 } }, // Watford
    { id: 2, name: 'Driver 2', location: { lat: 51.7729, lng: 0.1023 } }, // Harlow
    { id: 3, name: 'Driver 3', location: { lat: 51.4462, lng: 0.2169 } }, // Dartford
    { id: 4, name: 'Driver 4', location: { lat: 51.3305, lng: -0.2701 } }, // Epsom
    { id: 5, name: 'Driver 5', location: { lat: 51.5095, lng: -0.5954 } }, // Slough
  ]);

  useEffect(() => {
    if (allDriverData) {
      setDriverData(allDriverData);
    }
  }, [allDriverData]);

  useEffect(() => {
    axios
      .get(
        'https://hoponcar-production.up.railway.app/api/v1/vehicles/getactivevehicle',
      )
      .then((response) => {
        const vehicles = response.data.vehicles;
        let updatedRideCharges = formData.rideCharges;
        vehicles.forEach((vehicle: any) => {
          if (vehicle.fleetType === 'Percentage') {
            updatedRideCharges *= vehicle.fleetValue;
          }
        });
        setFormData((prev) => ({
          ...prev,
          rideCharges: updatedRideCharges,
        }));
        setAllVehicles(vehicles);
      })
      .catch(() => console.error('Error fetching vehicles:'));
  }, []);

  const fixPostCodeAPI = (pickup: any, destination: any, hour: any) => {
    return axios
      .get(
        `https://hoponcar-production.up.railway.app/api/v1/updatefix/postcodefair?pickuppostcode=${pickup}&destinationpostcode=${destination}&hour_value=${hour}`,
      )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const handleVehicleChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!formData.time) {
      toast.error('Time is required');
      return;
    }
    const selectedVehicleName = event.target.value;
    const vehicle = allVehicles.find((v) => v.name === selectedVehicleName);

    const hours = parseInt(formData.time.split(':')[0], 10);

    if (vehicle) {
      setSelectedVehicle(vehicle);

      setFormData({
        ...formData,
        passengers: vehicle.passengers || '',
        luggage: vehicle.suit_cases || '',
        handLuggage: vehicle.hand_bags || '',
      });

      const fixPostCodeData = await fixPostCodeAPI(
        postCodePickPoint,
        postCodeDestPoint,
        hours,
      );

      if (fixPostCodeData.status === 200) {
        const fareValue = parseFloat(fixPostCodeData.data.fare_price);
        setFormData((prevFormData) => ({
          ...prevFormData,
          rideCharges: fareValue,
          totalCharges:
            fareValue +
            prevFormData.accountCharges +
            prevFormData.pickupCharges +
            prevFormData.dropOffCharges +
            prevFormData.drvWaitingCharges +
            prevFormData.drvParkingCharges +
            prevFormData.extraCharges,
        }));
      } else {
        axios
          .get(
            `https://hoponcar-production.up.railway.app/api/v1/fair/ratemiles?miles=${totalDistance}&hours_value=${hours}`,
          )
          .then((response) => {
            setDataFare(response.data || 0);
            const resDataFare = response.data;
            let fareValue = 0;
            if (vehicle.fleetType == 'Percentage') {
              fareValue =
                parseFloat(resDataFare.hour_rate) *
                  totalDistance *
                  parseFloat(vehicle.fleetValue) +
                parseFloat(resDataFare.initial_base_rate);
              setFormData((prevFormData) => ({
                ...prevFormData,
                rideCharges: fareValue,
                totalCharges:
                  fareValue +
                  prevFormData.accountCharges +
                  prevFormData.pickupCharges +
                  prevFormData.dropOffCharges +
                  prevFormData.drvWaitingCharges +
                  prevFormData.drvParkingCharges +
                  prevFormData.extraCharges,
              }));
            } else {
              fareValue =
                parseFloat(resDataFare.hour_rate) * totalDistance +
                parseFloat(resDataFare.initial_base_rate);
              setFormData((prevFormData) => ({
                ...prevFormData,
                rideCharges: fareValue,
                totalCharges:
                  fareValue +
                  prevFormData.accountCharges +
                  prevFormData.pickupCharges +
                  prevFormData.dropOffCharges +
                  prevFormData.drvWaitingCharges +
                  prevFormData.drvParkingCharges +
                  prevFormData.extraCharges,
              }));
            }
          })
          .catch(() => console.error('Error fetching fares:'));
      }
    } else {
      setSelectedVehicle(null);
    }
  };

  const handleCombinedFun = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    handleIsPickup();
    handleInputChange(e);
  };

  const handleCombinedFun1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    handleIsDestinationFilled();
    handleInputChange(e);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'tripDate' || name === 'tripTime') {
      console.log('ab');
    }

    if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else if (type === 'radio') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleViaPointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    switch (name) {
      case 'viaPoint1':
        setViaPoint1(value);
        break;
      case 'viaPoint2':
        setViaPoint2(value);
        break;
      case 'viaPoint3':
        setViaPoint3(value);
        break;
      case 'viaPoint4':
        setViaPoint4(value);
        break;
      case 'viaPoint5':
        setViaPoint5(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const totalPrice =
      Number(formData.rideCharges) +
      Number(formData.accountCharges) +
      Number(formData.pickupCharges) +
      Number(formData.dropOffCharges) +
      Number(formData.drvWaitingCharges) +
      Number(formData.drvParkingCharges) +
      Number(formData.extraCharges);
    setTotalCharges(totalPrice);
  }, [
    formData.rideCharges,
    formData.accountCharges,
    formData.pickupCharges,
    formData.dropOffCharges,
    formData.drvWaitingCharges,
    formData.drvParkingCharges,
    formData.extraCharges,
  ]);

  const handleAddBooking = async (e: any) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 3000);
    const newBooking = {
      booking_status: formData.pickupStatus,
      booking_date: formData.date,
      booking_hour: formData.time,
      booking_address: formData.address,
      flight_number: formData.flightNumber,
      coming_from: formData.comingFrom,
      booking_destination: formData.destination,
      booking_via: [
        formData.viaPoint1,
        formData.viaPoint2,
        formData.viaPoint3,
        formData.viaPoint4,
        formData.viaPoint5,
      ],
      booking_instruction: formData.instructions,
      client_info: {
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        client_mobile: formData.mobile,
        client_acc: formData.account,
        client_pin: formData.pin,
      },
      vehicle_info: {
        vehicles: selectedVehicle?._id.toLowerCase(),
        booking_passanger: formData.passengers,
        booking_luggages: formData.luggage,
        booking_hand_luggages: formData.handLuggage,
        booking_payment: formData.paymentType,
        card_number: parseInt(formData.cardDetails.cardNumber),
        card_mm_yy: parseInt(formData.cardDetails.expiryDate),
        card_cvc: parseInt(formData.cardDetails.cvc),
        booking_special_requirement: formData.specialRequirements,
      },
      driver: formData.driver,
      lead: formData.isLeadChecked,
      lead_number: formData.leadTime,
      auto_dispatch: formData.autoDispatch,
      bidding: formData.bidding,
      booking_route: formData.trip,
      booking_ride_charges: {
        ride_charges: formData.rideCharges,
        account_charges: formData.accountCharges,
        pickup_charges: formData.pickupCharges,
        dropoff_charges: formData.dropOffCharges,
        drv_waiting: formData.drvWaitingCharges,
        drv_parking: formData.drvParkingCharges,
        extra_charges: formData.extraCharges,
        total_amount: totalCharges,
      },
    };

    try {
      const result = await addBooking(newBooking).unwrap();
      const successMsg = toast(result.message);
      if (successMsg) {
        setTimeout(() => {
          navigate('/booking');
        }, 3000);
      }
    } catch (error) {
      toast('Internal Server Error');
    }
  };

  const viaPointMarkersRefs = [
    useRef<google.maps.Marker | null>(null),
    useRef<google.maps.Marker | null>(null),
    useRef<google.maps.Marker | null>(null),
    useRef<google.maps.Marker | null>(null),
    useRef<google.maps.Marker | null>(null),
  ];

  const initializeAutocomplete = (
    inputRef: React.RefObject<HTMLInputElement>,
    markerRef: React.RefObject<google.maps.Marker | null>,
    markerIconUrl: string,
    onPlaceChanged: () => void,
  ) => {
    if (window.google && window.google.maps && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { componentRestrictions: { country: 'uk' } },
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (place && place.address_components) {
          const postcodeComponent = place.address_components.find(
            (component: any) => component.types.includes('postal_code'),
          );

          if (postcodeComponent) {
            if (inputRef === pickupLocationRef) {
              setPostCodePickPoint(postcodeComponent.long_name);
            } else if (inputRef === destinationLocationRef) {
              setPostCodeDestPoint(postcodeComponent.long_name);
            }
          } else {
            console.log('Postcode not found');
          }
        }

        if (place && place.formatted_address) {
          if (inputRef === pickupLocationRef) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              address: place.formatted_address,
            }));
            if (place.types && place.types.includes('airport')) {
              setIsAirPort(true);
            } else {
              setIsAirPort(false);
            }
          } else if (inputRef === destinationLocationRef) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              destination: place.formatted_address,
            }));
          }
        }

        if (place.geometry) {
          const location = place.geometry.location;
          mapRef.current?.setCenter(location);
          mapRef.current?.setZoom(14);

          if (markerRef.current) {
            markerRef.current.setPosition(location);
          } else {
            markerRef.current = new google.maps.Marker({
              position: location,
              map: mapRef.current,
              icon: markerIconUrl,
            });
          }
          markerRef.current.setMap(mapRef.current);

          onPlaceChanged();
        }
      });
    }
  };

  const initializeViaPointAutocomplete = (
    inputRef: React.RefObject<HTMLInputElement>,
    markerRef: React.RefObject<google.maps.Marker | null>,
  ) => {
    if (window.google && window.google.maps && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { componentRestrictions: { country: 'uk' } },
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (place && place.formatted_address) {
          setFormData((prevFormData) => {
            const fieldName = inputRef.current!.name;
            return {
              ...prevFormData,
              [fieldName]: place.formatted_address,
            };
          });

          switch (inputRef.current!.name) {
            case 'viaPoint1':
              setViaPoint1(place.formatted_address);
              break;
            case 'viaPoint2':
              setViaPoint2(place.formatted_address);
              break;
            case 'viaPoint3':
              setViaPoint3(place.formatted_address);
              break;
            case 'viaPoint4':
              setViaPoint4(place.formatted_address);
              break;
            case 'viaPoint5':
              setViaPoint5(place.formatted_address);
              break;
            default:
              break;
          }
        }

        if (place.geometry) {
          const location = place.geometry.location;
          if (markerRef.current) {
            markerRef.current.setPosition(location);
          } else {
            markerRef.current = new google.maps.Marker({
              position: location,
              map: mapRef.current,
            });
          }
          markerRef.current.setMap(mapRef.current);
        }
        calculateRoute();
      });
    }
  };

  const calculateRoute = () => {
    if (
      pickupMarkerRef.current &&
      destinationMarkerRef.current &&
      directionsServiceRef.current &&
      directionsRendererRef.current &&
      mapRef.current
    ) {
      const pickupLocation = pickupMarkerRef.current.getPosition();
      const destinationLocation = destinationMarkerRef.current.getPosition();

      if (pickupLocation && destinationLocation) {
        const geocoder = new google.maps.Geocoder();
        const waypoints = [
          viaPoint1,
          viaPoint2,
          viaPoint3,
          viaPoint4,
          viaPoint5,
        ].filter((point) => point.trim() !== '');

        const waypointPromises = waypoints.map(
          (point) =>
            new Promise<google.maps.DirectionsWaypoint>((resolve) => {
              geocoder.geocode({ address: point }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                  resolve({
                    location: results[0].geometry.location,
                    stopover: true,
                  });
                } else {
                  resolve(null);
                }
              });
            }),
        );

        Promise.all(waypointPromises).then((resolvedWaypoints) => {
          const validWaypoints = resolvedWaypoints.filter(
            (waypoint) => waypoint !== null,
          ) as google.maps.DirectionsWaypoint[];

          const request: google.maps.DirectionsRequest = {
            origin: pickupLocation,
            destination: destinationLocation,
            waypoints: validWaypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false,
          };

          directionsServiceRef.current.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              directionsRendererRef.current.setDirections(result);

              const bounds = new google.maps.LatLngBounds();
              let totalDistance = 0;
              result.routes[0].legs.forEach((leg) => {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
                totalDistance += leg.distance?.value || 0;
              });
              setTotalDistance((totalDistance / 1000).toFixed(2));
              mapRef.current?.fitBounds(bounds);
            } else {
              console.error('Directions request failed due to ', status);
            }
          });
        });
      }
    }
  };

  useEffect(() => {
    const initMap = () => {
      const mapOptions: google.maps.MapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(51.509865, -0.118092),
      };

      mapRef.current = new google.maps.Map(
        document.getElementById('googleMap') as HTMLElement,
        mapOptions,
      );

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#0000FF',
          strokeOpacity: 1.0,
          strokeWeight: 5,
        },
      });
      directionsRendererRef.current.setMap(mapRef.current);
      initializeAutocomplete(
        pickupLocationRef,
        pickupMarkerRef,
        'blue',
        calculateRoute,
      );
      initializeAutocomplete(
        destinationLocationRef,
        destinationMarkerRef,
        'red',
        calculateRoute,
      );
      drivers.forEach((driver) => {
        const marker = new google.maps.Marker({
          position: driver.location,
          map: mapRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
            scaledSize: new google.maps.Size(40, 40),
          },
          title: driver.name,
        });

        marker.setMap(mapRef.current);
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    }
  }, []);

  useEffect(() => {
    [
      { ref: viaPoint1Ref, markerRef: viaPointMarkersRefs[0] },
      { ref: viaPoint2Ref, markerRef: viaPointMarkersRefs[1] },
      { ref: viaPoint3Ref, markerRef: viaPointMarkersRefs[2] },
      { ref: viaPoint4Ref, markerRef: viaPointMarkersRefs[3] },
      { ref: viaPoint5Ref, markerRef: viaPointMarkersRefs[4] },
    ].forEach(({ ref, markerRef }) =>
      initializeViaPointAutocomplete(ref, markerRef),
    );
  }, [viaPoint1, viaPoint2, viaPoint3, viaPoint4, viaPoint5]);

  if (
    viaPoint1Ref.current?.value ||
    viaPoint2Ref.current?.value ||
    viaPoint3Ref.current?.value ||
    viaPoint4Ref.current?.value ||
    viaPoint5Ref.current?.value
  ) {
    calculateRoute();
  }

  useEffect(() => {
    if (formData.pickupStatus === 'ASAP') {
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      const formattedTime = now.toTimeString().split(' ')[0].slice(0, 5);
      setFormData((prevFormData) => ({
        ...prevFormData,
        date: formattedDate,
        time: formattedTime,
      }));
    }
  }, [formData.pickupStatus]);

  useEffect(() => {
    axios
      .post(
        'https://hoponcar-production.up.railway.app/api/v1/pickdrop/getsingle',
        { code: postCodePickPoint },
      )
      .then((response: any) => {
        const pickupCharge = response.data?.pickupcharges || 0;
        setDataPickPointFare(response.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          pickupCharges: pickupCharge,
        }));
      })
      .catch((error: any) => {
        console.error('Error fetching pickup charges:', error);
      });
    axios
      .post(
        'https://hoponcar-production.up.railway.app/api/v1/pickdrop/getsingle',
        { code: postCodeDestPoint },
      )
      .then((response: any) => {
        const dropOffCharge = response.data?.dropoffcharges || 0;
        setDataDestPointFare(response.data || 0);
        setFormData((prevFormData) => ({
          ...prevFormData,
          dropOffCharges: dropOffCharge,
        }));
      })
      .catch((error: any) => {
        console.error('Error fetching drop off charges:', error);
      });
  }, [postCodePickPoint, postCodeDestPoint]);

  const handleIsPickup = () => setIsPickup(!!pickupLocationRef.current?.value);

  const handleIsDestinationFilled = () => {
    if (
      destinationLocationRef.current &&
      destinationLocationRef.current.value.trim() !== ''
    ) {
      setIsDestinationFilled(true);
    } else {
      setIsDestinationFilled(false);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handlePayment = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentType: value,
    }));
  };

  const handleCardDetailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      cardDetails: {
        ...prevFormData.cardDetails,
        [name]: value,
      },
    }));
  };

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      trip: value,
    }));
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-lg border border-stroke bg-white px-5 py-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleAddBooking}>
          <div
            style={{
              display: 'flex',
              marginBottom: 20,
              justifyContent: 'end',
              gap: '10px',
            }}
          >
            <button
              className={`py-2 px-2 ${
                isClicked ? 'bg-blue-700' : 'bg-blue-500'
              } text-white rounded hover:bg-blue-700 transition-all`}
              type="submit"
              disabled={isClicked}
            >
              Save Booking
            </button>
            <button className="py-2 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">
              Update Booking
            </button>
          </div>
          <div className="max-w-full">
            <div className="grid grid-cols-12 gap-4">
              {/* Left Side */}

              <div className="col-span-12 lg:col-span-5">
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-1">DATE:</label>
                    <div className="col-span-11 flex gap-2">
                      <select
                        className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 p-2"
                        value={formData.pickupStatus}
                        name="pickupStatus"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Pickup Status
                        </option>
                        <option value="ASAP">ASAP</option>
                        <option value="Future">Future</option>
                      </select>
                      <div className="block w-full bg-white border border-gray-300 text-gray-900 p-2">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          disabled={formData.pickupStatus === 'ASAP'}
                        />
                      </div>
                      <div className="relative w-full">
                        <input
                          type="time"
                          className="w-full bg-white border border-gray-300 text-gray-900 p-2.5"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          disabled={formData.pickupStatus === 'ASAP'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-1">ADDR:</label>
                    <input
                      type="text"
                      name="address"
                      ref={pickupLocationRef}
                      value={formData.address}
                      onChange={handleCombinedFun}
                      className={`border p-2 ${
                        isAirPort ? 'col-span-5' : 'col-span-11'
                      }`}
                      placeholder="Address Location"
                      required
                    />
                    {isAirPort ? (
                      <>
                        <input
                          type="text"
                          className={`border p-2 ${
                            isAirPort ? 'col-span-3' : ''
                          }`}
                          name="flightNumber"
                          value={formData.flightNumber}
                          onChange={handleInputChange}
                          placeholder="Flight Number"
                          required={isAirPort ? false : true}
                        />
                        <input
                          type="text"
                          className={`border p-2 ${
                            isAirPort ? 'col-span-3' : ''
                          }`}
                          name="comingFrom"
                          value={formData.comingFrom}
                          onChange={handleInputChange}
                          placeholder="Coming From"
                          required={isAirPort ? false : true}
                        />
                      </>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-1">DEST:</label>
                    <input
                      type="text"
                      name="destination"
                      ref={destinationLocationRef}
                      disabled={!isPickup}
                      value={formData.destination}
                      onChange={handleCombinedFun1}
                      className="border p-2 col-span-9"
                      placeholder="Destination Location"
                      required
                    />
                    <button
                      className={`border p-2 text-white hover:cursor-pointer font-bold col-span-2 ${
                        isPickup && isDestinationFilled
                          ? 'bg-blue-500 hover:bg-blue-600 border-blue-500'
                          : 'bg-bodydark2 hover:bg-gray-600 border-bodydark2'
                      }`}
                      onClick={toggleModal}
                      disabled={!isPickup || !isDestinationFilled}
                    >
                      + VIA
                    </button>
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
                              <div className="relative my-2">
                                <input
                                  type="text"
                                  ref={viaPoint1Ref}
                                  onChange={handleViaPointChange}
                                  value={viaPoint1}
                                  name="viaPoint1"
                                  className="w-full py-2 px-3 text-gray-700 leading-tight"
                                  placeholder="Enter Via Point 1"
                                />
                                <input
                                  type="text"
                                  ref={viaPoint2Ref}
                                  onChange={handleViaPointChange}
                                  value={viaPoint2}
                                  name="viaPoint2"
                                  className="w-full py-2 px-3 my-2 text-gray-700 leading-tight"
                                  placeholder="Enter Via Point 2"
                                />
                                <input
                                  type="text"
                                  ref={viaPoint3Ref}
                                  onChange={handleViaPointChange}
                                  value={viaPoint3}
                                  name="viaPoint3"
                                  className="w-full py-2 px-3 text-gray-700 leading-tight"
                                  placeholder="Enter Via Point 3"
                                />
                                <input
                                  type="text"
                                  ref={viaPoint4Ref}
                                  onChange={handleViaPointChange}
                                  value={viaPoint4}
                                  name="viaPoint4"
                                  className="w-full py-2 px-3 my-2 text-gray-700 leading-tight"
                                  placeholder="Enter Via Point 4"
                                />
                                <input
                                  type="text"
                                  ref={viaPoint5Ref}
                                  onChange={handleViaPointChange}
                                  value={viaPoint5}
                                  name="viaPoint5"
                                  className="w-full py-2 px-3 text-gray-700 leading-tight"
                                  placeholder="Enter Via Point 5"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-5 grid grid-cols-12 items-center gap-2">
                    <label className="col-span-1">INST:</label>
                    <input
                      type="text"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      className="border p-2 col-span-11"
                      placeholder="Instructions About Location"
                      required
                    />
                  </div>

                  <div className="col-span-5 grid grid-cols-12 items-center gap-2">
                    <label className="col-span-1">NAME:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border p-2 col-span-6"
                      placeholder="NAME"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border p-2 col-span-5"
                      placeholder="EMAIL"
                      required
                    />
                  </div>

                  <div className="col-span-5 grid grid-cols-12 items-center gap-2">
                    <label className="col-span-1">PH:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border p-2 col-span-7"
                      placeholder="PHONE"
                      required
                    />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="border p-2 col-span-4"
                      placeholder="MOBILE"
                      required
                    />
                  </div>

                  <div className="col-span-5 grid grid-cols-12 items-center gap-2">
                    <label className="col-span-1">ACC:</label>
                    <input
                      type="text"
                      name="account"
                      value={formData.account}
                      onChange={handleInputChange}
                      className="border p-2 col-span-8"
                      placeholder="Account"
                      required
                    />
                    <input
                      type="text"
                      value={formData.pin}
                      name="pin"
                      onChange={handleInputChange}
                      className="border p-2 col-span-3"
                      placeholder="PIN"
                      required
                    />
                  </div>

                  <div className="col-span-5 grid grid-cols-12 items-center gap-2">
                    <label className="col-span-1">#PPL:</label>
                    <select
                      onChange={handleVehicleChange}
                      value={selectedVehicle?.name || ''}
                      className="border border-gray-300 text-gray-900 col-span-3 p-2.5"
                    >
                      <option value="" disabled>
                        Vehicles
                      </option>
                      {allVehicles.map((vehicle, index) => (
                        <option key={index} value={vehicle.name}>
                          {vehicle.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleInputChange}
                      className="border p-2 col-span-3"
                      placeholder="Passengers"
                      min="1"
                      required
                    />

                    <input
                      type="number"
                      name="luggage"
                      value={formData.luggage}
                      onChange={handleInputChange}
                      className="border p-2 col-span-3"
                      placeholder="Luggage"
                      min="1"
                      required
                    />

                    <input
                      type="number"
                      name="handLuggage"
                      value={formData.handLuggage}
                      onChange={handleInputChange}
                      className="border p-2 col-span-2"
                      placeholder="H.Luggage"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Center Section */}
              <div className="col-span-12 lg:col-span-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 flex gap-2 items-center">
                    <label className="">Driver:</label>
                    <select
                      className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 p-2"
                      name="driver"
                      value={formData.driver}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select a Driver
                      </option>
                      {driverData.length > 0 &&
                        driverData.map((driver, index) => (
                          <option
                            key={index}
                            value={driver.driver_details?.driver_name}
                          >
                            {driver.driver_details?.driver_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="border w-[100%]  p-2 px-3 col-span-12">
                    <div className="col-span-12 flex gap-2 items-center mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          style={{ transform: 'scale(1.5)' }}
                          id="leadTime"
                          name="isLeadChecked"
                          checked={formData.isLeadChecked}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          htmlFor="leadTime"
                          className="block text-gray-700 text-sm font-bold"
                        >
                          Lead
                        </label>
                      </div>
                      <div className="">
                        <input
                          type="number"
                          id="leadTimeInput"
                          name="leadTime"
                          min="1"
                          disabled={!formData.isLeadChecked}
                          value={formData.leadTime}
                          required={formData.isLeadChecked ? true : false}
                          onChange={handleInputChange}
                          placeholder="Lead time"
                          className="shadow appearance-none border w-30 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <span className="text-gray-700 col-span-2">mins</span>
                    </div>

                    <div className="col-span-12 flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="autoDispatch"
                        checked={formData.autoDispatch || false}
                        onChange={handleInputChange}
                        style={{ transform: 'scale(1.5)' }}
                        id="autoDispatch"
                        className="w-max"
                      />
                      <label
                        htmlFor="autoDispatch"
                        className="text-gray-700 text-sm font-bold"
                      >
                        Auto Dispatch
                      </label>
                    </div>

                    <div className="col-span-12 flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="bidding"
                        checked={formData.bidding || false}
                        onChange={handleInputChange}
                        style={{ transform: 'scale(1.5)' }}
                        id="bidding"
                        className=""
                      />
                      <label
                        htmlFor="bidding"
                        className="block text-gray-700 text-sm font-bold"
                      >
                        Bidding
                      </label>
                    </div>
                    <div className="col-span-12 flex items-center gap-2">
                      <input
                        type="checkbox"
                        style={{ transform: 'scale(1.5)' }}
                        id="quotation"
                        name="quotation"
                        checked={formData.quotation || false}
                        onChange={handleInputChange}
                      />

                      <label
                        htmlFor="quotation"
                        className="block text-gray-700 text-sm font-bold"
                      >
                        Quotation
                      </label>
                    </div>
                  </div>

                  <div className="border p-2 mt-1.5 col-span-12 flex gap-2 items-center space-x-16">
                    <div>
                      <input
                        style={{ transform: 'scale(1.5)' }}
                        type="radio"
                        name="trip"
                        value="one way"
                        id="one_way"
                        checked={selectedValue === 'one way'}
                        onChange={() => handleRadioChange('one way')}
                      />
                      <label htmlFor="one_way" className="ml-2">
                        On Way
                      </label>
                    </div>
                    <div>
                      <input
                        style={{ transform: 'scale(1.5)' }}
                        type="radio"
                        name="trip"
                        value="return"
                        id="return"
                        checked={selectedValue === 'return'}
                        onChange={() => handleRadioChange('return')}
                      />
                      <label htmlFor="return" className="ml-2">
                        Return
                      </label>
                    </div>
                  </div>

                  {formData && formData.trip === 'return' ? (
                    <>
                      <div className="mt-1 col-span-12 flex gap-2 items-center">
                        <div className="block w-full bg-white border border-gray-300 text-gray-900 p-2">
                          <input
                            type="date"
                            name="tripDate"
                            value={formData.tripDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="relative w-full">
                          <input
                            type="time"
                            className="w-full bg-white border border-gray-300 text-gray-900 p-2.5"
                            name="tripTime"
                            value={formData.tripTime}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}

                  <div className="col-span-12 mt-2">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <input
                        type="number"
                        name="rideCharges"
                        className="border p-2 w-full"
                        placeholder="Ride Charges"
                        min="1"
                        value={formData.rideCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="accountCharges"
                        className="border p-2 w-full"
                        placeholder="Account Charges"
                        min="1"
                        value={formData.accountCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="pickupCharges"
                        className="border p-2 w-full"
                        placeholder="Pickup Charges"
                        min="1"
                        value={formData.pickupCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="dropOffCharges"
                        className="border p-2 w-full"
                        placeholder="Drop Off Charges"
                        min="1"
                        value={formData.dropOffCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="drvWaitingCharges"
                        className="border p-2 w-full"
                        placeholder="DRV Waiting Charges"
                        min="1"
                        value={formData.drvWaitingCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="drvParkingCharges"
                        className="border p-2 w-full"
                        placeholder="DRV Parking Charges"
                        min="1"
                        value={formData.drvParkingCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="extraCharges"
                        className="border p-2 w-full"
                        placeholder="Extra Charges"
                        min="1"
                        value={formData.extraCharges || ''}
                        onChange={handleInputChange}
                        required
                      />

                      <input
                        type="number"
                        name="totalCharges"
                        className="border p-2 w-full"
                        placeholder="Total Charges"
                        readOnly
                        value={totalCharges}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="relative col-span-12 lg:col-span-4">
                <div className="relative h-[450px]">
                  <div
                    id="googleMap"
                    style={{ width: '100%', height: '100%' }}
                    className="fixed top-0 w-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-full">
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-12 lg:col-span-5 grid gap-4 h-max">
                <div className="grid grid-cols-5 gap-5">
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3">Payment Type:</label>
                    <select
                      name="paymentType"
                      onChange={handlePayment}
                      value={formData.paymentType}
                      className="block w-full bg-white border border-gray-300 text-gray-900 p-2 col-span-9"
                      required
                    >
                      <option disabled value="">
                        Choose Payment Type
                      </option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                    </select>
                  </div>

                  {formData.paymentType === 'card' && (
                    <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                      <label className="col-span-3"></label>
                      <input
                        type="number"
                        name="cardNumber"
                        value={formData.cardDetails.cardNumber}
                        onChange={handleCardDetailChange}
                        className="block col-span-3 bg-white border border-gray-300 text-gray-900 p-2"
                        placeholder="Card number"
                        required={formData.paymentType === 'card'}
                      />
                      <input
                        type="number"
                        name="expiryDate"
                        value={formData.cardDetails.expiryDate}
                        onChange={handleCardDetailChange}
                        className="block col-span-3 bg-white border border-gray-300 text-gray-900 p-2"
                        placeholder="MM/YY"
                        required={formData.paymentType === 'card'}
                      />
                      <input
                        type="number"
                        name="cvc"
                        value={formData.cardDetails.cvc}
                        onChange={handleCardDetailChange}
                        className="block col-span-3 bg-white border border-gray-300 text-gray-900 p-2"
                        placeholder="CVC"
                        required={formData.paymentType === 'card'}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-5">
                  <div className="col-span-5 grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-3">Something Special:</label>
                    <textarea
                      name="specialRequirements"
                      style={{ resize: 'none' }}
                      rows={3}
                      className="block bg-white border border-gray-300 text-gray-900 p-2 col-span-9"
                      placeholder="Enter Special Requirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 grid gap-4"></div>
              <div className="col-span-12 lg:col-span-4 grid gap-4">
                <div className="col-span-12 lg:col-span-5">
                  <div className="">
                    <table className="w-full table-auto mt-4">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                            #ID
                          </th>
                          <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                            Driver Name
                          </th>
                          <th className="win-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                            Mobile Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {driverData.length > 0 &&
                          allDriverData
                            .slice(0, 5)
                            .map((driver: any, index: any) => (
                              <tr key={driver._id}>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-sm">{index + 1}</p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-sm">
                                    {driver.driver_details.driver_name}
                                  </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <p className="text-sm">
                                    {driver.driver_details.mobile_no}
                                  </p>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
