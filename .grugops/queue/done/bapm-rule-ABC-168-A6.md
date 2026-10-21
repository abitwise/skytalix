---
subtask: bapm-rule-ABC-168-A6
role: ba-pm
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/bapm-rule-ABC-168-A6/
width: 3 (beside scribe-ABC-168 and qe-ABC-187; disjoint files)
---

# BA/PM: rule ABC-168's `A6` — an in-lane per-reply latency needs an async child, which ABC-173's `C2` guard forbids

The SE built Scope 1–3 and 6 (`grugops/ABC-168` @ `2ed5469a`; notes `…c7c0a672`, A6 stop `…a4721906`, readings `…c6c1358b`) and stopped on `A6` only:
- `A6` (idle responsiveness, EPIC-007 M3, *proposed*): spawn → `uciok` ≤ 2 s; first `isready` → `readyok` ≤ 1,000 ms; idle `isready` → `readyok` ≤ 100 ms, "read once with host and load1… A miss is reported, not trimmed."
- **Blocker:** a per-reply latency needs an async child; ABC-173 `C2` (`ADR-0008` addendum 2026-10-19, owner-accepted) fails `npm test` on any async `child_process` form in `src/**/*.test.ts`; `A11` forbids editing `C2`. One hand reading of the withdrawn async version (Apple M3, load1 3.74): `uciok` 88 ms, first `readyok` 7 ms, idle `readyok` 0.1 ms.
- **Routes the SE lists:** (1) Architect amends `ADR-0008` for one serial async child + BA/PM widens `A11`/`A12`; (2) `A6` becomes a hand reading at QE/UAT; (3) `spawnSync` whole-child upper bounds (can bound 2 s and 1,000 ms, not the 100 ms idle reading: Node start-up is ~90 ms).

