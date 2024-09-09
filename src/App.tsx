import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Users from './pages/Passengers/Users';
import Admins from './pages/Admin/Admins';
import Cars from './pages/Cars/Cars';
import UserDetails from './pages/Passengers/UserDetails';
import UpdateUser from './pages/Passengers/UpdateUser';
import AddUser from './pages/Passengers/AddUser';
import CarDetails from './pages/Cars/CarDetails';
import AddNewCar from './pages/Cars/AddNewCar';
import Map from './pages/Location/Map';
import AddAdmin from './pages/Admin/AddAdmin';
import UpdateAdmin from './pages/Admin/UpdateAdmin';
import UpdateCar from './pages/Cars/UpdateCar';
import FixFares from './pages/fares/FixFares/FixFares';
import MileFares from './pages/fares/MileFares/MileFares';
import AddLocation from './pages/Location/AddLocation';
import MileFaresDetails from './pages/fares/MileFares/MileFaresDetails';
import AddMileFares from './pages/fares/MileFares/AddMileFares';
import AddFixFares from './pages/fares/FixFares/AddFixFares';
import UpdateMileFare from './pages/fares/MileFares/UpdateMileFare';
import UpdateFixFares from './pages/fares/FixFares/UpdateFixFare';
import MeetAndGreet from './pages/MeetAndGreet/MeetAndGreet';
import AddMeetAndGreet from './pages/MeetAndGreet/AddMeetAndGreet';
import UpdateMeetAndGreet from './pages/MeetAndGreet/UpdateMeetAndGreet';
import PickupAndDropoff from './pages/PickupAndDropoff/PickupAndDropoff';
import UpdatePickupDropoff from './pages/PickupAndDropoff/UpdatePickupDropoff';
import AddPickupDropoff from './pages/PickupAndDropoff/AddPickupDropoff';
import Booking from './pages/Bookings/Booking';
import AddBooking from './pages/Bookings/AddBooking';
import Drivers from './pages/Driver/Drivers';
import DriverInfo from './pages/Driver/DriverInfo';
import ViewDriver from './pages/Driver/Screens/ViewDriver';
import { ToastContainer } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSignIn = () => {
    setAuthenticated(true);
    navigate('/');
  };

  if (loading) {
    return <Loader />;
  }

  // if (!authenticated) {
  //   return <SignIn onSignIn={handleSignIn} />;
  // }

  return (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <PageTitle title="Users | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Users />
            </>
          }
        />
        <Route
          path="/users/:id"
          element={
            <>
              <PageTitle title="User Details | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UserDetails />
            </>
          }
        />
        <Route
          path="/admins"
          element={
            <>
              <PageTitle title="Admins | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Admins />
            </>
          }
        />
        <Route
          path="/admins/add"
          element={
            <>
              <PageTitle title="Admins | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AddAdmin />
            </>
          }
        />
        <Route
          path="/admins/update"
          element={
            <>
              <PageTitle title="Admins | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateAdmin />
            </>
          }
        />
        <Route
          path="/cars"
          element={
            <>
              <PageTitle title="Cars | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Cars />
            </>
          }
        />
        <Route
          path="/cars/details/:id"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <CarDetails />
            </>
          }
        />
        <Route
          path="/cars/add"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <AddNewCar />
            </>
          }
        />
        <Route
          path="/cars/update"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <UpdateCar />
            </>
          }
        />

        {/* Fares */}
        {/* fix Fares */}
        <Route
          path="/fares/fix-fares"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <FixFares />
            </>
          }
        />
        <Route
          path="/fares/fix-fares/add-fare"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <AddFixFares />
            </>
          }
        />
        <Route
          path="/fares/fix-fares/update-fare"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <UpdateFixFares />
            </>
          }
        />

        {/* mile fares */}
        <Route
          path="/fares/mile-fares"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <MileFares />
            </>
          }
        />

        <Route
          path="/fares/mile-fares/details"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <MileFaresDetails />
            </>
          }
        />
        <Route
          path="/fares/mile-fares/add-fare"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <AddMileFares />
            </>
          }
        />
        <Route
          path="/fares/mile-fares/update-fare"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <UpdateMileFare />
            </>
          }
        />

        {/* Booking */}
        {/* Add Booking */}
        <Route
          path="/booking/"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <Booking />
            </>
          }
        />
        <Route
          path="/booking/add-booking"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <AddBooking />
            </>
          }
        />

        <Route
          path="/location"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <Map />
            </>
          }
        />

        <Route
          path="/location/add"
          element={
            <>
              <PageTitle title="CarDetails | CarDetails - Tailwind CSS Admin Dashboard Template" />
              <AddLocation />
            </>
          }
        />

        {/* Meet and Greet */}
        <Route
          path="/meetandgreet"
          element={
            <>
              <PageTitle title="Meet And Greet | Meet ANd Greet - Tailwind CSS Admin Dashboard Template" />
              <MeetAndGreet />
            </>
          }
        />
        {/* Add Meet and Greet */}
        <Route
          path="/meetandgreet/add"
          element={
            <>
              <PageTitle title="Meet And Greet | Meet ANd Greet - Tailwind CSS Admin Dashboard Template" />
              <AddMeetAndGreet />
            </>
          }
        />
        {/* Update Meet and greet */}
        <Route
          path="/meetandgreet/update"
          element={
            <>
              <PageTitle title="Meet And Greet | Meet ANd Greet - Tailwind CSS Admin Dashboard Template" />
              <UpdateMeetAndGreet />
            </>
          }
        />

        {/* Pickup/Dropoff Charges */}
        <Route
          path="/pickupdropoffcharges"
          element={
            <>
              <PageTitle title="Pickup and Dropoff charges | Pickup and Dropoff charges - Tailwind CSS Admin Dashboard Template" />
              <PickupAndDropoff />
            </>
          }
        />

        {/* Update Pickup and Dropoff Charges */}
        <Route
          path="/pickupdropoffcharges/update"
          element={
            <>
              <PageTitle title="Pickup and Dropoff charges | Pickup and Dropoff charges - Tailwind CSS Admin Dashboard Template" />
              <UpdatePickupDropoff />
            </>
          }
        />

        {/* Add Pickup and Dropoff Charges */}
        <Route
          path="/pickupdropoffcharges/add"
          element={
            <>
              <PageTitle title="Pickup and Dropoff charges | Pickup and Dropoff charges - Tailwind CSS Admin Dashboard Template" />
              <AddPickupDropoff />
            </>
          }
        />

        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/users/update"
          element={
            <>
              <PageTitle title="AddMdel | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <UpdateUser />
            </>
          }
        />
        <Route
          path="/users/add"
          element={
            <>
              <PageTitle title="AddUser | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AddUser />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn onSignIn={handleSignIn} />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />

        <Route
          path="/drivers"
          element={
            <>
              <PageTitle title="Driver Listing" />
              <Drivers />
            </>
          }
        />

        <Route
          path="/driverinfo"
          element={
            <>
              <PageTitle title="Driver Info" />
              <DriverInfo />
            </>
          }
        />
        <Route
          path="/driverinformation/:id"
          element={
            <>
              <PageTitle title="Driver Information" />
              <ViewDriver />
            </>
          }
        />

      </Routes>
      <ToastContainer />
    </DefaultLayout>
  );
}

export default App;
