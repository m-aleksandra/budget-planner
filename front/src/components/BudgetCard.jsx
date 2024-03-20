import { Button, Card, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "../utils";
import { useState, useEffect } from "react";
import ViewTransactionsModal from "./ViewTransactions";
import { useBudget } from "../contexts/BudgetContext";
import AddTransactionModal from "./AddTransactionModal";
import { getMonth } from "../utils";

export default function BudgetCard({
  name,
  amount,
  max,
  year,
  month,
  gray,
  budgetId,
}) {
  const classNames = [];
  if (amount > max) {
    classNames.push("bg-danger", "bg-opacity-10");
  } else if (gray) {
    classNames.push("bg-light");
  }

  const { getBudget, deleteBudget, fetchBudgets } = useBudget();
  const [budget, setBudget] = useState(null);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  useEffect(() => {
    const fetchBudgetData = async () => {
      const budgetData = await getBudget(budgetId);
      if (budgetData) {
        setBudget(budgetData);
      }
    };

    fetchBudgetData();
  }, [budgetId, getBudget]);

  const onDelete = async () => {
    await deleteBudget(budgetId);
    fetchBudgets();
  };

  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
          <div className="me-2">
            <div>{name}</div>
            <div>
              {year}, {getMonth[month]}
            </div>
          </div>
          <div className="d-flex align-items-baseline">
            {currencyFormatter.format(amount)}
            {max && (
              <span className="text-muted fs-6 ms-1">
                / {currencyFormatter.format(max)}
              </span>
            )}
          </div>
        </Card.Title>
        {max && (
          <ProgressBar
            className="rounded-pill"
            variant={getProgressBarVariant(amount, max)}
            min={0}
            max={max}
            now={amount}
          />
        )}
        {
          <Stack
            direction="horizontal"
            gap="2"
            className="mt-4 d-flex align-items-stretch"
          >
            <Button
              variant="outline-primary"
              className="ms-auto"
              onClick={() => setShowAddTransactionModal(true)}
            >
              Add Expense
            </Button>
            {showAddTransactionModal && (
              <AddTransactionModal
                show={showAddTransactionModal}
                handleClose={() => setShowAddTransactionModal(false)}
                categoryName={budget.categoryName}
              />
            )}

            <Button
              variant="outline-secondary"
              onClick={() => setShowTransactionsModal(true)}
            >
              View Expenses
            </Button>

            {budget && showTransactionsModal && (
              <ViewTransactionsModal
                show={showTransactionsModal}
                onHide={() => setShowTransactionsModal(false)}
                transactions={budget.transactions || []}
              />
            )}
            <Button
              variant="outline-danger"
              onClick={() => onDelete()}
            >
              Delete
            </Button>
          </Stack>
        }
      </Card.Body>
    </Card>
  );
}

function getProgressBarVariant(amount, max) {
  const ratio = amount / max;
  if (ratio < 0.5) return "primary";
  if (ratio < 0.75) return "warning";
  return "danger";
}
