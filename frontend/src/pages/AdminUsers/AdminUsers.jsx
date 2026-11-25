
import React, { useEffect, useMemo, useState } from 'react';
import { getAllUsers } from '../../services/adminUserService';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

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
          <span>Administrators</span>
          <h3>{users.filter((u) => u.role === 'admin').length}</h3>
        </div>

        <div className="users-stat-card">
          <span>Regular Users</span>
          <h3>{users.filter((u) => u.role === 'user').length}</h3>
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
      </div>

      {error && (
        <div className="admin-users-error">
          {error}
          <button type="button" onClick={fetchUsers}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-users-message">Loading users...</div>
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
                <th>Registered On</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`user-role ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
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
