// Builds data/demo-results.json from the Prompt lab log in data/prompt-lab-log.json.
// Run it with:  npm run demo-data
//
// For each product and element it keeps the NEWEST run, drops the scores (they're for you, not the site)
// and keeps the reply in the same shape the AI returns: { options, left_out }.

import { readFileSync, writeFileSync } from "node:fs";

const LOG = "data/prompt-lab-log.json";
const OUT = "data/demo-results.json";

// Element names in the Prompt lab → ids used in the app (lib/elements.ts).
const ELEMENT_IDS = {
  "Body text": "body",
  Button: "button",
  "Empty state": "empty",
  "Error message": "error",
  Headline: "headline",
  "Helper text": "helper",
  "Success message": "success",
  Toast: "toast",
  Tooltip: "tooltip",
};

const log = JSON.parse(readFileSync(LOG, "utf8"));
const newest = new Map();

for (const run of log.runs) {
  const element = ELEMENT_IDS[run.element];
  if (!element) {
    console.warn(`Skipped a run with an unknown element: "${run.element}"`);
    continue;
  }
  const key = `${run.product.toLowerCase()}/${element}`;
  const kept = newest.get(key);
  if (!kept || run.at > kept.at) newest.set(key, { ...run, element });
}

const results = [...newest.values()]
  .sort((a, b) => a.product.localeCompare(b.product) || a.element.localeCompare(b.element))
  .map((run) => ({
    product: run.product.toLowerCase(),
    element: run.element,
    case: run.case,
    version: run.version,
    at: run.at,
    inputs: run.inputs,
    reply: {
      options: run.options.map(({ approach, recommended, why, parts }) => ({ approach, recommended, why, parts })),
      left_out: run.left_out ?? [],
    },
  }));

const about =
  "Saved Claude results from the Prompt lab, shown on the demo site. Built from prompt-lab-log.json by " +
  "scripts/build-demo-results.mjs (newest run per product and element). Each `reply` has the same shape as " +
  "the AI's reply, so live AI can replace this file later.";

writeFileSync(OUT, JSON.stringify({ about, results }, null, 2) + "\n");
console.log(`Wrote ${results.length} results to ${OUT}:`);
for (const r of results) console.log(`  ${r.product} / ${r.element}  (${r.at})`);
