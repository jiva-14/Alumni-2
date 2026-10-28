import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import AlumniCard from '../components/AlumniCard';
import { CardSkeletons, EmptyState, ErrorState } from '../components/ui';
import { alumni as alumniData } from '../data/mockData';
import '../styles/directory.css';

const yearOf = (a) => a.graduationYear || a.batch || a.year;
const deptOf = (a) => a.department || a.branch;
const nameOf = (a) => a.name || a.fullName || '';
const roleOf = (a) => a.currentRole || a.role || '';
const PAGE = 6;
const uniq = (list) => [...new Set(list.filter(Boolean))];

/**
 * Alumni directory: search, department / year / location filters, sorting and load-more.
 * Every control composes with the others; changing one never resets another.
 * Sample data is fictional and is NOT a verified list of real alumni.
 */
export default function AlumniDirectory({ alumni = alumniData, loading = false, error = null, onRetry }) {
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [dept, setDept] = useState('');
  const [place, setPlace] = useState('');
  const [sort, setSort] = useState('name');
  const [shown, setShown] = useState(PAGE);

  const years = useMemo(() => uniq(alumni.map(yearOf)).sort().reverse(), [alumni]);
  const depts = useMemo(() => uniq(alumni.map(deptOf)).sort(), [alumni]);
  const places = useMemo(() => uniq(alumni.map((a) => a.location)).sort(), [alumni]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return alumni
      .filter((a) => !year || String(yearOf(a)) === year)
      .filter((a) => !dept || deptOf(a) === dept)
      .filter((a) => !place || a.location === place)
      .filter((a) => !term || [nameOf(a), a.company, roleOf(a), deptOf(a), a.location].filter(Boolean).join(' ').toLowerCase().includes(term))
      .sort((a, b) => (sort === 'year' ? String(yearOf(b)).localeCompare(String(yearOf(a))) || nameOf(a).localeCompare(nameOf(b))
        : sort === 'company' ? String(a.company || '').localeCompare(String(b.company || '')) || nameOf(a).localeCompare(nameOf(b))
        : nameOf(a).localeCompare(nameOf(b))));
  }, [alumni, q, year, dept, place, sort]);

  useEffect(() => setShown(PAGE), [q, year, dept, place, sort]);

  const active = [
    q.trim() && { label: `“${q.trim()}”`, clear: () => setQ('') },
    year && { label: `Class of ${year}`, clear: () => setYear('') },
    dept && { label: dept, clear: () => setDept('') },
    place && { label: place, clear: () => setPlace('') },
  ].filter(Boolean);
  const clearAll = () => { setQ(''); setYear(''); setDept(''); setPlace(''); };
  const visible = results.slice(0, shown);

  const sel = (value, set, label, all, opts, fmt = (x) => x) => opts.length > 0 && (
    <select className="select" value={value} onChange={(e) => set(e.target.value)} aria-label={label}>
      <option value="">{all}</option>{opts.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
    </select>
  );

  return (
    <>
      <PageHeader title="Alumni directory" subtitle="Find classmates and fellow graduates of Maharana Pratap Group of Institutions." crumbs={[{ to: '/', label: 'Home' }, { label: 'Alumni' }]} />
      <div className="section">
        <div className="container">
          <p className="demo-note" role="note">Sample profiles shown here are fictional demonstration records, not verified alumni.</p>
          <div className="toolbar" role="search">
            <SearchBar value={q} onChange={setQ} placeholder="Search by name, company, role or city" label="Search alumni" />
            {sel(dept, setDept, 'Filter by department', 'All departments', depts)}
            {sel(year, setYear, 'Filter by graduation year', 'All years', years)}
            {sel(place, setPlace, 'Filter by location', 'All locations', places)}
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort alumni">
              <option value="name">Sort: Name (A–Z)</option><option value="year">Sort: Newest class</option><option value="company">Sort: Company</option>
            </select>
          </div>

          {active.length > 0 && (
            <div className="chips" aria-label="Active filters">
              {active.map((c) => <span className="chip" key={c.label}>{c.label}<button type="button" onClick={c.clear} aria-label={`Remove filter ${c.label}`}>×</button></span>)}
              <button type="button" className="link-btn" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {loading ? <CardSkeletons />
            : error ? <ErrorState message={typeof error === 'string' ? error : undefined} onRetry={onRetry} />
            : results.length === 0 ? (
              <EmptyState icon="search" title="No alumni match your search"
                message="Try a different name or remove some filters."
                action={<button type="button" className="btn btn--outline btn--sm" onClick={clearAll}>Clear all filters</button>} />
            ) : (
              <>
                <p className="result-count" aria-live="polite">Showing {visible.length} of {results.length} alumni</p>
                <div className="card-grid">{visible.map((a) => <AlumniCard key={a.id ?? a._id} alumni={a} />)}</div>
                {shown < results.length && (
                  <div className="dir-foot"><button type="button" className="btn btn--outline" onClick={() => setShown((n) => n + PAGE)}>Load more alumni</button></div>
                )}
              </>
            )}
        </div>
      </div>
    </>
  );
}
