---
id: 20260812T194500Z-architect-design-artifact-ref-audit-outputs-c802af15
kind: artifact-ref
by: architect-design
at: 2026-08-12T19:45:00Z
verified_by:
confidence: high
refs:
  - arch-audit-2026-08-12
  - memory-bank/30-architecture.md
  - memory-bank/00-index.md
  - plans/nfr-catalog.md
  - NFR-008
supersedes:
---

# What this audit wrote, and what it deliberately did not

> **Hand-authored, not a `finding`.**

## Files changed — three, all on `grugops/audit-architecture`

| file | change |
|---|---|
| `memory-bank/30-architecture.md` | **REWRITTEN to as-built.** 17 modules, 8 levels, the measured graph, the type-only/runtime edge split, `toSan` added to the transient-mutation pattern, the renderers'-own-replay pattern added, the loop-owns-no-I/O pattern added, deployment posture re-verified bullet by bullet. In scope per the brief |
| `memory-bank/00-index.md` | ADR count **seven → eleven** (`ADR-0001`–`ADR-0011`), next free id named, `30-architecture.md` re-described as as-built after `EPIC-001` **and** `EPIC-002`, plus a line putting the census burden on whoever writes `ADR-0012` |
| `plans/nfr-catalog.md` | **One additive audit note appended under `NFR-008`.** File-count headroom, the CPU-binds-first correction, the stale `*.nfr.test.ts` screen census |

## The catalog edit, evidenced rather than asserted

**No target, bar, level, measured figure or `UNKNOWN - verify` marker moved.** The `NFR-00[1-8]` row
lines were hashed together before and after the write:

```
before  sha256 325c5c034b359d8c5a15895e453f9ff0bddec040d05f8647d7a1eccce6d0f6d4
after   sha256 325c5c034b359d8c5a15895e453f9ff0bddec040d05f8647d7a1eccce6d0f6d4   (identical)
matched row lines 15 -> 15,  table lines 39 -> 39
```

**`NFR-008`'s 3 s / 13 s level is Olger Oeselg's, ratified in person, and was not touched.**

## Not written, and why

- **`ADR-0012` — deliberately NOT written.** No decision is genuinely owed; the reasoning is in the
  verdict note. **`ADR-0012` remains the next free id.**
- **No production code, no tests.** `src/` is untouched — zero files changed under it.
- **No ADR was edited.** `ADR-0008` / `ADR-0009` / `ADR-0010` were read and not re-opened;
  `ADR-0008`'s stale census is reported in the catalog, not corrected in the ADR.
- **`plans/board.md`, `plans/metrics.md`, `plans/tickets/`** — other agents' lanes this hop, untouched.
- **`plans/traceability.md`** — untouched, and **the trace rows for this audit are OWED.** BA/PM is
  cutting tickets concurrently and that file is the highest-collision surface on the board. Flagged
  rather than raced for.
- **No ticket file and no ID allocated.** Work implied by this audit is described in prose in the
  forward-fit note for someone else to cut.

## Analysis scripts

The graph builder, the stdout-hazard reproduction and the headroom arithmetic were written and run
**in the session scratchpad, outside every worktree** — deliberately not added to the repo, since
this hop writes no code. **No file in any worktree was written by any measurement**; the hazard
reproduction read `src/` by file URL only.

## Degradations recorded, not glossed

- **The queue claim was made BY HAND.** No `scripts/claim.js` exists in this install; the claim
  directory was created with a plain `mkdir` (still the atomic primitive) and `claim.md` written by
  hand. The `claimed/` parent did not exist in this worktree and was created first with `mkdir -p` —
  **only the leaf `mkdir` is load-bearing as the claim.**
- **These notes were hand-authored.** No `scripts/context-io.ts` in the repo or the kit (there is no
  `scripts/` directory at all) and no `mcp__grugops__propose_note` in this session. `human_admission`
  is `off` and no `§14-gate` stamp exists under this task, so **every note here is
  `claim` / `observation` / `decision` / `artifact-ref` and none is a `finding`.** No derived
  `index.md` / `index.jsonl` was produced, because the sanctioned renderer that produces them does
  not exist.
- **The suite was not run.** `node_modules` is not installed in this worktree, so the brief's
  807/807 green is not independently confirmed here. **No structural finding depends on it.**
