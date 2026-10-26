import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { gallery } from '../../data/mockData';

export default function GalleryManagement() {
  const [items, setItems] = useState(gallery);
  return (
    <ManageTable title="Gallery management" subtitle="Manage the photos shown in the public gallery." noun="Photo" items={items} setItems={setItems}
      searchKeys={['title', 'category']}
      columns={[{ key: 'title', header: 'Title' }, { key: 'category', header: 'Category', render: (r) => <span className="badge">{r.category}</span> }]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Reunions', 'Campus', 'Networking', 'Sports'], required: true },
      ]} />
  );
}
