import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { StatusBadge } from '../../components/ui';
import { myArticles } from '../../data/mockData';

export default function MyArticles() {
  const [items, setItems] = useState(myArticles);
  return (
    <ManageTable title="My articles" subtitle="Articles you have written. New articles are reviewed before they are published."
      noun="Article" items={items} setItems={setItems} searchKeys={['title', 'category']}
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'category', header: 'Category' },
        { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en', { dateStyle: 'medium' }) },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Career', 'Community', 'Entrepreneurship'], required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Pending'], required: true },
      ]} />
  );
}
