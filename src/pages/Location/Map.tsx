import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import AddLocation from './AddLocation';
import UpdateLocation from './UpdateLocation';
import { LoadScript } from '@react-google-maps/api';
import { useFetchLocationsQuery, useDeleteLocationMutation, useUpdateLocationMutation } from '../../redux/usersData/locations';
import DeleteButtons from '../../components/Buttons/DeleteButton';
import EditButtons from '../../components/Buttons/EditButton';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import SucessSnakeBar from '../../components/SnakeBar/SucessSnakeBar';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';

const Map: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const addressInput = useRef(null);
    const [libraries] = useState(['places']);
    const [locationToUpdate, setLocationToUpdate] = useState<any>(null);
    const [locationToDelete, setLocationToDelete] = useState<any>(null);
    const [showSuccessSnkeBar, setShowSuccessSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data: response = [], refetch, isFetching } = useFetchLocationsQuery();
    const [deleteLocation] = useDeleteLocationMutation();
    const [updateLocation] = useUpdateLocationMutation();

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

    const handleLoadScriptLoad = () => {
        setMapLoaded(true);
    };

    const handleLoadScriptError = (error: any) => {
        console.error('Failed to load Google Maps:', error);
    };

    const handleAddLocation = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleUpdateLocation = (location: any) => {
        setLocationToUpdate(location);
        console.log(location)
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        refetch()
        setShowSuccessSnackbar(true);
        setTimeout(() => {
            setShowSuccessSnackbar(false)
        }, 3000);
    };

    const handleUpdatedLocation = async (location: any) => {
        try {
            await updateLocation({ _id: locationToUpdate._id, ...location }).unwrap();
            setIsUpdateModalOpen(false);
            refetch();
        } catch (error) {
            console.error('Failed to update location:', error);
        }
    };

    const handleDeleteLocation = (location: any) => {
        setLocationToDelete(location);
        setIsModalOpen(true);
    };

    const confirmDeleteLocation = async () => {
        if (locationToDelete) {
            try {
                await deleteLocation(locationToDelete._id).unwrap();
                setIsModalOpen(false);
                setLocationToDelete(null);
                refetch();
            } catch (error) {
                console.error('Failed to delete location:', error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setLocationToDelete(null);
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50">
                    <Dots size={30} color='white' />
                </div>
            )}
            <div className={isLoading ? 'blur' : ''}>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="flex justify-between mb-2.5">
                        <h1 className='text-2xl text-white my-2 font-bold'>Locations</h1>
                        <button onClick={handleAddLocation} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
                            Add Location
                        </button>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">#</th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Address</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Type</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Post code</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Pickup Charges</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Dropoff Charges</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response.map((location: any, index: number) => (
                                    <tr key={location._id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-sm">{index + 1}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{location.name + " " + location.address}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{location.type}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{location.postcode}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-green-500 dark:text-green-500">₤{location.pickupCharges}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-green-500 dark:text-green-500">₤{location.dropOffCharges}</p>
                                        </td>
                                        <td className=" flex justify-center items-center border-b border-[#eee] py-5 pr-14 dark:border-gray-700 mt-6 dark:border-strokedark">
                                            <p className={`text-sm font-medium px-2  rounded-lg ${location.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{location.status}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button className="hover:text-primary" onClick={() => handleDeleteLocation(location)}>
                                                    <DeleteButtons />
                                                </button>
                                                <button className="hover:text-primary" onClick={() => handleUpdateLocation(location)}>
                                                    <EditButtons />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* <LoadScript
                    googleMapsApiKey="AIzaSyBEpezNDENEaLW4Hog5yW5D-YIa5mbBCMA"
                    libraries={libraries}
                    onLoad={handleLoadScriptLoad}
                    onError={handleLoadScriptError}
                /> */}
                <Modal
                    isOpen={isAddModalOpen}
                    onRequestClose={() => {
                        handleCloseAddModal();
                        refetch()
                    }}
                    contentLabel="Add Location Modal"
                    className="flex justify-center items-center h-screen w-full"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
                >
                    <AddLocation
                        onClose={() => {
                            handleCloseAddModal();
                            refetch()
                        }}
                        mapLoaded={mapLoaded}
                        addressInput={addressInput}
                    />
                </Modal>
                <Modal
                    isOpen={isUpdateModalOpen}
                    onRequestClose={() => {
                        handleCloseUpdateModal();
                        refetch();
                    }}
                    contentLabel="Update Location Modal"
                    className="flex justify-center items-center"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
                >
                    {locationToUpdate && (
                        <UpdateLocation
                            onClose={() => {
                                handleCloseUpdateModal();
                                refetch();
                            }}
                            onUpdateLocation={handleUpdatedLocation}
                            mapLoaded={mapLoaded}
                            addressInput={addressInput}
                            location={locationToUpdate}
                        />
                    )}
                </Modal>
                <ConfirmationModal
                    isOpen={isModalOpen}
                    message="Are you sure you want to delete this location?"
                    onConfirm={confirmDeleteLocation}
                    onCancel={closeModal}
                />

                {showSuccessSnkeBar && <SucessSnakeBar />}
            </div>
        </>
    );
};

export default Map;
