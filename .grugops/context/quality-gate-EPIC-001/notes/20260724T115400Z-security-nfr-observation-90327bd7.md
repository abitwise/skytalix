---
id: 20260724T115400Z-security-nfr-observation-90327bd7
kind: observation
by: security-nfr
at: 2026-07-24T11:54:00Z
verified_by: 
confidence: high
refs:
  - EPIC-001
  - ABC-004
  - ABC-005
  - ABC-006
  - ABC-007
  - NFR-001
  - src/fen.ts
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/perft.ts
  - src/perft-bench.ts
  - src/gameend.ts
  - src/zobrist.ts
  - src/position.ts
  - plans/nfr-catalog.md
supersedes: 
---

# Security/NFR static review — EPIC-001 rules core (ABC-004..ABC-007)

**RESULT: PASS_WITH_RISKS.** ASVS filter: **L1** (`security.asvs_level = L1`, cumulative — kept every
requirement where `L <= L1`; the 253 L2 and 345 L3 rows are out of scope by the dial and are not
asserted here). `security.block_on = high`; `compliance_regime = []` (no Compliance Officer handoff).
Static review only (reading + `git diff main..grugops/ticket-to-pr-ABC-007`); the install/lint/
typecheck/unit/build/e2e gate is the QE agent's lane and was not run here.

## 1. Trigger determination — NOT triggered

No risk-bearing surface is touched by this change. The role's triggers (auth, secrets, payments,
personal data/GDPR, public API, file upload, admin action, DB migration, queue/event, external
integration) are all absent — this is a pure in-memory chess rules library.

The **one** untrusted-input surface in the whole project is FEN string parsing (`src/fen.ts`), and it
is **not modified by this stack**: `git diff --name-only main..grugops/ticket-to-pr-ABC-007 -- src/*.ts`
lists apply, gameend, legal, moves, perft, perft-bench, zobrist (+ tests) only — `src/fen.ts` and
`src/position.ts` are unchanged (inherited from ABC-001, on main). Every module under review consumes
already-validated in-memory `Position` objects, not external strings.

FEN input-validation assessment (surface itself, for completeness): `parseFen` is
positive/allowlist validation that throws a typed `FenError` naming the specific fault and **never
returns a partial position** — 6 fields required; exactly 8 ranks; per-rank square count must equal 8
(over-run rejected: piece write guarded by `if (file > 7) throw`, digit runs only increment `file` and
are caught by the trailing `file !== 8` check, so no out-of-bounds `Uint8Array` write is reachable);
exactly one king per side (`assertBothKingsPresent`); side ∈ {w,b}; castling chars against a 4-entry
allowlist; ep square must parse or be "-"; clocks matched by `^\d+$` with min 0 / min 1. Malformed FEN
therefore causes a clean typed rejection, not unsafe behaviour. The performance-sensitive flow
(move-gen throughput, NFR-001) is the only genuinely in-scope concern and is handled in §3.

## 2. L1 checklist walk (evidence-cited; no unbacked ticks)

The overwhelming majority of ASVS L1 rows are **N/A** because the library has no web frontend, HTTP
responses, cookies, auth, sessions, tokens, authorization, OAuth, TLS/network, filesystem, DB, or
cryptographic-security surface. Applicable rows:

- **V1.2.5 (OS command injection) — PASS.** No OS calls. `grep -nE "child_process|exec|Function\("`
  across changed source returns nothing; `perft-bench.ts` touches only `process.version/platform/arch/
  hrtime` (read-only telemetry for its printed report) and `console.log`.
- **V1.3.2 (no eval / dynamic code execution) — PASS.** No `eval`/`new Function`/SpEL-equivalent.
  Generation is static offset tables (`DIAGONALS`, `KNIGHT_LEAPS`, `RAYS`, `STEPS`) and arithmetic.
- **V2.1.1 / V2.2.1 / V2.2.2 (input validation, positive/allowlist, at a trusted layer) — PASS
  (on the FEN surface, unchanged here).** The library IS the trusted layer; validation is in-code with
  no client-side reliance. Grammar enforced + tested (`src/fen.test.ts`). Changed modules take
  in-memory positions, not untrusted input, so no new validation boundary is introduced.
