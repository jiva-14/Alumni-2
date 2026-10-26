import { useState } from 'react';
import ManageTable from '../../components/ManageTable';
import { StatusBadge } from '../../components/ui';
import { departments } from '../../data/mockData';
import { faculty as facultySeed, students as studentsSeed, users as usersSeed } from '../../data/adminData';

const STATUS = ['Active', 'Inactive'];
const statusCol = { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> };

export function Students() {
  const [items, setItems] = useState(studentsSeed);
  return (
    <ManageTable title="Students" subtitle="Current students who may become future alumni." noun="Student" items={items} setItems={setItems}
      searchKeys={['name', 'email', 'department']}
      columns={[{ key: 'name', header: 'Name' }, { key: 'department', header: 'Department' }, { key: 'year', header: 'Year' }, statusCol]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'department', label: 'Department', type: 'select', options: departments, required: true },
        { name: 'year', label: 'Year of study', type: 'select', options: ['1st year', '2nd year', '3rd year', '4th year'], required: true },
        { name: 'status', label: 'Status', type: 'select', options: STATUS, required: true },
      ]} />
  );
}

export function Faculty() {
  const [items, setItems] = useState(facultySeed);
  return (
    <ManageTable title="Faculty" subtitle="Faculty and staff linked to the alumni community." noun="Faculty member" items={items} setItems={setItems}
      searchKeys={['name', 'email', 'department', 'designation']}
      columns={[{ key: 'name', header: 'Name' }, { key: 'designation', header: 'Designation' }, { key: 'department', header: 'Department' }, statusCol]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'department', label: 'Department', type: 'select', options: departments, required: true },
        { name: 'designation', label: 'Designation', type: 'select', options: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'], required: true },
        { name: 'status', label: 'Status', type: 'select', options: STATUS, required: true },
      ]} />
  );
}

export function UserManagement() {
  const [items, setItems] = useState(usersSeed);
  return (
    <ManageTable title="User management" subtitle="Control who can sign in and what they can do." noun="User" items={items} setItems={setItems}
      searchKeys={['name', 'email', 'role']}
      columns={[
        { key: 'name', header: 'Name' }, { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role', render: (r) => <span className="badge">{r.role}</span> },
        { key: 'lastLogin', header: 'Last login' }, statusCol,
      ]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Moderator', 'Alumni', 'Faculty', 'Student'], required: true },
        { name: 'status', label: 'Status', type: 'select', options: STATUS, required: true },
      ]} />
  );
}
