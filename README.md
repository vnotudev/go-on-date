# Go On Date 💕 - Web Application

A modern, interactive date invitation and planning web application with evasive "No Refuse" playful button physics, celebration confetti, and Telegram summary sharing.

---

## 📁 Project Structure

This project follows a clean, modular, and dependency-light architecture for small front-end web applications:

```text
go-on-date-project/
├── index.html              # Clean semantic HTML entry point
├── css/
│   └── style.css           # Custom styling, animations, and glassmorphism variables
├── js/
│   ├── config.js           # Configuration (date activities, schedules, dodge messages)
│   ├── particles.js        # Canvas particle animation engine (floating hearts/sparkles)
│   └── app.js              # State management, UI controller, and evasive interaction logic
├── assets/
│   └── favicon.svg         # Application icon and vector assets
├── .gitignore              # Standard git exclusion rules
└── README.md               # Project documentation and guide
```

---

## ✨ Features

- **Interactive Date Planner (Step 1)**: Select date vibe (Coffee, Dinner, Arcade, Sunset stroll) and schedule preferences.
- **Playful Evasive "No" Button (Step 2)**:
  - Dodges cursor/taps with dynamic bounding-box logic.
  - Scales up the "YES" button with each dodge attempt.
  - Displays cheeky responses before eventually surrendering to "YES".
- **Celebration & Sharing (Step 3)**:
  - Multi-stage confetti blast via Canvas Confetti.
  - Formatted plan summary.
  - One-click Telegram message to the organizer (`t.me`), set via `telegramUsername` in `js/config.js`.
  - One-click clipboard copy.
- **Floating Particles**: Lightweight canvas animation with floating hearts and sparkles.
- **Zero-Build Setup**: Runs directly in any web browser without Node.js, Webpack, or backend servers.

---

## 🚀 Getting Started

### Option 1: Direct File (Simplest)
Double-click `index.html` or open it directly in Google Chrome, Safari, Firefox, or Microsoft Edge.

### Option 2: Local HTTP Server (Recommended)
You can run a lightweight local server:

Using Python:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

Using Node.js:
```bash
npx serve .
```

---

## ⚙️ Customization

All date options, messages, and thresholds can be modified in [`js/config.js`](js/config.js):

- **Change Date Activities**: Edit `Config.vibeOptions`.
- **Change Times/Schedules**: Edit `Config.timeOptions`.
- **Adjust Dodge Difficulty**: Modify `Config.maxDodges` and `Config.dodgeMessages`.
