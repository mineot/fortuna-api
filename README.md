# Fortuna

Fortuna is a desktop application powered by **Electron + Angular**, distributed as a **CLI tool via npm**.

It allows you to launch a full desktop UI directly from your terminal.

---

## 🚀 Installation

```bash
npm install -g fortuna
```

---

## ▶️ Usage

```bash
fortuna
```

This will launch the Fortuna desktop application.

---

## 🧠 Architecture

Fortuna is built with a modular architecture:

- **CLI (Node.js)** → Entry point exposed via npm
- **Electron** → Desktop runtime
- **Angular** → User interface

### Flow

```
CLI → Electron → Angular UI
```

---

## 🛠 Development

### Run in development mode

```bash
npm run dev
```

This will:

- Start Angular dev server
- Build the core application
- Launch Electron connected to `http://localhost:4200`

---

### Build for production

```bash
npm run build
```

This will:

- Bundle the core (`tsup`)
- Build Angular UI
- Copy UI output to `dist/`

---

### Run production build

```bash
npm run preview
```

---

## 📦 Distribution

The npm package includes:

- `dist/bundle.js` → Core application
- `dist/fortuna.js` → CLI entry point
- Angular build output (HTML, JS, CSS, assets)

---

## ⚙️ Requirements

- Node.js (latest LTS recommended)
- npm

---

## 📄 License

This project is licensed under the **Apache License 2.0**.
