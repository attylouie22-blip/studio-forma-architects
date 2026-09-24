# Apply this CMS upgrade to the existing GitHub/Bolt project

## Existing project already in GitHub

Use the separate `studio-forma-cms-upgrade.zip` package. It contains only the files that are new or changed for the CMS, so it stays under GitHub's 100-file web upload limit.

1. Extract `studio-forma-cms-upgrade.zip`.
2. In the existing GitHub repository choose **Add file → Upload files**.
3. Drag the extracted files/folders into the repository, preserving their paths. Existing files with the same paths should be replaced by the upgraded versions.
4. Commit the changes.
5. In Bolt, pull/sync the latest GitHub commit.
6. In the Bolt terminal run `npm install` because the CMS adds `@supabase/supabase-js`.
7. Follow `SUPABASE-SETUP.md` to connect Supabase.
8. Run `npm run dev`, then open `/admin`.
9. When ready, run `npm run build` and publish.

The full `studio-forma-architects-cms.zip` is also provided if you prefer to replace/re-import the entire project.
