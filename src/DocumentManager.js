
import React, { useState } from 'react';
import './DocumentManager.css';
import UploadButton from './components/UploadButton';
import AddTextForm from './components/AddTextForm';
import DocumentList from './components/DocumentList';

function DocumentManager({ currentUser, searchTerm, setSearchTerm }) {
  // Use a global key for all documents
  const storageKey = 'all_docs';
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAddText, setShowAddText] = useState(false);
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  // Removed unused file and setFile state
  const [editDocId, setEditDocId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Save documents to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(documents));
  }, [documents]);



  // Helper: filter docs by search term (case-insensitive, in name or content)
  const filterDocs = (docs) => {
    if (!searchTerm.trim()) return docs;
    const term = searchTerm.trim().toLowerCase();
    return docs.filter(doc =>
      (doc.name && doc.name.toLowerCase().includes(term)) ||
      (doc.content && doc.content.toLowerCase().includes(term))
    );
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocuments(prev => [
          ...prev,
          {
            id: Date.now(),
            type: 'file',
            name: uploadedFile.name,
            content: event.target.result,
            owner: currentUser,
          },
        ]);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  // Handle add text as document
  const handleAddText = () => {
    if (textTitle && textContent) {
      setDocuments(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'text',
          name: textTitle,
          content: textContent,
          owner: currentUser,
        },
      ]);
      setTextTitle('');
      setTextContent('');
      setShowAddText(false);
    }
  };

  // Handle delete document
  const handleDelete = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Handle edit document
  const handleEdit = (doc) => {
    setEditDocId(doc.id);
    setEditContent(doc.content);
  };

  const handleSaveEdit = (id) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, content: editContent } : doc));
    setEditDocId(null);
    setEditContent('');
  };

  // Split documents into "My Documents" and "Other Documents"
  const myDocuments = documents.filter(doc => doc.owner === currentUser);
  const otherDocuments = documents.filter(doc => doc.owner !== currentUser);
  // Filtered by search
  const filteredMyDocs = filterDocs(myDocuments);
  const filteredOtherDocs = filterDocs(otherDocuments);

  return (
    <div className="doc-manager-container doc-manager-row">
      <div className="doc-section-box my-docs-box">
        <h2>My Documents</h2>
        <div className="doc-actions">
          <UploadButton handleFileUpload={handleFileUpload} />
          <button className="add-text-btn" onClick={() => setShowAddText(!showAddText)}>
            {showAddText ? 'Cancel' : 'Add Text'}
          </button>
        </div>
        {showAddText && (
          <AddTextForm
            textTitle={textTitle}
            setTextTitle={setTextTitle}
            textContent={textContent}
            setTextContent={setTextContent}
            handleAddText={handleAddText}
          />
        )}
        <DocumentList
          documents={filteredMyDocs}
          currentUser={currentUser}
          editDocId={editDocId}
          editContent={editContent}
          setEditContent={setEditContent}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSaveEdit={handleSaveEdit}
          setEditDocId={setEditDocId}
        />
      </div>
      <div className="doc-section-box other-docs-box">
        <h2>Other Documents</h2>
        <div style={{ marginBottom: '2.2rem', visibility: 'hidden' }}>
          {/* Keep space for search bar alignment */}
        </div>
        <DocumentList
          documents={filteredOtherDocs}
          currentUser={currentUser}
          editDocId={editDocId}
          editContent={editContent}
          setEditContent={setEditContent}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSaveEdit={handleSaveEdit}
          setEditDocId={setEditDocId}
        />
      </div>
    </div>
  );
}

export default DocumentManager;
