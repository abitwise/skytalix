# arch-ABC-230-reading probes

Scratch copies of `main` `989093f3`'s `src/` (tree `1bf0138a`), never `src/` itself. Single process, frozen clock or
fixed depth, deterministic. `pgrep -x cutechess-cli` empty before each run; load1 about 10 (a sibling build live).

| probe | script | output | CPU | what it reads |
|---|---|---|---|---|
| Q3-1 | `bookwalk.mts` | `bookwalk.txt` | 0.3 s | book entries reached from startpos that are keyed on an uncapturable ep square (re-keyed under Q3 (b)) |
| Q3-2 | `nodes.mts` + `variant-b.diff` | `nodes-d4.txt`, `nodes-d5.txt` | 0.9 s, 1.7 s | fixed-depth `search()` nodes and score, main's key against Q3 (b)'s key (ep only with a capturer beside the pushed pawn; full recompute at the call sites) |
| H | `history.mts` + `variant-history.diff` | `history.txt` | 0.9 s | ADR-0054's scan on fixtures: base, the two-match rule (r3), the one-match rule (r2), and identity rows |

Run: `node <script>` from a directory holding `src/` (main), `srcb/` (main + variant-b.diff) and `srcc/` (main + variant-history.diff); `bookwalk.mts` takes the book path.
