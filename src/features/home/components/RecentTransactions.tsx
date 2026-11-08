import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import PageState from '../../../base/ui/PageState';
import TransactionList from '../../transactions/components/TransactionList';
import type { Transaction } from '../../transactions/types';

type RecentTransactionsProps = {
  transactions: Transaction[];
  hideAmounts: boolean;
};
const RecentTransactions = (props: RecentTransactionsProps) => {
  const { transactions, hideAmounts } = props;
  return (
    <div>
      <div className="section-heading">
        <h2>Gần đây</h2>
        <Link className="text-link" to="/transactions">
          Xem tất cả <ArrowRight size={15} />
        </Link>
      </div>
      {transactions.length ? (
        <Card className="list-card">
          <CardContent>
            <TransactionList transactions={transactions.slice(0, 3)} hideAmounts={hideAmounts} />
          </CardContent>
        </Card>
      ) : (
        <PageState kind="empty" message="Chưa có giao dịch trong tháng này." />
      )}
    </div>
  );
};
export default RecentTransactions;
