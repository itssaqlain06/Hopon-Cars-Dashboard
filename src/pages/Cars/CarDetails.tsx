import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Cars as CarType } from '../../types/cars';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const CarDetails: React.FC = () => {
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const car: CarType = location.state?.car;

    if (!car) {
        return <div>No car details available</div>;
    }

    return (
        <>
            <Breadcrumb pageName="Car Details" />
            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <img
                        src={car.image}
                        alt={car.name}
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-contain object-center"
                    />
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {car.name}
                        </h3>
                        <div className="mt-4.5 mb-5.5 flex max-w-94  justify-center items-center gap-4 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                            <div className="flex flex-col items-center justify-center gap-1 px-4">
                                <span className="text-lg font-semibold text-black dark:text-white">
                                    Passengers
                                </span>
                                <span className="text-md text-gray-600 dark:text-gray-300">
                                    {car.passengers}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 px-4">
                                <span className="text-lg font-semibold text-black dark:text-white">
                                    Suitcases
                                </span>
                                <span className="text-md text-gray-600 dark:text-gray-300">
                                    {car.suit_cases}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 px-4">
                                <span className="text-lg font-semibold text-black dark:text-white">
                                    Hand Bags
                                </span>
                                <span className="text-md text-gray-600 dark:text-gray-300">
                                    {car.hand_bags}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CarDetails;
