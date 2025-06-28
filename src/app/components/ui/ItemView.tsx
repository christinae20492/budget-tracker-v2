import React, { useEffect, useRef, useState } from "react";
import { EditForm } from "./EditForms";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("rc-slider"), { ssr: false });
import "rc-slider/assets/index.css";

import { successToast } from "@/app/utils/toast";
import { Expense } from "@/app/utils/types";
import { getEnvelopeExpenses, updateEnvelope } from "@/app/server/envelopes";
import { useSession } from "next-auth/react";
import LoadingScreen from "./Loader";

interface ItemViewProps {
  envelopeItem: any;
  expenseItem: any;
  incomeItem: any;
}

const ItemView: React.FC<ItemViewProps> = ({
  envelopeItem,
  expenseItem,
  incomeItem,
}) => {
  const [currentItemType, setCurrentItemType] = useState("");
  let [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetValue, setBudgetValue] = useState<number>(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchData = async () => {
    setLoading(true);
    if (envelopeItem && !expenseItem && !incomeItem) {
      setCurrentItemType("envelope");
      const fullExpenses = await getEnvelopeExpenses(
        envelopeItem.id,
        session,
        status
      );
      setExpenses(fullExpenses);
    } else if (expenseItem && !envelopeItem && !incomeItem) {
      setCurrentItemType("expense");
    } else if (incomeItem && !envelopeItem && !expenseItem) {
      setCurrentItemType("income");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [envelopeItem, expenseItem, incomeItem, budgetValue]);

  useEffect(() => {
    if (envelopeItem && budgetValue === 0) {
      setBudgetValue(envelopeItem.budget);
    }
  }, [envelopeItem]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleBudgetChange = (value: number) => {
    setBudgetValue(value);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      if (envelopeItem) {
        await updateEnvelope(
          envelopeItem.id,
          { budget: value },
          session,
          status
        );

        successToast(`${envelopeItem.title}'s was budget updated to $${value}`);
      }
    }, 800);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  function handleDeleteExp(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-2xl mx-auto mt-16">
      {currentItemType === "expense" && expenseItem ? (
        <EditForm
          currentItemType={currentItemType}
          expense={expenseItem}
          income={null}
        />
      ) : currentItemType === "income" && incomeItem ? (
        <EditForm
          currentItemType={currentItemType}
          expense={null}
          income={incomeItem}
        />
      ) : (
        <div className="edit-envelope">
          <h1 className="header">Modify {envelopeItem?.title}</h1>
          <h2 className="header text-gray-600 text-center">
            Budget: ${budgetValue.toFixed()}
          </h2>
          <div className="px-4 my-8">
            <Slider
              min={10}
              max={1200}
              step={10}
              value={budgetValue}
              keyboard={true}
              onChange={handleBudgetChange}
            />
            <p className="text-center text-sm">Adjust the budget here</p>
          </div>
          <br />
          {expenses.length > 0 ? (
            <ul className="text-center mx-auto">
              {expenses.map((expense) => (
                <span>
                  <li key={expense.id} className="exp-inc-item">
                    {expense.location} - ${expense.amount}
                  </li>
                  <button
                    className="exp-inc-btn"
                    onClick={handleDeleteExp}
                  >
                    Delete
                  </button>
                </span>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-600 dark:text-gray-200">
              No expenses recorded for {envelopeItem?.title}.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemView;
