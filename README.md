# Fortuna

Modular TypeScript monorepo for API, domain, database, web, CLI, and shared contracts.

## Workspace
- Package manager: pnpm
- Packages: `packages/*`

## Quick start
```bash
pnpm install
pnpm typecheck
```

## Production

### 1) Create `.env` before build
This repository expects root environment variables from `.env` during build/start (`node --env-file=../../.env` in package scripts).

Minimum rule:
- create and populate root `.env` first
- then run build/start

```bash
npm run build
npm run start
```

### 2) Runtime roles in production
- `api`: long-running backend process (`npm run start`)
- `web`: static files generated at `packages/web/dist/web`
- `cli`: on-demand operator tool (`npm run cli -- <command>`)

Examples:
```bash
npm run cli -- auth me
npm run cli -- --mode remote transactions list --page 1
```

### 3) Simple web distribution with Nginx
Build the web and serve static files via Nginx.

```bash
# build all packages (including web)
npm run build

# copy web artifacts to server path
rsync -avz packages/web/dist/web/ user@your-server:/var/www/fortuna-web/
```

Nginx site example (`/etc/nginx/sites-available/fortuna-web`):

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /var/www/fortuna-web;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/fortuna-web /etc/nginx/sites-enabled/fortuna-web
sudo nginx -t
sudo systemctl reload nginx
```
