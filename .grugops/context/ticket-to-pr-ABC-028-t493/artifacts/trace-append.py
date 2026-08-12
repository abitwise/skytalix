#!/usr/bin/env python3
# Append-only edit of the FIRST (LIVE) ABC-028 row's Status cell, plus one new _Updated line.
# Every precondition and postcondition is ASSERTED, not eyeballed. The file's own escape-aware
# COLUMN INVARIANT is the counter used, not a naive split.
import re
import sys

PATH = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-t493/plans/traceability.md"

APPEND = (
    " **`G1` REPAIRED 2026-08-13 by the Software Engineer (task `abc028-t493-2026-08-13`, subtask "
    "`ticket-to-pr-ABC-028-t493`, Workflow 04, branch `grugops/ABC-028-t493`) — THE LAST ITEM THIS "
    "TICKET OWED. `src/history-pane.test.ts`'s *\"with zero catchers anywhere in the project\"* IS "
    "GONE, and it was replaced by a MECHANISM rather than by another census.** **ONE FILE, COMMENT "
    "TEXT ONLY:** `src/history-pane.test.ts` md5 `9533f05038780def980bf5a86707cdbd` -> "
    "`1b23df27a9a67ef0ed359dd33456ee1b`, the `A9` doc comment's four lines `:491-494` rewritten as "
    "eight (`+8 / -4`, and `git diff --stat` shows that one file and nothing else); "
    "**`src/history-pane.ts` md5 UNMOVED at `c4653c4c263c4c417ea34969164ccd86` with an EMPTY diff — "
    "this ticket's zero-production-line fence held.** **NO NUMBER WAS REFRESHED:** `732/732 on 26 "
    "files` was DELETED, not taken to `807/28`, per this page's standing instruction. **The "
    "replacement asserts nothing about the tree** — it states that a snapshot over an "
    "already-rendered module-scope singleton is BLIND to a once-per-object corruption, a fact about "
    "the code in front of the reader that no neighbour's commit can falsify — and it names the "
    "second catcher as a CRITERION (`ABC-028` `A4`, in the SAME file at `:946`), never as a count. "
    "**RE-DERIVED ON THIS TIP `47fef3d`, nothing inherited:** `WPOS` rebuilt from scratch on my own "
    "md5-pinned out-of-tree lane with a null control, and run BOTH BEFORE AND AFTER the edit with "
    "identical results — NULL CONTROL `0 failed / 807 on 28 files`, `WPOS` `2 failed / 807 on 28 "
    "files`, the two kills being `A9` and this ticket's own `A4`. The pin was proved to REFUSE: a "
    "stale digest throws `PIN MISMATCH` instead of measuring. **Gates on the edited tree: lint 0 (2 "
    "PRE-EXISTING `biome.json` infos), typecheck 0, build 0, unit `807 / 807` on 28 files, skip 0; "
    "`src/history-pane.test.ts` alone 26/26.** **FLAGGED NOT FIXED (rule 12): "
    "`src/history-pane.test.ts:1014` (BA/PM's instance 2, latent, explicitly excluded from this "
    "repair); `src/zobrist.nfr.test.ts` and `src/status-panel.nfr.test.ts` (`ABC-030`'s); the "
    "duplicate `ABC-028` / `ABC-029` rows in THIS table — appended to the FIRST of the pair, "
    "deleted nothing; the 2 `biome.json` lint infos; and a NEW one — `ABC-028` `A4` shares its "
    "letter with `ABC-017` `A4` at `:351` in the same file, so the new comment qualifies the "
    "reference by ticket.** **NO TIMING MEASUREMENT TAKEN** (instructed; the machine is not quiet, "
    "and a comment-only edit's `N8-LANE` delta is zero by construction). **`plans/board.md` NOT "
    "opened; no ADR, `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`, `ABC-030` or any merged ticket "
    "opened; no other worktree entered; nothing merged, pushed or deployed; no `git checkout "
    "main`.** **Board move `In Development -> In Review` REQUESTED, NOT TAKEN.**"
)

