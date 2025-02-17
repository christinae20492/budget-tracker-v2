"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import PieChart from "@/app/components/ui/PieChart";
import { Envelope, getEnvelopes, getLocalExpenses } from "@/app/utils/localStorage";
import {
  filterCurrentMonthExpenses,
  getBudgetLimits,
  getFormattedDate,
  totalSpend,
} from "@/app/utils/expenses";
import { warnToast } from "@/app/utils/toast";
import Layout from "@/app/components/ui/Layout";
import AddEnvelope from "@/app/components/ui/EnvelopeModal";


export default function EnvelopesPage() {
  const router = useRouter();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
    const expenses = getLocalExpenses();
  const budgets = getBudgetLimits();
  const [isEnvelopeModalVisible, setEnvelopeModalVisible] = useState(false);

  const fixedEnvelopes = envelopes.filter((env: Envelope) => env.fixed === true);
  const variableEnvelopes = envelopes.filter((env: Envelope) => env.fixed === false);

  const fetchData = async () => {
    const currentEnvelopes = await getEnvelopes();
    const filteredEnvelopes = currentEnvelopes.map((env) => ({
      ...env,
      expenses: filterCurrentMonthExpenses(env.expenses || []),
    }));
    setEnvelopes(filteredEnvelopes);
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
      envelopes.forEach((envelope) => calculateRemainingBudget(envelope));
    };

    initializeData();
  }, []);

  function calculateTotalSpentToday() {
    const expenses = filterCurrentMonthExpenses(getLocalExpenses());
    const today = getFormattedDate();
    const total = expenses
      .filter((expense) => expense.date === today)
      .reduce((total, expense) => total + expense.amount, 0);

    return total;
  }

  const goToDetails = (env: Envelope) => {
    const name = env.title;
    router.push(`/envelopes/${name}`);
  };

  const calculateRemainingBudget = (envelope: Envelope) => {
    if (envelope.budget) {
    const totalSpent = totalSpend(envelope);
    const remainingBudget = envelope.budget - totalSpent;

    if (remainingBudget <= 0 && envelope.fixed === true) {
      warnToast(`${envelope.title}'s budget has been exceeded for this month.`);
    } else if (remainingBudget <= 30 && envelope.fixed === true) {
      warnToast(
        `${envelope.title}'s budget is close to being exceeded. Only $${remainingBudget} left.`
      );
    }

    return remainingBudget;}
  };

  const envelopeRender = (data: any[], title: string) => {
    return (
      <div className="envelope-container">
        <h3 className="envelope-container-title">{title}</h3>
        <div className="envelope-grid">
          {data.map((env) => (
            <div key={env.title}>
              <div
                className={`envelope ${env.color ? "" : "bg-pink"}`}
                style={env.color ? { backgroundColor: env.color } : {}}
                onClick={() => goToDetails(env)}
              >
                <p className="envelope-title-text">{env.title}</p>
                <p className="envelope-body-text">
                  ${totalSpend(env).toFixed(2)} spent from ${env.budget}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {isEnvelopeModalVisible && (
        <AddEnvelope onClose={() => setEnvelopeModalVisible(false)} />
      )}

      <h1 className="text-2xl font-bold text-center">Budget Overview</h1>
      <h3 className="my-4">
        Total Daily Spending: ${calculateTotalSpentToday().toFixed(2)}
      </h3>

      <main className="w-11/12 border border-gray-200 mx-auto mt-6 p-3">
        <div className="max-w-xl mx-auto my-10">
          <PieChart envelopeData={envelopes} />
        </div>
        <div className="text-center">
          <div>{envelopeRender(fixedEnvelopes, "Fixed")}</div>
          <div>{envelopeRender(variableEnvelopes, "Variable")}</div>
          <button
            className="button"
            onClick={() => setEnvelopeModalVisible(true)}
          >
            Add Envelope
          </button>
        </div>
      </main>
    </Layout>
  );
}
