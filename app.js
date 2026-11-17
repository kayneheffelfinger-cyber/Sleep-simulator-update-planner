const STORAGE_KEY = "sleep-simulator-planner-v1";

const defaults = {
  roadmap: [
    ["0 — Foundation","Stability + baseline audit","Stops future updates from breaking current progress.","Map current scripts and data flow; inspect beds, earnings, rebirths, skill tree, Zzz purchases, save/load, and UI scaling.","Existing systems are documented; critical bugs are listed; no data or purchase flow changes without a plan.","Critical","Planned"],
    ["1 — Core loop","Bed progression polish","Makes each bed feel like a meaningful upgrade.","Review bed tiers, prices, sleep-rate previews, unlock requirements, equip feedback, and late-game gaps.","Players understand why the next bed is better and how to earn it.","High","Planned"],
    ["2 — Feedback","Sleep loop feel + UI","Makes the main action satisfying and understandable.","Improve sleep/awake feedback, earnings popups, progress bars, sound/visual feedback, and status messages.","Feedback is readable, not spammy, and works on phone and desktop.","High","Planned"],
    ["3 — Prestige","Rebirth clarity + rewards","Gives players a clear long-term goal.","Show exact rebirth requirement, what resets, what is kept, and the permanent reward before confirming.","Players understand the tradeoff; no unintended data loss.","High","Planned"],
    ["4 — Build choices","Skill tree expansion / balance","Makes progression feel more strategic.","Audit existing nodes; add branches only where useful; show prerequisites, cost, effects, and locked reasons.","No dead-end nodes or unclear purchases; server validates skill spending.","Medium","Planned"],
    ["5 — Return visits","Daily + weekly goals","Gives players short goals between major upgrades.","Add rotating quests, progress tracking, and rewards that do not overpower bed progression.","Progress saves correctly and rewards cannot be claimed twice.","Medium","Planned"],
    ["6 — Exploration","New sleep-themed zones","Creates fresh progression milestones.","Add themed areas with unlock goals, visual identity, and bed/quest placement.","Each area has a reason to visit and preserves old progress.","Medium","Planned"],
    ["7 — Social","Leaderboards + group goals","Adds shared goals and replayability.","Consider total sleep, rebirth count, or seasonal goals; use trusted server values.","Leaderboard values are server-trusted and update reliably.","Low","Planned"],
    ["8 — Accessibility","Mobile + quality-of-life pass","Makes the game easier to use on all devices.","Check buttons, text size, safe areas, menus, purchase confirmations, and input handling.","Core gameplay works on phone, tablet, and desktop without clipped UI.","High","Planned"],
    ["9 — Live operations","Events + endgame refresh","Gives experienced players something new to chase.","Plan themed events, cosmetic rewards, limited quests, and balanced endgame goals.","Event content is clear, time-bounded, and does not erase permanent progress.","Low","Planned"]
  ].map((r,i)=>({id:i,stage:r[0],theme:r[1],value:r[2],scope:r[3],done:r[4],priority:r[5],status:r[6]})),
  backlog: [
    ["SS-001","Document current script and data architecture","Audit","High","Critical","Planned","M","None","Every core system has its script/module and data owner identified."],
    ["SS-002","Audit player save/load and data compatibility","Bug prevention","Critical","Critical","Planned","M","SS-001","Returning players keep beds, rebirths, skills, and Zzz balances."],
    ["SS-003","Audit Zzz developer-product receipt handling","Purchase safety","Critical","Critical","Planned","M","SS-001","A receipt is handled safely and a purchase cannot double-grant Zzz."],
    ["SS-004","Add clear bed stat comparison cards","UI","High","High","Planned","S","Bed system","Players can compare current and next bed before spending currency."],
    ["SS-005","Show rebirth reset/reward preview","UI","High","High","Planned","S","Rebirth system","Confirmation explains what resets and what is kept."],
    ["SS-006","Improve sleep earnings feedback","UX","High","High","Planned","S","Sleep loop","Earnings are visible and do not create noisy UI spam."],
    ["SS-007","Review skill tree costs and prerequisites","Balance","Medium","Medium","Planned","M","Skill tree","All nodes show cost, effect, prerequisites, and locked reason."],
    ["SS-008","Add daily quests","Feature","High","Medium","Planned","M","Save system","Quest progress and claim state persist; each reward can be claimed once."],
    ["SS-009","Add weekly quest rotation","Feature","Medium","Low","Planned","M","SS-008","Rotation resets predictably and cannot be exploited by changing client time."],
    ["SS-010","Mobile UI and safe-area audit","Polish","High","High","Planned","M","UI","No key control is clipped or too small on phone/tablet."],
    ["SS-011","Add themed zone unlock milestones","Content","High","Medium","Planned","L","Bed progression","New zone unlocks are communicated and preserve old progress."],
    ["SS-012","Add sleep/rebirth leaderboard","Social","Medium","Low","Planned","M","Server data","Leaderboard only uses trusted server values and handles ties."],
    ["SS-013","Add limited cosmetic event rewards","Live event","Medium","Low","Planned","M","Event framework","Event rewards are cosmetic or carefully balanced and permanently tracked."],
    ["SS-014","Performance pass for busy servers","Optimization","High","High","Planned","M","Core loop","No avoidable per-frame loops or repeated expensive server work."]
  ].map((r,i)=>({id:r[0],task:r[1],type:r[2],impact:r[3],priority:r[4],status:r[5],effort:r[6],depends:r[7],accept:r[8],notes:""})),
  prompts: [
    {tool:"BOTH",name:"Project rules / context",when:"At the start of a new project or when an AI has not seen the code yet.",text:`You are helping me develop my Roblox game, Sleep Simulator.

The game already has:
- Different types of beds
- A rebirth system
- A skill tree
- A Robux shop that sells a premium currency called Zzz

Treat these systems as existing features. Do not rebuild, remove, rename, or replace them just because you would design them differently.

Before editing:
1. Inspect the project files and identify the actual framework, entry points, important scripts/modules, data-saving code, and UI structure.
2. Explain how the existing bed, rebirth, skill-tree, and Zzz purchase systems currently work.
3. Identify the smallest safe files to change for my requested task.
4. Tell me about data-save, purchase, multiplayer, and compatibility risks.

Rules:
- Do not invent file paths or APIs. Inspect the repository.
- Do not change saved-data keys or reset player data unless I explicitly approve a migration plan.
- Keep Robux purchase validation and premium-currency granting server-authoritative.
- Do not put secrets or credentials in source code.
- Do not rewrite unrelated systems.
- After changes, list files changed, explain the change, give exact Roblox Studio test steps, and state any limitations.

My task: [DESCRIBE ONE TASK HERE]`},
    {tool:"CODEX",name:"Read-only repository audit",when:"Before making any changes; get an accurate map of the code.",text:`Inspect the Sleep Simulator repository in READ-ONLY mode. Do not edit files yet.

Find and explain:
1. Project structure and how the Roblox project is opened/synced with Studio.
2. Where bed definitions, bed purchases/equipping, sleep earnings, rebirth logic, skill tree logic, Zzz shop/purchase receipts, and player data saving live.
3. Which code runs on the server versus the client.
4. Existing tests, lint/type checks, and the expected test/run workflow.
5. Any likely bugs, duplicate systems, risky data changes, or security issues.

Return:
- A short architecture map with exact file paths.
- A dependency map for the five existing systems.
- The top 10 recommended fixes/features ranked by player impact and risk.
- A safe first task that can be completed without changing the data schema.

Do not make changes until I give you a specific task.`},
    {tool:"CODEX",name:"Implement one focused feature",when:"For one bounded feature after the audit.",text:`Implement this ONE feature in my existing Sleep Simulator project:

FEATURE: [EXACT FEATURE]
PLAYER PROBLEM IT SOLVES: [PROBLEM]
REQUIRED BEHAVIOR: [BULLET THE EXPECTED BEHAVIOR]
NOT IN SCOPE: [WHAT MUST NOT CHANGE]

First inspect the relevant files and tell me the planned files/changes. Then implement the smallest complete solution.

Requirements:
- Reuse the existing architecture and UI conventions.
- Preserve bed progression, rebirths, skill-tree ownership, Zzz balances, and saved player data unless the task explicitly changes one of them.
- Validate important rewards, purchases, and progression on the server.
- Handle players who already have saved data.
- Do not add unnecessary dependencies or rewrite unrelated files.
- Add or update tests/checks where the project supports them.

Before finishing, run the relevant checks and report: files changed, behavior added, test results, Studio playtest steps, edge cases, and rollback instructions.`},
    {tool:"CODEX",name:"Fix a reproducible bug",when:"When something is broken and needs a narrow fix.",text:`Fix this bug in Sleep Simulator:

BUG: [WHAT IS WRONG]
REPRODUCTION STEPS:
1. [STEP ONE]
2. [STEP TWO]
3. [WHAT HAPPENS]

EXPECTED RESULT: [WHAT SHOULD HAPPEN]
ACTUAL RESULT: [WHAT HAPPENS INSTEAD]
ERROR OUTPUT: [PASTE RELEVANT OUTPUT, IF ANY]

Please:
1. Trace the cause before editing.
2. Identify the smallest responsible code path.
3. Explain the cause and proposed fix briefly.
4. Change only the necessary files.
5. Check that the fix does not break beds, rebirths, the skill tree, Zzz purchases, or saving.
6. Run available checks and give me exact Roblox Studio regression tests.

Do not hide the error, add a workaround that masks the cause, or rewrite unrelated code.`},
    {tool:"CODEX",name:"Review the patch",when:"After a feature is implemented; before merging or releasing.",text:`Review the current uncommitted changes for Sleep Simulator. Do not edit anything during the first review.

Look for:
- Luau/runtime errors and incorrect Roblox API usage
- Client/server trust mistakes
- DataStore/save compatibility risks
- Duplicate rewards, duplicate purchase grants, or race conditions
- Rebirth/bed/skill-tree progression regressions
- Zzz purchase handling mistakes
- Mobile UI problems and performance issues
- Missing failure handling and exploitable remote events

Return findings sorted by severity with exact file and line references. Separate confirmed bugs from possible risks. If there are no high-severity findings, say so.

Then propose the smallest fixes. Wait for my approval before applying fixes.`},
    {tool:"CLAUDE",name:"Feature design + acceptance criteria",when:"Use the free usage window to plan a feature before coding.",text:`Act as the game designer and technical planner for my Roblox game, Sleep Simulator.

Already implemented: different beds, rebirths, a skill tree, and a Robux shop selling Zzz premium currency. Improve the existing game rather than replacing these systems.

Feature idea: [IDEA]
Current player problem: [PROBLEM]
Target player experience: [WHAT SHOULD FEEL BETTER]

Please create a concise implementation specification with:
- Player-facing behavior and UI flow
- Exact rules, costs, rewards, unlock requirements, and edge cases (mark unknown values as questions rather than inventing them)
- Server/client responsibilities
- Data that must be saved and data that should not be changed
- Acceptance criteria that I can test in Roblox Studio
- A small implementation sequence broken into independent steps
- Risks to existing beds, rebirths, skills, saving, and Zzz purchases

Do NOT write code yet. Keep the feature small enough for one focused implementation task.`},
    {tool:"CLAUDE",name:"Implement a small update",when:"When Claude can access the code or when you can provide the relevant files.",text:`I want to make ONE update to my existing Roblox game, Sleep Simulator.

Existing systems that must keep working: beds, rebirths, skill tree, Zzz premium-currency shop, and player saving.

TASK: [ONE CLEAR TASK]
CURRENT BEHAVIOR: [WHAT IT DOES NOW]
DESIRED BEHAVIOR: [WHAT IT SHOULD DO]
FILES I THINK ARE RELEVANT: [PATHS, IF KNOWN]

Inspect the actual code first. Do not assume file names or architecture.
Make the smallest safe change. Do not rebuild working systems, change saved-data keys, reset player data, or alter Robux purchase logic unless the task specifically requires it and you explain why first.

If you cannot directly edit the repository, give me complete replacement contents or a precise patch for only the relevant files, and tell me exactly where each change belongs.

Finish with a summary, files changed, Roblox Studio test steps, regression checks, and rollback notes.`},
    {tool:"CLAUDE",name:"Five-hour session agenda",when:"To make the most of a limited session before implementation.",text:`Help me use this Claude session efficiently for Sleep Simulator.

My current remaining usage is limited, so prioritize useful planning over repeated brainstorming.
Here are the current bugs/ideas: [PASTE LIST]
The code/project access I have: [DESCRIBE ACCESS]

Please:
1. Group these into small, independent tasks.
2. Rank them by player impact, risk, and effort.
3. Choose the best first task that can be completed and tested safely.
4. Produce the exact implementation brief and acceptance checklist for that task.
5. List any files or screenshots I should gather before coding.
6. Write a handoff prompt that I can paste into Codex if I decide to have Codex implement it.

Do not generate a huge speculative rewrite or multiple alternative architectures.`},
    {tool:"CLAUDE",name:"Handoff to Codex",when:"After Claude has helped with a task; transfer clean context to Codex.",text:`Create a clean handoff for Codex for the Sleep Simulator project.

Summarize only verified information:
- Goal and player problem
- Existing systems that must be preserved (beds, rebirths, skill tree, Zzz shop, save data)
- Exact files inspected and relevant code paths
- Proposed smallest change
- Requirements and acceptance criteria
- Data migration / purchase / server-client risks
- Roblox Studio test plan
- Anything still unknown

Do not invent file names, APIs, or test results. Format this as one self-contained prompt for Codex. State clearly that Codex must inspect the repository before editing.`},
    {tool:"BOTH",name:"Release checklist summary",when:"Before publishing any update.",text:`Prepare a release checklist for this Sleep Simulator change.

Change summary: [WHAT CHANGED]
Files changed: [LIST]
Test results: [RESULTS]
Known limitations: [LIST]

Check that:
- The game starts and core loop works.
- Existing beds, rebirths, skill tree, Zzz purchases, and saved progress still work.
- A returning player does not lose saved progress.
- Purchases/rewards cannot be granted twice.
- Client UI does not control valuable currency or progression.
- Phone and desktop layouts are usable.
- Roblox Studio Output has no new errors/warnings.

Give me a GO / DO NOT RELEASE recommendation and list any missing tests. Do not claim a test passed unless it was actually performed.`}
  ],
  sessions: Array.from({length:10},(_,i)=>({number:i+1,date:"",start:"",reset:"",goal:["Project audit + architecture map","Choose next update + write acceptance criteria","Clarify edge cases and data risks","Implementation support / patch review","Bug triage and follow-up planning","UI/UX review with screenshots","Balance review for beds/rebirth/skills","Release notes + next update brief","Event/quest content planning","Long-term roadmap review"][i],handoff:["Save the verified architecture notes","Save the implementation spec","Save exact task and test cases","Save files changed and test outcome","Save prioritized remaining issues","Save exact UI changes requested","Save current values and proposed tuning","Save release summary and next task","Save content spec and reward constraints","Update roadmap status and priorities"][i]})),
  tests: [
    ["Startup","Game starts cleanly","Start a local Studio test and inspect Output.","No new errors; core UI loads."],
    ["New player","First-time player flow","Join with a fresh test profile.","Player sees the intended starting state."],
    ["Returning player","Saved data loads","Rejoin with an existing test profile.","Beds, rebirths, skills, and Zzz balance are preserved."],
    ["Beds","Buy and equip a bed","Earn required currency, buy a bed, equip it, rejoin.","Correct price, ownership, stats, and persistence."],
    ["Sleep loop","Earnings are correct","Compare displayed earnings with actual balance changes.","Server grants the intended amount once per interval/action."],
    ["Rebirth","Requirement and reset preview","Check progress below and at the rebirth threshold.","UI shows exact requirement, reset list, and reward."],
    ["Rebirth","Rebirth preserves intended items","Rebirth on a test profile and rejoin.","Only intended values reset; permanent rewards remain."],
    ["Skill tree","Purchase valid skill","Buy an unlocked node with enough points/currency.","Cost is deducted once and effect applies."],
    ["Skill tree","Reject invalid purchase","Try locked/duplicate/unaffordable purchase in test.","Server rejects it; no free skill or negative balance."],
    ["Zzz shop","Product purchase receipt flow","Use Roblox Studio's supported purchase testing workflow.","Server processes receipt and grants the correct amount once."],
    ["Zzz shop","Failed/cancelled purchase","Cancel or simulate an incomplete test purchase.","No Zzz is granted without a completed valid receipt."],
    ["Multiplayer","Two-player progression","Run a local server with two clients.","One player's actions do not alter another player's data."],
    ["Security","Client cannot set currency","Review remotes and attempt invalid client requests in a test place.","Server validates currency, ownership, and progression."],
    ["UI","Phone/tablet layout","Test device emulation at small screen sizes.","No clipped buttons, unreadable text, or blocked controls."],
    ["UI","Desktop layout","Test common desktop aspect ratios.","Menus and HUD remain aligned and readable."],
    ["Performance","Busy server check","Spawn expected player count / normal gameplay effects.","No obvious frame drops or runaway loops."],
    ["Data","Data migration compatibility","Test with a copy of older player data when schema changes.","Old data loads safely; no accidental wipe."],
    ["Regression","All existing systems still work","Retest beds, rebirths, skill tree, and Zzz shop after the update.","No previously working system is broken."]
  ].map((r,i)=>({id:i,area:r[0],test:r[1],how:r[2],expected:r[3],status:"Not Run",notes:""})),
  economy: [
    ["Starting currency","","Fast first upgrade; not instantly maxed"],
    ["Base sleep earnings","","Clearly understandable and worth doing"],
    ["Bed tier prices","","Each next bed feels attainable but meaningful"],
    ["Bed sleep multipliers","","Higher tiers are stronger without skipping the game"],
    ["Rebirth requirement","","A clear milestone with a worthwhile reward"],
    ["Rebirth reward / multiplier","","Prestige feels valuable but not mandatory"],
    ["Skill tree costs","","Choices are meaningful; no confusing dead ends"],
    ["Skill tree effects","","Effects are visible and do not stack incorrectly"],
    ["Zzz product packs","","Clear amount and price; no misleading claims"],
    ["Zzz uses","","Premium currency adds optional value, not required access"],
    ["Offline earnings (if used)","","Fair cap and clear explanation"],
    ["Daily / weekly rewards (if added)","","Helpful bonus without breaking progression"]
  ].map((r,i)=>({id:i,system:r[0],current:r[1],target:r[2],visible:"",exploit:"",evidence:"",decision:""}))
};

