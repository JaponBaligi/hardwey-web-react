import { useState } from 'react';

export default function ContentList({ sections, onSelect, onCreate, onDelete, current }: {
  sections: Record<string, unknown>;
  onSelect: (k: string) => void;
  onCreate: (name: string) => void;
  onDelete: (name: string) => void;
  current: string;
}) {
  const keys = Object.keys(sections || {}).sort();
  const [newName, setNewName] = useState('');
  return (
    <>
      <style>{`
        .content-list {
          padding-right: 24px;
          width: 260px;
        }
        @media (max-width: 768px) {
          .content-list {
            padding-right: 0;
            width: 100%;
          }
        }
      `}</style>
      <div className="content-list">
        <h3 style={{ marginTop: 0 }}>Sections</h3>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          <input
            placeholder="new-section-key"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            style={{ flex: 1, minWidth: 150 }}
          />
          <button onClick={() => { const n = newName.trim(); if (n) { onCreate(n); setNewName(''); } }}>Add</button>
        </div>
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
          {keys.map(k => (
            <li key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <button 
                onClick={() => onSelect(k)} 
                style={{ 
                  flex: 1, 
                  textAlign: 'left', 
                  fontWeight: current === k ? 700 : 400,
                  padding: '6px 8px',
                  fontSize: '14px'
                }}
              >
                {k}
              </button>
              <button 
                onClick={() => onDelete(k)} 
                title={`Delete ${k}`}
                style={{ padding: '4px 8px' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}


