/* SAMPLE ADMIN DATA FOR UI PREVIEW ONLY. Replace with API calls when a backend exists.
   All people and organisations are fictional. */

export const students = [
  { id: 1, name: 'Aditi Rao', email: 'aditi.rao@example.com', department: 'Computer Science', year: '3rd year', status: 'Active' },
  { id: 2, name: 'Vikram Patel', email: 'vikram.patel@example.com', department: 'Mechanical Engineering', year: '4th year', status: 'Active' },
  { id: 3, name: 'Nisha Gupta', email: 'nisha.gupta@example.com', department: 'Electronics', year: '2nd year', status: 'Active' },
  { id: 4, name: 'Faizan Ali', email: 'faizan.ali@example.com', department: 'Civil Engineering', year: '4th year', status: 'Inactive' },
  { id: 5, name: 'Tara Menon', email: 'tara.menon@example.com', department: 'Business Administration', year: '1st year', status: 'Active' },
];

export const faculty = [
  { id: 1, name: 'Dr. Kavita Iyer', email: 'kavita.iyer@example.com', department: 'Computer Science', designation: 'Professor', status: 'Active' },
  { id: 2, name: 'Dr. Suresh Bhatt', email: 'suresh.bhatt@example.com', department: 'Mechanical Engineering', designation: 'Associate Professor', status: 'Active' },
  { id: 3, name: 'Prof. Anita Desai', email: 'anita.desai@example.com', department: 'Business Administration', designation: 'Assistant Professor', status: 'Active' },
  { id: 4, name: 'Dr. Mohit Saxena', email: 'mohit.saxena@example.com', department: 'Electronics', designation: 'Professor', status: 'Inactive' },
];

export const users = [
  { id: 1, name: 'Portal Administrator', email: 'admin@example.com', role: 'Admin', status: 'Active', lastLogin: '2026-10-25' },
  { id: 2, name: 'Ananya Sharma', email: 'ananya@example.com', role: 'Alumni', status: 'Active', lastLogin: '2026-10-24' },
  { id: 3, name: 'Imran Qureshi', email: 'imran@example.com', role: 'Alumni', status: 'Active', lastLogin: '2026-10-22' },
  { id: 4, name: 'Events Coordinator', email: 'events@example.com', role: 'Moderator', status: 'Active', lastLogin: '2026-10-23' },
  { id: 5, name: 'Dr. Kavita Iyer', email: 'kavita.iyer@example.com', role: 'Faculty', status: 'Inactive', lastLogin: '2026-08-02' },
];

export const announcements = [
  { id: 1, title: 'Alumni Reunion registrations are open', audience: 'All alumni', date: '2026-10-21', status: 'Published', message: 'Register before 30 November to reserve your seat.' },
  { id: 2, title: 'Portal maintenance on Sunday night', audience: 'Everyone', date: '2026-10-18', status: 'Published', message: 'The portal may be unavailable for 30 minutes.' },
  { id: 3, title: 'Call for mentors, spring cohort', audience: 'Alumni', date: '2026-10-24', status: 'Draft', message: 'Apply to mentor current students.' },
];

export const stories = [
  { id: 1, title: 'From campus project to a funded company', name: 'Arjun Verma', batch: 2010, status: 'Published', summary: 'How a final-year project became a logistics software studio.' },
  { id: 2, title: 'Leading a plant of 400 people', name: 'Rohan Mehta', batch: 2014, status: 'Published', summary: 'A path from graduate trainee to operations director.' },
  { id: 3, title: 'Designing devices people love', name: 'Sneha Kulkarni', batch: 2020, status: 'Draft', summary: 'Embedded systems work for consumer hardware.' },
];

export const enquiries = [
  { id: 1, name: 'Rahul Bansal', email: 'rahul.b@example.com', subject: 'Transcript request', message: 'How can I request an official transcript for the class of 2013?', date: '2026-10-24', status: 'New' },
  { id: 2, name: 'Divya Krishnan', email: 'divya.k@example.com', subject: 'Event sponsorship', message: 'Our company would like to sponsor the reunion. Who should we contact?', date: '2026-10-23', status: 'New' },
  { id: 3, name: 'Sameer Khan', email: 'sameer.k@example.com', subject: 'Update my details', message: 'I changed jobs. How do I update my directory listing?', date: '2026-10-20', status: 'In progress' },
  { id: 4, name: 'Neha Trivedi', email: 'neha.t@example.com', subject: 'Mentorship programme', message: 'Is the mentorship programme open to the class of 2022?', date: '2026-10-15', status: 'Resolved' },
];

export const notifications = [
  { id: 1, type: 'approval', title: 'New article awaiting approval', detail: '“Notes on mentoring students” by Ananya Sharma', time: '2 hours ago', read: false },
  { id: 2, type: 'enquiry', title: 'New contact enquiry', detail: 'Rahul Bansal: Transcript request', time: '5 hours ago', read: false },
  { id: 3, type: 'event', title: 'Event registrations milestone', detail: 'Annual Alumni Reunion passed 300 registrations', time: 'Yesterday', read: false },
  { id: 4, type: 'system', title: 'Weekly backup completed', detail: 'All data snapshots finished successfully', time: '2 days ago', read: true },
  { id: 5, type: 'approval', title: 'Opportunity approved', detail: 'Site Engineer at Meridian Infrastructure', time: '3 days ago', read: true },
];

export const activityLogs = [
  { id: 1, actor: 'Portal Administrator', action: 'Approved article', target: 'Why I still come back to campus', time: '2026-10-25 10:42', level: 'Info' },
  { id: 2, actor: 'Events Coordinator', action: 'Created event', target: 'Mentorship Kick-off', time: '2026-10-24 16:10', level: 'Info' },
  { id: 3, actor: 'Portal Administrator', action: 'Changed role', target: 'Dr. Kavita Iyer → Faculty', time: '2026-10-23 09:31', level: 'Warning' },
  { id: 4, actor: 'System', action: 'Failed login attempts', target: '5 attempts from one address', time: '2026-10-22 23:05', level: 'Warning' },
  { id: 5, actor: 'Portal Administrator', action: 'Deleted gallery photo', target: 'Campus library', time: '2026-10-21 14:20', level: 'Info' },
  { id: 6, actor: 'System', action: 'Backup completed', target: 'Weekly snapshot', time: '2026-10-21 02:00', level: 'Info' },
];

/** Monthly engagement, sample values. */
export const engagement = [
  { m: 'May', visits: 1240, signups: 38 }, { m: 'Jun', visits: 1480, signups: 52 }, { m: 'Jul', visits: 1390, signups: 41 },
  { m: 'Aug', visits: 1820, signups: 66 }, { m: 'Sep', visits: 2210, signups: 84 }, { m: 'Oct', visits: 2640, signups: 97 },
];

export const faqs = [
  { q: 'How do I approve alumni submissions?', a: 'Open Content Approvals under Management, review each item, then choose Approve or Reject.' },
  { q: 'How do I add or edit alumni records?', a: 'Go to People → Alumni. Use Add alumni to create a record, or Edit on any row.' },
  { q: 'Can I export data?', a: 'Yes. Reports & Exports lets you download alumni, events, articles and enquiries as CSV files.' },
  { q: 'Why does my data reset on refresh?', a: 'This build has no backend, so changes live in memory. Connect an API to persist them.' },
];
