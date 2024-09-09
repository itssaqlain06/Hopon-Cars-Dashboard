import React, { useState } from 'react';
import DeleteButtons from '../../../components/Buttons/DeleteButton';
import EditButtons from '../../../components/Buttons/EditButton';
import UpdateMileFare from './UpdateMileFare';
import SucessSnakeBar from '../../../components/SnakeBar/SucessSnakeBar';
import { useDeleteFairMutation, useUpdateFairMutation } from '../../../redux/usersData/fairApi';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';

interface HoursAndMileSettingsProps {
    mileFares: any;
    handleChange: (e: any) => void;
    editValues: any;
    refetch: any;
}

const HoursAndMileSettings: React.FC<HoursAndMileSettingsProps> = ({ mileFares, handleChange, editValues, refetch }) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedFare, setSelectedFare] = useState<any>(null);
    const [selectedFareToDelete, setSelectedFareToDelete] = useState<any>(null);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [updateFair] = useUpdateFairMutation();
    const [deleteFareMutation] = useDeleteFairMutation();

    const onCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        refetch();
        setShowSuccessSnackbar(true);
        setTimeout(() => {
            setShowSuccessSnackbar(false);
        }, 3000);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFareToDelete(null);
    };

    const handleDelete = (fare: any) => {
        setSelectedFareToDelete({ ...fare, parentId: mileFares._id });
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        
            
        if (selectedFareToDelete) {
            try {
                if(mileFares.milefares.length > 1){
                    setIsLoading(true);
                    const response = await deleteFareMutation({
                        id: selectedFareToDelete.parentId,
                        fairId: selectedFareToDelete._id,
                    }).unwrap();
                    const lastFare = response.mileFare.milefares[response.mileFare.milefares.length - 1];
                    await updateFair({
                            id: response.mileFare._id,
                            fairId: lastFare._id,
                            fairData: {
                                tomiles: 9999999999999,
                            },
                        }).unwrap();
                    onCloseModal();
                    refetch();
                }
            } catch (error) {
                console.error('Failed to delete fare: ', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateFare = (fare: any) => {
        setIsUpdateModalOpen(true);
        setSelectedFare({ ...fare, parentId: mileFares._id });
    };

    const handleToMilesChange = (e: any, fareIndex: number) => {
        const { name, value } = e.target;
        handleChange(e);

        if (fareIndex < mileFares.milefares.length - 1) {
            const nextFare = mileFares.milefares[fareIndex + 1];
            handleChange({
                target: {
                    name: `rangeStart_${nextFare._id}`,
                    value: value,
                },
            });

            // Also update the `toMiles` of the current fare to be the same as the `fromMiles` of the next fare
            handleChange({
                target: {
                    name: `rangeEnd_${mileFares.milefares[fareIndex]._id}`,
                    value: value,
                },
            });
        }
    };

    return (
        <div className="flex flex-col my-8">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50">
                    <Dots size={30} color='white' />
                </div>
            )}
            <div className={isLoading ? "blur" : ""}>
                <div className={`mb-4`}>
                    <div className="flex flex-row bg-gray-800 p-4 rounded-md dark:bg-slate-700 bg-slate-300">
                        <div className="flex flex-row items-center">
                            <p className="dark:text-white text-black">Initial Miles:</p>
                            <input
                                type="number"
                                name={`initialMiles_${mileFares._id}`}
                                value={editValues[`initialMiles_${mileFares._id}`] || mileFares.hours?.initialmiles || ""}
                                onChange={handleChange}
                                className="dark:text-white text-black px-2 py-1 dark:bg-slate-600 rounded-md mx-2"
                            />
                        </div>
                        <div className="flex flex-row items-center my-2">
                            <p className="dark:text-white text-black">Initial Cost:</p>
                            <input
                                type="number"
                                name={`initialCost_${mileFares._id}`}
                                value={editValues[`initialCost_${mileFares._id}`] || mileFares.hours?.initialcost || ""}
                                onChange={handleChange}
                                className="dark:text-white text-black mr-2 px-2 py-1 dark:bg-slate-600 rounded-md mx-2"
                            />
                        </div>
                        <div className="flex flex-row items-center my-2">
                            <p className="dark:text-white text-black">Out of Hour Cost:</p>
                            <input
                                type="number"
                                name={`outHourCost_${mileFares._id}`}
                                value={editValues[`outHourCost_${mileFares._id}`] || mileFares.hours?.initialcost || ""}
                                onChange={handleChange}
                                className="dark:text-white text-black mr-2 px-2 py-1 dark:bg-slate-600 rounded-md mx-2"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    {mileFares.milefares?.map((fare: any, index: number) => (
                        <React.Fragment key={fare._id}>
                            <div className="flex flex-row justify-between bg-gray-800 p-4 rounded-md dark:bg-slate-700 bg-slate-300 mb-4">
                                <div className="flex flex-row">
                                    <div className="flex flex-row items-center">
                                        <p className="dark:text-white text-black">From Miles:</p>
                                        <input
                                            type="number"
                                            name={`rangeStart_${fare._id}`}
                                            value={editValues[`rangeStart_${fare._id}`] || fare.frommiles || ""}
                                            onChange={handleChange}
                                            className="dark:text-white text-black px-2 py-1 dark:bg-slate-600 rounded-md mx-2 w-15"
                                        />
                                    </div>
                                    <div className="flex flex-row items-center my-2">
                                        <p className="dark:text-white text-black">To Miles:</p>
                                        {(index !== mileFares.milefares.length - 1) && (
                                        <input
                                            type="text"
                                            name={`rangeEnd_${fare._id}`}
                                            value={index === mileFares.milefares.length - 1 ? 9999999999999 :editValues[`rangeEnd_${fare._id}`] || fare.tomiles || ""}
                                            onChange={(e) => handleToMilesChange(e, index)}
                                            className="dark:text-white text-black px-2 py-1 dark:bg-slate-600 rounded-md mx-2 w-17"
                                            disabled={index === mileFares.milefares.length - 1}
                                        />
                                        ) || (
                                            <span className='ml-2'>Infinite Miles</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row items-center my-2">
                                    <p className="dark:text-white text-black">Normal hour cost:</p>
                                    <input
                                        type="number"
                                        name={`normalCost_${fare._id}`}
                                        value={editValues[`normalCost_${fare._id}`] || fare.normalcost || ""}
                                        onChange={handleChange}
                                        className="dark:text-white text-black px-2 py-1 dark:bg-slate-600 rounded-md mx-2"
                                    />
                                </div>
                                <div className="flex flex-row items-center">
                                    <p className="dark:text-white text-black">Out hour cost:</p>
                                    <input
                                        type="number"
                                        name={`outCost_${fare._id}`}
                                        value={editValues[`outCost_${fare._id}`] || fare.outcost || ""}
                                        onChange={handleChange}
                                        className="dark:text-white text-black px-2 py-1 dark:bg-slate-600 rounded-md mx-2"
                                    />
                                </div>
                                <div className="flex flex-row gap-4 mt-[2%]">
                                    <button onClick={() => handleUpdateFare(fare)}>
                                        <EditButtons />
                                    </button>
                                    {(index !== 0) && (
                                    <button onClick={() => handleDelete(fare)}>
                                        <DeleteButtons />
                                    </button>
                                     )}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {isUpdateModalOpen && selectedFare && (
                    <UpdateMileFare
                        isOpen={isUpdateModalOpen}
                        onRequestClose={() => onCloseUpdateModal()}
                        initialData={selectedFare}
                        onFareUpdated={() => setIsUpdateModalOpen(false)}
                    />
                )}

                {showSuccessSnackbar && <SucessSnakeBar />}

                <ConfirmationModal
                    isOpen={isModalOpen}
                    message="Are you sure you want to delete this fare?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={onCloseModal}
                />
            </div>
        </div>
    );
};

export default HoursAndMileSettings;
