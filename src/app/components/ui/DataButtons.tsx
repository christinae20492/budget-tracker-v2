import { exportYearlyData, importYearlyData } from "@/app/utils/export";

export default function DataManagement() {
  return (
    <div>
      <h2 className="header">Export & Import Data</h2>

      <button onClick={exportYearlyData} className="export-btn">
        Export Yearly Data
      </button>

      <input
        type="file"
        accept="application/json"
        onChange={(e) => {
          const file = e.target?.files?.[0];
          if (file) {
            importYearlyData(file);
          }
        }}
        className="import-btn"
      />
    </div>
  );
}