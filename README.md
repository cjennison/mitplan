# Mitplan - FFXIV Mitigation Planning Overlay

A FFXIV ACT overlay that helps raid teams coordinate their mitigation abilities. Mitplan displays personalized ability callouts based on a shared mitigation plan, showing each player exactly when to use their assigned defensive cooldowns.

## How It Works

1. **Raid Leader** creates a mitigation plan and encodes it as a Base64 string
2. **Team Members** paste the Base64 string into the Mitplan overlay
3. **During Combat**, Mitplan displays countdown alerts for each player's assigned abilities
   - 📋 **15-second warning**: Small notification card appears
   - 🚨 **3-second warning**: Large, prominent alert demands attention

## Quick Start (Development)

### Prerequisites

- [Node.js](https://nodejs.org/) 20.x or higher
- [ACT (Advanced Combat Tracker)](https://advancedcombattracker.com/)
- [OverlayPlugin](https://github.com/OverlayPlugin/OverlayPlugin) for ACT
- (Optional) [Cactbot](https://github.com/quisquous/cactbot) - not required, but Mitplan uses similar APIs

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/mitplan.git
cd mitplan
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

This starts a local Vite development server, typically at:

```
http://localhost:5173
```

> **Note**: Vite may use a different port if 5173 is busy. Check the terminal output for the actual URL.

### 3. Configure ACT OverlayPlugin

To test Mitplan in ACT, you need to create an overlay that points to your local dev server.

#### Step-by-Step: Creating a Mitplan Overlay

1. **Open ACT** and go to the **Plugins** tab
2. Click on **OverlayPlugin.dll** in the plugin list
3. In the OverlayPlugin panel, click **New** to create a new overlay
4. Configure the new overlay:

   | Setting    | Value                                  |
   | ---------- | -------------------------------------- |
   | **Name**   | `Mitplan`                              |
   | **Preset** | `Custom`                               |
   | **Type**   | `MiniParse` (or `Custom` if available) |

5. Click **OK** to create the overlay
6. In the overlay settings, find the **URL** field and enter:

   ```
   http://localhost:5173
   ```

7. Adjust overlay settings as needed:
   - **Enable clickthrough**: Recommended during fights
   - **Lock overlay**: Enable after positioning
   - **Size**: Start with 400x200, adjust as needed

8. Position the overlay where you want it on your screen

#### Troubleshooting Overlay Setup

| Issue                     | Solution                                                          |
| ------------------------- | ----------------------------------------------------------------- |
| Overlay shows blank/white | Check that dev server is running (`npm run dev`)                  |
| "Failed to load" error    | Ensure URL is exactly `http://localhost:5173` (no trailing slash) |
| Overlay not appearing     | Check ACT's overlay list, ensure it's enabled                     |
| Console errors in overlay | Open overlay DevTools: right-click overlay → Inspect              |

### 4. Test the Overlay

Once connected, you should see the Mitplan interface. Use the **Developer Console** (if visible) to:

- Start/stop the fight timer manually
- Load a sample mitigation plan
- Simulate different jobs

## Project Structure

```
mitplan/
├── docs/
│   └── PROJECT.md          # Detailed project documentation
├── src/
│   ├── components/         # React components
│   │   ├── alerts/         # Alert display components
│   │   ├── plan/           # Plan input/validation
│   │   └── dev/            # Developer console
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── data/               # Static data (jobs, abilities)
│   ├── context/            # React context providers
│   ├── styles/             # CSS modules
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.html          # HTML template
├── .github/
│   └── copilot-instructions.md  # AI agent guidelines
├── package.json
├── vite.config.js
└── README.md
```

## Usage

### Loading a Mitigation Plan

1. Obtain a Base64-encoded mitigation plan string from your raid leader
2. Paste it into the Mitplan input field
3. The plan is validated and loaded
4. Your job's abilities are filtered and displayed

### During a Fight

- **Timer starts automatically** when combat begins (in ACT)
- **Dev mode**: Use the developer console to start the timer manually
- **Alerts appear** at configured thresholds (15s and 3s by default)
- **Timer resets** when combat ends or you wipe

### Sample Plan (For Testing)

Here's a sample Base64-encoded plan you can use for testing:

```
eyJ2ZXJzaW9uIjoiMS4wIiwiZmlnaHROYW1lIjoiVGVzdCBGaWdodCIsInRpbWVsaW5lIjpbeyJ0aW1lc3RhbXAiOjEwLCJqb2IiOiJXQVIiLCJhYmlsaXR5IjoiU2hha2UgSXQgT2ZmIiwibm90ZSI6IlRlc3QgYWxlcnQifSx7InRpbWVzdGFtcCI6MjAsImpvYiI6IkRSSyIsImFiaWxpdHkiOiJUaGUgQmxhY2tlc3QgTmlnaHQifSx7InRpbWVzdGFtcCI6MzAsImpvYiI6IldBUiIsImFiaWxpdHkiOiJSZXByaXNhbCJ9XX0=
```

<details>
<summary>Decoded plan (for reference)</summary>

```json
{
  "version": "1.0",
  "fightName": "Test Fight",
  "timeline": [
    {
      "timestamp": 10,
      "job": "WAR",
      "ability": "Shake It Off",
      "note": "Test alert"
    },
    { "timestamp": 20, "job": "DRK", "ability": "The Blackest Night" },
    { "timestamp": 30, "job": "WAR", "ability": "Reprisal" }
  ]
}
```

</details>

## Development

### Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint                               |
| `npm run format`  | Format code with Prettier                |

### Code Quality

This project uses:

- **ESLint 9+** for static analysis
- **Prettier 4+** for code formatting
- **ES2026** JavaScript standards
- **React 19+** with functional components and hooks
- **Radix UI Primitives** for accessible interactive components
- **CSS Modules** for FFXIV-styled component styling

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed coding guidelines.

### UI Architecture

| Component Type                     | Approach               |
| ---------------------------------- | ---------------------- |
| **Display-only** (alerts, timers)  | Pure CSS Modules       |
| **Interactive** (modals, tooltips) | Radix UI + CSS Modules |

### ACT/Cactbot APIs

Mitplan integrates with OverlayPlugin using these event listeners:

```javascript
// Detect combat start/end
addOverlayListener("onInCombatChangedEvent", (e) => {
  if (e.detail.inGameCombat) {
    // Fight started
  }
});

// Get player's current job
addOverlayListener("onPlayerChangedEvent", (e) => {
  const job = e.detail.job; // "WAR", "DRK", etc.
});
```

## Deployment (Production)

Mitplan is deployed to Vercel. Users point their OverlayPlugin to the production URL:

```
https://mitplan.vercel.app
```

### Deploying Updates

```bash
# Install Vercel CLI (first time only)
npm install -g vercel

# Deploy to production
vercel --prod
```

## Contributing

1. Read the [project documentation](docs/PROJECT.md)
2. Follow the [copilot instructions](.github/copilot-instructions.md)
3. Write code that passes ESLint without errors
4. Format with Prettier before committing

## License

MIT

## Acknowledgments

- [Cactbot](https://github.com/quisquous/cactbot) - Inspiration and overlay architecture
- [OverlayPlugin](https://github.com/OverlayPlugin/OverlayPlugin) - ACT overlay framework
- FFXIV raiding community
