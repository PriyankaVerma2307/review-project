import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const fields = ['name', 'email', 'address', 'role'];
const labels = { name: 'Name', email: 'Email', address: 'Address', role: 'Role' };

function AdminUsers() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'asc' });
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = async () => { setLoading(true); setError(''); try { const { data } = await api.get('/admin/users', { params: { ...filters, ...sort } }); setUsers(data.users); } catch (e) { setError(e.response?.data?.message || 'Unable to load users.'); } finally { setLoading(false); } };
  useEffect(() => {
    const loadSortedUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/admin/users', { params: { ...filters, ...sort } });
        setUsers(data.users);
      } catch (e) {
        setError(e.response?.data?.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    loadSortedUsers();
  }, [sort]);
  const toggle = (sortBy) => setSort((old) => ({ sortBy, sortOrder: old.sortBy === sortBy && old.sortOrder === 'asc' ? 'desc' : 'asc' }));
  const logout = () => { localStorage.clear(); navigate('/login'); };
  return <div className="dashboard-page"><header className="topbar"><div><div className="topbar-brand">StoreRate</div><div className="topbar-subtitle">User Management</div></div><div className="topbar-right"><button className="secondary-button" onClick={() => navigate('/admin/dashboard')}>Dashboard</button><button className="secondary-button" onClick={() => navigate('/change-password')}>Change Password</button><button className="logout-button" onClick={logout}>Logout</button></div></header><main className="dashboard-content"><div className="page-heading split-heading"><div><h1>Users</h1><p>Search, sort and view all platform accounts.</p></div><button className="primary-button compact-button" onClick={() => navigate('/admin/add-user')}>Add User</button></div><form className="filter-grid" onSubmit={(e) => { e.preventDefault(); load(); }}>{fields.map((field) => field === 'role' ? <select key={field} value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}><option value="">All roles</option><option value="user">Normal User</option><option value="admin">System Administrator</option><option value="owner">Store Owner</option></select> : <input key={field} placeholder={`Filter by ${labels[field].toLowerCase()}`} value={filters[field]} onChange={(e) => setFilters({ ...filters, [field]: e.target.value })} />)}<button className="secondary-button">Apply Filters</button></form>{error && <div className="error-message">{error}</div>}{loading ? <div className="loading-card">Loading users...</div> : users.length === 0 ? <div className="empty-card">No users match your filters.</div> : <div className="table-card"><table><thead><tr>{fields.map((field) => <th key={field}><button type="button" className="sort-button" onClick={() => toggle(field)}>{labels[field]} {sort.sortBy === field ? (sort.sortOrder === 'asc' ? '↑' : '↓') : ''}</button></th>)}<th>Rating</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.address}</td><td>{user.role}</td><td>{user.role === 'owner' ? `${Number(user.rating).toFixed(2)} / 5` : '—'}</td><td><button className="secondary-button" onClick={() => navigate(`/admin/users/${user.id}`)}>View Details</button></td></tr>)}</tbody></table></div>}</main></div>;
}
export default AdminUsers;
