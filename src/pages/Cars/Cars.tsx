import { useEffect, useState } from 'react';
import AddNewCar from './AddNewCar';
import UpdateCar from './UpdateCar';
import { CarType } from '../../types/cars';
import {
    useFetchCarsQuery,
    useDeleteCarMutation,
    useUpdateCarMutation,
    useAddCarMutation,
} from '../../redux/usersData/vehiclesData';
import DeleteButtons from '../../components/Buttons/DeleteButton';
import EditButtons from '../../components/Buttons/EditButton';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import SucessSnakeBar from '../../components/SnakeBar/SucessSnakeBar';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';
import { createAction } from '@reduxjs/toolkit';

const Cars = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
    const [selectedCarToDelete, setSelectedCarToDelete] = useState<CarType | null>(null);
    const [showSuccessSnkeBar, setShowSuccessSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState<any>(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [deleteCarMutation] = useDeleteCarMutation();
    const [updateCarMutation] = useUpdateCarMutation();
    const [addCarMutation] = useAddCarMutation();
    const { data: carData = [], isError, refetch, isFetching } = useFetchCarsQuery();

    useEffect(() => {
        setIsLoading(isFetching)
    }, [isFetching])

    const handleEditCar = (car: CarType) => {
        setSelectedCar(car);
        setIsUpdateModalOpen(true);
        refetch();
    };

    const handleDeleteCar = (car: CarType) => {
        setSelectedCarToDelete(car);
        setIsModalOpen(true);
    };

    const confirmDeleteCar = async () => {
        if (selectedCarToDelete) {
            try {
                await deleteCarMutation(selectedCarToDelete._id);
                setIsModalOpen(false);
                setSelectedCarToDelete(null);
                refetch();
            } catch (error) {
                console.error('Failed to delete car:', error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCarToDelete(null);
    };

    const addCar = async (newCar: CarType) => {
        try {
            await addCarMutation(newCar);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Failed to add car:', error);
        }
    };

    const onUpdateCar = async (updatedCar: CarType) => {
        try {
            await updateCarMutation({ id: updatedCar._id, updatedCar });
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error('Failed to update car:', error);
        }
    };

    const onCloseModal = () => {
        setIsUpdateModalOpen(false);
        refetch();
        setShowSuccessSnackbar(true)
        setTimeout(() => {
            setShowSuccessSnackbar(false)
        }, 3000);
    }

    // Pagination
    const rowsPerPage = 10;
    const totalPages = Math.ceil(carData.length / rowsPerPage);

    const handleClickNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleClickPrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = carData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (isError) {
        return <div>Error loading cars.</div>;
    }

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50">
                    <Dots size={30} color='white' />
                </div>
            )}
            <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ${isLoading ? 'blur' : ''}`}>
                <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                    <h1 className="text-2xl text-white my-2 font-bold">Vehicles</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Add Vehicle
                    </button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-center dark:bg-meta-4">
                                <th className="min-w-[10px] py-2 px-1 font-medium text-black dark:text-white xl:pl-3 text-center">#</th>
                                <th className="min-w-[80px] py-2 px-1 font-medium text-black dark:text-white text-center">Image</th>
                                <th className="min-w-[100px] py-2 px-1 font-medium text-black dark:text-white xl:pl-3 text-center">Vehicle</th>
                                <th className="min-w-[50px] py-2 px-1 font-medium text-black dark:text-white text-center">Passengers</th>
                                <th className="min-w-[50px] py-2 px-1 font-medium text-black dark:text-white text-center">Luggages</th>
                                <th className="min-w-[50px] py-2 px-1 font-medium text-black dark:text-white text-center">H.Luggages</th>
                                <th className="min-w-[150px] py-2 px-1 font-medium text-black dark:text-white text-center">Pricing</th>
                                <th className="min-w-[50px] py-2 px-1 font-medium text-black dark:text-white text-center">Default</th>
                                <th className="min-w-[50px] py-2 px-1 font-medium text-black dark:text-white text-center">Status</th>
                                {/* <th className="min-w-[150px] py-2 px-1 font-medium text-black dark:text-white text-center">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(paginatedData) && paginatedData.map((car: CarType, index) => (
                                <tr key={car._id}>
                                    <td className="border text-center border-[#eee] py-2 px-1 dark:border-strokedark">
                                        <p className="text-black dark:text-slate-400">{index + 1}</p>
                                    </td>
                                    <td className="border border-[#eee] py-2 px-1 pl-9 dark:border-strokedark">
                                        <img src={car.image} alt={car.name} className="w-20 h-16 object-contain rounded-2xl" />
                                    </td>
                                    <td className={`border border-[#eee] py-2 px-1  dark:border-strokedark text-center`}>
                                        <p className="text-sm font-bold text-slate-400 hover:text-primary" onClick={() => handleEditCar(car)}>{car.name}</p>
                                    </td>
                                    <td className="border border-[#eee] text-center py-2 px-1 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{car.passengers}</p>
                                    </td>
                                    <td className="border border-[#eee] text-center py-2 px-1 dark:border-strokedark">
                                        <p className="text-black text-center dark:text-white">{car.suit_cases}</p>
                                    </td>
                                    <td className=" text-center border border-[#eee] py-2 px-1 dark:border-strokedark">
                                        <p className="text-black dark:text-white"> {car.hand_bags}</p>
                                    </td>

                                    <td className="border border-[#eee] py-2 px-1 dark:border-strokedark text-center">
                                    <p className="text-black text-center dark:text-white"><strong>{car.fleetType}</strong> {car.fleetType != 'No Uplift'&&car.fleetValue}</p>
                                        {/* <div className="flex flex-row space-y-2"> */}
                                        {/* <div className="flex items-center space-x-2 space-y-2 flex-col dark:border-strokedark">
                                            <select
                                                value={car.fleetType}
                                                className="rounded px-3 py-2 text-sm text-black bg-white dark:text-white dark:bg-slate-600 outline-none "
                                            >
                                                <option value="No Uplift">No Uplift</option>
                                                <option value="Percentage">Percentage (%)</option>
                                                <option value="Fixed Price">Fixed Price</option>
                                            </select>
                                            {
                                                car.fleetType !== 'No Uplift' && (
                                                    <input
                                                        value={car.fleetValue}
                                                        type="text"
                                                        disabled
                                                        className="rounded px-3 py-2 w-24 text-sm text-black bg-white dark:text-white dark:bg-slate-600 outline-none"
                                                        placeholder="Value"
                                                    />
                                                )
                                            }

                                        </div> */}
                                        {/* </div> */}
                                    </td>

                                    {/* Status section  */}
                                    <td className="py-2 px-1 border border-[#eee] py-2 px-1 dark:border-strokedark text-center">
                                        <input
                                            type="radio"
                                            name="defaultCar"
                                            id={`car-${car.id}`}
                                            checked={car.default}
                                            onChange={() => {/* handle change if needed */ }}
                                        />
                                    </td>
                                    <td className={`border border-[#eee] py-2 px-1 dark:border-strokedark text-center`}>
                                        <p className={`${car.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} text-sm font-medium px-2 py-1 rounded-lg`}>{car.status}</p>
                                    </td>
                                    {/* <td className="border border-[#eee] py-2 px-1 dark:border-strokedark text-center">
                                        <div className="flex items-center space-x-3.5">
                                            {/* <button className="hover:text-primary" onClick={() => handleDeleteCar(car)}>
                                                <DeleteButtons />
                                            </button>
                                            <button className="hover:text-primary" onClick={() => handleEditCar(car)}>
                                                <EditButtons />
                                            </button>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center item mt-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-400'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700"
                        onClick={handleClickPrev}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700"
                        onClick={handleClickNext}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                {isAddModalOpen && (
                    <AddNewCar
                        addCar={addCar}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            refetch();
                        }}
                        isOpen={isAddModalOpen}
                    />
                )}
                {isUpdateModalOpen && selectedCar && (
                    <UpdateCar
                        car={selectedCar}
                        updateCar={onUpdateCar}
                        onClose={() => {
                            onCloseModal()

                        }}
                        isOpen={isUpdateModalOpen}
                    />
                )}
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                message="Are you sure you want to delete this product?"
                onConfirm={confirmDeleteCar}
                onCancel={closeModal}
            />

            {showSuccessSnkeBar && <SucessSnakeBar />}
        </>
    );
};

export default Cars;