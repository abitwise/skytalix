---
subtask: qe-polish-ABC-216
role: qe-e2e
ticket: plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
ref: .grugops/context/qe-polish-ABC-216/
branch: new grugops/qe-polish-ABC-216 from grugops/se-polish-ABC-216 (c627a411), worktree ../wt-qe-polish-ABC-216
width: 2 of 3 (beside se-integrate-ABC-205; no timing)
---

# QE short re-check: ABC-216 polish

## Do
- Merge current `main` first (report sha). Verify QE-216-a..e as ruled in `qe-ABC-216/…23afedde`, the SE's `se-polish-ABC-216/…29bf4547`, `…22e0722c`.
- Confirm the `package*.json` diff is exactly the two `engines.node` lines (no dependency, script, bin or other lock change) — the Orchestrator rules no Security hop on that basis; say if it doesn't hold.
- Re-run A2, A3 (art byte-identical), A4 on your own fresh clone, A5–A9. Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. Verdict.

## Fences
- Only your worktree and `<scratchpad>/qe216p/`. No edits outside records. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-polish-ABC-216). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**`PASS_WITH_GAPS`** (no blocking gap). Branch `grugops/qe-polish-ABC-216` in `../wt-qe-polish-ABC-216`, from `grugops/se-polish-ABC-216` `c627a411`.

- **Merge:** `9f311ab4` is `c627a411` plus `main` `2a9844ca`. No conflict. Main brought ABC-217 and records. `README.md` and `package*.json` are byte-identical to `c627a411`.
- **Tip:** `1097c61c` (sealed notes). Not pushed, not merged into `main`. No README, package, `src/` or board edit.
- **QE-216-a to e: all five fixed as ruled** (`…23afedde`):
  - a: `engines.node` `>=22.18` in `package.json` and the lock's root; README "Node.js 22.18 or later".
  - b: line 11 "**skytalix**: command-line chess…", the name as text right after the art.
  - c: "`white` (default)". Matches `resolveOptions`, `startup-questions.ts` and a live run (White at the bottom).
  - d: "Time per move"; "grugops kit files" kept, as in NOTICE's heading.
  - e: one credit line, "The title's letters use FIGlet's standard font."; the dated SE correction `…22e0722c` agrees.
- **Package diff: confirmed.** It is exactly the two `engines.node` lines (numstat 1/1 each, over `main..9f311ab4` and over `50b23aa4..c627a411`). There is no dependency, script, `bin` or other lock change, so the no-Security-hop basis holds.
- **Criteria:**
  - A1 (widened): README plus the two package files plus records.
  - A2: 88 lines, 8 headings.
  - A3: art lines 1-9 byte-identical (`cmp`) to `50b23aa4` and `16c14409`; 7 lines, max 64 columns, 0 non-ASCII, 0 tabs.
  - A4: QE's own fresh clone, URL the only substitution, stdin `/dev/null`. 10/10 exit 0. The three chess lines have 0 B stderr. `dist/uci.js` is 3941 B. No `games/`. Clone `git status` clean after install. UCI options read live.
  - A5: every fact equals its constant; the A5 sources are unchanged by the merge.
  - A6: 0. A7: holds. A8: 0/0/0, 1 URL (the repository's own). A9: 3 links, all tracked.
  - Plants: A8, A3 and A6 each bite.
- **Gates:**
  - `npm ci --ignore-scripts` 0; lint 0 (128 files); typecheck 0; build 0.
  - `npm test`: 62 files, 2075/2075. `last-run.json` reads success, pending 0, todo 0.
  - Skip capture `0`, then `No findings.`; `qe-hop-integrity --ticket ABC-216` exit 0.
- **Findings (none blocking):**
  - **QE-216-g, LOW.** `>=22.18` also admits Node 23.0-23.5, where type stripping is not default-on (`ADR-0044` l.405: 22.18.0 / 23.6.0). The README line has the same hole. Node 23 is end-of-life, and the lock's `vitest` engines already exclude 23. The exact form is `^22.18.0 || >=23.6.0`. The Orchestrator's call; not run (`UNKNOWN - verify`).
  - **QE-216-h, INFO.** `AGENTS.md` § Stack "Node (>= 22)" and `memory-bank/30-architecture.md` l.114 now trail `engines.node`. Outside the fence; for the Scribe's next hop.
  - Residual: no run on Node 22.x (host v26.11.1 only). GitHub render is the owner's look after his push.
- **UAT:** WAIVED (waived is not accepted). 0 `src/` files over `0a5862b5~1..0a5862b5` and `main..9f311ab4`.
- **Notes** (in `../wt-qe-polish-ABC-216/.grugops/context/qe-polish-ABC-216/notes/`, four sealed):
  - observations `…636fb84f` (gates and A4), `…6b6ba469` (items a-e, package diff, criteria, plants) and `…63844928` (findings);
  - decision `…ac8e47c6` (the verdict).

**Trace row** (for the Orchestrator):

| ABC-216 (qe-polish-ABC-216) | QE re-check: QE-216-a..e fixed at merge 9f311ab4 (c627a411 + main 2a9844ca); README 88 lines/8 headings; art lines 1-9 byte-identical; A4 own fresh clone 10/10 exit 0, chess lines 0 B stderr; A5 facts = constants | EPIC-006 | README; package.json + package-lock.json engines.node >=22.18 only | none moves; no Security/NFR trigger (package diff = 2 engines lines, confirmed); QE-216-g LOW (>=22.18 admits Node 23.0–23.5), -h INFO (stale "Node >= 22" in AGENTS.md, architecture page) | grugops/qe-polish-ABC-216 @ 1097c61c (merge 9f311ab4)<br>.grugops/context/qe-polish-ABC-216/notes/ (4) | npm ci 0; lint/typecheck/build 0; npm test 62/2075 success; skips 0 No findings.; qe-hop-integrity covered; plants A8, A3, A6 bite | WAIVED (waived is not accepted) — 0 src/ files | — (owner pushes; GitHub render is his look) | In Review → Orchestrator merge with NFR-008 sentinel (QE PASS_WITH_GAPS …ac8e47c6) |
