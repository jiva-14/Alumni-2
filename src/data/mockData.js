/* SAMPLE DATA FOR UI PREVIEW ONLY.
   Replace these exports with data from your API when a backend exists.
   All people and organisations below are fictional. */

export const alumni = [
  { id: 1, name: 'Ananya Sharma', graduationYear: 2016, department: 'Computer Science', currentRole: 'Senior Software Engineer', company: 'Northwind Labs', location: 'Bengaluru', email: 'ananya@example.com', bio: 'Builds data platforms and mentors early-career engineers. Active in the campus coding club as a student.', skills: ['Cloud', 'Data engineering', 'Mentoring'], experience: [{ role: 'Senior Software Engineer', company: 'Northwind Labs', period: '2021 – Present' }, { role: 'Software Engineer', company: 'Bluepeak Systems', period: '2016 – 2021' }], education: [{ degree: 'B.Tech, Computer Science', school: 'University', period: '2012 – 2016' }], achievements: ['Best Final-Year Project, 2016', 'Speaker at a regional developer conference'] },
  { id: 2, name: 'Rohan Mehta', graduationYear: 2014, department: 'Mechanical Engineering', currentRole: 'Operations Director', company: 'Kestrel Manufacturing', location: 'Pune', email: 'rohan@example.com', bio: 'Leads plant operations and supply-chain improvement programmes.', skills: ['Operations', 'Lean', 'Leadership'], experience: [{ role: 'Operations Director', company: 'Kestrel Manufacturing', period: '2020 – Present' }, { role: 'Process Engineer', company: 'Auric Motors', period: '2014 – 2020' }], education: [{ degree: 'B.E., Mechanical Engineering', school: 'University', period: '2010 – 2014' }], achievements: ['Gold medallist, 2014'] },
  { id: 3, name: 'Priya Nair', graduationYear: 2018, department: 'Business Administration', currentRole: 'Product Manager', company: 'Lumen Health', location: 'Mumbai', email: 'priya@example.com', bio: 'Product manager focused on patient-facing digital tools.', skills: ['Product', 'Research', 'Strategy'], experience: [{ role: 'Product Manager', company: 'Lumen Health', period: '2021 – Present' }, { role: 'Business Analyst', company: 'Orbit Consulting', period: '2018 – 2021' }], education: [{ degree: 'MBA', school: 'University', period: '2016 – 2018' }], achievements: ['Alumni Young Achiever Award'] },
  { id: 4, name: 'Imran Qureshi', graduationYear: 2012, department: 'Civil Engineering', currentRole: 'Project Lead', company: 'Meridian Infrastructure', location: 'Lucknow', email: 'imran@example.com', bio: 'Delivers public infrastructure projects across northern India.', skills: ['Project management', 'Structures'], experience: [{ role: 'Project Lead', company: 'Meridian Infrastructure', period: '2018 – Present' }], education: [{ degree: 'B.Tech, Civil Engineering', school: 'University', period: '2008 – 2012' }], achievements: ['Led a 12-km bridge programme'] },
  { id: 5, name: 'Sneha Kulkarni', graduationYear: 2020, department: 'Electronics', currentRole: 'Hardware Engineer', company: 'Quanta Devices', location: 'Hyderabad', email: 'sneha@example.com', bio: 'Designs embedded systems for consumer devices.', skills: ['Embedded', 'PCB design'], experience: [{ role: 'Hardware Engineer', company: 'Quanta Devices', period: '2020 – Present' }], education: [{ degree: 'B.Tech, Electronics', school: 'University', period: '2016 – 2020' }], achievements: ['Two filed patents'] },
  { id: 6, name: 'Arjun Verma', graduationYear: 2010, department: 'Computer Science', currentRole: 'Founder & CEO', company: 'Tidewater Software', location: 'Delhi', email: 'arjun@example.com', bio: 'Founded a software studio serving logistics companies.', skills: ['Entrepreneurship', 'Software', 'Hiring'], experience: [{ role: 'Founder & CEO', company: 'Tidewater Software', period: '2015 – Present' }], education: [{ degree: 'B.Tech, Computer Science', school: 'University', period: '2006 – 2010' }], achievements: ['Featured in a regional startup list'] },
  { id: 7, name: 'Meera Joshi', graduationYear: 2019, department: 'Business Administration', currentRole: 'Marketing Manager', company: 'Saffron & Co.', location: 'Jaipur', email: 'meera@example.com', bio: 'Brand and growth marketer for consumer businesses.', skills: ['Branding', 'Analytics'], experience: [{ role: 'Marketing Manager', company: 'Saffron & Co.', period: '2022 – Present' }], education: [{ degree: 'BBA', school: 'University', period: '2016 – 2019' }], achievements: [] },
  { id: 8, name: 'Karan Singh', graduationYear: 2017, department: 'Mechanical Engineering', currentRole: 'Design Engineer', company: 'Aerolite Dynamics', location: 'Chennai', email: 'karan@example.com', bio: 'Works on lightweight structural components.', skills: ['CAD', 'Simulation'], experience: [{ role: 'Design Engineer', company: 'Aerolite Dynamics', period: '2017 – Present' }], education: [{ degree: 'B.E., Mechanical Engineering', school: 'University', period: '2013 – 2017' }], achievements: ['Employee of the Year, 2023'] },
];

