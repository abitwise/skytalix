---
id: 20260815T215000Z-agents-md-scribe-observation-a1-still-green-and-why-a1-was-blind-534e3f97
kind: observation
by: agents-md-scribe
at: 2026-08-15T21:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q13
  - S6
  - A1
  - AGENTS.md
  - src/cli.test.ts
supersedes: 
---

# `A1` is still green after my edit — and the exact reason it was blind to `Q13`

## I did not assume a markdown edit is inert

`AGENTS.md` has **exactly one automated reader in this repository**: `src/cli.test.ts:193-204`, the
`A1` row. I found it by grepping the whole tree for reads of the file (`readFileSync`, `import`,
`require`, `resolve`) — one hit, and no other test reads any repository markdown. So a prose edit to
`AGENTS.md` *can* red the suite, and I checked rather than assumed.

**Ran, in a worktree where I performed a real `npm install` first:**

```
npx vitest run src/cli.test.ts
```

**29 passed (29), 977 ms.** `A1` among them. All three of its assertions hold against my edited file:

| assertion | result |
|---|---|
| `expect(agents).toContain("- Dev / run: \`npm run chess\`")` | **PASS** — § Commands untouched |
| `expect(agents).not.toContain("- Dev / run: \`UNKNOWN - verify\`")` | **PASS** — my replacement never uses the list-item spelling |
| `expect(packaged.scripts.chess).toBe("node src/cli.ts")` | **PASS** — `package.json` untouched |

The literal string `UNKNOWN - verify` still appears **8 times** in `AGENTS.md` — the four genuinely
unknown command slots plus the surrounding guidance. That is correct and unchanged; `A1` bars one
specific list item, not the phrase.

## `S6` — why `A1` could not have caught `Q13`, stated precisely

The re-gate called `A1` *"structurally blind"* to `Q13`. It is worth being exact about the mechanism,
because the loose reading — *"the assertion is in a different section"* — suggests a fix that would
not work.

**`A1`'s negative assertion is a literal substring test for one spelling:**
`- Dev / run: \`UNKNOWN - verify\`` — the **list-item form**, leading hyphen and colon included.

The contradicting sentence in § Deployment posture said the same thing in **prose**, and split across
a line break:

```
… which is why `Dev / run` above is
`UNKNOWN - verify` and stays that way.
```

That text contains neither `- Dev / run: ` nor the two tokens adjacently. **So `A1` was green the
whole time the file was contradicting itself**, and it would be green again tomorrow if any hop wrote
the same false claim in prose anywhere in the file. The blindness is not distance; it is that the
guard pins **one rendering of the claim** while the claim itself can be written a dozen ways.

| # | gap | severity | owner |
|---|---|---|---|
| **`S6`** | **`A1`'s negative guard pins a spelling, not a fact.** It bars the list-item form of `Dev / run: UNKNOWN - verify` and cannot see the same assertion written as prose — which is exactly how `Q13` survived a green gate. A cheap strengthening exists (assert that `AGENTS.md` contains no occurrence of `UNKNOWN - verify` **within the § Deployment posture block**, or that the file never says "no CLI entry point"), and it is one criterion clause plus a few lines of test | **LOW** | **BA/PM** for the clause, then **Software Engineer** for the assertion. **Not mine**: `A1` is a `ABC-042` acceptance criterion, this subtask is `AGENTS.md`-only and explicitly bars touching criteria or code, and I will not re-word another role's criterion. **Recorded, not taken** |

I am not claiming `S6` should be fixed on this ticket. The contradiction it let through is now gone;
`S6` is about the next one.
