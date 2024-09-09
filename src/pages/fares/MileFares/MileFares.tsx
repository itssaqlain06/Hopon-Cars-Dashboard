import { useEffect, useState } from 'react';
import { useGetFairsQuery, useUpdateHoursMutation } from '../../../redux/usersData/fairApi';
import AddMileFares from './AddMileFares';
import HourBlocks from './HoursBlock';
import HoursAndMileSettings from './HoursAndMileSettings';
import SucessSnakeBar from '../../../components/SnakeBar/SucessSnakeBar';

const MileFares = () => {
    const [isFareLoading, setIsFareLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editValues, setEditValues] = useState({});
    const [fromHour, setFromHour] = useState<number>(7);
    const [toHour, setToHour] = useState<number>(22);
    const [hourId, setHourId] = useState<string | null>(null);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState<boolean>(false);

    const { data: mileFares = [], error, isLoading, refetch, isFetching } = useGetFairsQuery();
    const [updateHours] = useUpdateHoursMutation();

    useEffect(() => {
        setIsFareLoading(isFetching);
    }, [isFetching]);

    useEffect(() => {
        if (mileFares.length > 0) {
            const hoursSetting = mileFares[0].hours;
            if (hoursSetting) {
                setHourId(hoursSetting._id);
                const fetchedNormalHours = hoursSetting.NormalHours || [];
                if (fetchedNormalHours.length > 0) {
                    const firstHour = parseInt(fetchedNormalHours[0].split(':')[0], 10);
                    const lastHour = parseInt(fetchedNormalHours[fetchedNormalHours.length - 1].split(':')[0], 10);
                    setFromHour(firstHour);
                    setToHour(lastHour);
                }
            }
        }
    }, [mileFares]);

    const handleAddFares = () => {
        setIsAddModalOpen(true);
    };

    const handleAddMileFare = (newFare: any) => {
        setIsAddModalOpen(false);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setEditValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSaveHours = async () => {
        if (hourId) {
            const allHours = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0') + ":00");

            const updatedNormalHours = allHours.filter(hour => {
                const hourInt = parseInt(hour.split(':')[0], 10);
                return hourInt >= fromHour && hourInt <= toHour;
            });

            const updatedOutOfHours = allHours.filter(hour => !updatedNormalHours.includes(hour));

            try {
                await updateHours({
                    id: hourId,
                    hoursData: {
                        NormalHours: updatedNormalHours,
                        OutOfHours: updatedOutOfHours,
                    },
                }).unwrap();
                refetch();
                setShowSuccessSnackbar(true);
                setTimeout(() => {
                    setShowSuccessSnackbar(false);
                }, 3000);
            } catch (error) {
                console.error('Failed to update hours: ', error);
            }
        } else {
            console.error('Hour ID not found.');
        }
    };

    if (isLoading) return <p>Loading fares...</p>;
    if (error) return <p>Error loading fares</p>;

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 py-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div>
                <h1 className='text-2xl dark:text-white text-black my-2 font-bold'>Mile Fares</h1>
            </div>
            <HourBlocks
                fromHour={fromHour}
                toHour={toHour}
                setFromHour={setFromHour}
                setToHour={setToHour}
                refetch={refetch}
            />
            <HoursAndMileSettings
                mileFares={mileFares[0]}
                handleChange={handleChange}
                editValues={editValues}
                refetch={refetch}
            />

            <div className='flex flex-row-reverse gap-3'>
                <button className="my-4 py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={handleAddFares}>
                    Add Fares
                </button>
                <button
                    onClick={handleSaveHours}
                    className="my-4 py-2 px-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
                    Save Hours
                </button>
            </div>
            {showSuccessSnackbar && <SucessSnakeBar />}
            <AddMileFares
                isOpen={isAddModalOpen}
                onRequestClose={() => {
                    setIsAddModalOpen(false);
                    refetch();
                }}
                onFareAdded={handleAddMileFare}
            />
        </div>
    );
};

export default MileFares;
