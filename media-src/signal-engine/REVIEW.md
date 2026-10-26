# Review: signal-engine (20.6 s, 1920x1080 @ 60, silent loop)

## Creative calls
- Story: case study 2 told as cause and effect in 5 beats (watch, trigger held, checked twice, pipeline fills, ranked and unattended). Every on-screen line is verbatim from the case study's story paragraphs and none is used elsewhere on index.html.
- Look: light product UI in the site's palette (ground #f3f6f4, ink #111a17, accent #0e7a55, ok #38c97a, alert #d4542f), Geist 700. The user rejected the dark charcoal/neon mockup.
- Not built: photo (idea A) and system map (idea C) from mockups/home/media-ideas.

## Measured
- `check`: 0 errors. Kept on purpose: `film_silent` (the site autoplays muted, sound is never heard) and `timeline_track_too_dense` (one titles track holding six lines, by design).
- Review sheets and QA frames 0, 0.3, 2, 5.2, 9, 12.6, 17.2, 19.4, 20.55 looked at; 20.55 matches frame 0 (loop seam). Phone sheet: every line readable at 360 px.
- Fixed after review: unscanned listings showed "seen" dots from frame 0 (P0); close-up pushed 2.4x -> 3.2x and the confirm track, gates and rep enlarged (P1).
- On the site: plays in the 558 px desktop slot and 342 px phone slot, CLS 0.0001, no overflow.

## Weakest shot
- Was the opening wall (24 small cards read as texture in the 558 px slot). Fixed 2026-10-26 at the user's request ("make the listing etc bigger"): listings drawn 1.7x (316 x 238), 5 across with the wall cropped at every edge, camera push 1.8824x so the hand-off card is still 3.2x; confirm card 1.8x, gates 104 px, rep 230 px; pipeline rows 880 x 96 (6 rows). Pre-change scenes saved in the session scratchpad (signal-engine-before-bigger/).
- Now: the count beat (12.6 s) has the most empty space on the right under the 51.

## Files
- Master: renders/signal-engine-1080p60.mp4. Web: public/media/signal-engine/{clip.mp4, clip.webm, poster.webp} via `bash encode-web.sh [poster-second]`.
