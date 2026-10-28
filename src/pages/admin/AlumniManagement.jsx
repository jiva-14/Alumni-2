import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { alumni, departments } from '../../data/mockData';

export default function AlumniManagement() {
  const [items, setItems] = useState(alumni);
  return (
    <ManageTable title="Alumni management" subtitle="Add, update or remove alumni records." noun="Alumni" items={items} setItems={setItems}
      searchKeys={['name', 'department', 'company', 'graduationYear']}
      columns={[{ key: 'name', header: 'Name' }, { key: 'graduationYear', header: 'Year' }, { key: 'department', header: 'Department' }, { key: 'company', header: 'Company' }]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'graduationYear', label: 'Graduation year', type: 'number', required: true, min: 1990, max: 2100 },
        { name: 'department', label: 'Department', type: 'select', options: departments, required: true },
        { name: 'currentRole', label: 'Current role' },
        { name: 'company', label: 'Company' },
      ]} />
  );
}
