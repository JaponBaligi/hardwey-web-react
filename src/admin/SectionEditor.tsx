import Preview from './Preview';
import { useSectionEditor } from './hooks/useSectionEditor';
import { uploadImage } from './api';
import { FredAgainEditor } from './editors/FredAgainEditor';
import { HeroEditor } from './editors/HeroEditor';
import { ErrorPageEditor } from './editors/ErrorPageEditor';
import { InvestmentIntroEditor } from './editors/InvestmentIntroEditor';
import { InvestmentEditor } from './editors/InvestmentEditor';
import { SharesEditor } from './editors/SharesEditor';
import styles from './SectionEditor.module.css';

export default function SectionEditor({ section }: { section: string }) {

  const {
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
    fileRef,
    backgroundFileRef,
    logoFileRef,
    gifFileRef,
    starFileRef,
  } = useSectionEditor(section);


  if (loading) return <div>Loading...</div>;
  return (
    <div className={styles.sectionEditor}>
      <h3 className={styles.title}>Edit: {section}</h3>
      {err && <div className={styles.error}>{err}</div>}
      <div className={styles.jsonModeToggle}>
        <label><input type="checkbox" checked={jsonMode} onChange={e => setJsonMode(e.target.checked)} /> Advanced JSON</label>
      </div>
      {!jsonMode && section === 'fredAgain' && (
        <FredAgainEditor
          data={data}
          setData={setData}
          setErr={setErr}
          onUpload={onUpload}
          onUploadBackground={onUploadBackground}
          fileRef={fileRef}
          backgroundFileRef={backgroundFileRef}
          uploadImage={uploadImage}
        />
      )}
      {!jsonMode && section === 'hero' && (
        <HeroEditor
          data={data}
          setData={setData}
          setErr={setErr}
          onUpload={onUpload}
          onUploadBackground={onUploadBackground}
          onUploadLogo={onUploadLogo}
          fileRef={fileRef}
          backgroundFileRef={backgroundFileRef}
          logoFileRef={logoFileRef}
          uploadImage={uploadImage}
        />
      )}
      {!jsonMode && section === 'errorPage' && (
        <ErrorPageEditor
          data={data}
          setData={setData}
          setErr={setErr}
        />
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
        <InvestmentIntroEditor
          data={data}
          setData={setData}
          setErr={setErr}
        />
      )}
      {!jsonMode && section === 'investment' && (
        <InvestmentEditor
          data={data}
          setData={setData}
          setErr={setErr}
          onUploadBackground={onUploadBackground}
          backgroundFileRef={backgroundFileRef}
          onUploadLogo={onUploadLogo}
          logoFileRef={logoFileRef}
        />
      )}
      {!jsonMode && section === 'shares' && (
        <SharesEditor
          data={data}
          setData={setData}
          setErr={setErr}
          onUploadBackground={onUploadBackground}
          backgroundFileRef={backgroundFileRef}
        />
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
        <div className={styles.jsonEditor}>
          <label>JSON</label>
          <textarea 
            value={rawJson} 
            onChange={e => setRawJson(e.target.value)} 
            rows={18} 
            className={styles.jsonTextarea}
          />
        </div>
      )}

      <div className={styles.actions}>
        <button onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={reloadFromServer}>Reload current</button>
        <span>Preview:</span>
      </div>
      {!jsonMode && (
        <div className={styles.previewSection}>
          <Preview data={data} />
        </div>
      )}
      <div className={styles.serverDataSection}>
        <div className={styles.serverDataContainer}>
          <div className={styles.serverDataTitle}>Current (server)</div>
          <pre className={styles.serverDataContent}>{serverData ? JSON.stringify(serverData, null, 2) : '—'}</pre>
        </div>
      </div>
      </div>
  );
}


