import { useEffect, useState } from 'react';
import Login from './Login';
import ContentList from './ContentList';
import SectionEditor from './SectionEditor';
import { getMe, logout } from './api';
import { SECTION_KEYS } from '@/types/content';
import { useAdminContent } from './useAdminContent';
import styles from './AdminApp.module.css';

export default function AdminApp() {
  const [auth, setAuth] = useState(false);
  const [current, setCurrent] = useState('');
  const { sections, loadSections, createSection, removeSection, syncKnownSections } = useAdminContent();

  async function load() {
    const me = await getMe();
    setAuth(me.authenticated);
    if (me.authenticated) {
      const content = await loadSections();
      setCurrent(Object.keys(content)[0] || 'home');
    }
  }

  const handleCreateSection = async (name: string) => {
    await createSection(name);
    setCurrent(name);
  };

  const handleRemoveSection = async (name: string) => {
    const content = await removeSection(name);
    if (content) {
      setCurrent(Object.keys(content)[0] || '');
    }
  };

  const handleSyncSections = async () => {
    const content = await syncKnownSections();
    if (content && !content[current]) {
      setCurrent(Object.keys(content)[0] || 'home');
    }
  };

  useEffect(() => { load(); }, []);

  if (!auth) return <Login onLoggedIn={load} />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Admin Panel</h2>
        <button 
          className={styles.logoutButton}
          onClick={async () => { 
            await logout(); 
            setAuth(false); 
          }}
        >
          Logout
        </button>
      </div>
      <div className={styles.sectionsInfo}>
        <div className={styles.sectionsList}>Known sections: {SECTION_KEYS.join(', ')}</div>
      </div>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <ContentList 
            sections={sections} 
            onSelect={setCurrent} 
            onCreate={handleCreateSection} 
            onDelete={handleRemoveSection} 
            current={current} 
          />
          <div className={styles.syncButtonContainer}>
            <button 
              className={styles.syncButton}
              onClick={handleSyncSections}
            >
              Add all known sections
            </button>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.editorContainer}>
          {current && <SectionEditor section={current} />}
        </div>
      </div>
    </div>
  );
}


