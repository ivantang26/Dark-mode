/**
 * Acceptance criterion 1: every text and syntax colour pair passes 4.5:1 on its surface.
 * Tokens come straight from app/globals.css and the Shiki theme. Runs before every build.
 *
 *   npm run check:contrast
 */
import { pairings, readTokens } from "../lib/tokens";
import { syntax } from "../lib/shiki-theme";
import { contrastRatio, formatRatio } from "../lib/contrast";

const tokens = readTokens();
if (tokens.bg !== syntax.background && tokens["surface-1"] !== syntax.background) {
  console.error(`Shiki theme background ${syntax.background} doesn't match --surface-1 ${tokens["surface-1"]}`);
  process.exit(1);
}

const rows = pairings().map((p) => ({ ...p, ratio: contrastRatio(p.fg, p.bg) }));
const failures = rows.filter((r) => !r.fg || !r.bg || r.ratio < r.min);

console.log(`Checked ${rows.length} pairings`);
for (const r of [...rows].sort((a, b) => a.ratio - b.ratio)) {
  const ok = r.ratio >= r.min;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${formatRatio(r.ratio).padStart(7)}  (min ${r.min})  ${r.fgName} on ${r.bgName}  ·  ${r.use}`);
}

if (failures.length) {
  console.error(`\n${failures.length} pairing(s) failed.`);
  process.exit(1);
}
console.log("All text and syntax pairings pass.");
