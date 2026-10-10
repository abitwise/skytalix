---
id: 20261010T105420Z-ba-pm-decision-eight-august-pages-five-ready-one-drop-4fdfe525
kind: decision
by: ba-pm
at: 2026-10-10T10:54:20Z
verified_by:
confidence: high
refs:
  - ABC-057
  - ABC-058
  - ABC-059
  - ABC-060
  - ABC-072
  - ABC-073
  - ABC-104
  - ABC-055
  - ABC-042
  - ABC-101
  - ABC-010
  - ABC-129
  - ABC-114
  - ABC-054
  - ADR-0011
  - plans/traceability.md
  - .grugops/queue/pending/rescore-batch-2-2026-10-10.md
  - .grugops/context/rescore-batch-2026-10-10/notes/20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389.md
  - .grugops/context/board-audit-2026-10-10/notes/20261010T080456Z-orchestrator-observation-445de55a.md
  - .grugops/context/rescore-batch-2-2026-10-10/probe/RUN.txt
supersedes:
---

Eight-page DoR re-score. Task `wave-2026-09-25`, subtask `rescore-batch-2-2026-10-10`. Measured
against wave tip `f76e041`, not the enqueue tip `9be2662`. The wave moved during orientation
(`ABC-119` merged as `1cbd3ab` and went `Done`), and this branch was reset to the new tip before
any edit. Every number below was re-measured at `f76e041`. Mutants ran in a `git archive` copy;
nothing under `src/` was edited anywhere. Probes and outputs are in `../probe/` (`RUN.txt`).

| ticket | premise | DoR | size / priority | page → | ⚠️ + owner |
|---|---|---|---|---|---|
| ABC-055 | partly fixed: `Ready for Dev` heading exists; `In Analysis`/`In Design` still missing (11 of 13) | 10/10 | S→**XS**, P2→**P1** (own trigger fired) | Ready | none |
| ABC-057 | holds, exact anchors; `M15` survives 51 files / 1541 tests | 10/10 (was 9) | XS, P2 | Ready | none |
| ABC-058 | `S4`/`S5` hold; `S1` closed by the tree | 10/10 (was 9) | S→**XS**, P2 | Ready | none |
| ABC-059 | holds; `ABC-065` declined it by name | 10/10 (was 9) | XS, P3→**P2** (own trigger fired) | Ready | none |
| ABC-060 | **gone** — all four target pages `Done` | not scored | — | Backlog, **DROP recommended** | Orchestrator: board disposition |
| ABC-072 | holds; no ruling exists | 9/10 | S, P1→**P2** | Backlog | item 10: Architect/Design (STATE vs DELTA) |
| ABC-073 | shrunk: 6 live pages, fail-safe 6/6 | 9/10 | S→**XS**, P1 (board) / P2 (page) → **P3** | Backlog | item 10: ordering on ABC-072 |
| ABC-104 | holds; its audience has shipped | 10/10 | XS, P3 | Ready (pull last) | none; UAT cost: needs the owner's word |

Decisions BA/PM took on its own authority (the Orchestrator may reverse any of them):

1. **ABC-057.** `A1`'s mutant is now QE's exact `M15` from `quality-gate-ABC-042`:
   `toEqual(expect.arrayContaining(runtimeImporters))`. The page had said
   "`toContain`/`toMatchObject`", but `toContain` with an array argument reds on its own. Rebuilt
   today, `M15` is green across the whole `src` lane. The second (`main`) line-number set is
   deleted. `R5`'s promotion trigger has not fired: the file is unchanged since `e140355`, and
   `ABC-043` merged without a third licence entry.
