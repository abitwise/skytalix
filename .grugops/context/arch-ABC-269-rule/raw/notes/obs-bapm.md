# arch-ABC-269-rule, page lines owed to BA/PM (records only; the Architect does not edit `plans/`). On the `ABC-269` page: `ADR-0064` ACCEPTED, B8 and the merge released, B7 graded under `Q-3K-4` = (b), B1 (d)'s scope narrowed (S1–S3 a report), and two wording fixes. On `EPIC-011`: Q-3K-4 and `ADR-0064` answered, the `G6` rule line, open owner calls, the E3 row and `NFR-005`. Each item names the anchor text it replaces or follows

Source: this task's decision note, `ADR-0064` (§ Status, § Decision log, dated lines at d2, B1 (d), B1 (e), B7, F3 and § Alternatives) and `ADR-0056` (status fold; D2, D6 and D7 dated 2026-11-03). Owner word `orch-2026-10-30a` `…cc7db847`. BA/PM words the lines; the facts below are fixed.

## A. `plans/tickets/ABC-269-…md`
1. **Front matter `adr:`.** Replace "ADR-0064 (PROPOSED 2026-11-02, … Acceptance is the owner's (\"accept ADR-0064\" / \"decline it\"). Reading (b): the build and its gates may start; B8 (the read) and the merge wait on his acceptance. B7 (G6) is graded by Q-3K-4's answer." with: "ADR-0064 (ACCEPTED 2026-11-02 by the owner, \"64 yes\", `…cc7db847`; not in force until this ticket merges; arch-E1 …d8150777, results …c524a01d, PREREG …01c2d6a5 sealed b11b802f; merged 6e11bd97). Q-3K-4 = (b): B7 graded on NFR-005's floor, \"≥ base\" reported. QE-269-a ruled (a) (arch-ABC-269-rule)." Keep the tail ("Follows ADR-0026 d10's pattern; …").
2. **A new dated banner at the top:** 2026-11-03. Owner: `ADR-0064` accepted, `Q-3K-4` = (b). Architect: `QE-269-a` ruled (a), no bar moved. B8 and the merge are released after the build and QE. The next hop is `se-ABC-269`.
3. **Banner bullet "The build may start. B8 (the read) and the merge wait on the owner's acceptance of `ADR-0064`. … B7 (`G6`) is graded only once `Q-3K-4` is answered."** Strike it and add: "B8 and the merge are released (`ADR-0064` accepted 2026-11-02). B7 is graded under `Q-3K-4` = (b)."
4. **Scope 2, after "It is the full blend bit for bit."** Add: "(The same value, not the same bits: only the delta form is `Object.is` mirror-exact, because the full form can return −0. Build only the delta form. `ADR-0064` d2 dated line, `QE-269-b`.)"
5. **Out of scope, King safety (E3) bullet.** Append: "The castled-corner residual, QE's S1–S3 (`TAPER_KP_SHELTER_STRESS`, forecast +13 / +13 / +23), is E3's (`ADR-0064` § Decision log)."
6. **B1 (d), a new sub-bullet:** "Scope (`ADR-0064` § Decision log, `QE-269-a` ruled (a), 2026-11-03): the 6 graded endings are QE's D1–D6 (`TAPER_KP_ENDINGS`). The bar covers a corner king that is not behind its own pawns on both shelter files. QE's S1–S3 (`TAPER_KP_SHELTER_STRESS`, the castled corner) are a report, not graded. The Engineer prints their three readings in the PR beside B1 (d), and QE reads them against the forecast +13 / +13 / +23."
7. **B1 (e), "(≥ 1.75 × by construction)".** Replace with "(≥ 1.6 × under trunc, the lowest being rank 2 at phases 5–6; `ADR-0064` B1 (e) dated line)". The bars are unchanged.
8. **B7, the heading "(`G6`, by `Q-3K-4`'s answer)".** Replace with "(`G6`, graded under `Q-3K-4` = (b), 2026-11-02)". Strike the "Under the default" bullet and mark it "not graded; each board's median against base is reported". The "Under the alternative" bullet becomes "Graded".
9. **B8, the heading "Waits on the owner's acceptance of `ADR-0064`."** Replace with "Released: `ADR-0064` accepted 2026-11-02."
10. **Falsifier F3 row.**
    - "fires when" becomes: "`G2` above 1.05 ×, or a B7 run below depth 6. Under `Q-3K-4` = (b), the `G6` median clause no longer fires."
    - The disposition's tail becomes: "A second miss: not merged. No value is tuned to pass `G2` or B7."
    - Drop "the Orchestrator puts `Q-3K-4` to the owner …".
