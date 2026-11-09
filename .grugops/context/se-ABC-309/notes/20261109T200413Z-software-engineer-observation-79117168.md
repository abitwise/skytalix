---
id: 20261109T200413Z-software-engineer-observation-79117168
kind: observation
by: software-engineer
at: 2026-11-09T20:04:13Z
verified_by: 
confidence: high: files and branch as listed (an observation: an artifact-ref needs a §14-gate run, and none exists)
refs:
  - se-ABC-309
  - grugops/ABC-309
  - ABC-309
  - efd2230b
  - README.md
  - plans/tickets/ABC-309-readme-the-owners-ascii-art-and-step-by-step-chess-gui-setup.md
supersedes: 
seal: sha256:fd61276444fcae7881a363c70f4b65cbcfb9f3a2f6c7c4ddec8be47db17d752c
---

# se-ABC-309: what was built

- Branch `grugops/ABC-309`, cut from `main` `efd2230b`, one commit, not pushed and not merged.
- `README.md`: the title block is replaced by `assets/readme-art.txt`, byte-equal, in a `text` fence. § Use with a chess GUI now has one options table with three rows and the per-value `TimeMode` lines, plus the Arena, Cute Chess and BanksiaGUI subsections with 4 steps each. A new § Strength gives R2's figure and its scale. § Licence loses its FIGlet credit line.
- `plans/tickets/ABC-309-readme-the-owners-ascii-art-and-step-by-step-chess-gui-setup.md`: one `## Result` block at the end, with the evidence per row and the Cute Chess deviation. No earlier line was edited.
- No test was added or changed. This is docs only, so the role's test rule has nothing to cover. UAT is waived by measurement: no `src/` path is in the diff. The QE verdict is owed (A2 to A7, plus the `UNKNOWN - verify` labels).

Recorded as an `observation`. The writer refused an `artifact-ref` because that kind needs `sha`, `gate_run` and `content_hash` from a §14-gate run, and no such run exists here.
