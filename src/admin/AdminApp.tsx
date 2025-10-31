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
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>Admin Panel</h2>
        <button onClick={async () => { await logout(); setAuth(false); }}>Logout</button>
      </div>
      <div style={{ marginBottom: 8, color: '#888' }}>
        Known sections: {SECTION_KEYS.join(', ')}
      </div>
      <div style={{ display: 'flex' }}>
        <div>
          <ContentList sections={sections} onSelect={setCurrent} onCreate={createSection} onDelete={removeSection} current={current} />
          <div style={{ paddingTop: 8 }}>
            <button onClick={syncKnownSections}>Add all known sections</button>
          </div>
        </div>
        <div style={{ width: 64, borderRight: '1px solid #ddd', flexShrink: 0 }}></div>
        {current && <SectionEditor section={current} />}
      </div>
    </div>
  );
}


