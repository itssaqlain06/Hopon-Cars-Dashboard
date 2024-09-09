import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import AddBooking from './AddBooking';
import { AppDispatch } from '../../redux/usersData/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchBookingQuery } from '../../redux/usersData/booking';
import DeleteButtons from '../../components/Buttons/DeleteButton';
import EditButtons from '../../components/Buttons/EditButton';
import SucessSnakeBar from '../../components/SnakeBar/SucessSnakeBar';

const Booking = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { data: bookingData = [] } = useFetchBookingQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(bookingData.length / itemsPerPage);
  const currentItems = bookingData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddBooking = () => {
    navigate('/booking/add-booking');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateInput: any): string => {
    const date =
      typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput;
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new TypeError('Invalid date input');
    }
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day}-${month + 1}-${year}`;
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div
          style={{
            display: 'flex',
            marginBottom: 10,
            justifyContent: 'space-between',
          }}
        >
          <h1 className="text-2xl text-white my-2 font-bold">Bookings</h1>
          <button
            className="mt-4 py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleAddBooking}
          >
            Add Booking
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                  #
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Passenger Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Phone
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Pickup Status
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Driver
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Vehicle
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Pickup Time
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Pickup Date
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Pickup Point
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Destination
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Via Points
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Fares
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Payment Type
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Account Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  PIN
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((booking, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.client_info.client_name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">
                      {booking.client_info.client_phone}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.booking_status}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.driver}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.vehicle_info.vehicles}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.booking_hour}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">
                      {formatDate(booking.booking_date)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.booking_address}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.booking_destination}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {booking.booking_via.map((via_points, index) => (
                      <p className="text-sm" key={index}>
                        {via_points}
                      </p>
                    ))}
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">
                      {booking.booking_ride_charges.total_amount}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">
                      {booking.vehicle_info.booking_payment}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.client_info.client_acc}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-sm">{booking.client_info.client_pin}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <DeleteButtons />
                      </button>
                      <button className="hover:text-primary">
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
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-600 text-slate-400'
              }`}
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
          <p>
            Page {currentPage} of {totalPages}
          </p>
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
        contentLabel="Add Booking Modal"
        className="flex justify-center items-center h-screen w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
      >
        <AddBooking onClose={handleCloseModal} />
      </Modal>
      {showSuccessSnackbar && <SucessSnakeBar />}
    </div>
  );
};

export default Booking;
