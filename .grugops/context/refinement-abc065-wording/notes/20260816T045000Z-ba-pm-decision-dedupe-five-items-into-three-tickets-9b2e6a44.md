---
id: 20260816T045000Z-ba-pm-decision-dedupe-five-items-into-three-tickets-9b2e6a44
kind: decision
by: ba-pm
at: 2026-08-16T04:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-068
  - ABC-069
  - ABC-070
  - ABC-065
  - ABC-066
supersedes: 
---

# Dedupe first, cut second — **five items in, three tickets out**, and every fold argued

The live `Backlog` was read row by row on `plans/board.md` (69 rows) before anything was cut, with
`ABC-050`…`ABC-064` opened where a row looked adjacent. **Nothing was deduplicated away as an exact
duplicate** — and two items produced no ticket for two different reasons.

| item | severity / owner as filed | outcome | why |
|---|---|---|---|
| `Q10` / `G8` — moved content fence | `MEDIUM`, BA/PM | **NO TICKET — repaired in place** | see the `G8` decision note; live in the UAT window, substance already verified twice |
| `G9` + `G11` — helper documentation debt | `LOW` + `MEDIUM`, BA/PM | **`ABC-068`** | ruled ONE ticket by the Orchestrator; honoured |
| `Q9` — the slot's two unwritten rendering conventions | `LOW`, BA/PM | **`ABC-069`** | QE's cheap mitigation is prose in `AGENTS.md`; the loosening is refused on the page |
| `G12` — stale live-claim sentence | `LOW`, BA/PM | **`ABC-070`** | three notes have already failed to close it; a ticket is the mechanism that survives |
| `Q7` — a second `Dev / run` slot is invisible to the guard | `LOW`, BA/PM | **NO TICKET — folded into the `Q8` lane** | same function, same failure class, being ticketed *right now* by a sibling |

## The `Q7` fold — the one that matters, and the risk I am taking

**`Q7` and `Q8` are two ends of the same window.** `devRunSlot` computes its slice from two
unverified bounds:

- **start** — `agents.indexOf("- Dev / run:")`, the **first** match, with no uniqueness check. That is
  `Q7` (mutant `N3a` ships **GREEN**; the mirror `N3b` reds, so the guard is direction-asymmetric).
- **end** — `agents.indexOf(COMMENT_CLOSE, start)`, unbounded, so the `end < 0` branch is dead and an
  unterminated comment silently grows the slot **9 → 16 lines**. That is `Q8` (mutant `N4` ships
  **GREEN by luck** — none of the swallowed text happens to carry a `--`-prefixed token).

**One helper, one repair site, one hop.** Cutting `Q7` into my own range would put two tickets on one
six-line function, cut in the same minute by two agents in one working tree — **the exact collision
class (`G2`, `G5`) that has cost this session three separate corrections.**

**The risk I am taking, stated rather than hidden: my note is `Q7`'s only carrier.** The
`refinement-Q8-slot-guard` lane may already have cut its ticket without it. **So this is a routing
request to the Orchestrator, not an assumption**, and it comes with the wording so nothing is lost:

> **Proposed criterion for the `Q8` ticket** — *"**Given** `AGENTS.md` with a second `- Dev / run:`
> list item appended after the first, **then** RED. (Today: **GREEN**, mutant `N3a` 32/32 — the guard
> takes `indexOf`'s first match and never checks the label occurs once. One assertion:
> `expect(agents.split("- Dev / run:").length).toBe(2)`.)"*
>
> **And the criterion change it implies**, which is why `Q7`'s owner is BA/PM at all: `ABC-065`'s `A1`
> says *"the `Dev / run` slot"*, **singular, and does not require uniqueness**. The `Q8` ticket must
> either state that uniqueness is now required (a new obligation, and `A1` is merged — so it belongs
> in the NEW ticket's own criteria, never as an edit to `A1`) or record that duplication is accepted.

**If the `Q8` ticket is already cut and closed to change, `Q7` needs an id — and it must not be
mine:** my range is `ABC-068`…`ABC-071` and `ABC-071` is deliberately left **unused** rather than
spent on an item another lane is holding.

## Rejected alternatives, so they are not re-proposed

- **`Q7` as its own ticket in `ABC-071`.** Rejected: two tickets on one function, and QE's own reading
  is narrower than "the guard misses duplicates" — *"it guards the FIRST slot, and the file's
  convention is that there is one."* A standalone ticket would overstate it.
- **`Q9` accepted with no ticket at all** (QE's owner line reads *"accept; do NOT loosen"*). Rejected:
  *accept* applies to the **guard's behaviour**, which this ticket does not change. The documentation
  half was QE's own recommendation and costs two sentences.
- **Folding `G12` into `ABC-068` or `ABC-069`.** Rejected: different artifact, different pen, no
  shared hop. Folding unrelated subjects to reduce the ticket count is how a ticket becomes
  unestimable.
- **Folding `G9`+`G11` apart into a "comment count" ticket and a "contract" ticket.** Rejected — the
  Orchestrator ruled one ticket and the ruling is right: **the count is wrong because the block grew
  into shared infrastructure, which is the same event that left the contracts unwritten.**
- **Absorbing `G6` (`ABC-065`'s `A6` wording) into `ABC-070`.** Rejected as **out of my assigned
  five** — recommended to the Orchestrator on `ABC-070`'s own page instead. See the gaps note.

## Dedupe checks that came back NEGATIVE — recorded so nobody re-runs them

- **`ABC-057`** (licence guard comparator + stale `ADR-0011` docblock) — same file, **different
  block**; it does not touch the module-scope helpers. Not a dupe of `ABC-068`.
- **`ABC-059`** (the runnability guard pins a spelling, not the fact) — same file *and* the
  neighbouring region of `AGENTS.md`, **different claim**; `ABC-065`'s own page already fences the two
  apart. Adjacency named on `ABC-069`, not a dupe.
- **`ABC-061` / `ABC-062`** — both edit `src/cli.test.ts` and `ABC-062` is the ticket that *would*
  have written the helpers `ABC-066` wrote first. **Not a dupe: neither carries a criterion about the
  helpers' contracts.** Recorded on `ABC-068` as an ordering dependency **with a re-scope
  instruction** if `ABC-062` lands first.
- **`ABC-052`** (traceability `Status` goes stale on every merge) — the same *class* as the
  front-matter drift I measured, but its `## Out of scope` explicitly excludes **"any ticket page"**.
  **No overlap, and neither ticket covers the other.**
- **`ABC-060`** (four criteria copy a diff-scoping clause without naming the diff) — the nearest
  precedent for a ticket-prose ticket, and the reason `ABC-070`'s shape follows it. Different
  criteria, not a dupe.
- **`ABC-030`** (NFR-justification comments cite a live sibling test count) — the closest thing to
  `ABC-068`'s `A4` (a comment carrying a number that goes stale). **Different file, different comment,
  different number**; its *refresh-a-number* refusal is quoted rather than duplicated.

## Stop conditions — none fired

- **No ticket is `XL`.** All three are `XS` (1). No `SPLIT_REQUIRED`.
- **The `G8`–`G12` ruling does not look wrong to me.** I read it, I agree with it on every limb, and
  I executed it. **Nothing was routed back.**
- **Two items DID turn out to be one defect** — `Q7` with `Q8`, across lanes. Folded and reported.
- **Ticket count 3, below the four my range allows.** `ABC-071` unspent.
