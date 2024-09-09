import SaveAndNew from '../../../components/Buttons/SaveAndNew';
import SaveAndClose from '../../../components/Buttons/SaveAndClose';

const CompanyVehicle = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main content of all the details */}
      <div className="col-span-12">
        {/* Assigned Vehicle */}
        <div className="col-span-9">
          <div className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 mt-6">
            <div className="flex flex-row items-center gap-5 py-5">
              <h2 className="dark:text-white text-black text-nowrap font-bold text-xl">
                Assigned Vehicles
              </h2>
              <hr className="w-full  h-1  bg-secondary border-0 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Assigned On
                </label>
                <input
                  type="date"
                  className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  name="assignedOn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  name="endDate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Vehicle Type
                </label>
                <select
                  className="w-full bg-gray rounded dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  name="vehicleType"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="type1">Type 1</option>
                  <option value="type2">Type 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Vehicle Color
                </label>
                <select
                  className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  name="vehicleColor"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="color1">Color 1</option>
                  <option value="color2">Color 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Vehicle Model
                </label>
                <select
                  className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  name="vehicleModel"
                >
                  <option value="">Select</option>
                  <option value="model1">Model 1</option>
                  <option value="model2">Model 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Vehicle Log Book No
                </label>
                <input
                  type="text"
                  className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  placeholder="Vehicle Log Book No"
                  name="logBookNumber"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Vehicle Log Book Document
                </label>
                <input
                  type="file"
                  className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                  name="logBookDocument"
                />
              </div>
            </div>
          </div>
        </div>
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
  );
};

export default CompanyVehicle;
