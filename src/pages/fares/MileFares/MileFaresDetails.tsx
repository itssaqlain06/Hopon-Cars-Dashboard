import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

const MileFaresDetails: React.FC = () => {
    const location = useLocation();
    const { fare } = location.state || {};

    if (!fare) {
        return <p>No fare details available.</p>;
    }

    const { carId, fromMiles, toMiles, fairAmount } = fare;

    return (
        <>
            <Breadcrumb pageName="Car Details" />
            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <img
                        src={carId.image}
                        alt={carId.name}
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-contain object-center"
                    />
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {carId.name}
                        </h3>
                        <div className="flex justify-center mt-4">
                            <div className="text-center mx-4">
                                <span className="block text-lg font-semibold text-black dark:text-white">
                                    From Miles
                                </span>
                                <span className="text-md text-gray-600 dark:text-gray-300">
                                    {fromMiles}
                                </span>
                            </div>
                            <div className="text-center mx-4">
                                <span className="block text-lg font-semibold text-black dark:text-white">
                                    To Miles
                                </span>
                                <span className="text-md text-gray-600 dark:text-gray-300">
                                    {toMiles}
                                </span>
                            </div>
                            <div className="text-center mx-4">
                                <span className="block text-lg font-semibold text-black dark:text-white">
                                    Fare Amount
                                </span>
                                <span className="text-md text-green-500">
                                    ${fairAmount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MileFaresDetails;