export const events = [
  { id: 1, title: 'Annual Alumni Reunion', date: '2026-12-13', time: '10:00 AM', location: 'Main Campus Auditorium', category: 'Reunion', capacity: 400, description: 'A day of reunions, campus tours and a gala dinner for all batches.', details: ['Registration opens at 9:00 AM with a welcome tea.', 'Batch photographs and campus tour in the late morning.', 'Gala dinner and cultural evening to close the day.'] },
  { id: 2, title: 'Career Talk: Careers in Data', date: '2026-11-14', time: '5:00 PM', location: 'Online', category: 'Webinar', capacity: 250, description: 'Alumni working in data roles share how they got started and what they look for when hiring.', details: ['Three short talks followed by open Q&A.', 'Recording shared with registered attendees.'] },
  { id: 3, title: 'Startup Founders Meet-up', date: '2026-11-28', time: '4:00 PM', location: 'Innovation Centre', category: 'Networking', capacity: 80, description: 'Alumni founders and aspiring entrepreneurs meet to exchange ideas and find collaborators.', details: ['Lightning pitches from alumni founders.', 'Open networking over refreshments.'] },
  { id: 4, title: 'Sports Day for Alumni', date: '2027-01-17', time: '8:00 AM', location: 'University Grounds', category: 'Sports', capacity: 200, description: 'Friendly cricket, football and badminton matches between batches.', details: ['Teams are formed by graduation year.', 'Lunch provided for all participants.'] },
  { id: 5, title: 'Mentorship Kick-off', date: '2027-02-06', time: '11:00 AM', location: 'Seminar Hall B', category: 'Mentorship', capacity: 120, description: 'Meet your mentor or mentee for the new academic year.', details: ['Introduction to the mentorship programme.', 'Speed-matching session.'] },
];

export const posts = [
  { id: 1, title: 'What I learned in my first five years as an engineer', category: 'Career', author: 'Ananya Sharma', date: '2026-10-02', excerpt: 'Lessons on learning fast, asking better questions and choosing teams over titles.', content: ['When I started, I thought the job was about writing code. It is mostly about understanding problems.', 'Find people who explain things well and ask them a lot of questions. Keep a record of what you learn.', 'Choose a team that gives you feedback early. A good manager is worth more than a good title.'] },
  { id: 2, title: 'From campus project to a funded company', category: 'Entrepreneurship', author: 'Arjun Verma', date: '2026-09-18', excerpt: 'How a final-year project grew into a business, and the mistakes along the way.', content: ['Our first customer was a family friend with a warehouse and a spreadsheet.', 'We built what they needed, not what we thought was clever.', 'Hiring slowly and talking to customers weekly saved us more than once.'] },
  { id: 3, title: 'Why I still come back to campus', category: 'Community', author: 'Priya Nair', date: '2026-09-05', excerpt: 'A reflection on friendships, mentors and giving back.', content: ['Every visit reminds me how much the people here shaped me.', 'Mentoring a student for a semester gave me more than it gave them.'] },
  { id: 4, title: 'Moving into operations leadership', category: 'Career', author: 'Rohan Mehta', date: '2026-08-21', excerpt: 'What changes when you go from fixing problems to building systems.', content: ['Operations is about making good outcomes repeatable.', 'Spend time on the shop floor. Numbers rarely tell the whole story.'] },
];

