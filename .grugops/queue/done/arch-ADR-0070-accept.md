---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T12:51:39Z
subtask: arch-ADR-0070-accept
role: architect-design
ref: .grugops/context/arch-ADR-0070-accept/
branch: new grugops/arch-ADR-0070-accept from main — worktree .claude/worktrees/arch-ADR-0070-accept
width: records only. If any run is needed, wrap it in `flock <scratch>/host-test.lock <cmd>`; one core; no games. Host paths only as placeholders.
---
# Accept ADR-0070 in form (a), structure only; plus the owed Architect lines
Owner answer 2026-11-04 (orch-2026-10-30a …e8a3b5df): "a". ADR-0070 is ACCEPTED in form (a), structure only, in ADR-0068's form, under sealed choice rule 4 (the fallback after E3's pre-registered miss).
1. ADR-0070: set Status to ACCEPTED 2026-11-04 (owner), form (a). Restate the decision: E4a's terms (king distance, free path, unstoppable passer) land at value 0 behind the off-door pair, computed outside the pawn memo. State the build's bars as identity: node counts equal to main's at P0, evaluate Object.is-equal to main on the corpus, mirror rows, and the door pair. No games. Say what the second pull fits (KD, FP; and U's disposition: a rule value or 0, with the reason) and the memo cost at value 0. Keep the probe record as history. Add a decision-log row. Update the dated lines it wrote in ADR-0056, ADR-0067 and ADR-0064 where the order or form changed.
2. ADR-0067: the second-pull free-set lines for E4a's terms (bounds/relations they enter, by ADR-0067's F3 procedure). The d6 amendment (all relations bounded at once) and the B-T8 re-confirm stay owner questions; do not decide them, only state them as open.
3. R-281-a (from secnfr-ABC-281-a9): a rule for how often the deep lanes moved out of the default npm test are run (per ticket touching their surface, per epic, at what trigger). Write it where the ADR-0046 § Dated 2026-11-04 form S block lives.
4. QE-279-a (from qe-ABC-279): the ADR-0069 A1 (b) wording line. Find the gap in the qe-ABC-279 notes and write a dated line.
Fences: memory-bank/50-decisions + your records only. No src/tools, ticket, EPIC or board edits (BA/PM re-cuts ABC-271 after you). No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ADR-0070-accept, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note listing the owed lines for the ABC-271 page and EPIC-011; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T13:05:32Z. Records only; nothing was run, and nothing is left running. No `src/`, `tools/`, ticket, EPIC or board edit.
- **1. `ADR-0070`: ACCEPTED 2026-11-04 (owner, `…e8a3b5df`), form (a), choice rule 4.**
  - The three terms land at `{ 0, 0 }`, computed outside the pawn memo (576 KiB, +128 KiB paid at 0). No switch, no doors, no games.
  - The bars are K0–K4, in identity form: K0 node counts equal `main`'s; K1 the mirror, `Object.is` value identity on the corpora, the seam rows at the probed values, the range row and the memo words; K2 two memo-size re-pins only; K3 `G2` ≤ 1.05 ×; K4 `G6` ≥ base.
  - The probe stays as history. Log rows added. Dated lines in `ADR-0056` (E4, D6 item 5) and `ADR-0064` (d10).
  - **Door reading, flagged:** the brief's "behind the off-door pair" / "the door pair" conflicts with the accepted form (`…e0ff0aeb`: no switch, no doors). Read as "every existing door reads its pre-ticket counts"; no new door pair.
  - **U, the Architect's call:** held at 0 at the second pull, neither free nor 400. Its rule value's pre-registered row E3 (c) stays NOT MET; `ADR-0067` item 5 keeps the square out of the fit; and 400 derives from values the pull fits. The cost is stated: UN alone gave +85 cp on `zugzwang.001`.
- **2. `ADR-0067`:** a Status line, two log rows, d5 (the tracer traces E4a's four features, eg only), d6 (the second pull frees the eg halves of KD-enemy, KD-own and FP, ≥ 0; mg, R = 0 and U are held at 0; how they enter F3's procedure as written), and item 5's order. **Open, the owner's:** the d6 amendment (the margin-aware form, all relations bounded at once) and B-T8's re-confirmation.
- **3. `R-281-a`:** the rule is `ADR-0046`'s last dated section, with a Status pointer.
  - The four moved-row `-t` lines (A5 4 passed; `QE-208-a`, `ABC-230` A3 / A4 and A9 1 passed each) run at every QE hop whose diff touches a lane input or those test files, and once on `main` at each epic's close. The check is the count, and a short count is a blocking gap.
  - `R-281-a` is read closed from the first hop that applies it.
- **4. `QE-279-a`:** a dated line under `ADR-0069` d10. A1 (b)'s "board where SEE alone would call it losing" does not exist for the four; the row reads `false` with `see` stated; the guards are a cost clause, so no mutant kill is expected.
- **Notes:** `…212d6a4c` (decision: ADR-0070 / 0067 and the owed `ABC-271` / `EPIC-011` lines), `…c7cd07e0` (decision: `R-281-a`, `QE-279-a` and their owed lines). Commits: claim `90c9fa6b`, records `48bc982a`.
- **Owed (BA/PM):**
  - the `ABC-271` page: `adr:` accepted; size M → S; scope 5 struck; scope 3's value 0; K0–K4 replace P0–P8; F1–F5; NFR lines; QE freezes before the build;
  - `EPIC-011`: rows E4 and E2 and the Phase 4 order;
  - optionally, an `ABC-279` A1 (b) pointer.
- **Owed (Orchestrator):** the board; the four `-t` lines in triggered QE briefs, and the epic-close run; a pointer location for the rule; confirm the door reading.
- **Owed (Security/NFR):** `R-281-a`'s state.
