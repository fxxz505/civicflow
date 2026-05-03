import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  Flag,
  MapPin,
  Megaphone,
  MessageSquare,
  Plus,
  Search,
  Settings2,
  ThumbsUp,
  UserCheck,
  Wrench
} from 'lucide-react';
import './styles.css';

const categories = ['Facilities', 'Safety', 'Public Service', 'Activity Ideas', 'Environment'];
const areas = ['North Gate', 'Library', 'Dormitory A', 'Sports Center', 'Cafeteria', 'Innovation Hub'];
const owners = ['Campus Ops', 'Security Team', 'Student Union', 'Maintenance', 'Facilities Desk'];
const statusOrder = ['Submitted', 'In Review', 'In Progress', 'Resolved'];
const storageKeys = {
  issues: 'civicflow-issues',
  notice: 'civicflow-notice',
  votedIssueIds: 'civicflow-voted-issue-ids'
};

const seedIssues = [
  {
    id: 1,
    title: 'Broken lighting near North Gate walkway',
    category: 'Safety',
    area: 'North Gate',
    status: 'In Progress',
    priority: 'High',
    votes: 42,
    owner: 'Maintenance',
    createdAt: 'May 1',
    resolvedHours: null,
    description: 'Several lamps are out on the path used by evening classes.',
    comments: ['Photo added by resident assistant.', 'Maintenance scheduled inspection tonight.'],
    history: ['Submitted by student', 'Reviewed by Security Team', 'Assigned to Maintenance']
  },
  {
    id: 2,
    title: 'Library second-floor printer queue is frequently blocked',
    category: 'Facilities',
    area: 'Library',
    status: 'In Review',
    priority: 'Medium',
    votes: 25,
    owner: 'Facilities Desk',
    createdAt: 'May 2',
    resolvedHours: null,
    description: 'Students wait too long during peak assignment hours.',
    comments: ['Queue screenshots collected.'],
    history: ['Submitted by class representative']
  },
  {
    id: 3,
    title: 'Reusable cup return station for cafeteria',
    category: 'Environment',
    area: 'Cafeteria',
    status: 'Submitted',
    priority: 'Low',
    votes: 18,
    owner: 'Student Union',
    createdAt: 'May 3',
    resolvedHours: null,
    description: 'A return station could reduce disposable cup usage after lunch.',
    comments: [],
    history: ['Submitted as sustainability idea']
  },
  {
    id: 4,
    title: 'Monthly founder demo night in Innovation Hub',
    category: 'Activity Ideas',
    area: 'Innovation Hub',
    status: 'Resolved',
    priority: 'Medium',
    votes: 61,
    owner: 'Student Union',
    createdAt: 'Apr 26',
    resolvedHours: 38,
    description: 'Create a recurring demo night where teams can show prototypes.',
    comments: ['Pilot event approved for May.'],
    history: ['Submitted', 'Approved by Student Union', 'Event calendar updated']
  },
  {
    id: 5,
    title: 'Sports Center locker room water leak',
    category: 'Facilities',
    area: 'Sports Center',
    status: 'Resolved',
    priority: 'High',
    votes: 33,
    owner: 'Maintenance',
    createdAt: 'Apr 28',
    resolvedHours: 22,
    description: 'Water gathers near the west lockers after evening sessions.',
    comments: ['Leak repaired and floor cleaned.'],
    history: ['Submitted', 'Assigned', 'Resolved by Maintenance']
  }
];

function getRulePriority(category, votes) {
  if (category === 'Safety') return 'High';
  if (votes >= 35) return 'High';
  if (votes >= 15) return 'Medium';
  return 'Low';
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-');
}

function priorityClass(priority) {
  return priority.toLowerCase();
}

