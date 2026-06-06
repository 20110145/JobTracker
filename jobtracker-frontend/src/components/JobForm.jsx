import { useState } from 'react';
import api from '../api/axios';

const STATUSES = ['Applied', 'Interviewing', 'Offered', 'Rejected'];

export default function JobForm({ job, onClose }) {
  const [form, setForm] = useState({
    companyName: job?.companyName || '',
    jobTitle: job?.jobTitle || '',
    status: job?.status || 'Applied',
    jobUrl: job?.jobUrl || '',
    notes: job?.notes || '',
    interviewDate: job?.interviewDate ? job.interviewDate.slice(0, 10) : '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, interviewDate: form.interviewDate || null };
    if (job) {
      await api.put(`/jobapplications/${job.id}`, payload);
    } else {
      await api.post('/jobapplications', payload);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{job ? 'Edit Application' : 'Add Application'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
          />
          <input
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            required
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input
            placeholder="Job URL (optional)"
            value={form.jobUrl}
            onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
          />
          <input
            type="date"
            placeholder="Interview Date (optional)"
            value={form.interviewDate}
            onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">{job ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
