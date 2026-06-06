import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import JobForm from '../components/JobForm';
import JobCard from '../components/JobCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const fetchData = async () => {
    const [jobsRes, statsRes] = await Promise.all([
      api.get('/jobapplications'),
      api.get('/jobapplications/stats'),
    ]);
    setJobs(jobsRes.data);
    setStats(statsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    await api.delete(`/jobapplications/${id}`);
    fetchData();
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditJob(null);
    fetchData();
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1>Job Tracker</h1>
        <div className="header-right">
          <span>Hi, {user?.fullName}</span>
          <button onClick={logout} className="btn-outline">Logout</button>
        </div>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card total"><h3>{stats.total}</h3><p>Total</p></div>
          <div className="stat-card applied"><h3>{stats.applied}</h3><p>Applied</p></div>
          <div className="stat-card interviewing"><h3>{stats.interviewing}</h3><p>Interviewing</p></div>
          <div className="stat-card offered"><h3>{stats.offered}</h3><p>Offered</p></div>
          <div className="stat-card rejected"><h3>{stats.rejected}</h3><p>Rejected</p></div>
        </div>
      )}

      <div className="jobs-header">
        <h2>Applications</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add Application</button>
      </div>

      {showForm && (
        <JobForm job={editJob} onClose={handleFormClose} />
      )}

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p className="empty">No applications yet. Add your first one!</p>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
