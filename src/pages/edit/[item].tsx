"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getEnvelopes, Envelope, Expense } from "@/app/utils/localStorage";

export default function EditEnvelope() {
  const router = useRouter();
  const { query } = router;
  const envelopeTitle = query?.date as string;

  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!envelopeTitle) return;

    const envelopes = getEnvelopes();
    const selectedEnvelope = envelopes.find((e) => e.title === envelopeTitle);

    if (!selectedEnvelope) {
      console.error("Envelope not found");
      return;
    }

    setEnvelope(selectedEnvelope);
    setExpenses(selectedEnvelope.expenses || []);
  }, [envelopeTitle]);

  const handleDelete = (id: number) => {
    if (!envelope) return;

    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);

    const updatedEnvelope = { ...envelope, expenses: updatedExpenses };
    const updatedEnvelopes = getEnvelopes().map((env) =>
      env.title === envelopeTitle ? updatedEnvelope : env
    );

    localStorage.setItem("envelopes", JSON.stringify(updatedEnvelopes));
  };

  if (!envelope) return <p className="text-red-500">Envelope not found</p>;

  return (
    <div className="edit-envelope">
      <h1 className="text-xl font-bold">Modify {envelope.title} Expenses</h1>

      {expenses.length > 0 ? (
        <ul className="mt-4">
          {expenses.map((expense) => (
            <li key={expense.id} className="border-b py-2">
              {expense.location} - ${expense.amount.toFixed(2)}
              <button
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(expense.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-600">
          No expenses recorded for {envelope.title}.
        </p>
      )}
    </div>
  );
}
