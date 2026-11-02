# se-ABC-265-fix plant and gates: QE plant QP4 reds the new row (1 failed | 11 passed); head 12/12; npm test 2 388/2 388; lint, typecheck 0

- **Plant QP4 (hit on a zero data word),** QE's own `plant.py` unchanged (`raw/scripts/plant.py`), applied to a scratch copy of the worktree at `7d9c8695` (src diffed equal first), never to `src/`:
  - edit: `if (data === 0 || ((table[base]` → `if (((table[base]` (`raw/QP4.plant.txt`);
  - `vitest run src/transposition.shared.test.ts`: **rc 1, 1 failed | 11 passed (12)**. The only red is the new row: `expected +0 to be -1` (`raw/QP4.shared.txt`).
  - Before this row, QE saw QP4 survive the default lane (189/189), `SEARCH_DEEP` transposition and A3 plant mode.
- **Head,** the same file: **rc 0, 12 passed (12)** (`raw/head.shared.txt`).
- **Gates at the worktree (code commit `7d9c8695`),** each under the host lock, one core:
  - `npm test`: **64 files, 2 388 passed (2 388)**, rc 0 (`raw/npm-test.txt`); was 2 387 at ABC-265 head, +1 is this row;
  - `npm run lint`: rc 0, 132 files, no fixes (`raw/lint.txt`);
  - `npm run typecheck`: rc 0 (`raw/typecheck.txt`).
- Not run (not in the brief): build, deep lanes, A3, G6/G7. The row is a pure unit row with no search, so it is in the default lane.
