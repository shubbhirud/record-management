import React, { useState, useEffect } from 'react';
import './DocumentManager.css';
import UploadButton from './components/UploadButton';
import AddTextForm from './components/AddTextForm';
import DocumentList from './components/DocumentList';
import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';


function DocumentManager({ currentUser, searchTerm, setSearchTerm }) {
  const [documents, setDocuments] = useState([]);
  const [showAddText, setShowAddText] = useState(false);
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [editDocId, setEditDocId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time Firestore listener
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'documents'), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setDocuments(querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
      setLoading(false);
    }, (err) => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);



  // Helper: filter docs by search term (case-insensitive, in name or content)
  const filterDocs = (docs) => {
    if (!searchTerm.trim()) return docs;
    const term = searchTerm.trim().toLowerCase();
    return docs.filter(doc =>
      (doc.name && doc.name.toLowerCase().includes(term)) ||
      (doc.content && doc.content.toLowerCase().includes(term))
    );
  };


  // Handle file upload (store as base64 string in Firestore)
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        await addDoc(collection(db, 'documents'), {
          type: 'file',
          name: uploadedFile.name,
          content: event.target.result,
          owner: auth.currentUser ? auth.currentUser.email : currentUser,
          created: Date.now(),
        });
      };
      reader.readAsDataURL(uploadedFile);
    }
  };


  // Handle add text as document
  const handleAddText = async () => {
    if (textTitle && textContent) {
      await addDoc(collection(db, 'documents'), {
        type: 'text',
        name: textTitle,
        content: textContent,
        owner: auth.currentUser ? auth.currentUser.email : currentUser,
        created: Date.now(),
      });
      setTextTitle('');
      setTextContent('');
      setShowAddText(false);
    }
  };


  // Handle delete document
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'documents', id));
  };


  // Handle edit document
  const handleEdit = (docObj) => {
    setEditDocId(docObj.id);
    setEditContent(docObj.content);
  };

  const handleSaveEdit = async (id) => {
    const docRef = doc(db, 'documents', id);
    await updateDoc(docRef, { content: editContent });
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
          <button className="add-text-btn" onClick={() => setShowAddText(true)}>
            Add Text
          </button>
        </div>
        {showAddText && (
          <AddTextForm
            textTitle={textTitle}
            setTextTitle={setTextTitle}
            textContent={textContent}
            setTextContent={setTextContent}
            handleAddText={handleAddText}
            handleCancel={() => setShowAddText(false)}
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
