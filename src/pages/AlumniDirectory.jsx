import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import AlumniCard from '../components/AlumniCard';
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui';
import { alumni as alumniData } from '../data/mockData';
import '../styles/directory.css';

const yearOf = (a) => a.graduationYear || a.batch || a.year;
const deptOf = (a) => a.department || a.branch;
const nameOf = (a) => a.name || a.fullName || '';

/**
 * Presentational directory with search, filters and sorting.
 * Feed it your existing data: <AlumniDirectory alumni={list} loading={isLoading} error={err} />
 */
export default function AlumniDirectory({ alumni = alumniData, loading = false, error = null, onRetry }) {
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [dept, setDept] = useState('');
  const [sort, setSort] = useState('name');

  const years = useMemo(() => [...new Set(alumni.map(yearOf).filter(Boolean))].sort().reverse(), [alumni]);
  const depts = useMemo(() => [...new Set(alumni.map(deptOf).filter(Boolean))].sort(), [alumni]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return alumni
      .filter((a) => !year || String(yearOf(a)) === year)
      .filter((a) => !dept || deptOf(a) === dept)
      .filter((a) => !term || [nameOf(a), a.company, a.currentRole, a.role, deptOf(a)].filter(Boolean).join(' ').toLowerCase().includes(term))
      .sort((a, b) => (sort === 'year' ? String(yearOf(b)).localeCompare(String(yearOf(a))) : nameOf(a).localeCompare(nameOf(b))));
  }, [alumni, q, year, dept, sort]);

  return (
    <>
      <PageHeader title="Alumni directory" subtitle="Find classmates and fellow graduates." crumbs={[{ to: '/', label: 'Home' }, { label: 'Alumni' }]} />
      <div className="section">
        <div className="container">
          <div className="toolbar">
            <SearchBar value={q} onChange={setQ} placeholder="Search by name, company or role" label="Search alumni" />
            {years.length > 0 && (
              <select className="select" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Filter by graduation year">
                <option value="">All years</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            )}
            {depts.length > 0 && (
              <select className="select" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Filter by department">
                <option value="">All departments</option>{depts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort alumni">
              <option value="name">Sort: Name</option><option value="year">Sort: Newest class</option>
            </select>
          </div>

          {loading ? <CardSkeletons />
            : error ? <ErrorState message={typeof error === 'string' ? error : undefined} onRetry={onRetry} />
            : results.length === 0 ? (
              <EmptyState icon="search" title="No alumni match your search"
                message="Try a different name or clear the filters."
                action={<button className="btn btn--outline btn--sm" onClick={() => { setQ(''); setYear(''); setDept(''); }}>Clear filters</button>} />
            ) : (
              <>
                <p className="result-count" aria-live="polite">{results.length} alumni found</p>
                <div className="card-grid">{results.map((a) => <AlumniCard key={a.id ?? a._id} alumni={a} />)}</div>
              </>
            )}
        </div>
      </div>
    </>
  );
}
