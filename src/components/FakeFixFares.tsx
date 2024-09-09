import { LoadScript } from '@react-google-maps/api';
import { useRef, useState } from 'react';
import Modal from 'react-modal';
import AddFixFares from './AddFixFares';
import UpdateFixFares from './UpdateFixFare';
import { AppDispatch } from '../../../redux/usersData/store';
import { useDispatch } from 'react-redux';
import { useGetFixFareQuery, useDeleteFixFareMutation } from '../../../redux/usersData/fixFares';
import { addLocation } from '../../../redux/usersData/locationSlice';
import DeleteButtons from '../../../components/Buttons/DeleteButton';
import EditButtons from '../../../components/Buttons/EditButton';

const FixFares = () => {
    const { data: fixFares = [], refetch } = useGetFixFareQuery();
    const [deleteFare] = useDeleteFixFareMutation();
    const handleDeleteFare = async (id: any) => {
        try {
            await deleteFare(id);
            refetch()
        } catch (error) {
            console.error('Failed to delete fare:', error);
        }
    };

    const dispatch: AppDispatch = useDispatch();

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const addressInput = useRef(null);
    const [libraries] = useState(['places']);
    const [selectedFare, setSelectedFare] = useState(null);

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
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        refetch()
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

    return (
        <div>
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
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Vehicle</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Pickup Location</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Dropoff Location</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Rate</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item: any, index: any) => (
                                <tr key={item.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-sm">{index + 1}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{item.carId.name}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{item.pickup_location}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{item.dropoff_location}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-green-600">₤{item.rate}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
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
            <LoadScript
                googleMapsApiKey="AIzaSyBEpezNDENEaLW4Hog5yW5D-YIa5mbBCMA"
                libraries={libraries}
                onLoad={handleLoadScriptLoad}
                onError={handleLoadScriptError}
            />
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
                        refetch()
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
                            refetch()
                        }}
                        onUpdateLocation={handleUpdateFare}
                        mapLoaded={mapLoaded}
                        fare={selectedFare}
                    />
                </Modal>
            )}
        </div>
    );
}

export default FixFares;
