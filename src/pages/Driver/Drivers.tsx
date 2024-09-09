import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchDriverQuery } from '../../redux/usersData/driver';
import EditButtons from '../../components/Buttons/EditButton';
import ViewButon from '../../components/Buttons/ViewButton';

const Drivers = () => {
  const { data: driverData } = useFetchDriverQuery();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(driverData);
  }, [driverData]);

  const handleViewClick = (id) => {
    navigate(`/driverInformation/${id}`);
  };

  return (
    <div className="rounded-lg border border-stroke bg-white px-5 py-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl dark:text-white text-black my-2 font-bold">
            Drivers
          </h1>
        </div>

        <Link to={'/driverinfo'}>
          <button className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
            Add Driver
          </button>
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                #
              </th>
              <th className="min-w-[170px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                Name
              </th>
              <th className="min-w-[170px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Phone
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {console.log('driver',driverData)}
            {driverData?.map((item, index) => (
              <tr key={item._id}>
                <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                  <p className="text-black dark:text-slate-400">{index + 1}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-10 dark:border-strokedark text-center">
                  <p className="text-sm font-bold text-slate-400">{item.client_info.client_name}</p>
                </td>
                <td className="border-b border-[#eee] py-3 px-10 dark:border-strokedark text-center">
                  <p className="text-black dark:text-white">
                    {item.client_info.client_email}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-10 dark:border-strokedark text-center">
                  <p className="text-black dark:text-white">
                    {item.client_info.client_phone}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark text-center">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => handleViewClick(item._id)}>
                      <ViewButon />
                    </button>
                    <button className="hover:text-primary" onClick={() => console.log(item._id)}>
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
  );
};

export default Drivers;
