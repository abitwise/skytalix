---
subtask: bapm-cut-ABC-200-followups
role: ba-pm
ref: .grugops/context/bapm-cut-ABC-200-followups/
inputs: Orchestrator …838e9652 (qe-ABC-200), …e459881c (security-nfr-ABC-200), …de0099fa (bapm-next-slice); QE …843719f4 (gaps); Security/NFR …08e4152e
width: 1
---

# Rule and cut the ABC-200 follow-ups, plus the EPIC-006 AC1/NFR-007 reading ticket

## Do
- **QE-200-a (LOW):** no row reads whether `cli.ts` plays the answered colour and level. Cut it (XS, test-only) or accept it, with a reason.
- **AR-200-C1ECHO (LOW, accepted):** the optional XS fix widens both `printableOf` copies to U+0080–U+009F (precedent AR-096-C1CP). Cut it or leave it accepted, with a reason. It may share a ticket with QE-200-d (Ctrl-D at a question writes no newline) if that is in scope.
- **Page correction on ABC-200:** the ADR-0036 (b1) lines are `cli.ts` L150, L167 and L200, and `const sink = process.stdout;` is unchanged (Security/NFR `…08e4152e`). Add a dated erratum.
- **EPIC-006 AC1 and `NFR-007`:** cut the XS fresh-clone reading ticket deferred in `…de0099fa`. It is a timing reading, so it must run on a quiet host after ABC-178.
- New tickets use ids from ABC-201, must be DoR 10/10, and must name their builder. Nothing may change an NFR bound or requirement; if one would, list it as an owner question.

