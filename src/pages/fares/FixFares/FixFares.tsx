import React, { useRef, useState, useEffect } from 'react';
import Modal from 'react-modal';
import AddFixFares from './AddFixFares';
import UpdateFixFares from './UpdateFixFare';
import { AppDispatch } from '../../../redux/usersData/store';
import { useDispatch } from 'react-redux';
import { useGetFixFareQuery, useDeleteFixFareMutation } from '../../../redux/usersData/fixFares';
import { addLocation } from '../../../redux/usersData/locationSlice';
import DeleteButtons from '../../../components/Buttons/DeleteButton';
import EditButtons from '../../../components/Buttons/EditButton';
import SucessSnakeBar from '../../../components/SnakeBar/SucessSnakeBar';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';

const FixFares = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedFare, setSelectedFare] = useState(null);
    const [deleteFareId, setDeleteFareId] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const addressInput = useRef(null);
    const [libraries] = useState(['places']);

    const [deleteFixFare] = useDeleteFixFareMutation();
    const dispatch: AppDispatch = useDispatch();
    const { data: fixFares = [], refetch, isFetching } = useGetFixFareQuery();

    useEffect(() => {
        setIsLoading(isFetching);
    }, [isFetching]);

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(fixFares.length / itemsPerPage);
    const currentItems = fixFares.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleLoadScriptLoad = () => {
        setMapLoaded(true);
    };

    const handleLoadScriptError = (error: any) => {
        console.error('Failed to load Google Maps:', error);
    };

    const handleAddLocation = () => {
        setIsModalOpen(true);
    };

    const handleUpdateLocation = (fare: any) => {
        setSelectedFare(fare);
        setIsUpdateModalOpen(true);
        setShowSuccessSnackbar(true);
        setTimeout(() => {
            setShowSuccessSnackbar(false);
        }, 3000);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        refetch();
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedFare(null);
    };

    const handleNewLocation = (location: any) => {
        const newLocation = {
            id: fixFares.length + 1,
            address: location.address,
            type: location.type,
            longitude: location.lng,
            latitude: location.lat,
            pickupCharges: location.pickupCharges,
            dropOffCharges: location.dropOffCharges,
            status: "pending",
        };
        dispatch(addLocation(newLocation));
        setIsModalOpen(false);
    };

    const handleUpdateFare = () => {
        setIsUpdateModalOpen(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDeleteFare = async (_id: any) => {
        setDeleteModalOpen(true);
        setDeleteFareId(_id);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true); // Start loading
            await deleteFixFare(deleteFareId).unwrap();
            setDeleteModalOpen(false);
            refetch(); // Refetch data after deletion
        } catch (error) {
            console.error('Failed to delete fare:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        setDeleteFareId(null);
    };

    return (
        <div>
            {/* Conditionally render loader with blur effect */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50">
                    <Dots size={30} color='white' />
                </div>
            )}
            <div className={isLoading ? "blur" : ""}>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                        <h1 className='text-2xl text-white my-2 font-bold'>Fix Fares</h1>
                        <button className="mt-4 py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleAddLocation()}>
                            Add Fares
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">#</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Pickups</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Destinations</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Price</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item: any, index: any) => (
                                    <tr key={item._id}>
                                        <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                                            <p className="text-sm">{index + 1}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                                            <div className='flex flex-row flex-wrap'>
                                                {item.pickuppostcode.map((pickupItem: any, idx: any) => (
                                                    <p key={idx} className="text-black dark:text-white bg-blue-600 rounded-sm mx-1 px-2 py-1 my-1">{pickupItem}</p>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                                            <div className='flex flex-row flex-wrap '>
                                                {item.destinationpostcode.map((destinationItem: any, idx: any) => (
                                                    <p key={idx} className="text-black dark:text-white bg-green-600 rounded-sm mx-1 px-2 py-1 my-1">{destinationItem}</p>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                <strong>Vehicle: </strong> {item.carId?.name || ""}
                                            </p>
                                            <p className="text-black dark:text-white">
                                                <strong>Normal hour price: </strong> {item.normalhoursprice}
                                            </p>
                                            <p className="text-black dark:text-white mb-5">
                                                <strong>Out of hours price: </strong> {item.outofhoursprice}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button className="hover:text-primary" onClick={() => handleDeleteFare(item._id)}>
                                                    <DeleteButtons />
                                                </button>
                                                <button className="hover:text-primary" onClick={() => handleUpdateLocation(item)}>
                                                    <EditButtons />
                                                </button>
                                            </div>
                                        </td>
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
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Previous
                        </button>
                        <p>Page {currentPage} of {totalPages}</p>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    contentLabel="Add Location Modal"
                    className="flex justify-center items-center h-screen w-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
                >
                    <AddFixFares
                        onClose={() => {
                            handleCloseModal();
                            refetch();
                        }}
                        onAddLocation={handleNewLocation}
                        mapLoaded={mapLoaded}
                        addressInput={addressInput}
                    />
                </Modal>

                {selectedFare && (
                    <Modal
                        isOpen={isUpdateModalOpen}
                        onRequestClose={handleCloseUpdateModal}
                        contentLabel="Update Location Modal"
                        className="flex justify-center items-center h-screen w-full"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
                    >
                        <UpdateFixFares
                            onClose={() => {
                                handleCloseUpdateModal();
                                refetch();
                            }}
                            onUpdateLocation={handleUpdateFare}
                            mapLoaded={mapLoaded}
                            fare={selectedFare}
                        />
                    </Modal>
                )}

                {showSuccessSnackbar && <SucessSnakeBar />}

                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    message="Are you sure you want to delete this fare?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={onCloseModal}
                />
            </div>
        </div>
    );
}

export default FixFares;
