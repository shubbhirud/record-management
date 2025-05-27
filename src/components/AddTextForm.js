import React from 'react';

function AddTextForm({ textTitle, setTextTitle, textContent, setTextContent, handleAddText }) {
  return (
    <div className="add-text-form">
      <input
        type="text"
        placeholder="Document Name"
        value={textTitle}
        onChange={e => setTextTitle(e.target.value)}
      />
      <textarea
        placeholder="Enter your text here..."
        value={textContent}
        onChange={e => setTextContent(e.target.value)}
      />
      <button onClick={handleAddText}>Save</button>
    </div>
  );
}

export default AddTextForm;
