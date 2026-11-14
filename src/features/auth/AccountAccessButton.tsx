import Button from '@/base/ui/Button';
import { useState, type ReactNode } from 'react';
import LoginPrompt from './LoginPrompt';
import ProfileDialog from './ProfileDialog';
import { useSession } from './session';

type AccountAccessButtonProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};
const AccountAccessButton = (props: AccountAccessButtonProps) => {
  const { children, className = '', label = 'Xem hồ sơ' } = props;
  const session = useSession();
  const [open, setOpen] = useState(false);
  const button = (
    <Button variant="unstyled" type="button" className={className} aria-label={label}>
      {children}
    </Button>
  );
  if (session) {
    return <ProfileDialog session={session}>{button}</ProfileDialog>;
  }
  return (
    <LoginPrompt open={open} onOpenChange={setOpen}>
      {button}
    </LoginPrompt>
  );
};
export default AccountAccessButton;
