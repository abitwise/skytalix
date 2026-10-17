---
id: 20261017T132000Z-security-nfr-decision-abc096-result-pass-with-risks-e1c94a07
kind: decision
by: security-nfr
task: secnfr-ABC-096
at: 2026-10-17T13:20:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0036
  - ADR-0043
  - ADR-0035
  - NFR-002
  - NFR-007
  - NFR-008
  - QE-096-d
  - AR-096-C1CP
  - AR-096-DISKCOLD
  - AR-095-L1UNIT
  - 20261017T131000Z-security-nfr-observation-abc096-security-review-clause-b-escape-bar-c1-4b7e2a91
  - 20261017T131800Z-security-nfr-observation-abc096-timing-a4-nfr007-window-w1-clean-8d3f6c15
  - 20261017T124700Z-qe-e2e-decision-abc096-verdict-pass-with-gaps-e5a80c37
supersedes:
---

# Security/NFR `ABC-096` (tip `c11bfec8`, code `a48da51c`, base `6edadcf0`): **PASS_WITH_RISKS**. 0 required fixes, 2 accepted LOW risks

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible, so this is a `decision`, never a stamp).
Security/NFR was the only grugops hop running. Nothing was merged or pushed, and `src/` was not edited.

| item | reading | state |
|---|---|---|
| clause (b), `ADR-0036`, canonical instrument | limbs 1/2/3: 0 (b1) lines, 0 new runtime edges, 0 word hits | **does not fire** |
| clause (b) Ruling 2, by hand, holders at base and head | `{src/book-file.ts}` at both; 0 diff lines in it | **does not fire** |
| escape bar (`ABC-018` / G7, `A3`), emitted frames, 14 hostile names × 2 modes | 0 ESC, 0 C0, 0 DEL; 0 code points above `U+007F` in ascii; 23 rows | **holds** |
| narrowed seam type | `Pick<BookProbe, "openingName">`, `import type`; one call site; compile-time control, mutants killed by `tsc` | **adequate** |
| new file read / dependency / spawn | 0 / 0 / 0; one read per process through the holder | **none** |
| `A4` `< 16 ms` (`NFR-002`) | max 0.447 ms over 3 `A4` cases × 10 processes; 1 MiB name 0.517 ms; real probe 1.861 ms worst | **MET** |
| `NFR-007` first call `≤ 30 ms` cold, real `npm run chess` | max 6.047 ms, first call `openingName` with 1 read inside, 10 / 10 | **MET** |
| `NFR-007` `< 2 s` to the first board | max 222.1 ms, 10 / 10 | **MET** |
| `NFR-008` | 0 new files, 0 new spawns (count pin) | **held by count**; content not timed |
| unicode-mode C1 / bidi code points from a book name | pass to the terminal; shipped book has 0 | **`AR-096-C1CP`, LOW, accepted** |
| disk-cache-cold first call | not read (needs `sudo purge`) | **`AR-096-DISKCOLD`, LOW, accepted** |

**Required fixes: none.** `security.block_on` is `high`, and nothing here is high or medium.

**Accepted risks, each with a named owner.**
- **`AR-096-C1CP` (LOW; owner: the Orchestrator, who routes the follow-up).**
  - **The risk.** In unicode mode, C1 code points (`U+0080`–`U+009F`) and bidi controls in a book name reach the
    terminal. Some UTF-8 terminals act on a decoded C1 code point (VTE has); xterm does not.
  - **Why it is LOW.** 0 shipped names carry one. A new upstream name enters only through a human re-pin of the sha256
    and a recompile.
  - **The compiler's gap.** Its defence-in-depth refusal covers C0, DEL and ESC only.
  - **Recommended:** an `XS` ticket that widens that refusal (`tools/opening-book/compile.ts`, outside this fence).
  - **Trigger:** the next re-pin of the book source, or the next edit to `compile.ts`.
  - **Do not misread this as a re-open.** It does **not** re-open the catalog's C1-byte ruling, and it asks for **no**
    change to `sanitize`.
  - **Severity reason.** No ASVS L1 requirement fails as written, and `A3` is met to the letter. Detail: note
    `…4b7e2a91` §4.
- **`AR-096-DISKCOLD` (LOW; owner: Architect/Design, who owns `ADR-0043` § Rollback's "a measured first-frame parse
  that approaches `NFR-007`'s bar").**
  - **What was read.** The first call was cold in the bar's own sense: the first call in a fresh process, 6.047 ms max.
  - **What was not read.** A page-cache-cold read. The only figure on record for it is the Architect's single 24.4 ms
    run, which is 81 % of the 30 ms bar.
  - **Exposure.** At worst one first launch after a cache drop takes tens of ms longer, against 222 ms end to end and
    a 2 s bar.
  - **Trigger:** any reading of the first call over 20 ms, or a book artifact more than 1.5 × today's 356,526 B. At either
    point a disk-cold reading is owed before the next `ABC-093`-family merge.

**Pre-existing, not this ticket's, carried unchanged.**
- `AR-095-L1UNIT` (the Ruling 2 fold into `clause-b.mjs`, owed by Architect/Design) is still open, so Ruling 2 was
  applied by hand.
- `readBookFile` reads the whole file before the 1 MiB check (note `…4b7e2a91` §5). This ticket moves that read to
  just before frame 0, and adds no input to it.

**QE's gaps as they stand at this hop.**
- `QE-096-a` and `QE-096-b` are closed by the SE repair `3ceda09a` (two rows, read in the tip's
  `src/render-seam.test.ts`).
- **`QE-096-d` is discharged by this hop**, with T1 and T2 MET in a clean window.
- `QE-096-c`, `-e`, `-f`, `-g` and `-h` are unchanged. `-g` is observed on hostile names (`...` alone) and is harmless.

**Next column (the Orchestrator's move): `In Security/NFR` → `Ready for UAT`.** UAT is **not** waived: the waiver grep
prints 3 production files. The owner's word signs it (page § UAT observations).

**Owed elsewhere, not done here (outside the brief's scope).** The `NFR-007` catalog row is still `UNKNOWN - verify`.
Its next edit should cite note `…8d3f6c15`'s 222.1 ms reading, on this machine.
