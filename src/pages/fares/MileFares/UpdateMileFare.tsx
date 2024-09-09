import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useUpdateFairMutation } from '../../../redux/usersData/fairApi';

interface UpdateMileFareProps {
    isOpen: boolean;
    onRequestClose: () => void;
    initialData: any;
    onFareUpdated: () => void;
}

const UpdateMileFare: React.FC<UpdateMileFareProps> = ({ isOpen, onRequestClose, initialData, onFareUpdated }) => {
    const [fromMiles, setFromMiles] = useState('');
    const [toMiles, setToMiles] = useState('');
    const [normalCost, setNormalCost] = useState('');
    const [outCost, setOutCost] = useState('');

    useEffect(() => {
        if (initialData) {
            setFromMiles(initialData.frommiles || '');
            setToMiles(initialData.tomiles || '');
            setNormalCost(initialData.normalcost || '');
            setOutCost(initialData.outcost || '');
        }
    }, [initialData]);

    const [updateFare, { isLoading }] = useUpdateFairMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fareData = {
            frommiles: fromMiles,
            tomiles: toMiles,
            normalcost: normalCost,
            outcost: outCost,
        };

        try {
            await updateFare({
                id: initialData.parentId,
                fairId: initialData._id,
                fairData: fareData,
            }).unwrap();
            onFareUpdated();
            onRequestClose()
        } catch (error) {
            console.error("Failed to update fare:", error);
        }
    };



    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Update Mile Fare"
            className="flex justify-center items-center h-screen w-full"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Update Mile Fare</h2>

                <div className="mb-4">
                    <label htmlFor="fromMiles" className="block text-gray-700 font-bold mb-2">From Miles</label>
                    <input
                        id="fromMiles"
                        type="number"
                        value={fromMiles}
                        disabled
                        onChange={(e) => setFromMiles(e.target.value)}
                        className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter from miles"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="toMiles" className="block text-gray-700 font-bold mb-2">To Miles</label>
                    <input
                        id="toMiles"
                        type="number"
                        value={toMiles}
                        onChange={(e) => setToMiles(e.target.value)}
                        className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter to miles"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="normalCost" className="block text-gray-700 font-bold mb-2">Normal Cost</label>
                    <input
                        id="normalCost"
                        type="number"
                        value={normalCost}
                        onChange={(e) => setNormalCost(e.target.value)}
                        className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter normal cost"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="outCost" className="block text-gray-700 font-bold mb-2">Out Cost</label>
                    <input
                        id="outCost"
                        type="number"
                        value={outCost}
                        onChange={(e) => setOutCost(e.target.value)}
                        className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter out cost"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ml-2"
                        disabled={isLoading}
                    >
                        Update
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateMileFare;
