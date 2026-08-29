# Tonight — Human Steps Only

Do these in order. Stop if any public-release/security check fails.

1. On Devpost, tap **Start project** and create the project shell with the name `AIZOYA Intelligence`.
2. Create a **brand-new public GitHub repository** named `aizoya-webmcp-lab` (or the closest available name). Do not fork, import, mirror, or copy the private `aizoya/AIZOYA` repository.
3. Upload only the contents of the approved clean-room package.
4. Confirm `LICENSE` is visible at the repository root and GitHub detects the open-source license.
5. Confirm the repository visibly contains `document.modelContext.registerTool(...)` in the WebMCP implementation.
6. Deploy the static app to an isolated public host (Cloudflare Pages, Netlify, Vercel, ChatGPT Sites, or equivalent).
7. Open the live URL in ChatGPT's in-app browser or Chrome with WebMCP testing enabled.
8. Validate all six WebMCP tools and verify `update_shortlist` changes the visible shared state.
9. Re-run the clean-room/security checks against the exact public repository contents.
10. Record the public YouTube demo under 3 minutes with audio using `DEMO_SCRIPT_UNDER_3_MIN.md`.
11. Complete Devpost using `DEVPOST_SUBMISSION_DRAFT.md`, the live URL, public repository URL, and YouTube URL.
12. Run the final founder public-release/submission gate before pressing the final Submit button.
13. After submission closes, freeze the submitted repository/site/entry during judging unless the organizer explicitly permits changes.
