"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import {
  addLocalIncome,
  generateIncomeId,
  Income,
} from "@/app/utils/localStorage";
import Layout from "@/app/components/ui/Layout";

export default function AddIncome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = searchParams ? searchParams.get("selectedDate") : null;
  const initialDate = selectedDate || new Date().toISOString().split("T")[0];

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(initialDate);
  const [savings, setSavings] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [remainder, setRemainder] = useState(0);

  useEffect(() => {
    const totalDeductions = savings + investments;
    setRemainder(amount - totalDeductions);
  }, [amount, savings, investments]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!source || !date || amount <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    //const userDetails = () => {
      //if (user) {
        //return user.signInDetails.loginId;
      //}
   // };

    if (remainder >= 0) {
      const newIncome: Income = {
        id: generateIncomeId(),
        source,
        amount,
        date,
        //user: userDetails(),
        savings,
        investments,
        remainder,
      };

      addLocalIncome(newIncome);
      router.push("/calendar");
    } else {
      alert("Total deductions cannot exceed the total income.");
    }
  };

  return (
    <Layout>
          <>
            <Head>
              <title>Add Income for {date}</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>

            <div className="md:max-w-xl mx-auto md:mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white
            w-full mt-1">
              <h2 className="text-center">Add Income</h2>
              <form
                onSubmit={(e) =>
                  handleFormSubmit(e)
                }
                className="space-y-4"
              >
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
                    value={savings}
                    onChange={(e) => setSavings(Number(e.target.value))}
                    className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                  />
                </div>
                <div>
                  <label>Investments</label>
                  <input
                    type="number"
                    value={investments}
                    onChange={(e) => setInvestments(Number(e.target.value))}
                    className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Remaining Income: {remainder}
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
                  >
                    Add Income
                  </button>
                </div>
              </form>
            </div>
          </>
    </Layout>
  );
}