- **V11.4.1 (approved hash functions / no MD5 for cryptographic use) — N/A.** `src/zobrist.ts` uses
  a fixed-seed splitmix64 to fill a position-identity hash table (repetition + future transposition).
  This is an explicitly **non-cryptographic** hash — reproducibility, not secrecy, is the property, and
  no security decision depends on it (the module comment states the fixed seed is deliberate). V11.4.1
  governs cryptographic use (signatures, HMAC, KDF, RNG); none is present. No disallowed hash (MD5) is
  used for any cryptographic purpose.
- **V15.3.1 (return only the required field subset) — N/A / PASS.** Return values (`Move[]`,
  `GameStatus`, node counts) cross an in-process call boundary, not a user/tenant trust boundary; no
  over-exposed data object.
- **V15.1.1 / V15.2.1 (3rd-party remediation timeframes / only in-timeframe components) —
  `UNKNOWN - verify`.** Org remediation-policy documentation and an SCA/`npm audit` scan are outside
  static scope (SCA is the QE gate's install lane, running in parallel). Concrete mitigating fact I can
  cite: this stack adds **no new dependencies** — `package.json` diff is a single added `perft` script;
  the project has zero runtime dependencies (pure TypeScript). Supply-chain exposure is unchanged.

**No L1 requirement fails.** Therefore no high-severity security finding; nothing crosses
`block_on = high`.

## 3. NFR check — NFR-001 target MET; catalog gap is real

- **Verdict: NFR-001 (move-generation throughput) is MET.** Target **≥ 1,000,000 nodes/sec** (stated in
  the ABC-006 ticket). Measured **~6.2M nodes/sec** classic perft, recorded by the engineer and QE in
  `.grugops/context/ticket-to-pr-ABC-006/notes/` — ~6x over target. Honestly framed: the harness prints
  the caveat that classic-perft nps is inflated by free leaves (cross-ref ABC-008), so the figure is not
  oversold, and it clears the bar even inflated. No RISK-002 throughput escalation warranted at this
  stage. Hot-path discipline is visibly maintained (make/unmake in-place mutation, `flags === FLAG_NONE`
  fast path in `apply.ts`, precomputed offset tables in `moves.ts`) per the tickets' NFR-001 note.

- **GAP (claim, confidence `UNKNOWN - verify` on ownership; observation on the fact): NFR-001 is
  referenced everywhere but never defined in `plans/nfr-catalog.md`.** The catalog is still the empty
  shipped template — header + separator, **zero data rows** (`plans/nfr-catalog.md` lines 24-25). Yet
  NFR-001 is cited on every EPIC-001 row of `plans/traceability.md` and its measurable target lives only
  in the ABC-006 ticket body. `plans/traceability.md` line 63 itself says "Architect/Design seeds the
  matching rows in plans/nfr-catalog.md at design time" — that seeding has not happened. This is a real
  traceability/governance gap, not a security fail: the target exists and is met, but the single source
  of truth for the NFR budget is empty, so a future reviewer cannot check a touched flow against a
  catalog row. **It does not block this change.**

## 4. Findings and accepted risks

- No security finding (no L1 fail; trigger not touched). Deliberately **no `kind: finding`** recorded —
  a finding needs a real §14-gate/human stamp this role cannot self-produce.
- **Accepted risk (low, process/traceability): `plans/nfr-catalog.md` is empty — NFR-001 undefined in
  the catalog.** Owner: **Architect/Design** (per the file's own ownership note and traceability.md
  line 63). Recommended remediation: seed the NFR-001 row, e.g.
  `| NFR-001 | Performance | move-gen throughput ≥ 1,000,000 nodes/sec | legal move generator (search hot path) | perft-bench nodes/sec (ABC-006) |`.
  Suggested as a fast-follow catalog-seeding task; not a merge blocker for ABC-004..007.

## Scope reviewed
`git diff main..grugops/ticket-to-pr-ABC-007` + static read of src/moves.ts, apply.ts, legal.ts,
perft.ts, perft-bench.ts, gameend.ts, zobrist.ts, position.ts, fen.ts. Did not run install/tests
(QE lane, parallel). NFR-001 measurement taken from ABC-006 published notes, cross-checked against the
ABC-006 ticket target and the empty nfr-catalog.
