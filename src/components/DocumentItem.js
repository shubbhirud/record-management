
import EditDocumentForm from './EditDocumentForm';

function DocumentItem({ doc, currentUser, editDocId, editContent, setEditContent, handleEdit, handleDelete, handleSaveEdit, setEditDocId }) {
  const isOwner = doc.owner === currentUser;

  // Copy to clipboard handler
  const handleCopy = () => {
    if (doc.type === 'text') {
      navigator.clipboard.writeText(doc.content);
    }
  };

  // Download handler (for file type)
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = doc.content;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="doc-item">
      <h3>{doc.name}</h3>
      {editDocId === doc.id && isOwner ? (
        <EditDocumentForm
          editContent={editContent}
          setEditContent={setEditContent}
          handleSaveEdit={handleSaveEdit}
          docId={doc.id}
          setEditDocId={setEditDocId}
        />
      ) : (
        <>
          {doc.type === 'file' ? null : (
            <pre className="doc-content">{doc.content}</pre>
          )}
          <div className="doc-actions-inline">
            {/* Edit button only for text and owner */}
            {isOwner && doc.type !== 'file' && (
              <button onClick={() => handleEdit(doc)}>Edit</button>
            )}
            {/* Download button for file type (owner or not) */}
            {doc.type === 'file' && (
              <button onClick={handleDownload}>Download</button>
            )}
            {/* Copy button for text type (owner or not) */}
            {doc.type === 'text' && (
              <button onClick={handleCopy}>Copy</button>
            )}
            {/* Delete button only for owner */}
            {isOwner && (
              <button onClick={() => handleDelete(doc.id)}>Delete</button>
            )}
          </div>
        </>
      )}
      <div className="doc-owner">Owner: {doc.owner}</div>
    </div>
  );
}

export default DocumentItem;
