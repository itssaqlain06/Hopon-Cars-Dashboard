import SaveAndNew from '../../../components/Buttons/SaveAndNew';
import SaveAndClose from '../../../components/Buttons/SaveAndClose';
import { useState } from 'react';

const CompanyDocument = () => {
  const [rows, setRows] = useState([{}]);

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main content of all the details */}
      <div className="col-span-12">
        {/* Expiry Details */}
        <div className="col-span-12">
          {rows.map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 mt-6"
            >
              <div className="flex flex-row items-center gap-5 py-5">
                <h2 className="dark:text-white text-black text-nowrap font-bold text-xl">
                  Expiry date
                </h2>
                <hr className="w-full h-1 bg-secondary border-0 dark:bg-gray-700 rounded-lg" />
              </div>
              <div className="grid grid-cols-12 gap-2">
                {/* Expiry Date */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded bg-gray dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    name={`expiryDate-${index}`}
                  />
                </div>

                {/* Badge # */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Badge #
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Badge #"
                    name={`badge-${index}`}
                  />
                </div>

                {/* Document Title */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Document Title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded bg-gray dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Document Title"
                    name={`documentTitle-${index}`}
                  />
                </div>

                {/* File Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    File Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded bg-gray dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="File Name"
                    name={`fileName-${index}`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="col-span-2 flex gap-2 items-end mb-2">
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-2 rounded"
                    onClick={() => removeRow(index)}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-2 rounded"
                  >
                    Browse
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-2 py-2 rounded"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row-reverse gap-3 my-3 mx-1">
          <button>
            <SaveAndNew />
          </button>
          <button
            className="bg-green-500 rounded p-2 text-white"
            onClick={addRow}
          >
            Add New Row
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDocument;
