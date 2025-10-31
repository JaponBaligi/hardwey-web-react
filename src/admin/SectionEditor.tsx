import { useEffect, useState, useRef } from 'react';
import { fetchSection, updateSection, uploadImage } from './api';
import Preview from './Preview';

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
          const norm = normalize(data);
          setData(norm);
          setServerData(norm);
          setRawJson(JSON.stringify(norm, null, 2));
        }
      })
      .catch(e => { if (!ignore) setErr(e.message); })
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
      return {
        starCount: typeof d?.starCount === 'number' ? d.starCount : 7,
        recordImage: typeof d?.recordImage === 'string' ? d.recordImage : '',
        recordCount: typeof d?.recordCount === 'number' ? d.recordCount : 1,
        spotifyUrl: typeof d?.spotifyUrl === 'string' ? d.spotifyUrl : 'https://open.spotify.com/',
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
      const norm = normalize(fresh);
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
    <div style={{ flex: 1, paddingLeft: 24, marginLeft: 0 }}>
      <h3>Edit: {section}</h3>
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
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>404 Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
              <input 
                type="text" 
                value={data.error404?.title || ''} 
                onChange={e => setData({ ...data, error404: { ...data.error404, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="404 NOT FOUND"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
              <textarea 
                value={data.error404?.description || ''} 
                onChange={e => setData({ ...data, error404: { ...data.error404, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="You dive too deep so you discovered an unexplored place..."
              />
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>500 Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
              <input 
                type="text" 
                value={data.error500?.title || ''} 
                onChange={e => setData({ ...data, error500: { ...data.error500, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="500 SERVER ERROR"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
              <textarea 
                value={data.error500?.description || ''} 
                onChange={e => setData({ ...data, error500: { ...data.error500, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="Oops! Something went wrong on our end..."
              />
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>403 Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
              <input 
                type="text" 
                value={data.error403?.title || ''} 
                onChange={e => setData({ ...data, error403: { ...data.error403, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="403 FORBIDDEN"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
              <textarea 
                value={data.error403?.description || ''} 
                onChange={e => setData({ ...data, error403: { ...data.error403, description: e.target.value } })} 
                rows={3} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="Access denied. You don't have permission to view this page."
              />
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>Default Error Page</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
              <input 
                type="text" 
                value={data.defaultError?.title || ''} 
                onChange={e => setData({ ...data, defaultError: { ...data.defaultError, title: e.target.value } })} 
                style={{ width: '100%', padding: 8 }} 
                placeholder="ERROR"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
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
              style={{ width: '100%', padding: 8 }} 
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Number of asterisk stars to display</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Record Image URL</label>
            <input 
              type="text" 
              value={data.recordImage || ''} 
              onChange={e => setData({ ...data, recordImage: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="/assets/img/Playlist R&B Retro Nostalgia.png"
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
            {data.recordImage && (
              <div style={{ marginTop: 8 }}>
                <img src={data.recordImage} alt="Record Preview" style={{ maxWidth: '100%', maxHeight: 200, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Record Count</label>
            <input 
              type="number" 
              value={data.recordCount ?? 1} 
              onChange={e => setData({ ...data, recordCount: parseInt(e.target.value, 10) || 0 })} 
              min="1"
              max="10"
              style={{ width: '100%', padding: 8 }} 
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Number of records to display</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Spotify URL</label>
            <input 
              type="text" 
              value={data.spotifyUrl || ''} 
              onChange={e => setData({ ...data, spotifyUrl: e.target.value })} 
              style={{ width: '100%', padding: 8 }} 
              placeholder="https://open.spotify.com/"
            />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Spotify URL for all playlist records</span>
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
              <div key={faq.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 6, border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0 }}>FAQ Item {idx + 1}</h4>
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
              <div key={founder.id || idx} style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 6, border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0 }}>Founder {idx + 1}</h4>
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
      {!jsonMode && section !== 'fredAgain' && section !== 'hero' && section !== 'errorPage' && section !== 'faqIntro' && section !== 'shares' && section !== 'ticker' && section !== 'nftDisclaimer' && section !== 'faq' && section !== 'founders' && section !== 'investment' && (
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
  );
}


