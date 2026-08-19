---
id: 20260820T170000Z-qe-e2e-decision-a1-a4-are-answered-and-this-hop-stops-at-the-a5-fence-e3f50a26
kind: decision
by: qe-e2e
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T17:00:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A1
  - ABC-110/A2
  - ABC-110/A3
  - ABC-110/A4
  - ABC-110/A5
  - NFR-008
  - ADR-0008
  - ADR-0014
supersedes:
---

# `A1`–`A4` are answered and **this hop STOPS**. Here is what the owner is being asked to choose between, with each option's measured saving and its coverage price by criterion id. **I choose nothing, and no test file moved lane**

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install. **This
is not a UAT, not an acceptance, and not a human signature.** It records that a measurement hop
finished at its fence.

## What the owner is being asked

**`NFR-008`'s CPU clause is breached by 1.480 s and there are exactly three ways out. Two of them are
his and one is an agent's, and the agent's one changes what the default lane guarantees.** He is
being asked which. **The measurement is now done, so for the first time the question can be asked
with numbers on both sides instead of one.**

### Option A — move whole test files behind an opt-in flag. **An agent can execute this. It costs coverage in the default lane.**

Every set below is measured. **The minimum is two files** — the largest single file, `engine.test.ts`
at 1.400 s, falls **80 ms short** on its own.

| set | **measured saving** | residual vs 1.480 s | resulting median CPU | **criteria moved behind a flag, by id** |
|---|---|---|---|---|
| **OPT-1** `engine` + `perft` | **2.550 s** *(measured jointly, 8/8)* | **−1.070 s, CLOSED** | **11.930 s** = 91.8% | `ABC-078/A2 A3 A3-identity A4 A5 A6 A7 RF-1` (8) + `ABC-006/AC1 AC2 AC3 AC5` (4) = **12** |
| **OPT-2** `engine` + `search` + `search.qe` | **2.500 s** *(measured jointly, 8/8)* | **−1.020 s, CLOSED** | **11.980 s** = 92.2% | `ABC-078` ×8 + `ABC-077/A1–A7` (7) + `ABC-077/QE-G1 QE-G2 QE-G3` (3) = **18** |
| **OPT-3** `engine` + `history-pane` | 2.175 s *(arithmetic; additivity measured super-additive, so conservative)* | −0.695 s, CLOSED | 12.305 s = 94.7% | `ABC-078` ×8 + `ABC-017/A1–A10, A14` (11) = **19**, and **`ABC-017/A11`, `A13` and `A6.3/A6.4` STAY in the default lane** |
| **OPT-4** `perft` + `history-pane` | 1.830 s *(arithmetic)* | −0.350 s, CLOSED | 12.650 s = 97.3% | `ABC-006` ×4 + `ABC-017` ×11 = **15**, with `ABC-017/A11`, `A13` retained. **Leaves `ABC-078` whole** |
| **OPT-5** `engine` + `perft` + `history-pane` + `search` | **3.860 s** *(measured jointly, 8/8)* | −2.380 s, CLOSED | **10.620 s** = 81.7% | **34 criteria.** Buys real headroom for the eleven files still queued |

**The cheapest option by criterion count that still closes it is `engine` + `perft` at 12 criteria for
2.550 s.** **The most expensive per criterion is anything containing `san.test.ts`: 20 criteria for
0.510 s, 26 ms per criterion.** Full per-file table, all eight candidates, in the `A4` note.

**Three prices in Option A that are not just counts, and he should see them named:**
- **`ABC-025/A4` is the SOLE guard on three known wrong builds of `toSan`** (`Q13 Q14 Q36`). Any set
  containing `san.qualifier.hardening.test.ts` puts them behind a flag.
- **`ABC-077/QE-G2` and `QE-G3` exist because swapping the rook and queen material values left ALL
  963 tests green.** Set `OPT-2` moves them.
- **`turn-loop.nfr.test.ts` is a permanent NFR guard**, and moving it takes `NFR-002`'s
  derive-once-per-ply bar out of the default lane. **It appears in no set I have listed, and that is
  deliberate** — it is the cheapest 395 ms on the table and the one I would not spend. **That is my
  reasoning shown, not a choice made.**

