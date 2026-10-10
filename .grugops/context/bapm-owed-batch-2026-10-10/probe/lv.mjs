// Re-measure ruling 7's lookup premise on a frozen object with integer keys 1..5 (same shape as LEVELS at 8330651d).
const LEVELS = Object.freeze({ 1: { b: 100 }, 2: { b: 500 }, 3: { b: 3000 }, 4: { b: 4500 }, 5: { b: 4500 } });
for (const k of ["constructor", "__proto__", "toString", "3", 3, "03", 6, 0]) {
  const v = LEVELS[k];
  console.log(JSON.stringify(k), "->", v === undefined ? "undefined" : typeof v === "function" ? "function (prototype member)" : (Object.getPrototypeOf(LEVELS) === v ? "Object.prototype" : JSON.stringify(v)), "| hasOwn:", Object.hasOwn(LEVELS, k));
}
