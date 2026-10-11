// design-ABC-152 D2(b) isolation probe: module-level state. A fresh module registry reads 0 here.
export let count = 0;
export function bump() {
  count += 1;
  return count;
}
