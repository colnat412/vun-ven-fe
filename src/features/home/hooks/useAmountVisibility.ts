import { useState } from 'react';

const useAmountVisibility = () => {
  const [isHidden, setIsHidden] = useState(false);
  const toggleVisibility = () => setIsHidden((previous) => !previous);
  return { isHidden, toggleVisibility };
};

export default useAmountVisibility;
