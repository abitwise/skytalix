---
id: 20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012
kind: observation
by: qe-e2e
at: 2026-10-10T13:32:23Z
verified_by:
confidence: high
refs:
  - ABC-057
  - ADR-0011
  - ADR-0029
  - R5
  - QE-054-b
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
  - 20261010T133223Z-qe-e2e-decision-abc057-verdict-pass-with-gaps-70eb6930
  - 20261010T133223Z-qe-e2e-observation-abc057-ledger-spans-docblock-readings-019d1043
  - 20261010T131017Z-software-engineer-decision-abc057-equality-pinned-by-framed-literal-clause3-transcribed-composer-claim-narrowed-b4c2a298
supersedes:
---

# `ABC-057` gap register: three LOW, five INFO

This note is hand-authored and unsealed. **No gap fails a criterion.** Each one is measured, and the
builds are in `…019d1043` and `../probe/`. "Gate-clean" means `biome check src` exit 0 and
`tsc --noEmit` exit 0 in the copy.

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| **QE-057-a** | LOW | **The pin covers the OPERATOR, and the guard can still lose a kill through its OPERANDS.** Two one-line, gate-clean edits outside both pinned lines drop the unlicensed-importer kill, and the whole lane stays green: (1) `runtimeImporters` gains a trailing `.filter((file) => LICENSED_DRIVERS.includes(file))`, so the equality reduces to the subset direction; (2) the guard's `production` drops a file (`perft-bench.ts`). The sibling tripwire pins the regex literal only, and its own comment ("a hop that widens the guard reds this test") claims more than it pins. **Pre-existing: base reads the same**, and `ABC-057` `A1` names the operator only, so this is not a regression and not a criterion miss | `QLHS-INTERSECT+FMT+WPERFT-STATIC` and `QSCAN-NARROW+FMT+WPERFT-STATIC`: **1583/1583** on head, 12/12 on base | Architect/Design: name it beside `R5` as the operand half of the same residual, with the same trigger. A text pin of the guard's whole statement (from `const runtimeImporters` to the comparator) would close (1). Closing (2) means touching clause 1's site, which `ABC-029` bars. Either way it needs a ticket, not this hop |
| **QE-057-b** | LOW | **The narrowed composer claim gives a count, and the count is short.** The docblock and the in-test comment say "two static value imports are NOT counted", the comment ahead of the name and the default binding. Two more are gate-clean and uncounted: a **string-named specifier** `{ "assembleFrame" as compose }`, and a **comment that contains `;` after the name** inside the brace (the tripwire's `[^;]*?` stops, so the statement is never read). The default binding is the only one that `tsc` gates today | `QF-STRING-NAME` and `QF-COMMENT-AFTER-SEMI`: tripwire GREEN, lint 0, tsc 0. `QF-COMMENT` is GREEN and gate-clean. `QF-DEFAULT-AS` is GREEN with tsc 2 | BA/PM: one clause in the same paragraph ("at least these", or name the two). Re-pointing the tripwire at `bindsAValueFrom` is out of scope by name (`ADR-0029`'s site). Neither spelling is more likely than the two already named |
| **QE-057-c** | LOW | **`turn-loop.ts`'s (i) adds to the ADR, and read literally, the ADR's (i) refuses it.** `ADR-0011` (i) says a module that "can … receive one INJECTED is NOT licensable". The loop **does** receive `GameHistory` injected (`turn-loop.ts:154`). The citation answers that injection gives the data and not the operations. That premise is not in the ADR. The loop already takes two operations injected (`InputSeam`, `EngineSeam`), so `playMove`/`takeBack` could be injected the same way. On that reading "unavoidable" is a design choice, not strict necessity. The ADR's own discharge for the loop is "(i) it advances the game, which is what a loop is", and it does not address injection. The Engineer flagged the same point (`…b4c2a298` `D2`), and QE adds the seam counterpoint | Reading of `ADR-0011` `:300-304` and `:330-332` against `turn-loop.ts:52`, `:147-154` | Architect/Design: rule which reading of "receive one injected" is meant. Then either the citation stands, or the ADR's (i) gains a sentence. `A4` reads MET on the substance in both cases |
| QE-057-d | INFO | **Equivalent edits RED the tripwire.** `toStrictEqual`, `toMatchObject` and a renamed arrow parameter keep all three kills, measured on base, but they red on head. This is an over-pin, and test note 2 accepts it: the edit has to be deliberate and visible | `QSTRICT+FMT`, `QMATCHOBJ+FMT`, `QPARAM` | none |
| QE-057-e | INFO | **Whitespace and moves.** Wrapping, trailing whitespace and CRLF red the tripwire, but each of those is lint-red already. After `biome format`, `QWRAP` is green, so on a gate-clean tree there is no false red on whitespace. A gate-clean move into a nested block (`QMOVE-NESTED+FMT`) **does** red, because the literal pins the 4-space indent. A same-indent move (`QMOVE-AFTER`) does not | `ledger-reformat-move-operand.tsv` | none. Whoever next restructures that `it` should expect it |
| QE-057-f | INFO | **The text pin cannot tell code from a comment, or reachable from unreachable.** The original line kept inside a `/* */` at the same indent, with `M15` below it, is gate-clean and green, and it loses `WSTALELICENCE`. The same line after a `return;` is green too, but `noUnreachable` lint-reds it. This is test note 2, measured | `QMOVE-COMMENTED-M15+FMT`, `QMOVE-UNREACHABLE` | none |
| QE-057-g | INFO | **`A1`'s verbatim `M15` is lint-red on both trees** (a formatting error only). Its survival "over the whole `src` lane" is a test-lane statement. The gate-clean spelling (`M15+FMT`) behaves the same: RED on head, 1583/1583 on base | `ledger-A1.tsv`, `ledger-A1-fmt.tsv` | none. Future mutant ledgers should report the gate-clean spelling beside the verbatim one |
| QE-057-h | INFO | **`WLAUNDER` does not discriminate the operator on its own.** Its plant edits `zobrist.ts`, which the `A6.3`/`A6.4` witnesses read as their control, so it stays red under `M15SUB` without the guard. `QWLAUNDER-CLIOPT` (the laundering moved to `cli-options.ts`) does discriminate it. The fix-forward's in-test comment line at `:545` is 172 characters, against a file maximum of 103 (cosmetic, coding rule 11) | `M15SUB+FMT+WLAUNDER` vs `M15SUB+FMT+QWLAUNDER-CLIOPT` on base | none, or a one-line rewrap at the next touch of the file |

**Not a gap, recorded so nobody re-derives it:**
- The licence docblock's rewritten history sentence is **true**: green at `6cd25079` (no loop) and at
  `d83a7e4d` (loop added), 11/11 each.
- The framed literal occurs once in head's text and cannot match itself. `NAIVE+M15`, the Engineer's
  trap, was not re-planted, because the framing is read directly.
