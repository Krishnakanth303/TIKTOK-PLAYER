# TikTok Player — Kamao.ai React Intern Assessment

A TikTok-style vertical video player built with React 18 + Vite.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📁 Add Your Videos

Place 5 video files inside `public/videos/`:
```
public/
  videos/
    sample1.mp4
    sample2.mp4
    sample3.mp4
    sample4.mp4
    sample5.mp4
```

## ✅ Features

### Core
- Vertical scroll-snap feed (5 videos)
- Auto-play/pause via IntersectionObserver
- Tap to play/pause with animated icon overlay
- Progress bar at bottom of each video
- Like ❤️, Comment 💬, Bookmark 🔖, Share ↗️
- Spinning music disc
- Mute / unmute button (🔊)
- Background music track per video (Pixabay CDN)

### Bonus
- Double-tap anywhere → floating heart animation
- Follow / Following toggle on avatar
- Long-press to pause, release to resume
- Loading skeleton shimmer
- Dark / light mode toggle
- Keyboard Arrow Up/Down navigation
- Desktop phone-frame layout

## 🛠 Tech Stack

| Tool | Reason |
|------|--------|
| React 18 + Vite | Fast dev server, modern React |
| CSS Modules | Scoped styles, zero runtime cost |
| Native `<video>` | Required by spec |
| IntersectionObserver | Efficient viewport detection |
| scroll-snap-type | Native smooth snapping |

## ⚠️ Known Limitations

- Videos start muted for autoplay (browser policy). Click 🔊 to hear music.
- Background music streams from Pixabay CDN — requires internet.
- Comment button shows count but no modal (out of scope).
- Counts reset on page refresh (no backend).
