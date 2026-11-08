import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import LoginPrompt from './LoginPrompt';
import { useSession } from './session';

type AccountAccessButtonProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};
const AccountAccessButton = (props: AccountAccessButtonProps) => {
  const { children, className = '', label = 'Sổ tài khoản' } = props;
  const session = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={label}
        onClick={() => {
          if (session) navigate('/settings');
          else setOpen(true);
        }}
      >
        {children}
      </button>
      <LoginPrompt open={open} onClose={() => setOpen(false)} />
    </>
  );
};
export default AccountAccessButton;
