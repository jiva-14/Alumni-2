import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { events } from '../../data/mockData';

export default function EventManagement() {
  const [items, setItems] = useState(events);
  return (
    <ManageTable title="Event management" subtitle="Create and update alumni events." noun="Event" items={items} setItems={setItems}
      searchKeys={['title', 'location', 'category']}
      columns={[
        { key: 'title', header: 'Event' },
        { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en', { dateStyle: 'medium' }) },
        { key: 'location', header: 'Location' },
        { key: 'category', header: 'Category', render: (r) => <span className="badge">{r.category}</span> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'time', label: 'Time' },
        { name: 'location', label: 'Location', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Reunion', 'Webinar', 'Networking', 'Sports', 'Mentorship'], required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]} />
  );
}
