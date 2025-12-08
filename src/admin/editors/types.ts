export interface SectionEditorProps {
  data: any;
  setData: (data: any) => void;
  setErr: (err: string) => void;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadBackground?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadLogo?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadGif?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef?: React.RefObject<HTMLInputElement | null>;
  backgroundFileRef?: React.RefObject<HTMLInputElement | null>;
  logoFileRef?: React.RefObject<HTMLInputElement | null>;
  gifFileRef?: React.RefObject<HTMLInputElement | null>;
  starFileRef?: React.RefObject<HTMLInputElement | null>;
  uploadImage?: (file: File) => Promise<{ url: string }>;
}

