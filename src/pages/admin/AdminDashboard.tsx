import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProject, fetchAdminProjects, setProjectPublished, type AdminProject } from '../../lib/projectRepository';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try { setProjects(await fetchAdminProjects()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load projects.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);
  const publishedCount = useMemo(() => projects.filter(project => project.isPublished).length, [projects]);
  const draftCount = projects.length - publishedCount;

  async function toggle(project: AdminProject) {
    try {
      await setProjectPublished(project.id, !project.isPublished);
      setMessage(project.isPublished ? 'Project moved to draft.' : 'Project published.');
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to update project.'); }
  }

  async function remove(project: AdminProject) {
    if (!window.confirm(`Delete “${project.title}”? This also removes uploaded images for this project.`)) return;
    try {
      await deleteProject(project.id);
      setMessage('Project deleted.');
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete project.'); }
  }

  return <div className="admin-page">
    <div className="admin-page-heading">
      <div><p className="admin-kicker">Portfolio</p><h1>Projects</h1></div>
      <Link className="admin-primary" to="/admin/projects/new">+ Add project</Link>
    </div>

    <div className="admin-stats">
      <article><span>Total</span><strong>{projects.length}</strong></article>
      <article><span>Published</span><strong>{publishedCount}</strong></article>
      <article><span>Drafts</span><strong>{draftCount}</strong></article>
    </div>

    {message && <div className="admin-notice success">{message}<button onClick={() => setMessage('')}>×</button></div>}
    {error && <div className="admin-notice error">{error}<button onClick={() => setError('')}>×</button></div>}

    {loading ? <div className="admin-empty">Loading portfolio…</div> : projects.length === 0 ? <div className="admin-empty"><h2>No projects yet.</h2><p>Create your first portfolio project and upload photos directly from this dashboard.</p></div> :
      <div className="admin-project-list">
        {projects.map(project => <article className="admin-project-row" key={project.id}>
          <div className="admin-project-thumb">{project.hero ? <img src={project.hero} alt="" /> : <span>No image</span>}</div>
          <div className="admin-project-main">
            <div className="admin-project-title-line"><h2>{project.title}</h2><span className={project.isPublished ? 'admin-status published' : 'admin-status draft'}>{project.isPublished ? 'Published' : 'Draft'}</span></div>
            <p>{project.location || 'No location'} · {project.year || 'No year'} · {project.category || 'Uncategorized'}</p>
            <small>{project.images.length} gallery image{project.images.length === 1 ? '' : 's'}</small>
          </div>
          <div className="admin-project-actions">
            <Link className="admin-secondary" to={`/admin/projects/${project.id}`}>Edit</Link>
            <button className="admin-secondary" onClick={() => void toggle(project)}>{project.isPublished ? 'Unpublish' : 'Publish'}</button>
            <button className="admin-danger" onClick={() => void remove(project)}>Delete</button>
          </div>
        </article>)}
      </div>}
  </div>;
}
