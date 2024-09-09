import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useFetchUsersQuery } from '../../redux/usersData/api';
import { useFetchCarsQuery } from '../../redux/usersData/vehiclesData';
import { useFetchAdminsQuery } from '../../redux/usersData/adminLogin'

const ECommerce: React.FC = () => {
  // Fetching users count
  const { data: usersData } = useFetchUsersQuery();
  const totalUsers = usersData ? usersData.passengers.length : 0;

  // Fetching admins count from Redux store
  const { data: adminsData } = useFetchAdminsQuery()
  const totalAdmins = adminsData ? adminsData.admins.length : 0

  // Fetching cars count
  const { data: cars } = useFetchCarsQuery();
  const totalCars = cars ? cars.length : 0;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Users" total={totalUsers || 0}>
          <FontAwesomeIcon className="white" icon={faUser} />
        </CardDataStats>
        <CardDataStats title="Admins" total={totalAdmins}>
          <FontAwesomeIcon icon={faUserTie} />
        </CardDataStats>
        <CardDataStats title="Cars" total={totalCars.toString()}>
          <FontAwesomeIcon icon={faCar} />
        </CardDataStats>
        <CardDataStats title="" total="">
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
      </div>
    </>
  );
};

export default ECommerce;
