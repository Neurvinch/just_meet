import React from "react";

const FileShare = ({ socket }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      socket.emit("send-file", file.name);
    }
  };

  return (
    <div>
      <h3>File Sharing</h3>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default FileShare;
