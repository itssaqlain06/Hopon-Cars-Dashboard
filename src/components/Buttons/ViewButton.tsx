
const ViewButon = () => {
    return (
        <div className="flex gap-4">
            <button
                className="px-5 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 outline-none"
            >
                View
            </button>
        </div>
    );
};

export default ViewButon;



const data = {
    "booking_status": "Asap",
    "booking_date": "2023-11-12T00:00:00Z",
    "booking_hour": "14:30",
    "booking_address": "123 Main Street, Lahore, Pakistan",
    "flight_number": "PAKK112365",
    "coming_from": "Delhi",
    "booking_destination": "Toronto, Canada",
    "booking_via": ["car", "airplane"],
    "booking_instruction": "Ensure timely arrival and confirm pickup location.",
    "client_info": {
        "client_name": "Asad Khan",
        "client_email": "asa2d.khan1@example.com",
        "client_phone": "+92-326-564-656",
        "client_mobile": "+92-598-995-6685",
        "client_acc": "HABB1456465",
        "client_pin": "KLKL1456465"
    },
    "vehicle_info": {
        "vehicles": "sedan",
        "booking_passanger": 1,
        "booking_luggages": 2,
        "booking_hand_luggages": 1,
        "booking_payment": "cash",
        "card_number": 0,
        "card_mm_yy": 0,
        "card_cvc": 0,
        "booking_special_requirement": "Wheelchair accessible vehicle"
    },
    "driver": "Mian Khilfa",
    "lead": true,
    "auto_dispatch": false,
    "bidding": true,
    "booking_route": "one way",
    "booking_ride_charges": {
        "ride_charges": 150,
        "account_charges": 0,
        "pickup_charges": 10,
        "dropoff_charges": 30,
        "drv_waiting": 20,
        "drv_parking": 15,
        "extra_charges": 10,
        "total_amount": 225
    }
}