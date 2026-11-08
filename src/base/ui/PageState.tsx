import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { CircleAlert, Inbox } from 'lucide-react';
import Button from './Button';

type PageStateProps = {
  kind: 'loading' | 'error' | 'empty';
  message: string;
  onRetry?: () => void;
};
const PageState = (props: PageStateProps) => {
  const { kind, message, onRetry } = props;
  if (kind === 'error')
    return (
      <Alert variant="destructive" className="rounded-2xl">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Không tải được dữ liệu</AlertTitle>
        <AlertDescription>
          <p>{message}</p>
          {onRetry && (
            <Button variant="secondary" className="mt-3" onClick={onRetry}>
              Thử lại
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  return (
    <Empty className="min-h-44 rounded-2xl border border-border bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {kind === 'loading' ? (
            <Spinner aria-hidden="true" role={undefined} />
          ) : (
            <Inbox aria-hidden="true" />
          )}
        </EmptyMedia>
        <EmptyDescription role="status">{message}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button variant="secondary" onClick={onRetry}>
            Thử lại
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
export default PageState;
