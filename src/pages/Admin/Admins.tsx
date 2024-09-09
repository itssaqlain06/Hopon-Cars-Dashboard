import React, { useEffect, useState } from 'react';
import { useFetchAdminsQuery } from '../../redux/usersData/adminLogin';
import AddAdmin from './AddAdmin';
import EditButtons from '../../components/Buttons/EditButton';
import UpdateAdmin from './UpdateAdmin';
import SucessSnakeBar from '../../components/SnakeBar/SucessSnakeBar';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';

const Admins: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showSuccessSnkeBar, setShowSuccessSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState<any>(false);

    const { data: response = [], refetch, isFetching } = useFetchAdminsQuery();
    const adminData = response.admins || [];

    useEffect(() => {
        setIsLoading(isFetching)
    }, [isFetching])

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        refetch();
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleOpenUpdateModal = (admin: any) => {
        setSelectedAdmin(admin);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedAdmin(null);
        refetch();
        setShowSuccessSnackbar(true);
        setTimeout(() => {
            setShowSuccessSnackbar(false)
        }, 3000);
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(adminData.length / rowsPerPage);

    const handleClickNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleClickPrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = adminData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50">
                    <Dots size={30} color='white' />
                </div>
            )}
            <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ${isLoading ? 'blur' : ''}`}>
                <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                    <h1 className='text-2xl text-white my-2 font-bold'>Admins</h1>
                    <button onClick={handleOpenAddModal} className="px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
                        Add Admin
                    </button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">#</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">User</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Phone</th>
                                <th className=" py-4 px-4 font-medium text-black dark:text-white">Role</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((user: any, index: any) => (
                                <tr key={index}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="text-sm">{index + 1}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="text-sm">{user.username}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.email}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.phone}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.userType}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex justify-center items-center">
                                        <p className={`text-sm font-medium px-2 py-1 rounded-lg ${user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {user.status}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <button className="hover:text-primary" onClick={() => handleOpenUpdateModal(user)}>
                                            <EditButtons />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {isAddModalOpen && (
                    <AddAdmin
                        isOpen={isAddModalOpen}
                        onRequestClose={() => {
                            handleCloseAddModal();
                            refetch()
                        }}
                    />
                )}
                {isUpdateModalOpen && selectedAdmin && (
                    <UpdateAdmin
                        isOpen={isUpdateModalOpen}
                        onRequestClose={() => {
                            handleCloseUpdateModal()
                        }}
                        admin={selectedAdmin}
                        onUpdateAdmin={(updatedAdmin) => {
                            console.log('Updated Admin:', updatedAdmin);
                            handleCloseUpdateModal();
                        }}
                    />
                )}
                <div className="flex justify-center items-center mt-2">
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
                {showSuccessSnkeBar && <SucessSnakeBar />}
            </div>
        </>
    );
};

export default Admins;
