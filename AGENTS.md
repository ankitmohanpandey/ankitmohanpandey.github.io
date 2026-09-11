<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Verification

Run `npm run lint`, `npm run type-check`, `npm run build`, then `npm run check:budget`.
Run `./node_modules/.bin/tsx scripts/substack.test.ts` for Substack parser regression tests; fixtures do not publish to external platforms.
Stop any production server before rebuilding its `.next` output. A successful HTTP response alone does not verify browser hydration.
