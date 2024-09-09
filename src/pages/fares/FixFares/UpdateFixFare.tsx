import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useFetchCarsQuery } from '../../../redux/usersData/vehiclesData';
import { useUpdateFixFareMutation } from '../../../redux/usersData/fixFares';
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
import { useGetPostcodesQuery } from '../../../redux/usersData/postcodes';

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

const UpdateFixFares = ({ onClose, fare }: any) => {
    const [pickupLocation, setPickupLocation] = useState<string[]>(fare.pickuppostcode.map((loc: any) => loc) || []);
    const [dropoffLocation, setDropoffLocation] = useState<string[]>(fare.destinationpostcode.map((loc: any) => loc) || []);
    const [carId, setCarId] = useState(fare.carId._id);
    const [normalHoursPrice, setNormalHoursPrice] = useState(fare.normalhoursprice);
    const [outofHoursPrice, setOutofHoursPrice] = useState(fare.outofhoursprice);
    const [ukPostcodes, setUkPostcodes] = useState([]);
    const theme = useTheme();

    const { data: postcodesData } = useGetPostcodesQuery();
    const postcodes = postcodesData || [];

    const [updateFare] = useUpdateFixFareMutation();
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

        const fairData = {
            id: fare._id,
            carId,
            pickuppostcode: pickupLocation,
            destinationpostcode: dropoffLocation,
            normalhoursprice: normalHoursPrice,
            outofhoursprice: outofHoursPrice
        };

        try {
           
            const result = await updateFare({
                id: fairData.id,
                carId: fairData.carId,
                pickuppostcode: fairData.pickuppostcode,
                destinationpostcode: fairData.destinationpostcode,
                normalhoursprice: fairData.normalhoursprice,
                outofhoursprice: fairData.outofhoursprice
            }).unwrap();
           
            onClose();
        } catch (error) {
            console.error("Failed to update fare:", error);
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

    const handlepickupLocation = (event, newValue) => {
        if (newValue && !pickupLocation.includes(newValue)) {
            setPickupLocation((lastItems) => [...lastItems, newValue]);
        }
    };
    const removepickupLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const datacodes = pickupLocation.filter(code => code !== e.target.dataset.value);
            setPickupLocation(datacodes);
    };
    const handledropoffLocation = (event, newValue) => {
        if (newValue && !dropoffLocation.includes(newValue)) {
            setDropoffLocation((lastItems)=> [...lastItems, newValue]);
        }
    };
    const removedropoffLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const datacodes = dropoffLocation.filter(code => code !== e.target.dataset.value);
            setPickupLocation(datacodes);
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Update Fare"
            className="flex justify-center items-center h-screen w-full"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Update Fare</h2>

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
                        {isLoading ? (
                            <option disabled>Loading...</option>
                        ) : carsError ? (
                            <option disabled>Error loading cars</option>
                        ) : (
                            carsData.map((car) => (
                                <option key={car._id} value={car._id}>
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
                      
                        {pickupLocation.map((item, idx)=>(
                                <span key={idx} className='py-1 px-3 bg-slate-200 rounded-lg'>{item} <strong onClick={removepickupLocation} data-value={item} className='ml-2 fw-'>X</strong></span>
                        ))}
                    </div>
                    <FormControl sx={{ width: '100%' }}>
                        <Autocomplete
                            disablePortal
                            options={ukPostcodes}
                            renderInput={(params) => <TextField {...params} label="Choose Pickup Postcodes"   onChange={handlePostcodes} />}
                            onChange={handlepickupLocation}
                        />
                    </FormControl>
                </div>

                <div className="mb-4 border p-2 rounded-md">
                    <label htmlFor="dropoffLocation" className="block text-gray-700 font-extrabold mb-2">
                        DropOff Postcode
                    </label>
                    <div className='flex flex-wrap mb-3 gap-2'>
                        {dropoffLocation.map((item: any, idx)=>(
                                <span key={idx} className='py-1 px-3 bg-slate-200 rounded-lg'>{item} <strong onClick={removedropoffLocation} data-value={item} className='ml-2 fw-'>X</strong></span>
                        ))}
                    </div>
                    <FormControl sx={{ width: '100%' }}>
                        <Autocomplete
                            disablePortal
                            options={ukPostcodes}
                            renderInput={(params) => <TextField {...params} label="Dropoff Postcodes"   onChange={handlePostcodes} />}
                            onChange={handledropoffLocation}
                        />
                    </FormControl>
                </div>

                {/* normal hours and out o hours price combined div */}
                <div className='flex flex-row justify-evenly'>
                    <div className="mb-4">
                        <label htmlFor="normalHoursPrice" className="block text-gray-700 font-bold mb-2">
                            Normal hours price
                        </label>
                        <input
                            type="number"
                            value={normalHoursPrice}
                            onChange={(e) => setNormalHoursPrice(e.target.value)}
                            className="w-full border rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter price"
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
                            placeholder="Enter price"
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
                        onClick={() => { handleSubmit() }}
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mx-2"
                    >
                        Update Fare
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateFixFares;