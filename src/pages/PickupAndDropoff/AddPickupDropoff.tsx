// AddMeetAndGreet.tsx
import { StandaloneSearchBox } from '@react-google-maps/api';
import React, { useState } from 'react';
import { useAddPickupDropoffMutation } from '../../redux/usersData/pickupAndDropoff'; // Import your API slice

interface AddPickupDropoffProps {
    onClose: () => void;
    mapLoaded: boolean;
    addressInput: any;
}

const AddPickupDropoff: React.FC<AddPickupDropoffProps> = ({ onClose, mapLoaded, addressInput }) => {
    // State for form fields
    const [meetAndGreetType, setMeetAndGreetType] = useState('');
    const [location, setLocation] = useState<{ type: string, coordinates: number[] } | null>(null);
    const [pickupcharges, setPickupcharges] = useState('');
    const [dropoffcharges, setDropoffcharges] = useState('');
    const [waitingtime, setWaitingtime] = useState('');
    const [additional, setAdditional] = useState('');
    const [postcode, setPostcode] = useState('');

    // Mutation hook for adding pickup and dropoff
    const [addPickupDropoff] = useAddPickupDropoffMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!location) return;

        const newPickupDropoff = {
            meet_and_greet_type: meetAndGreetType,
            location: location,
            pickupcharges,
            dropoffcharges,
            waitingtime,
            additional,
            postcode
        };

        try {
            await addPickupDropoff(newPickupDropoff).unwrap();
            onClose();
        } catch (error) {
            console.error('Failed to add pickup/dropoff:', error);
        }
    };

    const handlePlaceChange = () => {
        const places = addressInput.current?.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            setLocation({
                type: 'Point',
                coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
            });
            setPostcode(place.address_components[place.address_components.length - 1]?.short_name || '');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Add Meet and Greet</h2>
                <form onSubmit={handleSubmit}>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description / Airport</label>
                        {mapLoaded && (
                            <StandaloneSearchBox
                                onLoad={(ref) => (addressInput.current = ref)}
                                onPlacesChanged={handlePlaceChange}
                            >
                                <input
                                    type="text"
                                    placeholder="Enter address"
                                    className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </StandaloneSearchBox>
                        )}
                    </div>

                    {/* Type and postcode div */}
                    <div className='flex flex-row justify-between items-center'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Meet and Greet Type</label>
                            <select
                                value={meetAndGreetType}
                                onChange={(e) => setMeetAndGreetType(e.target.value)}
                                className="w-full border rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="AirPort">Air Port</option>
                                <option value="AllAirPorts">All Air Ports</option>
                                <option value="Postcode">Postcode</option>
                            </select>
                        </div>
                        <div className="mb-4 w-full mr-2 ">
                            <label className="block text-sm font-medium text-gray-700">Postcode</label>
                            <input
                                type="text"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Pickup charges and dropoff charges */}
                    <div className='flex justify-between flex-row'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Pickup Charges</label>
                            <input
                                type="text"
                                value={pickupcharges}
                                onChange={(e) => setPickupcharges(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Dropoff Charges</label>
                            <input
                                type="text"
                                value={dropoffcharges}
                                onChange={(e) => setDropoffcharges(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Waiting time and additional cost */}
                    <div className='flex flex-row justify-between'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Waiting Time</label>
                            <input
                                type="text"
                                value={waitingtime}
                                onChange={(e) => setWaitingtime(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium text-gray-700">Additional Time</label>
                            <input
                                type="text"
                                value={additional}
                                onChange={(e) => setAdditional(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>



                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-2">
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg "
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPickupDropoff;
