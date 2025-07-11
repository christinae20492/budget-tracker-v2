"use client";

import { deleteExpense, updateExpense } from "@/app/server/expenses";
import { deleteIncome, updateIncome } from "@/app/server/incomes";
import { successToast } from "@/app/utils/toast";
import { EditExpense, EditIncome, Expense, Income } from "@/app/utils/types";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./Loader";

interface EditFormProps {
  currentItemType: "expense" | "income";
  expense: Expense | null;
  income: Income | null;
}

export const EditForm: React.FC<EditFormProps> = ({
  currentItemType,
  expense,
  income,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [id, setId] = useState("");

  const [location, setLocation] = useState("");
  const [envelope, setEnvelope] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [comments, setComments] = useState<string | null>(null);

  const [source, setSource] = useState("");
  const [savings, setSavings] = useState<number | null>(null);
  const [investments, setInvestments] = useState<number | null>(null);
  const [remainder, setRemainder] = useState<number | null>(null);

  useEffect(() => {
    if (expense && !income) {
      setId(expense.id);
      setLocation(expense.location);
      setDate(expense.date);
      setAmount(expense.amount);
      setComments(expense.comments);
      setEnvelope(expense.envelopeId);
    } else if (income && !expense) {
      setId(income.id);
      setSource(income.source);
      setDate(income.date);
      setAmount(income.amount);
      setSavings(income.savings);
      setInvestments(income.investments);
      setRemainder(income.remainder);
    }
  }, [expense, income]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (currentItemType === "expense" && expense) {
      const updatedExpense: EditExpense = {
        location,
        date,
        envelopeId: envelope,
        amount,
        comments,
      };

      await updateExpense(expense.id, updatedExpense, session, status);
      setLoading(false);
      router.push("/edit");
    } else if (income) {
      const updatedIncome: EditIncome = {
        source,
        amount,
        date,
        savings,
        investments,
        remainder,
      };
      await updateIncome(income.id, updatedIncome, session, status);
      setLoading(false);
      router.push("/edit");
    }
    successToast(`Your ${currentItemType} was updated successfully!`);
    router.push(`/edit`);
  };

  const handleDelete = async () =>{
          setLoading(true);
    if (expense) {
      const response = await deleteExpense(id, session, status);
      if (response) {
        router.push('/edit');
        setLoading(false);
      }
    } else {
      const response = await deleteIncome(id, session, status);
      if (response) {
        router.push('/edit');
        setLoading(false);
      }
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {expense && currentItemType === "expense" ? (
        <div>
          <h1 className="header">Expenditure from {expense.date}</h1>
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
                onChange={(e) => setAmount(Number(e.target.value))}
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
                value={comments ?? ""}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
                rows={3}
              ></textarea>
            </div>

            <div className="flex flex-row grow justify-center content-center">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-400 mx-3"
              >
                Edit Expense
              </button>
              <button onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrashCan} className="px-4 py-3 rounded-md bg-red-900 text-white hover:bg-red-600 dark:bg-blue-400"/>
              </button>
            </div>
          </form>
        </div>
      ) : currentItemType === "income" && income ? (
        <div>
          <h1 className="header">Income on {income.date}</h1>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <div>
              <label>Source of Income</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                required
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
              />
            </div>
            <div>
              <label>Total Income Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                required
              />
            </div>
            <div>
              <label>Savings</label>
              <input
                type="number"
                value={savings ?? 0}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
              />
            </div>
            <div>
              <label>Investments</label>
              <input
                type="number"
                value={investments ?? 0}
                onChange={(e) => setInvestments(Number(e.target.value))}
                className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
              />
            </div>
            <div>
              <label className="font-semibold">
                Remaining Income: {remainder}
              </label>
            </div>
            <div className="flex flex-row grow justify-center content-center">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 mx-2"
              >
                Edit Income
              </button>
              <button onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrashCan} className="px-4 py-3 rounded-md bg-red-900 text-white hover:bg-red-600 dark:bg-blue-400"/>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          No item selected for editing or invalid type.
        </div>
      )}
    </>
  );
};
