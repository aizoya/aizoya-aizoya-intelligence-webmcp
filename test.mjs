import assert from 'node:assert/strict';
import {
  opportunities,
  byId,
  scoreOpportunity,
  listOpportunities,
  compareOpportunities,
  buildActionPlan,
  getDeadlineConflicts,
  updateShortlist
} from './app.js';

assert.equal(opportunities.length, 6);
assert.equal(byId('OPP-001').type, 'Hackathon');
assert.equal(listOpportunities({type:'Training'}).length, 1);
assert.equal(listOpportunities({maxCostUsd:0}).length, 5);
assert.ok(scoreOpportunity(byId('OPP-001')) >= 0 && scoreOpportunity(byId('OPP-001')) <= 100);
assert.throws(() => scoreOpportunity(byId('OPP-001'), {fit:0,impact:0,urgency:0,lowEffort:0}));
const ranking = compareOpportunities(['OPP-001','OPP-002']);
assert.equal(ranking.length, 2);
assert.ok(ranking[0].demoScore >= ranking[1].demoScore);
assert.deepEqual(compareOpportunities(['OPP-001','NOPE']), {error:'Opportunity not found',missingIds:['NOPE']});
assert.deepEqual(compareOpportunities(['OPP-001','OPP-001']), {error:'Opportunity IDs must be unique'});
assert.throws(() => listOpportunities({maxCostUsd:-1}));
const plan = buildActionPlan('OPP-001');
assert.equal(plan.opportunityId, 'OPP-001');
assert.ok(plan.steps.length >= 3);
const conflictResult = getDeadlineConflicts(['OPP-001','OPP-006']);
assert.equal(conflictResult.conflicts.length, 1);
assert.deepEqual(buildActionPlan('NOPE'), {error:'Opportunity not found'});
const addResult = updateShortlist('OPP-003','add');
assert.equal(addResult.changed, true);
assert.ok(addResult.shortlist.includes('OPP-003'));
assert.equal(updateShortlist('OPP-003','add').changed, false);
assert.equal(updateShortlist('NOPE','add').error, 'Opportunity not found');
assert.equal(updateShortlist('OPP-003','invalid').error, 'Action must be add or remove');
assert.equal(updateShortlist('OPP-003','remove').changed, true);
console.log('All clean-room unit tests passed.');
