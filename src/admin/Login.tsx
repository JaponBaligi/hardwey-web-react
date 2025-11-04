import { useState } from 'react';
import { login } from './api';
import styles from './Login.module.css';

export default function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      await login(username, password);
      onLoggedIn();
    } catch (e: any) {
      setErr(e.message || 'Login failed');
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>ADMIN LOGIN</h2>
        <form onSubmit={onSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username</label>
            <input
              className={styles.formInput}
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input
              className={styles.formInput}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {err && <div className={styles.errorMessage}>{err}</div>}
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
      </div>
    </div>
  );
}


