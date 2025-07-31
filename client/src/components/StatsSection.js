import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Database,
  FileSpreadsheet,
  Users,
  Calendar,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';

// Configure axios with environment-based API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const StatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const statsResponse = await api.get('/api/registration/stats');
      setStats(statsResponse.data.stats);

      // Fetch MongoDB registrations
      const mongoResponse = await api.get('/api/registration');
      setRegistrations(mongoResponse.data.users);

      // Fetch Excel data
      const excelResponse = await api.get('/api/registration/excel');
      setExcelData(excelResponse.data.registrations);

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="stats-section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <RefreshCw size={24} className="spinner" />
          <p style={{ marginTop: '1rem' }}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>Registration Statistics</h1>
        <p style={{ color: '#666' }}>Overview of registration data from database and Excel file</p>
        <button
          onClick={fetchStats}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '1rem auto 0'
          }}
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <Database size={24} style={{ marginBottom: '0.5rem' }} />
          <h3>{stats?.mongoDB?.totalRegistrations || 0}</h3>
          <p>MongoDB Registrations</p>
        </div>

        <div className="stat-card">
          <FileSpreadsheet size={24} style={{ marginBottom: '0.5rem' }} />
          <h3>{stats?.excelFile?.totalRegistrations || 0}</h3>
          <p>Excel File Entries</p>
        </div>

        <div className="stat-card">
          <Activity size={24} style={{ marginBottom: '0.5rem' }} />
          <h3>{formatFileSize(stats?.excelFile?.fileSize || 0)}</h3>
          <p>Excel File Size</p>
        </div>

        <div className="stat-card">
          <Calendar size={24} style={{ marginBottom: '0.5rem' }} />
          <h3>{stats?.excelFile?.lastModified ? formatDate(stats.excelFile.lastModified) : 'N/A'}</h3>
          <p>Last Updated</p>
        </div>
      </div>

      {/* Recent Registrations */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
          Recent Registrations (MongoDB)
        </h2>

        {registrations.length > 0 ? (
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            background: '#fafbfc'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#667eea', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {registrations.slice(0, 10).map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e1e5e9' }}>
                    <td style={{ padding: '1rem' }}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={{ padding: '1rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>{user.phone || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      {formatDate(user.registrationDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No registrations found</p>
          </div>
        )}
      </div>

      {/* Excel Data */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>
          Excel File Data
        </h2>

        {excelData.length > 0 ? (
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            background: '#fafbfc'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#667eea', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {excelData.slice(0, 10).map((entry, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e1e5e9' }}>
                    <td style={{ padding: '1rem' }}>
                      {entry['First Name']} {entry['Last Name']}
                    </td>
                    <td style={{ padding: '1rem' }}>{entry['Email']}</td>
                    <td style={{ padding: '1rem' }}>{entry['Phone'] || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      {entry['Registration Date']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <FileSpreadsheet size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No Excel data found</p>
          </div>
        )}
      </div>

      {/* File Information */}
      {stats?.excelFile?.filePath && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e1e5e9'
        }}>
          <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>File Information</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            <strong>Excel File Path:</strong> {stats.excelFile.filePath}
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            <strong>Total Entries:</strong> {stats.excelFile.totalRegistrations}
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            <strong>File Size:</strong> {formatFileSize(stats.excelFile.fileSize)}
          </p>
          {stats.excelFile.lastModified && (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              <strong>Last Modified:</strong> {formatDate(stats.excelFile.lastModified)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsSection; 