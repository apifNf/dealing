@AGENTS.md

# DEALING project conventions

## Signature background (mandatory)

Every page, layout, or route on this platform MUST be wrapped in
`<PageBackground>` from `components/shared/PageBackground.tsx`. It renders
the platform's signature dark immersive gradient — three drifting glow blobs
plus an overlay — and is already used by `/`, `/onboarding`, and
`/admin/dashboard`.

Never hand-roll the glow markup inline and never leave a new page on a plain
background. If a page needs layout tweaks on the `<main>` element (e.g.
`flex flex-col items-center`), pass them via the `mainClassName` prop —
do not touch the glow layer itself.

```tsx
import { PageBackground } from "@/components/shared/PageBackground";

export default function SomeNewPage() {
  return (
    <PageBackground>
      {/* page content */}
    </PageBackground>
  );
}
```
