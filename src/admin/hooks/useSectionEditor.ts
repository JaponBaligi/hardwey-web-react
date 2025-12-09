import { useEffect, useState, useRef } from 'react';
import { fetchSection, updateSection, uploadImage } from '../api';
import { invalidateContentCache } from '@/hooks/useContent';
import { getTemplateFor } from '@/types/content';
import { normalizeSectionData } from '../sectionNormalizers';

export function useSectionEditor(section: string) {
  const [data, setData] = useState<Record<string, unknown>>({ text: '', images: [], links: [] });
  const [serverData, setServerData] = useState<Record<string, unknown> | null>(null);
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
      .catch((error: unknown) => { 
        if (!ignore) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('404') || errorMessage.includes('Not found') || errorMessage.includes('Failed to load') || errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            const template = getTemplateFor(section);
            const norm = normalizeSectionData(section, template || {});
            setData(norm);
            setServerData(norm);
            setRawJson(JSON.stringify(norm, null, 2));
            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
              setErr('Authentication required. Please log in to the admin panel.');
            } else {
              setErr('');
            }
          } else {
            setErr(errorMessage);
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
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(rawJson) as Record<string, unknown>;
        } catch {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
    }
  }

  function addLink() {
    setData((prev) => {
      const prevData = prev as Record<string, unknown>;
      const links = (prevData.links as Array<{ label: string; url: string }> | undefined) || [];
      return { ...prevData, links: [...links, { label: '', url: '' }] };
    });
  }

  function removeLink(i: number) {
    setData((prev) => {
      const prevData = prev as Record<string, unknown>;
      const links = (prevData.links as Array<{ label: string; url: string }> | undefined) || [];
      return { ...prevData, links: links.filter((_, idx: number) => idx !== i) };
    });
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      if (section === 'fredAgain') {
        setData((prev) => {
          const prevData = prev as Record<string, unknown>;
          const logoUrls = (prevData.logoUrls as string[] | undefined) || [];
          return { ...prevData, logoUrls: [...logoUrls, url] };
        });
      } else if (section === 'hero') {
        setData((prev) => {
          const prevData = prev as Record<string, unknown>;
          const motifs = (prevData.motifs as string[] | undefined) || [];
          return { ...prevData, motifs: [...motifs, url] };
        });
      } else {
        setData((prev) => {
          const prevData = prev as Record<string, unknown>;
          const images = (prevData.images as string[] | undefined) || [];
          return { ...prevData, images: [...images, url] };
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
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
        setData((prev) => ({ ...(prev as Record<string, unknown>), recordImage: url }));
      } else if (section === 'shares') {
        setData((prev) => ({ ...(prev as Record<string, unknown>), imageUrl: url }));
      } else if (section === 'nftDisclaimer') {
        setData((prev) => ({ ...(prev as Record<string, unknown>), monaImageUrl: url }));
      } else {
        setData((prev) => ({ ...(prev as Record<string, unknown>), backgroundImage: url }));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
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
        setData((prev) => ({ ...(prev as Record<string, unknown>), starIconUrl: url }));
        if (starFileRef.current) starFileRef.current.value = '';
      } else if (section === 'investment') {
        setData((prev) => ({ ...(prev as Record<string, unknown>), logoImage: url }));
        if (logoFileRef.current) logoFileRef.current.value = '';
      } else {
        setData((prev) => ({ ...(prev as Record<string, unknown>), logoUrl: url }));
        if (logoFileRef.current) logoFileRef.current.value = '';
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
    }
  }

  async function onUploadGif(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      setData((prev) => ({ ...(prev as Record<string, unknown>), gifImageUrl: url }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
    } finally {
      if (gifFileRef.current) gifFileRef.current.value = '';
    }
  }

  async function onUploadStar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      setData((prev) => ({ ...(prev as Record<string, unknown>), starImageUrl: url }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErr(errorMessage);
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

