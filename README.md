# Boxing Arena 🥊

A cinematic boxing-themed website built with React, Vite, and Tailwind CSS. The project features a dark visual identity, bold typography, and a scroll-controlled image sequence designed to create an immersive browsing experience.

## ✨ Features

- **Cinematic Hero Section** — A bold, boxing-inspired landing page.
- **Scroll-Linked Animation** — A sequence of 40 image frames controlled by scrolling.
- **Canvas Rendering** — Frame rendering optimized for a smooth animation experience.
- **Responsive Design** — Layout designed to adapt to different screen sizes.
- **Interactive Navigation** — Navigation links for About, Fighters, Events, Rankings, and Community.
- **Modern UI** — Dark visual styling, strong typography, and carefully designed interface elements.

## 🛠️ Tech Stack

- **React** — Component-based user interface.
- **Vite** — Development server and build tooling.
- **JavaScript** — Application logic and interactions.
- **Tailwind CSS v3** — Styling and layout.
- **HTML5 Canvas** — Scroll-controlled image sequence rendering.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   ```

2. Navigate to the project directory:

   ```bash
   cd Project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## 🏗️ Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```text
Project/
├── public/
│   └── Frames/
│       ├── ezgif-frame-001.png
│       ├── ...
│       └── ezgif-frame-040.png
├── src/
│   ├── components/
│   │   └── Hero/
│   │       └── Hero.jsx
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```

*Note: The structure above highlights the main files and animation assets. Other project files may be present.*

## 🎞️ Scroll Animation

The Hero section uses 40 sequential PNG images to create a cinematic animation.

As the user scrolls through the animation section, the displayed frame progresses through the sequence. Scrolling upward reverses the animation.

The implementation uses HTML5 Canvas and a sticky viewport stage to keep the visual experience in place while scroll progress controls the animation.

## 🗺️ Future Development

Planned improvements include:

- User authentication and authorization.
- Backend API integration.
- Database integration.
- Dynamic fighter, event, and ranking data.
- Additional interactive features.

These features are planned for future development and are not claimed as implemented in the current version.

## 📌 Project Status

**Current stage:** Frontend implementation.

The interface and scroll-controlled Hero animation are implemented. Authentication and backend functionality are planned for a future development phase.

## 📄 License

No license has been specified yet. All rights remain with their respective owners unless a license is added to this repository.
