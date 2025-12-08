import { useState, useCallback } from 'react';
import { fetchAllContent, updateSection, deleteSection } from './api';
import { SECTION_KEYS, getTemplateFor } from '@/types/content';

export function useAdminContent() {
  const [sections, setSections] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { content } = await fetchAllContent();
      setSections(content);
      return content;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load content';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (name: string) => {
    try {
      setError(null);
      await updateSection(name, getTemplateFor(name));
      const content = await loadSections();
      return content;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create section';
      setError(message);
      throw err;
    }
  }, [loadSections]);

  const removeSection = useCallback(async (name: string) => {
    if (!confirm(`Delete section "${name}"?`)) return;
    
    try {
      setError(null);
      await deleteSection(name);
      const content = await loadSections();
      return content;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete section';
      setError(message);
      throw err;
    }
  }, [loadSections]);

  const syncKnownSections = useCallback(async () => {
    try {
      setError(null);
      const existingKeys = new Set(Object.keys(sections || {}));
      const promises = SECTION_KEYS
        .filter(key => !existingKeys.has(key))
        .map(key => updateSection(key, getTemplateFor(key)));
      
      await Promise.all(promises);
      return await loadSections();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync sections';
      setError(message);
      throw err;
    }
  }, [sections, loadSections]);

  return {
    sections,
    loading,
    error,
    loadSections,
    createSection,
    removeSection,
    syncKnownSections,
  };
}

