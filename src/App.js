import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import DocumentManager from './DocumentManager';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        {/* Welcome banner removed as requested */}
        {currentUser ? (
          <>
            <div className="user-bar">
              <span>Welcome, <b>{currentUser}</b></span>
              <button className="logout-btn" onClick={() => setCurrentUser(null)}>Logout</button>
            </div>
            {/* Search bar below user bar, above DocumentManager */}
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar-input"
              />
              <span className="search-bar-icon" aria-label="search">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="7" stroke="#4f8cff" strokeWidth="2" />
                  <line x1="14.4142" y1="14" x2="19" y2="18.5858" stroke="#4f8cff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <DocumentManager currentUser={currentUser} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </>
        ) : (
          <Login onLogin={setCurrentUser} />
        )}
      </header>
    </div>
  );
}

export default App;
