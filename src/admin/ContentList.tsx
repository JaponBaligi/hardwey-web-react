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
    <div style={{ paddingRight: 24, width: 260 }}>
      <h3>Sections</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input
          placeholder="new-section-key"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={() => { const n = newName.trim(); if (n) { onCreate(n); setNewName(''); } }}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {keys.map(k => (
          <li key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => onSelect(k)} style={{ flex: 1, textAlign: 'left', fontWeight: current === k ? 700 : 400 }}>{k}</button>
            <button onClick={() => onDelete(k)} title={`Delete ${k}`}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


