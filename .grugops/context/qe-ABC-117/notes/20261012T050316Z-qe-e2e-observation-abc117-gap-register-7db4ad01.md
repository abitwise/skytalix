---
id: 20261012T050316Z-qe-e2e-observation-abc117-gap-register-7db4ad01
kind: observation
by: qe-e2e
at: 2026-10-12T05:03:16Z
verified_by:
confidence: high
refs:
  - ABC-117
  - ABC-115
  - QE-117-a
  - QE-117-b
  - QE-117-c
  - QE-117-d
  - plans/traceability.md
  - 20260821T052500Z-qe-e2e-claim-nothing-was-weakened-and-the-one-thing-the-repair-changed-that-no-criterion-covers-0391186e
supersedes:
---

# QE `ABC-117` gap register

## QE-117-a — MEDIUM, not blocking: two CLAIM-B clauses outside S1-S9, uncorrected at the tip

I located both by content (files that mention `USAGE_EXIT_CODE` together with `EBADF` / non-`EPIPE`,
16 files across `plans/`, `memory-bank/`, `.grugops/context/` and `src/`, each occurrence read in
context). Both were present at the cut's own commit `fcf12c1` and at base `3537fe48`. The cut and
the Engineer both missed them.

1. **`plans/traceability.md`, the `ABC-115` row** (`:676` at base): *"**RESIDUAL KNOWINGLY ACCEPTED AND
   NAMED:** the non-`EPIPE` path still exits `1` (= `USAGE_EXIT_CODE`)"*. Introduced at `92ccec59`
   (2026-08-20). **`ABC-117`'s own `## Out of scope` says this row was "checked at this cut and it
   carries no CLAIM-B clause … Verified rather than assumed, and left alone". That statement is
   false.** The row quotes a different clause of the same row (*"flips from exit `1` + 1542 bytes…"*).
2. **`.grugops/context/qe-ABC-115-repair-2026-08-21/notes/…-0391186e.md:69-70`**: *"the product inside
   it exits **1** — `USAGE_EXIT_CODE`, with a raw stack on stderr and **no usage line at all**"*. This
   is the A10 / `EBADF` path, the same shape as S4. Introduced at `b30c9fa9`.

**Not a criterion failure.** A1-A7 are bound to the site table, and every S-row is met. **This is
the page's own `P2` trigger shape** ("any second site of the same clause found outside this
inventory"). The ticket is already `P2`, so nothing re-prices. **Route to BA/PM:** either widen
`ABC-117` by two rows before merge, or cut a follow-up. Widening means an SE delta hop: one new
`observation` naming `…0391186e` on `refs` with empty `supersedes`, plus a correction row appended
at the END of `plans/traceability.md`, never an edit to the `ABC-115` row. It would also add an
appended amendment to this page's false "verified" sentence. **QE recommends widening before
merge.** It costs about what S3-S5 cost, and merging leaves `main` with a correction ticket marked
done while the trace row it called clean is still wrong.

## QE-117-b — LOW: the page's A1 instrument is vacuous as written; the Engineer's substitution is sound

The page (`## Problem`, A1's "count of `Usage` lines", and the 2026-10-10 re-score's "`Usage` lines
**0**") uses `grep -c "Usage"`. The product's line is lower-case `usage:` (`src/cli.ts:88`), so the
pattern reads **0 on the refusal control too** (my run: exit 1, `Usage` 0, `^usage: ` 1). **It
cannot tell a refused command line from the EBADF path.** The re-score's "re-measurement" on that axis
therefore measured nothing. The cut's `…7f2a91c4` "two zeroes" carries the same flaw.

**Ruling on the substitution: SOUND.** `grep -c '^usage: '` reads 1 on the refusal and 0 on
`EBADF`, with a control. `USAGE_EXIT_CODE` is assigned only at `src/cli.ts:141`, after the write at
`:136-138`. The page's conclusion survives on the substitute and on the `internal error` zero; the
second is discriminating by inspection of `:196`, not by a run. **Is it a gap for BA/PM? Yes,
record-only.** Amend A1's recorded quantity to `^usage: ` (or "the `usage:` line") so the next
reader does not re-run a vacuous grep and call it a re-derivation.

## QE-117-c — INFO: S8's rewrite leaves "this ticket" ambiguous

The new A10 comment names `ABC-117` and then says *"a collision this ticket neither fixes nor endorses
and which its `## Residual ruling` accepts"*. The referent is `ABC-115`: the comment sits in its
`describe`, and `## Residual ruling` is at `ABC-115`'s page `:249`, with no such heading on
`ABC-117`'s. This is a readability nit in a comment and not blocking. A future touch could write
`ABC-115` there.

## QE-117-d — INFO: the sites the Engineer left alone, judged

- **`src/cli.test.ts:3251`** (`ABC-115` A2, *"it exited `1`, `USAGE_EXIT_CODE`, on both"*). **Agree:
  leave it.** I measured the pre-`ABC-115` `EPIPE` path at `badf6c3d`: exit 1, 0 `usage:`, 0
  `internal error`, 3/3, so that `1` was Node's too. The sentence is a statement of the shared
  value (what a shell cannot tell apart), in the same register as the CLAIM-A sites `ABC-115:62` and
  `:117`. It is not an assignment claim on the non-`EPIPE` path. Editing it would court A5.
- **`src/cli.test.ts:3376`, `src/cli.ts:159`** (now `:160`). **Agree: leave it.** It sits inside
  *"Readings at this hop, for the record"*, a dated reading that was true at `ABC-115`'s hop.
  Rewriting it would falsify a dated record. The same class, also outside scope: `:3198` cites
  `src/cli.ts:148` for the `sink.on` arm (now `:159`), and `:567` cites `src/cli.ts:155`. These are
  `ABC-114`-class line drift, flagged and not owned here.
- **Board `:871` *"the accepted non-`EPIPE` `1`/`USAGE_EXIT_CODE` residual is NOT pinned"*.** Agree
  with the Engineer: it labels the observable collision and makes no mechanism claim.

## Not gaps

The S9 placement (one block after S6, naming both) was checked and is as ruled. Nothing in `src/`
production changed. Nothing re-opens `ABC-115`. `host-protection.js` exit 2 is the standing no-remote
`UNKNOWN - verify` and not a ticket gap.
