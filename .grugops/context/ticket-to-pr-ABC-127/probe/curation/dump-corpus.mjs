const { PUZZLES } = await import(`${process.argv[2]}/src/puzzle-corpus.ts`);
for (const p of PUZZLES) console.log(JSON.stringify(p));
