import { useState } from "react";
import axios from "axios";
import { useTransaction } from "../contexts/TransactionContext";
const FileForm = () => {
  const [file, setFile] = useState(null);
  const {fetchTransactions} = useTransaction();
  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    axios.post("http://127.0.0.1:5000/file", formData)
    .then(response => {
      fetchTransactions();  
    })
    .catch(error => {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    });
    
  };
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />

      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default FileForm;
