import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { checkIsAdmin } from '../../lib/projectRepository';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminProjectEditor from './AdminProjectEditor';

function SetupRequired() {
  return <div className="admin-login-shell"><div className="admin-login-card admin-setup-card">
    <p className="admin-kicker">Setup required</p><h1>Connect Supabase to activate the CMS.</h1>
    <p className="admin-muted">The admin dashboard is already built. Add your Supabase URL and anon key to the Bolt environment variables, then run the included <code>supabase/schema.sql</code>.</p>
    <ol><li>Create or open a Supabase project.</li><li>Run <code>supabase/schema.sql</code> in SQL Editor.</li><li>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li><li>Create an Auth user and add that user to <code>public.admins</code>.</li></ol>
    <Link className="admin-back-link" to="/">← Back to public website</Link>
  </div></div>;
}

export default function AdminApp() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(isSupabaseConfigured);
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    let active = true;
    async function sync(nextSession: Session | null) {
      if (!active) return;
      setSession(nextSession);
      setAuthError('');
      if (!nextSession) { setAuthorized(false); setChecking(false); return; }
      setChecking(true);
      try {
        const admin = await checkIsAdmin();
        if (!active) return;
        setAuthorized(admin);
        if (!admin) setAuthError('This account is signed in but is not authorized as a website administrator.');
      } catch (error) {
        if (!active) return;
        setAuthorized(false);
        setAuthError(error instanceof Error ? error.message : 'Unable to verify administrator access.');
      } finally { if (active) setChecking(false); }
    }
    void supabase.auth.getSession().then(({ data }) => sync(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { void sync(nextSession); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  if (!isSupabaseConfigured) return <SetupRequired />;
  if (checking) return <div className="admin-login-shell"><div className="admin-loading">Checking administrator access…</div></div>;
  if (!session) return <AdminLogin />;
  if (!authorized) return <div className="admin-login-shell"><div className="admin-login-card"><p className="admin-kicker">Access restricted</p><h1>Administrator approval required.</h1><p className="admin-error">{authError}</p><button className="admin-secondary" onClick={() => void supabase?.auth.signOut()}>Sign out</button></div></div>;

  return <div className="admin-shell">
    <header className="admin-header">
      <Link to="/admin" className="admin-brand">STUDIO FORMA <span>CMS</span></Link>
      <nav><a href="/" target="_blank" rel="noreferrer">View website ↗</a><button onClick={() => void supabase?.auth.signOut()}>Sign out</button></nav>
    </header>
    <main className="admin-main" key={location.pathname}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="projects/new" element={<AdminProjectEditor />} />
        <Route path="projects/:id" element={<AdminProjectEditor />} />
      </Routes>
    </main>
  </div>;
}
