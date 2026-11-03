---
id: 20261103T144802Z-security-nfr-observation-acbfc4d3
kind: observation
by: security-nfr
at: 2026-11-03T14:48:02Z
verified_by: 
confidence: high (regex sweep of 1,497 commits + all 192 gz blobs with a positive control that fired 27/27 rules; formats no rule names UNKNOWN - verify; remote state UNKNOWN - verify)
refs:
  - sec-host-paths
  - QE-273-b
  - SEC-PUB-1
  - ADR-0049
  - 878217bd
  - 2e67a4b5
  - 31f185b8
  - security-nfr-public-repo-redacted/20261024T110648Z-security-nfr-observation-97867420
  - qe-ABC-273/20261103T135141Z-qe-e2e-observation-334a1bf6
supersedes: 
seal: sha256:e6de186c02b4966d0f1ced4c0c2d490c44e31cd7054888e194082be8f6dbac7f
---

# Credential sweep since the last one: 0 credential values in 1,497 new commits, 7,929 text blobs and all 192 gzipped blobs (positive control 27 of 27 rules, path rule 4 of 4). ADR-0049 D4's "no creds" condition still holds

**Why.** This brief asks for a secrets, tokens and emails scan alongside the host-path review. The last full sweep
(`security-nfr-public-repo-redacted` `…97867420`) covered every public ref up to `55a8f4ef` and the unpushed delta up to
`2e67a4b5`. This sweep covers everything since then. It does not repeat that work.

**Hygiene.** Nothing was installed and everything was read-only. Output went to the session scratchpad. **No matched value was
printed into a note or stored.** Each hit was triaged from a masked context: rule, path, value length.

## Scope
- **Refs:** `HEAD` (`main` `878217bd`) plus all 11 remote-tracking refs (`origin/main` and 10 `origin/grugops/*` branches),
  minus `2e67a4b5`. There are 0 tags.
- **That is 1,497 commits** (1,491 on remote-tracking refs, plus the 6 unpushed on `main`), every commit message included. It covers 8,126 blobs (868 MB, of which 7,929 are text) and 7,649 paths, taken from
  per-commit diffs (the v3 path method).
- **The remote-tracking refs are the local copy from the last fetch.** I did not contact the remote. Whether they match the
  host now is `UNKNOWN - verify`, for the owner.
- **The 197 binary blobs the text pass skips include 192 `.gz` files**: gzipped cutechess debug logs and vitest `last-run.json`.
  `git grep` cannot see inside them either. So a separate pass decompressed **every `.gz` blob in all of history** (192 blobs,
  581 MB decompressed) and ran the same rules over them.

## Method
- **27 strict rules:**
  - cloud, VCS, chat, payment and AI-API key formats (including Anthropic and Hugging Face);
  - npm, SendGrid, Slack webhook, Azure connection string and GCP service-account formats;
  - PEM, OpenSSH and PGP private-key blocks;
  - JWTs, URL-embedded credentials and `Authorization:` headers;
  - quoted password, secret, key and token assignments;
  - kubeconfig data and `token:` lines, base64 PEM, `kind: Secret`, age keys and password hashes;
  - unquoted `*PASSWORD*=` / `*SECRET*=` / `*TOKEN*=` / `*ACCESS_KEY*=` assignments and `--password` / `--token`-style CLI arguments.
- **A secret-file path rule:** `.env*`, key and keystore files, `id_*`, `.npmrc`, `.netrc`, `.git-credentials`, `credentials*`,
  kubeconfig and `.kube/`, `.aws/`, `.ssh/`, and Terraform state and vars.
- **An email pass:** domains only.
- **Positive control first.** I built a throwaway scratchpad repo with randomly generated fakes for every rule and 4 secret-named
  files. **All 27 rules fired, with 0 silent.** The path rule found 4 of 4, the commit-message scan fired, and the email pass
  fired. So a zero below is a real zero.

## Results
- **Strict rules: 26 of 27 at 0.** The 1 hit is `b64-pem`, and it is a false positive: it is the prose of note `…97867420`
  naming that rule.
- **Secret-file paths: 0.**
- **`.gz` blobs, all history: 0 strict-rule hits.**
- **Emails at the tip, by domain:**
  - 63 are the AI co-author noreply address on commit trailers;
  - 2 are an open-source maintainer address inside a bundled licence (already SEC-PUB-5);
  - 1 is the hosting provider's SSH remote form;
  - 1 is a reserved `.invalid` fixture.
  - **The owner's personal address appears in 0 tip blobs.** It is still the author and committer address on every commit,
    which is SEC-PUB-2 and unchanged.

## Consequence
- **0 credential values.** SEC-PUB-1's acceptance condition ("ok, if no creds", carried by ADR-0049 D4) is still **MET** for the
  new history. Nothing here is HIGH.
- **This is a regex sweep, not live verification.** A credential in a format no rule names stays `UNKNOWN - verify`.
- **Not checked, because each needs the remote:** whether the hosting provider's own secret scanning raised anything. That is
  `UNKNOWN - verify`, for the owner.