## Decide
- The Orchestrator's recommendation is **route (2)**: `A6` is already "read once… reported, not trimmed", a measurement rather than a pass/fail gate, so a QE hand reading (an async probe script **outside** `src/**/*.test.ts`, e.g. under `.grugops/context/qe-ABC-168/probe/`, recording host and load1) keeps `C2` and the owner-accepted `ADR-0008` addendum intact. Rule it, or rule otherwise with a reason.
- Say whether EPIC-007 M3's wording is affected (if it is, do not edit `EPIC-007`; name the change for the owner).
- Amend the page (date it, cite the SE's notes), re-score DoR. The card moves to In Review when the Scribe's Scope 5 lands; leave the column to the Orchestrator.

## Fences
- Records only: the ABC-168 page, notes. No `EPIC-007`, ADR, `src/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-ABC-168-A6`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rule-ABC-168-A6.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-168 ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result (ba-pm, 2026-10-21T14:18:52Z): **`A6` ruled on route (2). DoR 10 of 10. No column move. Size S and P1 unchanged. The owner owes the `EPIC-007` M3 "how it is read" rewording.**

Records only, uncommitted on `main` (`main` was at `6d840c0d` when this hop started and finished). Notes are in
`.grugops/context/bapm-rule-ABC-168-A6/notes/`. They were sealed with `context-io.js` `admitAndAppend` (grugops
2.1.0 plugin cache), with the context root passed explicitly as the main checkout's `.grugops/context`. Both read back
through `readContext`:
- `20261021T141847Z-ba-pm-decision-eb53fbfe`: the ruling, the reasons, the page amendment and the DoR re-score.
- `20261021T141847Z-ba-pm-observation-20cc2ffe`: what the owner owes for M3 and `RISK-EPIC007-05`, the fallback
  (route (1)), and the files touched.

### Ruling: route (2), as the Orchestrator recommended
`A6` leaves the `UCI_DEEP` lane. At the QE hop, QE runs one async probe once against `node src/uci.ts` on the tip
under review, with default options. The probe lives in `.grugops/context/qe-ABC-168/probe/` and is run with plain
`node`, never vitest. The targets are unchanged: 2 000 / 1 000 / 100 ms. The page fixes:
- where each clock starts and stops;
- one run, with no re-run to pick a better one;
- a 10 000 ms no-reply miss;
- the record: host chip, Node version, load1 from `sysctl -n vm.loadavg`, tip sha, and each number marked met or
  missed.

A miss is reported, not trimmed. It goes to Security/NFR (candidate row (i)) and does not fail QE on its own.
`ABC-173` `C2` covers `src/**/*.test.ts` only, and the `ADR-0008` heap ceiling covers vitest runs only, so neither is
edited or waived. `A11` is unchanged.

**Why not the other routes:**
- **Route (1)** reopens an addendum the owner accepted. It also breaks that addendum's Ruling 4 premise ("a worker and
  its child are never both busy"), all for a measure that is still proposed.
- **Route (3)** cannot bound the 100 ms idle reply, because Node start-up is about 90 ms. It would also split one
  measure across two instruments.

The SE's withdrawn-async reading (88 / 7 / 0.1 ms) informed the ruling. It is not `A6`'s reading.

### Page amendment
File: `plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md`. Each change is dated
2026-10-21 and cites `…c7c0a672`, `…a4721906` and `…c6c1358b`.
- **The top blockquote:** the ruling, why the other routes were rejected, and what the owner owes.
- **Scope 3:** the lane is `spawnSync` and reads no per-reply latency.
- **`A6`:** rewritten as above.
- **`A12`:** one added clause. Records under `.grugops/context/`, the probe included, are not delivery files.
- **Test note 1:** `A6` is no longer in the lane.
- **New test note 6:** the probe's location, why it may spawn asynchronously, what it does not touch, and how it
  reads.
- **Dependencies:** a new line for the owner's M3 confirmation.
- **Security/NFR:** row (i)'s instrument is now the probe.

Not touched: `EPIC-007`, `ADR-0008`, `ADR-0044`, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`.

### DoR: 10 of 10 (re-scored at `6d840c0d`)
Items 4, 5, 6, 7 and 10 were re-read.
- **4** is sharper: the instrument, the clock points, one run and the miss route are now all stated.
- **5** adds the owner's M3 confirmation. It gates only citing `A6` as M3's proof.
- **6:** row (i) keeps its numbers, and `N8-SPAWN` is unchanged.
- **7** now counts six notes.
- **10:** the `A6` stop is ruled, and the fallback is named on the page.

The column is not moved. The card stays `In Development` until the Scribe's Scope 5 lands, and that move is the
Orchestrator's.

### For the owner (the Orchestrator asks)
Confirm the rewording of `EPIC-007` M3's "how it is read" cell to: "One QE hand reading in `ABC-168`, by an async
probe outside vitest (`ABC-168` test note 6), recording host and load1. Security/NFR places it as `ADR-0044`
candidate row (i) and may change the numbers. The book-load cost on this host is `UNKNOWN - verify` until that probe
reads it". Also confirm `RISK-EPIC007-05`'s "until `ABC-168`'s lane reads it" → "until `ABC-168`'s QE probe reads
it".
- The M3 targets themselves do not change.
- Until he confirms, QE still reads `A6`, but the reading is not cited as M3's proof. The confirmation does not gate
  development, QE or the merge.
- **If he declines,** the fallback is route (1): an Architect amendment to the `ADR-0008` addendum for one serial
  async child in the lane, plus BA/PM widening `A11` and `A12` for the `C2` edit.
- The M9 confirmation (`…7667bcc5`) is still open as well. Both can be asked in one question.

### Next
- The Scribe lands Scope 5 (`scribe-ABC-168`). The `UCI_DEEP` lane line comes from `…c7c0a672`.
- The Orchestrator moves the card to In Review.
- `qe-ABC-168` reads `A6` using test note 6, and `A7` once M9 is confirmed.

### Trace row for the Orchestrator to append (10 cells, header order)

| ABC-168 (BA/PM A6 ruling) | ruled A6 on route (2): A6 leaves the UCI_DEEP lane for one QE hand reading by an async probe outside src/ and vitest (.grugops/context/qe-ABC-168/probe/); same 2 000 / 1 000 / 100 ms targets, clock points, one run, 10 000 ms no-reply miss, miss → Security/NFR; page amended (top note, Scope 3, A6, A12 clause, test notes 1 and 6, Dependencies, row (i)); EPIC-007 not edited, owner confirms M3 "how it is read" rewording (fallback route (1)) | EPIC-007 | — | ABC-173 C2 and ADR-0008 § ADDENDUM 2026-10-19 unchanged; ADR-0044 candidate row (i); NFR-008 N8-SPAWN unchanged; notes …c7c0a672, …a4721906, …c6c1358b, …eb53fbfe, …20cc2ffe | main @ 6d840c0d (uncommitted, records only)<br>plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md | — (records only; no gates run) | — | — | DoR 10/10; no column move (stays In Development; In Review is the Orchestrator's once Scope 5 lands); owner owes M3 and M9 rewordings |
