---
id: 20261110T123246Z-orchestrator-decision-fd9fcbd5
kind: decision
by: orchestrator
at: 2026-11-10T12:32:46Z
verified_by: 
confidence: high
refs:
  - README.md
  - ABC-312
supersedes: 
seal: sha256:6716b0d27ee8ec5b8fa1c7e20a91648b112bc5512f955619691bf8259a1d5a2d
---

Owner, 2026-11-10: "regarding chess GUI section, separate MacOS, Windows and Linux GUI instuctions or make it more disdinguishable so the reader finds GUI for their OS. Add GUI links. In Requirements, add link to official Node.js page." This is cut as ABC-313 by this note (README.md only; no src/, no bin/). Acceptance:

- **A1, Requirements.** "Node.js" links to the official page, https://nodejs.org/. The version text stays.
- **A2, find your OS at a glance.** At the top of "Use with a chess GUI", a table: one row per GUI (Arena, Cute Chess, BanksiaGUI, En Croissant), columns macOS / Linux / Windows, plus a link column. Platforms as published by each GUI: Arena — Windows; Cute Chess, BanksiaGUI, En Croissant — macOS, Linux, Windows. Links: Arena http://www.playwitharena.de/ ; Cute Chess https://github.com/cutechess/cutechess ; BanksiaGUI https://banksiagui.com/ ; En Croissant https://encroissant.org/ . The table says which GUIs have been run with skytalix and which have not, with no claim beyond what the current README already says.
- **A3, launcher per OS.** A short per-OS block (macOS, Linux, Windows) naming the launcher path to give the GUI: `<clone>/bin/skytalix-uci` on macOS and Linux, `<clone>\bin\skytalix-uci.cmd` on Windows, plus the existing "Linux only run / Windows untested" status. Do not drop or soften any "untested" statement.
- **A4, each GUI heading names its platforms** (e.g. "### En Croissant — macOS, Linux, Windows") and its first line links the GUI. Inside each GUI's steps, the path for each OS is clearly labelled (macOS/Linux vs Windows), never mixed in one run-on sentence. Steps are otherwise unchanged.
- **A5, checks.** Every heading anchor or internal link still resolves; markdown renders (tables have header rows); lint and build pass; the art cmp (assets/readme-art.txt vs the README block) passes; `git diff --name-only main...` is README.md plus records only. Paths stay out of records.

QE checks it, and QE's verdict signs UAT.
