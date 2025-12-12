import type { LinkItem } from '@/types/content';

interface PreviewData {
  text?: string;
  images?: string[];
  links?: LinkItem[];
}

export default function Preview({ data }: { data: PreviewData | null | undefined }) {
  if (!data) return null;
  return (
    <div style={{ border: '1px dashed #aaa', padding: 12, borderRadius: 6 }}>
      <h4>Preview</h4>
      {data.text && <p>{data.text}</p>}
      {Array.isArray(data.images) && data.images.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.images.map((src: string, i: number) => (<img key={i} src={src || undefined} alt="" style={{ maxHeight: 80 }} />))}
        </div>
      )}
      {Array.isArray(data.links) && data.links.length > 0 && (
        <ul>
          {data.links.map((l: LinkItem, i: number) => (<li key={i}><a href={l.url} target="_blank" rel="noreferrer">{l.label}</a></li>))}
        </ul>
      )}
    </div>
  );
}


