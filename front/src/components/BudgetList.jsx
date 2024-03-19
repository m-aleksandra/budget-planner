import BudgetCard from "./BudgetCard";
import { useBudget } from "../contexts/BudgetContext";
const BudgetList = () => {
  const { budgets } = useBudget();
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budgetId={budget.id}
            name={budget.categoryName}
            amount={budget.amount}
            max={budget.max}
            month={budget.month}
            year={budget.year}
          />
        ))}
      </div>
    </>
  );
};

export default BudgetList;