2. **ABC-058, `S1` cut.** `MS4` (`shell: true` on the one `spawnSync`) is now **RED, 18 of 66**,
   because `ABC-115`'s `/bin/sh -c` children break under a second shell. `ABC-115` also amended the
   concatenation clause at the site (`src/cli.test.ts:19-29`, `:404-409`). `A3`/`A4` are struck in
   place, so the ids stay stable. Re-anchored: probe token `:675`; bar-3 assertion `:1741`; pin
   `:1840-1845`; helper `:58-61`; number row `:1637` (now with `"70"`); `N8_SPAWN` 27; control
   66/66. `S5` re-measured: a prose `` `spawnSync(` `` reds 1 of 66. `S4` re-measured: `M3h` green
   66/66. Both of the page's promotion triggers fired (about ten hops opened the file; `G1` was
   answered) and were deliberately NOT used to promote. The page states why and names a new
   trigger. The pin comment's stale "eleventh child" and "breached and escalated" (`:1836-1837`)
   join the scope, because the ticket edits those exact lines.
3. **ABC-059, `A1` re-worded.** `AGENTS.md` now has 3 `Dev / run` occurrences, and one is the
   receipts pointer `§ "Dev / run".` (`:75`), which states no command. "Each span states the
   command", as cut, would red the correct file. New rule: (i) 0 spans contain
   `UNKNOWN - verify`; (ii) every span containing `npm run ` names `npm run <script>`, with the
   script read from `package.json`. Measured: 0/3 and 2/2. The `Q13` sentence appended reds (i).
   **P3 → P2 on the page's own trigger:** `ABC-109` (`b9a6861`, 2026-09-25) rewrote the prose
   claim at `:282-283` with a line break inside `` (`Dev / run` = `npm run chess`) ``, which is
   `Q13`'s shape.
4. **ABC-060 — DROP recommended.** `ABC-043`, `044`, `045` and `046` are `Done`, so their criteria
   are gated, and the page's own first fence forbids editing gated pages. The scope is empty. The
   delivered hops named their diffs anyway (`ABC-045` `:166`; `ABC-046` `:265`, `:470`). The one
   open instance of the clause is `ABC-101` `A9` (`:152`). It is NOT homed here; it should fold into
   `ABC-101`'s next re-score. `status` is left `backlog` so page and board agree.
5. **ABC-072, P1 → P2.** The P1 rested on `ABC-061` inheriting the paragraph (merged 2026-08-17)
   and on routing contradictions, and none has been recorded since. No page cut since August
   restates clause (b). The limbs are re-measured, and **the August "7 files read `process.`" was a
   word-hit count**. At `f76e041`: 35 production files; limb 1 → 0; limb 2 → 3 in executable code
   (`cli.ts`, `glyph-mode.ts`, `perft-bench.ts`), 9 raw; limb 3 → 0 call sites (3 raw `exec(` hits
   are `RegExp.prototype.exec`). `A3` now has to name its counting rule.
6. **ABC-073 → P3, XS.** Re-measured over whitespace-normalized text. The per-line grep reports
   `ABC-058`/`059` without the fail-safe, which is wrong: their sentence wraps across lines. Live
   restaters: `ABC-053`, `054`, `055`, `057`, `058`, `059`, with the fail-safe on 6 of 6, so `A2` is
   already met. The page said P2 and the board P1; both are superseded.
7. **Interim (b) wording on the four pages this batch touched** (`ABC-055`, `057`, `058`, `059`).
   Each page's (b) answer now states both readings with its own facts, plus the fail-safe sentence.
   No ruled wording was guessed. As a result, those four no longer match `ABC-073`'s restating
   grep; `ABC-073`'s set is now defined as the union with `` grep -l 'reading is unruled (`ABC-072`)' ``.
8. **ABC-104.** `A3`'s "`npm run build` output byte-identical" was vacuous (it is `tsc --noEmit`),
   and so was "`PERFT_DEEP=1` 32/32". Both are replaced by "every hunk inside the header docblock
   (lines 1–33)". Both throws were re-run and still throw. **UAT cost:** the zero-production-lines
   waiver is measured as `grep -v '\.test\.ts$' | grep '^src/'`, so a comment-only diff to
   `src/coordinate-move.ts` is not waived and needs the owner's word.
