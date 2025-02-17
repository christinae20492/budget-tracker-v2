"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getEnvelopes, Envelope, Expense } from "@/app/utils/localStorage";
import Layout from "@/app/components/ui/Layout";
import { warnToast } from "@/app/utils/toast";

export default function EnvelopeDetails() {
  const router = useRouter();
  const { envelope } = router.query;

  const [envelopeData, setEnvelopeData] = useState<Envelope | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [mostFrequentLocation, setMostFrequentLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!envelope) return;

    const envelopes = getEnvelopes();
    if (!envelopes || envelopes.length === 0) {
      return;
    }

    const currentEnvelope = envelopes.find((env) => env.title === envelope);
    if (!currentEnvelope) {
      setEnvelopeData(null);
      return;
    }

    setEnvelopeData(currentEnvelope);
    const expenseList = currentEnvelope.expenses || [];
    setExpenses(expenseList);

    // Calculate total spent
    const total = expenseList.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalSpent(total);

    // Warn if budget exceeded
    if (currentEnvelope.budget) {
    if (currentEnvelope.fixed && total > currentEnvelope.budget) {
      warnToast("Warning: Budget exceeded for this fixed envelope!");
    }}

    // Find most frequent expense location if there are expenses
    if (expenseList.length > 0) {
      const locationFrequency: Record<string, number> = {};
      expenseList.forEach((expense) => {
        locationFrequency[expense.location] = (locationFrequency[expense.location] || 0) + 1;
      });

      const frequentLocation = Object.keys(locationFrequency).reduce((a, b) =>
        locationFrequency[a] > locationFrequency[b] ? a : b
      );

      setMostFrequentLocation(frequentLocation);
    }
  }, [envelope]);

  if (!envelopeData) {
    return <div className="text-center text-red-500 mt-8">Envelope not found</div>;
  }

  return (
    <Layout>
      <Head>
        <title>{envelopeData.title} - Details</title>
        <meta name="description" content={`Details for ${envelopeData.title}`} />
      </Head>

      <div className="max-w-lg mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-center text-xl font-semibold">{envelopeData.title} Details</h1>
        <p className="text-gray-600">Budget: <strong>${envelopeData.budget}</strong></p>
        <p className="text-gray-600">Total Spent: <strong>${totalSpent.toFixed(2)}</strong></p>

        <h2 className="mt-4 text-lg font-semibold">Expenses</h2>
        {expenses.length > 0 ? (
          <ul className="list-disc pl-5">
            {expenses.map((expense, index) => (
              <li
                key={index}
                className={expense.location === mostFrequentLocation ? "font-bold text-blue-500" : ""}
              >
                {expense.location}: ${expense.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No expenses recorded for this envelope.</p>
        )}
      </div>
    </Layout>
  );
}
