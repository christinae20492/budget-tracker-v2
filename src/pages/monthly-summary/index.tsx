"use client";

import { useEffect, useState } from "react";
import Layout from "@/app/components/ui/Layout";
import { getMonthlyExpenditureDetails, totalSpend } from "@/app/utils/expenses";
import { filterCurrentMonthExpenses } from "@/app/utils/expenses";
import { warnToast } from "@/app/utils/toast";
import Link from "next/link";
import LoadingScreen from "@/app/components/ui/Loader";
import Head from "next/head";
import { Envelope, Expense, Income } from "@/app/utils/types";
import { useSession } from "next-auth/react";
import { getAllData } from "@/app/server/data";
import { getEnvelopeExpenses } from "@/app/server/envelopes";
import React from "react";

interface SummaryDetails {
  incomeTotals: number;
  expenseTotals: number;
  spendingDifference: number;
  spendingComparison: number;
  highestEnvelope: string;
  highestAmount: number;
  frequentEnvelope: string;
  highestSpendingLocation: string;
  highestSpendingAmount: number;
}

export default function MonthlySummary() {
  const [summary, setSummary] = useState<SummaryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentExpenses, setCurrentExpenses] = useState<Expense[]>([]);
  const [currentIncomes, setCurrentIncomes] = useState<Income[]>([]);
  const [currentEnvelopes, setCurrentEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const [triggeredEnvelopes, setTriggeredEnvelopes] = useState(new Set());

  const summaryDetails = (inc: Income[], exp: Expense[]) => {
    if (
      exp.length > 0 &&
      inc.length > 0
    ) {
      const details = getMonthlyExpenditureDetails(
        inc,
        exp
      );
      setSummary(details);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const data = await getAllData(session, status);
    if (!data) return;
    const rawExpenses = data.expenses;
    const rawIncomes = data.incomes;
    const rawEnvelopes = data.envelopes;
    const filteredExpenses = filterCurrentMonthExpenses(rawExpenses);

    const filteredEnvelopes = rawEnvelopes.map(async (env: Envelope) => {
      const envelopeExpenses = await getEnvelopeExpenses(
        env.id,
        session,
        status,
        false
      );
      if (!envelopeExpenses) return null;
      const currentMonthExpenses = filterCurrentMonthExpenses(envelopeExpenses);

      return {
        ...env,
        expenses: currentMonthExpenses,
      };
    });

    const resolvedEnvelopes = await Promise.all(filteredEnvelopes);

    const finalEnvelopes: Envelope[] = resolvedEnvelopes.filter(
      Boolean
    ) as Envelope[];

    setCurrentExpenses(filteredExpenses);
    setCurrentIncomes(rawIncomes);
    setCurrentEnvelopes(finalEnvelopes);

    summaryDetails(rawIncomes, rawExpenses);

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [status]);

  useEffect(() => {
    if (currentEnvelopes.length) {
      currentEnvelopes.forEach((env: Envelope) => {
        if (env.budget) {
          const totalSpent = totalSpend(env);
          const isOverBudget = env.fixed && totalSpent > env.budget;

          let threshold;
          if (env.budget <= 50) {
            threshold = env.budget * 0.67;
          } else if (env.budget <= 200) {
            threshold = env.budget * 0.75;
          } else {
            threshold = env.budget * 0.9;
          }

          const isCloseToBudget = env.fixed && totalSpent >= threshold;

          if (!triggeredEnvelopes.has(env.title)) {
            if (isOverBudget) {
              warnToast(
                `${env.title}'s budget has been exceeded for this month!`
              );
              setTriggeredEnvelopes((prev) => new Set(prev).add(env.title));
            } else if (isCloseToBudget) {
              warnToast(`${env.title} is close to exceeding the budget!`);
              setTriggeredEnvelopes((prev) => new Set(prev).add(env.title));
            }
          }
        }
      });
    }
  }, [currentEnvelopes, triggeredEnvelopes]);

    const getEnvelopeTitle = (envelopeId: any) => {
    const envelope = currentEnvelopes.find((env) => env.id === envelopeId);
    return envelope ? envelope.title : "Unknown Envelope";
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Your Month In Review</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className="text-center">Monthly Summary</h1>
      <h3 className="text-right p-3 text-green-dark dark:text-black hover:text-green">
        <Link href={"/monthly-summary/year-review"}>View the Year</Link>
      </h3>
      <div className="xl:m-0 m-4">
        <p className="my-2">
          Total Income: ${summary?.incomeTotals.toFixed(2) ?? 0}
        </p>
        <p className="my-2">
          Total Spending: ${summary?.expenseTotals.toFixed(2) ?? 0}
        </p>
        <p className="my-2">
          Net Savings: ${summary?.spendingDifference.toFixed(2) ?? 0}
        </p>
        <p className="my-2">
          Spending Compared to Last Month: $
          {summary?.spendingComparison.toFixed(2) ?? 0}
        </p>

        <p className="my-2">
          Category with Highest Spending: {getEnvelopeTitle(summary?.highestEnvelope)} with $
          {summary?.highestAmount.toFixed(2)}
        </p>
        <p className="my-2">
          Most Frequent Purchases Category: {getEnvelopeTitle(summary?.frequentEnvelope)}
        </p>
        <p className="my-2">
          Location w Highest Spending: {summary?.highestSpendingLocation} with $
          {summary?.highestSpendingAmount.toFixed(2)}
        </p>
      </div>

      <h2 className="text-center mt-4">Envelope Budgets</h2>
      <div className="envelope-budget-container">
        {currentEnvelopes.map((env) => {
          const totalSpent = totalSpend(env);
          const isOverBudget = env.fixed && totalSpent > (env.budget ?? 0);

          return (
            <div
              key={env.title}
              className={`summary-envelope ${
                isOverBudget ? "text-red dark:text-red-400 font-bold" : ""
              }`}
            >
              <p>
                {env.title}: ${totalSpent.toFixed(2)} / ${env.budget}
              </p>
              <div className="expense-list pl-4 mt-2">
                {env.expenses?.map((expense, idx) => (
                  <p
                    key={idx}
                    className="expense-item text-gray-700 dark:text-gray-400"
                  >
                    {expense.location}: ${expense.amount}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
