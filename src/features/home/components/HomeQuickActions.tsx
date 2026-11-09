import { Button as UiButton } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import AppIcon from '../../../base/ui/AppIcon';
import Button from '../../../base/ui/Button';

type HomeQuickActionsProps = {
  onCreate: () => void;
};
const HomeQuickActions = (props: HomeQuickActionsProps) => {
  const { onCreate } = props;
  return (
    <div className="quick-actions">
      <Button onClick={onCreate}>
        <Plus size={19} />
        Ghi thủ công
      </Button>
      <UiButton asChild variant="secondary" className="button button--secondary">
        <Link to="/reports?tab=budgets">
          <AppIcon name="piggy-bank-budget" size={19} />
          Ngân sách
        </Link>
      </UiButton>
    </div>
  );
};
export default HomeQuickActions;
