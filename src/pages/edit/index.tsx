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
          <div className="expense-list">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-blue-200 hover:border-blue-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => openModal(expense, "expense")}
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
          <div className="income-list">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-purple-200 hover:border-purple-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => openModal(income, "income")}
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
          <div className="envelope-list">
            {envelopes.map((envelope) => (
              <div
                key={envelope.title}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-amber-200 hover:border-amber-950 hover:rounded-2xl transition-all drop-shadow-md dark:hover:text-black"
                onClick={() => openModal(envelope, "envelope")}
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

      {/* Modal */}
      {isModalVisible && selectedItem && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-4 shadow-lg w-1/3 dark:bg-gray-700">
            <h3 className="font-bold text-lg">
              {type === "expense"
                ? "Expense Details"
                : type === "income"
                ? "Income Details"
                : "Envelope Details"}
            </h3>

            <div className="mt-4">
              {"date" in selectedItem && (
                <p>
                  <strong>Date:</strong> {getFormattedDate(selectedItem.date)}
                </p>
              )}

              {"location" in selectedItem && (
                <p>
                  <strong>Location:</strong> {selectedItem.location}
                </p>
              )}
              {"source" in selectedItem && (
                <p>
                  <strong>Source:</strong> {selectedItem.source}
                </p>
              )}

              {type !== "envelope" && "amount" in selectedItem && (
                <p>
                  <strong>Amount:</strong> {formatCurrency(selectedItem.amount)}
                </p>
              )}
              {type === "expense" && "envelope" in selectedItem && (
                <>
                  <p>
                    <strong>Envelope:</strong> {selectedItem.envelope}
                  </p>
                  <p>
                    <strong>Comments:</strong> {selectedItem.comments}
                  </p>
                </>
              )}

              {type === "income" && "amount" in selectedItem && (
                <p>
                  <strong>Allocation:</strong>{" "}
                  {JSON.stringify(selectedItem.amount)}
                </p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              {type === "expense" && (
                <>
                  {!isMoveDropdownVisible && (
                    <button
                      className="button bg-blue-500 text-white mr-2"
                      onClick={() => setIsMoveDropdownVisible(true)}
                    >
                      Move
                    </button>
                  )}
                  {isMoveDropdownVisible && (
                    <div className="w-full mt-4">
                      <label
                        htmlFor="envelope"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Envelope:
                      </label>
                      <select
                        id="envelope"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={selectedEnvelope}
                        onChange={(e) => setSelectedEnvelope(e.target.value)}
                      >
                        <option value="">Choose an envelope</option>
                        {envelopes.map((env) => (
                          <option key={env.title} value={env.title}>
                            {env.title}
                          </option>
                        ))}
                      </select>
                      <div className="flex justify-end mt-2">
                        <button
                          className="button bg-green-500 text-white mr-2"
                          disabled={!selectedEnvelope}
                          onClick={handleMove}
                        >
                          Confirm
                        </button>
                        <button
                          className="button bg-gray-500 text-white"
                          onClick={() => setIsMoveDropdownVisible(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {type !== "envelope" && "id" in selectedItem && (
                <>
                  <button
                    className="button bg-red-500 text-white mr-2"
                    onClick={() => handleDelete(selectedItem.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="button"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Close
                  </button>
                </>
              )}

              {type === "envelope" && "title" in selectedItem && (
                <>
                  <button
                    className="button bg-blue-500 text-white mr-2"
                    onClick={() =>
                      router.push(
                        `/edit/${encodeURIComponent(selectedItem.title)}`
                      )
                    }
                  >
                    Modify
                  </button>
                  <button
                    className="button bg-red-500 text-white mr-2"
                    onClick={() => deleteEnv(selectedItem.title)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
