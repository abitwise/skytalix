---
id: 20260816T031900Z-qe-e2e-observation-gaps-found-at-qe-for-abc065-5e1c8b26
kind: observation
by: qe-e2e
at: 2026-08-16T03:19:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-066
  - ABC-042
  - src/cli.test.ts
  - AGENTS.md
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
supersedes: 
---

# Gaps found at QE for `ABC-065` — each with severity and owner

Numbered **`Q7`–`Q10`** to continue my own `Q1`–`Q6` from `ABC-066` and stay clear of the
Orchestrator's `G1`–`G3`, the Scribe's `G4`–`G7` and the guard hop's `G8`–`G12`, which are referenced
and **not restated**. **None blocks the gate; the gate is GREEN.** **None was repaired here** — every
one is another role's pen, or forbidden to this hop by a hard limit.

**Count for the `Ready for Dev` exit control (`AGENTS.md` § Process rules 1): 4 NEW gaps at QE, of
which 0 are `HIGH`, 1 `MEDIUM`, 3 `LOW`. None is an acceptance-criterion failure — all six criteria
are `MET`.** Four gaps carried from earlier hops are re-confirmed unrepaired at the end and are **not**
counted again, so the control is not double-charged.

---

## `Q7` — a SECOND `Dev / run` slot after the first is invisible to the guard. **LOW.** Owner: **BA/PM** (accept, or add a uniqueness clause to `A1`)

**Mutant `N3a` GREEN 32/32.** A duplicate `- Dev / run: \`npm run chess\` <!-- second slot, no
separator, no options. -->` appended immediately after the repaired slot ships green: `devRunSlot`
takes `indexOf`'s **first** match and never checks that the label occurs once. The mirror `N3b` (the
broken duplicate placed **before** the good one) **reds** on both rows, so the guard is
**direction-asymmetric**.

**Why `LOW` and not `MEDIUM`.** A duplicate command slot in `AGENTS.md` is an editing accident, not a
drift mode: the file has one `### Development` section, and `ABC-042`'s merged `A1` row would also be
satisfied by either copy, so this is not a hole `ABC-065` opened. **The honest statement is narrower
than "the guard misses duplicates": it guards the FIRST slot, and the file's convention is that there
is one.** Tightening would cost one assertion — `expect(agents.split("- Dev / run:").length).toBe(2)`
— but it is a criterion change (`A1` says *"the `Dev / run` slot"*, singular, and does not require
uniqueness), so it is **BA/PM's pen and I did not re-word it.** **Stop condition respected.**

## `Q8` — an UNTERMINATED HTML comment silently EXTENDS the slot, and ships GREEN. **MEDIUM.** Owner: **Orchestrator** (schedule a hop) / whoever next holds `src/cli.test.ts`

**Mutant `N4` GREEN 32/32**, and this is the one I would fix.

`devRunSlot` carries the comment *"A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a renamed slot,
**or one whose comment never closes**, would otherwise arrive as an empty string."* The renamed half
is true (`N13` reds). **The never-closes half is not:**
`end = agents.indexOf(COMMENT_CLOSE, start)` returns `-1` only when there is **no `-->` anywhere later
in the file**, and `AGENTS.md` has ten. **The `end < 0` branch is dead in practice.** What happens
instead is silent over-capture — measured:

```
slot, unmutated : 9 lines
slot, `-->` removed: 16 lines, 1082 bytes — it swallowed the two Perft bullets, the Spike bullet,
                     the `### Test` heading and `- Test (all): \`npm test\``
