import Preview from './Preview';
import { useSectionEditor } from './hooks/useSectionEditor';
import { uploadImage } from './api';
import { FredAgainEditor } from './editors/FredAgainEditor';
import { HeroEditor } from './editors/HeroEditor';
import { ErrorPageEditor } from './editors/ErrorPageEditor';
import { FaqIntroEditor } from './editors/FaqIntroEditor';
import { InvestmentIntroEditor } from './editors/InvestmentIntroEditor';
import { InvestmentEditor } from './editors/InvestmentEditor';
import { SharesEditor } from './editors/SharesEditor';
import { TickerEditor } from './editors/TickerEditor';
import { NftDisclaimerEditor } from './editors/NftDisclaimerEditor';
import { FaqEditor } from './editors/FaqEditor';
import { FoundersEditor } from './editors/FoundersEditor';
import { MoreFaqEditor } from './editors/MoreFaqEditor';
import { PartnersEditor } from './editors/PartnersEditor';
import { CollaborativesEditor } from './editors/CollaborativesEditor';
import { PrivacyPolicyTermsEditor } from './editors/PrivacyPolicyTermsEditor';
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
        <FaqIntroEditor
          data={data}
          setData={setData}
          setErr={setErr}
          uploadImage={uploadImage}
        />
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
        <PrivacyPolicyTermsEditor
          data={data}
          setData={setData}
          section={section}
        />
      )}
      {!jsonMode && section === 'partners' && (
        <PartnersEditor
          data={data}
          setData={setData}
          setErr={setErr}
          uploadImage={uploadImage}
        />
      )}
      {!jsonMode && section === 'collaboratives' && (
        <CollaborativesEditor
          data={data}
          setData={setData}
          setErr={setErr}
          uploadImage={uploadImage}
        />
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


