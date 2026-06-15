# Priyanshu ❤️ Prachi — Love Story Website

## Folder Structure

```
love-story/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── crystalHeart.js    — Crystal heart background (entire website)
│   ├── stars.js           — Stars + ambient particles
│   ├── nameParticles.js   — Section 2: Name meaning particles
│   ├── photoParticle.js   — Section 3: Photo particle reveal
│   ├── butterfly.js       — Section 4: Butterfly memories
│   ├── space.js           — Section 5: Moon & Earth orbit
│   ├── hearts.js          — Section 6: Love You hearts burst
│   ├── map.js             — Section 8: India map animation
│   ├── flowers.js         — Section 9: Flower finale
│   └── main.js            — Main controller (audio, scroll, messages)
├── images/
│   ├── prachi.jpg         ← ADD THIS (Section 3 & 4)
│   └── prachi1.jpg        ← ADD THIS (Grand Finale)
└── audio/
    ├── finding-her.mp3    ← ADD THIS
    └── perfect.mp3        ← ADD THIS
```

---

## Setup Steps

### 1. Add Images
- Place `prachi.jpg` in the `images/` folder (used in particle reveal & butterfly section)
- Place `prachi1.jpg` in the `images/` folder (used in grand finale)

### 2. Add Audio
- Create an `audio/` folder
- Place `finding-her.mp3` and `perfect.mp3` inside it

### 3. Setup Email (EmailJS — Free)

To enable the message feature:

1. Go to https://www.emailjs.com and create a free account
2. Create an Email Service (connect your Gmail)
3. Create an Email Template with these variables:
   - `{{to_email}}` — recipient
   - `{{subject}}` — email subject
   - `{{date_time}}` — date and time
   - `{{message}}` — message content
4. Open `js/main.js` and replace:
   - `'YOUR_EMAILJS_PUBLIC_KEY'` → your EmailJS public key
   - `'YOUR_SERVICE_ID'` → your service ID (e.g., `service_abc123`)
   - `'YOUR_TEMPLATE_ID'` → your template ID (e.g., `template_xyz789`)

**Without EmailJS configured**, the send button will open the user's email app (mailto fallback) — still works!

---

## How to Open

Simply open `index.html` in any modern browser.

For best experience, use Chrome or Firefox.

---

## Sections

| Section | Description |
|---------|-------------|
| 1 | Opening — Stars, title, scroll indicator |
| 2 | Name Meaning — Scroll-reveal poetry |
| 3 | Particle Photo Reveal — Photo builds from particles |
| 4 | Butterfly Memories — Photo with flying butterflies (click to release!) |
| 5 | Moon & Earth — 3D orbit animation |
| 6 | Love You — Heart burst interaction |
| 7 | Message for Priyanshu — Email form |
| 8 | Long Distance Map — India SVG animation with path |
| 9 | Grand Finale — Flowers + photo reveal |

---

## Crystal Heart Background

The crystal heart lives in the background from start to finish.
- **Start**: Broken, barely visible (10–15% opacity)
- **Middle**: Gradually healing as you scroll
- **End**: Fully repaired, glowing, sparkling ✨

---

Made with ❤️ for Priyanshu & Prachi
