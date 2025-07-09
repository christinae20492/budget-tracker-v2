"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import PieChart from "@/app/components/ui/PieChart";
import {
  filterCurrentMonthExpenses,
  getBudgetLimits,
  getFormattedDate,
  totalSpend,
} from "@/app/utils/expenses";
import { warnToast } from "@/app/utils/toast";
import Layout from "@/app/components/ui/Layout";
import { faRectangleList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/ui/Loader";
import { Expense, Envelope } from "@/app/utils/types";
import { getAllData } from "@/app/server/data";
import FocusedEnv from "@/app/components/ui/FocusedEnv";
import AddEnvelope from "@/app/components/ui/AddEnvelope";
import { getEnvelopeExpenses } from "@/app/server/envelopes";

export default function EnvelopesPage() {
  const router = useRouter();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [envId, setEnvId] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isEnvelopeModalVisible, setEnvelopeModalVisible] = useState(false);
  const [isAddEnvVisible, setAddEnvVisible] = useState(false);
  const [isDailySpendingModalVisible, setDailySpendingModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  //const budgets = getBudgetLimits(session, status);

  const fixedEnvelopes = envelopes.filter(
    (env: Envelope) => env.fixed === true
  );
  const variableEnvelopes = envelopes.filter(
    (env: Envelope) => env.fixed === false
  );

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllData(session, status);
    if (!data) return;
    const allEnvelopes = data.envelopes;
    const allExpenses = data.expenses;
    if (!data) {
      setEnvelopes([]);
      setExpenses([]);
    } else if (data) {
      setEnvelopes(allEnvelopes);
      setExpenses(allExpenses);
    }

    const envelopesWithExpensesPromises = allEnvelopes.map(async (env) => {
      const rawExp = await getEnvelopeExpenses(env.id, session, status, false);

      const currentMonthExpenses = rawExp
        ? filterCurrentMonthExpenses(rawExp)
        : [];

      return {
        ...env,
        expenses: currentMonthExpenses,
      };
    });

    const finalFilteredEnvelopes = await Promise.all(
      envelopesWithExpensesPromises
    );

    const monthsExpenses = filterCurrentMonthExpenses(expenses);
    setEnvelopes(finalFilteredEnvelopes);
    setFilteredExpenses(monthsExpenses);
    setLoading(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
      envelopes.forEach((envelope) => calculateRemainingBudget(envelope));
    };

    initializeData();
  }, [status]);

  useEffect(() => {
    if (router.query.openEnvelopeModal === 'true') {
      setAddEnvVisible(true);

      const { pathname, query } = router;
      const newQuery = { ...query };
      delete newQuery.openEnvelopeModal;

      router.replace(
        {
          pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  const handleCloseModal = async () => {
    setAddEnvVisible(false);
    await fetchData();
  };

const calculateTotalSpentToday = () => {
  const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};
  const todayFormatted = getFormattedDate();
  console.log(todayFormatted)

  const total = filteredExpenses
    .filter((expense) => {
      const expenseDatePart = expense.date ? String(expense.date) : '';
      return expenseDatePart === todayFormatted;
    })
    .reduce((currentTotal, expense) => currentTotal + expense.amount, 0);

  return total;
};

  const goToDetails = (env: Envelope) => {
    setEnvId(env.id);
    setEnvelopeModalVisible(true);
  };

  const calculateRemainingBudget = (envelope: Envelope) => {
    if (envelope.budget) {
      const totalSpent = totalSpend(envelope);
      const remainingBudget = envelope.budget - totalSpent;

      if (remainingBudget <= 0 && envelope.fixed === true) {
        warnToast(
          `${envelope.title}'s budget has been exceeded for this month.`
        );
      } else if (remainingBudget <= 10 && envelope.fixed === true) {
        warnToast(
          `${
            envelope.title
          }'s budget is close to being exceeded. Only $${remainingBudget.toFixed(
            0
          )} left.`
        );
      }

      return remainingBudget;
    }
  };

  const envelopeRender = (data: Envelope[], title: string) => {
    if (data.length === 0) {
      return (
        <div className="envelope-container">
          <h3 className="envelope-container-title">{title}</h3>
          <div className="text-center text-gray-500 mt-4 p-4 border border-dashed border-gray-300 rounded-md">
            <p className="text-lg">
              Nothing here yet. Try adding a new envelope!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="envelope-container">
        <h3 className="envelope-container-title">{title}</h3>
        <div className="envelope-grid">
          {data.map((env) => (
            <div key={env.id}>
              <div
                className={`envelope ${env.color ? "" : "bg-pink"}`}
                style={env.color ? { backgroundColor: env.color } : {}}
                onClick={() => goToDetails(env)}
              >
                <p className="envelope-title-text">{env.title}</p>
                <p className="envelope-body-text">
                  ${totalSpend(env).toFixed(2)} spent from $
                  {env.budget.toFixed(2) || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getDailySpendingLastSevenDays = () => {
    const today = new Date();
    const lastSevenDays = [];
    const dailySpending: { date: string; total: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      lastSevenDays.push(getFormattedDate(date));
    }

    lastSevenDays.forEach((day) => {
      const dailyTotal = expenses
        .filter((expense) => expense.date === day)
        .reduce((total, expense) => total + expense.amount, 0);
      dailySpending.push({ date: day, total: dailyTotal });
    });
    console.log(dailySpending)

    return dailySpending;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Your Envelopes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isAddEnvVisible && (
        <AddEnvelope onClose={handleCloseModal} envelopes={envelopes} />
      )}
      {isEnvelopeModalVisible && (
        <FocusedEnv
          onClose={() => setEnvelopeModalVisible(false)}
          envelope={envId}
        />
      )}
      {isDailySpendingModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-main">
            <h2 className="header">7 Days Record</h2>
            <ul>
              {getDailySpendingLastSevenDays().map((day) => (
                <li
                  key={day.date}
                  className="flex justify-between text-lg my-2"
                >
                  <span>{day.date}</span>
                  <span>${day.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-1/5 button align-center"
              onClick={() => setDailySpendingModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-center">Budget Overview</h1>
      <h3 className="my-4">
        <span
          className="px-2 cursor-pointer"
          onClick={() => setDailySpendingModalVisible(true)}
        >
          <FontAwesomeIcon
            icon={faRectangleList}
            className="hover:text-blue-300"
          />
        </span>
        Total Daily Spending: ${calculateTotalSpentToday().toFixed(2)}
      </h3>

      <main className="w-11/12 border border-gray-200 mx-auto mt-6 p-3">
        <div className="max-w-xl mx-auto my-10">
          <PieChart envelopeData={envelopes} />
        </div>
        <div className="text-center">
          <div>{envelopeRender(fixedEnvelopes, "Fixed")}</div>
          <div>{envelopeRender(variableEnvelopes, "Variable")}</div>
          <button className="button" onClick={() => setAddEnvVisible(true)}>
            Add Envelope
          </button>
        </div>
      </main>
    </Layout>
  );
}
