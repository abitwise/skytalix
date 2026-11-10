---
id: 20261110T123846Z-qe-e2e-observation-eee52bf3
kind: observation
by: qe-e2e
at: 2026-11-10T12:38:46Z
verified_by: 
confidence: high: every check run by QE at c71ee1ae (diff, web GETs, links, tables, art cmp, lint, records check); GUI render and non-Linux paths UNKNOWN - verify
refs:
  - qe-ABC-313
  - ABC-313
  - grugops/qe-ABC-313
  - grugops/ABC-313
  - c71ee1ae
  - 42de2ac5
  - README.md
  - assets/readme-art.txt
  - orch-2026-10-30a/20261110T123246Z-orchestrator-decision-fd9fcbd5
  - se-ABC-313/20261110T123447Z-software-engineer-observation-6d73c1c6
  - qe-ABC-312/20261110T105823Z-qe-e2e-observation-0985a5c0
supersedes: 
seal: sha256:b89f003e1e7657a4b9ced410404a1c6e9fd0aa9c83040403dd95e52daab0e1af
---

# qe-ABC-313 observation: README GUI per OS, checked at c71ee1ae

Branch grugops/qe-ABC-313 from grugops/ABC-313 at c71ee1ae (README commit 42de2ac5), in a worktree <worktree>. Spec: orch-2026-10-30a/20261110T123246Z-orchestrator-decision-fd9fcbd5 (A1-A5). SE note read: se-ABC-313/20261110T123447Z-software-engineer-observation-6d73c1c6. QE re-ran every check and reused none of the SE's output. No qe-ABC-313 context existed before this note.

## Diff and records
- `git diff --name-only main...grugops/ABC-313`: README.md and the SE note only. No src/, no bin/, assets/readme-art.txt unchanged (`git diff --quiet` exit 0).
- `node tools/grugops/records-path-check.js --base main --head grugops/ABC-313`: "clean", exit 0.

## A1
- Line 14: "[Node.js](https://nodejs.org/) 22.18 or later. npm comes with it." Version text unchanged. GET https://nodejs.org/ -> 200 (redirect to /en).

## A2, table vs the GUIs' own sites (curl, read-only GETs, 2026-11-10)
- Table at lines 85-90: header row, separator row, 4 GUI rows; every line has 7 pipes (6 columns). Blank line before it.
- Links: http://www.playwitharena.de/ 200; https://github.com/cutechess/cutechess 200; https://banksiagui.com/ 200; https://encroissant.org/ 200. https://www.playwitharena.de/ fails TLS (certificate name mismatch), so the http link is the right one.
- Arena, http://www.playwitharena.de/: the page says "It runs on Linux or Windows." It offers "Arena 3.5.1 for Windows" (setup.exe, zip) and "Arena 3.10beta for Linux" (arenalinux_64bit_3.10beta.tar.gz; HEAD -> 200 application/x-gzip), plus 3.9beta (64-bit, aarch64) and 1.1 for Linux. macOS appears only as "Linux/Mac: Wine support improved"; there is no native macOS build. README says Arena Linux "no" and heads the section "Arena — Windows". WRONG for Linux; macOS "no" is right.
- Cute Chess, api.github.com releases/latest: v1.5.1 (2026-06-14), assets cutechess-1.5.1-win64.exe, cutechess-1.5.1-win64.zip, Cute_Chess-1.5.1-x86_64.AppImage. No release since 2016 (cli-0.8.2's cutechess-cli-osx.zip, CLI only) carries a macOS asset. The repo README points to Releases or building from source; the official wiki "Building from source" has a "## macOS" section (Homebrew Qt, cmake); .github/workflows/build.yml builds on macos-latest. So macOS is supported from source, with no macOS download. README "yes" is defensible but does not say this.
- BanksiaGUI, https://banksiagui.com/download/: "You need a 64-bit OS, Windows, macOS, or Linux." Version 0.58 (RC1, 18 Jan 2023) for MS Windows 64 bit, macOS, Apple Silicon, Linux 64 bit. README yes/yes/yes is right; 0.58 matches the steps' lead-in.
- En Croissant, api.github.com releases/latest: v0.15.1 (2026-09-05), assets include en-croissant_0.15.1_aarch64.dmg, _x64.dmg, _amd64.AppImage, _amd64.deb, -1.x86_64.rpm, _x64-setup.exe. https://encroissant.org/download (200) lists MacOS, Apple Silicon, Linux, Windows. README yes/yes/yes is right.
- "Run with skytalix" column vs main's README: Arena "Not tried" = main "They have not been tried in Arena". Cute Chess = main "Running dist/uci.js directly was tested there; the launcher has not been tried". BanksiaGUI "Not tried" = main. En Croissant = main's owner-launcher sentence and "have not been tried". No new test claim.

## A3
- Lines 92-102: the intro is word for word main's, with "It has been run on Linux only." and "**The Windows launcher is untested.**". New list: macOS `<clone>/bin/skytalix-uci` "Not run on macOS."; Linux same path "Run on Linux."; Windows `<clone>\bin\skytalix-uci.cmd` "**Untested.**". "Run on Linux." is backed by qe-ABC-312/20261110T105823Z-qe-e2e-observation-0985a5c0 (launcher runs on Linux, real engine) and by main's "run on Linux only"; no new claim.

## Untested statements, main vs branch
- Every sentence of main's README matching untested / not been tried / tested / been run / not been checked / ran skytalix was extracted from both files (newlines joined). All 11 of main's survive verbatim on the branch. The only new ones are the two table cells and the two A3 lines above, all consistent with main.

## A4
- Headings: "### Arena — Windows", "### Cute Chess — macOS, Linux, Windows", "### BanksiaGUI — macOS, Linux, Windows", "### En Croissant — macOS, Linux, Windows". First line under each: "Site: [<GUI>](<link>)", same links as the table.
- Paths in steps: Cute Chess, BanksiaGUI, En Croissant step 2 end with a sub-list "macOS and Linux: `<clone>/bin/skytalix-uci`" / "Windows: `<clone>\bin\skytalix-uci.cmd`". Arena step 2: "the Windows launcher, `<clone>\bin\skytalix-uci.cmd`". No run-on mixed sentence remains.
- Deviation 1, BanksiaGUI step 2 gained the labelled macOS/Linux path. The heading names three platforms and A4 asks each OS's path to be labelled, so this is what A4 needs; it is an instruction, not a test claim, and the "0.58 on Windows ... have not been tried" lead-in is unchanged. Accepted.
- Deviation 2, Cute Chess step 2 sets Name and Protocol before Command, so the path list ends the step. Same fields and values; order of setting fields in one dialog does not change the outcome. Accepted.

## A5
- Internal links: [AGENTS.md], [LICENSE], [NOTICE], all present. `git grep` for README anchors or (#arena|#cute-chess|#banksiagui|#en-croissant|#use-with) outside .grugops: no match, so the renamed headings break nothing.
- Tables: all four README tables have a header and separator row and a constant pipe count per table (3, 9, 7, 5).
- Art: README lines 2 up to the closing fence vs assets/readme-art.txt: cmp exit 0.
- `flock <scratch>/host-test.lock npm run lint` (biome check .): "Checked 148 files ... No fixes applied.", exit 0.
- Build: not re-run by QE (README-only diff, no .ts changed; the SE ran it). No test suite run: no src change, as briefed.

## Not checked
- GitHub's rendering of the 6-column table (checked structurally only). UNKNOWN - verify.
- Any GUI on any OS, and both launchers on macOS and Windows: not run, as before. UNKNOWN - verify.
