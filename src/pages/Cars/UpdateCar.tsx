import React, { useState } from 'react';
import Modal from 'react-modal';
import { CarType } from '../../types/cars';
import { useUpdateCarMutation } from '../../redux/usersData/vehiclesData';

interface UpdateCarProps {
    car: CarType;
    onClose: () => void;
    isOpen: boolean;
}

const UpdateCar: React.FC<UpdateCarProps> = ({ car, onClose, isOpen }) => {
    const [name, setName] = useState(car.name);
    const [passengers, setPassengers] = useState(car.passengers);
    const [suitCases, setSuitCases] = useState(car.suit_cases);
    const [handBags, setHandBags] = useState(car.hand_bags);
    const [status, setStatus] = useState(car.status);
    const [fleetType, setFleetType] = useState(car.fleetType);
    const [fleetValue, setFleetValue] = useState(car.fleetValue);
    const [defaultCar, setDefaultCar] = useState(car.default);

    const [updateCarMutation] = useUpdateCarMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedCar: CarType = {
            ...car,
            name,
            passengers,
            suit_cases: suitCases,
            hand_bags: handBags,
            status,
            fleetType,
            fleetValue,
            isDefault: defaultCar,
        };

        try {
            await updateCarMutation({ id: updatedCar._id, updatedCar });
            onClose();
        } catch (error) {
            console.error('Failed to update car:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Update Car"
            className="flex justify-center items-center h-screen w-full mt-20"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Car</h2>

                {/* Name and Passengers */}
                <div className='flex flex-row justify-between'>
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
                            onChange={(e) => setPassengers(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Suitcases and Hand Bags */}
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
                            onChange={(e) => setSuitCases(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label htmlFor="handBags" className="block text-gray-700 font-bold mb-2">
                            Hand Bags
                        </label>
                        <input
                            type="number"
                            id="handBags"
                            name="handBags"
                            value={handBags}
                            onChange={(e) => setHandBags(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Fleet Type and Fleet Value */}
                <div className='flex flex-row justify-between'>
                    <div className="mb-4 w-full mr-2">
                        <label htmlFor="fleetType" className="block text-gray-700 font-bold mb-2">
                            Fleet Type
                        </label>
                        <select
                            id="fleetType"
                            name="fleetType"
                            value={fleetType}
                            onChange={(e) => setFleetType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                        >
                            <option value="noUplift">No Uplift</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixedPrice">Fixed Price</option>
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
                                disabled={fleetType === 'noUplift'}
                            />
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Default */}
                <div className="mb-4 flex-1 justify-start">
                    <div className="mb-4 w-full mr-2">
                        <input type="file" name="" id="" />
                    </div>
                    <div className="mb-4 w-full">
                        <input
                            type="checkbox"
                            id="default"
                            name="default"
                            checked={defaultCar}
                            onChange={(e) => setDefaultCar(e.target.checked)}
                            className="mr-1"
                        />
                        <label htmlFor="default">
                            Set as Default
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Update Car
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateCar;
