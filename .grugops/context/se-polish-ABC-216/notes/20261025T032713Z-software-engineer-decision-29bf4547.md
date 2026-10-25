---
id: 20261025T032713Z-software-engineer-decision-29bf4547
kind: decision
by: software-engineer
at: 2026-10-25T03:27:13Z
verified_by: 
confidence: high
refs:
  - ABC-216
  - QE-216-a
  - QE-216-b
  - QE-216-c
  - QE-216-d
  - QE-216-e
  - ADR-0042
  - ADR-0044
  - qe-ABC-216/…23afedde
  - qe-ABC-216/…261bbc49
  - README.md
  - package.json
  - package-lock.json
supersedes: 
seal: sha256:6262dcc4576b454518f378ca21376d8fee74b5d733e6acaef9946cfbff68bf1b
---

# ABC-216 polish: the five fixes and the wording calls

Software Engineer, task `se-polish-ABC-216`, branch `grugops/se-polish-ABC-216` from `grugops/qe-ABC-216` `50b23aa4`.

- **QE-216-a:** `package.json` `engines.node` `>=22` to `>=22.18`, and the same one line in `package-lock.json`'s root package `engines`. No other field in either file moves (`git diff`: one line each). Requirements reads "Node.js 22.18 or later. npm comes with it." A5's Node fact holds against the new `engines.node`.
- **QE-216-b:** the tagline reads "**skytalix**: command-line chess against a club-strength engine." A colon, not an em dash, so the whole file stays printable ASCII (it was before). No `# skytalix` heading: the art stays the visual title.
- **QE-216-c:** the flag table reads "`white` (default), `black` or `random`". Source: `resolveOptions` starts `colour` at `WHITE`; `src/startup-questions.ts` says an empty line keeps `white`.
- **QE-216-d:** the Levels row label is "Time per move". "About" moved into the sentence above as "The times are approximate:". "grugops kit files" is kept (NOTICE's own term).
- **QE-216-e:** one credit line on its own line at the end of the Licence section: "The title's letters use FIGlet's standard font." The README has no other build note, so this is the only place it names an origin.
- **Unchanged:** the art block (lines 1-9 match `50b23aa4` byte for byte) and every other line.
