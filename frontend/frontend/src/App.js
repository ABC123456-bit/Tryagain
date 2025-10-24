import React from "react";
import UploadForm from "./UploadForm";
import FeedbackForm from "./FeedbackForm";

function App() {
  return (
    <div className="App">
      <h1>InvoiceGenie Frontend</h1>
      <UploadForm />
      <FeedbackForm />
    </div>
  );
}

export default App;
const API_URL = process.env.REACT_APP_API_URL + "/api/getdata";