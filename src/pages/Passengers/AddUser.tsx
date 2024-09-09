import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAddCarMutation } from '../../redux/usersData/vehiclesData';

interface AddNewCarProps {
    onClose: () => void;
    isOpen: boolean;
}

const AddNewCar: React.FC<AddNewCarProps> = ({ onClose, isOpen }) => {
    const [name, setName] = useState('');
    const [passengers, setPassengers] = useState('');
    const [suitCases, setSuitCases] = useState('');
    const [handBags, setHandBags] = useState('');
    const [status, setStatus] = useState('');
    const [fleetType, setFleetType] = useState('noUplift');
    const [fleetValue, setFleetValue] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const [addCar, { isLoading }] = useAddCarMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCar = {
            name,
            passengers,
            suit_cases: suitCases,
            hand_bags: handBags,
            status,
            fleetType,
            fleetValue: fleetType === 'noUplift' ? '' : fleetValue,
            default: isDefault
        };

        try {
            await addCar(newCar).unwrap();
            onClose();
        } catch (error) {
            console.error('Failed to add car:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Car"
            className="flex justify-center items-center h-screen w-full mt-20"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Car</h2>

                {/* Car name and passengers div */}
                <div className='flex flex-row justiify-between'>
                    <div className="mb-4 w-full mr-2">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label htmlFor="passengers" className="block text-gray-700 font-bold mb-2">
                            Passengers
                        </label>
                        <input
                            type="number"
                            id="passengers"
                            name="passengers"
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* suitcase and handbags div */}
                <div className='flex flex-row justify-between'>

                    <div className="mb-4 w-full mr-2">
                        <label htmlFor="suitCases" className="block text-gray-700 font-bold mb-2">
                            Suitcases
                        </label>
                        <input
                            type="number"
                            id="suitCases"
                            name="suitCases"
                            value={suitCases}
                            onChange={(e) => setSuitCases(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4 w-full ">
                        <label htmlFor="handBags" className="block text-gray-700 font-bold mb-2">
                            Handbags
                        </label>
                        <input
                            type="number"
                            id="handBags"
                            name="handBags"
                            value={handBags}
                            onChange={(e) => setHandBags(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Fleet type and fleet value */}
                <div className='flex flex-row justify-between'>
                    <div className="mb-4 w-full mr-2">
                        <label htmlFor="fleetType" className="block text-gray-700 font-bold mb-2">
                            Fleet Type
                        </label>
                        <select
                            value={fleetType}
                            onChange={(e) => setFleetType(e.target.value)}
                            className="w-full border rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="No Uplift">No Uplift</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Fixed Price">Fixed Price</option>
                        </select>
                    </div>

                    {fleetType !== 'No Uplift' && (
                        <div className="mb-4 w-full">
                            <label htmlFor="fleetValue" className="block text-gray-700 font-bold mb-2">
                                Fleet Value
                            </label>
                            <input
                                type="text"
                                id="fleetValue"
                                name="fleetValue"
                                value={fleetValue}
                                onChange={(e) => setFleetValue(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            // disabled={fleetType === 'noUplift'}
                            />
                        </div>
                    )}
                </div>

                {/* status */}
                <div className='flex flex-row justify-between'>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Default checkbox */}
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="default"
                        name="default"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="default" className="text-gray-700 font-bold">
                        Set as Default
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Car'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddNewCar;
