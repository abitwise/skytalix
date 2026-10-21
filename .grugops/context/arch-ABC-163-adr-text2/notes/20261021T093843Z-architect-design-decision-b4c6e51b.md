---
id: 20261021T093843Z-architect-design-decision-b4c6e51b
kind: decision
by: architect-design
at: 2026-10-21T09:38:43Z
verified_by: 
confidence: high (ADR text diffed at 569a384c against Security/NFR …3e4b4a08 § 2, § 3, § 5)
refs:
  - ABC-163
  - ADR-0036
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-095-L1UNIT
  - AR-095-CWD
  - G-1
  - G-2
  - grugops/arch-ABC-163-adr-text
  - 569a384c
  - 3b30196e
  - e7385671
  - f459353e
  - 20261021T093522Z-security-nfr-decision-3e4b4a08
  - 20261021T093522Z-security-nfr-observation-3b895278
  - 20261021T091931Z-architect-design-decision-a7d9c818
  - 20261021T093350Z-architect-design-decision-3951361a
  - .grugops/queue/claimed/arch-ABC-163-adr-text2/arch-ABC-163-adr-text2.md
  - security-nfr-ABC-163
supersedes: 
seal: sha256:381cacb376e3ec3a1906adf8154b107178ca759ae8f0eec1fa3b3997ac36fe51
---

# Decision: the `ADR-0036` § S1 deletion-only text now names `AR-163-DELONLY` and `AR-163-UNCOMMENT`, and the retirement line carries its limit, at `569a384c`

This aligns the text with Security/NFR `…3e4b4a08` § 5. That ruling was read against `…a7d9c818`, not against
`e7385671`.
- **(b) was already met** at `e7385671`. The `AR-095-CWD` clause was dropped there, because the risk closed at
  `f459353e`. Nothing more is owed.
- **(a) is applied in three places**, all under `#### Ruling 2 folded — 2026-10-21 (ABC-163)`.
  - **"When the case becomes live"** now quotes `AR-163-DELONLY`'s trigger in full: a limb-1 holder gains a guard,
    with or without a parameter; a parameter or caller-supplied value reaches the read; a read spans more than one
    line; or a second limb-1 holder appears.
  - That bullet also says what is owed before that ticket merges: Ruling 2 widens to any changed line, `+` or `−`,
    and the instrument drops its `!lines.size` skip. Until then the Orchestrator runs the by-hand `--name-only` check.
  - **The G-2 bullet** is now `AR-163-UNCOMMENT` (LOW, owner Architect/Design). It is still marked pre-existing,
    and it adds the trigger: a production block comment holding limb code that would compile without its delimiters.
    "QE's `G-2`" is kept in the parenthesis so the id still traces to QE's gap.
  - **"Security/NFR rules the risk."** now reads: Security/NFR accepted the risk as `AR-163-DELONLY`: LOW, latent;
    owner the Orchestrator, fix by Architect/Design.
- **(c) is applied.** The bold retirement line now ends: "…once this commit is on `main`, until `AR-163-DELONLY`'s
  trigger fires without its fix."

**Diff:** `ADR-0036` only, +13/−7. No other text changed. Untouched: `clause-b.mjs`, `src/`, `AGENTS.md`, `plans/`.
**NFR impact:** none. **Board move:** none.
