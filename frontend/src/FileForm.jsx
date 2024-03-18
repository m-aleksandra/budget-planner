import { useState } from "react";
import axios from "axios";

const FileForm = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
      );
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
          console.log(e.target.files);
        }}
      />

      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default FileForm;
