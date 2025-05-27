import React, { useState } from 'react';
import './Login.css';

// Simple in-memory user store with password encryption (base64 for demo)
const encrypt = (str) => btoa(str);
const decrypt = (str) => atob(str);

const userDB = {};

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    if (!userDB[username]) {
      setError('User not found. Please register.');
      return;
    }
    if (userDB[username] !== encrypt(password)) {
      setError('Incorrect password');
      return;
    }
    setError('');
    onLogin(username);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (userDB[username]) {
      setError('User already exists. Please login.');
      return;
    }
    userDB[username] = encrypt(password);
    setError('Registration successful! Please login.');
    setIsRegister(false);
    setConfirmPassword('');
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
        <div className="login-info-title" style={{ textAlign: 'center', width: '100%' }}>Bhiruds Record Management</div>
        <div className="login-info-desc">
          Your one-stop destination for discovering the rituals, traditions, recipes, and festivals celebrated by the Bhirud community.
        </div>
      </div>
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
        <div className="toggle-link">
          {isRegister ? (
            <span onClick={() => { setIsRegister(false); setError(''); }}>Already have an account? <b>Login</b></span>
          ) : (
            <span onClick={() => { setIsRegister(true); setError(''); }}>New user? <b>Register</b></span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
