# Devpost Submission Draft

## Project name
AIZOYA Intelligence

## One-line description
A WebMCP-powered shared workspace where people and AI agents evaluate time-sensitive opportunities together.

## Project description
AIZOYA Intelligence helps founders, students, builders, and small teams make better decisions across fragmented opportunities such as hackathons, grants, accelerators, training programs, and events.

The human uses a normal web interface to browse opportunities, inspect details, adjust priorities, and maintain a shortlist. At the same time, an AI agent can use WebMCP tools exposed directly by the page to search, compare, inspect requirements, build action plans, update the same shortlist, and identify deadline conflicts.

### Why this is a strong fit for WebMCP
Without WebMCP, an agent would need to infer page structure, click through controls, or scrape text from the DOM. AIZOYA Intelligence exposes the important actions as explicit structured tools with defined input schemas and predictable outputs. This gives the agent a reliable way to act on the same application state the human sees.

### How it creates a better user experience
The user does not need to copy information between browser tabs, spreadsheets, notes, and an AI chat. The agent can work directly with the application and return structured results while the human remains in control of prioritization and final decisions. Shared shortlist state makes the collaboration visible: when the agent adds or removes an opportunity, the human interface updates too.

### What people and agents can do together
A person can review an opportunity visually while an agent simultaneously filters the full opportunity set, compares several choices using the user's stated priorities, builds a deadline-aware action plan, detects scheduling conflicts, and updates the shared shortlist. The human can then review or reverse those changes from the same page.

### How WebMCP was implemented
The app uses the imperative WebMCP API through `document.modelContext.registerTool(...)`. It registers six tools:

- `list_opportunities`
- `get_opportunity`
- `compare_opportunities`
- `build_action_plan`
- `update_shortlist`
- `get_deadline_conflicts`

Each tool has an explicit input schema and returns structured JavaScript data. The demo is intentionally dependency-light and uses synthetic opportunity data so judges can test all interactions without authentication or private information.

## Open-source / clean-room statement
This competition repository is a purpose-built clean-room demonstration. It contains synthetic data and newly written challenge code only. It does not contain private AIZOYA source code, proprietary prompts, production datasets, credentials, or private service integrations.
