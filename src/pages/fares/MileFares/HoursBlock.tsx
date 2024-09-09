import React, { useState, useEffect } from 'react';
import { useGetFairsQuery } from '../../../redux/usersData/fairApi';

const HourBlocks = ({ fromHour, toHour, setFromHour, setToHour }: any) => {
    const { data, error, isLoading } = useGetFairsQuery();
    const [normalHours, setNormalHours] = useState<string[]>([]);
    const [hourId, setHourId] = useState<string | null>(null);

    useEffect(() => {
        if (data && data.length > 0) {
            const hoursSetting = data[0].hours;
            if (hoursSetting) {
                setHourId(hoursSetting._id);
                const fetchedNormalHours = hoursSetting.NormalHours || [];
                setNormalHours(fetchedNormalHours);
            } else {
                console.error('Hours setting not found in the response data.');
            }
        } else {
            console.error('No data available.');
        }
    }, [data]);

    const hours = Array.from({ length: 24 }, (_, index) => index);

    const getBlockStyle = (hour: number) => {
        return hour >= fromHour && hour <= toHour
            ? 'bg-yellow-500 text-black font-bold'
            : 'bg-black text-white font-bold';
    };

    return (
        <div className="hour-blocks-container">
            <div className="flex flex-col justify-center items-center mb-4">
                <p className="dark:text-white text-black font-bold mb-2">Normal/Out of hours</p>
                <div className="flex justify-evenly mb-4">
                    <div>
                        <label className="mr-2 dark:text-white text-black font-bold">From:</label>
                        <select
                            value={fromHour}
                            onChange={(e) => setFromHour(parseInt(e.target.value, 10))}
                            className="py-2 px-4 rounded dark:bg-slate-700 bg-slate-300 dark:text-white text-slate-600"
                        >
                            {hours.map(hour => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mx-2 dark:text-white text-black font-bold">To:</label>
                        <select
                            value={toHour}
                            onChange={(e) => setToHour(parseInt(e.target.value, 10))}
                            className="py-2 px-4 rounded dark:bg-slate-700 bg-slate-300 dark:text-white text-slate-600"
                        >
                            {hours.map(hour => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                {hours.map(hour => (
                    <div
                        key={hour}
                        className={`py-2 px-2 text-center border rounded-md border-slate-600 ${getBlockStyle(hour)}`}
                    >
                        {hour}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourBlocks;
