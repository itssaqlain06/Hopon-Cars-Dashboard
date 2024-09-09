import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useFetchCarsQuery } from '../../../redux/usersData/vehiclesData';
import { useAddFixFareMutation } from '../../../redux/usersData/fixFares';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { Theme, useTheme } from '@mui/material/styles';
import { useGetPostcodesQuery, useAddPostcodesMutation } from '../../../redux/usersData/postcodes';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, locationName: readonly string[], theme: Theme) {
    return {
        fontWeight: locationName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

interface AddFixFaresProps {
    onClose: () => void;
    onAddLocation: (location: {
        carId: string,
        pickup_location: string,
        dropoff_location: string,
        rate: number
    }) => void;
}

const AddFixFares: React.FC<AddFixFaresProps> = ({ onClose, onAddLocation }) => {
    const [pickupLocation, setPickupLocation] = useState<string[]>([]);
    const [dropoffLocation, setDropoffLocation] = useState<string[]>([]);
    const [carId, setCarId] = useState('');
    const [normalHoursPrice, setNormalHoursPrice] = useState('');
    const [outofHoursPrice, setOutofHoursPrice] = useState('');
    const [ukPostcodes, setUkPostcodes] = useState([]);
    const [pickupPostCodes, setPickupPostCodes] = useState([]);
    const [dropOffPostCodes, setdropOffPostCodes] = useState([]);

    const theme = useTheme();

    const { data: postcodesData } = useGetPostcodesQuery();
    const postcodes = [];

    const [addUser] = useAddFixFareMutation();
    const { data: carsData = [], isLoading, isError: carsError } = useFetchCarsQuery();

    const handlePickupChange = (event: SelectChangeEvent<typeof pickupLocation>) => {
        const { target: { value } } = event;
        setPickupLocation(typeof value === 'string' ? value.split(',') : value);
    };

    const handleDropoffChange = (event: SelectChangeEvent<typeof dropoffLocation>) => {
        const { target: { value } } = event;
        setDropoffLocation(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();



        const newFare = {
            carId,
            pickuppostcode: pickupPostCodes,
            destinationpostcode: dropOffPostCodes,
            normalhoursprice: normalHoursPrice,
            outofhoursprice: outofHoursPrice
        };

        try {
            await addUser(newFare).unwrap();
            onAddLocation(newFare);
            onClose();
        } catch (error) {
            console.error("Failed to add fare:", error);
        }
    };

    const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCarId(e.target.value);
    };
    const autoPostCodes = (id)=>{
        if(id != ""){
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.postcodes.io/postcodes/${id}/autocomplete`);
            xhr.onload = function() {
            if (xhr.status === 200) {
                setUkPostcodes(JSON.parse(xhr.responseText).result);
            }
            };
            xhr.send();
        }
    };
    const handlePostcodes = (e: React.ChangeEvent<HTMLSelectElement>) => {
        autoPostCodes(e.target.value);
    };

    const handlePickUpPostcodes = (event, newValue) => {
        if (newValue && !pickupPostCodes.includes(newValue)) {
            setPickupPostCodes((lastItems) => [...lastItems, newValue]);
        }
    };
    const removepickupPostCodes = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const datacodes = pickupPostCodes.filter(code => code !== e.target.dataset.value);
            setPickupPostCodes(datacodes);
    };
    const handleDropOffPostcodes = (event, newValue) => {
        if (newValue && !dropOffPostCodes.includes(newValue)) {
            setdropOffPostCodes((lastItems)=> [...lastItems, newValue]);
        }
    };
    const removedropOffPostCodes = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const datacodes = dropOffPostCodes.filter(code => code !== e.target.dataset.value);
            setPickupPostCodes(datacodes);
    };
    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Add Location"
            className="flex justify-center items-center h-screen w-full mt-15 z-99999999"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Add Fare</h2>

                <div className="mb-4">
                    <label htmlFor="carId" className="block text-gray-700 font-bold mb-2">
                        Car
                    </label>
                    <select
                        id="carId"
                        name="carId"
                        value={carId}
                        onChange={handleCarChange}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    >
                        <option>Choose Vehicle</option>
                        {isLoading ? (
                            <option disabled>Loading...</option>
                        ) : carsError ? (
                            <option disabled>Error loading cars</option>
                        ) : (
                            carsData.map((car,idx) => (

                                <option key={idx} value={car._id}>
                                    {car.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="mb-4 border p-2 rounded-md">
                    <label htmlFor="pickupLocation" className="block text-gray-700 font-bold mb-2">
                        Pickup Postcode
                    </label>
                    <div className='flex flex-wrap mb-3 gap-2'>
                        {pickupPostCodes.map((item, idx)=>(
                                <span key={idx} className='py-1 px-3 bg-slate-200 rounded-lg'>{item} <strong onClick={removepickupPostCodes} data-value={item} className='ml-2 fw-'>X</strong></span>
                        ))}
                    </div>
                    <FormControl sx={{ width: '100%' }}>
                        <Autocomplete
                            disablePortal
                            options={ukPostcodes}
                            renderInput={(params) => <TextField {...params} label="Choose Pickup Postcodes"   onChange={handlePostcodes} />}
                            onChange={handlePickUpPostcodes}
                        />
                    </FormControl>
                </div>

                <div className="mb-4 border p-2 rounded-md">
                    <label htmlFor="dropoffLocation" className="block text-gray-700 font-extrabold mb-2">
                        DropOff Postcode
                    </label>
                    <div className='flex flex-wrap mb-3 gap-2'>
                        {dropOffPostCodes.map((item, idx)=>(
                                <span key={idx} className='py-1 px-3 bg-slate-200 rounded-lg'>{item} <strong onClick={removedropOffPostCodes} data-value={item} className='ml-2 fw-'>X</strong></span>
                        ))}
                    </div>
                    <FormControl sx={{ width: '100%' }}>
                        <Autocomplete
                            disablePortal
                            options={ukPostcodes}
                            renderInput={(params) => <TextField {...params} label="Dropoff Postcodes"   onChange={handlePostcodes} />}
                            onChange={handleDropOffPostcodes}
                        />
                    </FormControl>
                </div>

                {/* normal hours and out of hours div */}
                <div className='flex flex-row items-center justify-evenly'>
                    <div className="mb-4">
                        <label htmlFor="normalHoursPrice" className="block text-gray-700 font-bold mb-2">
                            Normal hours price
                        </label>
                        <input
                            type="number"
                            value={normalHoursPrice}
                            onChange={(e) => setNormalHoursPrice(e.target.value)}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter rate"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="outofHoursPrice" className="block text-gray-700 font-bold mb-2">
                            Out of hours price
                        </label>
                        <input
                            type="number"
                            value={outofHoursPrice}
                            onChange={(e) => setOutofHoursPrice(e.target.value)}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter rate"
                        />
                    </div>
                </div>

                <div className='flex flex-row-reverse'>
                    <button
                        type="button"
                        onClick={onClose}
                        className=" bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg "
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mx-2"
                    >
                        Add Fare
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddFixFares;
