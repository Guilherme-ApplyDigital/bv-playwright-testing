# Regression Analysis Report - 2026-02-24

## Scope
- Full regression run in dev:
  - Command: `BV_ENV=dev npx playwright test --reporter=line`
  - Result: `183 passed`, `2 failed`, `2 skipped`
- MCP validation executed on failing routes and key suspect links.

## Failed Tests

1. `tests/bv-dev-bug-hunt.spec.ts`
   - Test: `Bug hunt - /locations`
   - Failure: main navigation returned `404` for `https://develop--bv-ad.netlify.app/locations`

2. `tests/highest-traffic.spec.ts`
   - Test: `Locations hub route integrity - /locations`
   - Failure: expected successful main navigation, received `404`

## Classification (Bug vs Script)

### Confirmed system bug
- Route: `https://develop--bv-ad.netlify.app/locations`
- Status: `404`
- Evidence from regression logs:
  - `Main navigation returned 404 on https://develop--bv-ad.netlify.app/locations`
  - Same-origin HTTP errors include:
    - `404 https://develop--bv-ad.netlify.app/locations`
    - `404 https://develop--bv-ad.netlify.app/_next/data/.../en/locations.json`
- Evidence from MCP:
  - Route renders "Page not found / Error 404." content.

### Not a script bug
- Both failures are consistent with product behavior on `/locations`.
- The two failing tests are independently validating the same known defect:
  - one in strict bug-hunt mode,
  - one in highest-traffic integrity mode.
- This is expected if the goal is to keep bug visibility active.

## MCP Cross-check on related suspect routes

Validated via MCP GET/Navigate:
- `https://develop--bv-ad.netlify.app/en-US/where-we-work/americas` -> `200` (healthy)
- `https://develop--bv-ad.netlify.app/news` -> `200` (healthy at test time)
- `https://develop--bv-ad.netlify.app/newsroom` -> `200` (healthy at test time)
- `https://develop--bv-ad.netlify.app/suppliers` -> `200` (healthy)

## Additional observations

- Third-party exceptions/noise still appear in console (ads/gtm/iframe ecosystem), but they are not same-origin product crashes.
- `Locations Europe` and `Locations MEA` scenarios retried during run but passed; no persistent same-origin 4xx/5xx evidence for those paths.

## Recommendation (aligned with bug-hunting goal)

1. Keep `/locations` as a blocking failure in dev to preserve defect visibility.
2. Keep `bv-dev-bug-hunt.spec.ts` as strict "bug discovery" suite for same-origin 4xx/5xx and soft error pages.
3. If desired, avoid duplicate signal by choosing one primary blocking check for `/locations` (bug-hunt or highest-traffic), and keep the other as informative.

