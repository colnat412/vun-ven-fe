import { formatMoney } from '../../../base/utils/money';
import CategoryJar from './CategoryJar';

type Props = {
  rows: { category: string; amount: bigint; share: number }[];
  label: string;
  hideAmounts?: boolean;
};

const CategoryJarGrid = ({ rows, label, hideAmounts = false }: Props) => (
  <div className="category-jars-container">
    <ul className="category-jars" aria-label={`Tỷ trọng ${label} theo danh mục`}>
      {rows.map((row) => {
        const percent = row.share > 0 && row.share < 1 ? '<1' : String(Math.round(row.share));
        return (
          <li className="category-jar-item" key={row.category}>
            <span className="category-jar-name">{row.category}</span>
            <CategoryJar category={row.category} percent={row.share} />
            <strong className="category-jar-amount">
              {hideAmounts ? '••••••' : formatMoney(row.amount)}
            </strong>
            <span className="category-jar-percent">
              {percent}% {label}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);

export default CategoryJarGrid;
