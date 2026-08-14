---
id: 20260814T172802Z-architect-design-observation-criterion-changes-owed-bapm-4f1ff3a6
kind: observation
by: architect-design
at: 2026-08-14T17:28:02Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A5
  - A6
  - A9
  - A10
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# The criterion changes these rulings require — FOUR rows, ONE owner: BA/PM. I did not edit the ticket.

> **Collected in one place so BA/PM reads one note, not three.** `plans/tickets/` is BA/PM's file and
> was **not** opened for writing on this hop. Each row below states the change and the reason; the
> **naming and wording of all four are BA/PM's**, not mine.

| # | criterion | change required | why |
|---|---|---|---|
| **1** | **`A5`** | *"zero frame rows are written"* must name **both channels, unioned** — stdout **and** stderr | the channel is the engineer's, so a build that writes the board to the OTHER channel passes a one-channel assertion. This is test note 4's own failure mode (*"prints the board and then complains"*) surviving the criterion that exists to catch it |
| **2** | **`A6`** | identical change, same sentence | same reason; the two rows share the defect because they share the phrase |
| **3** | **`A9`** | *"no other new **module**"* → *"no other new **production** module"* (`ADR-0011` clause 1's expression: `.ts` under `src/`, not a `.test.ts`) | **measured:** the merged precedent `A1` cites by name spawns via `process.execPath` (`src/history-pane.nfr.test.ts:582`), so under the widest reading of *"module"* every build satisfying `A1` breaks `A9`. Same defect class as the parent `claim` on bar 1. `A9` says *"file"* in its first clause and *"module"* in its second; only the production reading is satisfiable |
| **4** | **`A10`** | its file list and its *"`src/` otherwise byte-identical"* clause must admit **`src/history-pane.nfr.test.ts`** — the licence edit — and the ticket should say the edit is expected | **`A10`'s two halves contradict each other on the delivered build**: the licence must gain the entry point or the suite is red, and the licence lives in a file `A10` requires to be byte-identical. Measured; see the census `decision` and the measured-builds `observation` |

**Rows 1–3 are wording. Row 4 is the blocking one** — it is the difference between a ticket that can
be built and one that cannot, and it is the reason the census hop is worth more than the two rulings
it was asked for.

## Criteria I checked and did NOT change, stated so nobody re-opens them

- **`A7`** — *"the entire emitted stream"* stands as written. Its Given is the success path, where
  stderr is empty, so all three readings of the phrase return the same verdict. Ruled to mean
  **stdout**; **no row moves.**
- **`A8`** — same phrase, same ruling, **no row moves**. It is `A8` that forces the stdout reading
  (two pipes have no defined interleaving, so *"ends with exactly one `\n`"* would flake under a
  merged capture), but the existing words already carry it.
- **`A3`** — **requirement, verdict and warning are all correct; no row moves.** Only its
  parenthetical's premise misdescribes `ADR-0011` (*"names this ticket as the trigger"* → the ADR
  names a file-placement condition and names this ticket as where it is **checked**). A prose
  correction if BA/PM wants one; **I am not manufacturing a criterion change out of it.**
- **`A2`** — correct and sufficient. *"Zero `export` statements, asserted textually over the diff"* is
  exactly clause 4's discriminator and is the instrument that makes the census move mechanically.
- **`A11` / `NFR-007`** — **not touched, deliberately.** `plans/nfr-catalog.md` was **not opened.**
  The catalog row is owed a reading *"the day distribution is decided"* and that day is not today.

## Two fences I did not go near, recorded so the record shows they were considered

- **The distribution decision is reserved to a human** (`ADR-0007`, `AGENTS.md` § Deployment posture,
  `EPIC-006`). Nothing above touches it, no ADR was written that implies it, and `A10`'s
  key-by-key `package.json` guard — the mechanical fence on it — is **unchanged by row 4**, which
  only widens the *file list* to admit one existing test file under `src/`.
- **The channel itself** (stdout or stderr) stays the **engineer's**, exactly as `A6` says. I ruled
  the fence around it, not the side of it.
