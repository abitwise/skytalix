---
subtask: qe-ABC-212
role: qe-e2e
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/qe-ABC-212/
branch: grugops/arch-runbook-ABC-212 (c0508fe9) — the full ABC-212 line: build + pins + AGENTS.md + runbook
width: 1 — ALONE (ENGINE_DEEP real-clock A4 ~7.5 min; never beside another hop or a harness reading). Dispatch only on an idle board, AC.
---

# QE gate for ABC-212 (levels 6–7)

> **Owner rule 2026-10-24 (`…4c3f7639`): ONE run.** No prior valid reading exists, so run once under the preconditions and write the result; it is final. No repeat on UNRESOLVED/NOT MET (grade it as the page says); the procedure's own defined steps (e.g. a pooled extension) are part of the one run.

## Do
- Own worktree from `grugops/arch-runbook-ABC-212` (`c0508fe9`); merge current `main` first (report sha); own `npm ci`.
- Verify the SE's criteria independently (re-run load-bearing plants). Then: **A3** 50/50 identity at levels 1–5 vs base; **A4** `ENGINE_DEEP` levels lane (level 6 30/30 in 5.0–7.0 s, level 7 10/10 in 30–32 s, max depth logged; depth ≥ 100 → Architect); **A10** pty at level 7 (thinking frame, 30–32 s/move, Ctrl-C ends within 1 s); **A15** level-7 depth ≥ level-5 + 1 on kiwipete and position-6. Preconditions per timed run: AC, load1 ≤ 8, no foreign vitest.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json`; skips; `CLI_DEEP`, `UCI_DEEP`.
- Verdict PASS / PASS_WITH_GAPS / FAIL; UAT is signed by your verdict (production lines); list what the owner should try by hand.

## Fences
- Only your worktree and `<scratchpad>/qe212/`. Notes + dated `## QE` addendum on the page. No `src/` edits. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `qe-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**`PASS_WITH_GAPS`.** Branch `grugops/qe-ABC-212` in `../wt-qe-ABC-212` (own `npm ci`, Node v26.11.1, Apple M3).
**Merge `d417b07c`** = `c0508fe9` + `main` `7727400c` (no conflict). From `main` it brought `src/evaluate.ts` comment
lines and `ABC-213`/`ABC-214`'s `pgn-file.ts`/`pgn.test.ts`. **Tip `052ae3ad`** holds the notes, `raw/` (personal paths
redacted, `ADR-0049` D4) and a dated `## QE addendum` on the page. Not pushed and not merged. No `src/` edit.
**One run under `…4c3f7639`.** Each timed window waited for the preconditions. A foreign session's vitest held
them 11:33–11:45Z before A4 and 12:03–12:26Z before the Ctrl-C step.

- **A4 (real clock, `ENGINE_DEEP` levels lane, one window per row):**
  - level 5: 30/30 ≤ 5 000 ms, max **3 005**;
  - level 6: 30/30 in 5 000–7 000, **5 000–5 005**, max depth **13**;
  - level 7: 10/10 in 30 000–32 000, **30 000–30 004**, max depth **10**;
  - depth < 100, so no Architect notice;
  - the level-7 window had two short foreign bursts (moves 7 and 9–10). They can only push toward overrun, and those
    moves read in band. Not re-taken.
- **A3:** 60/60 identical to base `c735577f` and to `main`, with the instrument shown sensitive.
- **A10:** the thinking frame came 1 ms after Enter, an out-of-book move took **30 001 ms**, Ctrl-C ended the
  process in **12 ms**, and level-6/7 games wrote PGNs with `Difficulty "6"`/`"7"`.
- **A15:** depth L5 / L6 / L7 is kiwipete **7 / 7 / 9** and position-6 **7 / 7 / 9**, so the bar is met.
- **A1, A2, A5–A9, A11–A14:** MET. P1–P5, `RF-1`, R1 and QE's Q1–Q6 each red their rows. Every edited test line is
  licensed.
- **Gates:**
  - lint, typecheck and build 0;
  - `npm test` 62 files, 2066/2066, success (`last-run.json` pending 0, todo 0), also at the tip;
  - skips 0, and `test-skip-integrity.js` gives `No findings.`;
  - `CLI_DEEP` 11/11; `UCI_DEEP` 5/5;
  - `ENGINE_DEEP` levels 41/41 (a gate pass: it ran beside a foreign vitest);
  - `qe-hop-integrity.js --ticket ABC-212` covered by `…e58d4635`.
- **Findings:**
  - QE-212-a **LOW**: A4's log (max and depth, the 100-depth tripwire) is not printed under the documented lane
    command in a non-TTY. `--reporter=verbose` is needed.
  - QE-212-b **INFO**: the reading conditions.
  - QE-212-c **INFO**: the runbook's "no output" wording.
  - QE-212-d **INFO**: A11's "no other line" read as "no other content".
- **UAT:** the waiver does **not** apply (5 production files). This verdict signs UAT under `…5aaf7cec` item 2.
- **Owed, not gaps:**
  - Security/NFR: the `NFR-004` text (the branch's catalog row still says 5 s at any difficulty), `AR-NFR004-A` at
    32 000, `NFR-009` at 30 s, `N8-LANE`, `ADR-0036` (b);
  - BA/PM: the `ADR-0044` folds and the `ABC-204` erratum at the merge.
- **Notes** (in `../wt-qe-ABC-212/.grugops/context/qe-ABC-212/notes/`, seals read back): `…f9560997` (readings),
  `…8b19f527` (plants and audit) and the decision `…e58d4635`.

**Trace row** (for the Orchestrator):

| ABC-212 (qe-ABC-212) | QE: A1–A15 MET at merge d417b07c; A4 real clock L5 30/30 max 3 005 ms, L6 30/30 5 000–5 005 ms (depth 13), L7 10/10 30 000–30 004 ms (depth 10); A3 60/60 identical to base and main; A10 30 001 ms move, Ctrl-C 12 ms, PGN at 6/7; A15 depth 7/7/9 on kiwipete and position-6 | EPIC-004 | difficulty levels 6–7 (ABC-087, ABC-101, ABC-171; ADR-0045 § AMENDMENT 2026-10-24) | NFR-004 (text owed to Security/NFR), NFR-005 instrument (A15), NFR-008 (A12: 0 files, 0 spawns), NFR-009 at 30 s owed; QE-212-a LOW, -b/-c/-d INFO | grugops/qe-ABC-212 @ 052ae3ad (merge d417b07c)<br>src/levels.ts, src/engine.ts (clamp 32 000), src/cli-options.ts, src/cli.ts, src/uci-session.ts + licensed pins<br>.grugops/context/qe-ABC-212/notes/ (3) + raw/; ABC-212 page ## QE addendum | P1–P5, RF-1, R1, Q1–Q6 red their rows; lint/typecheck/build 0; npm test 62/2066 success; skips 0 No findings.; CLI_DEEP 11/11; UCI_DEEP 5/5; ENGINE_DEEP levels 41/41 + per-row windows; qe-hop-integrity covered | waiver does NOT apply (5 production files); signs UAT under …5aaf7cec item 2 (PASS_WITH_GAPS, no blocking gap) | merge after the Security/NFR gate (NFR-004 text, NFR-009, N8-LANE) | In Review → In Security/NFR |
