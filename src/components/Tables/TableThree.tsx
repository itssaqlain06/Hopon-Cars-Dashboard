import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllAdmins } from '../../redux/admins/adminSlice'

interface TableThreeProps {
  onAddUser: () => void;
  onEditUser: (index: number) => void;
  onDeleteUser: (index: number) => void;
}

const TableThree: React.FC<TableThreeProps> = ({ onAddUser, onEditUser, onDeleteUser }) => {
  const admins = useSelector(selectAllAdmins);
  useEffect(() => {
    console.log('admins Data', admins)
  }, [])

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div style={{ display: 'flex', marginLeft: '87%', marginBottom: 10 }}>
        {/* <button onClick={onAddUser} className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
          Add Admin
        </button> */}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">#</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">User</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Phone</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Role</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((user: any, index: any) => (
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
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => onDeleteUser(index)}>
                    </button>
                    <button className="hover:text-primary" onClick={() => onEditUser(index)}>
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

export default TableThree;
