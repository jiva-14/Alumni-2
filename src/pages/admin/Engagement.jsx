import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { StatusBadge } from '../../components/ui';
import { opportunities } from '../../data/mockData';
import { announcements as annSeed, stories as storySeed } from '../../data/adminData';

const publishToggle = (setItems) => (r) => (
  <button className="btn btn--outline btn--sm"
    onClick={() => setItems((l) => l.map((x) => (x.id === r.id ? { ...x, status: x.status === 'Published' ? 'Draft' : 'Published' } : x)))}>
    {r.status === 'Published' ? 'Unpublish' : 'Publish'}
  </button>
);
const statusCol = { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> };

export function Jobs() {
  const [items, setItems] = useState(opportunities);
  return (
    <ManageTable title="Jobs & internships" subtitle="Opportunities shared with the alumni community." noun="Opportunity" items={items} setItems={setItems}
      searchKeys={['title', 'company', 'location', 'type']}
      columns={[{ key: 'title', header: 'Role' }, { key: 'company', header: 'Company' }, { key: 'type', header: 'Type', render: (r) => <span className="badge">{r.type}</span> }, { key: 'location', header: 'Location' }]}
      fields={[
        { name: 'title', label: 'Role title', required: true },
        { name: 'company', label: 'Company', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Part-time', 'Internship', 'Contract'], required: true },
        { name: 'location', label: 'Location', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]} />
  );
}

export function Announcements() {
  const [items, setItems] = useState(annSeed);
  return (
    <ManageTable title="Announcements" subtitle="Broadcast updates to alumni, students or everyone." noun="Announcement" items={items} setItems={setItems}
      searchKeys={['title', 'audience']} extraActions={publishToggle(setItems)}
      columns={[{ key: 'title', header: 'Title' }, { key: 'audience', header: 'Audience' }, { key: 'date', header: 'Date' }, statusCol]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'audience', label: 'Audience', type: 'select', options: ['Everyone', 'All alumni', 'Alumni', 'Students', 'Faculty'], required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'], required: true },
        { name: 'message', label: 'Message', type: 'textarea' },
      ]} />
  );
}

export function SuccessStories() {
  const [items, setItems] = useState(storySeed);
  return (
    <ManageTable title="Success stories" subtitle="Highlight alumni achievements." noun="Story" items={items} setItems={setItems}
      searchKeys={['title', 'name']} extraActions={publishToggle(setItems)}
      columns={[{ key: 'title', header: 'Story' }, { key: 'name', header: 'Alumnus' }, { key: 'batch', header: 'Batch' }, statusCol]}
      fields={[
        { name: 'title', label: 'Headline', required: true },
        { name: 'name', label: 'Alumnus name', required: true },
        { name: 'batch', label: 'Batch (year)', type: 'number', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'], required: true },
        { name: 'summary', label: 'Summary', type: 'textarea' },
      ]} />
  );
}
