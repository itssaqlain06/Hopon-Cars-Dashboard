import React, { useState } from 'react';
// import { useAddUserMutation } from '../../redux/usersData/api';
import { useNavigate } from 'react-router-dom';

interface UpdateUserProps {
    // isOpen: boolean;
    // onClose: () => void;
    // onAddUser: (newUser: Package) => void;
}

const UpdateUser: React.FC<UpdateUserProps> = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active')
    const navigate = useNavigate();

    // const [addUser, { isError, error }] = useAddUserMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault();
        // try {
        //     const newUser = { name, email, password, phone, status };
        //     const result = await addUser(newUser).unwrap();
        //     addUser(result);
        //     navigate('/users');
        // } catch (err) {
        //     console.error('Failed to add user:', err);
        // }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Update User</h2>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2 text-black">
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
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2 text-black">
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
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2 text-black">
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

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-bold mb-2 text-black">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2 text-black">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {isError && (
                    <div className="text-red-500 text-sm mb-4">
                        {error?.status === 401 ? 'Unauthorized - Please login again' : 'Failed to add user'}
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline text-black"
                    >
                        Update
                    </button>
                    <button
                        type="button"

                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;
