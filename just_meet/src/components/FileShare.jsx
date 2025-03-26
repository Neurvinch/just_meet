import React, { useState } from "react";
import { Upload, X } from 'lucide-react';

const FileShare = ({ socket }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Emit file name to socket if needed
      socket?.emit("send-file", file.name);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    // Reset file input
    if (document.getElementById('file-input')) {
      document.getElementById('file-input').value = '';
    }
  };

  const handleFileSubmit = () => {
    if (selectedFile) {
      // Additional logic for file submission
      socket?.emit("upload-file", selectedFile);
      alert(`File ${selectedFile.name} uploaded successfully!`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Upload className="mr-2 text-blue-600" size={24} />
        File Sharing
      </h3>
      
      <div className="flex items-center space-x-4">
        <input 
          id="file-input"
          type="file" 
          onChange={handleFileUpload}
          className="hidden"
        />
        <label 
          htmlFor="file-input" 
          className="flex-grow bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-blue-600 cursor-pointer hover:bg-blue-100 transition"
        >
          {selectedFile ? selectedFile.name : 'Choose a file'}
        </label>
        
        {selectedFile && (
          <button 
            onClick={handleFileRemove}
            className="text-red-500 hover:text-red-700 transition"
            title="Remove file"
          >
            <X size={24} />
          </button>
        )}
      </div>
      
      {selectedFile && (
        <div className="flex space-x-4">
          <div className="flex-grow">
            <p className="text-sm text-gray-500">
              {`${(selectedFile.size / 1024).toFixed(2)} KB`}
            </p>
          </div>
          
          <button 
            onClick={handleFileSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center"
          >
            <Upload className="mr-2" size={16} />
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default FileShare;