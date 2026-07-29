---
id: 20260729T150600Z-orchestrator-observation-7b2f91c4
kind: observation
by: orchestrator
at: 2026-07-29T15:06:00Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - EPIC-004
  - NFR-001
  - NFR-005
  - ADR-0001
  - plans/nfr-catalog.md
  - memory-bank/30-architecture.md
  - src/legal.ts
  - src/fen.ts
supersedes: 
---

Routing + synthesis record for task `architecture-audit-2026-07-29` (request: "audit current
architecture"). No board move, no ticket move, no code change. Read-only audit.

**Routing.** Classified `brownfield-bootstrap`, run in AUDIT MODE against a repo the factory
itself built — Workflow `01-bootstrap-brownfield.md`, steps 1/3/4 only. Steps 2 (AGENTS.md
Scribe) and 5 (safe first tickets) were deliberately skipped: `AGENTS.md` is filled and its
commands were verified 2026-07-22 under ABC-008, and cutting tickets is BA/PM work that
follows a human decision on this audit, not part of it.

Three role agents scheduled in PARALLEL at width 3/3 — at `queue.wip_limit`, not over:
brownfield-mapper (evidence), architect-design (judgment), security-nfr (NFR envelope). The
security-nfr activation rests on exactly one trigger, `performance-sensitive flow`; that agent
independently re-checked and confirmed the other triggers are genuinely absent
(`compliance_regime: []`, no auth/data/network/deps surface) rather than accepting the
assessment from me. No data was relayed between the three; each read the repo itself and
published its own note into this folder.

**The convergence that matters.** Two agents measured the generator independently and agreed:
architect-design recorded `legalMoves` at 5,298 ns/op at kiwipete (~189k/sec); security-nfr
recorded 187,912 nodes/sec at kiwipete by ABC-008's own metric-B definition. Independent
paths, same number. That agreement is the strongest single result in this audit and it is bad
news for `NFR-005`: the catalog records metric B = 2,639,455 nodes/sec with "~5x headroom",
and the real generator is 7.5x-16x below that proxy — 167k-351k/sec with NO evaluation
running, against a target of >=500k/sec WITH evaluation. `plans/nfr-catalog.md` currently
reads better than reality on that row.

`NFR-001` is separately and genuinely MET: `npm run perft` measured 6.09M-6.21M nodes/sec
against a >=1M target. The two rows are not in conflict — they count different denominators
(97.3% of perft leaves are free), and the audit's contribution is to establish that the
NFR-001 number must never be read as evidence for NFR-005.

**Correctness defect found in merged, Done, 100%-covered code.** `src/legal.ts` documents
`legalMoves` as leaving the position unchanged; on a semantically-invalid-but-grammatical FEN
(castling rights with no rook) it permanently and silently mutates its argument, producing a
phantom second king and non-idempotent results. Grammar validation in `src/fen.ts` is loud and
solid (13/13 malformed cases throw a typed `FenError`); semantic validation is absent. Latent
today because no caller accepts external FEN — live the moment EPIC-003 does.

**Structure verdict: sound, leave it alone.** Nine modules, strict acyclic DAG, depth 6, zero
cycles, no upward edge across the representation -> generation -> mutation -> rules ->
verification layering, ~1,113 production lines, 143/143 tests green, deep perft 32/32 exact,
lint and typecheck clean. ADR-0001 (0x88) is conformant in every clause — a grep for the
hand-rolled `rank * 8 + file` the ADR warned about returns zero hits. architect-design
explicitly withdrew its own leading recommendation (incremental Zobrist) after measuring it at
3.1% of node cost, and named over-reach as the largest risk in the audit. Recorded here because
a withdrawn recommendation backed by a measurement is worth more than an adopted one that was
not measured.

**Process drift, recorded not fixed.** Eight of nine `memory-bank/` files are unmodified kit
templates carrying the literal `_Updated: <date>_` placeholder, untouched across the whole of
EPIC-001; `ADR-0001` is the only memory-bank file with project content. `30-architecture.md` is
empty while a rule-complete engine core sits merged. `plans/*` and `AGENTS.md`, by contrast,
are current. The bank is the inter-session memory and it is not carrying its load.

**Honest limits of this run — no enforcement is claimed.** This repo has no `scripts/`
directory: `scripts/context-io.ts` (the SCTX-01 sanctioned writer) and `scripts/claim.js` (the
atomic claim primitive) are both absent. All four notes in this folder, including this one,
were hand-written against the schema; no validator ran, no admission check ran, no atomic claim
was taken, and `index.md` / `index.jsonl` were not regenerated. No `.grugops/queue` was created
— the three subtasks were scheduled directly, matching this repo's established convention.
Every note here is `kind: observation` with `verified_by:` empty: there is no live §14-gate
verdict for an audit, so not one result — including numbers the agents measured themselves —
was admitted as a `finding`. Nobody self-stamped.

**Next action proposed, not taken.** Correct the `NFR-005` row and its "~5x headroom" clause
against the measured numbers BEFORE `EPIC-004` is decomposed, since decomposition would
otherwise be planned on a figure the audit just refuted. The two due ADRs (game-history
ownership; legality strategy) and the `legalMoves` mutation ticket queue behind that. Awaiting
a human go — architect-design declined to author the ADRs unilaterally and I am not
overriding that.