11. **NFR triggers, `NFR-005`.** "B7 under each `Q-3K-4` answer" becomes "B7 under `Q-3K-4` = (b)".
12. **Dependencies, the two "Owner:" bullets.** Mark both answered: "accepted 2026-11-02 (\"64 yes\")" and "`Q-3K-4` = (b), 2026-11-02".
13. **Test note 1.** Append: "QE also froze S1–S3 apart as a report (PREREG `…1b856350`). They are ruled out of B1 (d) (`ADR-0064` § Decision log)."
14. **DoR rows 5 and 10 and the closing paragraph.** Replace the "PROPOSED / wait on accept ADR-0064 / once Q-3K-4 is answered" wording with "ACCEPTED 2026-11-02; `Q-3K-4` = (b)". Nothing is waiting on the owner.

## B. `plans/epics/EPIC-011-…md`
1. **A new dated banner:** 2026-11-03. Owner: `ADR-0064` accepted and `Q-3K-4` = (b). `QE-269-a` ruled (a): `ABC-269`'s B1 (d) covers a corner king not behind both of its shelter pawns, and the castled corner is a report that E3 owns. The P1 order line is now also in `ADR-0056` D6.
2. **§ Owner questions, row Q-3K-4.** Strike it. Answered 2026-11-02, (b): value-changing evaluation tickets are graded on play, meaning C2′ with S′ and the Levels lane, plus `NFR-005`'s floor (every run ≥ 6 at `LEVELS[5]`, depth 7 a WARN). `G6`'s median against base is reported, not graded. Scope as recorded: evaluation tickets only. Other value-changing tickets keep "≥ base" until a wider reading is recorded (`ADR-0056` D7, dated 2026-11-03).
3. **§ Owner questions, row "`ADR-0064` acceptance".** Strike it. Answered 2026-11-02: accepted ("64 yes"). Not in force until `ABC-269` merges.
4. **The line "`G6` \"≥ base\" binds as today (his word `…2ae5fc12`) until Q-3K-4 is answered."** Append the dated line "2026-11-02: answered (b)", with the same rule and scope as item 2.
5. **The "Open owner calls" line (the one reading "Q-3K-2, Q-3K-3, Q-3K-4, Q-3K-6, …").** Strike Q-3K-4. Q-3K-6, Q-3K-7 and Q-3K-8 stay open.
6. **§ Phases row E3** ("under the tuner; Q-3K-4 (`G6`)"). Strike "Q-3K-4 (`G6`)" and add: "judged on play (`Q-3K-4` = (b)). Its first graded rows are offered: QE's castled-corner S1–S3 (`TAPER_KP_SHELTER_STRESS`, `grugops/ABC-269` `d6a57653`) at ≥ 20 cp (`ADR-0064` § Decision log; `ADR-0056` D2 row E3)."
7. **§ Phases row E1 and § Tickets row 21 (`ABC-269`).** Add "`ADR-0064` ACCEPTED 2026-11-02; B7 under `Q-3K-4` = (b)".
8. **§ NFR triggers, `NFR-005`.** Append: "value-changing evaluation tickets: graded on the depth-6 floor only; the median against base is reported (`Q-3K-4` = (b))".
9. **Optional, the dedupe row `ABC-205`** ("it died on `G6` \"≥ base\" (Q-3K-4), not on play"). Append: "2026-11-02: `Q-3K-4` answered (b); a re-try under E3 is judged on play".

## Not owed
- The board: the Orchestrator's.
- `ADR-*` files: done in this task.
- The `ABC-231` and `ABC-232` pages: closed and folded, with no change.
