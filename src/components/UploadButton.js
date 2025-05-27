import React from 'react';

function UploadButton({ handleFileUpload }) {
  return (
    <label className="upload-btn">
      Upload Document
      <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
    </label>
  );
}

export default UploadButton;
