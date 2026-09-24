import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { projects as fallbackProjects, type Project } from '../data/projects';
import { fetchPublishedProjects } from '../lib/projectRepository';
import { isSupabaseConfigured } from '../lib/supabase';

type ProjectsContextValue = {
  projects: Project[];
  loading: boolean;
  usingCms: boolean;
  refreshProjects: () => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [usingCms, setUsingCms] = useState(false);

  const refreshProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjects(fallbackProjects);
      setUsingCms(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const cmsProjects = await fetchPublishedProjects();
      if (cmsProjects.length > 0) {
        setProjects(cmsProjects);
        setUsingCms(true);
      } else {
        setProjects(fallbackProjects);
        setUsingCms(false);
      }
    } catch (error) {
      console.warn('Portfolio CMS unavailable; using local demo projects.', error);
      setProjects(fallbackProjects);
      setUsingCms(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refreshProjects(); }, [refreshProjects]);

  const value = useMemo(() => ({ projects, loading, usingCms, refreshProjects }), [projects, loading, usingCms, refreshProjects]);
  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const value = useContext(ProjectsContext);
  if (!value) throw new Error('useProjects must be used inside ProjectsProvider.');
  return value;
}
