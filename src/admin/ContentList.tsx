import { useState } from 'react';
import styles from './ContentList.module.css';

interface ContentListProps {
  sections: Record<string, unknown>;
  onSelect: (k: string) => void;
  onCreate: (name: string) => void;
  onDelete: (name: string) => void;
  current: string;
}

export default function ContentList({ sections, onSelect, onCreate, onDelete, current }: ContentListProps) {
  const keys = Object.keys(sections || {}).sort();
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onCreate(trimmed);
      setNewName('');
    }
  };

  return (
    <div className={styles.contentList}>
      <h3 className={styles.title}>Sections</h3>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          placeholder="new-section-key"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <button onClick={handleCreate}>Add</button>
      </div>
      <ul className={styles.list}>
        {keys.map(k => (
          <li key={k} className={styles.listItem}>
            <button 
              onClick={() => onSelect(k)} 
              className={`${styles.listButton} ${current === k ? styles.listButtonActive : styles.listButtonInactive}`}
            >
              {k}
            </button>
            <button 
              className={styles.deleteButton}
              onClick={() => onDelete(k)} 
              title={`Delete ${k}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


