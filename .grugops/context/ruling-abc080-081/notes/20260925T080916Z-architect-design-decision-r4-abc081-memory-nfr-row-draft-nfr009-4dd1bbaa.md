---
id: 20260925T080916Z-architect-design-decision-r4-abc081-memory-nfr-row-draft-nfr009-4dd1bbaa
kind: decision
by: architect-design
at: 2026-09-25T08:09:16Z
verified_by:
confidence: medium
refs:
  - ABC-081
  - ADR-0025
  - NFR-005
  - plans/nfr-catalog.md
  - 20260925T080516Z-architect-design-observation-castling-pairs-subtrees-and-memory-baseline-30cea5d2
supersedes:
---

# Ruling 4 — `ABC-081` DoR item 10: a DRAFT memory row, `NFR-009`, for Security/NFR to place on the owner's word

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). **`plans/nfr-catalog.md` is NOT
edited.** It is Security/NFR's pen, and a new level needs the owner's word. The row below is a
draft only. Confidence is medium because the level is a judgment set from one machine's baseline.

## Draft row (catalog column order: ID | Category | Target | Applies to | Verified by)

| ID | Category | Target | Applies to | Verified by |
|----|----------|--------|------------|-------------|
| NFR-009 (DRAFT) | Resource / memory | **Search-held memory is fixed-size and bounded.** Everything the search keeps between nodes is allocated at a fixed size of **≤ 16 MiB total**: the transposition table plus the per-ply key array and killer table. It shows **no growth with search time**: after `gc()`, `heapUsed` and `arrayBuffers` each read within **1 MiB** of themselves across a 1 s and a 3 s search on the same position. **Over 16 MiB, or any growth over 1 MiB = FAIL.** Design point (`ADR-0025`): 4 MiB (2^18 × 16 B). | Engine search (`EPIC-004`): `ABC-081`'s table and key array, `ABC-080`'s killer table, and any later search structure | Run under `node --expose-gc`; take every read after `global.gc()`. **(a)** The structure's own `byteLength` sum is ≤ 16 MiB (a static read, no timing). **(b)** The `arrayBuffers` delta between a 1 s and a 3 s `chooseMove` is ≤ 1 MiB. **(c)** The `heapUsed` delta between the same two runs is ≤ 1 MiB. **(c) is the one that catches a growing `Map`**: a `Map`-backed table grows `heapUsed`, not `arrayBuffers`. **Watch (c) go RED against a `Map`-backed table before shipping it** (`AGENTS.md`: never ship a memory guard you have not watched go red). Wall-clock-bound, so it runs in the opt-in `ENGINE_DEEP` lane. |

## Why 16 MiB and 1 MiB

- **Baseline** (`mem.txt`): the process is 79.8 MiB RSS after importing the engine and 93.1 MiB
  after one 3 s search. At 16 MiB the search structure stays under about a fifth of a process
  that exists anyway. A local CLI game on a laptop has no stricter budget on record.
- **Need:** a 3 s search stores tens of thousands of distinct full-width positions (39 137 at
  kiwipete d6 in about 1.5–2 s; 99 063 over a 9 s d7). The 4 MiB design point holds 262 144.
  16 MiB is a 4x ceiling over the design point, so the Engineer can pick 2^19 or 2^20 entries
  **if a measurement shows it helps**, without re-opening the row.
- **1 MiB tolerance:** `heapUsed` moved 0.64 MiB across a whole 3 s search today, from garbage
  the gc had not reclaimed. A growing `Map` at 3 s would hold about 50k entries of well over
  100 B each, far past 1 MiB.

**Owner of the level:** Security/NFR drafts it into the catalog, and the owner's word ratifies
it. `A7` ("a stated fixed bound") then checks against `NFR-009` instead of against nothing.
**Until then item 10 stays ⚠️. It is no longer unanswered, but it is unplaced.**
