import { Button as UiButton } from '@/components/ui/button';
import { Camera, PenLine } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../../../base/ui/Button';

type HomeQuickActionsProps = {
  onManual: () => void;
};
const HomeQuickActions = (props: HomeQuickActionsProps) => {
  const { onManual } = props;
  return (
    <div className="grid grid-cols-2 gap-3">
      <UiButton
        asChild
        className="button button--primary h-auto min-h-14 gap-2 rounded-2xl px-3 py-4"
      >
        <Link to="/capture">
          <Camera size={21} aria-hidden="true" />
          <span className="font-semibold">Chụp ảnh</span>
        </Link>
      </UiButton>
      <Button variant="secondary" className="h-auto min-h-14 rounded-2xl" onClick={onManual}>
        <PenLine size={19} aria-hidden="true" />
        Nhập tay
      </Button>
    </div>
  );
};
export default HomeQuickActions;
