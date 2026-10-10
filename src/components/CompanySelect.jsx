import { useState, useEffect, useRef } from 'react';
import { companyData } from '../data/companyData';

// Source priority: Clearbit (high-quality logos) → Google favicon → initials
const LOGO_SOURCES = (domain) => [
  `https://logo.clearbit.com/${domain}`,
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
];

function CompanyLogo({ company }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const initials = company.name.substring(0, 2).toUpperCase();

  const sources = company.domain ? LOGO_SOURCES(company.domain) : [];
  const failed = sourceIndex >= sources.length;

  if (!company.domain || failed) {
    return <div className="company-logo-placeholder">{initials}</div>;
  }

  return (
    <img
      className="company-logo"
      src={sources[sourceIndex]}
      onError={() => setSourceIndex((i) => i + 1)}
      alt=""
    />
  );
}

export default function CompanySelect({ value, onChange, filteredData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const containerRef = useRef(null);

  const data = filteredData ?? companyData;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (company) => {
    setSelectedCompany(company);
    onChange(company.name);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select${isOpen ? ' open' : ''}`}
      id="companySelect"
    >
      <div
        className="custom-select-trigger"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); setIsOpen((o) => !o); }}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen((o) => !o)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="selected-company">
          {selectedCompany ? (
            <>
              <CompanyLogo company={selectedCompany} />
              <span>{selectedCompany.name}</span>
            </>
          ) : (
            <span style={{ color: '#94A3B8' }}>Select Platform</span>
          )}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className="custom-options" role="listbox">
        {data.map((group) => (
          <div key={group.category}>
            <div className="custom-category">{group.category}</div>
            {group.companies.map((company) => (
              <div
                key={company.name}
                className="custom-option"
                role="option"
                aria-selected={value === company.name}
                onClick={() => handleSelect(company)}
              >
                <CompanyLogo company={company} />
                {company.name}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Hidden input for form value */}
      <input type="hidden" id="company" name="company" value={value} />
    </div>
  );
}
