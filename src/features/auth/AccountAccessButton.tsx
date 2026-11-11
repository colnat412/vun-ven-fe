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
    <button type="button" className={className} aria-label={label}>
      {children}
    </button>
  );
  if (session) {
    return <ProfileDialog session={session}>{button}</ProfileDialog>;
  }
  return (
    <>
      <button type="button" className={className} aria-label={label} onClick={() => setOpen(true)}>
        {children}
      </button>
      <LoginPrompt open={open} onClose={() => setOpen(false)} />
    </>
  );
};
export default AccountAccessButton;
