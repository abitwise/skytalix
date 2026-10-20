---
subtask: arch-lane-under-10s
role: architect-design
tickets: []
ref: .grugops/context/arch-lane-under-10s/
---

# Architect: size a remedy to bring the default lane under NFR-008's 10 s (R-174-1)

The owner accepted R-174-1 with option (a) (`…bdff4d33`): ABC-174 merges on the risk, and Architect/Design sizes a remedy. Since then ABC-174 has merged (`8522609d`).

## Read first
- `plans/nfr-catalog.md`: NFR-008, NFR-010, R-173-1/-2.
- ADR-0035 (the N8-LANE instrument).
- ADR-0008 and its heap-cap addendum (ABC-173's 2 executors and heap ceiling).
- The QE timing note `.grugops/context/qe-ABC-174/notes/…5d9a0f63` and its `probe/` raw data, which give per-file costs where available.
- `secnfr-ABC-174`'s decision `…6b1e94d2`.
- `AGENTS.md`'s lane lines.

## Do (records only)
1. **Find where the ~27.7 s CPU / ~10.0 s wall goes.** Use the existing raw data and vitest reports already on disk. Rank the files and rows by cost. Where data is missing, say UNKNOWN - verify; do not time anything.
2. **Propose ranked remedy options** that bring the lane to ≤ 10 s with headroom, without loosening any pin or skipping any row. Examples: move rows to deep lanes with a BA/PM ruling, cheapen clocks or steps, restructure files, change vitest pool or isolation settings within the ADR-0008 caps. For each option give:
   - the expected saving, labelled as an estimate;
   - the risk;
   - the owner role;
   - its size (XS–XL).
3. **Recommend one.** Write it as an ADR, PROPOSED, in `memory-bank/50-decisions/`, with the next free ADR number. Include the measurement plan QE would use: N8-LANE plus a full-lane twin in a quiet window.
4. Name the ticket BA/PM should cut. The next free id is **ABC-177**. Do not cut it yourself.

## Fences
- No timing and no lane runs; another hop runs in parallel.
- Do not touch `src/`, `tools/`, `AGENTS.md`, `vitest.config.ts`, `plans/` or `nfr-catalog.md`.
- Work in records only, on main's working tree, and leave them uncommitted.
- Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`.
- `.grugops/queue/done/arch-lane-under-10s.md` (brief + `## Result`) and `.claim.md`, uncommitted.
- List any owner questions plainly.

## Result

**done_at 2026-10-20T14:00Z. RULED (proposed). Records only.**
- No lane was run and nothing was timed.
- Nothing was committed, pushed or merged.
- `src/`, `tools/`, `AGENTS.md`, `vitest.config.ts` and `plans/` are untouched. The catalog edit in that window is the
  parallel `secnfr-catalog-abc174` hop's, committed by the Orchestrator as `1141695e`. It is not this hop's.

### 1. Where the ~10 s goes
- **Data:** the lane's own report, `.test-results/last-run.json`, from 2026-10-20T13:45:02Z on `8522609d` code.
  - It is snapshotted at `.grugops/context/arch-lane-under-10s/probe/`.
  - It is not an admissible reading: load and power are `UNKNOWN - verify`.
  - Per-file CPU exists nowhere, so the 27.73 s CPU split is `UNKNOWN - verify`.
- **The ranking:**
  1. `src/uci-session.test.ts`: 6.27 s, 60.7 % of test time. It is virtual-clock search, not waiting.
  2. `src/cli.test.ts` module-scope `CHILDREN`, 28 × `spawnSync`: about 3.87 s of collect.
  3. Per-file worker overhead: about 5.2 slot-seconds.
  4. `engine.test.ts`: 0.79 s.
  5. `qe-hop-integrity`: 0.67 s.
- **The lane is throughput-bound on its 2 slots,** so wall ≈ 0.35 s + Σ slot-seconds ÷ 2.

### 2. Ranked options (all estimates)
1. **O1:** fold the A6 prefix dialogues, and give the class H/H′/L rows the coarsest kill-set-preserving step in
   {1, 10, 100, 1 000}. Wall −0.75..−1.4 s. LOW risk. SE, with BA/PM's word and QE. Size S.
2. **O3:** a `UCI_DEEP` lane for the class P/C bulk. Wall −0.5..−0.7 s. MEDIUM risk. BA/PM. Size M.
3. **O2:** the fold alone. Wall −0.3 s. Size XS.
4. **O4:** `cli.test.ts` children to `CLI_DEEP`. About −0.035 s per child. MEDIUM-HIGH risk. Size M.
5. **O5:** merge files. About −0.045 s per file. HIGH risk. Size L.

Rejected outright: workers 3, `isolate: false`, async spawns, engine constants, ordering, re-levelling W.

### 3. Recommendation
**O1, written as `ADR-0046`, status PROPOSED:**
`memory-bank/50-decisions/ADR-0046-the-default-lane-gets-under-10-s-by-coarser-virtual-clock-steps-on-the-uci-rows-whose-bounds-read-no-step.md`.
- Predicted median: 8.6–9.3 s. The headroom target is ≤ 9.2 s.
- Measurement plan (D5): a node census, then mutation parity, then `N8-LANE` (ONE-FILE, flag 400), then a full-lane
  B/T/H/H2 twin. Each second tree gets its own `npm ci`. The twin runs in a quiet window, with power recorded.

### 4. The ticket BA/PM should cut
**`ABC-177`** (not cut here): test-only, `src/uci-session.test.ts`, size S, suggested P1. The scope and criteria are in
the decision note `…58fa35f0`.

### Owner questions
1. Accept `ADR-0046`? Recommended: yes.
2. Should `NFR-008`'s declared stack name AC power (`SEC-174-2`)? Recommended: yes, forward-only.

### Published
- `.grugops/context/arch-lane-under-10s/notes/20261020T135900Z-…-observation-…-534e376f.md`
- `.grugops/context/arch-lane-under-10s/notes/20261020T140000Z-…-decision-…-58fa35f0.md` (`kind: decision`)
- `.grugops/context/arch-lane-under-10s/probe/`: the report snapshot, `rank.py`, `timeline.py` and four `.out` tables
