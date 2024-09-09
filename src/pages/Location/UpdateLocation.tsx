import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useUpdateLocationMutation } from '../../redux/usersData/locations';
import SucessSnakeBar from '../../components/SnakeBar/SucessSnakeBar';

interface UpdateLocationProps {
    onClose: () => void;
    onUpdateLocation: (location: { address: string, lat: string, lng: string, type: string, pickupCharges: string, dropOffCharges: string, status: string, postcode: string, name: string }) => void;
    mapLoaded: boolean;
    addressInput: React.RefObject<any>;
    location: {
        _id: string;
        address: string;
        lat: string;
        lng: string;
        type: string;
        pickupCharges: string;
        dropOffCharges: string;
        status: string;
        postcode: string;
        name: string;
    };
}

const UpdateLocation: React.FC<UpdateLocationProps> = ({ onClose, onUpdateLocation, mapLoaded, addressInput, location }) => {
    const [updatedLocation, setUpdatedLocation] = useState(location);
    const [updateLocation] = useUpdateLocationMutation();

    const handlePlaceChange = () => {
        const places = addressInput.current?.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = {
                address: place.formatted_address,
                lat: place.geometry.location.lat().toString(),
                lng: place.geometry.location.lng().toString(),
                type: updatedLocation.type,
                pickupCharges: updatedLocation.pickupCharges,
                dropOffCharges: updatedLocation.dropOffCharges,
                status: updatedLocation.status,
                postcode: updatedLocation.postcode,
                name: updatedLocation.name,
            };
            setUpdatedLocation(location);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await updateLocation({ id: updatedLocation._id, updatedLocation }).unwrap();
            onUpdateLocation(updatedLocation);
            onClose();
        } catch (error) {
            console.error('Failed to update location:', error);
        }
    };

    useEffect(() => {
        setUpdatedLocation(location);
    }, [location]);

    return (
        <>
            <Modal
                isOpen={true}
                onRequestClose={onClose}
                contentLabel="Update Location"
                className="flex justify-center items-center w-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
            >
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Update Pick Up Location</h2>
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
                                    value={updatedLocation.address}
                                    onChange={(e) => setUpdatedLocation({ ...updatedLocation, address: e.target.value })}
                                    placeholder="Enter address"
                                    className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </StandaloneSearchBox>
                        )}
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-gray-700 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={updatedLocation.name}
                                onChange={(e) => setUpdatedLocation({ ...updatedLocation, name: e.target.value })}
                                placeholder="Enter name"
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-gray-700 mb-2">
                                Postcode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={updatedLocation.postcode}
                                onChange={(e) => setUpdatedLocation({ ...updatedLocation, postcode: e.target.value })}
                                placeholder="Enter postcode"
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                value={updatedLocation.type}
                                onChange={(e) => setUpdatedLocation({ ...updatedLocation, type: e.target.value })}
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter type"
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={updatedLocation.status}
                                onChange={(e) => setUpdatedLocation({ ...updatedLocation, status: e.target.value })}
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                            </select>
                        </div>
                    </div>
                    {/* Pickup charges and droff charges div */}
                    <div className='flex flex-row '>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-gray-700 mb-2">
                                Pickup Charges
                            </label>
                            <input
                                type="text"
                                value={updatedLocation.pickupCharges}
                                onChange={(e) => setUpdatedLocation({ ...updatedLocation, pickupCharges: e.target.value })}
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter pickup charges"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-gray-700 mb-2">
                                Dropoff Charges
                            </label>
                            <input
                                type="text"
                                value={updatedLocation.dropOffCharges}
                                onChange={(e) => setUpdatedLocation({ ...updatedLocation, dropOffCharges: e.target.value })}
                                className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter dropoff charges"
                            />
                        </div>
                    </div>

                    <div className='flex flex-row-reverse'>
                        <button
                            type="button"
                            onClick={onClose}
                            className=" bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg "
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mx-2"
                        >
                            Update Location
                        </button>

                    </div>
                </form>
            </Modal>
        </>
    );
};

export default UpdateLocation;
