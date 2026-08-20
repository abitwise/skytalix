---
type: decision
task: uat-ABC-043-2026-08-20
role: orchestrator
ticket: ABC-043
created: 2026-08-20T20:15:00Z
tree: main @ b03658f
---

# The owner signed `ABC-043` in session. His words, verbatim, and an honest statement of what that signature does and does not cover.

## 1. The signature

**Verbatim, project owner (Olger Oeselg), in session, 2026-08-20:**

> **"ABC-043 passes, sign it off"**

Under `AGENTS.md` § "Test and UAT authority" and the 2026-08-16 standing directive
(`memory-bank/60-progress.md` § "Standing directive — the owner's word in session IS the `In UAT`
signature"), **the owner's word in session IS this project's `In UAT` exit signature.** He is the
named human the kit requires. This satisfies
`agent-factory/workflows/06-uat-pack.md`; it does not override it.

## 2. The fidelity of this record — state it plainly or it will be misread later

`context.human_admission` is **`off`** and the owner did NOT flip it. There is no `human:<name>`
stamp, no admissible `finding`, and no `§14-gate` verdict. **This note is an agent's transcription
of a human's spoken acceptance, carried as a hand-authored `decision` in git.** That is the
strongest form of record this install supports, and it is weaker than a stamp. Do not later read
this as machine-attested.

## 3. WHAT WAS NOT DONE, and I will not paper over it

**NO UAT SCENARIOS WERE CONDUCTED BY AN AGENT FOR `ABC-043`.** No UAT pack was built, no business
scenario was executed against the build at this hop, and `plans/` carries no `ABC-043` UAT
scenario run. The owner accepted the ticket directly.

**That is his to do** — he owns the product and the 2026-08-16 ruling makes his word the exit — but
the honest shape of this close is **"accepted by the owner"**, NOT **"UAT executed and passed"**.
Anyone reconstructing this later must not upgrade it to the latter.

The 2026-08-17 zero-production-lines waiver is **NOT** what closed this ticket and does not apply
here — measured at the previous hop: `src/cli.ts` **+91/−17**. `ABC-043` needed a human and got one.

## 4. WHAT THE OWNER WAS TOLD BEFORE HE SIGNED — he was informed, and this is the evidence

He was given, in session and before this instruction, all of the following:

- QE/E2E's **PASS 8/8 + `G6`**, decided by wrong builds going red (14 decoys planted, 14 reverted).
- **The open EPIPE regression pinned to this ticket** (§5 below), named as a user-facing defect.
- `G-05` overturned in the engineer's favour; the live-stdin defect **struck** as belonging to the
  wrong build only, with the FIFO harness itself shown to be faulty.
- `G-06` and `D4` open, unowned, handed forward by a second QE hop.
- Three false sentences shipping in `EPIC-006` test comments (now being cut as a ticket).

**He signed with the regression on the table.** This is acceptance of the ticket, informed — not
acceptance obtained by omission.

## 5. WHAT THIS SIGNATURE DOES NOT CLOSE — the one thing most likely to be lost

**The EPIPE regression is NOT closed, NOT waived and NOT accepted by this signoff.**

```
node src/cli.ts --ascii </dev/null | head -2   ->  exit 1, unhandled 'error' event: write EPIPE
node src/cli.ts --ascii </dev/null             ->  exit 0
```

Clean at `54cbb23`, broken at `46457b8` and live on `main` today. It fails no `ABC-043` criterion,
which is exactly why it can vanish: **the ticket that carried it is now `Done`, and the defect has
no ticket of its own yet.** It is queued behind the false-sentences cut and MUST be cut. Two reasons
it is not cosmetic:

1. A user piping the game (`| head`, `| less` then quitting) gets a **Node stack trace instead of a
   board**.
2. **Exit `1` mislabels it.** `AGENTS.md` reserves `1` for a refused command line and `70` for an
   internal error. This is an internal error wearing the refusal code — **the exit contract lies.**

Also NOT closed by this signature: `G-06`, `D4`, the three false sentences, and `ABC-050`'s
type-valid `exclude` residual.

## 6. Board effect

`Ready for UAT` → `In UAT` → `Ready to Release` → `Done`, on the owner's word. **`Done` here means
merged, gated AND ACCEPTED BY THE NAMED OWNER** — which is a stronger close than `ABC-050`'s
waived `Done` earlier today, and the two must not be conflated in any later count.

**Board write is DEFERRED**: a BA/PM hop (`cut-false-sentences-2026-08-20`) is live and writing
`plans/board.md` right now. Two hops writing that file is how rows get clobbered — it nearly cost
QE's traceability row earlier today. The move lands when that hop returns.
