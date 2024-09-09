import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useAddFairMutation, useGetFairsQuery, useUpdateFairMutation } from '../../../redux/usersData/fairApi';

interface AddMileFaresProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onFareAdded: (newFare: any) => void;
}

const AddMileFares: React.FC<AddMileFaresProps> = ({ isOpen, onRequestClose, onFareAdded }) => {
    const [fromMiles, setFromMiles] = useState('');
    const [toMiles, setToMiles] = useState('');
    const [standardNormalHourAmount, setStandardNormalHourAmount] = useState('');
    const [outOfHoursAmount, setOutOfHourAmount] = useState('');
    const [addFair, { isLoading, error }] = useAddFairMutation();
    const [updateFair] = useUpdateFairMutation();
    const { data: fair, refetch } = useGetFairsQuery();

    useEffect(() => {
        if (fair && fair.length > 0) {
            const lastFare = fair[0].milefares[fair[0].milefares.length - 1];
            setFromMiles(lastFare.tomiles);  // Set fromMiles to the last fare's tomiles
        }
    }, [fair]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fair && fair.length > 0) {
            const lastFare = fair[0].milefares[fair[0].milefares.length - 1];

            // Update the last fare's tomiles before adding the new fare
            await updateFair({
                id: fair[0]._id,
                fairId: lastFare._id,
                fairData: {
                    tomiles: fromMiles,
                },
            }).unwrap();
            const fairData = {
                hours: fair[0].hours._id,
                frommiles: fromMiles,
                tomiles: toMiles || 9999999999999,
                normalcost: standardNormalHourAmount,
                outcost: outOfHoursAmount,
            };

            try {
                const response = await addFair(fairData).unwrap();
                console.log('Fare added successfully');
                onFareAdded(fairData);

                // Reset form fields
                setFromMiles('');
                setToMiles('');
                setStandardNormalHourAmount('');
                setOutOfHourAmount('');

                // Close the modal
                onRequestClose();
                refetch();
            } catch (err) {
                console.error('Failed to add fare: ', err);
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Fare"
            className="flex justify-center items-center h-screen w-full my-20"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Fare</h2>

                <div className="mb-4">
                    <label htmlFor="fromMiles" className="block text-gray-700 font-bold mb-2">
                        From Mile
                    </label>
                    <input
                        type="number"
                        id="fromMiles"
                        name="fromMiles"
                        onChange={(e) => setFromMiles(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="toMiles" className="block text-gray-700 font-bold mb-2">
                        To Mile
                    </label>
                    <input
                        type="number"
                        id="toMiles"
                        name="toMiles"
                        value={toMiles}
                        onChange={(e) => setToMiles(e.target.value)}
                        placeholder="Infinite"
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="standardNormalHourAmount" className="block text-gray-700 font-bold mb-2">
                        Standard Normal Hours Amount
                    </label>
                    <input
                        type="number"
                        id="standardNormalHourAmount"
                        name="standardNormalHourAmount"
                        value={standardNormalHourAmount}
                        onChange={(e) => setStandardNormalHourAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="outOfHoursAmount" className="block text-gray-700 font-bold mb-2">
                        Out of Hours Amount
                    </label>
                    <input
                        type="number"
                        id="outOfHoursAmount"
                        name="outOfHoursAmount"
                        value={outOfHoursAmount}
                        onChange={(e) => setOutOfHourAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-2" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Fare'}
                    </button>
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>

                {error && <p className="text-red-500 mt-2">Failed to add fare. Please try again.</p>}
            </form>
        </Modal>
    );
};

export default AddMileFares;
