import { useId } from 'react';
import { Icon } from './ui';
import '../styles/directory.css';

/** Controlled search input: <SearchBar value={q} onChange={setQ} /> */
export default function SearchBar({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
  const id = useId();
  return (
    <div className="searchbar" role="search">
      <label htmlFor={id} className="sr-only">{label}</label>
      <Icon name="search" size={18} />
      <input id={id} type="search" className="input" value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" />
      {value && (
        <button type="button" className="searchbar__clear" onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
