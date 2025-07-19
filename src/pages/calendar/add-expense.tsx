"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { failToast, successToast, warnToast } from "@/app/utils/toast";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";
import { addExpenseToEnvelope, createExpense, getAllExpenses, getExpense } from "@/app/server/expenses";
import { signIn, useSession } from "next-auth/react";
import { getAllEnvelopes } from "@/app/server/envelopes";
import { Envelope, Expense } from "@/app/utils/types";
import LoadingScreen from "@/app/components/ui/Loader";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

export default function AddExpenses() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDate = searchParams ? searchParams.get("selectedDate") : null;
  const initialDate = selectedDate || new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [loadedExp, setLoadedExp] = useState<Expense[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [location, setLocation] = useState("");
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [envelope, setEnvelope] = useState("");
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState<string>("");
  const [comments, setComments] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      setLoading(false);
      return;
    }

    if (status === "unauthenticated") {
      warnToast("Please login to access this page.");
      signIn();
    }
  }, [status, session]);

  const fetchData = async () => {
    setLoading(true);
    const storedEnvelopes = await getAllEnvelopes(session, status);
    const storedExpenses = await getAllExpenses(session, status);
    if (!storedEnvelopes) return null;
    setEnvelopes(storedEnvelopes);
    if (storedEnvelopes.length > 0) {
      setEnvelope(storedEnvelopes[0].id);
    }
    if (storedExpenses) {
    setLoadedExp(getRecurringExpenses(storedExpenses))
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [session, status]);

  useEffect(() => {
    if (envelopes.length === 0) {
      warnToast("You need to create an envelope before creating an expense.");
    }
  }, [envelopes]);

  const getRecurringExpenses = (expenses: Expense[]) =>{
    const occurrenceMap = new Map<string, number>();
  const recurringExpensesMap = new Map<string, Expense[]>();

  expenses.forEach((expense) => {

    const key = `${expense.location.toLowerCase()}|||${expense.amount}`;

    occurrenceMap.set(key, (occurrenceMap.get(key) || 0) + 1);

    if (!recurringExpensesMap.has(key)) {
      recurringExpensesMap.set(key, []);
    }
    recurringExpensesMap.get(key)?.push(expense);
  });

  const recurringList: Expense[] = [];

  occurrenceMap.forEach((count, key) => {
    if (count > 1) {
      const expensesForKey = recurringExpensesMap.get(key);
      if (expensesForKey) {
        recurringList.push(...expensesForKey);
      }
    }
  });

   const uniqueRecurring = Array.from(new Set(recurringList.map(exp => `${exp.location}|||${exp.amount}`)))
    .map(key => recurringExpensesMap.get(key)?.[0])
     .filter(Boolean) as Expense[];
  return uniqueRecurring;
  }

  const loadExpense = async (id:string) =>{
    const foundExp = await getExpense(id, session, status);
    if (foundExp) {
      setLocation(foundExp.location);
      setEnvelope(foundExp.envelopeId);
      let string = foundExp.amount.toString();
      setAmount(string);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || status === "loading" || status === "unauthenticated") {
      warnToast("Please wait for authentication/data to load.");
      return;
    }

    if (!location || !envelope || !date || !amount) {
      warnToast("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    if (!envelopes || envelopes.length === 0) {
      warnToast("Envelopes not loaded.");
      return;
    }

    const result = await createExpense(
      location,
      envelope,
      date,
      amount,
      comments,
      session,
      status
    );

    setLoading(false);

    if (result) {
      router.push("/calendar");
      successToast(`Expense for ${date} added successfully`);
    }
    successToast(`Expense for ${date} added successfully`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Add Expense for {date}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className="md:max-w-xl mx-auto md:mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white
            w-full mt-1"
      >
        <h2 className="text-center">Add New Expense</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Location of Purchase<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="envelope"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Category of Purchase<span className="text-red-500">*</span>
            </label>
            <select
              id="envelope"
              value={envelope}
              onChange={(e) => setEnvelope(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            >
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.title}
                </option>
              ))}
            </select>
            {envelopes.length === 0 && (
              <p className="text-center text-gray-700">
                Don't have any envelopes?
                <Link
                  href="/envelopes?openEnvelopeModal=true"
                  className="text-blue-600 hover:underline ml-2"
                >
                  Click here to create one.
                </Link>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Date of Purchase<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Total Cost ($)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
              rows={3}
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-400"
            >
              Add Expense
            </button>
          </div>

          <div className="flex justify-center">
          <div className="relative">
            <button className="button" onClick={()=>setIsDropdownVisible(!isDropdownVisible)}>
              Load Expense
            </button>
            {isDropdownVisible && (
              <div className="top-full left-0 mt-4 w-full">
                <label
              htmlFor="loadexpense"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Recurring Expenses<span className="text-red-500">*</span>
            </label>
            <select
              id="exp"
              onChange={(e) => loadExpense(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            >
              {loadedExp.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.location} / ${exp.amount}
                </option>
              ))}
            </select>
              </div>
            )}
          </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
