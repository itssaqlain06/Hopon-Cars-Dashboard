import React, { useState } from 'react';
import { useAddUserMutation } from '../redux/usersData/api';
import { Package } from '../types/package';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (newUser: Package) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [addUser, { isError, error }] = useAddUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = { name, email, password, phone };
      const result = await addUser(newUser).unwrap(); // Assuming addUser is a RTK Query mutation
      onAddUser(result); // Notify parent component of the new user added
      onClose(); // Close the modal after successful addition
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          {isError && (
            <div className="error-message">
              {error?.status === 401 ? 'Unauthorized - Please login again' : 'Failed to add user'}
            </div>
          )}
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary">Add User</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
