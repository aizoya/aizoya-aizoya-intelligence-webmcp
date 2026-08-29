# Demo Script — target 2:20–2:40

## 0:00–0:20 — Problem
"Founders and small teams discover opportunities everywhere: hackathons, grants, training, accelerators, and events. The hard part is deciding what actually deserves attention before the deadline. This is AIZOYA Intelligence, a shared workspace for people and AI agents."

Show the opportunity list and shortlist.

## 0:20–0:45 — Human experience
"A person can browse opportunities normally, inspect requirements, and maintain a shortlist. The application remains fully usable as a standard website."

Open an opportunity and add it to the shortlist.

## 0:45–1:35 — WebMCP agent experience
"With WebMCP enabled, the page exposes structured tools directly to the agent instead of forcing it to scrape the DOM or guess where to click."

Demonstrate:
1. `list_opportunities` — filter the demo opportunity set.
2. `compare_opportunities` — compare two or three opportunities using stated priorities.
3. `get_deadline_conflicts` — show a conflict between close deadlines.

## 1:35–2:05 — Shared state
"The agent can also collaborate with the human on the same live application state."

Use `update_shortlist` through the agent. Show the shortlist changing in the visible UI.

Then call `build_action_plan` for one shortlisted opportunity.

## 2:05–2:30 — Implementation
"The application registers six structured tools with the WebMCP imperative API using `document.modelContext.registerTool`. Each tool has an explicit schema and structured output. The demo uses only synthetic data and a clean-room open-source implementation."

Briefly show the `registerTool` code in the public repository.

## 2:30–2:40 — Close
"AIZOYA Intelligence demonstrates a web where people keep judgment and control while agents can reliably search, compare, plan, and act inside the same application."
