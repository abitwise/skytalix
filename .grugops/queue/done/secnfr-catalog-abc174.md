---
subtask: secnfr-catalog-abc174
role: security-nfr
tickets: [ABC-174]
branch: none. main's working tree at b6f2a48a, uncommitted
ref: .grugops/context/secnfr-catalog-abc174/
notes:
  - .grugops/context/secnfr-catalog-abc174/notes/20261020T135600Z-security-nfr-decision-8254dfa3.md
  - .grugops/context/secnfr-catalog-abc174/notes/20261020T135630Z-security-nfr-observation-ce3df091.md
done_at: 2026-10-20T13:57:00Z
result: DONE (records only). NFR-008 R-1 first verdict NOT MET written into the catalog (dated insertion in the Target cell + closing section); R-174-1 recorded ACCEPTED, MEDIUM, owner Olger Oeselg (…bdff4d33); remedy owed by Architect/Design (arch-lane-under-10s); R-173-1, R-173-2, F and RISK-ABC144-FCAP unchanged; SEC-174-1 discharged by a dated insertion at THE LEVEL LAYER. NFR-001..007, NFR-009 and NFR-010 byte-identical (sha256 per row). Nothing run or timed, committed, pushed or merged.
---

# Brief (as dispatched; body verbatim, its H1 demoted to H2)

## Security/NFR catalog follow-up after ABC-174's merge (records only)

ABC-174 merged to main as `8522609d`, with UAT accepted (`…ecff6698`). The NFR-004 lines from `secnfr-ABC-174` are applied (`ffa1f4ce`).

## Do, in `plans/nfr-catalog.md` only
1. **SEC-174-1:** line ~:1405, THE LEVEL LAYER, still defines "at default difficulty" as `LEVELS[3]`. Add a dated note in the same style as `ffa1f4ce`, now true from `8522609d`.
2. **NFR-008, first verdict on the current 10 s clause: NOT MET.** `npm test` median wall 10.010 s, R 0.28 s, CPU 27.73 s, load1 3.10–6.01, on the combined tree `be6a5599`. Source: `qe-ABC-174` `…5d9a0f63`; your own recompute is `secnfr-ABC-174` `…6b1e94d2`.
   - Record **R-174-1** as owner-accepted (`…bdff4d33`), owner Olger Oeselg.
   - Say that Architect/Design owes a remedy (`arch-lane-under-10s`, running in parallel).
   - **R-173-1 stays open.** Keep F and RISK-ABC144-FCAP unchanged, as you ruled.
3. Hash every other row before and after, and report them byte-identical.

## Fences
- Edit `plans/nfr-catalog.md` and your notes only. Leave them uncommitted.
- No timing and no lane runs.
- Do not touch `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or ADRs.
- Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`. Use the sanctioned writer if available.
- `.grugops/queue/done/secnfr-catalog-abc174.md` (brief + `## Result`) and `.claim.md`, uncommitted.

## Result

**DONE, records only.** `plans/nfr-catalog.md` was edited on `main`'s working tree, base `b6f2a48a` (blob `8c5e7fff`)
→ blob `459612a3`. It is +100 / −2 lines, and the "−2" are two lines rewritten as themselves plus an insertion. It is
uncommitted.

### Catalog diff
1. **`SEC-174-1`** (`THE LEVEL LAYER`, `:1405`, now `:1406`): one dated insertion, 704 chars, after
   `**"At default difficulty" means `LEVELS[3]`**`.
   - It records that from `8522609d` the default is `LEVELS[5]` = `{ 3 000, 0 }` (`DEFAULT_LEVEL` 5), the same call, so
     clause A and `AR-NFR004-A` stand.
   - It records that `LEVELS[3]` is now `{ 330, 0.1 }`.
   - It points to the 2026-10-19 `A5` note.
   - Facts read from `src/levels.ts` and `src/engine.ts` on `main`.
2. **`NFR-008` row, `Target` cell** (line 56): one dated insertion, 677 chars, straight after the sentence that
   reserved the verdict for "the next Security/NFR gate that reads the lane". It reads:
   - first R-1 verdict **NOT MET**: 10.010 s median wall, R 0.28 s, CPU 27.73 s, load1 3.10–6.01, at `be6a5599`;
   - this is not `A9`, so `R-173-1` stays open;
   - the breach is carried as `R-174-1`, owner-accepted;
   - a pointer to the new section.
