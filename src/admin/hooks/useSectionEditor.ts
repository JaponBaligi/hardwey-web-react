import { useEffect, useState, useRef } from 'react';
import { fetchSection, updateSection, uploadImage } from '../api';
import { invalidateContentCache } from '@/hooks/useContent';
import { getTemplateFor } from '@/types/content';
import { normalizeSectionData } from '../sectionNormalizers';

export function useSectionEditor(section: string) {
  const [data, setData] = useState<any>({ text: '', images: [], links: [] });
  const [serverData, setServerData] = useState<any>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [rawJson, setRawJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  
  const fileRef = useRef<HTMLInputElement | null>(null);
  const backgroundFileRef = useRef<HTMLInputElement | null>(null);
  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const gifFileRef = useRef<HTMLInputElement | null>(null);
  const starFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr('');
    fetchSection(section)
      .then(({ data }) => {
        if (!ignore) {
          const norm = normalizeSectionData(section, data || {});
          setData(norm);
          setServerData(norm);
          setRawJson(JSON.stringify(norm, null, 2));
        }
      })
      .catch(e => { 
        if (!ignore) {
          if (e.message.includes('404') || e.message.includes('Not found') || e.message.includes('Failed to load') || e.message.includes('401') || e.message.includes('Unauthorized')) {
            const template = getTemplateFor(section);
            const norm = normalizeSectionData(section, template || {});
            setData(norm);
            setServerData(norm);
            setRawJson(JSON.stringify(norm, null, 2));
            if (e.message.includes('401') || e.message.includes('Unauthorized')) {
              setErr('Authentication required. Please log in to the admin panel.');
            } else {
              setErr('');
            }
          } else {
            setErr(e.message);
          }
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [section]);

  async function onSave() {
    setSaving(true);
    setErr('');
    try {
      if (jsonMode) {
        let parsed: any;
        try {
          parsed = JSON.parse(rawJson);
        } catch (e: any) {
          setErr('Invalid JSON');
          setSaving(false);
          return;
        }
        await updateSection(section, parsed);
        const norm = normalizeSectionData(section, parsed);
        setData(norm);
        setServerData(norm);
        setRawJson(JSON.stringify(norm, null, 2));
      } else {
        await updateSection(section, data);
        setRawJson(JSON.stringify(data, null, 2));
        setServerData(data);
      }
      invalidateContentCache();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function reloadFromServer() {
    try {
      const { data: fresh } = await fetchSection(section);
      const norm = normalizeSectionData(section, fresh || {});
      setServerData(norm);
      setData(norm);
      setRawJson(JSON.stringify(norm, null, 2));
      setErr('');
    } catch (e: any) {
      setErr(e.message);
    }
  }

  function addLink() {
    setData((prev: any) => ({ ...prev, links: [...(prev.links||[]), { label: '', url: '' }] }));
  }

  function removeLink(i: number) {
    setData((prev: any) => ({ ...prev, links: prev.links.filter((_: any, idx: number) => idx !== i) }));
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      if (section === 'fredAgain') {
        setData((prev: any) => ({ ...prev, logoUrls: [...(prev.logoUrls||[]), url] }));
      } else if (section === 'hero') {
        setData((prev: any) => ({ ...prev, motifs: [...(prev.motifs||[]), url] }));
      } else {
        setData((prev: any) => ({ ...prev, images: [...(prev.images||[]), url] }));
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function onUploadBackground(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      if (section === 'faqIntro') {
        setData((prev: any) => ({ ...prev, recordImage: url }));
      } else if (section === 'shares') {
        setData((prev: any) => ({ ...prev, imageUrl: url }));
      } else if (section === 'nftDisclaimer') {
        setData((prev: any) => ({ ...prev, monaImageUrl: url }));
      } else {
        setData((prev: any) => ({ ...prev, backgroundImage: url }));
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      if (backgroundFileRef.current) backgroundFileRef.current.value = '';
    }
  }

  async function onUploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      if (section === 'nftDisclaimer') {
        setData((prev: any) => ({ ...prev, starIconUrl: url }));
        if (starFileRef.current) starFileRef.current.value = '';
      } else if (section === 'investment') {
        setData((prev: any) => ({ ...prev, logoImage: url }));
        if (logoFileRef.current) logoFileRef.current.value = '';
      } else {
        setData((prev: any) => ({ ...prev, logoUrl: url }));
        if (logoFileRef.current) logoFileRef.current.value = '';
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function onUploadGif(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      setData((prev: any) => ({ ...prev, gifImageUrl: url }));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      if (gifFileRef.current) gifFileRef.current.value = '';
    }
  }

  async function onUploadStar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      setData((prev: any) => ({ ...prev, starImageUrl: url }));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      if (starFileRef.current) starFileRef.current.value = '';
    }
  }

  return {
    data,
    setData,
    serverData,
    jsonMode,
    setJsonMode,
    rawJson,
    setRawJson,
    loading,
    saving,
    err,
    setErr,
    onSave,
    reloadFromServer,
    addLink,
    removeLink,
    onUpload,
    onUploadBackground,
    onUploadLogo,
    onUploadGif,
    onUploadStar,
    fileRef,
    backgroundFileRef,
    logoFileRef,
    gifFileRef,
    starFileRef,
  };
}

