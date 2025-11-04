import { useEffect, useState } from 'react';
import Login from './Login';
import ContentList from './ContentList';
import SectionEditor from './SectionEditor';
import { fetchAllContent, getMe, logout, updateSection, deleteSection } from './api';
import { SECTION_KEYS, getTemplateFor } from '@/types/content';

export default function AdminApp() {
  const [auth, setAuth] = useState(false);
  const [sections, setSections] = useState<Record<string, unknown>>({});
  const [current, setCurrent] = useState('');

  async function load() {
    const me = await getMe();
    setAuth(me.authenticated);
    if (me.authenticated) {
      const { content } = await fetchAllContent();
      setSections(content);
      setCurrent(Object.keys(content)[0] || 'home');
    }
  }
  async function createSection(name: string) {
    await updateSection(name, getTemplateFor(name));
    const { content } = await fetchAllContent();
    setSections(content);
    setCurrent(name);
  }

  async function removeSection(name: string) {
    if (!confirm(`Delete section "${name}"?`)) return;
    await deleteSection(name);
    const { content } = await fetchAllContent();
    setSections(content);
    setCurrent(Object.keys(content)[0] || '');
  }

  async function syncKnownSections() {
    // Ensure all SECTION_KEYS exist with defaults, without touching existing ones
    const existingKeys = new Set(Object.keys(sections || {}));
    for (const key of SECTION_KEYS) {
      if (!existingKeys.has(key)) {
        await updateSection(key, getTemplateFor(key));
      }
    }
    const { content } = await fetchAllContent();
    setSections(content);
    if (!content[current]) setCurrent(Object.keys(content)[0] || 'home');
  }

  useEffect(() => { load(); }, []);

  if (!auth) return <Login onLoggedIn={load} />;

  return (
    <>
      <style>{`
        .admin-container {
          max-width: 1100px;
          margin: 32px auto;
          padding: 12px;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .admin-main {
          display: flex;
          gap: 16px;
        }
        .admin-sidebar {
          min-width: 200px;
          flex-shrink: 0;
        }
        .admin-divider {
          width: 1px;
          background-color: #ddd;
          flex-shrink: 0;
        }
        .admin-sections-list {
          font-size: 14px;
          overflow-x: auto;
        }
        .admin-editor-container {
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .admin-container {
            margin: 16px auto;
            padding: 8px;
          }
          .admin-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .admin-main {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            margin-bottom: 16px;
            min-width: unset;
          }
          .admin-divider {
            display: none;
          }
          .admin-sections-list {
            font-size: 12px;
            white-space: nowrap;
          }
        }
        @media (max-width: 480px) {
          .admin-container {
            padding: 8px;
            margin: 8px;
          }
        }
      `}</style>
      <div className="admin-container">
        <div className="admin-header">
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
          <button onClick={async () => { await logout(); setAuth(false); }} style={{ padding: '8px 16px' }}>Logout</button>
        </div>
        <div style={{ marginBottom: 8, color: '#888' }}>
          <div className="admin-sections-list">Known sections: {SECTION_KEYS.join(', ')}</div>
        </div>
        <div className="admin-main">
          <div className="admin-sidebar">
            <ContentList sections={sections} onSelect={setCurrent} onCreate={createSection} onDelete={removeSection} current={current} />
            <div style={{ paddingTop: 8 }}>
              <button onClick={syncKnownSections} style={{ fontSize: '14px', padding: '6px 12px' }}>Add all known sections</button>
            </div>
          </div>
          <div className="admin-divider"></div>
          <div className="admin-editor-container">
            {current && <SectionEditor section={current} />}
          </div>
        </div>
      </div>
    </>
  );
}


