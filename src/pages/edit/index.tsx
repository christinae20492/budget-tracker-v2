import { SetStateAction, useState } from "react";
import Layout from "@/app/components/ui/Layout";
import {
  getLocalExpenses,
  getLocalIncome,
  deleteExpense,
  deleteIncome,
  getEnvelopes,
  deleteEnvelope,
  Expense,
  Envelope,
  Income,
} from "@/app/utils/localStorage";
import { formatCurrency, getFormattedDate } from "@/app/utils/expenses";
import { useRouter } from "next/navigation";
import DataManagement from "@/app/components/ui/DataButtons";
import Head from "next/head";
import Auth from "@/app/components/ui/Auth";

export default function ManageExpenses() {
  const [expenses, setExpenses] = useState(getLocalExpenses());
  const [incomes, setIncomes] = useState(getLocalIncome());
  const [envelopes, setEnvelopes] = useState(getEnvelopes());
  const [selectedItem, setSelectedItem] = useState<
    Expense | Income | Envelope | null
  >(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [isMoveDropdownVisible, setIsMoveDropdownVisible] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState("");

  const router = useRouter();

  const updateExpenses = (updatedExpenses: Expense[]) => {
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  };

  const handleDelete = async (id: number) => {
    if (type === "expense") {
      await deleteExpense(id);
      setExpenses(getLocalExpenses());
    } else if (type === "income") {
      await deleteIncome(id);
      setIncomes(getLocalIncome());
    }
    setIsModalVisible(false);
  };

  const deleteEnv = async (title: string) => {
    await deleteEnvelope(title);
    setEnvelopes(getEnvelopes());
    setIsModalVisible(false);
  };

  const handleMove = async () => {
    if (!selectedItem || !("id" in selectedItem)) return;

    const updatedExpenses = expenses
      .map((expense) =>
        expense.id === selectedItem.id
          ? { ...expense, envelope: selectedEnvelope }
          : expense
      )
      .filter(Boolean) as Expense[];

    updateExpenses(updatedExpenses);
    setExpenses(getLocalExpenses());
    setIsMoveDropdownVisible(false);
    setIsModalVisible(false);
  };

  const openModal = (
    item: Expense | Income | Envelope,
    itemType: "expense" | "income" | "envelope"
  ) => {
    setSelectedItem(item);
    setType(itemType);
    setIsModalVisible(true);
  };

  const handleItemClick = (item: any) =>{
    const params = item.id;
    router.push(`edit/${params}`)
  }

  const handleEnvClick = (env: any) =>{
    const params = env.title;
    router.push(`edit/${params}`)
  }

  return (
    <Layout>
      <Head>
        <title>Manage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className="header">Manage Expenses, Incomes, and Envelopes</h1>
      <DataManagement />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Expenses */}
        <div>
          <h2 className="font-bold text-xl">Expenses</h2>
          <div className="expense-list max-h-svh overflow-y-scroll">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-blue-200 hover:border-blue-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => handleItemClick(expense)}
              >
                <p>{getFormattedDate(expense.date)}</p>
                <p>{expense.location}</p>
                <p>{formatCurrency(expense.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Incomes */}
        <div>
          <h2 className="font-bold text-xl">Incomes</h2>
          <div className="income-list max-h-svh overflow-y-scroll">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-purple-200 hover:border-purple-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => handleItemClick(income)}
              >
                <p>{getFormattedDate(income.date)}</p>
                <p>{income.source}</p>
                <p>{formatCurrency(income.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Envelopes */}
        <div>
          <h2 className="font-bold text-xl">Envelopes</h2>
          <div className="envelope-list max-h-svh overflow-y-scroll">
            {envelopes.map((envelope) => (
              <div
                key={envelope.title}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-amber-200 hover:border-amber-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => handleEnvClick(envelope)}
              >
                <p>
                  <strong>Title:</strong> {envelope.title}
                </p>
                <p>
                  <strong>Budget:</strong>{" "}
                  {formatCurrency(envelope.budget ?? 0)}
                </p>
                <p>
                  <strong>Type:</strong> {envelope.fixed ? "Fixed" : "Variable"}
                </p>
                <p>
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
