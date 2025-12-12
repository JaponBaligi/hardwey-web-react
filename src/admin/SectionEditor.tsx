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
import type { LinkItem } from '@/types/content';
import styles from './SectionEditor.module.css';

interface SectionEditorProps {
  section: string;
}

interface SectionEditorRenderProps {
  section: string;
  data: Record<string, unknown>;
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  setErr: (err: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadBackground: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadLogo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadGif: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  backgroundFileRef: React.RefObject<HTMLInputElement | null>;
  logoFileRef: React.RefObject<HTMLInputElement | null>;
  gifFileRef: React.RefObject<HTMLInputElement | null>;
  starFileRef: React.RefObject<HTMLInputElement | null>;
}

// Helper function for editors with upload functionality
function renderEditorWithUpload(
  Editor: React.ComponentType<{ data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void; uploadImage: (file: File) => Promise<{ url: string }> }>,
  commonProps: { data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void },
  uploadImageFn: (file: File) => Promise<{ url: string }>
) {
  return <Editor {...commonProps} uploadImage={uploadImageFn} />;
}

// Helper function for editors with background upload
function renderEditorWithBackground(
  Editor: React.ComponentType<{ data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void; onUploadBackground: (e: React.ChangeEvent<HTMLInputElement>) => void; backgroundFileRef: React.RefObject<HTMLInputElement | null> }>,
  commonProps: { data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void },
  onUploadBackground: (e: React.ChangeEvent<HTMLInputElement>) => void,
  backgroundFileRef: React.RefObject<HTMLInputElement | null>
) {
  return (
    <Editor
      {...commonProps}
      onUploadBackground={onUploadBackground}
      backgroundFileRef={backgroundFileRef}
    />
  );
}

// Helper function to render simple editors
function renderSimpleEditor(
  section: string,
  commonProps: { data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void }
) {
  const simpleEditors: Record<string, React.ComponentType<typeof commonProps>> = {
    errorPage: ErrorPageEditor,
    investmentIntro: InvestmentIntroEditor,
    ticker: TickerEditor,
    faq: FaqEditor,
  };

  const Editor = simpleEditors[section];
  return Editor ? <Editor {...commonProps} /> : null;
}

// Helper function to render editors with upload
function renderUploadEditor(
  section: string,
  commonProps: { data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void }
) {
  const uploadEditors: Record<string, React.ComponentType<typeof commonProps & { uploadImage: (file: File) => Promise<{ url: string }> }>> = {
    faqIntro: FaqIntroEditor,
    founders: FoundersEditor,
    moreFaq: MoreFaqEditor,
    partners: PartnersEditor,
    collaboratives: CollaborativesEditor,
  };

  const Editor = uploadEditors[section];
  if (!Editor) return null;

  if (section === 'faqIntro') {
    return renderEditorWithUpload(Editor, commonProps, uploadImage as (file: File) => Promise<{ url: string }>);
  }
  return renderEditorWithUpload(Editor, commonProps, uploadImage);
}

// Helper function to render special case editors
function renderSpecialEditor(
  section: string,
  commonProps: { data: Record<string, unknown>; setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>; setErr: (err: string) => void },
  props: Omit<SectionEditorRenderProps, 'section' | 'data' | 'setData' | 'setErr'>
) {
  if (section === 'fredAgain') {
    return (
      <FredAgainEditor
        {...commonProps}
        onUpload={props.onUpload}
        onUploadBackground={props.onUploadBackground}
        fileRef={props.fileRef}
        backgroundFileRef={props.backgroundFileRef}
        uploadImage={uploadImage}
      />
    );
  }

  if (section === 'hero') {
    return (
      <HeroEditor
        {...commonProps}
        onUpload={props.onUpload}
        onUploadBackground={props.onUploadBackground}
        onUploadLogo={props.onUploadLogo}
        fileRef={props.fileRef}
        backgroundFileRef={props.backgroundFileRef}
        logoFileRef={props.logoFileRef}
        uploadImage={uploadImage}
      />
    );
  }

  if (section === 'investment') {
    return (
      <InvestmentEditor
        {...commonProps}
        onUploadBackground={props.onUploadBackground}
        backgroundFileRef={props.backgroundFileRef}
        onUploadLogo={props.onUploadLogo}
        logoFileRef={props.logoFileRef}
      />
    );
  }

  if (section === 'nftDisclaimer') {
    return (
      <NftDisclaimerEditor
        {...commonProps}
        onUploadBackground={props.onUploadBackground}
        backgroundFileRef={props.backgroundFileRef}
        onUploadGif={props.onUploadGif}
        gifFileRef={props.gifFileRef}
        onUploadLogo={props.onUploadLogo}
        starFileRef={props.starFileRef}
      />
    );
  }

  if (section === 'privacyPolicy' || section === 'terms') {
    return <PrivacyPolicyTermsEditor {...commonProps} section={section} />;
  }

  return null;
}

function renderSectionEditor({
  section,
  data,
  setData,
  setErr,
  onUpload,
  onUploadBackground,
  onUploadLogo,
  onUploadGif,
  fileRef,
  backgroundFileRef,
  logoFileRef,
  gifFileRef,
  starFileRef,
}: SectionEditorRenderProps) {
  const commonProps = { data, setData, setErr };
  const specialProps = { onUpload, onUploadBackground, onUploadLogo, onUploadGif, fileRef, backgroundFileRef, logoFileRef, gifFileRef, starFileRef };

  const simpleEditor = renderSimpleEditor(section, commonProps);
  if (simpleEditor) return simpleEditor;

  const uploadEditor = renderUploadEditor(section, commonProps);
  if (uploadEditor) return uploadEditor;

  if (section === 'shares') {
    return renderEditorWithBackground(SharesEditor, commonProps, onUploadBackground, backgroundFileRef);
  }

  return renderSpecialEditor(section, commonProps, specialProps);
}

const SECTIONS_WITH_CUSTOM_EDITOR = new Set([
  'fredAgain',
  'hero',
  'errorPage',
  'faqIntro',
  'shares',
  'ticker',
  'nftDisclaimer',
  'faq',
  'founders',
  'investment',
  'investmentIntro',
  'moreFaq',
  'privacyPolicy',
  'terms',
  'partners',
  'collaboratives',
]);

// Helper component for text input field
interface TextFieldProps {
  data: Record<string, unknown>;
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

function TextField({ data, setData }: TextFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>Text</label>
      <textarea
        value={(data as { text?: string })?.text || ''}
        onChange={e => setData({ ...data, text: e.target.value })}
        rows={6}
        style={{ width: '100%' }}
      />
    </div>
  );
}

// Helper component for images section
interface ImagesSectionProps {
  data: Record<string, unknown>;
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}

function ImagesSection({ data, setData, onUpload, fileRef }: ImagesSectionProps) {
  const images = (data as { images?: string[] })?.images || [];

  const removeImage = (idx: number) => {
    const currentData = data as { images?: string[] };
    setData({
      ...data,
      images: (currentData.images || []).filter((_: string, i: number) => i !== idx),
    });
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label>Images</label>
      <div style={{ margin: '8px 0' }}>
        <input type="file" accept="image/*" onChange={onUpload} ref={fileRef} />
      </div>
      <ul>
        {images.map((src: string, idx: number) => (
          <li key={idx}>
            <img src={src || undefined} alt="" style={{ maxHeight: 40, verticalAlign: 'middle' }} /> {src}
            <button onClick={() => removeImage(idx)} style={{ marginLeft: 8 }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper component for links section
interface LinksSectionProps {
  data: Record<string, unknown>;
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  addLink: () => void;
  removeLink: (idx: number) => void;
}

function LinksSection({ data, setData, addLink, removeLink }: LinksSectionProps) {
  const links = (data as { links?: LinkItem[] })?.links || [];

  const updateLinkLabel = (idx: number, label: string) => {
    const currentData = data as { links?: LinkItem[] };
    const next = [...(currentData.links || [])];
    next[idx] = { ...next[idx], label };
    setData({ ...data, links: next });
  };

  const updateLinkUrl = (idx: number, url: string) => {
    const currentData = data as { links?: LinkItem[] };
    const next = [...(currentData.links || [])];
    next[idx] = { ...next[idx], url };
    setData({ ...data, links: next });
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label>Links</label>
      <button onClick={addLink} style={{ marginLeft: 8 }}>Add Link</button>
      <ul>
        {links.map((l: LinkItem, idx: number) => (
          <li key={idx}>
            <input
              placeholder="Label"
              value={l.label}
              onChange={e => updateLinkLabel(idx, e.target.value)}
            />
            <input
              placeholder="https://... or /uploads/..."
              value={l.url}
              onChange={e => updateLinkUrl(idx, e.target.value)}
              style={{ marginLeft: 8, width: 320 }}
            />
            <button onClick={() => removeLink(idx)} style={{ marginLeft: 8 }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SectionEditor({ section }: SectionEditorProps) {
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

  const showDefaultText = !jsonMode && !SECTIONS_WITH_CUSTOM_EDITOR.has(section);
  const showImages = !jsonMode && section !== 'fredAgain' && section !== 'hero';
  const showLinks = !jsonMode;

  return (
    <div className={styles.sectionEditor}>
      <h3 className={styles.title}>Edit: {section}</h3>
      {err && <div className={styles.error}>{err}</div>}
      <div className={styles.jsonModeToggle}>
        <label>
          <input
            type="checkbox"
            checked={jsonMode}
            onChange={e => setJsonMode(e.target.checked)}
          />{' '}
          Advanced JSON
        </label>
      </div>
      {!jsonMode &&
        renderSectionEditor({
          section,
          data,
          setData,
          setErr,
          onUpload,
          onUploadBackground,
          onUploadLogo,
          onUploadGif,
          fileRef,
          backgroundFileRef,
          logoFileRef,
          gifFileRef,
          starFileRef,
        })}
      {showDefaultText && <TextField data={data} setData={setData} />}
      {showImages && (
        <ImagesSection data={data} setData={setData} onUpload={onUpload} fileRef={fileRef} />
      )}
      {showLinks && (
        <LinksSection data={data} setData={setData} addLink={addLink} removeLink={removeLink} />
      )}
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
        <button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
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
          <pre className={styles.serverDataContent}>
            {serverData ? JSON.stringify(serverData, null, 2) : '—'}
          </pre>
        </div>
      </div>
    </div>
  );
}


