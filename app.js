export const opportunities = [
  {id:'OPP-001',title:'Agent-Native Web Challenge',provider:'Demo Labs',type:'Hackathon',deadline:'2026-09-03T13:00:00-07:00',costUsd:0,effortHours:18,impact:92,fit:95,urgency:98,requirements:['Public demo repository','Live application','Three-minute demo video'],summary:'Build an agent-ready website using structured browser tools.',status:'Pursuing'},
  {id:'OPP-002',title:'Future Builders AI Sprint',provider:'Northstar Compute',type:'Hackathon',deadline:'2026-10-30T10:00:00-07:00',costUsd:0,effortHours:28,impact:88,fit:84,urgency:62,requirements:['Hosted application','Open model usage','Technical write-up'],summary:'Create a practical AI agent using open models and cloud infrastructure.',status:'Shortlisted'},
  {id:'OPP-003',title:'Small Business AI Grant',provider:'Civic Innovation Fund',type:'Grant',deadline:'2026-09-18T17:00:00-07:00',costUsd:0,effortHours:9,impact:85,fit:81,urgency:80,requirements:['Business narrative','Budget','Impact plan'],summary:'Funding for responsible AI adoption in small-business operations.',status:'Watching'},
  {id:'OPP-004',title:'Agent Systems Office Hours',provider:'Developer Guild',type:'Training',deadline:'2026-08-31T11:00:00-07:00',costUsd:0,effortHours:2,impact:70,fit:90,urgency:96,requirements:['Registration'],summary:'Live training on designing websites that collaborate with AI agents.',status:'Shortlisted'},
  {id:'OPP-005',title:'Founder Growth Accelerator',provider:'Bay Founders Network',type:'Accelerator',deadline:'2026-09-25T23:59:00-07:00',costUsd:0,effortHours:14,impact:78,fit:75,urgency:72,requirements:['Founder profile','Company summary','Traction evidence'],summary:'Eight-week accelerator for early-stage founders building software products.',status:'Discovered'},
  {id:'OPP-006',title:'Responsible AI Networking Night',provider:'East Bay Tech Forum',type:'Event',deadline:'2026-09-10T17:00:00-07:00',costUsd:25,effortHours:4,impact:68,fit:72,urgency:86,requirements:['RSVP'],summary:'Networking event for founders, investors, and AI practitioners.',status:'Shortlisted'}
];

export let shortlist = ['OPP-001','OPP-004'];

export const byId = (id) => opportunities.find((op) => op.id === id);

export function scoreOpportunity(op, priorities={}) {
  const weights = {
    fit: priorities.fit ?? .35,
    impact: priorities.impact ?? .30,
    urgency: priorities.urgency ?? .25,
    lowEffort: priorities.lowEffort ?? .10
  };
  const total = weights.fit + weights.impact + weights.urgency + weights.lowEffort;
  if (total <= 0) throw new Error('At least one comparison priority must be greater than zero.');
  const lowEffortScore = Math.max(0, 100 - op.effortHours * 2);
  return Math.round((op.fit*weights.fit + op.impact*weights.impact + op.urgency*weights.urgency + lowEffortScore*weights.lowEffort) / total);
}

export function listOpportunities(input={}) {
  return opportunities.filter(op =>
    (!input.type || op.type === input.type) &&
    (!input.status || op.status === input.status) &&
    (input.maxCostUsd === undefined || op.costUsd <= input.maxCostUsd)
  );
}

export function compareOpportunities(ids, priorities={}) {
  return ids.map(byId).filter(Boolean)
    .map(op => ({...op, demoScore:scoreOpportunity(op,priorities)}))
    .sort((a,b)=>b.demoScore-a.demoScore);
}

export function buildActionPlan(id, targetDate) {
  const op = byId(id);
  if (!op) return {error:'Opportunity not found'};
  const steps = op.requirements.map((requirement,index)=>({step:index+1,action:`Prepare: ${requirement}`}));
  steps.push({step:steps.length+1,action:'Run final QA and evidence check'});
  steps.push({step:steps.length+1,action:`Complete before ${targetDate ?? op.deadline}`});
  return {opportunityId:op.id,opportunity:op.title,steps};
}

export function getDeadlineConflicts(ids) {
  const selected = ids.map(byId).filter(Boolean);
  const conflicts = [];
  for (let i=0;i<selected.length;i++) {
    for (let j=i+1;j<selected.length;j++) {
      const days = Math.round(Math.abs(new Date(selected[i].deadline)-new Date(selected[j].deadline))/86400000);
      if (days <= 7) conflicts.push({a:selected[i].title,b:selected[j].title,daysApart:days});
    }
  }
  return {conflicts};
}

function updateShortlist(id, action) {
  if (!byId(id)) return {error:'Opportunity not found'};
  shortlist = action === 'add' ? [...new Set([...shortlist,id])] : shortlist.filter(x=>x!==id);
  if (typeof document !== 'undefined') render();
  return {shortlist:[...shortlist]};
}

const $ = (id) => document.getElementById(id);

