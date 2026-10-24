---
subtask: arch-public-posture-adr
role: architect-design
ref: .grugops/context/arch-public-posture-adr/
branch: same records branch as arch-accept-adr0048
width: shared agent (claim_cap 2)
---

# The public-repository posture ADR (next free number), PROPOSED

## Do
- Draft the ADR that replaces the "private / never distributed" posture now that the repo is public on GitHub (owner-made): what is public, what stays local-only (deploy none-local-only is unchanged), SEC-PUB-1 accepted with no history rewrite, the licence via ADR-0048. List every record whose posture statement is now false (Security found ~28; ADR-0007, ADR-0018, ADR-0044 D8, EPIC-007 M10 / ABC-169, 45-standing-rulings § Deployment posture, runbook) with a disposition each; edits happen on acceptance.
- Status PROPOSED — a new ADR is the owner's to accept.
- **Copy no homelab detail** (no hostnames, addresses, realm, cluster, service or secret names, no personal paths). Describe the class of exposure only.

## Fences / Publish
- As arch-accept-adr0048. Seal notes (task arch-public-posture-adr), then move this brief and its claim.md to done/.

## Result

**Done, records only. ADR-0049 is PROPOSED, and acceptance is the owner's.** Branch `grugops/arch-accept-adr0048` @ `294ad56e` (commit `294ad56e`, on `84bbd248`, from `main` `fb0a7703`). Not pushed and not merged.

- **ADR:** `memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md`. The next free number was checked across every local branch.
- **Decisions:**
  1. Public: every pushed ref, the full history, the tracked files and commit metadata. Pushing stays the owner's, and held branches are never pushed.
  2. Local-only, unchanged: nothing is deployed, `none-local-only`, `"private": true`, no release, no CI, and the confirmation flag stays `true`.
  3. ADR-0018's channel, now reachable by anyone. No `npx`.
  4. SEC-PUB-1 is accepted on "no creds", with no history rewrite. A found credential lapses it (HIGH). From acceptance on, records name infrastructure by class and count only.
  5. The licence is ADR-0048's.
  6. `host-protection.js` exit 2 becomes a real `UNKNOWN - verify`.
  7. Publication cannot be rolled back.
- **§ Records: 37 rows with a disposition each.** Security/NFR's 28 items are rows 1–10, 12–16, 18–20, 26–34 and 36. Rows 11, 17, 21–25, 35 and 37 were added at this hop. One addition is the 45-standing-rulings § Branching model "No git remote, so `pr` …" trap.
  - Dated line or dated note on acceptance: Architect/Design rows 2–4, 7–10, 12, 15, 18, 30–33; the Scribe rows 28, 29, 35; Security/NFR row 34.
  - Answered by ADR-0048: rows 13, 14, 16, 17 (applied today) and rows 20–24 (BA/PM rows 11–13).
  - None: rows 1, 5, 6, 11, 19, 25–27 (history, a sealed note, a Done ticket), and rows 36 and 37 (still true).
- **Homelab fence:** the held branch was read for structure only. A pattern scan of the branch diff found 0 IPv4 addresses, 0 personal paths, 0 realm, cluster or service names, and 0 secret names. The only domain is the public Michniewski page.
- **Empty diff:** `git diff --stat fb0a7703..HEAD -- src tools package.json` printed nothing (exit 0). `reference-check.js` on ADR-0049 printed `No findings.`
- **Note:** `.grugops/context/arch-public-posture-adr/notes/20261024T103602Z-architect-design-decision-9e0aa7c8.md` (decision). It was sealed by `admitAndAppend`, read back, and the index was rendered.
- **For the owner:**
  - Accept or reject ADR-0049.
  - Check on the host: branch protection on `main`, which refs are public, forks and clones, and secret scanning.
  - The suggestion (not a gate): confirm the lab's admin consoles are not internet-reachable.
  - SEC-PUB-2 to SEC-PUB-4 stay his.

### Trace row (10 cells, header order)

| (owner action) public repo (arch-public-posture-adr) | ADR-0049 PROPOSED: the source is public on GitHub (owner …59df15ce); still deploys nowhere and publishes no package; ADR-0018 channel reachable by anyone; SEC-PUB-1 accepted on "no creds" (…776bba9a), no history rewrite; licence via ADR-0048; 37 records listed with dispositions, edits on acceptance | EPIC-007 | — | none moves (availability stays not-applicable-local-only); ADR-0007 D3 and ADR-0018 D3 fired; host-protection exit 2 becomes a real UNKNOWN on acceptance | `grugops/arch-accept-adr0048` @ `294ad56e` (on fb0a7703)<br>ADR-0049 + note …9e0aa7c8 | records only: `git diff --stat fb0a7703..HEAD -- src tools package.json` empty; reference-check No findings.; homelab pattern scan 0 | — | — | PROPOSED → owner (accept/reject) |
