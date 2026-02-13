# Make My Girl Accept Me — Design

**Date:** 2026-02-13
**Status:** Validated
**Project:** `make_my_girl_accept_me`

## Objective

Build an interactive Valentine's Day invitation card for Catalina, themed as a **Shark Tank pitch**. David is the startup founder pitching a "lifetime partnership." Catalina is the lead shark / investor. The experience is a multi-screen pitch presentation with a live dashboard, countdown deal timer, and a romantic grand finale. It must be funny, business-oriented, and impossible to say no to.

## Architecture / Approach

**Stack:** React + Vite + CSS animations + Canvas (for fireworks)
**Approach:** Multi-Screen Pitch Experience (5 screens with animated transitions)

### Screen Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   SPLASH    │────▶│   PITCH     │────▶│  DASHBOARD  │────▶│  COUNTDOWN  │────▶│   FINALE    │
│             │     │             │     │             │     │             │     │             │
│ "Welcome to │     │ David's     │     │ Live Love   │     │ "Deal       │     │ Heart       │
│  Shark Tank │     │ Startup     │     │ Metrics     │     │  closes     │     │ fireworks,  │
│  Valentine  │     │ Pitch       │     │ Dashboard   │     │  in..."     │     │ roses,      │
│  Edition"   │     │             │     │             │     │             │     │ contract    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Specifications

### Screen 1: Splash Screen
- Dark cinematic background with spotlight animation
- Shark Tank-style Valentine's Edition logo
- Text: "Tonight's Featured Shark: **Catalina**"
- "Enter the Tank" button with golden glow pulse
- Dramatic feel — sets the tone

### Screen 2: The Pitch
- Split layout: David's "founder profile" card (left) + pitch content (right)
- Typewriter effect reveals pitch text: "I'm seeking a lifetime investment from the most important shark in the room..."
- Animated stats overlay: "Years Together", "Laughs Shared", "Adventures Had"
- Business-style bullet points: "Why This Is a Once-in-a-Lifetime Investment Opportunity"
- "Next Slide" button to proceed

### Screen 3: Live Dashboard
- Grid of animated metric cards
- **Circular gauges** (CSS conic-gradient): Compatibility Score (99.9%), Love Level (∞)
- **Bar charts** (CSS animations): Happiness Index, Adventure Score, Inside Jokes
- **Scrolling ticker** at bottom: "LOVE FUTURES UP 500%", "CUTENESS INDEX AT ALL-TIME HIGH", "HUG STOCKS SOARING"
- All numbers count up on screen mount
- "See the Deal" button to proceed

### Screen 4: The Deal Countdown
- Large countdown timer starting from 10 seconds
- Background transitions: cool blue → warm red as timer decreases
- Text: "Catalina, the question is simple... Will you accept this deal?"
- **"DEAL!" button**: Large, golden, pulsing glow — the clear CTA
- **"No Deal" button**: Tiny, uses `onMouseEnter` to randomly reposition — literally uncatchable
- After countdown reaches 0, "DEAL!" button gets even bigger and more dramatic

### Screen 5: The Finale
- Triggered by clicking "DEAL!"
- **Heart-shaped fireworks**: Canvas-based particle system shooting heart shapes
- **Floating rose petals**: CSS animated elements drifting across screen
- **Love Contract card**: "Partnership Agreement — Catalina & David — Partners for Life — Effective: February 14, 2026"
- Full-screen celebration with warm pink/gold gradient background
- Optional: background music / sound effects

### Animation Strategy
- Pure CSS animations (keyframes) for: typewriter text, gauge fills, bar chart growth, floating elements, pulsing buttons, color transitions
- Canvas API for heart-shaped fireworks particle system
- `setInterval` + React state for countdown timer
- CSS transitions for screen-to-screen navigation (fade/slide)

### Styling
- **Theme progression**: Dark (Shark Tank studio) → warm reds/pinks (romance)
- **Accent colors**: Gold for buttons and highlights
- **Typography**: Corporate serif for headers (e.g., Playfair Display), handwritten font for love contract (e.g., Dancing Script)
- **Responsive**: Works on mobile (she'll probably open it on her phone)

## Implementation Order

1. Project scaffold — `npm create vite@latest make_my_girl_accept_me -- --template react`
2. App shell & screen navigation — Screen state machine, transition animations
3. SplashScreen — Shark Tank branding, spotlight, entry button
4. PitchScreen — Founder card, typewriter text, stats overlay
5. DashboardScreen — Metric gauges, bar charts, scrolling ticker
6. CountdownScreen — Timer, color transitions, dodging "No Deal" button
7. FinaleScreen — Heart fireworks (canvas), floating roses, love contract
8. Polish — Responsive tweaks, final transitions

## Success Criteria

- [ ] All 5 screens render and transition smoothly
- [ ] Dashboard gauges and charts animate on screen entry
- [ ] Countdown timer works and builds urgency (color shift)
- [ ] "No Deal" button dodges the cursor (funny moment)
- [ ] "DEAL!" triggers full romantic finale with fireworks
- [ ] Love contract shows "Catalina & David" with correct date
- [ ] Works on mobile (responsive)
- [ ] Catalina says YES