export const gallery = [
  { id: 1, title: 'Reunion 2025', category: 'Reunions', tone: 0, tall: true },
  { id: 2, title: 'Convocation day', category: 'Campus', tone: 1 },
  { id: 3, title: 'Founders meet-up', category: 'Networking', tone: 2, tall: true },
  { id: 4, title: 'Sports day', category: 'Sports', tone: 3 },
  { id: 5, title: 'Campus library', category: 'Campus', tone: 4 },
  { id: 6, title: 'Mentorship session', category: 'Networking', tone: 5, tall: true },
  { id: 7, title: 'Batch of 2010', category: 'Reunions', tone: 1 },
  { id: 8, title: 'Cricket final', category: 'Sports', tone: 2 },
];

export const groups = [
  { id: 1, name: 'Tech & Engineering', members: 'Open to all alumni', description: 'Share projects, ask technical questions and swap job leads.' },
  { id: 2, name: 'Entrepreneurs', members: 'Open to all alumni', description: 'A space for founders and people planning to start something.' },
  { id: 3, name: 'City Chapters', members: 'Open to all alumni', description: 'Meet alumni living in your city and organise local get-togethers.' },
  { id: 4, name: 'Mentorship Circle', members: 'Open to all alumni', description: 'Offer guidance to students or find a mentor of your own.' },
];

export const opportunities = [
  { id: 1, title: 'Backend Engineer', company: 'Northwind Labs', type: 'Full-time', location: 'Bengaluru', postedBy: 'Ananya Sharma', description: 'Build services that power analytics for enterprise customers.' },
  { id: 2, title: 'Operations Intern', company: 'Kestrel Manufacturing', type: 'Internship', location: 'Pune', postedBy: 'Rohan Mehta', description: 'Support plant reporting and process improvement projects.' },
  { id: 3, title: 'Product Designer', company: 'Lumen Health', type: 'Full-time', location: 'Remote', postedBy: 'Priya Nair', description: 'Design patient-facing mobile experiences.' },
  { id: 4, title: 'Site Engineer', company: 'Meridian Infrastructure', type: 'Contract', location: 'Lucknow', postedBy: 'Imran Qureshi', description: 'Supervise civil works on a regional road project.' },
];

export const myArticles = [
  { id: 1, title: 'What I learned in my first five years as an engineer', category: 'Career', status: 'Published', date: '2026-10-02' },
  { id: 2, title: 'Notes on mentoring students', category: 'Community', status: 'Pending', date: '2026-10-20' },
  { id: 3, title: 'Draft: Hiring for potential', category: 'Career', status: 'Draft', date: '2026-10-22' },
];

export const approvals = [
  { id: 1, type: 'Article', title: 'Notes on mentoring students', submittedBy: 'Ananya Sharma', date: '2026-10-20', status: 'Pending' },
  { id: 2, type: 'Opportunity', title: 'Site Engineer at Meridian Infrastructure', submittedBy: 'Imran Qureshi', date: '2026-10-19', status: 'Pending' },
  { id: 3, type: 'Gallery photo', title: 'Convocation day', submittedBy: 'Meera Joshi', date: '2026-10-17', status: 'Pending' },
  { id: 4, type: 'Article', title: 'Why I still come back to campus', submittedBy: 'Priya Nair', date: '2026-09-04', status: 'Approved' },
];

export const activities = [
  'Your article “Notes on mentoring students” is awaiting approval.',
  'You were listed in the Class of 2016 directory.',
  'A new event, Career Talk: Careers in Data, was published.',
];

export const departments = ['Computer Science', 'Mechanical Engineering', 'Business Administration', 'Civil Engineering', 'Electronics'];
