node -e 'for (const f of process.argv.slice(1)) { const t = require("fs").readFileSync(f, "utf8").replace(/\n\s*\* ?/g, " ");
  for (const s of t.match(/[^.]*nfr-catalog\.md[^.]*\./g) ?? []) if (/\b(once|twice|thrice|three|four|five|six) times\b|\b(twice|thrice)\b/i.test(s)) console.log(f + ": " + s.trim()); }' src/*.ts
