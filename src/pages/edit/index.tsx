import { SetStateAction, useEffect, useState } from "react";
import Layout from "@/app/components/ui/Layout";
import { formatCurrency, getFormattedDate } from "@/app/utils/expenses";
import { useRouter } from "next/navigation";
import DataManagement from "@/app/components/ui/DataButtons";
import Head from "next/head";
import { getAllData } from "@/app/server/data";
import { signIn, useSession } from "next-auth/react";
import { Envelope, Expense, Income } from "@/app/utils/types";
import LoadingScreen from "@/app/components/ui/Loader";
import { warnToast } from "@/app/utils/toast";
import React from "react";

export default function ManageExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [selectedItem, setSelectedItem] = useState<
    Expense | Income | Envelope | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [isMoveDropdownVisible, setIsMoveDropdownVisible] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();

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

    const data = await getAllData(session, status);
    const allExp = data?.expenses;
    const allEnv = data?.envelopes;
    const allInc = data?.incomes;
    if (!allExp || !allInc || !allEnv) return;
    setExpenses(allExp);
    setIncomes(allInc);
    setEnvelopes(allEnv);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleItemClick = (item: any) => {
    const params = item.id;
    router.push(`edit/${params}`);
  };

  const handleEnvClick = (env: any) => {
    const params = env.id;
    router.push(`edit/${params}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Manage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className="header">Manage Expenses, Incomes, and Envelopes</h1>
      <div className="grid md:max-h-none xl:grid-cols-3 md:grid-cols-2 md:items-center grid-cols-1 overflow-y-auto max-h-fit gap-4 mt-6">
        {/* Expenses */}
        <div>
          <h2 className="font-bold text-xl">Expenses</h2>
          <div className="edit-list-container">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-blue-200 hover:border-blue-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => handleItemClick(expense)}
              >
                <p className="my-0">{getFormattedDate(expense.date)}</p>
                <p className="my-0">{expense.location}</p>
                <p className="my-0">{formatCurrency(expense.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Incomes */}
        <div>
          <h2 className="font-bold text-xl">Incomes</h2>
          <div className="edit-list-container">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-purple-200 hover:border-purple-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => handleItemClick(income)}
              >
                <p className="my-0">{getFormattedDate(income.date)}</p>
                <p className="my-0">{income.source}</p>
                <p className="my-0">{formatCurrency(income.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Envelopes */}
        <div>
          <h2 className="font-bold text-xl">Envelopes</h2>
          <div className="edit-list-container">
            {envelopes.map((envelope) => (
              <div
                key={envelope.title}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-amber-200 hover:border-amber-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => handleEnvClick(envelope)}
              >
                <p className="my-0">
                  <strong>Title:</strong> {envelope.title}
                </p>
                <p className="my-0">
                  <strong>Budget:</strong>{" "}
                  {formatCurrency(envelope.budget ?? 0)}
                </p>
                <p className="my-0">
                  <strong>Type:</strong> {envelope.fixed ? "Fixed" : "Variable"}
                </p>
                <p className="my-0">
                  <strong>Color:</strong>
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      backgroundColor: envelope.color,
                      borderRadius: "50%",
                      marginLeft: "8px",
                    }}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