UPDATED = (
    "_Updated: 2026-08-13 by Software Engineer (task `abc028-t493-2026-08-13`, subtask "
    "`ticket-to-pr-ABC-028-t493`, Workflow 04): **`ABC-028`'s LAST OPEN ITEM IS CLOSED — the `:493` "
    "exhaustiveness claim is repaired, and NOT by another census.** The false sentence *\"with zero "
    "catchers anywhere in the project\"* and the stale `732/732 on 26 files` are both deleted; what "
    "stands in their place is the MECHANISM — a snapshot over an already-rendered module-scope "
    "singleton is blind to a once-per-object corruption — which cannot be falsified by anyone's "
    "commit, plus the second catcher named as a CRITERION (`ABC-028` `A4`) rather than as a count. "
    "**COMMENT TEXT ONLY, ONE FILE, `+8 / -4`; `src/history-pane.ts` md5 unmoved and its diff "
    "EMPTY.** **Every number re-derived on tip `47fef3d`, none inherited: `WPOS` rebuilt on my own "
    "pinned out-of-tree lane with a null control and measured before AND after the edit — `0 failed "
    "/ 807` control against `2 failed / 807` on 28 files, dying at `A9` and `A4` both times.** "
    "Gates: lint 0, typecheck 0, build 0, `807 / 807` on 28 files, skip 0. **ONE ROW EDITED — the "
    "FIRST (LIVE) `ABC-028` row, APPEND-ONLY to its `Status` cell**; 10 columns before and after "
    "under the file's own escape-aware counter, every other row asserted BYTE-IDENTICAL, and the "
    "pre-edit cell text asserted to still be a PREFIX of the new one. **The duplicate rows were NOT "
    "de-duplicated** (rule 12; still the Orchestrator's). Board NOT opened; `In Development -> In "
    "Review` REQUESTED, not taken._"
)

ESC_SPLIT = re.compile(r"(?<!\\)\|")


def columns(line):
    return len(ESC_SPLIT.split(line.strip().strip("|")))


with open(PATH, encoding="utf-8") as fh:
    before = fh.read()
lines = before.split("\n")

# --- preconditions -------------------------------------------------------------------------
abc028 = [i for i, l in enumerate(lines) if l.startswith("| ABC-028 ")]
assert len(abc028) == 2, f"expected exactly 2 ABC-028 rows, got {len(abc028)}"
target = abc028[0]  # THE FIRST OF THE PAIR — the live one, per the COLUMN INVARIANT note
assert len(lines[target]) > len(lines[abc028[1]]), "the FIRST row must be the long/live one"
assert columns(lines[target]) == 10, f"target row is {columns(lines[target])} columns, not 10"
assert lines[target].rstrip().endswith("|"), "target row must end with |"
assert "|" not in APPEND and "|" not in UPDATED, "append text must not introduce a pipe"
table_rows_before = sum(1 for l in lines if l.startswith("| "))
old_row = lines[target]
old_cell = old_row.rstrip()[:-1]  # everything up to the trailing pipe

# --- the two writes ------------------------------------------------------------------------
lines[target] = old_cell + APPEND + "|"
lines.insert(1, UPDATED)
lines.insert(2, "")

after = "\n".join(lines)
with open(PATH, "w", encoding="utf-8") as fh:
    fh.write(after)

# --- postconditions ------------------------------------------------------------------------
check = open(PATH, encoding="utf-8").read().split("\n")
new_target = target + 2
assert check[new_target].startswith("| ABC-028 "), "target row moved unexpectedly"
assert columns(check[new_target]) == 10, f"post-edit columns {columns(check[new_target])} != 10"
assert check[new_target].startswith(old_cell), "PRE-EDIT CELL TEXT IS NOT A PREFIX — not append-only"
assert sum(1 for l in check if l.startswith("| ")) == table_rows_before, "table row count moved"

old_lines = before.split("\n")
moved = []
for i, l in enumerate(old_lines):
    j = i if i < 1 else i + 2
    if check[j] != l:
        moved.append(i + 1)
assert moved == [target + 1], f"lines other than the target row changed: {moved}"

print(f"OK  target row (1-based, pre-edit) = {target + 1}, now {new_target + 1}")
print(f"OK  columns 10 -> 10 (escape-aware), table rows {table_rows_before} -> {table_rows_before}")
print(f"OK  append-only: pre-edit cell is a prefix; +{len(APPEND)} chars")
print(f"OK  exactly one line changed: {moved}; one _Updated line inserted at line 2")
print(f"OK  stale duplicate row (line {abc028[1] + 1} pre-edit) untouched, not deleted")
sys.exit(0)