3. **New closing section** "`ABC-174` MERGED (`8522609d`) …" (lines 2288–2384) has four parts:
   - the verdict table: state, reading, tree, wall, CPU, load1, stack, power (`SEC-174-2`, battery, `UNKNOWN - verify`
     whether AC moves it), and margin;
   - attribution (not `ABC-174`'s by `N8-LANE`; pre-`ABC-174` state `UNKNOWN - verify`);
   - the `ACCEPTED RISK R-174-1` blockquote (MEDIUM, owner Olger Oeselg, verbatim *"accepr R-174-1"*, discharge rule),
     with the remedy owed by Architect/Design (`arch-lane-under-10s`);
   - "What did not move": `R-173-1` open and unchanged, `R-173-2` unchanged, `F` 1.72 / 3.25 s pre-cap,
     `RISK-ABC144-FCAP` open, the "outright"/"on MET" conflict owed to Architect/Design.
4. **One `_Updated:` line** at line 2.

It also checked that the measured tree is `main`'s lane. That is a read, not a reading: `git diff be6a5599 8522609d`
and `be6a5599 HEAD` are empty over `src/`, `tools/`, `package.json`, `package-lock.json`, `vitest.config.ts` and
`tsconfig.json`.

### Row hashes (sha256 of each table line, before → after)
- **Byte-identical:** `NFR-001` `27050903…3fd4`, `NFR-002` `b7ccca57…8ab5`, `NFR-003` `f04aafdd…a65b`, `NFR-004`
  `d8cc1bf9…faca`, `NFR-005` `f2816941…f38a`, `NFR-006` `594c59db…7afd`, `NFR-007` `20022010…63ae`, `NFR-009`
  `70b3a777…9bd6`, `NFR-010` `58d6555b…1fb7`.
- **`NFR-008`:** `12775bbd…ec39` → `c4606b41…64d1`. It is a pure insertion: removing the inserted span gives back the
  old line exactly.
- There are 10 rows before and after, with 5 cells each. Every other line of the file is byte-identical to `HEAD`
  (`difflib`: 0 deletions).

### Notes (admitted through `context-io.js` `admitAndAppend`, plugin `grugops` 2.1.0, in-process; sealed)
- `decision` `20261020T135600Z-security-nfr-decision-8254dfa3`.
- `observation` `20261020T135630Z-security-nfr-observation-ce3df091`. It was first tried as an `artifact-ref`. The writer
  refused that, because `sha`, `gate_run` and `content_hash` are required and no gate run exists. It was recorded
  honestly as an `observation`, and nothing was invented.

### For the router
- **Owner question: none.**
- **`AGENTS.md`'s "No `finding` is admissible on this install" block says `scripts/context-io.ts` is absent.** It is
  present in the plugin cache (`~/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js`), and this hop's
  notes and the Orchestrator's sealed notes went through it. That block is stale on that point. `AGENTS.md` is fenced
  from this hop. Owner: Orchestrator / Scribe.
- **Owed to Architect/Design:**
  - the "outright" against "on MET" `F` wording;
  - whether the stack names power (`SEC-174-2`);
  - the `ABC-174` narrow-set per-set `F`.
- **Queue close-out left to the Orchestrator**, as at `secnfr-catalog-abc173`: `pending/secnfr-catalog-abc174.md` and
  the claim directory `claimed/secnfr-catalog-abc174/` are left in place.

### Proposed trace row (not written; `plans/traceability.md` is fenced from this hop)
| ABC-174 (Security/NFR catalog) | NFR-008 R-1 first verdict NOT MET written (10.010 s vs 10 s, …6b1e94d2 §2 on …5d9a0f63, be6a5599); R-174-1 ACCEPTED MEDIUM, owner Olger Oeselg (…bdff4d33); remedy owed Architect/Design (arch-lane-under-10s); SEC-174-1 discharged (THE LEVEL LAYER default = LEVELS[5]); secnfr-catalog-abc174 | — | — | NFR-008 (NOT MET → R-174-1), NFR-004 (wording only) | main working tree, plans/nfr-catalog.md only, uncommitted; 0 production lines | nothing run or timed; NFR-001..007, -009, -010 sha256 identical | n/a (records only) | — | R-174-1 open until a ≤ 10 s full-lane reading or the owner's re-level; R-173-1 open; notes …8254dfa3, …ce3df091 |

### Fences kept
No `src/`, `tools/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, ADR or ticket page was touched, and nothing
in `.grugops/context/arch-lane-under-10s/` either. No vitest, window, arm or timing was run. Nothing was committed,
pushed or merged.