function loadStoredValue(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [issues, setIssues] = useState(() => loadStoredValue(storageKeys.issues, seedIssues));
  const [activeTab, setActiveTab] = useState('citizen');
  const [selectedIssueId, setSelectedIssueId] = useState(1);
  const [votedIssueIds, setVotedIssueIds] = useState(() => loadStoredValue(storageKeys.votedIssueIds, []));
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState(() =>
    loadStoredValue(
      storageKeys.notice,
      'North Gate lighting repair is scheduled for tonight. Please use the library path after 20:00.'
    )
  );
  const [form, setForm] = useState({
    title: '',
    category: 'Facilities',
    area: 'Library',
    description: '',
    imageName: ''
  });
  const votedIssueIdsRef = useRef(new Set(votedIssueIds));

  useEffect(() => {
    votedIssueIdsRef.current = new Set(votedIssueIds);
    window.localStorage.setItem(storageKeys.votedIssueIds, JSON.stringify(votedIssueIds));
  }, [votedIssueIds]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.issues, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.notice, JSON.stringify(notice));
  }, [notice]);

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => b.votes - a.votes || statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  }, [issues]);

  const visibleIssues = useMemo(() => {
    return sortedIssues.filter((issue) => {
      const matchesFilter = filter === 'All' || issue.status === filter || issue.category === filter;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query || `${issue.title} ${issue.area} ${issue.category}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm, sortedIssues]);

  const selectedIssue = issues.find((issue) => issue.id === selectedIssueId) || sortedIssues[0];

  const stats = useMemo(() => {
    const resolved = issues.filter((issue) => issue.status === 'Resolved');
    const avgHours = resolved.length
      ? Math.round(resolved.reduce((sum, issue) => sum + (issue.resolvedHours || 0), 0) / resolved.length)
      : 0;
    const categoryCounts = categories.map((category) => ({
      category,
      count: issues.filter((issue) => issue.category === category).length
    }));
    const topCategory = [...categoryCounts].sort((a, b) => b.count - a.count)[0];
    return {
      total: issues.length,
      resolved: resolved.length,
      active: issues.filter((issue) => issue.status !== 'Resolved').length,
      resolvedRate: Math.round((resolved.length / issues.length) * 100),
      avgHours,
      categoryCounts,
      topCategory
    };
  }, [issues]);

  function submitIssue(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    const newIssue = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      area: form.area,
      status: 'Submitted',
      priority: getRulePriority(form.category, 0),
      votes: 0,
      owner: form.category === 'Safety' ? 'Security Team' : 'Facilities Desk',
      createdAt: 'Today',
      resolvedHours: null,
      description: form.description.trim(),
      comments: form.imageName ? [`Attached image: ${form.imageName}`] : [],
      history: ['Submitted through CivicFlow portal']
    };

    setIssues((current) => [newIssue, ...current]);
    setSelectedIssueId(newIssue.id);
    setForm({ title: '', category: 'Facilities', area: 'Library', description: '', imageName: '' });
  }

  function voteIssue(id) {
    if (votedIssueIdsRef.current.has(id)) return;

    votedIssueIdsRef.current.add(id);
    setVotedIssueIds((current) => (current.includes(id) ? current : [...current, id]));

    setIssues((current) =>
      current.map((issue) => {
        if (issue.id !== id) return issue;
        const votes = issue.votes + 1;
        return { ...issue, votes, priority: getRulePriority(issue.category, votes) };
      })
    );
  }

  function addComment(id, comment) {
    if (!comment.trim()) return;
    setIssues((current) =>
      current.map((issue) => (issue.id === id ? { ...issue, comments: [...issue.comments, comment.trim()] } : issue))
    );
  }

  function updateIssue(id, field, value) {
    setIssues((current) =>
      current.map((issue) => {
        if (issue.id !== id) return issue;
        const updates = { [field]: value };
        if (field === 'status' && value === 'Resolved' && !issue.resolvedHours) {
          updates.resolvedHours = 24;
        }
        if (field === 'status') {
          updates.history = [...issue.history, `Status changed to ${value}`];
        }
        return { ...issue, ...updates };
      })
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark">CF</div>
          <div>
            <strong>CivicFlow</strong>
            <span>No-AI civic operations</span>
          </div>
        </div>

        <nav className="nav-list">
          <button className={activeTab === 'citizen' ? 'active' : ''} onClick={() => setActiveTab('citizen')}>
            <ClipboardList size={18} /> Submit & track
          </button>
          <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}>
            <Settings2 size={18} /> Operations desk
          </button>
          <button className={activeTab === 'insights' ? 'active' : ''} onClick={() => setActiveTab('insights')}>
            <BarChart3 size={18} /> Impact dashboard
          </button>
        </nav>

        <div className="announcement">
          <Megaphone size={18} />
          <p>{notice}</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Community issues, handled in public.</h1>
            <p>Rules-based reporting, voting, assignment, and progress tracking for campuses and local communities.</p>
          </div>
          <button className="primary-action" onClick={() => setActiveTab('citizen')}>
            <Plus size={18} /> New issue
          </button>
        </header>

        <section className="metric-row" aria-label="Project metrics">
          <Metric icon={<ClipboardList />} label="Total issues" value={stats.total} />
          <Metric icon={<Clock3 />} label="Active cases" value={stats.active} />
          <Metric icon={<CheckCircle2 />} label="Resolved rate" value={`${stats.resolvedRate}%`} />
          <Metric icon={<Wrench />} label="Avg. resolution" value={`${stats.avgHours}h`} />
        </section>

        {activeTab === 'citizen' && (
          <CitizenView
            form={form}
            setForm={setForm}
            submitIssue={submitIssue}
            issues={visibleIssues}
            selectedIssue={selectedIssue}
            selectIssue={setSelectedIssueId}
            voteIssue={voteIssue}
            addComment={addComment}
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            issues={visibleIssues}
            updateIssue={updateIssue}
            selectedIssue={selectedIssue}
            selectIssue={setSelectedIssueId}
            notice={notice}
            setNotice={setNotice}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {activeTab === 'insights' && <InsightsView stats={stats} issues={issues} />}
      </section>
    </main>
  );
}

function Metric({ icon, label, value }) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function CitizenView(props) {
  const {
    form,
    setForm,
    submitIssue,
    issues,
    selectedIssue,
    selectIssue,
    voteIssue,
    addComment,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm
  } = props;

  return (
    <div className="content-grid">
      <section className="panel submit-panel">
        <div className="section-heading">
          <h2>Submit a real-world issue</h2>
          <p>Manual category selection keeps the project transparent and explicitly non-AI.</p>
        </div>
        <form onSubmit={submitIssue} className="issue-form">
          <label>
            Issue title
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="e.g. Broken stair railing near Dormitory A"
            />
          </label>
          <div className="form-row">
            <label>
              Category
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Area
              <select value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}>
                {areas.map((area) => (
                  <option key={area}>{area}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Describe what happened, who is affected, and why it matters."
            />
          </label>
          <label>
            Image evidence
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setForm({ ...form, imageName: event.target.files?.[0]?.name || '' })}
            />
          </label>
          {form.imageName && <p className="file-note">Selected: {form.imageName}</p>}
          <button className="primary-action full-width" type="submit">
            <Plus size={18} /> Submit issue
          </button>
        </form>
      </section>

      <section className="panel issue-list-panel">
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={['All', 'Submitted', 'In Review', 'In Progress', 'Resolved', 'Safety', 'Facilities']}
        />
        <div className="issue-list">
          {issues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              active={selectedIssue?.id === issue.id}
              hasVoted={votedIssueIds.includes(issue.id)}
              onSelect={() => selectIssue(issue.id)}
              onVote={() => voteIssue(issue.id)}
            />
          ))}
        </div>
      </section>

      <IssueDetail issue={selectedIssue} addComment={addComment} />
    </div>
  );
}

function AdminView({ issues, updateIssue, selectedIssue, selectIssue, notice, setNotice, searchTerm, setSearchTerm }) {
  return (
    <div className="admin-layout">
      <section className="panel admin-table-panel">
        <div className="section-heading horizontal-heading">
          <div>
            <h2>Operations desk</h2>
            <p>Sort work by votes, priority, owner, and current state.</p>
          </div>
          <div className="search-box">
            <Search size={17} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search cases" />
          </div>
        </div>

        <div className="admin-table">
          <div className="table-row table-head">
            <span>Issue</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Owner</span>
            <span>Votes</span>
          </div>
          {issues.map((issue) => (
            <button className="table-row" key={issue.id} onClick={() => selectIssue(issue.id)}>
              <span>
                <strong>{issue.title}</strong>
                <small>{issue.area} / {issue.category}</small>
              </span>
              <span className={`priority ${priorityClass(issue.priority)}`}>{issue.priority}</span>
              <span className={`status ${statusClass(issue.status)}`}>{issue.status}</span>
              <span>{issue.owner}</span>
              <span>{issue.votes}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel control-panel">
        <div className="section-heading">
          <h2>Case controls</h2>
          <p>{selectedIssue?.title}</p>
        </div>
        <label>
          Status
          <select value={selectedIssue?.status} onChange={(event) => updateIssue(selectedIssue.id, 'status', event.target.value)}>
            {statusOrder.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Owner
          <select value={selectedIssue?.owner} onChange={(event) => updateIssue(selectedIssue.id, 'owner', event.target.value)}>
            {owners.map((owner) => (
              <option key={owner}>{owner}</option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select value={selectedIssue?.priority} onChange={(event) => updateIssue(selectedIssue.id, 'priority', event.target.value)}>
            {['Low', 'Medium', 'High'].map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>
        <label>
          Public announcement
          <textarea value={notice} onChange={(event) => setNotice(event.target.value)} />
        </label>

        <div className="timeline">
          {selectedIssue?.history.map((item, index) => (
            <div className="timeline-item" key={`${item}-${index}`}>
              <span />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function InsightsView({ stats, issues }) {
  const statusCounts = statusOrder.map((status) => ({
    status,
    count: issues.filter((issue) => issue.status === status).length
  }));

  return (
    <div className="insights-layout">
      <section className="panel chart-panel">
        <div className="section-heading">
          <h2>Category distribution</h2>
          <p>Manual categories keep accountability clear for every department.</p>
        </div>
        <div className="bar-list">
          {stats.categoryCounts.map((item) => (
            <div className="bar-item" key={item.category}>
              <span>{item.category}</span>
              <div className="bar-track">
                <div style={{ width: `${Math.max(12, (item.count / stats.total) * 100)}%` }} />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel chart-panel">
        <div className="section-heading">
          <h2>Status pipeline</h2>
          <p>From public submission to documented closure.</p>
        </div>
        <div className="pipeline">
          {statusCounts.map((item) => (
            <div className="pipeline-step" key={item.status}>
              <strong>{item.count}</strong>
              <span>{item.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel map-panel">
        <div className="section-heading">
          <h2>Area heat map</h2>
          <p>Visualized as a campus grid for quick demo clarity.</p>
        </div>
        <div className="area-grid">
          {areas.map((area) => {
            const count = issues.filter((issue) => issue.area === area).length;
            return (
              <div className={`area-cell level-${Math.min(3, count)}`} key={area}>
                <MapPin size={18} />
                <strong>{area}</strong>
                <span>{count} cases</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel impact-panel">
        <Flag size={28} />
        <div>
          <h2>Hackathon value story</h2>
          <p>
            CivicFlow turns scattered complaints into an auditable service workflow: visible demand, transparent ownership,
            measurable response time, and a repeatable operating model.
          </p>
        </div>
      </section>
    </div>
  );
}

function FilterBar({ filter, setFilter, searchTerm, setSearchTerm, filters }) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={17} />
        <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search issues" />
      </div>
      <div className="filter-buttons">
        {filters.map((item) => (
          <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function IssueRow({ issue, active, hasVoted, onSelect, onVote }) {
  return (
    <article className={`issue-row ${active ? 'active' : ''}`}>
      <button className="issue-main" onClick={onSelect}>
        <span className={`status-dot ${statusClass(issue.status)}`} />
        <span>
          <strong>{issue.title}</strong>
          <small>{issue.area} / {issue.category}</small>
        </span>
      </button>
      <div className="issue-meta">
        <span className={`priority ${priorityClass(issue.priority)}`}>{issue.priority}</span>
        <button className="vote-button" onClick={onVote} disabled={hasVoted} title={hasVoted ? 'Already voted' : 'Vote for this issue'}>
          <ThumbsUp size={16} /> {hasVoted ? 'Voted' : issue.votes}
        </button>
      </div>
    </article>
  );
}

function IssueDetail({ issue, addComment }) {
  const [comment, setComment] = useState('');

  if (!issue) {
    return (
      <section className="panel detail-panel">
        <p>No issue selected.</p>
      </section>
    );
  }

  return (
    <section className="panel detail-panel">
      <div className="detail-top">
        <div>
          <span className={`status ${statusClass(issue.status)}`}>{issue.status}</span>
          <h2>{issue.title}</h2>
        </div>
        <span className={`priority ${priorityClass(issue.priority)}`}>{issue.priority}</span>
      </div>
      <p className="detail-description">{issue.description}</p>
      <div className="detail-stats">
        <span><MapPin size={16} /> {issue.area}</span>
        <span><ThumbsUp size={16} /> {issue.votes} votes</span>
        <span><UserCheck size={16} /> {issue.owner}</span>
        <span><Eye size={16} /> Created {issue.createdAt}</span>
      </div>
      <div className="comment-list">
        <h3>Comments</h3>
        {issue.comments.length === 0 && <p className="muted">No comments yet.</p>}
        {issue.comments.map((item, index) => (
          <div className="comment" key={`${item}-${index}`}>
            <MessageSquare size={16} />
            <p>{item}</p>
          </div>
        ))}
      </div>
      <form
        className="comment-form"
        onSubmit={(event) => {
          event.preventDefault();
          addComment(issue.id, comment);
          setComment('');
        }}
      >
        <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a public update or clarification" />
        <button type="submit">Add</button>
      </form>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
