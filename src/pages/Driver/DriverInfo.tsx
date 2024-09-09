import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import DriverDetails from './Screens/DriverDetails';
import DriverShift from './Screens/DriverShift';
import PdaSimDetails from './Screens/PdaSimDetails';
import CompanyVehicle from './Screens/CompanyVehicle';
import CompanyDocument from './Screens/CompanyDocument';

const DriverInfo = () => {
  const tabs = [
    {
      id: 'driverinfo',
      label: 'Drivr Info',
    },
    {
      id: 'drivershifts',
      label: 'Driver Shifts',
    },
    {
      id: 'vehicleshistory',
      label: 'Vehicle History',
    },
    {
      id: 'pdadetail',
      label: 'PDA/SIM Detail',
    },
    {
      id: 'complaints',
      label: 'Complaints',
    },
    {
      id: 'attributes',
      label: 'Attributes',
    },
    {
      id: 'companyvehicle',
      label: 'Company Vehicle',
    },
    {
      id: 'companyDocument',
      label: 'Company Document',
    },
  ];

  const [activeTab, setActiveTab] = useState('driverinfo');

  return (
    <div className="rounded-lg border border-stroke bg-white px-5 py-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between  items-center ">
          <div>
            {' '}
            <h1 className="text-2xl dark:text-white  text-black my-2 font-bold  ">
              Driver Detail
            </h1>
          </div>
          <Link to="/drivers">
            <div className="text-4xl font-bold text-black dark:text-white">
              <IoIosArrowRoundBack />
            </div>
          </Link>
        </div>

        <div>
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              role="tablist"
            >
              {tabs.map((tab) => (
                <li className="mr-2" role="presentation" key={tab.id}>
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === tab.id
                        ? '  dark:bg-slate-600  bg-primary text-white rounded-t-lg'
                        : 'text-slate-400 hover:text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:border-transparent dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    role="tab"
                    aria-controls={tab.id}
                    aria-selected={activeTab === tab.id}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {activeTab === 'driverinfo' && <DriverDetails />}
          {activeTab === 'drivershifts' && <DriverShift />}
          {activeTab === 'pdadetail' && <PdaSimDetails />}
          {activeTab === 'companyDocument' && <CompanyDocument />}
          {activeTab === 'companyvehicle' && <CompanyVehicle />}
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
