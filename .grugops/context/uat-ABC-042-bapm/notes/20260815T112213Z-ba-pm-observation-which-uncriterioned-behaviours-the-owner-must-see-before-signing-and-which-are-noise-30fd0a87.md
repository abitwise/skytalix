---
id: 20260815T112213Z-ba-pm-observation-which-uncriterioned-behaviours-the-owner-must-see-before-signing-and-which-are-noise-30fd0a87
kind: observation
by: ba-pm
at: 2026-08-15T11:22:13Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - AGENTS.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T111100Z-uat-planner-observation-six-facts-the-run-turned-up-that-no-criterion-asks-about-99da7613.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T110900Z-uat-planner-observation-the-run-seventeen-scenarios-executed-against-main-and-what-actually-came-back-8c6e3c04.md
supersedes: 
---

# The uncriterioned behaviours, ruled: four the owner must see before signing, five that are record-only

The pack's observation note carries **six facts no acceptance criterion asks about**, and its run note
carries **three more** under *"What was NOT run"* plus one procedural substitution. **None is a
defect; none failed a scenario.** The business question is narrower than "is it a bug": **which of
these must be in front of Olger Oeselg before he initials § 9, and which are noise that would only
dilute the signing?**

I ruled each on one test — **could not knowing it cause the owner to sign the wrong thing, or to
record a FAIL against working software?**

## MUST SEE before signing — four

- **`M1` — forgetting the `--` prints a board, exits `0`, and silently discards your option.**
  `npm run chess --ascii` → **exit `0`, a board, `--ascii` thrown away, no warning**. The pack's own
  words: *"the only measured path in this whole run where a person can ask for something, be given a
  board, and not be told their request was ignored."* **This is the highest-value item of the nine.**
  Two reasons it is a signing item and not a footnote: (i) the owner is a human typing a command for
  the first time and **will** type it without the separator; (ii) it defeats a user intention
  **silently and with a success code**, which is the one failure shape a person cannot self-diagnose.
  **It is `npm`'s doing, not the product's** — the program received exactly what it was handed and
  behaved correctly — and that is precisely why it must be shown rather than fixed in the product.
  **The pack handles this well** (§ 5 carries both failure shapes ahead of every scenario). **What is
  NOT handled is that `AGENTS.md` § Commands never prints the `--` form** — see the `B4` gap in this
  folder's decision note.

- **`M2` — the default drawing style changes depending on where the output goes.** On a real terminal,
  no options → **32 Unicode chess figures**. Piped or redirected → **plain letters**, zero bytes above
  `U+007F`. **The owner will see figures; every transcript in this task's notes shows letters.**
  Without this he compares the two and concludes one of them is wrong. Deliberate behaviour
  (`selectGlyphMode` — a sink that cannot be seen gets the portable form) and `A7` asserts the piped
  half. **The pack carries it as a Group C preamble, which is the right place.** Listed here because
  it is the second-most likely cause of a false FAIL at signing time.

- **`M3` — the twelve blank move-list rows.** A third of the 23-row frame is empty on every run and
  always will be in this version. **The owner will physically see this** and it is the single most
  visible signal that the product is incomplete. It is `§ 7` point 4 of the pack's limitations and
  **no scenario asks him to look at it** (gap `B7`). Must see, in both directions: it prevents a FAIL
  against working software **and** it is the strongest available reinforcement of *"the game does not
  exist yet."*

- **`M4` — `--help` does not exist; asking for help gets a refusal.** `npm run chess -- --help` →
  exit `1`, `unrecognised argument: --help`, then the usage line. **A person's first instinct on an
  unfamiliar command is `--help`**, so the owner will hit this within his first three commands.
  **It is in scope as designed** — the ticket's `## Out of scope` says *"no `--help` beyond the usage
  message the error paths print"* — so it is **not a defect against `ABC-042`**. It is a signing item
  because the owner is accepting a product whose only help affordance is an error path, and he should
  see that as a decision rather than discover it as an omission. The pack's own words fit: *"it works;
  it does not read as if it were meant to."*

## RECORD ONLY — five, and each with the reason it is not a signing item

- **`R1` — a repeated option is accepted and the last one wins** (`--colour white --colour black` →
  black). **Not a signing item:** last-wins is the near-universal CLI convention, no user intention is
  defeated in a way the user cannot see, and no scenario or criterion is affected. **It IS an open
  convention decision** — it fell out of the resolver walking arguments in order rather than being
  chosen — and belongs on `ABC-043`'s page as a decision to make deliberately, not on the owner's
  signing desk.
- **`R2` — running from the wrong folder returns exit `254`, the runner's code, not the product's.**
  The product itself only ever emits `0` (board drawn) or `1` (arguments refused). UAT-17's PASS line
  asks only that it fails and draws no board, which `254` satisfies. **Not a signing item;** useful on
  record so nobody later reads `254` as a chess-program failure mode.
- **`R3` — Node 22 was never exercised.** `package.json` declares `engines.node >= 22`; the run used
  `24.12.0`. **Not a signing item today:** this product runs on one machine, and the owner will sign on
  the same machine he runs it on, so the runtime under his signature is the runtime that was tested.
  **It becomes a real gap at `EPIC-006`**, where "runs on Node >= 22" stops being an incidental
  declaration and becomes a distribution claim someone else relies on. Recorded against the epic, not
  ticketed now.
- **`R4` — no terminal other than macOS `Terminal`-class pseudo-terminals was exercised**, so figure
  rendering in another terminal or font is unmeasured. **Not a signing item**, same reasoning as `R3`:
  the owner signs on his own terminal and will see the answer directly. Also `EPIC-006`'s.
- **`R5` — the 23-row frame contains zero `ESC [` sequences; the product never repaints, clears or
  colours.** A reassuring engineering fact with no decision attached for a signer. Record only.

## The procedural substitution — MUST SEE, and it strengthens rather than weakens

**UAT-15's human procedure and the executed procedure are not the same keystrokes**, and the run note
says so in full. The pack tells a human to run the command and type `e2e4` at the prompt that comes
back; an agent has no prompt to type at, so the property was established two other ways — **input
piped in and provably ignored** (zero occurrences of `e2e4` or `quit` in the output), and **input held
open and empty for 20 seconds**, where a program waiting for a move would have blocked for the full
20 s and this one **finished in 211 ms with a complete board**.

**Ruling: the substitution is sound and the second method is strictly stronger than the human
procedure.** Typing at a returned shell prompt proves the program already exited; a held-open empty
pipe proves it would not have waited even if it had still been running. **The owner must see the
substitution disclosed** — not because it is suspect, but because UAT-15 is the scenario that
underwrites *"it does not play a game"*, and he should know the evidence offered to him was produced
by different keystrokes than the ones the pack asks him to use. **He should still perform the typing
version himself**, since that is the version his signature covers.

## One sentence for the relay

If only one of these reaches the owner, it is **`M1`**: *typing `npm run chess --ascii` without the
`--` gives you a board and a success code and throws your option away without telling you.*
