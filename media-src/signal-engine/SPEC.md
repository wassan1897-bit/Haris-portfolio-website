GOAL:    a revenue leader watching a muted loop understands, without help, that this system finds a buyer at the
         right moment, checks it twice, and hands sales a ranked list while nobody watches it.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps; web encodes 1280 x 720 (desktop slot ~528 px, phones ~342 px wide)
TIME:    20.6 s x 30 = 618 frames; seamless loop (last frame = frame 0: the wall, scan at the left, no title)
LOOK:    the medium is product UI on a light desk: ground #f3f6f4 flat, no texture, no vignette;
         cards white #ffffff, 2 px border #dbe3df, radius 16, shadow 0 10 24 -14 rgba(17,26,23,.22);
         ink #111a17 for every word; accent #0e7a55 for one phrase per line, the score bars and the count;
         ok #38c97a only for "seen" dots, passed gates and confirmed states; alert #d4542f only for the trigger;
         rating stars #e8b23a (the listing's own colour), dropped stars #d9dfdc.
         Display: Geist 700, titles 68 px, line-height 1.1, tracking -2.5%, two lines max, left-aligned at
         x 192 y 112 (title-safe box); count 320 px Geist 700 tabular; rank digits Geist 700 34 px.
OBJECTS: a business listing card (photo square, name bar, address bar with a map pin, five gold stars) that reads as
         a listing without words; a scanner line with a pale band behind it; an alert badge with "!" that turns
         into a pause sign (held, no alarm); two check gates on a track; a sales rep (avatar with head and
         shoulders); pipeline rows with a check and a score bar; rank digits.
MOTION:  arrivals expo.out / power4.out; camera and layout moves power2.inOut / power3.inOut; exits power3.in,
         40-50% shorter than entrances; scan and sweeps linear (constant speed is the point); no springs, no bounce.
         Word stagger 0.067 s; list stagger 0.05-0.09 s; title blur 6-8 px.
SHOTS:   0.00-3.75  wall of 24 listings, scanner sweeps left to right, each scanned card gets a green dot;
                    reads "A monitor that watches 38,548 business listings around the clock." (0.25-3.75)
         3.75-7.40  the scanner stops on one card: stars drop, border and badge turn alert; camera pushes in 2.4x
                    (4.05-5.05) while the others blur away; badge "!" becomes a pause sign at 5.6;
                    reads "When it spots the trigger, it doesn't raise the alarm." (3.80-7.30)
         7.40-10.80 the same card shrinks onto a track, passes gate 1 (tick 8.9) and gate 2 (tick 9.6), reaches
                    the rep at 10.3 and turns green; reads "Nothing reaches a rep that hasn't been confirmed
                    twice." (7.40-10.60)
         10.80-14.6 carry across: the card shrinks into row 1 of a pipeline, six more rows drop in, the count
                    runs 0 to 51; reads "The engine produced a 51-lead pipeline in its first four days" (10.7-14.5)
         14.6-17.9  count leaves, the list slides to centre, score bars fill, rows sort, rank digits land;
                    reads "Sales now works a ranked list of real opportunities," (14.6-17.8)
         17.9-20.6  a scanner sweeps the ranked list on its own; reads "and the whole system runs unattended."
                    (17.9-20.2); the list blurs out and the wall returns for the loop (20.2-20.6)
BANNED:  dark or navy void; glow, bloom, neon, particles; purple or blue gradients, glass cards; cream paper with a
         serif, mono caps labels, numbered 01/02 labels, pill chips; everything centred; every element fading and
         sliding up; text moving while read; corner labels, HUD readouts, frame borders; three cards in a row;
         KPI grids; a docked logo; pulsing or breathing loops; any line already used on the site's home page;
         any word or number not in the brief.
QA:      t=2.0 scan mid-wall with dots behind it and title 1 readable; t=5.2 one card large with alert badge;
         t=9.0 card between the gates, gate 1 ticked; t=12.6 rows full and count at 51; t=17.0 ranked list with
         digits; t=19.4 scan over the list with the last line; t=20.55 equals t=0 (loop seam).
