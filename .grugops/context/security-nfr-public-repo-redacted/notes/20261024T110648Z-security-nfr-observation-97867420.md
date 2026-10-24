---
id: 20261024T110648Z-security-nfr-observation-97867420
kind: observation
by: security-nfr
at: 2026-10-24T11:06:48Z
verified_by: 
confidence: high (full-history regex + entropy sweep with a positive control that fired all 33 rules; regex not live-verified, UNKNOWN - verify for formats no rule names)
refs:
  - security-nfr-public-repo-redacted
  - SEC-PUB-1
  - 55a8f4ef
  - 2e67a4b5
  - 20261024T091000Z-orchestrator-decision-776bba9a
  - 20261023T212113Z-security-nfr-observation-0123715b
  - SEC-177-1
supersedes: 
seal: sha256:630ede5acc186c1b9bb0cc7cbbe464f0f02cfbfd6419ec7b94c88d6a4a60ef36
---

# "No creds" evidence: 0 credential values in the history of every public ref (3,056 commits, 13,619 blobs, re-swept 2026-10-24 with 30 strict rules and a positive control)

This is the evidence for the owner's condition on SEC-PUB-1 (*"ok, if no creds"*, note
`20261024T091000Z-orchestrator-decision-776bba9a`). The 2026-10-23 sweep (`…0123715b`, held branch, never merged) already
reported 0. I re-ran it with a wider rule set rather than restate it, because that sweep had **no rule for kubeconfig secret
values, base64-encoded keys or unquoted env/CLI secrets**, which are the exact shapes a cluster capture would leak.

**Hygiene.** Nothing was installed. Every read was read-only. All output went to the session scratchpad. **No matched value was
printed or stored**: each hit was recorded as rule, blob, path, line, value length and value class only, and it was classified
in memory.

## Scope: what is public
- `git ls-remote origin` (read-only, 2026-10-24) lists **2 lines, `HEAD` and the default branch, both `55a8f4ef`**. There are no
  tags and no other branches. That is unchanged since 2026-10-23, and the local remote-tracking ref matches.
- "Public" means every object reachable from `55a8f4ef`:
  - **3,056 commits** and **13,619 unique blobs** (1,964,612,916 bytes; 3 binary skipped);
  - **12,556 distinct paths ever touched**;
  - every commit message.
- **Also swept: the unpushed delta**, `main` `2e67a4b5` `^55a8f4ef`. That is 169 commits and 453 blobs, which is what the owner's
  next push would publish.

## Method: `secpub-sweep-v3` (Python, sha256 prefix `265c9eec799e9f82`, kept in the session scratchpad)
It walks `git rev-list --objects`, reads each blob through `git cat-file --batch`, and scans the full text and every commit
message.
- **30 strict credential rules:**
  - **v2's 22:** cloud, VCS, chat, payment, AI-API, npm and mail-provider token formats; webhooks; Azure connection strings; GCP
    service accounts; PEM/OpenSSH/PGP private-key blocks; JWTs; URL-embedded credentials; `Authorization:` headers; quoted
    password/secret/key/token assignments.
  - **8 new:**
    - kubeconfig `client-key-data` / `client-certificate-data` / `certificate-authority-data` values;
    - kubeconfig `token:` lines;
    - base64-encoded PEM (`LS0tLS1CRUdJT…`);
    - Kubernetes `kind: Secret` manifests;
    - SOPS/age secret keys;
    - bcrypt / apr1 / sha512-crypt password hashes;
    - unquoted `*PASSWORD*=` / `*SECRET*=` / `*TOKEN*=` / `*ACCESS_KEY*=` shell assignments;
    - `--password` / `--secret` / `--token` / `--api-key` CLI arguments.
- **3 loose rules:** keyword assignment; hex near a keyword; and a new high-entropy (≥ 4.5 bits per char, mixed-class) value after
  `:`/`=`.
- **A secret-file path rule over every path any commit ever touched** (`.env*`, key and keystore files, `id_*`, `.npmrc`,
  `.netrc`, `.git-credentials`, `.htpasswd`, `credentials*`, `secrets.*`, kubeconfig and `.kube/`, sealed-secret manifests,
  `*.tfstate`/`*.tfvars`, `.aws/`, `.ssh/`, `*.kdbx`, `*.ovpn`, databases).
  - **This corrects a v2 blind spot.** v2 took paths from `rev-list --objects`, which names each blob under one path only. A
    secret-named file whose content equalled another blob's was invisible. v3 takes paths from per-commit diffs.
  - The canary proved it: 1 of 4 planted secret files with v2's method, 4 of 4 with v3's.
- **Positive control first.** A throwaway scratchpad repo with randomly generated fake values for every rule fired **all 33
  rules (0 silent)**, the path rule 4 of 4, and the commit-message scan. A zero below is a real zero.

## Results on the public history (`55a8f4ef`, all 3,056 commits)
- **Strict rules: 29 of 30 at 0** across 13,619 blobs and every commit message. That includes kubeconfig data and tokens, base64
  keys, `kind: Secret` manifests, private-key blocks, JWTs, URL credentials and unquoted env secrets.
- **`cli-secret-arg`: 10 hits, all false positives:**
  - 4 are QE's planted canaries in the `SEC-177-1` redaction tests;
  - 2 are `<value>`-style placeholders;
  - 1 is a `$VARIABLE`;
  - 3 are one prose sentence ("the `--`-token" followed by an ordinary word) in three versions of one ticket.
- **Secret-file path rule: 0 paths.**
- **Loose keyword: 23 hits, all code identifiers** (a command-token table and `token`/`tokens` locals).
- **Loose entropy: 1,621 hits (1,619 blobs + 2 messages), all non-credential by shape:**
  - 780 npm `integrity` hashes;
  - 650 note ids;
  - 189 repo or scratch paths;
  - 2 dashed-word slugs.
- **Result: 0 credential values.** That means no password, key, token, private key or kubeconfig secret value. The private-homelab
  captures (SEC-PUB-1) hold names, addresses and `$VARIABLE` references only.

## Results on the unpushed delta (`2e67a4b5 ^55a8f4ef`, 169 commits, 453 blobs)
- **Strict rules: 0. Paths: 0.**
- **Loose rules: 133 hits, all non-credential:**
  - 122 integrity hashes;
  - 10 note ids;
  - 1 code expression.

## Limits, stated
- This is a regex and entropy sweep, not a verified-live scanner. A secret in a format no rule names, short and low-entropy, and
  not after a keyword, could be missed.
- **`UNKNOWN - verify`:** whether the hosting provider's own secret scanning ran or raised alerts. Reading that needs the remote;
  the owner sees it in the repository's Security tab.
