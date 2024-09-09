import { useState } from 'react';
import AddButton from '../../../components/Buttons/AddButton';
import NewButton from '../../../components/Buttons/NewButton';
import SaveAndNew from '../../../components/Buttons/SaveAndNew';
import SaveAndClose from '../../../components/Buttons/SaveAndClose';

const DriverShift = () => {
  const [shifts, setShifts] = useState<string>('');
  const [fromTime, setFromTime] = useState<string>('');
  const [toTime, setToTime] = useState<string>('');
  const [shiftList, setShiftList] = useState<
    Array<{ shifts: string; fromTime: string; toTime: string }>
  >([]);

  const handleAdd = () => {
    if (shifts && fromTime && toTime) {
      setShiftList([...shiftList, { shifts, fromTime, toTime }]);
      setShifts('');
      setFromTime('');
      setToTime('');
    }
  };

  const handleClear = () => {
    setShifts('');
    setFromTime('');
    setToTime('');
  };

  return (
    <>
      {/* Availability */}
      <div className="col-span-9">
        <div className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 mt-6">
          <div className="flex flex-row items-center gap-5 py-5">
            <h2 className="dark:text-white text-black text-nowrap font-bold text-xl">
              Avaliablity
            </h2>
            <hr className="w-full h-1 bg-secondary border-0 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Became Available
              </label>
              <input
                type="date"
                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Ending Date
              </label>
              <input
                type="date"
                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
              />
            </div>
            <div className="flex items-center gap-3 mt-4 justify-center">
              <label className="block text-sm font-medium text-black dark:text-white">
                End Driver
              </label>
              <input type="checkbox" className="rounded" />
              <AddButton />
              <NewButton />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-9">
        <div className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 mt-6">
          <h2 className="dark:text-white text-black font-bold text-2xl mb-4">
            Driver shifts
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Driver No Input */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Shifts
              </label>
              <select
                value={shifts}
                onChange={(e) => setShifts(e.target.value)}
                className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
              >
                <option value="model1">Day Shift</option>
                <option value="model2">Night Shift</option>
              </select>
            </div>
            {/* Time Pickers */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  From Time
                </label>
                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-full bg-gray dark:bg-slate-600 rounded py-2 px-3 mt-1 mb-2 outline-none text-black dark:text-white border border-slate-600 dark:border-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  To Time
                </label>
                <input
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-full bg-gray dark:bg-slate-600 rounded py-2 px-3 mt-1 mb-2 outline-none text-black dark:text-white border border-slate-600 dark:border-none"
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-3 flex-row mt-[24%] pb-2">
              <button onClick={handleAdd}>
                <AddButton />
              </button>
              <button onClick={handleClear}>
                <NewButton />
              </button>
            </div>
          </div>
          {/* Display Shift List */}
          {shiftList.length > 0 ? (
            <div className="max-w-full overflow-x-auto mt-5">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      #
                    </th>
                    <th className="min-w-[170px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Shifts
                    </th>
                    <th className="min-w-[170px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      From Mile
                    </th>
                    <th className="min-w-[170px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      To Mile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shiftList.map((items, index) => (
                    <tr key={index}>
                      <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
                        <p className="text-black dark:text-slate-400">
                          {index + 1}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-3 px-2 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="text-sm font-bold text-slate-400">
                          {items.shifts}
                        </p>
                      </td>
                      <td
                        className={`border-b border-[#eee] py-3 px-10  dark:border-strokedark`}
                      >
                        <p className="text-sm font-bold text-slate-400">
                          {items.fromTime}
                        </p>
                      </td>
                      <td
                        className={`border-b border-[#eee] py-3 px-10  dark:border-strokedark`}
                      >
                        <p className="text-sm font-bold text-slate-400">
                          {items.toTime}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <div className="flex flex-row-reverse gap-3 my-3 mx-1">
            <button>
              <SaveAndNew />
            </button>
            <button>
              <SaveAndClose />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverShift;
