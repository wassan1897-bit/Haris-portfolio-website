# UI improvements: mockups

Each mockup is the live page, captured at 1440x900, with the idea layered on top as a prototype (`src/mock-ui.css`, `src/mock-ui.js`). Nothing in the site has changed yet. `00-current-room.png` and `00-current-connect.png` show the page as it is now, for comparison.

All of these are HTML and CSS over the 3D canvas. They animate with transform and opacity only, and they sit in fixed or absolute boxes, so they cause no layout shift.

| File | Idea | What it adds |
|---|---|---|
| `01-project-rail.png` | **Project rail** | A frosted filmstrip of all 12 cards replaces the bare arrows. The current card is lifted and lit. You can see every project and jump straight to one; the arrows and the count stay at the ends. |
| `02-hover-plaque-cursor.png` | **Hover plaque and "Open" cursor** | Hovering a card shows a small plaque under it: tool logo, name, one proven number and "Click to open". The cursor becomes a warm ring that says "Open". The site's black dot cursor is invisible on the dark room. |
| `03-case-file-panel.png` | **Case-file detail panel** | The opened project reads like a case file on frosted glass. The headline result comes first and large, the tools show their logos, and Previous and Next show the neighbouring cards. |
| `04-section-index-intro.png` | **Section index and a richer intro** | A quiet "01 Intro / 02 Work / 03 Connect" index on the right edge shows where you are. The intro gains an eyebrow and three proof chips (12 systems live, 6,700+ conversations, 5 platforms). |
| `05-light-switch-plate.png` | **Wall-switch Day/Night control** | The Day/Night pill becomes a cream wall switch plate with a rocker, beside the visitor's own time, so it belongs to the room instead of floating over it. |
| `06-connect-refined.png` | **Connect in the same voice** | The last section uses the same type as the hero and the room, with a real portrait and an availability dot instead of mostly empty photo tiles. The stat card shows the hero's proven numbers in place of the "10+" counter, which was caught mid-roll. The two em dashes in the copy are removed. |
