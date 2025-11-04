import { useEffect, useState, useRef } from 'react';
import { fetchSection, updateSection, uploadImage } from './api';
import Preview from './Preview';
import { invalidateContentCache } from '@/hooks/useContent';
import { getTemplateFor } from '@/types/content';

export default function SectionEditor({ section }: { section: string }) {
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
          const norm = normalize(data || {});
          setData(norm);
          setServerData(norm);
          setRawJson(JSON.stringify(norm, null, 2));
        }
      })
      .catch(e => { 
        if (!ignore) {
          // If section doesn't exist (404 or 401), use template data
          if (e.message.includes('404') || e.message.includes('Not found') || e.message.includes('Failed to load') || e.message.includes('401') || e.message.includes('Unauthorized')) {
            const template = getTemplateFor(section);
            const norm = normalize(template || {});
            setData(norm);
            setServerData(norm);
            setRawJson(JSON.stringify(norm, null, 2));
            // Only show error if it's a real auth issue (not just missing section)
            if (e.message.includes('401') || e.message.includes('Unauthorized')) {
              setErr('Authentication required. Please log in to the admin panel.');
            } else {
              setErr(''); // Clear error for missing sections
            }
          } else {
            setErr(e.message);
          }
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [section]);

  function normalize(d: any) {
    if (section === 'fredAgain') {
      return {
        heading: typeof d?.heading === 'string' ? d.heading : '',
        subheading: typeof d?.subheading === 'string' ? d.subheading : '',
        backgroundImage: typeof d?.backgroundImage === 'string' ? d.backgroundImage : '',
        backgroundImageSrcSet: typeof d?.backgroundImageSrcSet === 'string' ? d.backgroundImageSrcSet : '',
        logoUrls: Array.isArray(d?.logoUrls) ? d.logoUrls : [],
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'hero') {
      return {
        logoUrl: typeof d?.logoUrl === 'string' ? d.logoUrl : '',
        backgroundImage: typeof d?.backgroundImage === 'string' ? d.backgroundImage : '',
        backgroundImageSrcSet: typeof d?.backgroundImageSrcSet === 'string' ? d.backgroundImageSrcSet : '',
        mitaText: typeof d?.mitaText === 'string' ? d.mitaText : '',
        subtitle: typeof d?.subtitle === 'string' ? d.subtitle : '',
        leftIdentifier: typeof d?.leftIdentifier === 'string' ? d.leftIdentifier : '',
        rightIdentifier: typeof d?.rightIdentifier === 'string' ? d.rightIdentifier : '',
        motifs: Array.isArray(d?.motifs) ? d.motifs : [],
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'errorPage') {
      return {
        error404: d?.error404 && typeof d.error404 === 'object' ? {
          title: typeof d.error404.title === 'string' ? d.error404.title : '',
          description: typeof d.error404.description === 'string' ? d.error404.description : ''
        } : { title: '', description: '' },
        error500: d?.error500 && typeof d.error500 === 'object' ? {
          title: typeof d.error500.title === 'string' ? d.error500.title : '',
          description: typeof d.error500.description === 'string' ? d.error500.description : ''
        } : { title: '', description: '' },
        error403: d?.error403 && typeof d.error403 === 'object' ? {
          title: typeof d.error403.title === 'string' ? d.error403.title : '',
          description: typeof d.error403.description === 'string' ? d.error403.description : ''
        } : { title: '', description: '' },
        defaultError: d?.defaultError && typeof d.defaultError === 'object' ? {
          title: typeof d.defaultError.title === 'string' ? d.defaultError.title : '',
          description: typeof d.defaultError.description === 'string' ? d.defaultError.description : ''
        } : { title: '', description: '' },
        backButtonText: typeof d?.backButtonText === 'string' ? d.backButtonText : '',
        backgroundPatternImage: typeof d?.backgroundPatternImage === 'string' ? d.backgroundPatternImage : '',
        arrowIcon: typeof d?.arrowIcon === 'string' ? d.arrowIcon : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'faqIntro') {
      let records: any[] = [];
      if (d?.records && Array.isArray(d.records)) {
        records = d.records.map((r: any, idx: number) => ({
          id: typeof r?.id === 'string' && r.id ? r.id : `record-${idx + 1}-${Date.now()}`,
          imageUrl: typeof r?.imageUrl === 'string' ? r.imageUrl : '',
          spotifyUrl: typeof r?.spotifyUrl === 'string' ? r.spotifyUrl : 'https://open.spotify.com/'
        }));
      } else if (d?.recordImage || d?.recordCount || d?.spotifyUrl) {
        // Migrate from old format to new format
        const recordCount = typeof d?.recordCount === 'number' && d.recordCount > 0 ? d.recordCount : 1;
        const recordImage = typeof d?.recordImage === 'string' ? d.recordImage : '/assets/img/Playlist R&B Retro Nostalgia.png';
        const spotifyUrl = typeof d?.spotifyUrl === 'string' ? d.spotifyUrl : 'https://open.spotify.com/';
        records = Array.from({ length: recordCount }, (_, idx) => ({
          id: `record-${idx + 1}-${Date.now()}`,
          imageUrl: recordImage,
          spotifyUrl: spotifyUrl
        }));
      }
      if (records.length === 0) {
        records = [{
          id: `record-1-${Date.now()}`,
          imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
          spotifyUrl: 'https://open.spotify.com/'
        }];
      }
      return {
        starCount: typeof d?.starCount === 'number' ? d.starCount : 7,
        records: records,
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'investmentIntro') {
      return {
        heading: typeof d?.heading === 'string' ? d.heading : '',
        subtitle: typeof d?.subtitle === 'string' ? d.subtitle : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'privacyPolicy') {
      // Check if data has old format (just text/images/links) - if so, use template
      const hasOldFormat = d?.text && !d?.sections && !d?.introText && !d?.pageTitle;
      
      if (hasOldFormat) {
        const template = getTemplateFor('privacyPolicy');
        d = template;
      }
      
      let sections: any[] = [];
      let introText: string[] = [];
      
      // Handle sections
      if (d?.sections && Array.isArray(d.sections)) {
        sections = d.sections.map((s: any) => ({
          title: typeof s?.title === 'string' ? s.title : '',
          paragraphs: Array.isArray(s?.paragraphs) ? s.paragraphs : [],
          lists: Array.isArray(s?.lists) ? s.lists : [],
          contactInfo: s?.contactInfo && typeof s.contactInfo === 'object' ? {
            email: typeof s.contactInfo.email === 'string' ? s.contactInfo.email : '',
            address: typeof s.contactInfo.address === 'string' ? s.contactInfo.address : ''
          } : undefined
        }));
      }
      
      // Handle introText
      if (Array.isArray(d?.introText)) {
        introText = d.introText.filter((t: any) => typeof t === 'string');
      } else if (typeof d?.introText === 'string') {
        introText = [d.introText];
      }
      
      return {
        pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : 'Privacy Policy',
        lastUpdated: typeof d?.lastUpdated === 'string' ? d.lastUpdated : '',
        introText: introText,
        sections: sections,
        footerButtonText: typeof d?.footerButtonText === 'string' ? d.footerButtonText : '',
        footerButtonEmail: typeof d?.footerButtonEmail === 'string' ? d.footerButtonEmail : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'terms') {
      // Check if data has old format (just text/images/links) - if so, use template
      const hasOldFormat = d?.text && !d?.sections && !d?.introText && !d?.pageTitle;
      
      if (hasOldFormat) {
        const template = getTemplateFor('terms');
        d = template;
      }
      
      let sections: any[] = [];
      let introText: string[] = [];
      
      // Handle sections
      if (d?.sections && Array.isArray(d.sections)) {
        sections = d.sections.map((s: any) => ({
          title: typeof s?.title === 'string' ? s.title : '',
          paragraphs: Array.isArray(s?.paragraphs) ? s.paragraphs : [],
          lists: Array.isArray(s?.lists) ? s.lists : [],
          disclaimer: s?.disclaimer && typeof s.disclaimer === 'object' ? {
            title: typeof s.disclaimer.title === 'string' ? s.disclaimer.title : '',
            text: typeof s.disclaimer.text === 'string' ? s.disclaimer.text : ''
          } : undefined,
          contactInfo: s?.contactInfo && typeof s.contactInfo === 'object' ? {
            email: typeof s.contactInfo.email === 'string' ? s.contactInfo.email : '',
            address: typeof s.contactInfo.address === 'string' ? s.contactInfo.address : ''
          } : undefined
        }));
      }
      
      // Handle introText
      if (Array.isArray(d?.introText)) {
        introText = d.introText.filter((t: any) => typeof t === 'string');
      } else if (typeof d?.introText === 'string') {
        introText = [d.introText];
      }
      
      return {
        pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : 'Terms of Service',
        lastUpdated: typeof d?.lastUpdated === 'string' ? d.lastUpdated : '',
        introText: introText,
        sections: sections,
        footerButtonText: typeof d?.footerButtonText === 'string' ? d.footerButtonText : '',
        footerButtonEmail: typeof d?.footerButtonEmail === 'string' ? d.footerButtonEmail : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'investment') {
      return {
        backgroundImage: typeof d?.backgroundImage === 'string' ? d.backgroundImage : '',
        mainHeading: typeof d?.mainHeading === 'string' ? d.mainHeading : '',
        animatedWords: Array.isArray(d?.animatedWords) ? d.animatedWords : [],
        comingSoonTitle: typeof d?.comingSoonTitle === 'string' ? d.comingSoonTitle : '',
        dateText: typeof d?.dateText === 'string' ? d.dateText : '',
        logoImage: typeof d?.logoImage === 'string' ? d.logoImage : '',
        welcomeText: typeof d?.welcomeText === 'string' ? d.welcomeText : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'shares') {
      return {
        heading: typeof d?.heading === 'string' ? d.heading : '',
        subheadingMobile: typeof d?.subheadingMobile === 'string' ? d.subheadingMobile : '',
        subheadingWords: Array.isArray(d?.subheadingWords) ? d.subheadingWords : [],
        bodyCopy: typeof d?.bodyCopy === 'string' ? d.bodyCopy : '',
        imageUrl: typeof d?.imageUrl === 'string' ? d.imageUrl : '',
        imageSrcSet: typeof d?.imageSrcSet === 'string' ? d.imageSrcSet : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'ticker') {
      return {
        backgroundColor: typeof d?.backgroundColor === 'string' ? d.backgroundColor : '#bbdbfa',
        tickerWords: Array.isArray(d?.tickerWords) ? d.tickerWords : [],
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'nftDisclaimer') {
      return {
        nopeText: typeof d?.nopeText === 'string' ? d.nopeText : 'Nope',
        wereText: typeof d?.wereText === 'string' ? d.wereText : "We're",
        nftsText: typeof d?.nftsText === 'string' ? d.nftsText : 'NFTs',
        valueMusicText: typeof d?.valueMusicText === 'string' ? d.valueMusicText : 'We value mu$ic more than pixels',
        resonateText: typeof d?.resonateText === 'string' ? d.resonateText : 'We\'re building something that resonates with everyone. Not just "PR".',
        resonateTextMobile: typeof d?.resonateTextMobile === 'string' ? d.resonateTextMobile : "we're building something that resonates with everyone. Not just crypto bros.",
        monaImageUrl: typeof d?.monaImageUrl === 'string' ? d.monaImageUrl : '/assets/img/mona-image2.jpg',
        monaImageSrcSet: typeof d?.monaImageSrcSet === 'string' ? d.monaImageSrcSet : '',
        gifImageUrl: typeof d?.gifImageUrl === 'string' ? d.gifImageUrl : '/assets/img/fav.gif',
        starIconUrl: typeof d?.starIconUrl === 'string' ? d.starIconUrl : '/assets/svg/hardwey-star.svg',
        notGraphicUrl: typeof d?.notGraphicUrl === 'string' ? d.notGraphicUrl : 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg',
        backgroundColor: typeof d?.backgroundColor === 'string' ? d.backgroundColor : '#d12d37',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'faq') {
      return {
        faqItems: Array.isArray(d?.faqItems) ? d.faqItems.map((item: any) => ({
          id: typeof item?.id === 'string' ? item.id : `faq-${Date.now()}`,
          question: typeof item?.question === 'string' ? item.question : '',
          subtitle: typeof item?.subtitle === 'string' ? item.subtitle : '',
          answer: typeof item?.answer === 'string' ? item.answer : '',
          additionalInfo: Array.isArray(item?.additionalInfo) ? item.additionalInfo : ['', '']
        })) : [],
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'founders') {
      return {
        founders: Array.isArray(d?.founders) ? d.founders.map((item: any) => ({
          id: typeof item?.id === 'string' ? item.id : `founder-${Date.now()}`,
          name: typeof item?.name === 'string' ? item.name : '',
          role: typeof item?.role === 'string' ? item.role : '',
          bio: typeof item?.bio === 'string' ? item.bio : '',
          quote: typeof item?.quote === 'string' ? item.quote : '',
          imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
          imageSrcSet: typeof item?.imageSrcSet === 'string' ? item.imageSrcSet : '',
          additionalInfo: Array.isArray(item?.additionalInfo) ? item.additionalInfo : []
        })) : [],
        heading: typeof d?.heading === 'string' ? d.heading : '',
        headingSingular: typeof d?.headingSingular === 'string' ? d.headingSingular : '',
        animatedWords: Array.isArray(d?.animatedWords) ? d.animatedWords : [],
        animatedTextMobile: typeof d?.animatedTextMobile === 'string' ? d.animatedTextMobile : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'partners') {
      return {
        pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : '',
        pageSubtitle: typeof d?.pageSubtitle === 'string' ? d.pageSubtitle : '',
        partners: Array.isArray(d?.partners) ? d.partners.map((item: any, index: number) => ({
          id: typeof item?.id === 'string' && item.id ? item.id : `partner-${index}-${Date.now()}`,
          name: typeof item?.name === 'string' ? item.name : '',
          title: typeof item?.title === 'string' ? item.title : '',
          description: typeof item?.description === 'string' ? item.description : '',
          imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
          imageSrcSet: typeof item?.imageSrcSet === 'string' ? item.imageSrcSet : '',
          websiteUrl: typeof item?.websiteUrl === 'string' ? item.websiteUrl : '',
          socialLinks: Array.isArray(item?.socialLinks) ? item.socialLinks.map((sl: any) => ({
            platform: typeof sl?.platform === 'string' ? sl.platform : '',
            url: typeof sl?.url === 'string' ? sl.url : ''
          })) : []
        })) : [],
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'collaboratives') {
      return {
        heading: typeof d?.heading === 'string' ? d.heading : '',
        collaboratives: Array.isArray(d?.collaboratives) ? d.collaboratives.map((item: any, index: number) => ({
          id: typeof item?.id === 'string' && item.id ? item.id : `collaborative-${index}-${Date.now()}`,
          name: typeof item?.name === 'string' ? item.name : '',
          title: typeof item?.title === 'string' ? item.title : '',
          description: typeof item?.description === 'string' ? item.description : '',
          imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
          imageSrcSet: typeof item?.imageSrcSet === 'string' ? item.imageSrcSet : '',
          websiteUrl: typeof item?.websiteUrl === 'string' ? item.websiteUrl : '',
          socialLinks: Array.isArray(item?.socialLinks) ? item.socialLinks.map((sl: any) => ({
            platform: typeof sl?.platform === 'string' ? sl.platform : '',
            url: typeof sl?.url === 'string' ? sl.url : ''
          })) : []
        })) : [],
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    if (section === 'moreFaq') {
      // Handle FAQ items - check if they exist and are an array
      let faqItems: any[] = [];
      if (d?.faqItems && Array.isArray(d.faqItems)) {
        faqItems = d.faqItems.map((item: any, index: number) => ({
          id: typeof item?.id === 'string' && item.id ? item.id : `faq-item-${index}-${Date.now()}`,
          question: typeof item?.question === 'string' ? item.question : '',
          subtitle: typeof item?.subtitle === 'string' ? item.subtitle : '',
          answer: typeof item?.answer === 'string' ? item.answer : '',
          additionalInfo: Array.isArray(item?.additionalInfo) && item.additionalInfo.length >= 2 
            ? item.additionalInfo.slice(0, 2)
            : Array.isArray(item?.additionalInfo) && item.additionalInfo.length === 1
            ? [item.additionalInfo[0], '']
            : typeof item?.additionalInfo === 'string'
            ? [item.additionalInfo, '']
            : ['', '']
        }));
      }
      
      return {
        pageTitle: typeof d?.pageTitle === 'string' ? d.pageTitle : '',
        pageSubtitle: typeof d?.pageSubtitle === 'string' ? d.pageSubtitle : '',
        faqItems: faqItems,
        imageUrl: typeof d?.imageUrl === 'string' ? d.imageUrl : '',
        contactHeading: typeof d?.contactHeading === 'string' ? d.contactHeading : '',
        contactButtonText: typeof d?.contactButtonText === 'string' ? d.contactButtonText : '',
        contactEmail: typeof d?.contactEmail === 'string' ? d.contactEmail : '',
        images: Array.isArray(d?.images) ? d.images : [],
        links: Array.isArray(d?.links) ? d.links : []
      };
    }
    return {
      text: typeof d?.text === 'string' ? d.text : '',
      images: Array.isArray(d?.images) ? d.images : [],
      links: Array.isArray(d?.links) ? d.links : []
    };
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
      } else if (section === 'investment') {
        setData((prev: any) => ({ ...prev, backgroundImage: url }));
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
      } else if (section === 'investment') {
        setData((prev: any) => ({ ...prev, logoImage: url }));
      } else {
        setData((prev: any) => ({ ...prev, logoUrl: url }));
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      if (section === 'nftDisclaimer') {
        if (starFileRef.current) starFileRef.current.value = '';
      } else if (section === 'investment') {
        if (logoFileRef.current) logoFileRef.current.value = '';
      } else {
        if (logoFileRef.current) logoFileRef.current.value = '';
      }
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


  function addMotif() {
    setData((prev: any) => ({ ...prev, motifs: [...(prev.motifs||[]), ''] }));
  }

  function removeMotif(i: number) {
    setData((prev: any) => ({ ...prev, motifs: prev.motifs.filter((_: any, idx: number) => idx !== i) }));
  }

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
        const norm = normalize(parsed);
        setData(norm);
        setServerData(norm);
        setRawJson(JSON.stringify(norm, null, 2));
      } else {
        await updateSection(section, data);
        setRawJson(JSON.stringify(data, null, 2));
        setServerData(data);
      }
      // Invalidate content cache so frontend components refetch updated content
      invalidateContentCache();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function reloadFromServer() {
    setLoading(true);
    setErr('');
    try {
      const { data: fresh } = await fetchSection(section);
      const norm = normalize(fresh || {});
      setServerData(norm);
      if (!jsonMode) setData(norm);
      setRawJson(JSON.stringify(norm, null, 2));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <style>{`
        .section-editor {
          flex: 1;
          padding-left: 24px;
          margin-left: 0;
        }
        .section-editor input,
        .section-editor textarea {
          box-sizing: border-box;
          max-width: 100%;
        }
        @media (max-width: 768px) {
          .section-editor {
            padding-left: 0;
            margin-left: 0;
          }
          .section-editor input,
          .section-editor textarea {
            width: 100% !important;
          }
        }
      `}</style>
      <div className="section-editor">
      <h3 style={{ color: '#ccc', marginBottom: 16, textTransform: 'uppercase' }}>Edit: {section}</h3>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <div style={{ marginBottom: 10, marginTop: 4 }}>
        <label><input type="checkbox" checked={jsonMode} onChange={e => setJsonMode(e.target.checked)} /> Advanced JSON</label>
      </div>
      {!jsonMode && section === 'fredAgain' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Heading</label>
            <input 
              type="text" 
              value={data.heading || ''} 
              onChange={e => setData({ ...data, heading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Imagine you invested in Fred Again.. in 2020"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Subheading</label>
            <input 
              type="text" 
              value={data.subheading || ''} 
              onChange={e => setData({ ...data, subheading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Braggin' rights now come with returns"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Image URL</label>
            <input 
              type="text" 
              value={data.backgroundImage || ''} 
              onChange={e => setData({ ...data, backgroundImage: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="https://..."
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadBackground} 
                ref={backgroundFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.backgroundImage && (
              <div style={{ marginTop: 8 }}>
                <img src={data.backgroundImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Image SrcSet (optional)</label>
            <textarea 
              value={data.backgroundImageSrcSet || ''} 
              onChange={e => setData({ ...data, backgroundImageSrcSet: e.target.value })} 
              rows={3} 
              style={{ width: '100%', padding: 8, fontFamily: 'monospace', fontSize: 12 }} 
              placeholder="image-500.jpg 500w, image-800.jpg 800w, ..."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Logo URLs</label>
            <div style={{ margin: '8px 0' }}>
              <input type="file" accept="image/*" onChange={onUpload} ref={fileRef} />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Upload logo image</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
              {(data.logoUrls || []).map((logoUrl: string, idx: number) => (
                <li key={idx} style={{ marginBottom: 8, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
                  <img src={logoUrl} alt={`Logo ${idx + 1}`} style={{ maxHeight: 60, maxWidth: 150, verticalAlign: 'middle', marginRight: 8 }} />
                  <input 
                    type="text" 
                    value={logoUrl} 
                    onChange={e => {
                      const next = [...(data.logoUrls || [])];
                      next[idx] = e.target.value;
                      setData({ ...data, logoUrls: next });
                    }} 
                    style={{ width: 'calc(100% - 200px)', padding: 4, marginRight: 8 }}
                  />
                  <button onClick={() => {
                    const next = (data.logoUrls || []).filter((_: any, i: number) => i !== idx);
                    setData({ ...data, logoUrls: next });
                  }}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {!jsonMode && section === 'hero' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Logo URL</label>
            <input 
              type="text" 
              value={data.logoUrl || ''} 
              onChange={e => setData({ ...data, logoUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/hardweybannertext.png"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadLogo} 
                ref={logoFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.logoUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: 150, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>MITA Text</label>
            <input 
              type="text" 
              value={data.mitaText || ''} 
              onChange={e => setData({ ...data, mitaText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Music is the answer™"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Subtitle</label>
            <input 
              type="text" 
              value={data.subtitle || ''} 
              onChange={e => setData({ ...data, subtitle: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="A movement in music. Redefining the rules."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Image URL</label>
            <input 
              type="text" 
              value={data.backgroundImage || ''} 
              onChange={e => setData({ ...data, backgroundImage: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/banner/artistlarge1.jpg"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadBackground} 
                ref={backgroundFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.backgroundImage && (
              <div style={{ marginTop: 8 }}>
                <img src={data.backgroundImage} alt="Background Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Image SrcSet (optional)</label>
            <textarea 
              value={data.backgroundImageSrcSet || ''} 
              onChange={e => setData({ ...data, backgroundImageSrcSet: e.target.value })} 
              rows={3} 
              style={{ width: '100%', padding: 8, fontFamily: 'monospace', fontSize: 12 }} 
              placeholder="/assets/banner/artistlarge1-p-500.jpg 500w, ..."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Left Identifier (SVG URL)</label>
            <input 
              type="text" 
              value={data.leftIdentifier || ''} 
              onChange={e => setData({ ...data, leftIdentifier: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/svg/investident-hero.svg"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Right Identifier (SVG URL)</label>
            <input 
              type="text" 
              value={data.rightIdentifier || ''} 
              onChange={e => setData({ ...data, rightIdentifier: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/svg/barcode-ident.svg"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Motifs (SVG URLs)</label>
            <button onClick={addMotif} style={{ marginBottom: 8 }}>Add Motif</button>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
              {(data.motifs || []).map((motif: string, idx: number) => (
                <li key={idx} style={{ marginBottom: 8, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
                  <span style={{ marginRight: 8, fontSize: 12, color: '#666' }}>Motif {idx + 1}:</span>
                  <input 
                    type="text" 
                    value={motif} 
                    onChange={e => {
                      const next = [...(data.motifs || [])];
                      next[idx] = e.target.value;
                      setData({ ...data, motifs: next });
                    }} 
                    style={{ width: 'calc(100% - 100px)', padding: 4, marginRight: 8 }}
                    placeholder="/assets/svg/motif.svg"
                  />
                  <button onClick={() => removeMotif(idx)}>Remove</button>
                  {motif && (
                    <div style={{ marginTop: 4 }}>
                      <img src={motif} alt={`Motif ${idx + 1}`} style={{ maxHeight: 40, maxWidth: 100, border: '1px solid #eee' }} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {!jsonMode && section === 'errorPage' && (
        <>
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
            <h4 style={{ marginTop: 0, marginBottom: 12, color: '#fff' }}>404 Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Title</label>
              <input 
                type="text" 
                value={data.error404?.title || ''} 
                onChange={e => setData({ ...data, error404: { ...data.error404, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="404 NOT FOUND"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Description</label>
              <textarea 
                value={data.error404?.description || ''} 
                onChange={e => setData({ ...data, error404: { ...data.error404, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="You dive too deep so you discovered an unexplored place..."
              />
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
            <h4 style={{ marginTop: 0, marginBottom: 12, color: '#fff' }}>500 Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Title</label>
              <input 
                type="text" 
                value={data.error500?.title || ''} 
                onChange={e => setData({ ...data, error500: { ...data.error500, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="500 SERVER ERROR"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Description</label>
              <textarea 
                value={data.error500?.description || ''} 
                onChange={e => setData({ ...data, error500: { ...data.error500, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="Oops! Something went wrong on our end..."
              />
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
            <h4 style={{ marginTop: 0, marginBottom: 12, color: '#fff' }}>403 Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Title</label>
              <input 
                type="text" 
                value={data.error403?.title || ''} 
                onChange={e => setData({ ...data, error403: { ...data.error403, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="403 FORBIDDEN"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Description</label>
              <textarea 
                value={data.error403?.description || ''} 
                onChange={e => setData({ ...data, error403: { ...data.error403, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="Access denied. You don't have permission to view this page."
              />
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
            <h4 style={{ marginTop: 0, marginBottom: 12, color: '#fff' }}>Default Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Title</label>
              <input 
                type="text" 
                value={data.defaultError?.title || ''} 
                onChange={e => setData({ ...data, defaultError: { ...data.defaultError, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="ERROR"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Description</label>
              <textarea 
                value={data.defaultError?.description || ''} 
                onChange={e => setData({ ...data, defaultError: { ...data.defaultError, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="An unexpected error occurred. Please try again later."
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Back Button Text</label>
            <input 
              type="text" 
              value={data.backButtonText || ''} 
              onChange={e => setData({ ...data, backButtonText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Back to Home"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Pattern Image URL</label>
            <input 
              type="text" 
              value={data.backgroundPatternImage || ''} 
              onChange={e => setData({ ...data, backgroundPatternImage: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/Green eye.gif"
            />
            {data.backgroundPatternImage && (
              <div style={{ marginTop: 8 }}>
                <img src={data.backgroundPatternImage} alt="Pattern Preview" style={{ maxWidth: '100%', maxHeight: 100, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Arrow Icon URL</label>
            <input 
              type="text" 
              value={data.arrowIcon || ''} 
              onChange={e => setData({ ...data, arrowIcon: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/svg/arrow-red.svg"
            />
            {data.arrowIcon && (
              <div style={{ marginTop: 8 }}>
                <img src={data.arrowIcon} alt="Arrow Preview" style={{ maxWidth: 50, maxHeight: 50, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
        </>
      )}
      {!jsonMode && section === 'faqIntro' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Star Count</label>
            <input 
              type="number" 
              value={data.starCount ?? 7} 
              onChange={e => setData({ ...data, starCount: parseInt(e.target.value, 10) || 0 })} 
              min="0"
              max="50"
              style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Number of asterisk stars to display</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#fff', fontWeight: 600 }}>Records</label>
              <button
                onClick={() => {
                  const newRecord = {
                    id: `record-${Date.now()}`,
                    imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
                    spotifyUrl: 'https://open.spotify.com/'
                  };
                  setData({ ...data, records: [...(data.records || []), newRecord] });
                }}
                style={{ padding: '6px 12px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Record
              </button>
            </div>
            {(data.records || []).length === 0 && (
              <div style={{ padding: 12, backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: 4, color: '#888', marginBottom: 12 }}>
                No records yet. Click "Add Record" to add one.
              </div>
            )}
            {(data.records || []).map((record: any, idx: number) => (
              <div key={record.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Record {idx + 1}</h4>
                  <button
                    onClick={() => {
                      const updated = [...(data.records || [])];
                      updated.splice(idx, 1);
                      setData({ ...data, records: updated });
                    }}
                    style={{ padding: '4px 8px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Image URL</label>
                  <input 
                    type="text" 
                    value={record.imageUrl || ''} 
                    onChange={e => {
                      const updated = [...(data.records || [])];
                      updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                      setData({ ...data, records: updated });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="/assets/img/Playlist R&B Retro Nostalgia.png"
                  />
                  <div style={{ marginTop: 4 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { url } = await uploadImage(file);
                          const updated = [...(data.records || [])];
                          updated[idx] = { ...updated[idx], imageUrl: url };
                          setData({ ...data, records: updated });
                        } catch (err: any) {
                          setErr(err.message);
                        }
                      }}
                    />
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
                  </div>
                  {record.imageUrl && (
                    <div style={{ marginTop: 8 }}>
                      <img src={record.imageUrl} alt={`Record ${idx + 1} Preview`} style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #555', borderRadius: 4 }} />
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Spotify URL</label>
                  <input 
                    type="text" 
                    value={record.spotifyUrl || ''} 
                    onChange={e => {
                      const updated = [...(data.records || [])];
                      updated[idx] = { ...updated[idx], spotifyUrl: e.target.value };
                      setData({ ...data, records: updated });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="https://open.spotify.com/"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!jsonMode && section === 'investmentIntro' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Heading</label>
            <input 
              type="text" 
              value={data.heading || ''} 
              onChange={e => setData({ ...data, heading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="If you've never invested..."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Subtitle</label>
            <input 
              type="text" 
              value={data.subtitle || ''} 
              onChange={e => setData({ ...data, subtitle: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="This one's for you"
            />
          </div>
        </>
      )}
      {!jsonMode && section === 'investment' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Image URL</label>
            <input 
              type="text" 
              value={data.backgroundImage || ''} 
              onChange={e => setData({ ...data, backgroundImage: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/BUY SHARES IMAGE.jpg"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadBackground} 
                ref={backgroundFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.backgroundImage && (
              <div style={{ marginTop: 8 }}>
                <img src={data.backgroundImage} alt="Background Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Main Heading</label>
            <input 
              type="text" 
              value={data.mainHeading || ''} 
              onChange={e => setData({ ...data, mainHeading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="invest in artists"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Animated Words (comma-separated)</label>
            <input 
              type="text" 
              value={Array.isArray(data.animatedWords) ? data.animatedWords.join(', ') : ''} 
              onChange={e => setData({ ...data, animatedWords: e.target.value.split(',').map(w => w.trim()).filter(w => w) })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="it, hits, different"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Words will be displayed in sequence with animation</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Coming Soon Title</label>
            <input 
              type="text" 
              value={data.comingSoonTitle || ''} 
              onChange={e => setData({ ...data, comingSoonTitle: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Coming soon"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Date Text</label>
            <input 
              type="text" 
              value={data.dateText || ''} 
              onChange={e => setData({ ...data, dateText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="(?/?/2026)"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Logo Image URL</label>
            <input 
              type="text" 
              value={data.logoImage || ''} 
              onChange={e => setData({ ...data, logoImage: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/hardweymainlogo.jpg"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadLogo} 
                ref={logoFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.logoImage && (
              <div style={{ marginTop: 8 }}>
                <img src={data.logoImage} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: 150, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Welcome Text</label>
            <input 
              type="text" 
              value={data.welcomeText || ''} 
              onChange={e => setData({ ...data, welcomeText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Welcome to HARDWEY"
            />
          </div>
        </>
      )}
      {!jsonMode && section === 'shares' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Heading</label>
            <input 
              type="text" 
              value={data.heading || ''} 
              onChange={e => setData({ ...data, heading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Buy shares in artists' brands"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Subheading (Mobile)</label>
            <input 
              type="text" 
              value={data.subheadingMobile || ''} 
              onChange={e => setData({ ...data, subheadingMobile: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="A new way to invest"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Subheading Words (Desktop - separate by commas)</label>
            <input 
              type="text" 
              value={(data.subheadingWords || []).join(', ')} 
              onChange={e => {
                const words = e.target.value.split(',').map(w => w.trim()).filter(w => w);
                setData({ ...data, subheadingWords: words });
              }} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="A new way, to, Invest"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Comma-separated words for desktop animation</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Body Copy</label>
            <textarea 
              value={data.bodyCopy || ''} 
              onChange={e => setData({ ...data, bodyCopy: e.target.value })} 
              rows={4} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Artists build brands that generate revenue..."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Image URL</label>
            <input 
              type="text" 
              value={data.imageUrl || ''} 
              onChange={e => setData({ ...data, imageUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/BUY%20SHARES%20IMAGE.jpg"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadBackground} 
                ref={backgroundFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.imageUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.imageUrl} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Image SrcSet (optional)</label>
            <textarea 
              value={data.imageSrcSet || ''} 
              onChange={e => setData({ ...data, imageSrcSet: e.target.value })} 
              rows={2} 
              style={{ width: '100%', padding: 8, fontFamily: 'monospace', fontSize: 12 }} 
              placeholder="/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, ..."
            />
          </div>
        </>
      )}
      {!jsonMode && section === 'ticker' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="color" 
                value={data.backgroundColor || '#bbdbfa'} 
                onChange={e => setData({ ...data, backgroundColor: e.target.value })} 
                style={{ width: 60, height: 40, padding: 0, border: '1px solid #ccc' }}
              />
              <input 
                type="text" 
                value={data.backgroundColor || '#bbdbfa'} 
                onChange={e => setData({ ...data, backgroundColor: e.target.value })} 
                style={{ flex: 1, padding: 8 }} 
                placeholder="#bbdbfa"
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Ticker Words (comma-separated)</label>
            <input 
              type="text" 
              value={(data.tickerWords || []).join(', ')} 
              onChange={e => {
                const words = e.target.value.split(',').map(w => w.trim()).filter(w => w);
                setData({ ...data, tickerWords: words });
              }} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Music, Shows, Merch, More"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Separate words with commas</span>
          </div>
        </>
      )}
      {!jsonMode && section === 'nftDisclaimer' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Nope Text</label>
            <input 
              type="text" 
              value={data.nopeText || ''} 
              onChange={e => setData({ ...data, nopeText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Nope"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>We're Text</label>
            <input 
              type="text" 
              value={data.wereText || ''} 
              onChange={e => setData({ ...data, wereText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="We're"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>NFTs Text</label>
            <input 
              type="text" 
              value={data.nftsText || ''} 
              onChange={e => setData({ ...data, nftsText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="NFTs"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Value Music Text</label>
            <input 
              type="text" 
              value={data.valueMusicText || ''} 
              onChange={e => setData({ ...data, valueMusicText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="We value mu$ic more than pixels"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Resonate Text (Desktop)</label>
            <textarea 
              value={data.resonateText || ''} 
              onChange={e => setData({ ...data, resonateText: e.target.value })} 
              rows={3} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="We're building something that resonates with everyone. Not just &quot;PR&quot;."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Resonate Text (Mobile)</label>
            <textarea 
              value={data.resonateTextMobile || ''} 
              onChange={e => setData({ ...data, resonateTextMobile: e.target.value })} 
              rows={3} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="we're building something that resonates with everyone. Not just crypto bros."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Mona Lisa Image URL</label>
            <input 
              type="text" 
              value={data.monaImageUrl || ''} 
              onChange={e => setData({ ...data, monaImageUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/mona-image2.jpg"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadBackground} 
                ref={backgroundFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.monaImageUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.monaImageUrl} alt="Mona Lisa Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Mona Image SrcSet (optional)</label>
            <textarea 
              value={data.monaImageSrcSet || ''} 
              onChange={e => setData({ ...data, monaImageSrcSet: e.target.value })} 
              rows={2} 
              style={{ width: '100%', padding: 8, fontFamily: 'monospace', fontSize: 12 }} 
              placeholder="/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, ..."
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>GIF Image URL</label>
            <input 
              type="text" 
              value={data.gifImageUrl || ''} 
              onChange={e => setData({ ...data, gifImageUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/fav.gif"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadGif} 
                ref={gifFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.gifImageUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.gifImageUrl} alt="GIF Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Star Icon URL</label>
            <input 
              type="text" 
              value={data.starIconUrl || ''} 
              onChange={e => setData({ ...data, starIconUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/svg/hardwey-star.svg"
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onUploadLogo} 
                ref={starFileRef}
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.starIconUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.starIconUrl} alt="Star Icon Preview" style={{ maxWidth: '100%', maxHeight: 100, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>NOT Graphic URL</label>
            <input 
              type="text" 
              value={data.notGraphicUrl || ''} 
              onChange={e => setData({ ...data, notGraphicUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="https://assets-global.website-files.com/..."
            />
            {data.notGraphicUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.notGraphicUrl} alt="NOT Graphic Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Background Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="color" 
                value={data.backgroundColor || '#d12d37'} 
                onChange={e => setData({ ...data, backgroundColor: e.target.value })} 
                style={{ width: 60, height: 40, padding: 0, border: '1px solid #ccc' }}
              />
              <input 
                type="text" 
                value={data.backgroundColor || '#d12d37'} 
                onChange={e => setData({ ...data, backgroundColor: e.target.value })} 
                style={{ flex: 1, padding: 8 }} 
                placeholder="#d12d37"
              />
            </div>
          </div>
        </>
      )}
      {!jsonMode && section === 'faq' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <button 
              onClick={() => {
                const newItem = {
                  id: `faq-${Date.now()}`,
                  question: '',
                  subtitle: '',
                  answer: '',
                  additionalInfo: ['', '']
                };
                setData({ ...data, faqItems: [...(data.faqItems || []), newItem] });
              }}
              style={{ marginBottom: 12 }}
            >
              Add FAQ Item
            </button>
            {(data.faqItems || []).map((faq: any, idx: number) => (
              <div key={faq.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>FAQ Item {idx + 1}</h4>
                  <button 
                    onClick={() => {
                      const next = (data.faqItems || []).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, faqItems: next });
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: 4 }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Heading (Question)</label>
                  <input 
                    type="text" 
                    value={faq.question || ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      next[idx] = { ...next[idx], question: e.target.value };
                      setData({ ...data, faqItems: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="How does it work?"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Supportive Text (Subtitle)</label>
                  <input 
                    type="text" 
                    value={faq.subtitle || ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      next[idx] = { ...next[idx], subtitle: e.target.value };
                      setData({ ...data, faqItems: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="It's remarkably simple"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Description (Answer)</label>
                  <textarea 
                    value={faq.answer || ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      next[idx] = { ...next[idx], answer: e.target.value };
                      setData({ ...data, faqItems: next });
                    }} 
                    rows={4} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="We work closely with artists and their teams to launch their shares on HARDWEY..."
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!jsonMode && section === 'founders' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Heading (Plural)</label>
            <input 
              type="text" 
              value={data.heading || ''} 
              onChange={e => setData({ ...data, heading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="The Founders"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Used when there are multiple founders</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Heading (Singular)</label>
            <input 
              type="text" 
              value={data.headingSingular || ''} 
              onChange={e => setData({ ...data, headingSingular: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="The Founder"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Used when there is only one founder</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Animated Words (comma-separated)</label>
            <input 
              type="text" 
              value={Array.isArray(data.animatedWords) ? data.animatedWords.join(', ') : ''} 
              onChange={e => setData({ ...data, animatedWords: e.target.value.split(',').map(w => w.trim()).filter(w => w) })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="long, story, short"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Words displayed with animation (desktop)</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Animated Text (Mobile)</label>
            <input 
              type="text" 
              value={data.animatedTextMobile || ''} 
              onChange={e => setData({ ...data, animatedTextMobile: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Long story short"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Full text displayed on mobile</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <button 
              onClick={() => {
                const newFounder = {
                  id: `founder-${Date.now()}`,
                  name: '',
                  role: '',
                  bio: '',
                  quote: '',
                  imageUrl: '',
                  imageSrcSet: '',
                  additionalInfo: ['']
                };
                setData({ ...data, founders: [...(data.founders || []), newFounder] });
              }}
              style={{ marginBottom: 12, padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Add Founder
            </button>
            {(data.founders || []).map((founder: any, idx: number) => (
              <div key={founder.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Founder {idx + 1}</h4>
                  <button 
                    onClick={() => {
                      const next = (data.founders || []).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, founders: next });
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
                  <input 
                    type="text" 
                    value={founder.name || ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setData({ ...data, founders: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="Metehan İlikhan"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Role</label>
                  <input 
                    type="text" 
                    value={founder.role || ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], role: e.target.value };
                      setData({ ...data, founders: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="Founder & CEO"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Quote</label>
                  <input 
                    type="text" 
                    value={founder.quote || ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], quote: e.target.value };
                      setData({ ...data, founders: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="We're building a movement in music"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Bio</label>
                  <textarea 
                    value={founder.bio || ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], bio: e.target.value };
                      setData({ ...data, founders: next });
                    }} 
                    rows={4} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="More than a decade ago, our friendship sparked..."
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Image URL</label>
                  <input 
                    type="text" 
                    value={founder.imageUrl || ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], imageUrl: e.target.value };
                      setData({ ...data, founders: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="/assets/banner/founder.jpg"
                  />
                  <div style={{ marginTop: 4 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        uploadImage(file).then(({ url }) => {
                          const next = [...(data.founders || [])];
                          next[idx] = { ...next[idx], imageUrl: url };
                          setData({ ...data, founders: next });
                        }).catch(err => setErr(err.message));
                      }} 
                    />
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
                  </div>
                  {founder.imageUrl && (
                    <div style={{ marginTop: 8 }}>
                      <img src={founder.imageUrl} alt="Founder Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Image SrcSet</label>
                  <input 
                    type="text" 
                    value={founder.imageSrcSet || ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], imageSrcSet: e.target.value };
                      setData({ ...data, founders: next });
                    }} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Additional Info (one per line)</label>
                  <textarea 
                    value={Array.isArray(founder.additionalInfo) ? founder.additionalInfo.join('\n') : ''} 
                    onChange={e => {
                      const next = [...(data.founders || [])];
                      next[idx] = { ...next[idx], additionalInfo: e.target.value.split('\n').filter(line => line.trim()) };
                      setData({ ...data, founders: next });
                    }} 
                    rows={3} 
                    style={{ width: '100%', padding: 8 }} 
                    placeholder="Passionate about democratizing music investment
Believes in the power of artist-fan connections"
                  />
                  <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Each line will be a separate info item</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!jsonMode && section === 'moreFaq' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Page Title</label>
            <input 
              type="text" 
              value={data.pageTitle || ''} 
              onChange={e => setData({ ...data, pageTitle: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="More FAQ It"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Page Subtitle</label>
            <textarea 
              value={data.pageSubtitle || ''} 
              onChange={e => setData({ ...data, pageSubtitle: e.target.value })} 
              rows={2} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Everything you need to know about investing in artists"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, color: '#ccc', fontSize: 12 }}>
              {Array.isArray(data.faqItems) && data.faqItems.length > 0 
                ? `${data.faqItems.length} FAQ item(s) loaded`
                : 'No FAQ items found'}
            </div>
            <button 
              onClick={() => {
                const newItem = {
                  id: `faq-${Date.now()}`,
                  question: '',
                  subtitle: '',
                  answer: '',
                  additionalInfo: ['', '']
                };
                setData({ ...data, faqItems: [...(data.faqItems || []), newItem] });
              }}
              style={{ marginBottom: 12, padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Add FAQ Item
            </button>
            {(!data.faqItems || !Array.isArray(data.faqItems) || data.faqItems.length === 0) && (
              <div style={{ padding: 16, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444', color: '#ccc', marginBottom: 16, fontSize: 14 }}>
                No FAQ items found. Click "Add FAQ Item" to create one, or click "Reload current" if you expect items to exist.
              </div>
            )}
            {Array.isArray(data.faqItems) && data.faqItems.map((faq: any, idx: number) => (
              <div key={faq.id || `faq-${idx}`} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>FAQ Item {idx + 1}</h4>
                  <button 
                    onClick={() => {
                      const next = (data.faqItems || []).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, faqItems: next });
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: 4 }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Heading (Question)</label>
                  <input 
                    type="text" 
                    value={faq.question || ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      next[idx] = { ...next[idx], question: e.target.value };
                      setData({ ...data, faqItems: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="How does it work?"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Supportive Text (Subtitle)</label>
                  <input 
                    type="text" 
                    value={faq.subtitle || ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      next[idx] = { ...next[idx], subtitle: e.target.value };
                      setData({ ...data, faqItems: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="It's remarkably simple"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Description (Answer)</label>
                  <textarea 
                    value={faq.answer || ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      next[idx] = { ...next[idx], answer: e.target.value };
                      setData({ ...data, faqItems: next });
                    }} 
                    rows={4} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="We work closely with artists and their teams to launch their shares on HARDWEY..."
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Additional Info Line 1</label>
                  <input 
                    type="text" 
                    value={Array.isArray(faq.additionalInfo) && faq.additionalInfo[0] ? faq.additionalInfo[0] : ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      const additionalInfo = Array.isArray(next[idx].additionalInfo) ? [...next[idx].additionalInfo] : ['', ''];
                      additionalInfo[0] = e.target.value;
                      next[idx] = { ...next[idx], additionalInfo };
                      setData({ ...data, faqItems: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Additional information line 1"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Additional Info Line 2</label>
                  <input 
                    type="text" 
                    value={Array.isArray(faq.additionalInfo) && faq.additionalInfo[1] ? faq.additionalInfo[1] : ''} 
                    onChange={e => {
                      const next = [...(data.faqItems || [])];
                      const additionalInfo = Array.isArray(next[idx].additionalInfo) ? [...next[idx].additionalInfo] : ['', ''];
                      additionalInfo[1] = e.target.value;
                      next[idx] = { ...next[idx], additionalInfo };
                      setData({ ...data, faqItems: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Additional information line 2"
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Image URL</label>
            <input 
              type="text" 
              value={data.imageUrl || ''} 
              onChange={e => setData({ ...data, imageUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="https://..."
            />
            <div style={{ marginTop: 4 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  uploadImage(file).then(({ url }) => {
                    setData({ ...data, imageUrl: url });
                  }).catch(err => setErr(err.message));
                }} 
              />
              <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
            </div>
            {data.imageUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={data.imageUrl} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Contact Heading</label>
            <input 
              type="text" 
              value={data.contactHeading || ''} 
              onChange={e => setData({ ...data, contactHeading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="More questions? We've got more answers"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Contact Button Text</label>
            <input 
              type="text" 
              value={data.contactButtonText || ''} 
              onChange={e => setData({ ...data, contactButtonText: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="don't be shy, it's okay to send mail"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Contact Email</label>
            <input 
              type="email" 
              value={data.contactEmail || ''} 
              onChange={e => setData({ ...data, contactEmail: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="hello@hardweyllc.com"
            />
          </div>
        </>
      )}
      {!jsonMode && (section === 'privacyPolicy' || section === 'terms') && (
        <>
          {(data.sections || []).length === 0 && (data.introText || []).length === 0 && (
            <div style={{ padding: 12, backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: 4, color: '#888', marginBottom: 16 }}>
              No content loaded. If you have existing content, try clicking "Reload current" or check the JSON view below.
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Page Title</label>
            <input 
              type="text" 
              value={data.pageTitle || ''} 
              onChange={e => setData({ ...data, pageTitle: e.target.value })} 
              style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
              placeholder={section === 'privacyPolicy' ? 'Privacy Policy' : 'Terms of Service'}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Last Updated</label>
            <input 
              type="text" 
              value={data.lastUpdated || ''} 
              onChange={e => setData({ ...data, lastUpdated: e.target.value })} 
              style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
              placeholder="October 11th, 2025"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#fff', fontWeight: 600 }}>
                Intro Text {data.introText && Array.isArray(data.introText) && data.introText.length > 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>({data.introText.length} paragraph{data.introText.length !== 1 ? 's' : ''})</span>}
              </label>
              <button
                onClick={() => {
                  setData({ ...data, introText: [...(data.introText || []), ''] });
                }}
                style={{ padding: '6px 12px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
              >
                Add Paragraph
              </button>
            </div>
            {(data.introText || []).length === 0 && (
              <div style={{ padding: 8, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#666', fontSize: '13px', marginBottom: 8 }}>
                No intro paragraphs. Click "Add Paragraph" to add one.
              </div>
            )}
            {(data.introText || []).map((para: string, idx: number) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <textarea 
                    value={para} 
                    onChange={e => {
                      const updated = [...(data.introText || [])];
                      updated[idx] = e.target.value;
                      setData({ ...data, introText: updated });
                    }} 
                    rows={3}
                    style={{ flex: 1, padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Enter intro paragraph..."
                  />
                  <button
                    onClick={() => {
                      const updated = [...(data.introText || [])];
                      updated.splice(idx, 1);
                      setData({ ...data, introText: updated });
                    }}
                    style={{ padding: '8px 12px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#fff', fontWeight: 600 }}>
                Sections {data.sections && Array.isArray(data.sections) && data.sections.length > 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>({data.sections.length} section{data.sections.length !== 1 ? 's' : ''})</span>}
              </label>
              <button
                onClick={() => {
                  const newSection = {
                    title: '',
                    paragraphs: [],
                    lists: []
                  };
                  setData({ ...data, sections: [...(data.sections || []), newSection] });
                }}
                style={{ padding: '6px 12px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Section
              </button>
            </div>
            {(data.sections || []).length === 0 && (
              <div style={{ padding: 12, backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: 4, color: '#888', marginBottom: 12 }}>
                No sections yet. Click "Add Section" to add one, or check the "Current (server)" JSON below to see what data exists.
              </div>
            )}
            {(data.sections || []).map((sec: any, secIdx: number) => (
              <div key={secIdx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Section {secIdx + 1}</h4>
                  <button
                    onClick={() => {
                      const updated = [...(data.sections || [])];
                      updated.splice(secIdx, 1);
                      setData({ ...data, sections: updated });
                    }}
                    style={{ padding: '4px 8px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Title</label>
                  <input 
                    type="text" 
                    value={sec.title || ''} 
                    onChange={e => {
                      const updated = [...(data.sections || [])];
                      updated[secIdx] = { ...updated[secIdx], title: e.target.value };
                      setData({ ...data, sections: updated });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Section title"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Paragraphs</label>
                    <button
                      onClick={() => {
                        const updated = [...(data.sections || [])];
                        updated[secIdx] = { ...updated[secIdx], paragraphs: [...(updated[secIdx].paragraphs || []), ''] };
                        setData({ ...data, sections: updated });
                      }}
                      style={{ padding: '4px 8px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                    >
                      Add
                    </button>
                  </div>
                  {(sec.paragraphs || []).map((para: string, paraIdx: number) => (
                    <div key={paraIdx} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <textarea 
                          value={para} 
                          onChange={e => {
                            const updated = [...(data.sections || [])];
                            updated[secIdx].paragraphs[paraIdx] = e.target.value;
                            setData({ ...data, sections: updated });
                          }} 
                          rows={2}
                          style={{ flex: 1, padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                          placeholder="Paragraph text..."
                        />
                        <button
                          onClick={() => {
                            const updated = [...(data.sections || [])];
                            updated[secIdx].paragraphs.splice(paraIdx, 1);
                            setData({ ...data, sections: updated });
                          }}
                          style={{ padding: '4px 8px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Lists</label>
                    <button
                      onClick={() => {
                        const updated = [...(data.sections || [])];
                        updated[secIdx] = { ...updated[secIdx], lists: [...(updated[secIdx].lists || []), []] };
                        setData({ ...data, sections: updated });
                      }}
                      style={{ padding: '4px 8px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                    >
                      Add List
                    </button>
                  </div>
                  {(sec.lists || []).map((list: string[], listIdx: number) => (
                    <div key={listIdx} style={{ marginBottom: 12, padding: 12, backgroundColor: '#1a1a1a', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: '12px', color: '#888' }}>List {listIdx + 1}</label>
                        <button
                          onClick={() => {
                            const updated = [...(data.sections || [])];
                            updated[secIdx].lists.splice(listIdx, 1);
                            setData({ ...data, sections: updated });
                          }}
                          style={{ padding: '2px 6px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '10px' }}
                        >
                          Remove
                        </button>
                      </div>
                      {list.map((item: string, itemIdx: number) => (
                        <div key={itemIdx} style={{ marginBottom: 4 }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input 
                              type="text" 
                              value={item} 
                              onChange={e => {
                                const updated = [...(data.sections || [])];
                                updated[secIdx].lists[listIdx][itemIdx] = e.target.value;
                                setData({ ...data, sections: updated });
                              }} 
                              style={{ flex: 1, padding: 6, backgroundColor: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: 4, fontSize: '13px' }} 
                              placeholder={`List item ${itemIdx + 1}`}
                            />
                            <button
                              onClick={() => {
                                const updated = [...(data.sections || [])];
                                updated[secIdx].lists[listIdx].splice(itemIdx, 1);
                                setData({ ...data, sections: updated });
                              }}
                              style={{ padding: '4px 8px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const updated = [...(data.sections || [])];
                          updated[secIdx].lists[listIdx].push('');
                          setData({ ...data, sections: updated });
                        }}
                        style={{ marginTop: 8, padding: '4px 8px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                      >
                        + Add Item
                      </button>
                    </div>
                  ))}
                </div>
                {section === 'terms' && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Disclaimer (Optional)</label>
                    <input 
                      type="text" 
                      value={sec.disclaimer?.title || ''} 
                      onChange={e => {
                        const updated = [...(data.sections || [])];
                        updated[secIdx] = { 
                          ...updated[secIdx], 
                          disclaimer: { ...(updated[secIdx].disclaimer || {}), title: e.target.value }
                        };
                        setData({ ...data, sections: updated });
                      }} 
                      style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4, marginBottom: 8 }} 
                      placeholder="Disclaimer title"
                    />
                    <textarea 
                      value={sec.disclaimer?.text || ''} 
                      onChange={e => {
                        const updated = [...(data.sections || [])];
                        updated[secIdx] = { 
                          ...updated[secIdx], 
                          disclaimer: { ...(updated[secIdx].disclaimer || {}), text: e.target.value }
                        };
                        setData({ ...data, sections: updated });
                      }} 
                      rows={3}
                      style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                      placeholder="Disclaimer text"
                    />
                    {(sec.disclaimer?.title || sec.disclaimer?.text) && (
                      <button
                        onClick={() => {
                          const updated = [...(data.sections || [])];
                          updated[secIdx] = { ...updated[secIdx], disclaimer: undefined };
                          setData({ ...data, sections: updated });
                        }}
                        style={{ marginTop: 8, padding: '4px 8px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                      >
                        Remove Disclaimer
                      </button>
                    )}
                  </div>
                )}
                <div style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: 4, color: '#ccc' }}>Contact Info (Optional)</label>
                  <input 
                    type="email" 
                    value={sec.contactInfo?.email || ''} 
                    onChange={e => {
                      const updated = [...(data.sections || [])];
                      updated[secIdx] = { 
                        ...updated[secIdx], 
                        contactInfo: { ...(updated[secIdx].contactInfo || {}), email: e.target.value }
                      };
                      setData({ ...data, sections: updated });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4, marginBottom: 8 }} 
                    placeholder="Email address"
                  />
                  <input 
                    type="text" 
                    value={sec.contactInfo?.address || ''} 
                    onChange={e => {
                      const updated = [...(data.sections || [])];
                      updated[secIdx] = { 
                        ...updated[secIdx], 
                        contactInfo: { ...(updated[secIdx].contactInfo || {}), address: e.target.value }
                      };
                      setData({ ...data, sections: updated });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Physical address"
                  />
                  {(sec.contactInfo?.email || sec.contactInfo?.address) && (
                    <button
                      onClick={() => {
                        const updated = [...(data.sections || [])];
                        updated[secIdx] = { ...updated[secIdx], contactInfo: undefined };
                        setData({ ...data, sections: updated });
                      }}
                      style={{ marginTop: 8, padding: '4px 8px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '11px' }}
                    >
                      Remove Contact Info
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Footer Button Text</label>
            <input 
              type="text" 
              value={data.footerButtonText || ''} 
              onChange={e => setData({ ...data, footerButtonText: e.target.value })} 
              style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
              placeholder="Contact Us"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, color: '#fff' }}>Footer Button Email</label>
            <input 
              type="email" 
              value={data.footerButtonEmail || ''} 
              onChange={e => setData({ ...data, footerButtonEmail: e.target.value })} 
              style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
              placeholder="hello@hardweyllc.com"
            />
          </div>
        </>
      )}
      {!jsonMode && section === 'partners' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Page Title</label>
            <input 
              type="text" 
              value={data.pageTitle || ''} 
              onChange={e => setData({ ...data, pageTitle: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Our Partners"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Page Subtitle</label>
            <input 
              type="text" 
              value={data.pageSubtitle || ''} 
              onChange={e => setData({ ...data, pageSubtitle: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Building the future of music investment together"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                Partners {data.partners && Array.isArray(data.partners) && data.partners.length > 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>({data.partners.length} partner{data.partners.length !== 1 ? 's' : ''})</span>}
              </label>
              <button 
                onClick={() => {
                  const newPartner = {
                    id: `partner-${Date.now()}`,
                    name: '',
                    title: '',
                    description: '',
                    imageUrl: '',
                    imageSrcSet: '',
                    websiteUrl: '',
                    socialLinks: []
                  };
                  setData({ ...data, partners: [...(data.partners || []), newPartner] });
                }}
                style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Partner
              </button>
            </div>
            {(data.partners || []).length === 0 && (
              <div style={{ padding: 8, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#666', fontSize: '13px', marginBottom: 8 }}>
                No partners yet. Click "Add Partner" to add one.
              </div>
            )}
            {(data.partners || []).map((partner: any, idx: number) => (
              <div key={partner.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Partner {idx + 1}</h4>
                  <button 
                    onClick={() => {
                      const next = (data.partners || []).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, partners: next });
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Name *</label>
                  <input 
                    type="text" 
                    value={partner.name || ''} 
                    onChange={e => {
                      const next = [...(data.partners || [])];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setData({ ...data, partners: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Partner Name"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
                  <input 
                    type="text" 
                    value={partner.title || ''} 
                    onChange={e => {
                      const next = [...(data.partners || [])];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, partners: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Partner Title"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea 
                    value={partner.description || ''} 
                    onChange={e => {
                      const next = [...(data.partners || [])];
                      next[idx] = { ...next[idx], description: e.target.value };
                      setData({ ...data, partners: next });
                    }} 
                    rows={3}
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Partner description..."
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Image URL *</label>
                  <input 
                    type="text" 
                    value={partner.imageUrl || ''} 
                    onChange={e => {
                      const next = [...(data.partners || [])];
                      next[idx] = { ...next[idx], imageUrl: e.target.value };
                      setData({ ...data, partners: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="/uploads/partner.jpg"
                  />
                  <div style={{ marginTop: 4 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        uploadImage(file).then(({ url }) => {
                          const next = [...(data.partners || [])];
                          next[idx] = { ...next[idx], imageUrl: url };
                          setData({ ...data, partners: next });
                        }).catch(err => setErr(err.message));
                      }} 
                    />
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
                  </div>
                  {partner.imageUrl && (
                    <div style={{ marginTop: 8 }}>
                      <img src={partner.imageUrl} alt="Partner Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Image SrcSet (optional)</label>
                  <input 
                    type="text" 
                    value={partner.imageSrcSet || ''} 
                    onChange={e => {
                      const next = [...(data.partners || [])];
                      next[idx] = { ...next[idx], imageSrcSet: e.target.value };
                      setData({ ...data, partners: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="/uploads/partner-500.jpg 500w, /uploads/partner-1080.jpg 1080w"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Website URL</label>
                  <input 
                    type="url" 
                    value={partner.websiteUrl || ''} 
                    onChange={e => {
                      const next = [...(data.partners || [])];
                      next[idx] = { ...next[idx], websiteUrl: e.target.value };
                      setData({ ...data, partners: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="https://partner-website.com"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                      Social Links {(partner.socialLinks || []).length > 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>({(partner.socialLinks || []).length})</span>}
                    </label>
                    <button
                      onClick={() => {
                        const next = [...(data.partners || [])];
                        const socialLinks = [...(next[idx].socialLinks || []), { platform: '', url: '' }];
                        next[idx] = { ...next[idx], socialLinks };
                        setData({ ...data, partners: next });
                      }}
                      style={{ padding: '6px 12px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                    >
                      Add Social Link
                    </button>
                  </div>
                  {(partner.socialLinks || []).map((social: any, socialIdx: number) => (
                    <div key={socialIdx} style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Platform (e.g., Twitter, LinkedIn)"
                        value={social.platform || ''}
                        onChange={e => {
                          const next = [...(data.partners || [])];
                          const socialLinks = [...(next[idx].socialLinks || [])];
                          socialLinks[socialIdx] = { ...socialLinks[socialIdx], platform: e.target.value };
                          next[idx] = { ...next[idx], socialLinks };
                          setData({ ...data, partners: next });
                        }}
                        style={{ flex: 1, padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }}
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={social.url || ''}
                        onChange={e => {
                          const next = [...(data.partners || [])];
                          const socialLinks = [...(next[idx].socialLinks || [])];
                          socialLinks[socialIdx] = { ...socialLinks[socialIdx], url: e.target.value };
                          next[idx] = { ...next[idx], socialLinks };
                          setData({ ...data, partners: next });
                        }}
                        style={{ flex: 2, padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }}
                      />
                      <button
                        onClick={() => {
                          const next = [...(data.partners || [])];
                          const socialLinks = (next[idx].socialLinks || []).filter((_: any, i: number) => i !== socialIdx);
                          next[idx] = { ...next[idx], socialLinks };
                          setData({ ...data, partners: next });
                        }}
                        style={{ padding: '8px 12px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!jsonMode && section === 'collaboratives' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Section Heading</label>
            <input 
              type="text" 
              value={data.heading || ''} 
              onChange={e => setData({ ...data, heading: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="Collaboratives"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                Collaboratives {data.collaboratives && Array.isArray(data.collaboratives) && data.collaboratives.length > 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>({data.collaboratives.length} collaborative{data.collaboratives.length !== 1 ? 's' : ''})</span>}
              </label>
              <button 
                onClick={() => {
                  const newCollaborative = {
                    id: `collaborative-${Date.now()}`,
                    name: '',
                    title: '',
                    description: '',
                    imageUrl: '',
                    imageSrcSet: '',
                    websiteUrl: '',
                    socialLinks: []
                  };
                  setData({ ...data, collaboratives: [...(data.collaboratives || []), newCollaborative] });
                }}
                style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Collaborative
              </button>
            </div>
            {(data.collaboratives || []).length === 0 && (
              <div style={{ padding: 8, backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#666', fontSize: '13px', marginBottom: 8 }}>
                No collaboratives yet. Click "Add Collaborative" to add one.
              </div>
            )}
            {(data.collaboratives || []).map((collaborative: any, idx: number) => (
              <div key={collaborative.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#2a2a2a', borderRadius: 6, border: '1px solid #444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Collaborative {idx + 1}</h4>
                  <button 
                    onClick={() => {
                      const next = (data.collaboratives || []).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, collaboratives: next });
                    }}
                    style={{ padding: '4px 12px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Name *</label>
                  <input 
                    type="text" 
                    value={collaborative.name || ''} 
                    onChange={e => {
                      const next = [...(data.collaboratives || [])];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setData({ ...data, collaboratives: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Collaborative Name"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
                  <input 
                    type="text" 
                    value={collaborative.title || ''} 
                    onChange={e => {
                      const next = [...(data.collaboratives || [])];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, collaboratives: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Collaborative Title"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea 
                    value={collaborative.description || ''} 
                    onChange={e => {
                      const next = [...(data.collaboratives || [])];
                      next[idx] = { ...next[idx], description: e.target.value };
                      setData({ ...data, collaboratives: next });
                    }} 
                    rows={3}
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="Collaborative description..."
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Image URL *</label>
                  <input 
                    type="text" 
                    value={collaborative.imageUrl || ''} 
                    onChange={e => {
                      const next = [...(data.collaboratives || [])];
                      next[idx] = { ...next[idx], imageUrl: e.target.value };
                      setData({ ...data, collaboratives: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="/uploads/collaborative.jpg"
                  />
                  <div style={{ marginTop: 4 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        uploadImage(file).then(({ url }) => {
                          const next = [...(data.collaboratives || [])];
                          next[idx] = { ...next[idx], imageUrl: url };
                          setData({ ...data, collaboratives: next });
                        }).catch(err => setErr(err.message));
                      }} 
                    />
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Or upload an image</span>
                  </div>
                  {collaborative.imageUrl && (
                    <div style={{ marginTop: 8 }}>
                      <img src={collaborative.imageUrl} alt="Collaborative Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Image SrcSet (optional)</label>
                  <input 
                    type="text" 
                    value={collaborative.imageSrcSet || ''} 
                    onChange={e => {
                      const next = [...(data.collaboratives || [])];
                      next[idx] = { ...next[idx], imageSrcSet: e.target.value };
                      setData({ ...data, collaboratives: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="/uploads/collaborative-500.jpg 500w, /uploads/collaborative-1080.jpg 1080w"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4 }}>Website URL</label>
                  <input 
                    type="url" 
                    value={collaborative.websiteUrl || ''} 
                    onChange={e => {
                      const next = [...(data.collaboratives || [])];
                      next[idx] = { ...next[idx], websiteUrl: e.target.value };
                      setData({ ...data, collaboratives: next });
                    }} 
                    style={{ width: '100%', padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }} 
                    placeholder="https://collaborative-website.com"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                      Social Links {(collaborative.socialLinks || []).length > 0 && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>({(collaborative.socialLinks || []).length})</span>}
                    </label>
                    <button
                      onClick={() => {
                        const next = [...(data.collaboratives || [])];
                        const socialLinks = [...(next[idx].socialLinks || []), { platform: '', url: '' }];
                        next[idx] = { ...next[idx], socialLinks };
                        setData({ ...data, collaboratives: next });
                      }}
                      style={{ padding: '6px 12px', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                    >
                      Add Social Link
                    </button>
                  </div>
                  {(collaborative.socialLinks || []).map((social: any, socialIdx: number) => (
                    <div key={socialIdx} style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Platform (e.g., Twitter, LinkedIn)"
                        value={social.platform || ''}
                        onChange={e => {
                          const next = [...(data.collaboratives || [])];
                          const socialLinks = [...(next[idx].socialLinks || [])];
                          socialLinks[socialIdx] = { ...socialLinks[socialIdx], platform: e.target.value };
                          next[idx] = { ...next[idx], socialLinks };
                          setData({ ...data, collaboratives: next });
                        }}
                        style={{ flex: 1, padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }}
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={social.url || ''}
                        onChange={e => {
                          const next = [...(data.collaboratives || [])];
                          const socialLinks = [...(next[idx].socialLinks || [])];
                          socialLinks[socialIdx] = { ...socialLinks[socialIdx], url: e.target.value };
                          next[idx] = { ...next[idx], socialLinks };
                          setData({ ...data, collaboratives: next });
                        }}
                        style={{ flex: 2, padding: 8, backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #555', borderRadius: 4 }}
                      />
                      <button
                        onClick={() => {
                          const next = [...(data.collaboratives || [])];
                          const socialLinks = (next[idx].socialLinks || []).filter((_: any, i: number) => i !== socialIdx);
                          next[idx] = { ...next[idx], socialLinks };
                          setData({ ...data, collaboratives: next });
                        }}
                        style={{ padding: '8px 12px', backgroundColor: '#d12d37', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!jsonMode && section !== 'fredAgain' && section !== 'hero' && section !== 'errorPage' && section !== 'faqIntro' && section !== 'shares' && section !== 'ticker' && section !== 'nftDisclaimer' && section !== 'faq' && section !== 'founders' && section !== 'investment' && section !== 'investmentIntro' && section !== 'moreFaq' && section !== 'privacyPolicy' && section !== 'terms' && section !== 'partners' && section !== 'collaboratives' && (
        <div style={{ marginBottom: 12 }}>
        <label>Text</label>
          <textarea value={data.text || ''} onChange={e => setData({ ...data, text: e.target.value })} rows={6} style={{ width: '100%' }} />
        </div>
      )}
      {!jsonMode && section !== 'fredAgain' && section !== 'hero' && (
        <div style={{ marginBottom: 12 }}>
        <label>Images</label>
        <div style={{ margin: '8px 0' }}>
          <input type="file" accept="image/*" onChange={onUpload} ref={fileRef} />
        </div>
        <ul>
          {(data.images || []).map((src: string, idx: number) => (
            <li key={idx}>
              <img src={src} alt="" style={{ maxHeight: 40, verticalAlign: 'middle' }} /> {src}
              <button onClick={() => setData({ ...data, images: data.images.filter((_: any, i: number) => i !== idx) })} style={{ marginLeft: 8 }}>Remove</button>
            </li>
          ))}
        </ul>
        </div>
      )}
      {!jsonMode && <div style={{ marginBottom: 12 }}>
        <label>Links</label>
        <button onClick={addLink} style={{ marginLeft: 8 }}>Add Link</button>
        <ul>
          {(data.links || []).map((l: any, idx: number) => (
            <li key={idx}>
              <input placeholder="Label" value={l.label} onChange={e => {
                const next = [...data.links]; next[idx] = { ...next[idx], label: e.target.value }; setData({ ...data, links: next });
              }} />
              <input placeholder="https://... or /uploads/..." value={l.url} onChange={e => {
                const next = [...data.links]; next[idx] = { ...next[idx], url: e.target.value }; setData({ ...data, links: next });
              }} style={{ marginLeft: 8, width: 320 }} />
              <button onClick={() => removeLink(idx)} style={{ marginLeft: 8 }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>}
      {jsonMode && (
        <div style={{ marginBottom: 12 }}>
          <label>JSON</label>
          <textarea value={rawJson} onChange={e => setRawJson(e.target.value)} rows={18} style={{ width: '100%', fontFamily: 'monospace' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={reloadFromServer}>Reload current</button>
        <span>Preview:</span>
      </div>
      {!jsonMode && (
        <div style={{ marginTop: 12 }}>
          <Preview data={data} />
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <div style={{ border: '1px solid #333', borderRadius: 6, padding: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Current (server)</div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{serverData ? JSON.stringify(serverData, null, 2) : '—'}</pre>
        </div>
      </div>
      </div>
    </>
  );
}


