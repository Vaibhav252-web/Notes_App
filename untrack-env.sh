#!/usr/bin/env bash
# Run ONCE from the repo root (Notes_App/) to stop git tracking files that
# were committed before .gitignore existed. Your local files are NOT deleted.
set -e

git rm -r --cached --ignore-unmatch server/.env server/node_modules client/vite-project/node_modules
git add .gitignore server/.gitignore client/vite-project/.gitignore server/.env.example
git commit -m "Stop tracking .env and node_modules; add .gitignore and .env.example"

echo
echo "Done. Now push:  git push origin main"
echo "IMPORTANT: the old .env is still in git HISTORY. Rotate MONGO_URI password,"
echo "JWT_SECRET and the Gmail app password (see README notes)."
