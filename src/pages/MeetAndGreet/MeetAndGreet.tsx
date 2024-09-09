import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import EditButtons from '../../components/Buttons/EditButton';
import AddMeetAndGreet from './AddMeetAndGreet';
import UpdateMeetAndGreet from './UpdateMeetAndGreet';
import DeleteButtons from '../../components/Buttons/DeleteButton';
import { LoadScript } from '@react-google-maps/api';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { useGetMeetAndGreetQuery, useDeleteMeetAndGreetMutation } from '../../redux/usersData/meetAndGreet';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';
import GoogleMapsLoader from '../../components/MapLoader/GoogleMapsLoader';

const MeetAndGreet: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<any>(false);
    const [libraries] = useState(['places']);


    const { data: meetandgreet, refetch, isFetching } = useGetMeetAndGreetQuery()
    const [deleteMeetAndGreet] = useDeleteMeetAndGreetMutation()

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEpezNDENEaLW4Hog5yW5D-YIa5mbBCMA&libraries=places`;
        script.async = true;
        script.onload = () => setMapLoaded(true);
        script.onerror = (error) => console.error('Failed to load Google Maps:', error);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        setIsLoading(isFetching)
    }, [isFetching])

    // Pagination
    // const [currentPage, setCurrentPage] = useState(1);
    // const rowsPerPage = 10;
    // const totalPages = Math.ceil(meetandgreet.length / rowsPerPage);

    // const handleClickNext = () => {
    //     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    // };

    // const handleClickPrev = () => {
    //     setCurrentPage((prev) => Math.max(prev - 1, 1));
    // };

    // const handlePageChange = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    // };

    // const paginatedData = meetandgreet.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Modal handlers
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        refetch()
    };

    const handleOpenUpdateModal = (item: any) => {
        setSelectedItem(item);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setSelectedItem(null);
        setIsUpdateModalOpen(false);
        refetch()
    };

    const addressInput = useRef<any>(null);

    const handleLoadScriptLoad = () => {
        setMapLoaded(true);
    };

    const handleLoadScriptError = (error: any) => {
        console.error('Failed to load Google Maps:', error);
    };

    const handleDelete = (user: any) => {
        setIsModalOpen(true);
        setDeleteId(user._id)
        console.log(deleteId)
    }

    const confirmDeleteMeetAndGreet = async () => {
        if (deleteId) {
            try {
                await deleteMeetAndGreet(deleteId)
                setIsModalOpen(false)
                setSelectedItem(null)
                refetch()
                console.log(deleteId)
            } catch (error) {
                console.error('Failed to delete the meet and greet', error)
            }
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50">
                    <Dots size={30} color='white' />
                </div>
            )}
            <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ${isLoading ? 'blur' : ''}`}>
                <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                    <h1 className='text-2xl text-white my-2 font-bold'>Meet and Greet</h1>
                    <button
                        className="px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={handleOpenAddModal}
                    >
                        Add Meet and Greet
                    </button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">#</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"> Meet and greet type</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Postcode</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Cost(£)</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Waiting cost</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Waiting time</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetandgreet?.map((user: any, index: any) => (
                                <tr key={index}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="text-sm">{index + 1}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="text-sm">{user.meet_and_greet_type}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.description}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.postcode}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.cost}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.additional_cost}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.waiting_time}</p>
                                    </td>
                                    {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.additional_cost_per_time}</p>
                                    </td> */}
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button className="hover:text-primary" onClick={() => handleDelete(user)}>
                                                <DeleteButtons />
                                            </button>
                                            <button className="hover:text-primary" onClick={() => handleOpenUpdateModal(user)}>
                                                <EditButtons />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal
                    isOpen={isAddModalOpen}
                    onRequestClose={handleCloseAddModal}
                    contentLabel="Add Admin Modal"
                    className="flex justify-center items-center h-screen w-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
                >
                    <AddMeetAndGreet
                        onClose={handleCloseAddModal}
                        mapLoaded={mapLoaded}
                        addressInput={addressInput}
                    />
                </Modal>
                <Modal
                    isOpen={isUpdateModalOpen}
                    onRequestClose={handleCloseUpdateModal}
                    contentLabel="Update Admin Modal"
                    className="flex justify-center items-center h-screen w-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
                >
                    {selectedItem && (
                        <UpdateMeetAndGreet
                            onClose={handleCloseUpdateModal}
                            mapLoaded={mapLoaded} // Pass mapLoaded state
                            addressInput={addressInput}
                            initialData={selectedItem} // Pass the selected item to the update modal
                        />
                    )}
                </Modal>
                {/* <div className="flex justify-center items-center mt-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 mx-1  rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
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
            </div> */}

                <ConfirmationModal
                    isOpen={isModalOpen}
                    message="Are you sure you want to delete this?"
                    onConfirm={confirmDeleteMeetAndGreet}
                    onCancel={closeModal}
                />
            </div>
        </>

    );
};

export default MeetAndGreet;
