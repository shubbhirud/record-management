import React from 'react';

function AddTextForm({ textTitle, setTextTitle, textContent, setTextContent, handleAddText, handleCancel }) {
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
      <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
        <button onClick={handleCancel} type="button" style={{ background: '#e53935' }}>Cancel</button>
        <button onClick={handleAddText}>Save</button>
      </div>
    </div>
  );
}

export default AddTextForm;