let state = loadState();
let currentPage = "overview";
let toastTimer;

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(defaults);
    const saved = JSON.parse(stored);
    return {
      ...structuredClone(defaults),
      ...saved,
      roadmap: Array.isArray(saved.roadmap) ? saved.roadmap : structuredClone(defaults.roadmap),
      backlog: Array.isArray(saved.backlog) ? saved.backlog : structuredClone(defaults.backlog),
      prompts: Array.isArray(saved.prompts) ? saved.prompts : structuredClone(defaults.prompts),
      sessions: Array.isArray(saved.sessions) ? saved.sessions : structuredClone(defaults.sessions),
      tests: Array.isArray(saved.tests) ? saved.tests : structuredClone(defaults.tests),
      economy: Array.isArray(saved.economy) ? saved.economy : structuredClone(defaults.economy)
    };
  } catch (error) {
    console.warn("Planner data could not be loaded. Starting with the default planner.", error);
    return structuredClone(defaults);
  }
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    showToast("Browser storage is unavailable. Export a backup to keep your changes.");
    return false;
  }
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
}
function titleCase(value) { return String(value || "").replace(/-/g," ").replace(/\b\w/g, c => c.toUpperCase()); }
function slug(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function pill(value, kind="status") { return `<span class="${kind}-pill ${slug(value)}">${esc(value)}</span>`; }
function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2300);
}
function counts() {
  const road = Object.fromEntries(["Planned","In progress","Testing","Released"].map(s=>[s,state.roadmap.filter(x=>x.status===s).length]));
  const done = state.tests.filter(t=>t.status==="Passed").length;
  const open = state.backlog.filter(t=>t.status!=="Done").length;
  return {road,done,open,tests:state.tests.length,percent:state.tests.length?Math.round(done/state.tests.length*100):0};
}
function setPage(page) {
  currentPage = page;
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const name = ({overview:"Overview",roadmap:"Roadmap",backlog:"Backlog","prompts":"Prompt library",sessions:"Claude sessions",testing:"Test checklist",economy:"Economy audit"})[page] || "Overview";
  document.getElementById("crumb-current").textContent = name;
  render();
  document.getElementById("sidebar").scrollIntoView({block:"nearest"});
}
function heading(kicker,title,subtitle,actions="") {
  return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function render() {
  const pages = {overview:renderOverview,roadmap:renderRoadmap,backlog:renderBacklog,prompts:renderPrompts,sessions:renderSessions,testing:renderTesting,economy:renderEconomy};
  document.getElementById("page-content").innerHTML = (pages[currentPage] || renderOverview)();
  document.getElementById("nav-roadmap-count").textContent = state.roadmap.length;
  document.getElementById("nav-backlog-count").textContent = state.backlog.filter(x=>x.status!=="Done").length;
}
function renderOverview() {
  const c = counts();
  const active = state.roadmap.find(x=>x.status!=="Released") || state.roadmap[state.roadmap.length-1];
  const completedRoad = c.road.Released;
  const roadPct = state.roadmap.length ? Math.round(completedRoad/state.roadmap.length*100) : 0;
  const nextItems = state.roadmap.filter(x=>x.status!=="Released").slice(0,4);
  return `
    <section class="welcome-hero">
      <div class="hero-copy">
        <div class="hero-kicker"><span class="hero-kicker-dot"></span> YOUR PERSONAL DEV STUDIO</div>
        <h1>Dream bigger.<br><span>Build better.</span></h1>
        <p>Your quiet corner to plan updates, level up your game, and bring every new idea to life.</p>
        <div class="hero-actions">
          <button class="button button-light" data-goto="roadmap">Explore roadmap <span>↗</span></button>
          <span class="hero-caption"><span>☾</span> Made for Sleep Simulator</span>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-spark spark-a">✦</div><div class="hero-spark spark-b">·</div><div class="hero-spark spark-c">✧</div>
        <div class="hero-orbit orbit-back"></div>
        <div class="hero-orbit orbit-front"></div>
        <div class="hero-moon"><div class="moon-crater crater-a"></div><div class="moon-crater crater-b"></div><div class="moon-crater crater-c"></div></div>
        <div class="hero-cloud cloud-a"></div><div class="hero-cloud cloud-b"></div>
        <div class="hero-star star-a"></div><div class="hero-star star-b"></div><div class="hero-star star-c"></div>
      </div>
      <div class="hero-bottom-glow"></div>
    </section>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-top">Roadmap planned <span class="stat-icon tint-purple">⌁</span></div><div class="stat-value">${c.road.Planned}</div><div class="stat-foot">${c.road["In progress"]} currently in progress</div></div>
      <div class="stat-card"><div class="stat-top">Open tasks <span class="stat-icon tint-blue">☷</span></div><div class="stat-value">${c.open}</div><div class="stat-foot">${state.backlog.length-c.open} tasks marked done</div></div>
      <div class="stat-card"><div class="stat-top">Tests passed <span class="stat-icon tint-teal">✓</span></div><div class="stat-value">${c.done}<small style="font-size:13px;color:#9aa1b4"> / ${c.tests}</small></div><div class="stat-foot">${c.percent}% of checklist passed</div></div>
      <div class="stat-card"><div class="stat-top">Updates released <span class="stat-icon tint-amber">✧</span></div><div class="stat-value">${c.road.Released}</div><div class="stat-foot">Across ${state.roadmap.length} roadmap stages</div></div>
    </div>
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-header"><div><h2>Roadmap progress</h2><p>Keep your next update clear and manageable.</p></div><a class="text-link" href="#roadmap" data-goto="roadmap">View roadmap ↗</a></div>
        <div class="panel-body">
          <div style="display:flex;justify-content:space-between;align-items:center"><strong style="font-size:11px">${roadPct}% released</strong><span style="color:#9aa1b4;font-size:9px">${completedRoad} of ${state.roadmap.length} stages</span></div>
          <div class="progress-wrap"><div class="progress-fill" style="width:${roadPct}%"></div></div>
          <div class="milestone-list">
            ${nextItems.map((x)=>`<div class="milestone"><div class="milestone-num">${String(x.id).padStart(2,"0")}</div><div><strong>${esc(x.theme)}</strong><small>${esc(x.value)}</small></div>${pill(x.status)}</div>`).join("") || '<div class="empty-state">All roadmap stages are marked released. Nice work!</div>'}
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>Recommended workflow</h2><p>Use each tool for what it does best.</p></div></div>
        <div class="panel-body">
          <div class="workflow-steps">
            <div class="workflow-step"><span class="workflow-num">1</span><div><strong>Claude — plan the update</strong><p>Turn an idea into a small spec, acceptance criteria, and edge cases.</p></div></div>
            <div class="workflow-step"><span class="workflow-num">2</span><div><strong>Codex — work on the code</strong><p>Inspect the project, make a focused change, and review the diff.</p></div></div>
            <div class="workflow-step"><span class="workflow-num">3</span><div><strong>Roblox Studio — test it</strong><p>Check saves, purchases, multiplayer, and mobile layout before release.</p></div></div>
          </div>
          <div class="notice" style="margin-top:19px"><span>✦</span><div><strong>Protect your current game.</strong> Back it up and keep beds, rebirths, skills, Zzz purchases, and player data working.</div></div>
        </div>
      </section>
    </div>
    <section class="panel" style="margin-top:16px">
      <div class="panel-header"><div><h2>Your next milestone</h2><p>Suggested first focus based on the roadmap.</p></div><a class="text-link" href="#prompts" data-goto="prompts">Open prompts ↗</a></div>
      <div class="panel-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div class="stat-icon tint-purple" style="width:42px;height:42px;font-size:20px">☾</div>
        <div style="flex:1;min-width:200px"><strong style="font:700 14px 'Space Grotesk'">${esc(active.theme)}</strong><p style="font-size:10px;color:#8d95aa;margin:5px 0 0">${esc(active.scope)}</p></div>
        ${pill(active.priority,"priority")} <button class="button button-primary" data-goto="roadmap">Open roadmap</button>
      </div>
    </section>`;
}
function renderRoadmap() {
  return `${heading("PLAN YOUR NEXT RELEASE","Update roadmap","These are suggested milestones. Change priority and status as your project moves forward.")}
  <div class="table-tools"><span class="notice" style="padding:8px 11px">Tip: mark a stage <strong>Released</strong> after it has been tested in Roblox Studio.</span></div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Stage</th><th>Update</th><th>Player value</th><th>Scope / ideas</th><th>Done when…</th><th>Priority</th><th>Status</th></tr></thead><tbody>
  ${state.roadmap.map(x=>`<tr><td><strong>${esc(x.stage)}</strong></td><td><strong>${esc(x.theme)}</strong></td><td>${esc(x.value)}</td><td>${esc(x.scope)}</td><td>${esc(x.done)}</td><td><select class="field-select" data-list="roadmap" data-id="${x.id}" data-field="priority">${options(["Critical","High","Medium","Low"],x.priority)}</select></td><td><select class="field-select" data-list="roadmap" data-id="${x.id}" data-field="status">${options(["Planned","In progress","Testing","Released"],x.status)}</select></td></tr>`).join("")}
  </tbody></table></div>`;
}
function options(items,selected) { return items.map(x=>`<option value="${esc(x)}" ${x===selected?"selected":""}>${esc(x)}</option>`).join(""); }
function renderBacklog() {
  return `${heading("KEEP TASKS SMALL","Feature & bug backlog","Track individual jobs from idea to completion. Add your own tasks and record what you tested.")}
  <form class="form-panel" id="new-task-form"><h3>＋ Add a task</h3><div class="add-task-grid"><div class="field-group"><label for="new-id">Task ID</label><input id="new-id" class="field-input" placeholder="SS-015"></div><div class="field-group"><label for="new-task">Task name</label><input id="new-task" class="field-input" required placeholder="Describe the task"></div><div class="field-group"><label for="new-type">Type</label><input id="new-type" class="field-input" placeholder="Feature"></div><div class="field-group"><label for="new-priority">Priority</label><select id="new-priority" class="field-select">${options(["Critical","High","Medium","Low"],"Medium")}</select></div><button class="button button-primary" type="submit">Add to backlog</button></div></form>
  <div class="table-tools"><input class="search-input" id="backlog-search" placeholder="Search tasks, IDs, or notes…"><select class="filter-select" id="backlog-filter"><option value="All">All statuses</option>${options(["Planned","In Progress","Done"],"All")}</select><span class="helper">${state.backlog.length} total tasks</span></div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Task</th><th>Type / impact</th><th>Priority</th><th>Status</th><th>Effort</th><th>Depends on</th><th>Acceptance check / notes</th></tr></thead><tbody id="backlog-rows">${backlogRows(state.backlog)}</tbody></table></div>`;
}
function backlogRows(rows) {
  if (!rows.length) return '<tr><td colspan="8" class="empty-state">No matching tasks. Try a different search or filter.</td></tr>';
  return rows.map(x=>`<tr><td class="table-id">${esc(x.id)}</td><td><strong>${esc(x.task)}</strong><span class="subtext">${esc(x.notes||"Add a note after testing.")}</span><input aria-label="Notes for ${esc(x.id)}" class="field-input" style="margin-top:6px;width:100%;max-width:220px" data-list="backlog" data-id="${esc(x.id)}" data-field="notes" placeholder="Add note or test result…" value="${esc(x.notes)}"></td><td>${esc(x.type)}<span class="subtext">Impact: ${esc(x.impact)}</span></td><td>${pill(x.priority,"priority")}</td><td><select class="field-select" data-list="backlog" data-id="${esc(x.id)}" data-field="status">${options(["Planned","In Progress","Done"],x.status)}</select></td><td>${esc(x.effort)}</td><td>${esc(x.depends)}</td><td>${esc(x.accept)}</td></tr>`).join("");
}
function renderPrompts() {
  return `${heading("READY-TO-USE PROMPTS","Prompt library","Choose the right prompt, copy it, replace the bracketed details, and give the AI one focused task.")}
  <div class="table-tools"><select class="filter-select" id="prompt-filter"><option value="All">All tools</option><option>CODEX</option><option>CLAUDE</option><option>BOTH</option></select><span class="helper">Never ask two coding agents to edit the same files at once.</span></div>
  <div class="prompt-grid" id="prompt-grid">${promptCards(state.prompts)}</div>`;
}
function promptCards(rows) {
  return rows.map((x,i)=>`<article class="prompt-card" data-prompt-card data-tool="${esc(x.tool)}"><div class="prompt-card-top"><div><span class="tool-label">${esc(x.tool)}</span><h3>${esc(x.name)}</h3></div><span style="color:#d0cafa;font-size:20px">✧</span></div><div class="prompt-when">${esc(x.when)}</div><textarea class="prompt-text" id="prompt-${i}" aria-label="${esc(x.name)} prompt">${esc(x.text)}</textarea><div class="prompt-actions"><small>Editable before copying</small><button class="button button-primary" data-copy-prompt="${i}">Copy prompt ↗</button></div></article>`).join("");
}
function renderSessions() {
  return `${heading("MAKE EACH SESSION COUNT","Claude session tracker","Plan what to accomplish and save a handoff before the usage window ends. Claude Free may also have a separate weekly usage limit.")}
  <div class="notice" style="margin-bottom:15px"><span>◷</span><div>Use the reset time shown in your Claude account. Session limits can vary, so this tracker is for your own planning—not a prediction of available messages.</div></div>
  <div class="session-grid"><div class="session-card"><small>PLANNED SESSIONS</small><strong>${state.sessions.length}</strong><p>Use one session for one clear planning or review goal.</p></div><div class="session-card"><small>HANDOFFS RECORDED</small><strong>${state.sessions.filter(s=>s.handoffDone).length}</strong><p>Mark a handoff after saving the notes outside Claude.</p></div></div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>Date</th><th>Start time</th><th>Reset shown by Claude</th><th>Main goal</th><th>Handoff / result</th><th>Saved?</th></tr></thead><tbody>
  ${state.sessions.map((s,i)=>`<tr><td><strong>${s.number}</strong></td><td><input class="field-input" type="date" data-list="sessions" data-id="${i}" data-field="date" value="${esc(s.date)}"></td><td><input class="field-input" type="time" data-list="sessions" data-id="${i}" data-field="start" value="${esc(s.start)}"></td><td><input class="field-input" placeholder="Time from Claude" data-list="sessions" data-id="${i}" data-field="reset" value="${esc(s.reset)}"></td><td><input class="field-input" style="min-width:170px" data-list="sessions" data-id="${i}" data-field="goal" value="${esc(s.goal)}"></td><td><input class="field-input" style="min-width:190px" data-list="sessions" data-id="${i}" data-field="handoff" value="${esc(s.handoff)}"></td><td><input type="checkbox" aria-label="Handoff saved" data-list="sessions" data-id="${i}" data-field="handoffDone" ${s.handoffDone?"checked":""}></td></tr>`).join("")}
  </tbody></table></div><p class="helper">Changes save automatically in this browser. Export a backup before clearing browser data or changing devices.</p>`;
}
function renderTesting() {
  const c=counts();
  return `${heading("VERIFY BEFORE YOU RELEASE","Test checklist","Mark each check only after you have actually performed it in Roblox Studio or the relevant test environment.")}
  <div class="test-summary"><div class="test-ring" style="--progress:${c.percent*3.6}deg"><span>${c.percent}%</span></div><div><strong>${c.done} of ${c.tests} checks passed</strong><p>${state.tests.filter(x=>x.status==="Failed").length} failed • ${state.tests.filter(x=>x.status==="Blocked").length} blocked • ${state.tests.filter(x=>x.status==="Not Run").length} not run</p></div></div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Area</th><th>Test</th><th>How to test</th><th>Expected result</th><th>Status</th><th>Notes / evidence</th></tr></thead><tbody>
  ${state.tests.map(x=>`<tr><td><strong>${esc(x.area)}</strong></td><td>${esc(x.test)}</td><td>${esc(x.how)}</td><td>${esc(x.expected)}</td><td><select class="field-select" data-list="tests" data-id="${x.id}" data-field="status">${options(["Not Run","Passed","Failed","Blocked"],x.status)}</select></td><td><input class="field-input" style="min-width:145px" placeholder="What happened?" data-list="tests" data-id="${x.id}" data-field="notes" value="${esc(x.notes)}"></td></tr>`).join("")}
  </tbody></table></div>`;
}
function renderEconomy() {
  return `${heading("RECORD REAL GAME VALUES","Progression & economy audit","Fill in your actual prices, earnings, multipliers, and Zzz pack details. The planner does not invent balance numbers.")}
  <div class="notice" style="margin-bottom:14px"><span>◉</span><div>Use values from your real game scripts and product setup. Review premium-currency pricing and purchases carefully; keep product grants validated by the server.</div></div>
  <div class="economy-head"><span>SYSTEM</span><span>CURRENT VALUE / RULE</span><span>TARGET FEELING</span></div>
  <div class="economy-grid">${state.economy.map(x=>`<div class="economy-row"><div><strong>${esc(x.system)}</strong><small>What is true in your current game?</small></div><input class="field-input" data-list="economy" data-id="${x.id}" data-field="current" aria-label="Current value for ${esc(x.system)}" placeholder="Enter actual value or rule…" value="${esc(x.current)}"><div><input class="field-input" data-list="economy" data-id="${x.id}" data-field="target" value="${esc(x.target)}" aria-label="Target feeling for ${esc(x.system)}"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px"><input class="field-input" data-list="economy" data-id="${x.id}" data-field="visible" placeholder="Shown to player?" value="${esc(x.visible)}"><input class="field-input" data-list="economy" data-id="${x.id}" data-field="exploit" placeholder="Exploit risk?" value="${esc(x.exploit)}"></div><input class="field-input" style="width:100%;margin-top:7px" data-list="economy" data-id="${x.id}" data-field="evidence" placeholder="Evidence / script path…" value="${esc(x.evidence)}"><input class="field-input" style="width:100%;margin-top:7px" data-list="economy" data-id="${x.id}" data-field="decision" placeholder="Decision / planned change…" value="${esc(x.decision)}"></div></div>`).join("")}</div>`;
}

document.addEventListener("click", async event => {
  const nav = event.target.closest("[data-page]");
  if (nav) { setPage(nav.dataset.page); return; }
  const goto = event.target.closest("[data-goto]");
  if (goto) { event.preventDefault(); setPage(goto.dataset.goto); return; }
  const copy = event.target.closest("[data-copy-prompt]");
  if (copy) {
    const index = Number(copy.dataset.copyPrompt);
    const area = document.getElementById("prompt-"+index);
    if (!area) return;
    try { await navigator.clipboard.writeText(area.value); showToast("Prompt copied. Paste it into Claude or Codex."); }
    catch { area.select(); document.execCommand("copy"); showToast("Prompt copied."); }
    return;
  }
  if (event.target.closest("#export-button")) exportBackup();
  if (event.target.closest("#import-button")) document.getElementById("import-file").click();
  if (event.target.closest("#reset-button")) resetPlanner();
});
document.addEventListener("change", event => {
  const el = event.target;
  if (el.id === "backlog-filter") filterBacklog();
  if (el.id === "prompt-filter") {
    const selected = el.value;
    document.querySelectorAll("[data-prompt-card]").forEach(card => {
      card.style.display = selected === "All" || card.dataset.tool === selected ? "" : "none";
    });
  }
  if (el.matches("[data-list][data-field]")) {
    const list = state[el.dataset.list];
    const id = el.dataset.id;
    const item = el.dataset.list==="roadmap" || el.dataset.list==="backlog" ? list.find(x=>String(x.id)===String(id)) : list[Number(id)];
    if (!item) return;
    item[el.dataset.field] = el.type==="checkbox" ? el.checked : el.value;
    saveState();
    if (["roadmap","tests","backlog","sessions"].includes(el.dataset.list) && (el.tagName==="SELECT" || el.type==="checkbox")) render();
    if (el.dataset.list==="tests") showToast("Test status saved.");
  }
});
document.addEventListener("submit", event => {
  if (event.target.id !== "new-task-form") return;
  event.preventDefault();
  const id = document.getElementById("new-id").value.trim() || "SS-"+String(state.backlog.length+1).padStart(3,"0");
  const task = document.getElementById("new-task").value.trim();
  if (!task) return;
  if (state.backlog.some(x=>x.id===id)) { showToast("That task ID already exists. Choose another ID."); return; }
  state.backlog.unshift({id,task,type:document.getElementById("new-type").value.trim()||"Feature",impact:"Medium",priority:document.getElementById("new-priority").value,status:"Planned",effort:"M",depends:"None",accept:"Add an acceptance check.",notes:""});
  saveState(); render(); showToast("Task added to your backlog.");
});
document.addEventListener("input", event => {
  if (event.target.matches("textarea[id^=prompt-]:not(#prompt-filter)")) {
    const match = event.target.id.match(/^prompt-(\\d+)$/);
    if (match && state.prompts[Number(match[1])]) {
      state.prompts[Number(match[1])].text = event.target.value;
      saveState();
    }
  }
  if (event.target.id==="backlog-search") filterBacklog();
  if (event.target.id==="prompt-filter") {
    const selected = event.target.value;
    document.querySelectorAll("[data-prompt-card]").forEach(card => {
      card.style.display = selected==="All" || card.dataset.tool===selected ? "" : "none";
    });
  }
});
function filterBacklog() {
  const search = (document.getElementById("backlog-search")?.value || "").toLowerCase();
  const filter = document.getElementById("backlog-filter")?.value || "All";
  const rows = state.backlog.filter(x=>(filter==="All"||x.status===filter) && [x.id,x.task,x.type,x.notes,x.accept].join(" ").toLowerCase().includes(search));
  const body = document.getElementById("backlog-rows");
  if (body) body.innerHTML = backlogRows(rows);
}
document.getElementById("import-file").addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    for (const key of Object.keys(defaults)) if (Array.isArray(imported[key])) state[key]=imported[key];
    saveState(); render(); showToast("Backup imported.");
  } catch { showToast("That file is not a valid planner backup."); }
  event.target.value="";
});
function exportBackup() {
  const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "sleep-simulator-planner-backup.json"; a.click();
  URL.revokeObjectURL(url);
  showToast("Backup downloaded.");
}
function resetPlanner() {
  if (!confirm("Reset this browser's planner to the original template? Export a backup first if you want to keep your changes.")) return;
  state=structuredClone(defaults); saveState(); render(); showToast("Planner reset to the original template.");
}
render();
