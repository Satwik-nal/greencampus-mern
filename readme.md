# Module 5 — MERN track (end to end)

Course: **23CS3AEFWD / 22CS3AEFWD** · BMSCE CSE, 3rd semester  
Stack: **MongoDB · Express · React · Node**

This folder is complete by itself. You do not need the `MEAN/` folder.

Class example: **GreenCampus Reporter**. The React screens from Module 3 now call the Express API from Module 4. MongoDB keeps the rows after refresh.

```text
Browser (React, port 5173)
    →  GET/POST/PUT/DELETE /api/issues
Express (port 3000)
    →  MongoDB greencampus.issues
```

## Files in this folder

| Path | Role |
| --- | --- |
| `greencampus_ddl.js` | Create database + `issues` collection |
| `greencampus_dml.js` | Insert the four seed issues |
| `server/` | Express API (`npm start` → port **3000**) |
| `client/` | React app (`npm run dev` → port **5173**) |

You need **two terminals**: one for the server, one for the client. Stop either with **Ctrl + C**. Use **Terminal** on macOS and **PowerShell** on Windows.

## 1. Node.js

Use **Node.js 22 LTS or newer**. If Module 3 React already runs, skip this.

**macOS (Terminal)**

```bash
node -v
npm -v
```

**Windows (PowerShell)** — open a **new** window after installing:

```powershell
node -v
npm -v
```

Download LTS from [https://nodejs.org/](https://nodejs.org/) if those commands fail (Windows: `.msi`, macOS: `.pkg`).

## 2. MongoDB

MongoDB must be **running** (`mongosh` must connect). If you already completed Module 4 MongoDB, skip the install and only check the service.

**macOS (Homebrew), one command at a time:**

```bash
brew tap mongodb/brew
brew trust mongodb/brew
brew install mongodb-community@8.0
brew services start mongodb/brew/mongodb-community@8.0
mongosh --eval 'db.runCommand({ ping: 1 })'
```

**Windows (PowerShell)** — after the Community MSI from Module 4:

```powershell
Get-Service *mongo*
Start-Service MongoDB
mongosh --eval "db.runCommand({ ping: 1 })"
```

If `Start-Service` fails, Win+R → `services.msc` → **MongoDB Server** → Start. Open a **new** PowerShell if `mongosh` is not found.

If `mongosh` prints `ECONNREFUSED`, the service is not running — start it again.

Full install notes (Windows, Compass, drop data): `Module_4/MongoDB/readme.md`.

## 3. Seed the database

Open a terminal in **this** folder (`Module_5/MERN`).

**macOS**

```bash
cd ~/BMSCE/Full_Stack_Development_3rd_Sem/Module_5/MERN
mongosh --file greencampus_ddl.js
mongosh --file greencampus_dml.js
```

**Windows (PowerShell)**

```powershell
cd $HOME\BMSCE\Full_Stack_Development_3rd_Sem\Module_5\MERN
mongosh --file greencampus_ddl.js
mongosh --file greencampus_dml.js
```

You should see four issues (Library bins, ISE tap, Mechanical corridor, cafeteria step).

If you skip this step, the server will insert the same four documents the first time the collection is empty.

## 4. Start the Express server (terminal 1)

**macOS**

```bash
cd ~/BMSCE/Full_Stack_Development_3rd_Sem/Module_5/MERN/server
cp .env.example .env
npm install
npm start
```

**Windows (PowerShell)**

```powershell
cd $HOME\BMSCE\Full_Stack_Development_3rd_Sem\Module_5\MERN\server
copy .env.example .env
npm install
npm start
```

Leave this window open. You should see `MERN API on http://localhost:3000`.

Check (macOS):

```bash
curl -s http://localhost:3000/api/issues
```

Check (Windows PowerShell — use `curl.exe`, not `curl`):

```powershell
curl.exe -s http://localhost:3000/api/issues
```

## 5. Start the React client (terminal 2)

**macOS**

```bash
cd ~/BMSCE/Full_Stack_Development_3rd_Sem/Module_5/MERN/client
npm install
npm run dev
```

**Windows (PowerShell)**

```powershell
cd $HOME\BMSCE\Full_Stack_Development_3rd_Sem\Module_5\MERN\client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to port 3000 (see `vite.config.js`).

## 6. Walk the app (Experiment 6)

Do this in the browser with the **server still running**.

| Screen | URL | What happens |
| --- | --- | --- |
| Home | `/` | Explains the flow. No API call. |
| Issues | `/issues` | **GET** `/api/issues`. Four seed cards. |
| Issues | Save location | **PUT** `/api/issues/:id` with the location box. Refresh — MongoDB kept it. |
| Issues | Delete | **DELETE** `/api/issues/:id`. The card disappears. Refresh — it stays gone. |
| Report | `/report` | Fill title (≥ 5 letters), category, location. Submit. **POST** `/api/issues`. You land on Issues with the new card. Refresh — still there. |

**Client files to read**

- `client/src/api.js` — `fetch` for GET/POST/PUT/DELETE
- `client/src/pages/Issues.jsx` — `useEffect` loads the list
- `client/src/pages/Report.jsx` — form then POST
- `server/server.js` — Express routes and MongoDB

## HTTP verbs (same API as Module 4)

| Verb | Endpoint | Used by |
| --- | --- | --- |
| GET | `/api/issues` | Issues page |
| GET | `/api/issues/:id` | (curl / later detail views) |
| POST | `/api/issues` | Report page |
| PUT | `/api/issues/:id` | Save location |
| DELETE | `/api/issues/:id` | Delete button |

## Git / GitHub (team copy)

Full steps (GitHub account, first check-in, pull request, merge, command list): [`../github.md`](../github.md)

After the app runs, work from **this** folder only.

**macOS**

```bash
cd ~/BMSCE/Full_Stack_Development_3rd_Sem/Module_5/MERN
```

**Windows (PowerShell)**

```powershell
cd $HOME\BMSCE\Full_Stack_Development_3rd_Sem\Module_5\MERN
```

Do **not** commit `node_modules` or `.env`. Hosting (Render, Railway, Netlify) is optional; localhost is enough for the lab demo.

## If something looks wrong

- **Issues page: “Is the Express server running?”** Terminal 1 is not on `npm start`, or port 3000 is a different sample. Stop extra Node processes (**Ctrl + C**).
- **`ECONNREFUSED 27017` in the server terminal.** Start MongoDB (macOS: `brew services start mongodb/brew/mongodb-community@8.0`. Windows: `Start-Service MongoDB` or Services → **MongoDB Server**).
- **Empty Issues list.** Run DML, or restart the server (it seeds if the collection is empty).
- **POST errors on Report.** Title ≥ 5 characters; category exactly `waste`, `water`, `energy`, or `safety`.
- **Port 5173 or 3000 in use.** Stop the other `npm` window.
- **`curl` looks wrong on Windows.** In PowerShell use `curl.exe`, not `curl`.
- **Need a clean database.** See drop steps in `Module_4/MongoDB/readme.md` (end of file), then re-run DDL + DML here.

## What this track does not include

No Angular, no MySQL, no required cloud host. Repeat the same three screens for **your team problem** (your titles and categories) before Review 3.
