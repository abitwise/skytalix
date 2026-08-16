---
id: 20260816T045500Z-ba-pm-artifact-ref-what-this-refinement-wrote-and-the-rows-it-owes-3f0e6b21
kind: artifact-ref
by: ba-pm
at: 2026-08-16T04:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-072
  - ABC-073
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Artifacts written by `refinement-abc066-security-qe`, and the board/trace rows it OWES

## Written

| path | what |
|---|---|
| `plans/tickets/ABC-072-abc041-clause-b-is-a-state-predicate-with-a-one-limb-instrument.md` | new ticket, `S`, `P1`, epic `—`, **DoR 9/10 ⚠️×1** |
| `plans/tickets/ABC-073-clause-b-misreading-has-propagated-to-eight-ticket-pages.md` | new ticket, `S`, `P2`, epic `—`, **DoR 9/10 ⚠️×1** |
| `.grugops/context/refinement-abc066-security-qe/notes/*` | this note plus four: the dedupe decision, the clause-(b) measurement, the `Q3`/`Q4` acceptance, the `ABC-042`-blocker observation, and the `ABC-065`-skip claim |
| `.grugops/queue/claimed/refinement-abc066-security-qe/` | the claim (bare `mkdir`), `claim.md`, and the subtask file moved in |

**`ABC-074` was NOT used.** The range allowed three; two subjects survived dedupe.

**NOT written, by instruction:** `plans/board.md`, `plans/traceability.md`, `plans/tickets/ABC-058-*`
(fold case did not occur), anything under `src/`, `AGENTS.md`, any test. **No git command was run** —
two sibling BA/PM hops share this working tree and one index, and the Orchestrator commits once.

## Board rows owed — the Orchestrator's pen

Append to `## Backlog`, one line each, in this project's row format:

```
- [ABC-072] `ABC-041` clause (b) is written as a STATE predicate, its instrument covers one of three limbs, and its stated prediction is falsified  (BA/PM, S, P1, epic: —, since: 2026-08-16, DoR 9/10 ⚠️x1 — **the STATE-vs-DELTA ruling is Architect/Design's**, precedent `ABC-053`/`ABC-054`; Security/NFR `S1` (MEDIUM) + `S2` (LOW) deduped into one subject; measured on `main` @ `5cf86d3`: **7 of 20 production files read `process.`** while the printed instrument (`node:` grep) reads **0** and has since `ABC-042` merged — **the clause has already produced two contradictory routing answers in two days**; 0 files under `src/`, 0 new spawns)
- [ABC-073] Eight ticket pages restate clause (b) and not one uses the test the clause states — two carry no fail-safe sentence  (BA/PM, S, P2, epic: —, since: 2026-08-16, DoR 9/10 ⚠️x1 — ordering on `ABC-072`; the residual risk `S1` named is **already realised**: `ABC-061` (`P1`, `DoR 10/10`, pullable) and merged `ABC-065` carry the file-touch wording with **no** "it fires and the gate resolves it"; 7 live pages, 3 of them byte-identical; **promote to P1 the moment `ABC-061` is pulled**; 0 files under `src/`)
```

## Board row EDITS owed — three stale ⚠️s, and they are not mine to make

The `ABC-042` ordering blocker is **cleared** (`dbaf972`, 2026-08-15; `src/cli.test.ts` exists on
`main`; `G1` MET at 0.23×; UAT accepted). The three rows still carrying it:

- **`ABC-057`** — `DoR 9/10 ⚠️ ordered behind ABC-042's merge — src/cli.test.ts does not exist on main` → the premise is false; **expected `DoR 10/10 MET`** once its page's Dependencies section is repaired.
- **`ABC-058`** — `DoR 9/10 ⚠️ same ordering` → same, **plus** five cited line numbers in `src/cli.test.ts` have drifted (`:787`→`:843`, `:775-793`→`≈:831-849`, `:769`→`:825`; `:158` and `:45` still hold).
- **`ABC-059`** — `DoR 9/10 ⚠️ same ordering` → same.

**Do not bump these on the board alone.** Each page's `## Dependencies` and `## Definition of Ready`
sections state the blocker in prose; a row bumped without the page leaves the board contradicting the
ticket. **Recorded as a finding-shaped observation, not applied silently — which is what the subtask
asked for.**

## Traceability rows owed

`plans/traceability.md` — two new rows, `ABC-072` and `ABC-073`, both `Status: Backlog`, requirement
linkage `—` (neither traces to a product requirement: both are process/threshold repairs, and saying
so is more honest than attaching them to an epic they do not serve). **The Orchestrator's pen.**
