import React, { useState } from 'react';
import Modal from 'react-modal';
import { useRegisterAdminMutation } from '../../redux/usersData/adminLogin';
import { useDispatch } from 'react-redux';
import { addAdmin } from '../../redux/admins/adminSlice';

interface AddAdminProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const AddAdmin: React.FC<AddAdminProps> = ({ isOpen, onRequestClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const [registerAdmin, { isError, error }] = useRegisterAdminMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newAdmin = { username: name, email, phone, password };
            const result = await registerAdmin(newAdmin).unwrap();
            dispatch(addAdmin(result));
            onRequestClose();
        } catch (err) {
            console.error('Failed to add admin:', err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Admin"
            className="flex justify-center items-center h-screen w-full my-20"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Admin</h2>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Add Admin
                    </button>
                </div>

                {isError && <p className="text-red-500 mt-4">{error?.data?.message || 'Error adding admin'}</p>}
            </form>
        </Modal>
    );
};

export default AddAdmin;
