---
id: 20260812T160300Z-software-engineer-observation-n8-lane-and-the-abc019-question-d4a15b37
kind: observation
by: software-engineer
at: 2026-08-12T16:03:00Z
verified_by:
confidence: medium
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ADR-0008
  - NFR-008
  - NFR-002
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# `N8-LANE`: the protocol CANNOT resolve this change, so the floor is reported and not a number — and the `ABC-019` question is answered by RECONSTRUCTION, which is said plainly

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. **`confidence: medium`, and the reason is the subject**: §1's whole
> result is that the instrument cannot resolve the quantity, and §2 is a measurement on a replica
> rather than on `ABC-019`'s own gate. **The runs happened; what they can support is limited, and the
> limit is the finding.**

## 1. `N8-LANE` — measured on `ADR-0008` clause 4's protocol, and it comes back UNRESOLVABLE

**Protocol, run as ratified**: CPU (user + sys), median of **paired per-round deltas**, **n = 9**
interleaved rounds with the order rotated each round and **round 0 discarded** (8 usable), one fresh
process per run, **identity null control mandatory**. Both arms are throwaway out-of-tree copies of
this worktree differing only in `src/history-pane.nfr.test.ts`.

| arm | median delta | range | sign |
|---|---|---|---|
| **CHANGE** — landed − pre-containment | **−74.5 ms** | −246 … +190 ms | 6 neg / 2 pos |
| **NULL (identity)** — pre vs pre | **−25.0 ms** | −98 … +162 ms | 5 neg / 3 pos |

**The change's median sits INSIDE the null control's own range.** The identity control's half-spread
is **±130 ms, or 1.44% of the ~9.0 s lane CPU** — consistent with `ADR-0008`'s claim that the null
reads ≤ 1.5% with the sign at chance.

> **VERDICT: `UNKNOWN - verify` — the delta is BELOW THIS INSTRUMENT'S FLOOR and I am reporting the
> floor rather than a number it cannot support**, exactly as the brief instructed. **The floor is
> ±130 ms CPU (1.44% of lane CPU) at n = 8 paired rounds.** The measured median is in the *helpful*
> direction; **it is not claimed as a saving**, because the null control produced a median of the same
> sign and comparable size from two identical trees. **The protocol was already recorded as unable to
> resolve a 4.34 ms delta; this hop is a second, independent instance of the same limit.**

**The structural reason, which is why the number was never going to be resolvable.** `N8-LANE`'s scope
is *"every file the branch adds under `src/`"* and **this branch adds ZERO files** — verified with
`comm` against `HEAD`. The change is one regex literal and one comment block: no new test, no new
`it`, no new file read, no new process. The widened expression performs the **same single `.test()`
call per production module** the delivered one did. **There is no mechanism by which it could cost
milliseconds**, and the measurement agrees by failing to see one.

**`ADR-0008`'s two ratified clauses, measured on the landed tree, `PERFT_DEEP` unset, 7 rounds:**
wall median **1.80 s** (bar ≤ **3 s**) — **holds**; CPU median **8.86 s** (bar ≤ **13 s**) —
**holds**. Lane file count stays **TWO**; `dependencies` stays `{}`.

**The lane TOTAL is NOT claimed and is not mine.** `NFR-008`'s ≤ 650 ms content allowance, the ~75 ms
margin and the contention with `ABC-028` are the lane's own accounting; **`ABC-026` owns the total and
`NFR-002`/`NFR-008` `MET`/`MISS` is Security/NFR's.** No bar, target, level or `UNKNOWN - verify`
marker was moved by this hop, and `plans/nfr-catalog.md` was not opened.

## 2. The honest question — does this build still leave `ABC-019`'s two instruments green?

**RECONSTRUCTED, NOT RUN ON `ABC-019`'s TREE — and that distinction is the answer's first sentence.**
I did not enter `../cli-chess-ABC-019`; every `ABC-019` file was read from the **git object database**.

**What makes this reconstruction exact rather than approximate, and it was checked rather than
assumed:** `git diff --stat <merge-base> grugops/ABC-019-turn-loop-skeleton -- src/` shows `ABC-019`
touches **exactly three files** — `turn-loop.ts`, `turn-loop.test.ts`, `turn-loop.nfr.test.ts`, all
**additions**, `+2039 / −0`. **It does not edit `src/history-pane.nfr.test.ts` at all** — the copy on
its tip (`e27a8387…`) is byte-identical to the merge-base's, i.e. it is simply behind. **So on rebase
`ABC-019` takes this build's instrument verbatim, with no conflict in that file**, and
`landed16 + ABC-019's three files` IS its post-rebase `src/`.

**Measured on that tree:**

| | result |
|---|---|
| full suite | **804 passed (804) on 28 files**, 0 failed |
| skip count | **0** |
| the regex guard — *"licenses src/history.ts's runtime importers: the set EQUALS the declared licence"* | **passed** |
| the probe — *"evaluates history.ts's module body NOWHERE ON THE FRAME PATH"* | **passed** |
| `turn-loop.ts` md5 | `bd793612476c9d0eac28b75e1e3297cc` — reproduced |

**Answer: YES, on a byte-faithful replica of the tree `ABC-019` will rebase onto — both instruments
green, and `ABC-019`'s own 52 tests green beside them.** The ticket recorded its tip as
*"2 failed / 789 passed on 28 files"*; on this reconstruction it is **804/804**.

**What this is NOT.** It is not `ABC-019`'s gate, it is not a run in `ABC-019`'s worktree, and it does
not account for anything outside `src/` — a rebase can still conflict in `plans/`, `.grugops/` or the
ticket pages, none of which I can see from here. **The `src/` half of the question is measured; the
merge itself remains `ABC-019`'s hop and the Orchestrator's sequencing.**

## 3. The probe's other bars, re-measured because this file was opened

- **Determinism: 12 consecutive runs of the instrument, 12 × 8/8, 0 flaky.** The `## Security / NFR
  triggers` target (12/12 after the change) holds. **No duration is compared to anything anywhere in
  the file** — unchanged, because no assertion was added.
- **All three controls still falsifiable, re-proven rather than assumed.** With `roots` emptied on the
  landed tree the probe fails at its **positive** control — `the probe loaded the pane: expected [] to
  include 'history-pane.ts'` — so an empty closure still cannot pass. The **arming** control reports
  `history.ts` in every green run. The `?arming` query, the fd-3 channel and the `WSTDERR` behaviour
  are byte-untouched.
- **The pane's runtime closure and `NFR-002`'s premise are untouched** — the probe's roots, the
  `FRAME_PRODUCERS` declaration and the `LICENSED_DRIVERS` declaration were not edited.
