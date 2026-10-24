---
id: 20261024T110648Z-security-nfr-observation-fa83895b
kind: observation
by: security-nfr
at: 2026-10-24T11:06:48Z
verified_by: 
confidence: high (counts read on 55a8f4ef and its history on 2026-10-23; classes only; fork/clone facts UNKNOWN - verify)
refs:
  - security-nfr-public-repo-redacted
  - SEC-PUB-1
  - SEC-PUB-2
  - SEC-PUB-3
  - SEC-PUB-4
  - SEC-PUB-5
  - SEC-177-1
  - FIX-177-1
  - 55abd2c3
  - ASVS-V16.2.5
  - 20261024T091000Z-orchestrator-decision-776bba9a
  - 20261023T212123Z-security-nfr-observation-0f1e173a
  - 20261021T072219Z-security-nfr-observation-34fec102
supersedes: 
seal: sha256:428248d49f80fb7c5b107eeb5684a6ce485cf05249df0d5214d4ba5b6882fcfc
---

# Personal data in the public repo, redacted: SEC-PUB-1 MEDIUM (accepted by the owner on "no creds"), SEC-PUB-2/3/4 LOW, SEC-PUB-5 INFO

**Why this note exists.** This note re-publishes the personal-data part of the 2026-10-23 public-repo review. That review is on
the held branch `grugops/security-nfr-public-repo` @ `5fd5ee65`. It is local only and will never be merged, because it restated
the exposed details. Here each exposure is described **by class and count only**. No hostname, domain, IP address, realm,
cluster or context, namespace, service or secret name, or personal path is written.

Counts were read on the public tip `55a8f4ef` and over its full history (3,056 commits). The credential evidence is in the scan
note of this task. **No remedy was applied.** A history rewrite needs a force push, which agents may not do.

## SEC-PUB-1: private-homelab process captures are public in history. MEDIUM. ACCEPTED by the owner, Olger Oeselg, on condition "no creds"

**What.** Between ABC-095 and ABC-177, QE and Security timing hops committed process-table captures. These are the argv of other
sessions on the owner's machine. The `SEC-177-1` redaction (`55abd2c3`, 2026-10-21, 66 files) cleaned **the tip only**.
The pre-redaction blobs are still reachable from `55a8f4ef`. **108 public history blobs** carry captures from a different,
private project. By class, they hold:
- that project's repository path and layout: 1 path, plus script names and test names;
- **1 internet-facing hostname**, an identity-provider discovery URL that names **1 realm**;
- 1 identity-provider admin CLI login line against an in-cluster service and the admin realm. It uses shell variables, not values;
- **1 private LAN address with an API port**;
- 1 cluster context name, **3 namespace names** and 1 label key;
- **5 in-cluster service names** (proxy, tunnel metrics, telemetry and storage);
- **2 secret names** (Kubernetes secret object names, not values);
- 1 signed object-store request line whose access key and secret are shell variables.

**Not exposed: no credential value.** Every secret-shaped token in those blobs is a `$VARIABLE`, a secret *name*, a fixture on a
reserved example domain, or one of QE's 2 planted canaries. The sweep in this task's scan note found 0 credential values across
the whole public history, and that note re-confirms it with 8 more strict rules (kubeconfig, base64 key, unquoted env/CLI secret shapes). At the tip, the hostname, the address and the in-cluster
names occur in 0 files. Only the private project's folder name remains, in 105 files (instrument filter lists and prose).

**Severity: MEDIUM.** The default comes from ASVS V16.2.5 "do not log sensitive data" (L2 → medium), which is outside the active
L1 set. The exposure is reconnaissance on a different, private, partly internet-facing system: an identity-provider host and
realm, and the cluster's service map. It is not a credential leak. `…34fec102` named "pushed anywhere" as the trigger, and the
push happened before a decision was on record.

**Disposition: ACCEPTED** by the owner, Olger Oeselg, 2026-10-24. He said verbatim *"ok, if no creds"*, in note
`20261024T091000Z-orchestrator-decision-776bba9a`. The condition is met: see this task's scan note and decision note.
- No history rewrite and no force push.
- **Owner-side suggestion, not a gate:** confirm that the identity provider's admin console is not reachable from the internet.
- Rotate the bootstrap admin secret only if he has any doubt. No value leaked.

## SEC-PUB-2: the owner's email in commit metadata. LOW. Owner: Olger Oeselg

The owner's personal email address is the author and committer address on all 3,056 public commits. It also appears in 1 blob,
a pasted `git log`. It is his own address, published by his own push.
- **Remedy (forward):** use the hosting provider's noreply address and turn on its email-privacy setting.
- Rewriting history is disproportionate for LOW.

## SEC-PUB-3: absolute local paths. LOW. Owner: QE/E2E (forward fix)

An absolute home-directory path containing the owner's macOS username appears in **419 files at the tip** and 5,617 times across
history. These paths reveal the folder layout and the names of **3 other local projects**, plus tool session and cache paths and
OS temp paths. They contain no secret.
- **Remedy (forward):** instruments and notes write repo-relative or `$HOME`-relative paths.
- Nothing retroactive is warranted.

## SEC-PUB-4: host fingerprint and activity pattern. LOW. Owner: QE/E2E (optional)

The following are public:
- **2 machine hostnames** (a local mDNS name and a LAN name);
- 1 hardware model identifier;
- OS, kernel and Node versions in QE notes;
- the commit time-zone offsets: 2 values, both from one region;
- commit timestamps, which show working hours.

**Remedy:** none needed. Optionally drop the `host` field from instruments.

## SEC-PUB-5: other people's data. INFO, no action

The only third-party names are public attributions:
- the evaluation-table author and the wiki editors credited in the licence notes;
- 1 maintainer email inside a bundled open-source licence text in the lockfile;
- reserved example-domain fixtures.

No other person's private data was found.
