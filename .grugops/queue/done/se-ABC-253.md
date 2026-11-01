---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:40:32Z
subtask: se-ABC-253
role: software-engineer
ticket: ABC-253
ref: .grugops/context/se-ABC-253/
branch: new grugops/ABC-253 from main (worktree .claude/worktrees/se-ABC-253)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-253
## Read
- plans/tickets/ABC-253-zobrist-keys-travel-as-two-32-bit-halves-in-the-search-the-tt-and-the-repetition-scan-bigint-at-the-api.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
- ADR-0055 O1-a; addendum D3-V2 and the perft-read addendum (A5 is a search read: chooseMove at 4 000 ms, D3-V2 as written; your speed figures are informal; QE grades in an alone window). ABC-251 profile lesson: V8 already inlines small helpers — profile before hand-optimizing.
## Do
- Profile first (cheap): confirm bigint key work is a measurable share of search time on today's main; if it is under ~1 %, STOP and report before building (Orchestrator drops as "nothing to cut").
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (per the page; bigint stays at the API — book.json and signatures unchanged). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-253/`.
## Publish
Sealed notes (task `se-ABC-253`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. STOPPED after the profile-first step: A5 is out of reach and the page conflicts with itself. No src/ or test file was changed and no ALONE read is owed.** Branch `grugops/ABC-253`, in worktree `.claude/worktrees/se-ABC-253`, from main `d46ed7ec`. The claim is `460d7a57`; the notes and raw evidence are `4633b9c4`. Nothing is merged or pushed.

- **Profile** (informal, under the host lock): base main, `chooseMove` 4 s, kiwipete and position-6, 2 fresh runs each.
  - Self time: `zobristKeyAfterMove` 0.79–0.87 %, `probeTable` 0.88–1.30 %, `storeEntry` 0.07–0.16 %, the repetition scans 0.03–0.11 %, GC 1.04–1.15 %.
  - The key path totals about 1.9–2.4 %. That is above the brief's ~1 % floor, so I built an informal probe instead of stopping straight away.
- **Informal probe** (labelled informal; not A2 and not A5): a scratch copy with the whole `chooseMove` hot path in u32 halves.
  - It covers the per-ply keys, both updates, the TT keys and slot, both repetition scans, and `priorKeys` converted once per call.
  - Tick-clock identity against base: 48/48 equal.
  - Profiled: the update fell to 0.26–0.28 %. The probe only fell to 0.79–0.95 %, because its cost is the cache miss on the 4 MiB table. GC did not move (0.98–1.02 %).
  - Interleaved A/B, 5 rounds × 3 boards, 4 s: kiwipete 1.004×, position-6 0.992×, start 1.015×. Spreads were 1.8–5.9 %.
  - A5 needs ≥ 1.02× on two boards. The ceiling is about 1.007×.
- **Page conflict** (an Architect ruling would be needed if the ticket is ever re-opened).
  - Scope 1 puts the TT keys and index in halves, but A2 keeps the `ABC-081` TT rows unedited. Those rows wrap `probeTable(key: bigint)`, forwarding one argument, and count exactly one `BigUint64Array` per search.
  - The `ABC-122` capacity rows mock `zobristKeyAfterMove`'s bigint return and spy `repeatsInPath(BigUint64Array)`. The `ABC-208` probe watch reads a bigint key.
  - A halves hot path bypasses all of them, so they go red unless they are re-pointed.
- **Acceptance:** A1–A6 not applicable (no head build). G2/G3 not owed.
- **Gates:** none run, because there is no code change; the tip differs from main only under `.grugops/`.
- **Notes (sealed, read back 3/3):** decision `20261101T204914Z-software-engineer-decision-efd7790c` (STOP), evidence `…observation-ba045718`, trace refs `…observation-e35068b9`. The trace-refs note is an observation because an artifact-ref needs `gate_run`, which this install cannot emit. Raw scripts, outputs and the prototype patch are in `.grugops/context/se-ABC-253/raw/`.
- **Routing owed (Orchestrator):** drop as "nothing to cut". The key path is far below the page's 5 % re-open trigger.

### Trace row (10 cells, header order)

| ABC-253 | O1-a: Zobrist keys as two u32 halves in search/TT/repetition scan, bigint at the API | EPIC-010 | — | none moved (no code; NFR-009/G7, NFR-005/G6 untouched) | grugops/ABC-253 @ 4633b9c4 (claim 460d7a57): .grugops/context/se-ABC-253/ notes (3) + raw/ (profile, prototype patch, informal A/B); no src/ change | informal profile: key path 1.9–2.4 % self (probe mostly cache miss), GC 1.0–1.15 % not bigint; informal halves prototype 48/48 identity, 1.004/0.992/1.015×; no tests run (no code) | — | — | STOPPED after profile (A5 unreachable, A2-vs-scope conflict); Orchestrator drop routing owed |
