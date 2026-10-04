<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting published git history.
<!-- LOVABLE:END -->

- Keep backend access behind `src/lib/api.ts` so endpoint configuration and response normalization remain centralized.
- Treat missing or suspect telemetry as an explicit data-quality state; never synthesize operational readings.
- Keep route-level filters and tabs in TanStack Router search parameters so operational views are shareable.
