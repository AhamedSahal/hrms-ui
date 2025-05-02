import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { BsUpload } from "react-icons/bs";

const FileUploader = ({onFileUpload }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle the file drop event
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    } else {
      alert('Please drop a valid PDF, DOC, or DOCX file.');
    }
  };

  // Handle file input change (when a file is selected via the file dialog)
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    } else {
      alert('Please select a valid PDF, DOC, or DOCX file.');
    }
  };

  // Check if the file is a valid type (PDF, DOC, or DOCX)
  const isValidFileType = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return allowedTypes.includes(file.type);
  };

  // Handle file download
  const handleDownload = () => {
    if (uploadedFile) {
      saveAs(uploadedFile, uploadedFile.name);
    }
  };

  return (
    <div className="file-uploader">
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <p>< BsUpload  size={50}/></p>

        <p>Drag and drop or choose your files</p>
        <label htmlFor="">Upload .pdf, .doc or .docx file upto 5MB</label>
      </div>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      {uploadedFile && (
        <div>
          <p>Uploaded File: {uploadedFile.name}</p>
          <button  className="btn hire-next-btn" onClick={handleDownload}>Download</button>
          <br />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
