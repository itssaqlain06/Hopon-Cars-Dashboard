import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useUpdateAdminMutation } from '../../redux/usersData/adminLogin';

interface UpdateAdminProps {
    isOpen: boolean;
    onRequestClose: () => void;
    admin: any;
    onUpdateAdmin: (updatedAdmin: any) => void;
}

const UpdateAdmin: React.FC<UpdateAdminProps> = ({ isOpen, onRequestClose, admin, onUpdateAdmin }) => {
    const [username, setUsername] = useState<string>(admin.username || '');
    const [email, setEmail] = useState<string>(admin.email || '');
    const [phone, setPhone] = useState<string>(admin.phone || '');
    const [password, setPassword] = useState<string>(admin.password || '');

    const [updateAdmin] = useUpdateAdminMutation();

    useEffect(() => {
        if (admin) {
            setUsername(admin.username);
            setEmail(admin.email);
            setPhone(admin.phone);
            setPassword(admin.password);
        }
    }, [admin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedAdmin = { ...admin, username, email, phone, password };
            await updateAdmin({ id: admin._id, updatedAdmin }).unwrap();
            onUpdateAdmin(updatedAdmin);
            onRequestClose();
        } catch (err) {
            console.error('Failed to update admin:', err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Update Admin"
            className="flex justify-center items-center h-screen w-full my-20"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Admin</h2>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        Update Admin
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateAdmin;
