# AIZOYA Intelligence

Clean-room WebMCP challenge prototype. Intentionally isolated from all private AIZOYA repositories and production systems.

## Purpose
Demonstrate a human + agent shared workspace for evaluating time-sensitive opportunities using WebMCP tools.

## IP boundary
- Synthetic demo data only.
- No private AIZOYA source code, prompts, datasets, credentials, proprietary algorithms, or production APIs.
- No Git ancestry from private repositories.
- The scoring model in this repository is challenge-only and intentionally transparent.

## WebMCP tools
- `list_opportunities`
- `get_opportunity`
- `compare_opportunities`
- `build_action_plan`
- `update_shortlist`
- `get_deadline_conflicts`

The app uses the imperative WebMCP API: `document.modelContext.registerTool(...)`. Tool results are plain structured JavaScript objects, which the WebMCP user agent serializes for the calling agent.

## Run locally
Serve this folder with any static web server. Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

The app remains fully usable by a human when WebMCP is unavailable.

The shared shortlist persists in the current browser using `localStorage`. No shortlist data is sent to a server, and **Reset demo** restores the deterministic starting state.

## Test

```bash
node test.mjs
bash scripts_verify_clean_room.sh
```

## Public-release rule
Run `docs/PUBLIC_RELEASE_CHECKLIST.md` before changing repository visibility or deploying publicly. Any failed gate = HOLD.
