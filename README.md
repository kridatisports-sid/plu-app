# 🐾 PawPrint Registry — Android App

Pet nose-print biometric identification, registration & tracking app built with React + Capacitor.

---

## How to get your APK (no local Android Studio needed)

### Step 1 — Get the code onto GitHub

```bash
# Option A: Clone this repo and push to your own GitHub account
git clone <this-repo-url>
cd pawprint-registry
git remote set-url origin https://github.com/YOUR_USERNAME/pawprint-registry.git
git push -u origin main

# Option B: Create new repo on GitHub, then push
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pawprint-registry.git
git push -u origin main
```

---

### Step 2 — Add the Android platform (one-time, do locally OR via Actions)

If you have Node.js installed locally:

```bash
npm install
npx cap add android
git add android/
git commit -m "Add Android platform"
git push
```

If you do NOT have Node.js locally, see the bootstrap workflow below.

---

### Step 3 — Push to trigger the build

```bash
# Any push to main triggers the build automatically
git push origin main

# Or trigger manually:
# GitHub → your repo → Actions tab → Build PawPrint Android APK → Run workflow
```

---

### Step 4 — Download your APK

1. Go to your GitHub repo
2. Click **Actions** tab
3. Click the latest **Build PawPrint Android APK** run
4. Scroll to **Artifacts** at the bottom
5. Click **pawprint-debug-apk** to download
6. Unzip → install `app-debug.apk` on your Android device

> **Enable installation:** On Android, go to Settings → Security → Install unknown apps → allow your file manager

---

## Get a signed Release APK (for distribution)

### One-time keystore setup

You need Java installed for this step only:

```bash
# Make the script executable
chmod +x scripts/generate-keystore.sh

# Run it — follow the prompts
./scripts/generate-keystore.sh
```

This outputs 4 values. Add them as GitHub Secrets:

```
GitHub repo → Settings → Secrets and variables → Actions → New repository secret
```

| Secret Name        | Value                              |
|--------------------|------------------------------------|
| `KEYSTORE_BASE64`  | (long base64 string from script)   |
| `KEYSTORE_PASSWORD`| your keystore password             |
| `KEY_ALIAS`        | `pawprint-key`                     |
| `KEY_PASSWORD`     | your key password                  |

Once secrets are added, every push automatically builds **both** debug and signed release APKs.

---

## Project structure

```
pawprint-registry/
├── .github/
│   └── workflows/
│       └── build-apk.yml        ← GitHub Actions CI/CD
├── src/
│   ├── App.jsx                  ← Main app (PetNoseApp)
│   ├── main.jsx                 ← Entry point + Capacitor init
│   └── utils/
│       ├── camera.js            ← Native camera wrapper
│       └── db.js                ← Device-local database
├── android/                     ← Generated Android project
├── scripts/
│   └── generate-keystore.sh    ← Signing key generator
├── capacitor.config.ts          ← Capacitor configuration
├── vite.config.js               ← Vite build config
├── package.json
└── index.html
```

---

## Local development

```bash
npm install           # install dependencies
npm run dev           # run in browser at localhost:3000
npm run build         # build for production
npx cap sync android  # sync to Android project
npx cap open android  # open Android Studio
```

---

## Tech stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| UI          | React 18 + inline styles      |
| Build       | Vite 5                        |
| Native      | Capacitor 6                   |
| Camera      | @capacitor/camera             |
| Storage     | @capacitor/preferences        |
| Location    | @capacitor/geolocation        |
| CI/CD       | GitHub Actions                |
| Target      | Android 6.0+ (API 23+)        |

---

## Permissions required

| Permission           | Used for                          |
|----------------------|-----------------------------------|
| `CAMERA`             | Nose print scanning               |
| `ACCESS_FINE_LOCATION` | Last-seen location tracking     |
| `WRITE_EXTERNAL_STORAGE` | Saving nose print images      |
| `INTERNET`           | Future cloud sync                 |
| `VIBRATE`            | Haptic feedback on scan complete  |
