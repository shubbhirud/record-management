
import React, { useState } from 'react';
import './Login.css';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, getDoc, doc as firestoreDoc } from 'firebase/firestore';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  // Forgot password handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!resetInput) {
      setResetMsg('Please enter your username or email.');
      return;
    }
    let resetEmail = resetInput;
    if (!resetInput.includes('@')) {
      // Lookup username in Firestore
      const userDoc = await getDoc(firestoreDoc(db, 'usernames', resetInput));
      if (userDoc.exists()) {
        resetEmail = userDoc.data().email;
      } else {
        setResetMsg('Username not found. Please check or use your email.');
        return;
      }
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMsg('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setResetMsg('Error: ' + (err.message || err.code));
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    try {
      let email = username;
      if (!username.includes('@')) {
        // Try to look up username in Firestore
        const userDoc = await getDoc(firestoreDoc(db, 'usernames', username));
        if (userDoc.exists()) {
          email = userDoc.data().email;
        } else {
          setError('Username not found. Please check or use your email.');
          return;
        }
      }
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      onLogin(auth.currentUser.email);
    } catch (err) {
      setError('Login failed: ' + (err.message || err.code));
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('A valid email is required for registration.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      // Check if username already exists
      if (!username.includes('@')) {
        const userDoc = await getDoc(firestoreDoc(db, 'usernames', username));
        if (userDoc.exists()) {
          setError('Username already taken. Please choose another.');
          return;
        }
      }
      await createUserWithEmailAndPassword(auth, email, password);
      // Save username -> email mapping if username is not an email
      if (!username.includes('@')) {
        await setDoc(firestoreDoc(db, 'usernames', username), { email });
      }
      setError('Registration successful! Please login.');
      setIsRegister(false);
      setConfirmPassword('');
      setEmail('');
    } catch (err) {
      setError('Registration failed: ' + (err.message || err.code));
    }
  };

  return (
    <div className="login-container">
      <div className="login-info-panel">
        <div style={{ fontSize: '1.15rem', color: '#1877f2', fontWeight: 700, marginBottom: '0.7rem', lineHeight: 1.4, textAlign: 'center', width: '100%', userSelect: 'none', cursor: 'default' }}>
          <span style={{ fontFamily: 'serif', fontWeight: 700 }}>
            अयं निजः परो वेति गणना लघुचेतसाम्।<br/>
            उदारचरितानां तु वसुधैव कुटुम्बकम्॥
          </span>
        </div>
        <div className="login-info-title" style={{ textAlign: 'center', width: '100%' }}>Bhirud's Record Management</div>
        <div className="login-info-desc">
          Your one-stop destination for discovering the rituals, traditions, recipes, and festivals celebrated by the Bhirud community.
        </div>
      </div>
      {!showReset ? (
        <form className="login-form animated-form" onSubmit={isRegister ? handleRegister : handleLogin}>
          <h2 className="login-title">{isRegister ? 'Register' : 'Login'}</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="login-input"
            autoFocus
          />
          {isRegister && (
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-input"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="login-input"
            />
          )}
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="login-btn">{isRegister ? 'Register' : 'Login'}</button>
          <div className="toggle-link" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {!isRegister && (
              <span style={{ marginBottom: '0.5rem', color: '#1877f2', cursor: 'pointer' }} onClick={() => { setShowReset(true); setResetMsg(''); setResetInput(''); }}>Forgot password?</span>
            )}
            {isRegister ? (
              <span onClick={() => { setIsRegister(false); setError(''); }}>Already have an account? <b>Login</b></span>
            ) : (
              <button
                type="button"
                className="login-btn"
                style={{
                  background: 'linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%)',
                  color: '#fff',
                  margin: '0 auto',
                  padding: '0.5rem 2.2rem',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  width: 'auto',
                  minWidth: '220px',
                  maxWidth: '320px',
                  display: 'block',
                  boxShadow: '0 2px 8px rgba(67,160,71,0.10)',
                  textAlign: 'center',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => { setIsRegister(true); setError(''); }}
              >
                Create New Account
              </button>
            )}
          </div>
        </form>
      ) : (
        <form className="login-form animated-form" onSubmit={handleResetPassword}>
          <h2 className="login-title">Reset Password</h2>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={resetInput}
            onChange={e => setResetInput(e.target.value)}
            className="login-input"
            autoFocus
          />
          <button type="submit" className="login-btn">Send Reset Link</button>
          {resetMsg && <div className="error-msg">{resetMsg}</div>}
          <div className="toggle-link">
            <span onClick={() => setShowReset(false)}>Back to Login</span>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
