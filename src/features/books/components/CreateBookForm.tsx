import Button from '@/base/ui/Button';
import Input from '@/base/ui/Input';
import { useRef, useState, type FormEvent } from 'react';
import { useCreateBook } from '../hooks/useCreateBook';

const CreateBookForm = ({
  onCreated,
  onBusyChange,
}: {
  onCreated?: () => void;
  onBusyChange?: (busy: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const mutation = useCreateBook();
  const submitting = useRef(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !name.trim()) return;
    submitting.current = true;
    onBusyChange?.(true);
    try {
      await mutation.mutateAsync({ name: name.trim() });
      setName('');
      onCreated?.();
    } catch {
      /* Display mutation.error below. */
    } finally {
      submitting.current = false;
      onBusyChange?.(false);
    }
  };
  return (
    <form
      className="stack"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <Input
        label="Tên sổ mới"
        placeholder="Ví dụ: Chi tiêu gia đình"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          if (mutation.isError) mutation.reset();
        }}
        required
        autoFocus
        maxLength={120}
        disabled={mutation.isPending}
      />
      <Button type="submit" isLoading={mutation.isPending} disabled={!name.trim()}>
        Tạo sổ
      </Button>
      {mutation.error && (
        <p role="alert" className="field-error">
          {mutation.error.message}
        </p>
      )}
    </form>
  );
};
export default CreateBookForm;
