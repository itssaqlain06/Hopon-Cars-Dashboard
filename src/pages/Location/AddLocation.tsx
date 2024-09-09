import React, { useState } from 'react';
import Modal from 'react-modal';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useAddLocationMutation } from '../../redux/usersData/locations';

interface AddLocationProps {
    onClose: () => void;
    mapLoaded: boolean;
    addressInput: React.RefObject<any>;
}

const AddLocation: React.FC<AddLocationProps> = ({ onClose, mapLoaded, addressInput }) => {
    const [pickupLocation, setPickupLocation] = useState({
        address: '',
        name: '',
        postcode: '',
        lat: '',
        lng: '',
        type: 'air port',
        pickupCharges: '',
        dropOffCharges: '',
        status: 'active',
    });

    const [addLocation] = useAddLocationMutation();

    const handlePlaceChange = () => {
        const places = addressInput.current?.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = {
                address: place.formatted_address || '',
                name: place.name || place.formatted_address || '',
                postcode: place.address_components[place.address_components.length - 1]?.short_name || '',
                lat: place.geometry.location.lat().toString(),
                lng: place.geometry.location.lng().toString(),
                type: pickupLocation.type,
                pickupCharges: pickupLocation.pickupCharges,
                dropOffCharges: pickupLocation.dropOffCharges,
                status: pickupLocation.status,
            };
            setPickupLocation(location);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        if (pickupLocation.address && pickupLocation.name && pickupLocation.postcode && pickupLocation.lat && pickupLocation.lng && pickupLocation.pickupCharges && pickupLocation.dropOffCharges) {
            const newLocation = {
                adress_location: {
                    coordinates: [parseFloat(pickupLocation.lat), parseFloat(pickupLocation.lng)],
                },
                address: pickupLocation.address,
                name: pickupLocation.name,
                postcode: pickupLocation.postcode,
                type: pickupLocation.type,
                pickupCharges: pickupLocation.pickupCharges,
                dropOffCharges: pickupLocation.dropOffCharges,
                status: pickupLocation.status,
            };

            try {
                await addLocation(newLocation).unwrap();
                onClose();
                setPickupLocation({
                    address: '',
                    name: '',
                    postcode: '',
                    lat: '',
                    lng: '',
                    type: 'house',
                    pickupCharges: '',
                    dropOffCharges: '',
                    status: 'inactive',
                });
            } catch (error) {
                console.error('Failed to add location:', error);
            }
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Add Location"
            className="flex justify-center items-center h-screen w-full"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Add Pick Up Location</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Pick Up Location <span className="text-red-500">*</span>
                    </label>
                    {mapLoaded && (
                        <StandaloneSearchBox
                            onLoad={(ref) => (addressInput.current = ref)}
                            onPlacesChanged={handlePlaceChange}
                        >
                            <input
                                type="text"
                                placeholder="Enter address"
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} // Prevent default behavior on Enter
                            />
                        </StandaloneSearchBox>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={pickupLocation.name}
                        onChange={(e) => setPickupLocation({ ...pickupLocation, name: e.target.value })}
                        className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                        readOnly
                    />
                </div>

                <div className='flex flex-row justify-between'>
                    <div className="mb-4 w-full mr-2">
                        <label className="block text-gray-700 mb-2">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={pickupLocation.address}
                            onChange={(e) => setPickupLocation({ ...pickupLocation, address: e.target.value })}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter address"
                            readOnly
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label className="block text-gray-700 mb-2">
                            Postcode <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={pickupLocation.postcode}
                            onChange={(e) => setPickupLocation({ ...pickupLocation, postcode: e.target.value })}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter postcode"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">
                            Type
                        </label>
                        <input
                            type="text"
                            value={pickupLocation.type}
                            onChange={(e) => setPickupLocation({ ...pickupLocation, type: e.target.value })}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter type"
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={pickupLocation.status}
                            onChange={(e) => setPickupLocation({ ...pickupLocation, status: e.target.value })}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                        </select>
                    </div>
                </div>

                <div className='flex space-x-4 mb-4'>
                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">
                            Pickup Charges
                        </label>
                        <input
                            type="number"
                            value={pickupLocation.pickupCharges}
                            onChange={(e) => setPickupLocation({ ...pickupLocation, pickupCharges: e.target.value })}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter pickup charges"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">
                            Dropoff Charges
                        </label>
                        <input
                            type="number"
                            value={pickupLocation.dropOffCharges}
                            onChange={(e) => setPickupLocation({ ...pickupLocation, dropOffCharges: e.target.value })}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter dropoff charges"
                        />
                    </div>
                </div>
                <div className='flex flex-row-reverse'>

                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mx-2"
                    >
                        Add Location
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddLocation;
