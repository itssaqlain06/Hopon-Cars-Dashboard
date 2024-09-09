import { StandaloneSearchBox } from '@react-google-maps/api';
import React, { useState } from 'react';
import { useAddMeetAndGreetMutation } from '../../redux/usersData/meetAndGreet';

interface AddMeetAndGreetProps {
    onClose: () => void;
    mapLoaded: boolean;
    addressInput: any;
}

const AddMeetAndGreet: React.FC<AddMeetAndGreetProps> = ({ onClose, mapLoaded, addressInput }) => {
    const [formData, setFormData] = useState({
        meet_and_greet_type: '',
        description: '',
        postcode: '',
        cost: '',
        waiting_time: '',
        additional_cost: ''
    });

    const [addMeetAndGreet, { isLoading }] = useAddMeetAndGreetMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const meetandgreetData = {
                meet_and_greet_type: formData.meet_and_greet_type,
                description: formData.description,
                postcode: formData.postcode,
                cost: formData.cost,
                waiting_time: formData.waiting_time,
                additional_cost: formData.additional_cost
            };
            await addMeetAndGreet(meetandgreetData).unwrap();
            console.log(meetandgreetData);
            onClose();
        } catch (error) {
            console.error('Failed to add the meet and greet', error);
        }
        console.log('Form submitted:', formData);
        onClose(); // Close the modal after submission
    };

    const handlePlaceChange = () => {
        const places = addressInput.current?.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = {
                meet_and_greet_type: formData.meet_and_greet_type, // Keep the selected meet and greet type
                description: place.formatted_address || '',
                postcode: place.address_components[place.address_components.length - 1]?.short_name || '',
                cost: '876',
                waiting_time: '15',
                additional_cost: '20',
            };
            setFormData(location);
            console.log(place);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Add Meet and Greet</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Meet and Greet Type</label>
                        <select
                            name="meet_and_greet_type"
                            value={formData.meet_and_greet_type}
                            onChange={handleChange}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select type</option>
                            <option value="airport">Airport</option>
                            <option value="all_airports">All Airports</option>
                            <option value="postcode">Postcode</option>
                        </select>
                    </div>
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

                    {/* Postcode and pickup charges div */}
                    <div className='flex justify-between flex-row'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Postcode</label>
                            <input
                                type="text"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Cost</label>
                            <input
                                type="text"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Dropoff charges and waiting time div */}
                    <div className='flex flex-row justify-between'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Waiting Time</label>
                            <input
                                type="text"
                                name="waiting_time"
                                value={formData.waiting_time}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium text-gray-700">Additional cost per min </label>
                            <input
                                type="text"
                                name="additional_cost"
                                value={formData.additional_cost}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Additional cost and additional cost per time div */}
                    {/* <div className='flex flex-row justify-between'>
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Additional cost per min</label>
                            <input
                                type="text"
                                name="additional_cost_per_time"
                                value={formData.additional_cost_per_time}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div> */}
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

export default AddMeetAndGreet;
