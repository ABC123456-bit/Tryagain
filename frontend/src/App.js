import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import 'chart.js/auto';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : `https://${window.location.hostname.replace(':5000', ':8080')}`;

function App() {
  const [file, setFile] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [deptData, setDeptData] = useState(null);
  const [studentScores, setStudentScores] = useState(null);
  const [feedbackFile, setFeedbackFile] = useState(null);
  const [feedbackSentiments, setFeedbackSentiments] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return setMessage("Please select an academic CSV file!");
    const formData = new FormData();
    formData.append("file", file);

    setMessage("Analyzing academic data...");
    
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        setDeptData(data.department_avg);
        setStudentScores(data.student_scores);
        setMessage("Academic Analysis Completed!");
      } else {
        setMessage("Error uploading academic file.");
      }
    } catch (error) {
      setMessage("Error connecting to backend. Please ensure the server is running.");
    }
  };

  const downloadCSV = () => {
    if (!studentScores) return;
    const csvHeader = "Student_Name,Total,Predicted_Total\n";
    const csvRows = studentScores.map(s => `${s.Student_Name},${s.Total},${s.Predicted_Total || ''}`).join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analyzed_academic_data.csv';
    a.click();
  };

  const handleFeedbackUpload = async () => {
    if (!feedbackFile) return setMessage("Please select a feedback CSV file!");
    const formData = new FormData();
    formData.append("file", feedbackFile);

    setMessage("Analyzing feedback sentiments...");

    try {
      const res = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackSentiments(data.sentiments);
        setMessage("Feedback Analysis Completed!");
      } else {
        setMessage("Error uploading feedback file.");
      }
    } catch (error) {
      setMessage("Error connecting to backend. Please ensure the server is running.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Academic Analytics Dashboard</h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Academic Data Analysis</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Upload & Analyze
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Teacher Feedback Analysis</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFeedbackFile(e.target.files[0])}
          className="mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={handleFeedbackUpload}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
        >
          Analyze Feedback
        </button>
      </div>

      {message && (
        <p className={`mb-4 font-semibold ${message.includes('Error') || message.includes('Please') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      {kpis && (
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-sm text-gray-600">Average Marks</div>
              <div className="text-2xl font-bold text-blue-600">{kpis.average_marks}</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-sm text-gray-600">Total Students</div>
              <div className="text-2xl font-bold text-green-600">{kpis.total_students}</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded">
              <div className="text-sm text-gray-600">Pass Count</div>
              <div className="text-2xl font-bold text-emerald-600">{kpis.pass_count}</div>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <div className="text-sm text-gray-600">Fail Count</div>
              <div className="text-2xl font-bold text-red-600">{kpis.fail_count}</div>
            </div>
          </div>
          <button
            onClick={downloadCSV}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Download Analyzed CSV
          </button>
        </div>
      )}

      {deptData && Object.keys(deptData).length > 0 && (
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Department-wise Average Marks</h2>
          <Bar 
            data={{
              labels: Object.keys(deptData),
              datasets: [{
                label: "Average Marks",
                data: Object.values(deptData),
                backgroundColor: "#3B82F6"
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>
      )}

      {studentScores && studentScores.length > 0 && (
        <div className="w-full max-w-2xl bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Performance Heatmap</h2>
          <div className="grid grid-cols-3 gap-2">
            {studentScores.map((s, i) => (
              <div key={i} 
                   className={`p-3 text-center text-white rounded font-semibold ${
                     s.Total >= 75 ? "bg-green-500" : s.Total >= 50 ? "bg-yellow-500" : "bg-red-500"
                   }`}>
                <div className="text-sm">{s.Student_Name}</div>
                <div className="text-xl">{s.Total}</div>
                {s.Predicted_Total && (
                  <div className="text-xs opacity-80">Pred: {s.Predicted_Total}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {feedbackSentiments && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Feedback Sentiment Distribution</h2>
          <Pie 
            data={{
              labels: ["Positive", "Neutral", "Negative"],
              datasets: [{
                label: "Feedback Count",
                data: [
                  feedbackSentiments.positive,
                  feedbackSentiments.neutral,
                  feedbackSentiments.negative
                ],
                backgroundColor: ["#34D399", "#FBBF24", "#F87171"]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      )}

    </div>
  );
}

export default App;
