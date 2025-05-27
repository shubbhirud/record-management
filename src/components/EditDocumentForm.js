import React from 'react';

function EditDocumentForm({ editContent, setEditContent, handleSaveEdit, docId, setEditDocId }) {
  return (
    <>
      <textarea
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
      />
      <button onClick={() => handleSaveEdit(docId)}>Save</button>
      <button onClick={() => setEditDocId(null)}>Cancel</button>
    </>
  );
}

export default EditDocumentForm;