## Fences
- Records only. No tests or timing runs. No `src/`, `tools/`, `package*.json` or `AGENTS.md`. On `plans/board.md`: one `_Updated` line plus new Ready cards; leave headers alone. Work on `grugops/bapm-cut-ABC-200-followups` (worktree `../wt-bapm-cut-ABC-200-followups` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm200/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-ABC-200-followups`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (ba-pm, 2026-10-22T20:16Z): **QE-200-a ACCEPTED, not cut. AR-200-C1ECHO LEFT ACCEPTED; QE-200-d INFO, no ticket. ABC-200 page erratum added. EPIC-006 AC1 + NFR-007 reading CUT → `ABC-201` (Ready, XS, P3, `EPIC-006`, DoR 10/10, builder Security/NFR). No NFR bound, level or requirement moved, so there is no owner question. Next free id: ABC-202.**

- **Where it ran:** records only, on `grugops/bapm-cut-ABC-200-followups` in `../wt-bapm-cut-ABC-200-followups`, cut from `main` `3bee4bdd`.
- **Commits:** one; not merged, not pushed.
- **Nothing executed:** no test, probe, census or timing ran. Every read was `git show`, `git diff` or `grep`.
- **Scratch:** `…/scratchpad/bapm200/` only (note bodies, the seal script, the board edit script).

**Notes** in `.grugops/context/bapm-cut-ABC-200-followups/notes/`, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: the worktree's `.grugops/context`) and read back through `readContext`:
- `20261022T201503Z-ba-pm-observation-f0c89b31`: the record reads (the QE-200-a link and its pins, the ADR routes, the two `printableOf` copies and their pin, the (b1) lines at base and tip, `NFR-007`'s prior reading, AC1's absence);
- `20261022T201509Z-ba-pm-decision-97a4b809`: the rulings, the ride-along and reopen rules, and ABC-201.

| item | ruling |
|---|---|
| QE-200-a (LOW) | **ACCEPTED, not cut.** **The gap is one link:** `cli.ts` L184–186 takes `.options` from the questions' result.<br>**What already holds it:** `cli.test.ts:4439` pins `= resolution.options;`, which reds the realistic regression (`parsed.options`). Both neighbours are read behaviourally: the questions' `A1`/`A2`, and ABC-042/ABC-101's children through the same L186.<br>**Why no XS, test-only behavioural row fits the accepted ADRs:**<br>- a child gets no TTY;<br>- substituting `./startup-questions.ts` fails `ADR-0015` (S), because it is not in the `runTurnLoop` bag;<br>- a pty lane is refused by the page's test note 4;<br>- a seam breaks `ADR-0011` clause 4;<br>- a rig that fakes `isTTY` is unlicensed.<br>Each route also spends a spawn of `NFR-008`'s 0.605 s headroom.<br>**Reopen on any of:**<br>- (R1) a `cli.ts` edit between `askAbsentOptions(` and `runTurnLoop(`, which owes a QE pty re-read of `A8` case 1;<br>- (R2) an ADR that licenses a TTY rig or a pty lane;<br>- (R3) a report that an answer was ignored (a defect, P1). |
| AR-200-C1ECHO (LOW, accepted) | **LEFT ACCEPTED.** It adds no reach (the tty echoed the bytes first; no L1 item fails).<br>**The fix is not cheap:**<br>- 2 production files;<br>- a licensed edit of the `numbersIn("cli.ts")` pin (`cli.test.ts:1777`);<br>- QE and Security/NFR hops;<br>- it cannot build before ABC-200 merges.<br>**Precedent:** `AR-096-C1CP`, on a real trust boundary, stayed accepted with its XS uncut.<br>**Ride-along:** the next ticket that edits either `printableOf` or the questions' end-of-input path folds in the C1 widening and the QE-200-d newline. |
| QE-200-d (INFO) | **INFO, no ticket.** It is cosmetic, and no criterion asks for a newline. It is in the ride-along above. |
| (b1) page correction | **Done.** A dated erratum sits under the ABC-200 page's `## NFR triggers`: L150, L167 and L200 at `1efd2cee`; `const sink = process.stdout;` unchanged (L154 at base, L164 at the tip). Verified from git objects; no text deleted. |
| EPIC-006 AC1 + NFR-007 | **CUT → `ABC-201`.** The steps: a fresh clone of `main` at sha S, then `npm install` as AC1 spells it, with an empty npm cache and an empty user config.<br>**`A2`:** `printf 'e4\n' \| npm run --silent chess -- --colour white --difficulty 5` gives exit 0, stderr 0 B, 2 plies and `input ended` ×1.<br>**`A3`:** `NFR-007` max < 2 000 ms over n ≥ 10, first launch counted, on `…8d3f6c15`'s instrument; MET, NOT MET or UNRESOLVED.<br>**`A4`:** one dated catalog insertion, with the bar byte-identical.<br>**When:** on a quiet host after ABC-178's B7/B8, behind ABC-200's `N8-LANE`.<br>**Failure routes:** a NOT MET fires `ADR-0018` D3 (an owner STOP). If Security/NFR will not run the lock's 2 install scripts, it STOPs and substitutes no flag.<br>**Record corrected:** `…8d3f6c15`'s 222.1 ms (an archive copy, 2026-10-17) is the row's only end-to-end reading, and the catalog never cited it. |

**Files:**
- `plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md` (new);
- `plans/tickets/ABC-200-…md`: the dated erratum under `## NFR triggers`, plus a dated pointer blockquote in the header. Both are mid-file, clear of QE's `## QE` append at the end of the file on `grugops/qe-ABC-200`;
- `plans/epics/EPIC-006-…md`: one dated blockquote (the cut and the record correction);
- `plans/board.md`: +2 lines, one `_Updated` line and the ABC-201 card under Ready. The `## Ready (WIP 0/8)` header is left for the Orchestrator; it should read 1/8;
- `plans/traceability.md`: one row (below);
- `.grugops/context/bapm-cut-ABC-200-followups/notes/`: 2 notes, new;
- this record, moved to `done/`, and `bapm-cut-ABC-200-followups.claim.md`.

**Not touched:** `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/nfr-catalog.md`, `memory-bank/`, board headers, other cards, other worktrees, and git config.

**For the Orchestrator:**
- the Ready header count;
- placing ABC-201 in the quiet-host queue (after ABC-178 B7/B8 and ABC-200 N8-LANE);
- the QE-200-a reopen rule R1 applies to any future `cli.ts` startup-wiring edit.

No stop.

### Trace row (10 cells, header order)

| ABC-201 (bapm-cut-ABC-200-followups) | On a fresh git clone, npm install then npm run chess starts a playable game, and the first board arrives in < 2 s: EPIC-006 AC1 + NFR-007 reading (cut). Same hop: ABC-200 follow-ups ruled — QE-200-a ACCEPTED (one statement group cli.ts L184–186, text-pinned at cli.test.ts:4439; no XS test-only behavioural row inside ADR-0015 (S) / ADR-0011 cl. 4 / test note 4); AR-200-C1ECHO left accepted and QE-200-d INFO (ride-along on the next printableOf or end-of-input edit); ABC-200 page (b1) erratum (L150, L167, L200; const sink unchanged) | EPIC-006 | — | NFR-007 < 2 000 ms max over n ≥ 10, first launch counted (bar and denominator unchanged; prior reading …8d3f6c15 222.1 ms on an archive copy, now cited); NFR-008 untouched (0 files, 0 spawns); NOT MET fires ADR-0018 D3 (owner STOP); notes …843719f4, …08e4152e, …838e9652, …e459881c, …de0099fa, …f0c89b31, …97a4b809 | grugops/bapm-cut-ABC-200-followups (records only)<br>plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md; ABC-200 page (erratum + pointer); EPIC-006 page (one dated line) | — (records only; no test, probe or timing ran) | waiver expected (0 production lines) | — | cut → Ready (XS, P3, DoR 10/10; builder Security/NFR); quiet host after ABC-178 B7/B8, behind ABC-200 N8-LANE; next free ABC-202 |
