
import React, { useEffect, useMemo, useState } from 'react';

import {
  getAllUsers,
  updateUserStatus,
} from '../../services/adminUserService';

import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.isActive === false;

    try {
      setUpdatingUserId(user._id);
      setError('');

      const updatedUser = await updateUserStatus(
        user._id,
        newStatus
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === updatedUser._id
            ? { ...item, isActive: updatedUser.isActive }
            : item
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === 'all' || user.role === roleFilter;

      const isActive = user.isActive !== false;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeUsers = users.filter(
    (user) => user.isActive !== false
  ).length;

  const inactiveUsers = users.length - activeUsers;

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div>
          <h2>Manage Users</h2>
          <p>View and manage registered TriageSync users.</p>
        </div>

        <button
          type="button"
          className="users-refresh-btn"
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="users-stats">
        <div className="users-stat-card">
          <span>Total Users</span>
          <h3>{users.length}</h3>
        </div>

        <div className="users-stat-card">
          <span>Active Users</span>
          <h3>{activeUsers}</h3>
        </div>

        <div className="users-stat-card">
          <span>Inactive Users</span>
          <h3>{inactiveUsers}</h3>
        </div>
      </div>

      <div className="users-toolbar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Administrators</option>
          <option value="user">Regular Users</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && (
        <div className="admin-users-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-users-message">
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-users-empty">
          No matching users found.
        </div>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Registered On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const isActive = user.isActive !== false;
                const isUpdating = updatingUserId === user._id;

                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className={`user-role ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`user-status ${
                          isActive ? 'active' : 'inactive'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`user-status-btn ${
                          isActive ? 'deactivate' : 'activate'
                        }`}
                        onClick={() => handleToggleStatus(user)}
                        disabled={isUpdating || user.role === 'admin'}
                        title={
                          user.role === 'admin'
                            ? 'Admin account status cannot be changed here'
                            : ''
                        }
                      >
                        {isUpdating
                          ? 'Updating...'
                          : isActive
                            ? 'Deactivate'
                            : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <p className="users-results-count">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      )}
    </div>
  );
}

export default AdminUsers;
