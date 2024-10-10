// src/components/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      dispatch(updateUser({ id: editingUserId, name, email }));
      setEditingUserId(null);
    } else {
      dispatch(createUser({ name, email }));
    }
    setName('');
    setEmail('');
  };

  const handleEdit = (user: any) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  return (
    <div>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">{editingUserId ? 'Update' : 'Create'}</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            {user.id}: {user.name} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
