"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getEnvelopes, Envelope, Expense } from "@/app/utils/localStorage";
import Layout from "@/app/components/ui/Layout";
import Head from "next/head";

export default function EditEnvelope() {
  const router = useRouter();
  const { item } = router.query;
  const envelopeTitle = typeof item === "string" ? item : "";

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
    <Layout>
      <Head>
        <title>{envelope.title}'s Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="edit-envelope">
        <h1 className="header">Modify {envelope.title} Expenses</h1>

        {expenses.length > 0 ? (
          <ul className="text-center mx-auto">
            {expenses.map((expense) => (
              <span>
                <li key={expense.id} className="exp-inc-item">
                  {expense.location} - ${expense.amount.toFixed(2)}
                </li>
                <button
                  className="exp-inc-btn"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </button>
              </span>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600 dark:text-gray-200">
            No expenses recorded for {envelope.title}.
          </p>
        )}
      </div>
    </Layout>
  );
}
