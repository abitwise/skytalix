---
subtask: security-nfr-public-repo-redacted
role: security-nfr
ref: .grugops/context/security-nfr-public-repo-redacted/
branch: new branch grugops/security-nfr-public-repo-redacted CUT FROM main fb0a7703, worktree ../wt-security-nfr-public-repo-redacted
width: 1 of 3
---

# The public-repo review, re-published without homelab detail, plus the owner's SEC-PUB-1 disposition

## Do
- Re-seal your public-repo review findings (secrets, personal data, licence, posture; SEC-PUB-1..4, LIC-PUB-1) as NEW notes on this branch, redacted: describe each exposure by class and count only — no hostname, domain, IP, realm, cluster/context, service or secret name, no personal path.
- **"No creds" condition:** state the evidence precisely (scope, tool/patterns, commit count, result) that no credential (password, key, token, private key, kubeconfig secret value) is in any public ref's history. If you cannot stand behind it from your earlier evidence, re-run the secret scan (read-only, scratchpad output; print counts, never matches). If any credential is found: STOP and report — that is HIGH and goes to the owner.
- Record SEC-PUB-1 as ACCEPTED by the owner on that condition; LIC-PUB-1 closes with ADR-0048 accepted + ABC-214 merge.
- Rewrite main's .grugops/queue/done/security-nfr-public-repo.md Result section redacted the same way (no detail), so it can be committed.
- Before publishing, grep your branch diff and that file for IPv4/hostname/realm patterns and paste the counts (must be 0).

## Fences
- Only your new worktree, <scratchpad> and that one done/ file in main's queue. Don't modify or merge the held branch. Never push, force, amend or rebase; never merge into main; no board edits; never print a secret.