export function render() {
  const ranked = [...opportunities].map(op => ({...op, score:scoreOpportunity(op)})).sort((a,b)=>b.score-a.score);
  $('recordCount').textContent = `${ranked.length} synthetic records`;
  $('shortlistCount').textContent = String(shortlist.length);
  $('cards').innerHTML = ranked.map(op => `
    <article class="op-card">
      <div class="op-top"><div><span class="pill">${op.type}</span><h3>${op.title}</h3><p>${op.provider}</p></div><div class="score" aria-label="Demo score ${op.score}">${op.score}</div></div>
      <p class="summary">${op.summary}</p>
      <div class="meta"><span>${new Date(op.deadline).toLocaleString()}</span><span>$${op.costUsd}</span><span>${op.effortHours}h est.</span></div>
      <button data-id="${op.id}" aria-pressed="${shortlist.includes(op.id)}">${shortlist.includes(op.id) ? 'Remove from shortlist' : 'Add to shortlist'}</button>
    </article>`).join('');
  $('shortlist').innerHTML = shortlist.map(id => {
    const op = byId(id); return op ? `<div><strong>${op.title}</strong><span>${op.type} · ${scoreOpportunity(op)}</span></div>` : '';
  }).join('') || '<p class="muted">No opportunities shortlisted.</p>';
  document.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', () => {
    updateShortlist(btn.dataset.id, shortlist.includes(btn.dataset.id) ? 'remove' : 'add');
  }));
}

function toolSchema(properties, required=[]) {
  return {type:'object',properties,required,additionalProperties:false};
}

export async function registerTools() {
  const mc = document.modelContext;
  if (!mc?.registerTool) return false;

  const tools = [
    {
      name:'list_opportunities', title:'List opportunities',
      description:'List synthetic demo opportunities, optionally filtered by type, status, or maximum cost. Use this to discover candidate opportunities before inspecting or comparing them.',
      inputSchema:toolSchema({
        type:{type:'string',description:'Exact opportunity type, such as Hackathon, Grant, Training, Accelerator, or Event.'},
        status:{type:'string',description:'Exact demo status, such as Pursuing, Shortlisted, Watching, Discovered.'},
        maxCostUsd:{type:'number',minimum:0,description:'Maximum allowed demo cost in US dollars.'}
      }), annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async(input={})=>({opportunities:listOpportunities(input)})
    },
    {
      name:'get_opportunity', title:'Get opportunity',
      description:'Get the full synthetic details and requirements for one opportunity by ID.',
      inputSchema:toolSchema({id:{type:'string',description:'Synthetic opportunity ID, for example OPP-001.'}},['id']), annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async({id})=>byId(id) ?? {error:'Opportunity not found'}
    },
    {
      name:'compare_opportunities', title:'Compare opportunities',
      description:'Rank two or more selected synthetic opportunities with a transparent challenge-only scoring model. Weights are relative and are normalized automatically.',
      inputSchema:toolSchema({
        ids:{type:'array',items:{type:'string'},minItems:2,uniqueItems:true,description:'Two or more synthetic opportunity IDs.'},
        priorities:{type:'object',additionalProperties:false,description:'Optional nonnegative comparison weights.',properties:{
          fit:{type:'number',minimum:0,description:'Weight for strategic fit.'}, impact:{type:'number',minimum:0,description:'Weight for expected impact.'}, urgency:{type:'number',minimum:0,description:'Weight for deadline urgency.'}, lowEffort:{type:'number',minimum:0,description:'Weight favoring lower estimated effort.'}
        }}
      },['ids']), annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async({ids,priorities={}})=>({ranking:compareOpportunities(ids,priorities)})
    },
    {
      name:'build_action_plan', title:'Build action plan',
      description:'Create a simple reversible checklist from one synthetic opportunity and its listed requirements.',
      inputSchema:toolSchema({
        id:{type:'string',description:'Synthetic opportunity ID.'},
        targetDate:{type:'string',description:'Optional human-provided target date or deadline label.'}
      },['id']), annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async({id,targetDate})=>buildActionPlan(id,targetDate)
    },
    {
      name:'update_shortlist', title:'Update shortlist',
      description:'Add or remove one synthetic opportunity from the shared in-page shortlist. This is reversible and changes only local demo state.',
      inputSchema:toolSchema({
        id:{type:'string',description:'Synthetic opportunity ID.'},
        action:{type:'string',enum:['add','remove'],description:'Whether to add or remove the opportunity.'}
      },['id','action']), annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute:async({id,action})=>updateShortlist(id,action)
    },
    {
      name:'get_deadline_conflicts', title:'Get deadline conflicts',
      description:'Find selected synthetic opportunities whose deadlines fall within seven calendar days of one another.',
      inputSchema:toolSchema({ids:{type:'array',items:{type:'string'},minItems:2,uniqueItems:true,description:'Two or more synthetic opportunity IDs.'}},['ids']), annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute:async({ids})=>getDeadlineConflicts(ids)
    }
  ];

  try {
    await Promise.all(tools.map(tool => mc.registerTool(tool)));
    return true;
  } catch (error) {
    console.error('WebMCP registration failed:', error);
    return false;
  }
}

if (typeof document !== 'undefined') {
  render();
  registerTools().then(ok => {
    $('toolStatus').textContent = ok ? 'WebMCP tools detected' : 'Human demo mode';
  });
}
