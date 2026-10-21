# Brag plan: Financial operating system for household investing (Selected work 02)
Source: Haris's portfolio PDF, project 01. Client and product name withheld. No figures beyond the PDF.
1. What: a consumer fintech product (portfolio tracking, research, retirement projection, rebalancing) with a tool-using AI agent that answers questions over a household's real finances and shows its evidence.
2. Who: households investing their own money. Haris is the founding engineer.
3. Strongest claim: a confidentiality boundary enforced by the build: a lint rule makes it structurally impossible for the public app to import the private data client.
4. Key visual: the trust-boundary architecture (monorepo, investing app, content app, CI gates, private DB money+auth, public DB no PII, tool-using agent, "ask, with evidence").
5. Verbatim: "blocked by lint rule", "PRIVATE DB money + auth", "PUBLIC DB no PII", "Ask, with evidence".
6. Tone: cinematic, polished. Edit style: slow lateral dolly on a flat blueprint, one hard stamp slam. Gold #e3b85c on #0d1410.
7. Format 1080x1350, 12 s, silent loop. 8. Status: live in production, first outside beta customers.
## Storyboard
1. 0.0-2.6 Hook: an example question types into the agent ("Can we afford to retire at 58?"), the answer card cites evidence chips (labelled "Example question").
2. 2.6-6.6 Trust boundary: dolly across the monorepo; a dashed import from the content app to the private DB is struck by a red "BLOCKED BY LINT RULE" stamp. Caption: "A privacy mistake fails the build, not production."
3. 6.6-9.6 How it ships: PR cards slide through fresh-context AI review, a one-at-a-time merge queue and a real running build. Caption: "Hundreds of pull requests, each reviewed by a fresh AI pass."
4. 9.6-12 Close: "Founding engineer" / "Household investing, with an agent that shows its evidence." / three facts / stack. Fade for loop.
