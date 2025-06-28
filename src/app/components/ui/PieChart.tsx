import React, { useRef } from "react";
import { totalSpend } from "@/app/utils/expenses";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Envelope } from "@/app/utils/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  envelopeData: Envelope[];
}

const PieChart: React.FC<PieChartProps> = ({ envelopeData }) => {
  const chartRef = useRef<ChartJS | null>(null);

  const labels = envelopeData.map((e) => e.title);
  const dataValues = envelopeData.map((e) => totalSpend(e));

  const data = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: dataValues,
        backgroundColor: envelopeData.map((envelope) => envelope.color),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto">
      <Pie
        //ref={chartRef}
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
