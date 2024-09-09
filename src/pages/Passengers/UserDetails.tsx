import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useLazyFetchUserByIdQuery } from '../.././redux/usersData/api';
import { Package } from '../../types/package';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../../images/cover/cover-01.png';
import userSix from '../../images/user/user-06.png';
import { CiCamera } from "react-icons/ci";

const UserDetails: React.FC = () => {

    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const userdetail = location.state?.userdetail;

    useEffect(() => {
        console.log(userdetail)
    }, [])

    return (
        <>
            <Breadcrumb pageName="User Details" />

            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <img
                        src={CoverOne}
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                    />
                    <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                        <label
                            htmlFor="cover"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
                        >
                            <input type="file" name="cover" id="cover" className="sr-only" />
                            <span>
                                <CiCamera />
                            </span>
                            <span>Edit</span>
                        </label>
                    </div>
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                            <img src={userSix} alt="profile" />
                            <label
                                htmlFor="profile"
                                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                            >
                                <CiCamera />
                                <input
                                    type="file"
                                    name="profile"
                                    id="profile"
                                    className="sr-only"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className='flex flex-row '
                            style={{ alignItems: 'center', }}>
                            <h2 className="mb-1.5 text-xl mx-1 font-semibold text-black dark:text-white">
                                User Name :
                            </h2>
                            <p>{userdetail?.username}</p>
                        </div>
                        <div className='flex flex-row '
                            style={{ alignItems: 'center', }}>
                            <h2 className="mb-1.5 text-xl mx-1 font-semibold text-black dark:text-white">
                                Email :
                            </h2>
                            <p>{userdetail?.email}</p>
                        </div>
                        <div className='flex flex-row '
                            style={{ alignItems: 'center', }}>
                            <h2 className="mb-1.5 text-xl mx-1 font-semibold text-black dark:text-white">
                                Phone :
                            </h2>
                            <p>{userdetail?.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetails;
