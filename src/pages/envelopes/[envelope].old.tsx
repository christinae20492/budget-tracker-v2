"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getFormattedDate } from "@/app/utils/expenses";
import { warnToast } from "@/app/utils/toast";
import Layout from "@/app/components/ui/Layout";
import { Envelope, Expense } from "@/app/utils/types";
import { getAllEnvelopes, getEnvelopeExpenses } from "@/app/server/envelopes";
import { useSession } from "next-auth/react";
import { getAllExpenses } from "@/app/server/expenses";
import LoadingScreen from "@/app/components/ui/Loader";

export default function EnvelopeDetails() {
  const router = useRouter();
  const { envId } = router.query;

  const [envelopeData, setEnvelopeData] = useState<Envelope | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [mostFrequentLocation, setMostFrequentLocation] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchData = async () => {
    setLoading(true)
    if (!envId || typeof envId !== "string" || status === "loading") return;

    const envelopes = await getAllEnvelopes(session, status);
    if (!envelopes || envelopes.length === 0) {
      return;
    }

    const currentEnvelope = envelopes.find((env) => env.id === envId);
    if (!currentEnvelope) {
      setEnvelopeData(null);
      return;
    }

    setEnvelopeData(currentEnvelope);
    const expenseList = await getEnvelopeExpenses(envId, session, status, false);

    if (!expenseList) return;

    // Filter expenses for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const filteredExpenses = expenseList.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    setExpenses(filteredExpenses);

    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    setTotalSpent(total);

    let diff = total - currentEnvelope?.budget;

    if (currentEnvelope.budget) {
      if (currentEnvelope.fixed && total > currentEnvelope.budget) {
        warnToast(`Budget exceeded! You spent an extra $${diff.toFixed(2)}!`);
      }
    }

    if (filteredExpenses.length > 0) {
      const locationFrequency: Record<string, number> = {};
      filteredExpenses.forEach((expense) => {
        locationFrequency[expense.location] =
          (locationFrequency[expense.location] || 0) + 1;
      });

      const frequentLocation = Object.keys(locationFrequency).reduce((a, b) =>
        locationFrequency[a] > locationFrequency[b] ? a : b
      );

      setMostFrequentLocation(frequentLocation);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (envId && typeof envId === "string" && status === "authenticated") {
        fetchData();
        console.log(expenses)
    }
  }, [envId, status]);

  if (!envelopeData) {
    return (
      <div className="text-center text-red-500 mt-8">Envelope not found</div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>{envelopeData.title} - Details</title>
        <meta
          name="description"
          content={`Details for ${envelopeData.title}`}
        />
      </Head>

      <div className="mx-auto text-center">
        <h1 className="header">{envelopeData.title} Details</h1>
        <h2 className="text-gray-600">
          Budget: <strong>${envelopeData.budget}</strong>
        </h2>
        <h2 className="text-gray-600">
          Total Spent: <strong>${totalSpent.toFixed(2)}</strong>
        </h2>

        <h2 className="mt-4 text-lg font-semibold">Expenses</h2>
        {expenses.length > 0 ? (
          <ul className="list-disc pl-5">
            {expenses.map((expense, index) => (
              <span>
                <li
                  key={index}
                  className={`exp-inc-item my-3 ${
                    expense.location === mostFrequentLocation
                      ? "font-bold text-blue-med"
                      : ""
                  }`}
                >
                  {expense.location}: ${expense.amount}
                </li>
              </span>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            No expenses recorded for this envelope this month.
          </p>
        )}
      </div>
    </Layout>
  );
}
