import { useRef } from 'react';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function FileUpload({ id, label, required, accept, fileName, onChange }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="form-group">
      <label>{label}{required && ' *'}</label>
      <div
        className="file-upload-wrapper"
        onClick={() => inputRef.current?.click()}
      >
        <label className="file-upload-label" htmlFor={id}>
          <UploadIcon />
          <span>Click to upload {label}</span>
          <span style={{ fontSize: '0.75rem' }}>(JPG, PNG, PDF max 5MB)</span>
        </label>
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={id}
          accept={accept}
          required={required}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        {fileName && <div className="file-name">{fileName}</div>}
      </div>
    </div>
  );
}
