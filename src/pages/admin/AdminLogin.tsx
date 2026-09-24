import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    setBusy(false);
  }

  return <div className="admin-login-shell">
    <div className="admin-login-card">
      <p className="admin-kicker">Studio Forma CMS</p>
      <h1>Portfolio administration</h1>
      <p className="admin-muted">Sign in to add projects, upload portfolio images, choose hero photos, and publish work to the live website.</p>
      <form onSubmit={submit} className="admin-login-form">
        <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <a className="admin-back-link" href="/">← Back to public website</a>
    </div>
  </div>;
}