9. **ABC-055.** `A5`'s unconditional "archive before replacement" contradicts today's practice:
   170 prepended `_Updated:` lines, none replaced. It now requires one added line, zero changed,
   and an archive only if a line is replaced. The FORMAT comment's kit dial path
   (`agent-factory/config/…`) joins the scope. The repo's dial is `.grugops/factory.config.json`.

File overlaps (cannot build in parallel):
- `src/cli.test.ts`: `ABC-058` × `ABC-059`. Different sites; each states "no new `it`" or "one new
  block" as a delta. Build them one after the other. Same file, both Backlog: `ABC-114` (comments)
  and `ABC-129` (cites at `:588`, `:744`). No in-flight branch touches this file.
- `src/history-pane.nfr.test.ts`: `ABC-057` × `ABC-054` (Backlog). Nothing in flight.
- `plans/board.md`: `ABC-055` × every Orchestrator close-out. Single writer; sequence it as the
  page says.
- `AGENTS.md` (read only by `ABC-059`'s guard): edited by `scribe-ABC-119-lane` (pending) and
  `ABC-127` (Ready for UAT, +169 B). `ABC-127`'s diff touches neither `Dev / run` nor
  `UNKNOWN - verify` (measured). Pull `ABC-059` after both merge.
- Pages `ABC-053`/`054`/`055`/`057`/`058`/`059`: `ABC-073` edits their Security bullets. Run it
  after any of those it still includes have merged out, or have settled.
- `src/cli.real-engine.test.ts` (`ABC-119`, merged), `src/command-input*` (`ABC-036`),
  `src/turn-loop*` (`ABC-051`), puzzle files (`ABC-127`): no overlap with any of the eight.
- `src/coordinate-move.ts` (`ABC-104`): no open ticket and no branch touches it.

Recommended pull order (the Orchestrator's call):
1. `ABC-055` (P1, XS). The Orchestrator builds it, or freezes the board for one hop. Before
   `ABC-010` or the `ABC-072` ruling enters `In Design`.
2. In parallel with step 1 or 3: `ABC-057` (P2, XS), a disjoint file.
3. `ABC-058` → `ABC-059` (P2, XS each), one after the other on `src/cli.test.ts`. `ABC-059` goes
   after `scribe-ABC-119-lane` and `ABC-127` merge.
4. Dispatch `ABC-072` to Architect/Design for the ruling when design capacity allows (P2).
5. `ABC-073` after `ABC-072` (P3); fold it into `ABC-072`'s hop if that is cheaper.
6. `ABC-104` last (P3), alongside any ticket that already needs the owner's UAT word.
Dropped: `ABC-060`.

Not done here (fences): no `src/`, no `plans/board.md`, no ADR, no page outside the eight. Page
`epic:` reads `—` for `ABC-057`/`058`/`059` while the board rows say `EPIC-006`; this is left for
the Orchestrator. No `finding` is admissible on this install (`AGENTS.md`); this note is a hand-authored
`decision` with no seal, as every note in this repository is.

Addendum, same hop, after a rebase onto wave tip `14a1d2a`. The wave moved again during this hop:
`ABC-036`, `ABC-051` and `ABC-127` merged and are `Done`, the Scribe's `ABC-119` lane line landed,
and `ADR-0034` was proposed. None of those commits touched a file or page this batch cites:
`src/cli.test.ts`, `src/history-pane.nfr.test.ts`, `src/coordinate-move.ts`, `src/cli.ts` and the
eight pages are all byte-identical between `f76e041` and `14a1d2a`. The only conflict was the
append at the end of `plans/traceability.md`; both row sets are kept, these eight last.
`ABC-059`'s sequencing is now **met**: on the merged `AGENTS.md` (24,433 B) the counts are unchanged
at 3 occurrences, 0/3, 2/2 and 8. `ABC-055`'s board anchors are re-cited by heading rather than
line, because the board grows with every hop. So the pull order loses the "after the Scribe and
`ABC-127`" condition, and `ABC-058` → `ABC-059` can go now.
