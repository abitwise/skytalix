---
id: 20260820T212500Z-ba-pm-decision-the-exit-code-this-path-owes-is-zero-and-the-fourth-code-is-not-mine-to-add-5b83e0c7
kind: decision
by: ba-pm
at: 2026-08-20T21:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ABC-043
  - ABC-112
  - ABC-114
  - AGENTS.md
  - src/cli.ts
supersedes:
---

# RULED: this path owes exit `0` with a silent stderr — and `141` is NOT mine to add

The brief said: *decide and WRITE which code this path owes, or name it as an open question rather than
inventing one.* It is decidable from the contract that already exists, so **it is decided on the ticket
page rather than deferred**, and the reasoning is here so a later hop can overturn it on the same terms.

## The ruling

**Exit `0`. stderr writes nothing on this path.**

1. **`1` is out on measurement.** It is `USAGE_EXIT_CODE` (`src/cli.ts:90`), and at this same cut a
   refused command line (`--nonsense`) was measured exiting `1`. Two unrelated failures sharing one code
   is the defect itself.
2. **`70` is out because the sentence it prints would be false.** `INTERNAL_ERROR` reads *"a bug ended
   this session"*. No bug ended it — a consumer stopped consuming. Emitting that line here is the exact
   species of defect `ABC-114` exists to repair: a true-sounding sentence that is not true. It would also
   make every closed pager look like a crash to whatever reads exit codes next.
3. **`0` is what the contract's own words give.** `AGENTS.md` `## Development`: *"0 when the session
   ran"*. It ran. The delivered precedent is end-of-input — `input ended`, exit 0. **And it keeps the
   product at exactly three exit codes; this ticket invents no new signal** (coding rule 5).
4. **`141` (`128 + SIGPIPE`) — the shell-idiomatic answer — is CONSIDERED AND REJECTED AT THIS HOP, and
   the reason is authority, not taste.** It requires a **fourth** code, which amends a contract written
   in `AGENTS.md` and in `src/cli.ts`'s own docblock. That is Architect/Design's ruling on the owner's
   file, and BA/PM inventing it at a cut is precisely the fabrication this factory forbids.

## How the ticket is shaped so the ruling being wrong is cheap

`A2` is written in **two halves**:

- **(i)** the status is `0` — the ruling;
- **(ii)** independently of (i), the status is **not `1`** and **not `70`** — the floor.

**(ii) binds even if (4) is later taken.** Pre-registered on the page: if Architect/Design amends the
contract to give this path a SIGPIPE-shaped code, `A2`'s expected value becomes that code, **the ticket
is not re-cut and nothing is re-argued**. That is why this is the DoR ⚠️ (item 10) — a *reversible
ruling*, not an open question, and it does not stop the ticket being pulled today.

## Priority — `P1`, and QE recommended `P2`

The QE/E2E note recommends `P2`/`S`. **I took `S` and moved the priority up to `P1`.** The disagreement
is recorded rather than smoothed:

- It is a **regression on `main` today** — `54cbb23` exits 0 on the same command line, re-measured here.
- It breaks a contract **written down in two places** (`AGENTS.md` `## Development`,
  `src/cli.ts:109-115`) and the collision that contract exists to prevent was measured today.
- This board's own `P1` precedent is `ABC-112`: *the product tells the player something false*. This
  path tells him **two** false things at once — a stack trace claiming a crash where no bug occurred, and
  an exit code claiming a refused command line where nothing was refused.

**NOT `P0`:** nothing is blocked, no gate is wrong, the un-piped terminal path is unaffected.
**NOT `P2`:** it is on `main`, and any script or agent branching on this exit status already reads a
false answer. Promotion/demotion triggers are pre-registered on the page.

## Size — `S`

Not `XS` (`ABC-112` is the `XS` comparable): this needs a harness shape the test file does not have, a
re-derived spawn pin, a watched-RED round and production lines in the entry point. Not `M`: one
production file, one test file, ≤ 15 added production lines, no design ruling owed, no owner escalation.
**No `SPLIT_REQUIRED`** — nothing here is `XL`.

## What I ruled OUT of the ticket, so nobody folds it back in

- Any change to what `0`/`1`/`70` mean, and any fourth code (above).
- **stdin-side and stderr-side pipe failures** — a closed stderr is a different Given nobody has
  measured. Named so a later hop cuts it rather than smuggling it in.
- **Surviving a closed reader and continuing to play.** The session ENDS, quietly, with the right code.
- `ABC-050`'s `exclude` residual and `G-06` — both open, neither mine, both fenced out by the brief.
