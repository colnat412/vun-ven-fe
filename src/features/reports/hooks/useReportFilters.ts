import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { currentMonth } from '../../../base/utils/date';
import type { Transaction } from '../../transactions/types';

const useReportFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<Transaction['type']>('expense');
  const requestedMonth = searchParams.get('month') ?? '';
  const month = /^(?:20\d{2}|2100)-(0[1-9]|1[0-2])$/.test(requestedMonth)
    ? requestedMonth
    : currentMonth();
  const tab = searchParams.get('tab') === 'budgets' ? 'budgets' : 'statistics';
  const setFilter = (key: string, value: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set(key, value);
      // Preserve the selected month when sharing a tab, even if it was initially implicit.
      next.set('month', key === 'month' ? value : month);
      return next;
    });
  };

  return {
    month,
    tab,
    type,
    setType,
    setMonth: (value: string) => setFilter('month', value),
    setTab: (value: string) => setFilter('tab', value),
  };
};

export default useReportFilters;
