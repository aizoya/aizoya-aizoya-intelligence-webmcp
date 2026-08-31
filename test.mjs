import assert from 'node:assert/strict';
import {
  opportunities,
  byId,
  scoreOpportunity,
  listOpportunities,
  compareOpportunities,
  buildActionPlan,
  getDeadlineConflicts,
  updateShortlist,
  restoreShortlist,
  resetDemo,
  registerTools
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

const storageValues = new Map();
globalThis.localStorage = {
  getItem:key => storageValues.get(key) ?? null,
  setItem:(key,value) => storageValues.set(key,value),
  removeItem:key => storageValues.delete(key)
};
updateShortlist('OPP-003','add');
assert.match([...storageValues.values()][0], /OPP-003/);
resetDemo();
assert.equal(storageValues.size, 0);
storageValues.set('aizoya-webmcp-demo-shortlist-v1', JSON.stringify(['OPP-002','NOPE','OPP-002']));
assert.deepEqual(restoreShortlist(), ['OPP-002']);
storageValues.set('aizoya-webmcp-demo-shortlist-v1', '{invalid json');
assert.deepEqual(restoreShortlist(), ['OPP-001','OPP-004']);
delete globalThis.localStorage;

const registeredTools = [];
globalThis.document = {
  modelContext:{registerTool:async tool => registeredTools.push(tool)}
};
assert.equal(await registerTools(), true);
delete globalThis.document;
assert.equal(registeredTools.length, 6);
assert.deepEqual(registeredTools.map(tool => tool.name), [
  'list_opportunities',
  'get_opportunity',
  'compare_opportunities',
  'build_action_plan',
  'update_shortlist',
  'get_deadline_conflicts'
]);
assert.equal(registeredTools.filter(tool => tool.annotations.readOnlyHint).length, 5);
for (const tool of registeredTools) {
  assert.equal(tool.inputSchema.type, 'object');
  assert.equal(tool.inputSchema.additionalProperties, false);
  assert.equal(typeof tool.execute, 'function');
}
const updateTool = registeredTools.find(tool => tool.name === 'update_shortlist');
assert.equal(updateTool.annotations.readOnlyHint, false);
assert.deepEqual(updateTool.inputSchema.required, ['id','action']);
assert.deepEqual(updateTool.inputSchema.properties.action.enum, ['add','remove']);
const listTool = registeredTools.find(tool => tool.name === 'list_opportunities');
assert.equal((await listTool.execute({type:'Grant'})).opportunities[0].id, 'OPP-003');
const getTool = registeredTools.find(tool => tool.name === 'get_opportunity');
assert.equal((await getTool.execute({id:'OPP-001'})).id, 'OPP-001');
const compareTool = registeredTools.find(tool => tool.name === 'compare_opportunities');
assert.equal((await compareTool.execute({ids:['OPP-001','OPP-004']})).ranking.length, 2);
const planTool = registeredTools.find(tool => tool.name === 'build_action_plan');
assert.equal((await planTool.execute({id:'OPP-003'})).opportunityId, 'OPP-003');
const conflictsTool = registeredTools.find(tool => tool.name === 'get_deadline_conflicts');
assert.ok(Array.isArray((await conflictsTool.execute({ids:['OPP-001','OPP-006']})).conflicts));
assert.equal((await updateTool.execute({id:'OPP-003',action:'add'})).changed, true);
assert.equal((await updateTool.execute({id:'NOPE',action:'add'})).error, 'Opportunity not found');
console.log('All clean-room unit tests passed.');
