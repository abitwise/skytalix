---
type: decision
task: ticket-to-pr-ABC-050-2026-08-20
role: orchestrator
ticket: ABC-050
created: 2026-08-20T15:00:00Z
tree: main @ d127ae3 (clean)
---

# ABC-050 pulled. The written promotion trigger FIRED, and I re-measured all three gaps at the tip rather than trusting the page.

## The promotion trigger fired — P2 -> P1

`ABC-050`'s own page carries one trigger, in the owner-facing words *"promote to `P1` the moment
anyone opens `vitest.config.ts` for an option change"*. **It has fired, and by the project owner's
own hand:** commit `2bef492` ("Don't run claude workspace and other tests...", 2026-08-20, Olger
Oeselg) added the `exclude` **runner option key** to `vitest.config.ts` (+26 lines) and widened
`biome.json` (+13/-1). That is exactly the edit this ticket exists to make visible, and it went in
under **no static tool at all** — which is gap 1, demonstrated live rather than argued.

Promoted to **P1**. This is not me overriding BA/PM's priority; it is me executing the promotion
rule BA/PM wrote, on the event BA/PM named.

## The `Ready for Dev` exit review (this project's process rule 1) — MEASURED, at `main @ d127ae3`

Rule 1 asks whether the criteria still match what exists, not whether they are well formed. Three
gaps, all **still open**, each re-verified at source at this hop:

| gap | criterion | measured at this hop | verdict |
|---|---|---|---|
| 1 static tools blind | `A1` | `npx biome check vitest.config.ts` -> **"These paths were provided but ignored"**, exit 0. `biome.json` `files.includes` positives are still `src/**/*.ts`, `spike/**/*.ts`, `*.json`; `tsconfig.json` `include` still `["src/**/*.ts","spike/**/*.ts"]`. A root-level `.ts` matches **neither**. | **STILL OPEN** |
| 2 false sentence | `A4` | `/usr/bin/grep -n 'share a worker' vitest.config.ts` -> **hit at line 52**, exit 0. `A4` demands exit 1. | **STILL OPEN** |
| 3 silent leak | `A5` | `src/glyph-mode.nfr.test.ts` still calls `beginGlyphModeSession({ ascii: false, unicode: false })()` and **discards the return value**. No assertion is pointed at the hazard. | **STILL OPEN** |

**Line numbers moved, the facts did not.** The page says gap 2 is at `:52` and gap 3 at
`glyph-mode.nfr.test.ts:96`. Gap 2 is still at `:52`; gap 3's call has drifted off `:96` and is now
at `:96` in the ambient block I read (`sed -n '88,102p'`) - **an engineer must re-locate it by
content, never by the page's line number.**

## ONE THING THE PAGE COULD NOT KNOW, and it changes `A1`'s arithmetic

`A1` is deliberately written as a **delta** ("exactly one higher"), not against the constant `50`,
precisely so a lane that grows around it cannot falsify it. Good - because the lane **did** grow
around it. `2bef492` added seven `!`-negations to `biome.json` `files.includes`
(`!.claude`, `!.gemini`, `!.github`, `!.grugops`, `!coverage`, `!memory-bank`, `!plans`) and twelve
`exclude` entries to `vitest.config.ts`. **Whatever file count the page's cutting hop saw on
2026-08-13 is stale.** Capture the before-count at YOUR tip and compare to YOUR after-count. Do not
paste `49` or any other number from the page or from `AGENTS.md`.

## What I did NOT do

- **I did not touch `vitest.config.ts`, `biome.json` or `tsconfig.json`.** The measurement is
  read-only; the change is the engineer's on a branch.
- **I did not re-score DoR.** It stays `10/10`. Only `priority` moved, under the page's own rule.
- **I did not waive `A5`.** It is the criterion that costs real work and it is the one that decides
  whether this ticket bought anything.
- **`2bef492` is the owner's own commit and is NOT this ticket's to revert or tidy.** It is the
  event that promoted the ticket, not a defect to repair.