## Publish
- Seal notes (task security-nfr-public-repo-redacted). ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**PASS_WITH_RISKS (unchanged). No creds: CONFIRMED (0 credential values in any public ref's history). SEC-PUB-1 is ACCEPTED by
the owner on that condition. LIC-PUB-1 is CLOSED.** (Security/NFR, 2026-10-24. Branch
`grugops/security-nfr-public-repo-redacted` @ `a921cf77`, cut from `main` `fb0a7703`. Worktree `../wt-security-nfr-public-repo-redacted`.)

- **"No creds" evidence (re-run, not restated):**
  - **Scope.** `git ls-remote origin` (read-only) lists 2 lines, `HEAD` and the default branch, both `55a8f4ef`. There are no tags
    and no other refs, so this is unchanged since 2026-10-23. Swept: **3,056 commits, 13,619 blobs (1.96 GB), 12,556 paths, every
    commit message.** Also swept: the unpushed delta `2e67a4b5 ^55a8f4ef` (169 commits, 453 blobs).
  - **Method.** `secpub-sweep-v3` (sha256 `265c9eec799e9f82…`, session scratchpad) runs 30 strict credential rules (v2's 22 plus
    kubeconfig data and token, base64 PEM, `kind: Secret`, SOPS/age, password hashes, unquoted env secrets and CLI secret args),
    3 loose rules (one of them entropy), and a path rule over every path any commit touched. A positive control with planted fakes
    fired **all 33 rules, path rule 4 of 4.** No value was printed or stored. Hits were classified in memory by shape.
  - **Result.** 29 of 30 strict rules gave 0. `cli-secret-arg` gave 10, all false positives: 4 QE canaries, 2 placeholders,
    1 `$VAR`, and 3 copies of one prose sentence. The path rule gave 0. The loose rules gave 23 code identifiers, plus 1,621 entropy
    hits: 780 integrity hashes, 650 note ids, 189 paths and 2 slugs. **0 credentials. The delta also gave 0.**
  - **Method correction found.** v2's path rule could miss a secret-named file that shared content with another blob, because
    `rev-list --objects` gives one path per blob. v3 fixes this, and the count is still 0.
- **Re-sealed redacted notes** (task `security-nfr-public-repo-redacted`, class and count only, all read back via `readContext`):
  - `20261024T110648Z-security-nfr-observation-97867420` (scan);
  - `…fa83895b` (personal data, SEC-PUB-1..5);
  - `20261024T105232Z-security-nfr-observation-0f41702b` (licence, LIC-PUB-1);
  - `…aa568d21` (posture, 28 items in ADR-0049);
  - `20261024T110658Z-security-nfr-decision-04b04305` (result and dispositions).
- **SEC-PUB-1, MEDIUM: ACCEPTED risk.** Named owner: Olger Oeselg (note `…776bba9a`). Condition "no creds": MET. Re-open trigger:
  any credential value found in a public ref.
- **LIC-PUB-1: CLOSED.** ADR-0048 is ACCEPTED, and ABC-214 merged at `59f50717`.
- **Done file rewritten.** In main's `.grugops/queue/done/security-nfr-public-repo.md`, only the `## Result` section changed: it
  is now redacted, and the header above it is byte-unchanged.
- **Zero-count grep** (IPv4, hostname/domain, URL, realm, cluster/context, host:port, personal path, email, plus a denylist of 133
  exact exposed tokens read in memory from the held notes):

  ```
  == branch diff fb0a7703..a921cf77 (denylist tokens: 133)
  index.jsonl / index.md / 5 notes (each): ipv4=0 hostname/domain=0 url=0 realm-ref=0 cluster/context=0 port-endpoint=0 personal-path=0 email=0 denylist=0
  TOTAL 0
  == whole diff fb0a7703..a921cf77: ipv4=0 hostname=0 realm-ref=0 personal-path=0 email=0
  == done file, ## Result section: ipv4=0 hostname/domain=0 url=0 realm-ref=0 cluster/context=0 port-endpoint=0 personal-path=0 email=0 denylist=0  TOTAL 0
  == control, the unredacted done-file before the rewrite: ipv4=1 hostname/domain=2 cluster/context=2 personal-path=3 email=1 denylist=20  TOTAL 29 (non-zero, as required)
  ```
- **Fence notes for the Orchestrator:**
  - The done file's **header** (not mine to edit) still has **2 personal-path lines (13, 19)**: an absolute home path in `## Do`
    and the session scratchpad path in `## Fences`. This brief's `## Fences` has the same scratchpad path. Redact both before
    committing.
  - The owner-word note `…776bba9a` (already on `main`) names the identity-provider product. That is a product class, not a
    host, but say "identity provider" if you want it uniform.
- **Not touched:** the held branch (`5fd5ee65`), `src/`, ADRs, `plans/`, `memory-bank/`, the board. Nothing was pushed, fetched,
  merged, amended or rebased.
- **Still `UNKNOWN - verify` (owner, needs the remote):** branch protection on `main`; forks and clones; the hosting provider's
  secret-scanning alerts.

### Trace row (10 cells, header order)

| (owner action) public repo (security-nfr-public-repo-redacted) | Redacted re-seal of the public-repo review; "no creds" re-verified: 0 credential values in 3,056 public commits / 13,619 blobs (and 0 in the 169-commit unpushed delta); SEC-PUB-1 MEDIUM ACCEPTED by owner on that condition; LIC-PUB-1 CLOSED (ADR-0048 + ABC-214 `59f50717`) | EPIC-007 | — | ADR-0007 D3; ADR-0018 D3; ADR-0044 D8/D13; ADR-0048; ADR-0049; ASVS V16.2.5 (L2) | `grugops/security-nfr-public-repo-redacted` @ `a921cf77` (5 notes + index only)<br>notes …97867420, …fa83895b, …0f41702b, …aa568d21, …04b04305 | sweep-v3 (sha256 265c9eec…) with positive control 33/33 + path 4/4; redaction grep 0 on branch diff and done-file Result | — | — | PASS_WITH_RISKS; SEC-PUB-1 ACCEPTED (Olger Oeselg), LIC-PUB-1 CLOSED; posture ADR-0049 is the owner's |
