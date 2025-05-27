import React from 'react';
import DocumentItem from './DocumentItem';

function DocumentList({ documents, currentUser, editDocId, editContent, setEditContent, handleEdit, handleDelete, handleSaveEdit, setEditDocId }) {
  return (
    <div className="doc-list">
      {documents.length === 0 && <p>No documents yet.</p>}
      {documents.map(doc => (
        <DocumentItem
          key={doc.id}
          doc={doc}
          currentUser={currentUser}
          editDocId={editDocId}
          editContent={editContent}
          setEditContent={setEditContent}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSaveEdit={handleSaveEdit}
          setEditDocId={setEditDocId}
        />
      ))}
    </div>
  );
}

export default DocumentList;
