import React, { useState } from "react";

function FeedbackForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      fetch("https://academic10.onrender.com/feedback", {
  method: "POST",
  body: formData,
});



      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error uploading feedback:", err);
    }
  };

  return (
    <div>
      <h2>Upload Feedback CSV</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default FeedbackForm;
