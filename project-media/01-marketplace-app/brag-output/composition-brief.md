# Hyperframes Composition Brief: Two-Sided Marketplace App

## Objective
Create a short, silent, looping project clip for project 01 on Haris's portfolio. It plays muted inside a framed media slot on a dark, full-screen project panel.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4` (then web encodes for the site)
- Format: landscape 16:9, 1920x1080
- Duration: 12 seconds (user asked for short clips; overrides the 15-25s default)
- Loop: first and last frames are the same empty stage, so the clip loops without a jump

## Source Material
- Project folder: `project-media/01-marketplace-app/`
- Files: `app-screens.png` (contractor home, live session, marketing write-up), `pipeline.png` (build and release pipeline), the client's brief text
- Product: homeowner and contractor marketplace, web app ported to native iOS and Android with a Capacitor shell
- Strongest claim: approved by Apple on the first submission, built and shipped with no Mac anywhere in the pipeline
- Key UI to recreate: Jordan's home screen with the AVAILABLE toggle, the live session chat with the pipe photo, the AI marketing write-up, the release pipeline
- Copy that must appear verbatim:
  - Welcome back, Jordan / AVAILABLE / You're visible to homeowners nearby
  - Alex Reviewer / Plumbing / Kitchen tap drips constantly even when fully closed. / Respond
  - Got it off. It was completely packed.
  - That was the problem. Rinse it, refit hand-tight, run the tap and check for drips.
  - Replacing a Failed Water Heater in Edmond / Published
  - Water Heater Replacement in Edmond | Jordan Pro Plumbing & Repair
  - Compliance pass, Web codebase, Native shell, Windows box, no Mac, Signed bundle, Google Play, Cloud macOS CI build, Auto signing + upload, App Store
  - Approved on first submission

## Creative Direction
- Tone preset: polished, with app-store feature clarity
- Creative direction: quiet premium product film that loops beside a portfolio case study
- Interpretation: one phone on the left that navigates between real screens, enlarged callout cards on the right that carry the readable moment of each scene, then a full-frame pipeline. No hype copy, no voice, no music.
- Angle: show the app doing its job, then show it shipping. The payoff is Apple approving it on the first try from a pipeline with no Mac.
- Hook: the phone rises in and the AVAILABLE toggle flips on with a green glow.
- Outro: the pipeline draws itself, a pulse runs both branches, App Store stamps "Approved on first submission", hold, fade to the empty stage.
- Avoid: generic SaaS language, abstract filler, repeating the panel title ("Shipped to Both Stores") as an overlay, em dashes.

## Visual Identity
- Stage: radial navy #183063 to #0b1830, drifting dot grid, soft green glow
- App surfaces: #f6f7f9 screens, #ffffff cards, #e3e6eb borders, header navy #14213f
- Accent: green #22c55e for non-text accents, #15803d for green text and buttons (contrast)
- Secondary: amber #f5b43b for the compliance gate and the Quoted chip
- Text: #14213f on light, #eef2f8 on the stage
- Font: Inter (local woff2, 400 to 800)

## Storyboard (12.0s)
1. Contractor goes live (0.0-2.8s): phone rises; callout of the AVAILABLE card, tap ripple, toggle flips green; incoming request card arrives in phone and as a callout; Respond is tapped.
2. Live session (2.8-5.4s): phone pushes to the session screen; chat callout; two bubbles and the pipe photo arrive in order and hold.
3. Finished job becomes a page (5.4-8.1s): phone pushes to the marketing screen; a voice note and job photos feed an output card that writes itself: Published chip, title, SEO title, meta, section headings.
4. Release pipeline, no Mac (8.1-12.0s): phone leaves; the pipeline builds node by node; pulses run to Google Play and App Store; Live chip on Google Play; App Store turns green with "Approved on first submission"; hold; fade to the empty stage.

## Audio
- Audio role: intentional silence (muted autoplay inside a portfolio panel)
- Music: none. SFX: none. No audio track, so autoplay is never blocked and the file stays small.

## Hyperframes Instructions
Use hyperframes-core, -animation, -creative, -keyframes and -cli. One paused GSAP timeline at `window.__timelines["main"]`, local GSAP and fonts, no clocks or randomness, finite repeats, background ambient motion sized to loop exactly over 12s. Run `npx hyperframes check` before render.
