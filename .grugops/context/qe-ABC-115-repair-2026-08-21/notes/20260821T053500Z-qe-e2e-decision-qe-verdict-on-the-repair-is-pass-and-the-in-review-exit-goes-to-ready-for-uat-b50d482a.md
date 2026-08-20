---
id: 20260821T053500Z-qe-e2e-decision-qe-verdict-on-the-repair-is-pass-and-the-in-review-exit-goes-to-ready-for-uat-b50d482a
kind: decision
by: qe-e2e
at: 2026-08-21T05:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - G-QE115-2
  - G-QE115-3
  - G-QE115-4
  - G-QE115-5
  - A10
supersedes:
---

# QE RE-VERIFICATION VERDICT ON `ABC-115`: **PASS** — `In Review` → `Ready for UAT`, with three residuals named and none of them blocking

**NOT A STAMP.** `context.human_admission` is `off` and no `finding` is admissible on this install,
so this verdict is a hand-authored `decision` in git. **It is a QE result. It is NOT a UAT, NOT a
business acceptance, and NOT a merge.** 13 production lines shipped, so the zero-production-lines
waiver does not apply and acceptance is the named owner's word alone. **A green QE run is not that
word and must never be read as it.**

I failed this ticket on 2026-08-21 at 02:35. I pass it now, and the two defects that caused the
FAIL are the reason.

## The two defects I raised are closed, and I closed them by measurement, not by reading a report

- **`G-QE115-1` — CLOSED.** `A10` reds against the one-token mutant I built myself, as **the only
  red of 61**, in a tree established green at 61/61 before mutation. The re-thrown branch is
  genuinely reached: the delivered stack's caret sits on `src/cli.ts:159`, the `throw error` itself,
  with `EBADF`. The clause that a 13-line diff exists for is now asserted by something that runs.
- **`G-QE115-2` — CLOSED, and better than I asked.** The superseded `<= 0.5 s` lump clause and the
  "THE CPU CLAUSE IS BREACHED" sentence survive only inside an explicit retraction that says the
  block once carried them and that **the breach does not exist**. I grepped for both myself. The
  clause in force is stated once and correctly. The correction was announced instead of smoothed
  away, which leaves the next reader able to see that the file had lied — I did not ask for that.
- A **third** false sentence (the file header's "six children need a real `head`") was found
  unprompted and corrected; I counted the builders from source and the amendment is true as written.

## What else passes, said in full so the PASS is not read as a wave-through

- **All four mandatory gates green** at the tip: lint, typecheck, build, unit (**1213 passed**,
  40 files). Test integrity `No findings.`, **skip count 0**.
- **The exit-code contract answered on all three codes**, each driven independently of the suite:
  **0** on a closed stdin and on this ticket's own `| head -2` Given (stderr 0 bytes), **1** on a
  refused command line, **70** on a thrown seam with one line and no stack.
- **A real pty, a real move**: `e4` played, engine answered `Nc6`, session ended `NODE_EXIT=0`, 3/3.
- **No flake at my bar**: `src/cli.test.ts` **10/10**, full lane **5/5**.
- **Nothing weakened.** The 128/34 test diff is purely additive in executable terms — zero
  assertions removed, zero loosened; the only two changed executable lines are a title and the pin
  the residual ruling raised on the page.
- **`A10` audited as a subject, not used as an instrument.** It reads the product's status from the
  `NODE_EXIT=` marker and never from the wrapper; I proved that by mutating the row to read
  `child.status` and watching it go red on **both** builds.

## The three open items, each named, each ruled, none blocking

1. **`G-QE115-3` — the `N8-SPAWN` wall and per-child CPU clauses are asserted by nothing mechanical.
   RULING: knowingly-open residual. It does NOT block.** The cheap close is barred by
   `plans/nfr-catalog.md`'s standing rule that no wall-clock assertion belongs in the default suite,
   so it is a genuine design question for Architect/Design and `ABC-108`, not a bench fix that was
   skipped. The clauses are met on three independent measurements and the per-child figure went
   **down** when the seventh child was added. Full reasoning in the `decision` note of this task.
2. **`G-QE115-4` — `A10`'s own trap docblock states the wrong failure direction** ("green on every
   build"; a row that falls in it is in fact **red** on every build, measured). The instruction it
   gives is correct and nothing material is mis-taught. Recorded, non-blocking, deliberately not a
   send-back — see below.
3. **`G-QE115-5` — `ABC-066`'s derived refusal guard is blind to `A10`'s child**, whose product
   exits `1` without advertising a usage line. Measured: a wrapper-transparent derivation turns 6
   into 7 and reds that row. It is the residual BA/PM accepted by name, seen from a second angle;
   the residual's cut trigger does **not** fire, and I checked rather than stretched it. Handed to
   whoever next opens that guard.

## The reasoning, stated so it can be overturned on the same terms I used to FAIL

At my FAIL I wrote that passing a diff shipping a false sentence would make `ABC-114` a rule the
factory applies to everything except itself. **`G-QE115-4` is a false sentence, in this file, in
this diff, and I am not sending the ticket back for it. I owe an account of why that is even-handed
and not a softening.**

`G-QE115-2` taught a **superseded ceiling** and **accused the delivery of a breach it had not
committed** — a reader acting on it would carry the wrong budget forward and would believe this
ticket blew it. `G-QE115-4` gets the *direction* of a warning wrong while giving the *right
instruction*: read `NODE_EXIT=`, never `child.status`. A reader obeying it is led to the correct
place, no budget moves, no delivery is accused, and the code it describes is correct. **Materiality
is the line, and it is the line I drew at the FAIL too** — I wrote there that `G-QE115-2` "fails no
criterion as written" and failed the ticket anyway on its consequence. `G-QE115-4` has no
consequence I can measure. Sending a ticket back on it would be the rule applied capriciously, and
that damages `ABC-114`'s principle more than letting a one-clause comment fix wait for the next hop
that opens the docblock.

**A reader who holds that any false sentence in a diff is a send-back should FAIL this ticket, and
that reading is defensible.** I have named the sentence, quoted it, given its line number and given
the one-clause correction, so that reader loses nothing by my call being wrong.

## The board move, and it is mine alone

**`In Review` → `Ready for UAT`.** `In Review` 1/3 → 0/3; `Ready for UAT` 0/4 → 1/4, inside the
limit. That is one move on one ticket and it is the only move I make.

## Not done here, so no silence reads as consent

Nothing fixed — `git status` on `src/` clean, every mutant restored and `cmp`-verified, `src/`
byte-identical to `8d4980c`. `src/cli.ts`, `ADR-0016`, `AGENTS.md`, `plans/nfr-catalog.md` and every
other ticket untouched. The exit-code ruling, the CPU-clause ruling and the count-ceiling ruling
**not** re-opened. `.grugops/test-skips.md` read, never written. **Nothing merged, nothing deployed,
no UAT conducted, and nothing signed.** Ten branches remain stacked unmerged; the merge is the
owner's to turn and the acceptance is his word.
