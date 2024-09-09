import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.png';
import { faCar, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImLocation } from 'react-icons/im';
import { LuLayoutDashboard } from 'react-icons/lu';
import { GiMoneyStack } from 'react-icons/gi';
import { IoIosSettings } from 'react-icons/io';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiTicket } from 'react-icons/hi2';
import { FaRegAddressBook } from 'react-icons/fa6';
import { GrUserWorker } from "react-icons/gr";


import { IoIosArrowRoundBack } from "react-icons/io";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const [faresExpanded, setFaresExpanded] = useState(false);

  const [bookingExpanded, setBookingExpanded] = useState(false);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      // className={`absolute left-0 top-20 z-9999 flex w-54 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      //   }`}

      className={`fixed  left-0 top-0 min-h-[100vh]   z-9999 flex w-54 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full bg-sla'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-10 py-5.5 lg:py-6.5 relative">
        <NavLink to="/">
          <img className="h-18" src={Logo} alt="Logo" />
        </NavLink>

        <div
          className="absolute top-[20px] right-[10px]   text-white text-2xl   cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          <IoIosArrowRoundBack width={70} />
        </div>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                >
                  <LuLayoutDashboard />
                  Dashboard
                </NavLink>
              </li>

              {/* <!-- Menu Item Users --> */}
              <li>
                <NavLink
                  to="/users"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <FontAwesomeIcon className="bg-white" icon={faUser} />
                  </svg>
                  Passengers
                </NavLink>
              </li>

              {/* Admin */}
              <li>
                <NavLink
                  to="/admins"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('admins') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <FontAwesomeIcon className="bg-white" icon={faUserTie} />
                  </svg>
                  Admins
                </NavLink>
              </li>

              {/* Cars */}
              <li>
                <NavLink
                  to="/cars"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('cars') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <FontAwesomeIcon className="bg-white" icon={faCar} />
                  </svg>
                  Vehicles
                </NavLink>
              </li>

              {/* Locations */}
              {/* <li>
                <NavLink
                  to="/location"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('location') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <ImLocation />
                  Location
                </NavLink>
              </li> */}

              {/* Fares */}
              <li>
                <button
                  onClick={() => setFaresExpanded(!faresExpanded)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('faresExpanded') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <>
                    <GiMoneyStack />
                    Fares
                  </>
                </button>
                {faresExpanded && (
                  <ul className="ml-4">
                    <li>
                      <NavLink
                        to="/fares/fix-fares"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('fix-fares') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        Fix Fares
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/fares/mile-fares"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('mile-fares') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        Mile Fares
                      </NavLink>
                    </li>
                    {/* Meet and Greet */}
                    <li>
                      <NavLink
                        to="/meetandgreet"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-smeta-4 ${pathname.includes('meetandgreet') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        Meet and Greet
                      </NavLink>
                    </li>

                    {/* Pickup and Dropoff charges */}
                    <li>
                      <NavLink
                        to="/pickupdropoffcharges"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-smeta-4 ${pathname.includes('pickupdropoffcharges') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        Pickup / Dropoff Charges
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Booking */}

              <li>
                <button
                  onClick={() => setBookingExpanded(!bookingExpanded)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('bookingExpanded') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <>
                    <FaRegAddressBook />
                    Bookings
                  </>
                </button>
                {bookingExpanded && (
                  <ul className="ml-4">
                    <li>
                      <NavLink
                        to="/booking"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('fix-fares') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        Bookings
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Driver */}
              <li>
                <NavLink
                  to="/drivers"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('settings') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <GrUserWorker size={18} />
                  Driver
                </NavLink>
              </li>

              {/* <!--Profile --> */}
              <li>
                <NavLink
                  to="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <BsFillPersonFill size={20} />
                  Profile
                </NavLink>
              </li>

              {/* <!-- Menu Item Settings --> */}
              <li>
                <NavLink
                  to="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('settings') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <IoIosSettings size={18} />
                  Settings
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */}


            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
