import type { SectionEditorProps } from './types';
import { FormField, TextInput } from '../components/FormField';

export function InvestmentIntroEditor({ data, setData }: SectionEditorProps) {
  return (
    <>
      <FormField label="Heading">
        <TextInput
          value={(data.heading as string) || ''}
          onChange={value => setData({ ...data, heading: value })}
          placeholder="If you've never invested..."
        />
      </FormField>

      <FormField label="Subtitle">
        <TextInput
          value={(data.subtitle as string) || ''}
          onChange={value => setData({ ...data, subtitle: value })}
          placeholder="This one's for you"
        />
      </FormField>
    </>
  );
}

