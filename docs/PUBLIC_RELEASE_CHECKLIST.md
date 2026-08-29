# Public Release Checklist

## Gate 1 — Source isolation
- [ ] No file copied from a private AIZOYA repository.
- [ ] No fork relationship or private Git history.

## Gate 2 — Secret scan
- [ ] No `.env` or credential file.
- [ ] No API key, token, password, private endpoint, service-role secret, or account identifier.

## Gate 3 — IP/confidentiality scan
- [ ] No AIZOYA OS internals.
- [ ] No proprietary prompts, council logic, private scoring/matching logic, or internal roadmaps.
- [ ] No FlowAlume or PlateReach proprietary implementation.

## Gate 4 — Data review
- [ ] Synthetic or public demo data only.
- [ ] No customer, lead, financial, account, or private business data.

## Gate 5 — Founder approval
- [ ] Founder explicitly approves public repository visibility and deployment.

Any failed gate = HOLD.
