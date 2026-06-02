<div align="center">

<img src="https://img.shields.io/badge/ResumeAI-Powered%20by%20Gemini-22c55e?style=for-the-badge&logo=google&logoColor=white" alt="ResumeAI"/>

# 🤖 AI Resume Builder

### *Build job-winning resumes in minutes — powered by Google Gemini AI*

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-4285f4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Akash8311/Ai-Resume?style=flat-square&color=22c55e)](https://github.com/Akash8311/Ai-Resume/stargazers)

<br/>

[**Live Demo**](https://github.com/Akash8311/Ai-Resume) · [**Report Bug**](https://github.com/Akash8311/Ai-Resume/issues) · [**Request Feature**](https://github.com/Akash8311/Ai-Resume/issues)

<br/>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Gemini AI Setup](#-gemini-ai-setup)
- [Firebase Setup](#-firebase-setup)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🌟 Overview

**AI Resume Builder** is a full-stack web application that helps job seekers create, analyze, and optimize professional resumes using Google Gemini AI. It provides real-time ATS (Applicant Tracking System) scoring, AI-powered writing suggestions, 6+ professional templates, and one-click PDF download — all inside a modern, responsive UI.

> Built with ❤️ by **Akash Maity** — BCA Student & Full Stack Developer

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure Login & Signup via Firebase Auth |
| 🤖 **AI Writing** | Gemini 2.0 Flash generates bullet points, summaries & more |
| 📊 **ATS Scoring** | Real-time resume score against Fortune 500 ATS engines |
| 📄 **6+ Templates** | Blue Sidebar, Dark Pro, Minimal, Modern Split & more |
| 📝 **Live Editor** | Edit every section with instant preview |
| 📥 **PDF Export** | Download print-ready PDF in one click |
| 🌙 **Dark / Light Mode** | Toggle between themes seamlessly |
| 📱 **Responsive UI** | Works perfectly on desktop, tablet & mobile |
| 🏆 **Certifications** | Add certifications, achievements, languages |
| 🔍 **Keyword Analysis** | Detect missing ATS keywords & suggest fixes |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.x | UI Framework |
| **Vite** | 5.x | Build Tool & Dev Server |
| **React Router DOM** | 6.x | Client-side Routing |
| **CSS3** | — | Styling & Animations |

### AI Integration
| Technology | Purpose |
|---|---|
| **Google Gemini AI** | AI writing, analysis & suggestions |
| **@google/generative-ai** | Official Gemini SDK |

### Backend / Auth
| Technology | Purpose |
|---|---|
| **Firebase Authentication** | User login, signup, session management |
| **Firebase SDK** | Google Sign-In, Email/Password Auth |

---

## 📁 Project Structure

```
ai-resume-builder/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                  # Images, icons, fonts
│   ├── components/
│   │   ├── home/
│   │   │   └── Home.jsx         # Landing page
│   │   ├── builder/
│   │   │   └── ResumeBuilder.jsx # Resume editor
│   │   ├── auth/
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Signup.jsx       # Signup page
│   │   ├── analyzer/
│   │   │   └── AIAnalyzer.jsx   # AI resume analysis modal
│   │   └── templates/           # Resume template renderers
│   │       ├── BlueSidebar.jsx
│   │       ├── DarkPro.jsx
│   │       ├── MinimalClean.jsx
│   │       ├── ModernSplit.jsx
│   │       ├── GreenSidebar.jsx
│   │       └── RedBold.jsx
│   ├── context/
│   │   └── ThemeContext.jsx     # Dark/Light mode context
│   ├── config/
│   │   ├── firebase.js          # Firebase configuration
│   │   └── gemini.js            # Gemini AI configuration
│   ├── hooks/
│   │   └── useInView.js         # Intersection observer hook
│   ├── App.jsx                  # Root component & routes
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment variable template
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `v18.0.0` or higher
- **npm** `v9.0.0` or higher
- A **Google Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey)
- A **Firebase project** — [Create one here](https://console.firebase.google.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Akash8311/Ai-Resume.git
cd ai-resume-builder
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Then fill in your keys (see [Environment Variables](#-environment-variables)).

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# ─── Google Gemini AI ──────────────────────────────
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# ─── Firebase Configuration ───────────────────────
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore`.

---

## 🤖 Gemini AI Setup

Create `src/config/gemini.js`:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Helper function for resume analysis
export async function analyzeResumeWithAI(resumeText) {
  const prompt = `
    Analyze this resume and provide:
    1. ATS compatibility score (0-100)
    2. Missing keywords for the tech industry
    3. Top 3 improvement suggestions
    4. Overall grade (A+ to C)
    
    Resume content:
    ${resumeText}
    
    Respond in JSON format only.
  `;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## 🔥 Firebase Setup

Create `src/config/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
```

### Enable Authentication Methods in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Authentication** → **Sign-in method**
3. Enable **Email/Password**
4. Enable **Google** (for Google Sign-In)

---

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build & deploy
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login & initialize
firebase login
firebase init hosting

# Build & deploy
npm run build
firebase deploy
```

> 📌 **Remember** to add all your `.env` variables to your hosting platform's environment settings before deploying.

---

## 📸 Screenshots

> *Add screenshots of your running application here.*

| Page | Preview |
|---|---|
| 🏠 Home / Landing Page | *Add screenshot* |
| 📝 Resume Builder | *Add screenshot* |
| 🤖 AI Analyzer | *Add screenshot* |
| 📊 ATS Score Dashboard | *Add screenshot* |
| 🔐 Login / Signup | *Add screenshot* |

---

## 🗺️ Roadmap

- [x] User authentication (Email + Google)
- [x] 6 professional resume templates
- [x] AI-powered resume analysis
- [x] ATS score evaluation
- [x] PDF export
- [x] Dark / Light mode
- [ ] Cover letter generator
- [ ] LinkedIn profile import
- [ ] Multi-language support
- [ ] Resume version history
- [ ] Job description matching
- [ ] Collaborative editing

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add: AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

Please make sure to update tests as appropriate and follow the existing code style.

---

## 🐛 Issues & Support

Found a bug or need help?

- Open an [issue on GitHub](https://github.com/Akash8311/Ai-Resume/issues)
- Make sure to include steps to reproduce and your environment details

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Copyright (c) 2026 Akash Maity
Permission is hereby granted, free of charge, to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software.
```

---

## 👨‍💻 Author

<div align="center">

**Akash Maity**

*BCA Student · Full Stack Developer · AI Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-Akash8311-181717?style=flat-square&logo=github)](https://github.com/Akash8311)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/akash-maity)

</div>

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub — it means a lot!**

Made with ❤️ and ☕ by Akash Maity

</div>