```

**The suite stayed green by LUCK, not by construction:** none of the swallowed text happens to carry a
`--`-prefixed token. Had the window reached the `Coverage` bullet (`npx vitest run --coverage`), the
same mutant would have redded — on `--coverage`, for a reason with nothing to do with the defect.
**A guard whose scope can silently grow is a guard whose future results are not reproducible**, and
the block's own comment asserts a protection it does not have.

**The repair is small and belongs in a later hop, not this one:** bound the search — e.g. take `end`
only if the `-->` found lies before the next `\n- ` list item, or assert the slot contains no second
`\n- ` bullet. Either makes the dead branch live. **Severity `MEDIUM`** because it is a *guard*
weakness, not a product defect, and because the guard would have to be *simultaneously* wrong in the
file it reads for anything to escape. **Not repaired here: my hard limits are read-only on `src/`,
and `ABC-065`'s criteria do not require it — this is beyond `A1`/`A3` as written.**

## `Q9` — the guard is coupled to TWO rendering conventions of `AGENTS.md`, and false-REDs on honest documentation that breaks either. **LOW.** Owner: **BA/PM** (accept; do NOT loosen)

Two mutants red on documentation that is **correct**:

| mutant | the honest change | what reds |
|---|---|---|
| `N15` | the separator example written **without backticks** | `A1`: `documented token —` — `.split("\`")[0]` runs past the invocation and eats the prose after it |
| `N16` | the honest sentence *"There is no `--help`."* added to the slot | `A3` equality — the collector cannot tell "documented as available" from "named as unavailable" |

So the slot is constrained by convention as well as by content: **the invocation must be fenced, and
no `--`-prefixed token may be NAMED in the slot unless the program accepts it.** Neither constraint is
written anywhere a Scribe would see it.

**I am recording this as a LOW gap and explicitly recommending AGAINST loosening either.** Both fail
in the **safe** direction — loud, one line, naming the offending token — which is the same reading I
gave `usageLineOf`'s positional rule in `Q1`. Loosening the fence-strip to "the first whitespace-run
after the separator" would let a broken invocation through; teaching the collector to ignore
negated mentions would need it to parse English. **The cost of the coupling is a diagnosable false red
once; the cost of relaxing it is a silent pass forever.** The cheap mitigation is documentation, not
code: **one sentence in the slot's own comment saying the invocation must stay backticked and no
unaccepted option may be named here.** That is the `AGENTS.md` Scribe's pen — not mine, and not this
ticket's.

## `Q10` — `A2`'s line-number fence names the wrong block (upholding `G8`), and it is the SECOND stale position in this file in one session. **MEDIUM.** Owner: **BA/PM** (the wording)

Fully ruled in this hop's `decision` note with six hashes from four commits; not restated here. In
one line: **`A2` is `MET` in substance — `ABC-042`'s `A1` row is `6effd96e…` at `dbaf972`, at
`717e51d`, on `main` and at the branch tip — and MISWORDED in form**, because `:193-204` now holds
`ABC-066`'s `advertisedTextOf` and the expander doc comment. **Today the criterion is green for the
wrong reason** (both regions happen to be byte-identical); **the next insertion above line 193 ends
that coincidence.** Recommendation, seconding the guard hop: **fence by content or by hash, never by
line range.** I did not edit ticket prose and **no stop condition fired** — nothing had to move.

---

## Carried gaps, re-confirmed UNREPAIRED — reported, not re-numbered, not re-counted

- **`G11` / `Q2`'s successor — `advertisedTextOf`'s silent-garbage contract is undocumented and now has
  TWO callers.** `MEDIUM`, upheld. Both callers are safe, both by the same unwritten precondition; the
  helper's doc comment still reads as total. Full analysis in this hop's callers note. Owner:
  **Orchestrator** to schedule / whoever next holds `ABC-066`'s block.
- **`Q6` / `G9` — `src/cli.test.ts:165` still reads "THESE TWO HELPERS ARE THE SHARED ONES" above
  four names.** `LOW`, still open. **The collision is correctly ruled and I do not re-open it:** my
  `Q6` assigned the tidy-up to the guard hop; the Orchestrator's hard limit forbade that hop editing
  `ABC-066`'s block; **a hard limit outranks a `LOW` suggestion from a prior hop, and the engineer was
  right to leave it.** My own subtask forbids me the same edit. **Flagged for the third time and still
  correctly unfixed.**
- **`G6` / `G12` — `A6` cannot be scored as its own command words it on a two-hop ticket, and
  § Dependencies still says `AGENTS.md` "IS CLAIMED RIGHT NOW BY ANOTHER HOP"** contradicting the
  ticket's own DoR row 10. `LOW`, both BA/PM's, both unrepaired. What `A6` protects is intact and
  measured in my gate note.
- **`Q5` — Workflow 05's green-verdict emission is unperformable on this install**, so this gate's
  green carries no stamp. `LOW`, pre-existing, install-level, already escalated to the owner by
  `AGENTS.md` itself. **Not re-derived and not ticketed.** Same class: `scripts/check-uat-oracles.js`
  is absent, recorded `UNKNOWN - verify`, non-blocking.
- **`G5` — one working tree, one git index, two concurrent hops.** Did not bite this hop: I claimed in
  the shared tree, immediately **unstaged** the rename so nothing of mine sat in `main`'s index, and
  did all committing from the linked worktree with **explicit pathspecs**. **The hazard is real and
  the mitigation is now four hops old and still undocumented in the enqueue template.** Owner:
  **Orchestrator**.

---

## Not gaps — checked and closed so nobody re-opens them

- **The guard is NOT vacuous, from the side the engineer did not attack either.** Separator present
  with an empty option list (`N1`) reds on the count floor; separator present advertising nothing
  (`N9`) reds on `A1`'s floor; the slot deleted (`N2`) and the slot renamed (`N13`) both red, loudly,
  and drag `ABC-042`'s merged row red with them. **There is no measured input where the slot is
  absent, empty or unreachable and the guard is green.**
- **A throw is not "passing where it should red".** `N2`/`N13` red by throwing from inside the `it`
  body; vitest scores that as a test failure with a one-line cause. **Ruled acceptable** — the
  dangerous shape is a module-scope throw, and this is not one.
- **`A4` is red in BOTH directions, and the second one is now measured from the CODE side.** `N7`
  (`--depth` accepted, undocumented) reds on the floor; `N14` (count held at 4 v 4) reds on the set
  equality **alone**. All four cells of the floor/equality × documentation/code matrix are proved.
- **The `--` exclusion is exact (`!== "--"`), nothing looser slipped in**, and an option literally
  named `--` is a **non-case**: `N7b` shows it is refused first by `ABC-042`'s merged `A6(i)` row.
- **`A5` is MET with `0` accepted-argument spellings in the 85 added lines** — code and comments —
  and the separator form is still spelled exactly once file-wide.
- **`spawned` is 10 and this hop added no child.** I counted `CHILDREN`'s ten keys myself. 10 → 10.
- **Nothing was left mutated.** Eighteen mutants across `AGENTS.md` and `src/cli-options.ts`, every
  one reverted, `git status --porcelain` empty and `git diff HEAD` **0 lines**; blob hashes in the
  verdict note.
- **`G7`/`G5`'s stale `base:` did not recur.** `901c670` was accurate on arrival — the fourth
  consecutive accurate writing of the field.
