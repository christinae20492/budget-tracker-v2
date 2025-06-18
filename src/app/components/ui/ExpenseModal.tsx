import React from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: any[];
  incomes: any[];
  selectedDate: string;
  view: "expenses" | "income" | "both";
}

export default function ExpenseModal({
  isOpen,
  onClose,
  expenses,
  incomes,
  selectedDate,
  view,
}: ModalProps) {
  if (!isOpen) return null;
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(`${path}?selectedDate=${selectedDate}`);
  };

  const displayExpenses =
    view === "expenses" || view === "both" ? expenses : [];
  const displayIncomes = view === "income" || view === "both" ? incomes : [];
  const hasData = displayExpenses.length > 0 || displayIncomes.length > 0;

  return (
    <div>
      <div className="expense-modal">
        <button
          onClick={onClose}
          className="w-6 h-6 m-2 rounded bg-red text-white font-bold float-right clear-both"
        >
          <p>x</p>
        </button>
        <h2 className="header">Summary of {selectedDate}</h2>

        {hasData ? (
          <ul className="space-y-2">
            {displayExpenses.map((expense: any) => (
              <li key={expense.id} className="border-b pb-2">
                <strong>{expense.envelope}:</strong> ${expense.amount} at{" "}
                {expense.location}
                {expense.comments && (
                  <p className="text-sm text-gray-600">"{expense.comments}"</p>
                )}
              </li>
            ))}
            {displayIncomes.map((income: any) => (
              <li key={income.id} className="border-b pb-2">
                <strong>Income:</strong> ${income.amount} from {income.source}
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No{" "}
            {view === "expenses"
              ? "expenses"
              : view === "income"
              ? "income"
              : "records"}{" "}
            for this date.
          </p>
        )}

<div className="mt-4 flex flex-col space-y-2">
          <button
            onClick={() => navigateTo("/calendar/add-expense")}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Add Expense for {selectedDate}
          </button>

          <button
            onClick={() => navigateTo("/calendar/add-income")}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Income for {selectedDate}
          </button>
        </div>

      </div>
    </div>
  );
}