### Option B — move `NFR-008`'s 13 s level. **HIS OUTRIGHT. I have not priced it, recommended it, or argued it obsolete.**

**What Option A's existence changes about Option B: it is no longer the only way out.** `ABC-108`
argued the breach down to "what is damaged is the meaning of a number". **A remedy now exists that
does not touch his level, and it costs 12 acceptance criteria in the default lane.** He can weigh a
level against a coverage price; before this hop he could not.

### Option C — accept the breach for a stated period. **`ABC-110`'s own named demotion trigger, and also his.**

Recorded here only because the ticket names it. **If he rules this, `ABC-110` drops to `P2` on his
words and their date and `ADR-0014` is superseded by the ADR that records him — never by an agent
deciding the breach is tolerable.**

### The fourth thing, refused here in writing for the FIFTH time

**`isolate: false` is UNAVAILABLE and is not an option.** `ADR-0008` decision 7: saves 30–36%, green
in **4 of 21** observed runs, and disarms `zobrist.nfr.test.ts`, `gameend.nfr.test.ts` and
`san.nfr.test.ts`. **I did not measure it, did not re-test it, and did not propose it.** Recorded so
the fifth write-down does not become a sixth. **I refused a disguised sixth as well** — merging the
four `*.nfr.test.ts` guards into one file to shed three floors re-creates the same shared-registry
failure by hand. It is in the `A3` note by name.

## What I did NOT do, itemised against the brief's fences

- **No test file changed lane.** `src/` is **byte-identical** across my entire diff. Every removal was
  in a throwaway `git archive` copy outside the repository.
- **No test deleted, thinned or consolidated.** The method itself is rejected in the `A3` note.
- **`plans/nfr-catalog.md` is byte-identical to `main`** — `git diff main -- plans/nfr-catalog.md` is
  empty; **verified, not promised**. `A7`'s own `63f66795…ca31` I could **not** reproduce because no
  page defines the byte range it hashes; I verified the stronger whole-file property and **named the
  gap** rather than assert a match. See the `A2` note.
- **`AGENTS.md` untouched** (`A9` is not mine; `ABC-109` is live in it). **No `package.json`, no
  `vitest.config.ts`, no production code.** The harness is **outside the repository and not
  committed** — `NFR-008`'s stated firing threshold is not tripped; **`N8-SPAWN` stays 0 ms**.
- **The WALL clause is NOT ruled.** Wall figures are in the raw TSVs as data. Warm/cold is that
  ticket's, and it is an input to `A6`.
- **`N8-LANE`'s 5% not re-derived, no ticket's 650 ms line re-cut.** `N8-LANE` charge for this hop:
  **0 new test files, 0 new tests, 0 new spawns → 0 ms against 650 ms — AND the clause state is
  BREACHED**, because it is. The first half alone would be the sentence `ADR-0014` decision 4 forbids.
- **`NFR-008`'s 3 s / 13 s level not moved.** No board column moved, no DoR table edited, nothing
  merged, nothing deployed.
- **A quiet machine was NOT claimed.** Loads ran 6.72–22.52. The contamination was **sized**: the
  paired statistic's load sensitivity is **0.2–3.4% on the joint sets**, against a margin of **72%**
  over the deficit — a ratio of roughly **35x**, and its residual direction is conservative.

## Two things the next hop needs and does not have

1. **`ABC-006` has no criterion ids.** The `AC1`–`AC5` in the `A4` note are mine. **Number them on the
   ticket before any re-homing table cites them, or two hops will number them differently.**
2. **`A7`'s hash has no defined byte range.** Whoever executes `A6`–`A9` cannot verify
   `63f66795…ca31` as written. **Define it or restate `A7` as a whole-file hash.**

## The fence

**`A4` is answered, so I stop.** `A5` is a human decision and choosing between the options above is
exactly the failure `ABC-110` was cut to prevent. **Nothing after this note may execute until the
owner's words and their date are recorded verbatim and the record names which option he took.**
