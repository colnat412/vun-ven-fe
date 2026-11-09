import { useState } from 'react';
import PageState from '@/base/ui/PageState';
import Button from '@/base/ui/Button';
import { FieldError } from '@/components/ui/field';
import { percentage } from '@/base/utils/money';
import { useSession } from '../../auth/session';
import { useBudget } from '../hooks/useBudget';
import { useCopyBudget } from '../hooks/useCopyBudget';
import BudgetEditor from './BudgetEditor';
import BudgetSummary from './BudgetSummary';
import CategoryBudgets from './CategoryBudgets';

const BudgetSection = ({ month }: { month: string }) => {
  const session = useSession();
  const query = useBudget(month);
  const copy = useCopyBudget();
  const [editor, setEditor] = useState<{
    category?: string;
    categoryId?: string;
    initialAmount: string;
    hasLimit: boolean;
    canSave?: boolean;
  }>();

  if (session && !session.bookId)
    return <p className="small muted">Hãy chọn hoặc tạo sổ trong Cài đặt để đặt ngân sách.</p>;
  if (query.isPending) return <PageState kind="loading" message="Đang tải ngân sách…" />;
  if (query.error)
    return (
      <PageState
        kind="error"
        message={query.error.message}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  const data = query.data;
  const budget = data.totalLimitVnd === null ? null : BigInt(data.totalLimitVnd);
  const spent = BigInt(data.spentVnd);
  const rows = data.categories.map((row) => {
    const limit = BigInt(row.limitVnd ?? '0');
    const spent = BigInt(row.spentVnd);
    return {
      category: row.categoryName,
      categoryId: row.categoryId,
      isActive: row.isActive,
      hasLimit: row.limitVnd !== null,
      limit,
      spent,
      remaining: limit - spent,
      usedPercent: percentage(spent, limit),
    };
  });

  return (
    <div className="grid items-start gap-6 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div className="stack-lg min-w-0">
        <BudgetSummary
          month={month}
          budget={budget}
          spent={spent}
          usedPercent={
            budget === null ? 0 : budget === 0n && spent > 0n ? 100 : percentage(spent, budget)
          }
          onEdit={() =>
            setEditor({ initialAmount: data.totalLimitVnd ?? '', hasLimit: budget !== null })
          }
        />
        {budget === null && !rows.some((row) => row.hasLimit) && (
          <div className="stack">
            <Button
              variant="secondary"
              isLoading={copy.isPending}
              onClick={() => copy.mutate(month)}
            >
              Sao chép ngân sách tháng trước
            </Button>
            {copy.error && <FieldError>{copy.error.message}</FieldError>}
          </div>
        )}
      </div>
      <CategoryBudgets
        rows={rows}
        totalBudget={budget}
        onEdit={(row) =>
          setEditor({
            category: row.category,
            categoryId: row.categoryId,
            initialAmount: row.hasLimit ? row.limit.toString() : '',
            hasLimit: row.hasLimit,
            canSave: row.isActive,
          })
        }
      />
      {editor && <BudgetEditor {...editor} month={month} onClose={() => setEditor(undefined)} />}
    </div>
  );
};

export default BudgetSection;
