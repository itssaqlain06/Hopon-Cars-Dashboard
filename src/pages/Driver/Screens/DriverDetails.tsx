import { useState } from 'react';
import SaveAndNew from '../../../components/Buttons/SaveAndNew';
import { useAddDriverDetailsMutation } from '../../../redux/usersData/driverDetails';
import { toast } from 'react-toastify';

interface FormData {
  driverNo: string;
  pdaPassword: string;
  pinCode: string;
  vat: string;
  hasPda: boolean;
  rentPaid: boolean;
  active: boolean;
  driverName: string;
  surname: string;
  mobileNo: string;
  telephoneNo: string;
  ni: string;
  dob: string;
  driverType: string;
  maxComm: string;
  minComm: string;
  weeklyRent: string;
  pdaRent: string;
  initialBalance: string;
  address: string;
  photo: File | null;
}

const DriverDetails = () => {
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    driverNo: '',
    pdaPassword: '',
    pinCode: '',
    vat: '',
    hasPda: false,
    rentPaid: false,
    active: false,
    driverName: '',
    surname: '',
    mobileNo: '',
    telephoneNo: '',
    ni: '',
    dob: '',
    driverType: '',
    maxComm: '',
    minComm: '',
    weeklyRent: '',
    pdaRent: '',
    initialBalance: '',
    address: '',
    photo: null,
  });

  const [newAddDriverDetails] = useAddDriverDetailsMutation();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const validateAndSetImage = (file: File) => {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    const maxSizeInMB = 2;
    const fileSizeInMB = file.size / 1024 / 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (png, jpg, jpeg, webp).');
      return;
    }

    if (fileSizeInMB > maxSizeInMB) {
      toast.error('File size exceeds 2MB limit. Please select a smaller file.');
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: file,
    }));
    setImage(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      validateAndSetImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();

    const {
      driverNo,
      pdaPassword,
      pinCode,
      vat,
      hasPda,
      rentPaid,
      active,
      driverName,
      surname,
      mobileNo,
      telephoneNo,
      ni,
      dob,
      driverType,
      maxComm,
      minComm,
      weeklyRent,
      pdaRent,
      initialBalance,
      address,
      photo,
    } = formData;

    formPayload.append('loginDetails[driver_no]', driverNo);
    formPayload.append('loginDetails[pda_password]', pdaPassword);
    formPayload.append('loginDetails[pin_code]', pinCode);
    formPayload.append('loginDetails[vat_percentage]', vat);
    formPayload.append('loginDetails[has_pda]', hasPda.toString());
    formPayload.append('loginDetails[rent_paid]', rentPaid.toString());
    formPayload.append('loginDetails[active]', active.toString());

    formPayload.append('driver_details[driver_name]', driverName);
    formPayload.append('driver_details[sur_name]', surname);
    formPayload.append('driver_details[mobile_no]', mobileNo);
    formPayload.append('driver_details[telephone_no]', telephoneNo);
    formPayload.append('driver_details[ni]', ni);
    formPayload.append('driver_details[dob]', dob);
    formPayload.append('driver_details[driver_type]', driverType);
    formPayload.append('driver_details[max_comm]', maxComm);
    formPayload.append('driver_details[min_comm]', minComm);
    formPayload.append('driver_details[weekly_rent]', weeklyRent);
    formPayload.append('driver_details[pda_rent]', pdaRent);
    formPayload.append('driver_details[initial_balance]', initialBalance);
    formPayload.append('driver_details[address]', address);

    if (photo) {
      formPayload.append('photo', photo);
    }

    try {
      const result = await newAddDriverDetails(formPayload).unwrap();
      toast(result.message);
      setFormData({
        driverNo: '',
        pdaPassword: '',
        pinCode: '',
        vat: '',
        hasPda: false,
        rentPaid: false,
        active: false,
        driverName: '',
        surname: '',
        mobileNo: '',
        telephoneNo: '',
        ni: '',
        dob: '',
        driverType: '',
        maxComm: '',
        minComm: '',
        weeklyRent: '',
        pdaRent: '',
        initialBalance: '',
        address: '',
        photo: null,
      });
      setImage(null);
    } catch (error) {
      toast.error('Internal Server Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="grid grid-cols-12 gap-6">
        {/* Main content of all the details */}
        <div className="col-span-9">
          {/* Login Details */}
          <div className="col-span-9">
            <div className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2">
              <div className="flex flex-row items-center gap-5 py-5">
                <h2 className="dark:text-white text-black text-nowrap font-bold text-xl">
                  Login Detail
                </h2>
                <hr className="w-full  h-1  bg-secondary border-0 dark:bg-gray-700 rounded-lg" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Driver No
                  </label>
                  <input
                    type="text"
                    name="driverNo"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Driver No"
                    value={formData.driverNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    PDA Password
                  </label>
                  <input
                    type="password"
                    name="pdaPassword"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="PDA Password"
                    value={formData.pdaPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="PIN Code"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Vat %
                  </label>
                  <input
                    type="number"
                    name="vat"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Vat %"
                    value={formData.vat}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Check box div */}
                <div className="flex flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-black dark:text-white">
                      Has PDA
                    </label>
                    <input
                      name="hasPda"
                      type="checkbox"
                      className="rounded"
                      checked={formData.hasPda}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-black dark:text-white">
                      Rent Paid
                    </label>
                    <input
                      name="rentPaid"
                      type="checkbox"
                      className="rounded"
                      checked={formData.rentPaid}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-black dark:text-white">
                      Active
                    </label>
                    <input
                      type="checkbox"
                      name="active"
                      className="rounded"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          <div className="col-span-9">
            <div className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 mt-6">
              {/* Main Label div */}
              <div className="flex flex-row items-center gap-5 py-5">
                <h2 className="dark:text-white text-black text-nowrap font-bold text-xl">
                  Driver Details
                </h2>
                <hr className="w-full  h-1  bg-secondary border-0 dark:bg-gray-700 rounded-lg" />
              </div>
              {/* Main content */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Driver Name"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Surname
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Mobile No
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Mobile No"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Telephone No
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Telephone No"
                    name="telephoneNo"
                    value={formData.telephoneNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    NI
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="NI"
                    name="ni"
                    value={formData.ni}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    DOB
                  </label>
                  <input
                    type="date"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Driver Type
                  </label>
                  <select
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    name="driverType"
                    value={formData.driverType}
                    onChange={handleInputChange}
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
                    Max Comm
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Max Comm"
                    name="maxComm"
                    value={formData.maxComm}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Min Comm
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Min Comm"
                    name="minComm"
                    value={formData.minComm}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Weekly Rent
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Weekly Rent"
                    name="weeklyRent"
                    value={formData.weeklyRent}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    PDA Rent
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="PDA Rent"
                    name="pdaRent"
                    value={formData.pdaRent}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Initial Balance"
                    name="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray rounded  dark:bg-slate-600 py-2 px-3 my-2 outline-none text-black dark:text-white border dark:border-none border-slate-600"
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-3 my-3 mx-1">
            <button type="submit">
              <SaveAndNew />
            </button>
          </div>
        </div>
        <div className="col-span-3">
          <div
            className="p-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark-2 h-full flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <h2 className="dark:text-white text-black text-nowrap font-bold text-xl mb-4">
              Photo
            </h2>
            <div className="border-1  p-1 border border-slate-500 rounded-sm">
              <div
                className="border border-1 border-slate-500 w-full h-40 flex items-center justify-center cursor-pointer p-2 rounded-sm"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-500">
                    Drag and drop an image here, or click to select
                  </p>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DriverDetails;
