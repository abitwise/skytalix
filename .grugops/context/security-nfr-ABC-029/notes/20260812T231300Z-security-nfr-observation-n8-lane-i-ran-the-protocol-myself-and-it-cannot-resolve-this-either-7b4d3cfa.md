---
id: 20260812T231300Z-security-nfr-observation-n8-lane-i-ran-the-protocol-myself-and-it-cannot-resolve-this-either-7b4d3cfa
kind: observation
by: security-nfr
at: 2026-08-12T23:13:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-026
  - ADR-0008
  - NFR-008
  - N8-LANE
  - src/history-pane.nfr.test.ts
supersedes:
---

# `N8-LANE`: I ran `ADR-0008`'s protocol on my OWN rig rather than inheriting a floor. It cannot resolve this change either — **and my floor is THREE TIMES WIDER than the one on the record**

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. **`N8-LANE`'s delta for `ABC-029` is `UNKNOWN - verify`.** The floor
> below is reported **as a floor** and is **not converted into a number**. **No negative delta in
> this note is a saving.**

## The rig, and the controls that make it worth reading

Built in a fresh out-of-tree root, four trees, `node_modules` symlinked:

| arm | instrument md5 | tests |
|---|---|---|
| **WITH** | `16bf2f50c93e2e896b5406cbfa772b8b` (the gated tip) | **755** |
| **WITHOUT** | `1d33bea667cc792e1fa1fd4030caa718` (the same tree with the witness insertion reverted, taken from the **git object database**, `7084c5e^`) | **752** |
| **NULLA / NULLB** | both `16bf2f50…` | 755 / 755 |

**Three preconditions were asserted before a single timing was taken** — the record on this stack is
that a lane rig fails silently in the direction of a stronger claim:

1. **The identity null control's two arms are byte-identical** — `diff -r` clean. Its true delta is
   **ZERO by construction**.
2. **The two real arms differ in EXACTLY ONE file** — `diff -rq` reports only
   `src/history-pane.nfr.test.ts`.
3. **Both real arms are GREEN before being timed** — 755/755 and 752/752 on 26 files.

Protocol as `ADR-0008` clause 4 states it: CPU (user + sys), **one fresh OS process per run**,
**interleaved** with the arm order rotated by round parity, **round 0 discarded as warm-up**, median
of **paired per-round deltas**, **n = 8**, identity null control **mandatory**.

**The median helper was written to avoid the bug this stack already recorded** — a leading blank line
counted as a `0` sample. Medians were computed in `node` over an explicit array, printed with the raw
and sorted vectors beside them so the arithmetic is auditable.

## The measurement

| | **REAL** (witnesses present − absent) | **IDENTITY NULL CONTROL** (truth is ZERO) |
|---|---|---|
| raw paired deltas (ms) | 78, −236, −44, 107, 107, 81, −84, 268 | 99, 390, 4, −145, −149, 55, 113, −73 |
| sorted | −236 −84 −44 78 81 107 107 268 | −149 −145 −73 4 55 99 113 390 |
| **median** | **+79.5 ms** | **+29.5 ms** |
| min … max | −236 … +268 | **−149 … +390** |
| spread | 504 ms | **539 ms** |
| sign split | **5+ / 3−** | **5+ / 3−** |

## The verdict, stated so it cannot be misread

- **The real median (+79.5 ms) sits INSIDE the null control's own spread (−149 … +390 ms).**
- **The sign split is the null control's, digit for digit — 5+ / 3−.**
- **The null control's median is +29.5 ms when the true answer is ZERO**, and its spread is 539 ms
  across two trees that are byte-identical.

**The instrument cannot see this change.** **The `N8-LANE` delta for `ABC-029` is
`UNKNOWN - verify`.**

**THE FLOOR, REPORTED AS A FLOOR: ±390 ms CPU at n = 8 paired rounds** — the widest excursion an
**identity** comparison produced on this machine at this hop. That is **4.3% of the ~9.0 s lane CPU**
and **60% of the 650 ms content allowance**. **I do not convert it into a delta, and it is not
`ABC-029`'s cost.**

**This is the FIFTH consecutive hop to report that `ADR-0008`'s protocol cannot resolve its change,
and the first to reach that conclusion on a rig it built from scratch rather than by declining to
re-run one.**

## Two things I will not let pass quietly

**1. My floor is WIDER than the record's, and the record's should not be quoted forward as if it were
a property of the protocol.** The Engineer reported **±130 ms**; I measure **±390 ms** running the
same protocol on the same reference machine. The difference is the machine's state, not the method —
absolute lane CPU **drifted upward across my rounds**, from ~8.86 s to ~9.44 s, in **both** arms.
**The paired design exists to cancel exactly that drift and it demonstrably does not cancel it fully:
the null control's own worst round is +390 ms.** So the honest reading is that the floor is a
**session-dependent quantity**, and any single value for it is `UNKNOWN - verify` on another session.
**Quoting ±130 ms forward as *the* floor would understate the noise by a factor of three.**

**2. Three of my eight real deltas are negative (−236, −84, −44). NOT ONE OF THEM IS A SAVING.** The
null control returns negatives too (−149, −145, −73) on trees that are byte-identical, where a saving
is impossible by construction. **A negative paired delta here is noise with a sign, and reading it as
a cost reduction is the trap the brief named.** The same applies to the "with" median coming in below
the "without" median on earlier hops.

## What CAN be said mechanically, and is NOT a lane figure

`ADR-0008` clause 4 scopes the per-ticket account to *"every file the branch adds under `src/`"*.

- **This branch adds ZERO files under `src/`.** `git diff --name-status main...HEAD -- src/` is
  **`M` only**, three files. **So the FLOOR ACCOUNT (`files × ~160 ms`) cannot have moved.**
- **Test file count is 26 before and after**, production modules 16 — both unmoved.
- `ADR-0008`'s two **ratified** clauses are **MET with room** and those are resolvable without a
  paired protocol: wall **1.669 s** ≤ 3 s, CPU **8.866 s** ≤ 13 s, medians of 7 (see the sibling
  `observation`).

**The lane TOTAL is `ABC-026`'s and remains disputed. I did not settle it, did not re-derive it, and
did not open `plans/nfr-catalog.md` for edit** — no bar, target, level or `UNKNOWN - verify` marker
moves by anything in this note.
