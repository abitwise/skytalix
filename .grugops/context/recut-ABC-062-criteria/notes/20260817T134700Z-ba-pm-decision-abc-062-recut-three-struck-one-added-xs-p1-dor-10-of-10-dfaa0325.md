---
id: 20260817T134700Z-ba-pm-decision-abc-062-recut-three-struck-one-added-xs-p1-dor-10-of-10-dfaa0325
kind: decision
by: ba-pm
at: 2026-08-17T13:47:00Z
verified_by:
confidence: high
refs:
  - ABC-062
  - ABC-042
  - ABC-066
  - plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md
  - plans/board.md
  - plans/traceability.md
  - agent-factory/checklists/definition-of-ready.md
supersedes:
---

# `ABC-062` re-cut: three criteria struck, one added, `XS`/`P1`, DoR 10/10

The page is `plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md`. **Six criteria in,
four out.**

| id | outcome | why |
|---|---|---|
| `A1` | **stands** | the `next as string` mutant at `src/cli-options.ts:130` still ships green; `resolveOptions(["--colour"])` occurs in no test (grep: zero hits) |
| `A2` | **stands** | a bare `["white"]` argv occurs in no test (grep: zero hits) |
| `A3` | **STRUCK** (dispatch said narrow) | delivered by `ABC-042`, measured — sibling `observation` note |
| `A4` | **struck** | delivered by `ABC-066` at `src/cli.test.ts:982`, verbatim |
| `A5` | **struck** | delivered by `ABC-066`; `usageLineOf` at `:190` consumed at `:954` |
| `A6` | **stands** | process criterion |
| `A7` | **ADDED** | new, see below |

## Verification of the adopted edit — what I checked and what I changed

I re-derived every claim in the inherited page against the tree rather than trusting it.

**Correct as written, confirmed one by one:** `:190` (`usageLineOf`), `:410` (the near-miss `cases`
table), `:418` (`frameRowsIn` over the hand-listed four), `:545` (the argv-literal corpus), `:933`
(`expect(spawned).toBe(10)`), `:954` (the derived six, `toHaveLength(6)`), `:982` (the vocabulary
equality, matching the page's quotation character for character), `src/cli-options.ts:130`
(`next ?? token`), `src/cli.ts:58` (the `USAGE` string, `--` separator present as the corrected
quotation says), `:69` (`for (const character of text)`), `:82` (the `${USAGE}` write). The
`## Struck criteria` table's attribution of `A4` and `A5` to `ABC-066` holds.

**Changed:**

1. **`A3` struck, not narrowed** — the substantive change, evidenced in the sibling `observation`.
   Prose, `## Scope`, `## Out of scope`, the NFR paragraph, two test notes and the DoR table all
   ripple from it. `## Struck criteria` now records the overrule and its measurement, so a reader sees
   that `A3` went for being **done** (by `ABC-042`, all along), not for being hard.
2. **`:949-983` → `:949-984`** — `ABC-066`'s `describe` closes at `:984`. A byte-identical fence that
   stops one line short of the block it fences is a fence with a hole in it.
3. **Test note 4 rewritten after I caught myself fabricating.** I first wrote "assert `.problem`
   against the exported message constant" — **`MISSING_VALUE` and `UNRECOGNISED` are module-private**
   (`src/cli-options.ts:92-93`) and exporting them is a production line this ticket does not have.
   The note now points at the delivered practice (`:388`, `toContain` on a distinguishing substring)
   and the criteria name the substrings.
4. **`A7` added** — the two `.problem` values must differ. `A1`'s and `A2`'s `toContain` checks pass
   independently for a build that answers both command lines with one message, and nothing in the
   repository asserts `.problem` beyond `:388-389`. One assertion, same block; the smallest thing that
   closes the hole the loose matching opens. Numbered `A7` because `A3`–`A5` are **retired ids, not
   free ones** — a future reader of the QE notes or the trace must not meet a renumbered criterion
   wearing a struck one's id.

## Judgement calls, agreed and one disagreed

- **`XS` (1), down from `S` (2) — agreed**, and now more firmly than the inherited page argued it:
  with `A3` gone the ticket touches no child process and no captured output at all. Two
  `resolveOptions` calls, three assertions each, one inequality, one mutant already written down.
  **The ticket is at its floor** — `A1` and `A2` *are* the ticket, and a further cut leaves nothing.
- **`P1` — agreed, kept.** Re-argued against what is LEFT: the `A1` defect is live on `main` today and
  its failure shape is a Node stack trace where the one sentence telling the user what to type
  belongs. Not `P0` — the delivered build is correct; the crash needs the mutant.
- **Retiring `A4`/`A5` rather than renumbering — agreed**, and extended to `A3`.
- **The one disagreement is the `A3` instruction itself**, above.

## DoR: 10 of 10 — and the score is the least interesting number here

Re-run against `agent-factory/checklists/definition-of-ready.md`. **10/10 MET.** It was also 10/10 on
2026-08-15 **while carrying three criteria a green tree already satisfied.** The DoR asks whether
criteria are *well formed*, never whether they are *still unmet*; only project process rule 1's
`Ready for Dev` exit asks the second question. **Do not read 10/10 as "nothing was wrong" — an
unchanged DoR score across a re-cut that removed half the page is evidence about the DoR, not about
the page.** That is written into the page's own DoR section so the next reader cannot take the tick as
reassurance.

## Handoff — two rows I did NOT touch, by fence

My fence was this ticket page and these notes. **`plans/board.md:119` and `plans/traceability.md:406`
still carry the pre-re-cut title, size `S`, the struck criteria, "two new `it` blocks", "two
falsifying witnesses" and the drifted `:401`/`:477` references.** They are stale as of this commit and
bringing them into line is the Orchestrator's to route. Flagged, not silently left and not silently
done.

**Gaps recorded at this `Ready for Dev` exit: 1** (the `A3` overrule), on top of the parent review's 5.
Backward moves caused: 0. The ticket remains in `Backlog`; nothing here moves a column.
