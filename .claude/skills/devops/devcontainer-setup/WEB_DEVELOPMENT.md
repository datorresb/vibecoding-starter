# Web Development in DevContainer

When developing web applications (Vite, React, Vue, Next.js, etc.) inside a devcontainer, there are common networking issues to be aware of.

---

## The Problem

Dev servers (Vite, Webpack, etc.) bind to `127.0.0.1` by default. This means the server is only accessible **inside** the container. When you try to access `localhost:5173` from your host browser, you get a blank page or connection refused.

---

## Solutions

### 1. Bind to All Interfaces (Recommended)

**For Vite projects, add `--host` to package.json:**

```json
{
  "scripts": {
    "dev": "vite --host",
    "preview": "vite preview --host"
  }
}
```

**Or configure in vite.config.ts:**

```typescript
export default defineConfig({
  server: {
    host: true  // Binds to 0.0.0.0
  }
})
```

### 2. Add Port Forwarding to devcontainer.json

If the project needs web development, add to `devcontainer.json`:

```jsonc
{
  "forwardPorts": [3000, 5173, 8080],
  "portsAttributes": {
    "3000": { "label": "App", "onAutoForward": "notify" },
    "5173": { "label": "Vite", "onAutoForward": "notify" },
    "8080": { "label": "Backend", "onAutoForward": "notify" }
  }
}
```

**Note:** Ports are automatically forwarded when something listens on them. The `forwardPorts` array just pre-configures the labels and behavior.

---

## Common Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Blank page in browser | Server bound to 127.0.0.1 | Add `--host` flag to dev script |
| "Port in use" errors | Multiple server instances | `pkill -f vite` then restart |
| VS Code Simple Browser empty | HMR/WebSocket issues | Use external browser or build + serve |
| Connection refused | Port not forwarded | Check PORTS panel in VS Code |

---

## Testing Connectivity

From inside the container terminal:

```bash
# Check if server is running
curl -s http://localhost:5173/ | head -5

# Check what's listening
lsof -i :5173
```

If curl works inside but browser doesn't, the issue is port forwarding or the `--host` flag.

---

## Framework-Specific Notes

### Vite / React / Vue
```json
"dev": "vite --host"
```

### Next.js
```json
"dev": "next dev -H 0.0.0.0"
```

### Create React App
```json
"start": "HOST=0.0.0.0 react-scripts start"
```

### Python (Flask/FastAPI)
```bash
flask run --host=0.0.0.0
uvicorn main:app --host 0.0.0.0
```
