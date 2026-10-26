import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { StatusBadge } from '../../components/ui';
import { posts } from '../../data/mockData';

export default function BlogManagement() {
  const [items, setItems] = useState(posts.map((p) => ({ ...p, status: 'Published' })));
  const toggle = (r) => setItems((l) => l.map((x) => (x.id === r.id ? { ...x, status: x.status === 'Published' ? 'Draft' : 'Published' } : x)));
  return (
    <ManageTable title="Blog management" subtitle="Edit, publish or unpublish articles." noun="Article" items={items} setItems={setItems}
      searchKeys={['title', 'author', 'category']}
      extraActions={(r) => <button className="btn btn--outline btn--sm" onClick={() => toggle(r)}>{r.status === 'Published' ? 'Unpublish' : 'Publish'}</button>}
      columns={[
        { key: 'title', header: 'Title' }, { key: 'author', header: 'Author' }, { key: 'category', header: 'Category' },
        { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'author', label: 'Author', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Career', 'Community', 'Entrepreneurship'], required: true },
        { name: 'excerpt', label: 'Summary', type: 'textarea' },
      ]} />
  );
}
