---
id: 20261109T200349Z-software-engineer-decision-7b77184b
kind: decision
by: software-engineer
at: 2026-11-09T20:03:49Z
verified_by: 
confidence: high for item 1 (Cute Chess 1.5.1 source read and a cutechess-cli run on this host); items 2-5 are layout choices
refs:
  - se-ABC-309
  - grugops/ABC-309
  - ABC-309
  - efd2230b
  - README.md
  - bapm-close-1109b/20261109T161424Z-ba-pm-decision-4fa32cf1
  - qe-ABC-295/20261109T160639Z-qe-e2e-decision-e11c410e
  - orch-2026-10-30a/20261109T152701Z-orchestrator-decision-810191ff
supersedes: 
seal: sha256:5d7f1ad364e91978b710535e4afe7126b544c1a12963b65318cce8ffcf9fbfd3
---

# se-ABC-309: README choices, and one forced deviation in Cute Chess step 2

Software Engineer, task `se-ABC-309`, branch `grugops/ABC-309` from `main` `efd2230b`. Docs only. Read first: ABC-309's page whole, BA/PM `bapm-close-1109b` `…4fa32cf1`, `…c16429d2` and `…abaaf21d`, the owner's answers `orch-2026-10-30a` `…810191ff`, and QE `qe-ABC-295` `…e11c410e`.

1. **Cute Chess step 2 cannot take `node` plus a separate argument.** In the Cute Chess 1.5.1 source on this host, the Add Engine dialog (`projects/gui/ui/engineconfigdlg.ui`) has Name, Command, Working Directory, Protocol, Init Strings and the Advanced tab. It has no argument field. `EngineConfigurationDialog::engineConfiguration()` sets the command only, and `engines.json` has no arguments key. `EngineBuilder` calls `QProcess::start(cmd, arguments)`, which takes the whole Command text as one program name. I measured this with `cutechess-cli` 1.5.1, which uses the same library: `cmd=node <full path>/dist/uci.js` prints "Cannot execute command". With `cmd=<full path>/dist/uci.js` after `chmod +x`, the game started, three options were set, and it played to its move cap. The README says this plainly and gives the working route. The script's first line, `#!/usr/bin/env node`, runs it with `node`, so `node` must be on the GUI's `PATH`. This is a deviation from A3's "command `node` and the argument" for this one GUI. The Orchestrator rules whether A3 reads as met.
2. **The options table sits in the body of § Use with a chess GUI, under no heading.** A3 asks for exactly three subsections, so the table cannot be a `###` heading of its own. Each GUI's step 3 points to "the table above".
3. **R2's figure goes in a new `## Strength` section after § Levels.** A3 rules out a fourth subsection under the GUI section. Scope 4 does not say where the figure goes. No existing section changed except § Use with a chess GUI and § Licence, as the scope allows.
4. **`level` is described in the page's own words.** The README says it "plays at the `Skill Level`'s time per move". The `go` handler takes `min(request, level budget)`. The README does not say "never past the clock" for `level`, because the page does not word it that way.
5. **Windows placeholders avoid a drive letter.** `ABC-216` A8's personal-path scan counts any `X:\`. So the README says "`node.exe` from your Node.js folder" and writes `<clone>\dist\uci.js`.
