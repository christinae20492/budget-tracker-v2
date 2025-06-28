import { useState } from "react";
import { Envelope } from "@/app/utils/types";
import { successToast, warnToast } from "@/app/utils/toast";
import { envelopeColorsList } from "@/app/utils/colors";
import { createEnvelope, getAllEnvelopes } from "@/app/server/envelopes";
import { useSession } from "next-auth/react";
import LoadingScreen from "./Loader";

interface EnvelopeModalProps {
  onClose: () => void;
  envelopes: Envelope[]
}

export default function AddEnvelope({ onClose, envelopes }: EnvelopeModalProps) {
  const [title, setTitle] = useState("");
  const [fixed, setFixed] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
 
  const pickEnvelopeColor = (): string => {
    for (const color of envelopeColorsList) {
      const isColorInUse = envelopes.some(
        (envelope) => envelope.color === color
      );
      if (!isColorInUse) {
        return color;
      }
    }
    return "#DA5151";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !budget) {
      warnToast("Please fill in all required fields.");
      return;
    }

    const assignedColor = pickEnvelopeColor();

    const newEnvelope = {
      title,
      fixed,
      icon: "",
      budget,
      color: assignedColor,
      comments,
    };

   await createEnvelope(newEnvelope, session, status);
    successToast(`"${newEnvelope.title}" envelope created`);
    setLoading(false);

    setTitle("");
    setFixed(false);
    setBudget(0);
    onClose();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="modal-bg">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-main">
        <h2 className="text-center">Create an Envelope</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="location"
              className="block dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-white"
            >
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block dark:bg-slate-900 dark:text-white w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-white mb-2">
              Is this budget <span className="font-semibold">fixed</span> or{" "}
              <span className="font-semibold">variable</span>?
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {" "}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="fixed-yes"
                  name="fixed-budget-type"
                  value="true"
                  checked={fixed === true}
                  onChange={() => setFixed(true)}
                  required
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:text-blue-400 dark:border-gray-600 dark:bg-slate-800"
                />
                <label
                  htmlFor="fixed-yes"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  Fixed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="fixed-no"
                  name="fixed-budget-type"
                  value="false"
                  checked={fixed === false}
                  onChange={() => setFixed(false)}
                  required
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:text-blue-400 dark:border-gray-600 dark:bg-slate-800"
                />
                <label
                  htmlFor="fixed-no"
                  className="ml-2 block text-sm text-gray-900 dark:text-white"
                >
                  Variable
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-white"
            >
              Total Allowance ($)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              required
              min="0"
              step="0.01"
              className="mt-1 block dark:bg-slate-900 dark:text-white w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-white"
            >
              Comments?
            </label>
            <input
              type="text"
              id="comments"
              name="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 block dark:bg-slate-900 dark:text-white w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 rounded-md hover:neg-item dark:bg-slate-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
