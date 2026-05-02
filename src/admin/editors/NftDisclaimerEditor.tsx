import type { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './NftDisclaimerEditor.module.css';

export function NftDisclaimerEditor({ 
  data, 
  setData, 
  onUploadBackground, 
  backgroundFileRef,
  onUploadGif,
  gifFileRef,
  onUploadLogo,
  starFileRef
}: SectionEditorProps) {
  return (
    <>
      <FormField label="Nope Text">
        <TextInput
          value={(data.nopeText as string) || ''}
          onChange={value => setData({ ...data, nopeText: value })}
          placeholder="Nope"
        />
      </FormField>

      <FormField label="We're Text">
        <TextInput
          value={(data.wereText as string) || ''}
          onChange={value => setData({ ...data, wereText: value })}
          placeholder="We're"
        />
      </FormField>

      <FormField label="NFTs Text">
        <TextInput
          value={(data.nftsText as string) || ''}
          onChange={value => setData({ ...data, nftsText: value })}
          placeholder="NFTs"
        />
      </FormField>

      <FormField label="Value Music Text">
        <TextInput
          value={(data.valueMusicText as string) || ''}
          onChange={value => setData({ ...data, valueMusicText: value })}
          placeholder="We value mu$ic more than pixels"
        />
      </FormField>

      <FormField label="Resonate Text (Desktop)">
        <TextAreaInput
          value={(data.resonateText as string) || ''}
          onChange={value => setData({ ...data, resonateText: value })}
          rows={3}
          placeholder="We're building something that resonates with everyone. Not just &quot;PR&quot;."
        />
      </FormField>

      <FormField label="Resonate Text (Mobile)">
        <TextAreaInput
          value={(data.resonateTextMobile as string) || ''}
          onChange={value => setData({ ...data, resonateTextMobile: value })}
          rows={3}
          placeholder="we're building something that resonates with everyone. Not just crypto bros."
        />
      </FormField>

      <FormField label="Mona Lisa Image URL">
        <TextInput
          value={(data.monaImageUrl as string) || ''}
          onChange={value => setData({ ...data, monaImageUrl: value })}
          placeholder="/assets/img/mona-image2.jpg"
        />
        <ImageUpload
          onUpload={onUploadBackground!}
          fileRef={backgroundFileRef}
          hint="Or upload an image"
          previewUrl={data.monaImageUrl as string | undefined}
        />
      </FormField>

      <FormField label="Mona Image SrcSet (optional)">
        <TextAreaInput
          value={(data.monaImageSrcSet as string) || ''}
          onChange={value => setData({ ...data, monaImageSrcSet: value })}
          rows={2}
          placeholder="/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, ..."
          className={styles.srcSetInput}
        />
      </FormField>

      <FormField label="GIF Image URL">
        <TextInput
          value={(data.gifImageUrl as string) || ''}
          onChange={value => setData({ ...data, gifImageUrl: value })}
          placeholder="/assets/img/fav.gif"
        />
        <ImageUpload
          onUpload={onUploadGif!}
          fileRef={gifFileRef}
          hint="Or upload an image"
          previewUrl={data.gifImageUrl as string | undefined}
        />
      </FormField>

      <FormField label="Star Icon URL">
        <TextInput
          value={(data.starIconUrl as string) || ''}
          onChange={value => setData({ ...data, starIconUrl: value })}
          placeholder="/assets/svg/hardwey-star.svg"
        />
        <ImageUpload
          onUpload={onUploadLogo!}
          fileRef={starFileRef}
          hint="Or upload an image"
          previewUrl={data.starIconUrl as string | undefined}
        />
      </FormField>

      <FormField label="NOT Graphic URL">
        <TextInput
          value={(data.notGraphicUrl as string) || ''}
          onChange={value => setData({ ...data, notGraphicUrl: value })}
          placeholder="https://assets-global.website-files.com/..."
        />
        {(data.notGraphicUrl as string) && (
          <div className={styles.preview}>
            <img src={(data.notGraphicUrl as string) || undefined} alt="NOT Graphic Preview" />
          </div>
        )}
      </FormField>

      <FormField label="Background Color">
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={(data.backgroundColor as string) || '#d12d37'}
            onChange={e => setData({ ...data, backgroundColor: e.target.value })}
            className={styles.colorInput}
          />
          <TextInput
            value={(data.backgroundColor as string) || '#d12d37'}
            onChange={value => setData({ ...data, backgroundColor: value })}
            placeholder="#d12d37"
            className={styles.colorTextInput}
          />
        </div>
      </FormField>
    </>
  );
}

