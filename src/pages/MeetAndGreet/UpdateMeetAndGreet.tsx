import React, { useState, useEffect } from 'react';
import { useUpdateMeetAndGreetMutation } from '../../redux/usersData/meetAndGreet';
import { StandaloneSearchBox } from '@react-google-maps/api';

interface UpdateMeetAndGreetProps {
    onClose: () => void;
    mapLoaded: boolean;
    addressInput: any;
    initialData: any;
}

const UpdateMeetAndGreet: React.FC<UpdateMeetAndGreetProps> = ({ onClose, initialData, mapLoaded, addressInput }) => {
    const [formData, setFormData] = useState({
        meet_and_greet_type: '',
        description: '',
        postcode: '',
        cost: '',
        waiting_time: '',
        additional_cost: ''
    });

    const [updateMeetAndGreet, { isLoading }] = useUpdateMeetAndGreetMutation();

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMeetAndGreet({
                id: initialData._id,
                fairData: formData,
            });
            onClose(); // Close the modal after submission
        } catch (error) {
            console.error('Failed to update the meet and greet:', error);
        }
    };

    const handlePlaceChange = () => {
        const places = addressInput.current?.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = {
                meet_and_greet_type: formData.meet_and_greet_type,
                description: place.formatted_address || '',
                postcode: place.address_components[place.address_components.length - 1]?.short_name || '',
                cost: formData.cost,
                waiting_time: formData.waiting_time,
                additional_cost: formData.additional_cost
            };
            setFormData(location);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Update Meet and Greet</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Meet and Greet Type</label>
                        <select
                            name="meet_and_greet_type"
                            value={formData.meet_and_greet_type}
                            onChange={handleChange}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Air Port">Air Port</option>
                            <option value="All air ports">All air ports</option>
                            <option value="Postcode">Postcode</option>
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
                                    value={formData.description}
                                    onChange={handleChange}
                                    name="description"
                                    className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </StandaloneSearchBox>
                        )}
                    </div>

                    <div className='flex flex-row justify-between'>
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
                        <div className="mb-4 w-full">
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

                    <div className='flex justify-between flex-row'>
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
                        <div className="mb-4 w-full mr-2">
                            <label className="block text-sm font-medium text-gray-700">Additional cost per min</label>
                            <input
                                type="text"
                                name="additional_cost"
                                value={formData.additional_cost}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-gray-700">Additional cost per min</label>
                        <input
                            type="text"
                            name="additional_cost_per_time"
                            value={formData.additional_cost_per_time}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div> */}

                    <div className="flex flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-2" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMeetAndGreet;
