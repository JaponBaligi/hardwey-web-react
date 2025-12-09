import Preview from './Preview';
import { useSectionEditor } from './hooks/useSectionEditor';
import { uploadImage } from './api';
import { FredAgainEditor } from './editors/FredAgainEditor';
import { HeroEditor } from './editors/HeroEditor';
import { ErrorPageEditor } from './editors/ErrorPageEditor';
import { InvestmentIntroEditor } from './editors/InvestmentIntroEditor';
import { InvestmentEditor } from './editors/InvestmentEditor';
import { SharesEditor } from './editors/SharesEditor';
import { TickerEditor } from './editors/TickerEditor';
import { NftDisclaimerEditor } from './editors/NftDisclaimerEditor';
import { FaqEditor } from './editors/FaqEditor';
import { FoundersEditor } from './editors/FoundersEditor';
import { MoreFaqEditor } from './editors/MoreFaqEditor';
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
        <TickerEditor
          data={data}
          setData={setData}
          setErr={setErr}
        />
      )}
      {!jsonMode && section === 'nftDisclaimer' && (
        <NftDisclaimerEditor
          data={data}
          setData={setData}
          setErr={setErr}
          onUploadBackground={onUploadBackground}
          backgroundFileRef={backgroundFileRef}
          onUploadGif={onUploadGif}
          gifFileRef={gifFileRef}
          onUploadLogo={onUploadLogo}
          starFileRef={starFileRef}
        />
      )}
      {!jsonMode && section === 'faq' && (
        <FaqEditor
          data={data}
          setData={setData}
          setErr={setErr}
        />
      )}
      {!jsonMode && section === 'founders' && (
        <FoundersEditor
          data={data}
          setData={setData}
          setErr={setErr}
          uploadImage={uploadImage}
        />
      )}
      {!jsonMode && section === 'moreFaq' && (
        <MoreFaqEditor
          data={data}
          setData={setData}
          setErr={setErr}
          uploadImage={uploadImage}
        />
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


