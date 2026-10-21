---
subtask: security-nfr-ABC-163
role: security-nfr
ticket: plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
ref: .grugops/context/qe-ABC-163/
branch: grugops/qe-ABC-163 @ 2270c8fa (over SE dc4d4f15; base ccccc6bb); read only
width: 2 (beside arch-ABC-163-adr-text)
---

# Security/NFR: rule on ABC-163 (AR-095-L1UNIT close; QE G-1, G-2)

QE passed ABC-163 with gaps (`…8a60d7c8`); the edge plants are in `…7f56f339`. The Architect found the change faithful in `…c3568326`, and `…c7df0411` says AR-095-L1UNIT closes at the merge, given QE's A1–A3.

## Decide
1. **AR-095-L1UNIT.** Confirm it closes when ABC-163 merges. This is part of AR-180-VALIDATED's close condition (`…1b032e3f`, `…73eb06c5`).
2. **G-1 (proposed LOW, latent).** Deletion-only edits to a limb-1 holder fire nothing; the retired by-hand check caught them.
   - Choose one: accept as a named residual (owner, trigger: "a holder gains a guard or a multi-line read", close condition), or require that the by-hand `--name-only` check is kept alongside the instrument until fixed, or recommend a cut.
   - The Architect is landing ADR-0036 wording that names this gap (`…a7d9c818`).
3. **G-2 (LOW, pre-existing, every limb).** Deleting only the `/*` and `*/` around an import makes it live with no `+` line. Rule on it the same way.
4. **Security surface.** The change touches the instrument and the ADR only, with 0 `src/` lines. Confirm.

## Fences
- Records only, plus risk records where AR-095-L1UNIT lives.
- No `src/`, instrument, ADR, `AGENTS.md`, board or worktree edits.
- No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (task `security-nfr-ABC-163`).
- Write `.grugops/queue/done/security-nfr-ABC-163.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
