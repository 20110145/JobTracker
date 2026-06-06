const STATUS_COLORS = {
  Applied: '#3b82f6',
  Interviewing: '#f59e0b',
  Offered: '#10b981',
  Rejected: '#ef4444',
};

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.companyName}</h3>
          <p>{job.jobTitle}</p>
        </div>
        <span className="status-badge" style={{ backgroundColor: STATUS_COLORS[job.status] || '#6b7280' }}>
          {job.status}
        </span>
      </div>
      {job.notes && <p className="job-notes">{job.notes}</p>}
      <div className="job-card-footer">
        <span className="job-date">Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>
        <div className="job-actions">
          {job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noreferrer" className="btn-link">View Job</a>
          )}
          <button onClick={() => onEdit(job)} className="btn-outline">Edit</button>
          <button onClick={() => onDelete(job.id)} className="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}
