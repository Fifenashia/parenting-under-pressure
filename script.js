document.addEventListener("DOMContentLoaded", () => {
  // Helpers
  const $ = (id) => document.getElementById(id);
  const show = (el) => el && (el.style.display = "block");
  const hide = (el) => el && (el.style.display = "none");

  // Sections
  const homeScreen         = $("homeScreen");
  const checkInScreen      = $("checkInScreen");
  const angrySupport       = $("angrySupport");
  const overwhelmedSupport = $("overwhelmedSupport");
  const okaySupport        = $("okaySupport");
  const sadSupport         = $("sadSupport");
  const hopefulSupport     = $("hopefulSupport");

  const calmToolkit        = $("calmToolkit");
  const winsSection        = $("winsSection");
  const affirmationSection = $("affirmationSection");
  const resourcesMenu      = $("resourcesMenu");

  const scenariosIntro     = $("scenariosIntroScreen");
  const childSetup         = $("childSetupScreen");
  const scenarioScreen     = $("scenarioScreen");
  const outcomeScreen      = $("outcomeScreen");

  // Home nav
  const goToCheckInBtn   = $("goToCheckIn");
  const practiceBtn      = $("practiceScenariosBtn");
  const goToResourcesBtn = $("goToResources");

  // Check-in
  const getSupportBtn = $("getSupportBtn");

  // Resources buttons
  const openCalmBtn   = $("openCalmToolkit");
  const openWinsBtn   = $("openWins");
  const openAffirmBtn = $("openAffirmations");

  // Scenarios Intro / Setup buttons
  const goToChildSetupBtn    = $("goToChildSetup");
  const backToHomeFromIntro  = $("backToHomeFromIntro");
  const beginRunBtn          = $("beginScenarioRunBtn");
  const backToIntroFromSetup = $("backToIntroFromSetup");

  // Child setup inputs
  const childNameInput = $("childName");
  const childVibeSel   = $("childVibe");

  // Scenario DOM
  const scenarioTitle    = $("scenarioTitle");
  const scenarioIntroEl  = $("scenarioIntro");
  const choicesContainer = $("choicesContainer");
  const scenarioFeedback = $("scenarioFeedback");
  const scenarioEvidence = $("scenarioEvidence");
  const nextScenarioBtn  = $("nextScenarioBtn");
  const exitScenariosBtn = $("exitScenariosBtn");

  // Outcome DOM
  const traitBars      = $("traitBars");
  const outcomeSummary = $("outcomeSummary");
  const restartRunBtn  = $("restartRunBtn");
  const backToCheckInBtn = $("backToCheckInBtn");

  // Affirmations spinner (from earlier)
  const getAffirmationBtn = $("getAffirmationBtn");
  const affirmationText   = $("affirmationText");

  function hideAll() {
    [homeScreen, checkInScreen, angrySupport, overwhelmedSupport, okaySupport, sadSupport, hopefulSupport,
     calmToolkit, winsSection, affirmationSection, resourcesMenu, scenariosIntro, childSetup, scenarioScreen, outcomeScreen]
     .forEach(hide);
  }

  // HOME NAV
  goToCheckInBtn?.addEventListener("click", () => { hideAll(); show(checkInScreen); });
  goToResourcesBtn?.addEventListener("click", () => { hideAll(); show(resourcesMenu); });

  // PRACTICE → Intro
  practiceBtn?.addEventListener("click", () => { hideAll(); show(scenariosIntro); });

  // Intro nav
  goToChildSetupBtn?.addEventListener("click", () => { hideAll(); show(childSetup); });
  backToHomeFromIntro?.addEventListener("click", () => { hideAll(); show(homeScreen); });

  // Check-in routing
  getSupportBtn?.addEventListener("click", () => {
    const mood = $("moodSelect")?.value || "";
    hideAll();
    if (mood === "angry") show(angrySupport);
    else if (mood === "overwhelmed") show(overwhelmedSupport);
    else if (mood === "sad") show(sadSupport);
    else if (mood === "okay") show(okaySupport);
    else if (mood === "hopeful") show(hopefulSupport);
    else { show(checkInScreen); alert("Support for that emotion is coming soon!"); }
  });

  // Back buttons
  document.querySelectorAll(".backToCheckInBtn").forEach(b => b.addEventListener("click", () => { hideAll(); show(checkInScreen); }));
  document.querySelectorAll(".backToHomeBtn").forEach(b => b.addEventListener("click", () => { hideAll(); show(homeScreen); }));
  document.querySelectorAll(".backToResourcesBtn").forEach(b => b.addEventListener("click", () => { hideAll(); show(resourcesMenu); }));

  // Resources openers
  openCalmBtn?.addEventListener("click", () => { hideAll(); show(calmToolkit); });
  openWinsBtn?.addEventListener("click", () => { hideAll(); show(winsSection); });
  openAffirmBtn?.addEventListener("click", () => { hideAll(); show(affirmationSection); showNewAffirmation(); });

  // ========== Scenarios Engine ==========
  const RUN_LENGTH = 8;
  const meters = {
    empathy: 0, trust: 0, attachment: 0, self_regulation: 0,
    independence: 0, resilience: 0, problem_solving: 0
  };
  function labelTrait(s){ if(s>=6) return "strong"; if(s>=2) return "developing"; if(s>=-1) return "emerging"; return "needs support"; }

  // Demo scenarios (now include age_group for stage filtering)
  const demoScenarios = [
    {
      id:"toddler_tantrum_store",
      title:"Grocery Store Tantrum",
      age_group:"Toddler (2–3)",
      intro:"Your 2-year-old sees a candy bar and starts yelling at checkout.",
      evidence:"Emotional coaching + consistent limits support self-regulation.",
      choices:[
        { text:"Name feeling + hold limit + offer alternative.", feedback:"Great: empathy + boundary + choice.", points:2, badge:"Emotion Coach",
          delta:{ empathy:2, trust:1, self_regulation:1, attachment:1, independence:0, resilience:0, problem_solving:0 } },
        { text:"Threaten to leave.", feedback:"Holds limit, but misses empathy.", points:0, badge:null,
          delta:{ empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 } },
        { text:"Give them the candy.", feedback:"Stops noise now, reinforces tantrums later.", points:0, badge:null,
          delta:{ empathy:-1, trust:-2, self_regulation:-1, attachment:0, independence:0, resilience:0, problem_solving:0 } }
      ]
    },
    {
      id:"teen_curfew_text",
      title:"Curfew Check-In",
      age_group:"Teen (13–18)",
      intro:"It’s 10:15 pm. Your teen asks to stay out an extra hour. Curfew is 11:00.",
      evidence:"Consistency + collaborative problem-solving build trust.",
      choices:[
        { text:"Hold tonight’s limit; invite talk tomorrow.", feedback:"Balances empathy with consistency and models negotiation.", points:2, badge:"Boundary Builder",
          delta:{ empathy:0, trust:1, self_regulation:0, attachment:0, independence:1, resilience:0, problem_solving:2 } },
        { text:"No. Don’t ask me again.", feedback:"Holds limit but shuts down dialogue.", points:0, badge:null,
          delta:{ empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 } },
        { text:"Okay, just this once—midnight is fine.", feedback:"Undermines consistency; invites future pressure.", points:0, badge:null,
          delta:{ empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:-1 } }
      ]
    }
  ];

  // Child profile (from setup)
  const currentChild = { name: "", stage: "toddler", vibe: "" };

  backToIntroFromSetup?.addEventListener("click", () => { hideAll(); show(scenariosIntro); });

  beginRunBtn?.addEventListener("click", () => {
    // gather setup
    currentChild.name = (childNameInput?.value || "").trim();
    currentChild.vibe = childVibeSel?.value || "";
    const stageRadio = document.querySelector('input[name="stage"]:checked');
    currentChild.stage = stageRadio ? stageRadio.value : "toddler";

    // start
    const all = demoScenarios; // swap to loaded JSON later
    const pool = filterByStage(all, currentChild.stage);
    startParentingRun(pool.length ? pool : all);
  });

  function filterByStage(list, stage) {
    const map = {
      infant: ["infant","0–1","0-1"],
      toddler: ["toddler","2–3","2-3"],
      preschool: ["preschool","4–5","4-5"],
      "school-age": ["school-age","6–12","6-12","school"],
      teen: ["teen","13–18","13-18"]
    };
    const keys = map[stage] || [];
    return list.filter(s => {
      const hay = `${s.age_group||""} ${s.title||""} ${s.intro||""}`.toLowerCase();
      return keys.some(k => hay.includes(k.toLowerCase()));
    });
  }

  // Start run
  let scenarioPool = [];
  let scenarioIndex = 0;
  let choiceLocked = false;

  function startParentingRun(all) {
    Object.keys(meters).forEach(k => meters[k]=0);
    scenarioPool = [...all];
    if (scenarioPool.length > RUN_LENGTH) {
      scenarioPool.sort(()=>Math.random()-0.5);
      scenarioPool = scenarioPool.slice(0, RUN_LENGTH);
    }
    scenarioIndex = 0; choiceLocked = false;
    hideAll(); show(scenarioScreen); hide(outcomeScreen);
    loadScenario(scenarioIndex);
  }

  function personalize(text) {
    const name = currentChild.name;
    if (!name) return text;
    // light personalization: replace "your child" with name where it fits
    return text.replace(/\byour child\b/gi, name);
  }

  function loadScenario(i) {
    const s = scenarioPool[i]; if (!s) { showOutcome(); return; }
    scenarioTitle.textContent = s.title || "";
    scenarioIntroEl.textContent = personalize(s.intro || "");
    choicesContainer.innerHTML = "";
    scenarioFeedback.textContent = "";
    scenarioEvidence.textContent = s.evidence || "";
    nextScenarioBtn.disabled = true; choiceLocked = false;

    s.choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "choice-btn"; btn.textContent = c.text;
      btn.addEventListener("click", () => {
        if (choiceLocked) return; choiceLocked = true; applyChoice(c, s);
      });
      choicesContainer.appendChild(btn);
    });
  }

  function applyChoice(choice, scenario) {
    scenarioFeedback.textContent = choice.feedback || "";
    if (choice.delta) {
      Object.entries(choice.delta).forEach(([k, v]) => { meters[k] = (meters[k] || 0) + (v || 0); });
    }
    nextScenarioBtn.disabled = false;
  }

  nextScenarioBtn?.addEventListener("click", () => {
    scenarioIndex++;
    if (scenarioIndex >= scenarioPool.length) showOutcome(); else loadScenario(scenarioIndex);
  });

  exitScenariosBtn?.addEventListener("click", () => { hideAll(); show(homeScreen); });

  function showOutcome() {
    hide(scenarioScreen);
    drawOutcomeBars();
    outcomeSummary.innerHTML = buildOutcomeSummary();
    show(outcomeScreen);
  }

  function drawOutcomeBars() {
    traitBars.innerHTML = "";
    const maxAbs = 10;
    Object.entries(meters).forEach(([trait, score]) => {
      const row   = document.createElement("div"); row.className = "trait";
      const label = document.createElement("div"); label.className = "label";
      label.textContent = `${human(trait)}: ${score} (${labelTrait(score)})`;
      const bar  = document.createElement("div"); bar.className  = "bar";
      const fill = document.createElement("div"); fill.className = "fill";
      const pct  = Math.max(0, Math.min(100, ((score + maxAbs) / (2*maxAbs)) * 100));
      fill.style.width = pct + "%";
      bar.appendChild(fill); row.appendChild(label); row.appendChild(bar); traitBars.appendChild(row);
    });
  }

  function buildOutcomeSummary() {
    const asc  = Object.entries(meters).sort((a,b)=>a[1]-b[1]);
    const desc = [...asc].reverse();
    const highlights = desc.slice(0,2).map(([k])=>human(k)).join(", ");
    const needs = asc.slice(0,2).map(([k,v])=>`${human(k)} (${labelTrait(v)})`).join(", ");
    const childName = currentChild.name || "Your child";
    const vibeLine = currentChild.vibe ? ` You adapted to a ${currentChild.vibe} vibe.` : "";
    const tips = tipsForNeeds(asc.slice(0,2).map(([k])=>k));
    return `<p><strong>${childName}</strong> is developing: ${highlights}.</p>
            <p><strong>Growth edges:</strong> ${needs}.${vibeLine}</p>${tips}`;
  }

  function tipsForNeeds(keys) {
    const tipbook = {
      empathy: "Use feeling words + reflection: “You’re disappointed we’re leaving. That’s hard.”",
      trust: "Be consistent with limits, and repair after conflict: “I got loud. I’m sorry.”",
      attachment: "Create connection rituals: 10 minutes of one-on-one ‘special time’ daily.",
      self_regulation: "Name the feeling + offer a coping action (breathe, squeeze, quiet space).",
      independence: "Offer bounded choices: “Red shirt or blue?”, “Now or in 5 minutes?”",
      resilience: "Normalize setbacks and praise effort/process, not just outcomes.",
      problem_solving: "Model brainstorming: “What are 2–3 ways we could handle this?”",
    };
    return `<ul>${keys.map(k => `<li><strong>${human(k)}:</strong> ${tipbook[k]}</li>`).join("")}</ul>`;
  }

  function human(k){ return k.replace("_"," ").replace(/\b\w/g,m=>m.toUpperCase()); }

  // Outcome nav
  restartRunBtn?.addEventListener("click", () => { hideAll(); show(childSetup); }); // restart from setup
  backToCheckInBtn?.addEventListener("click", () => { hideAll(); show(checkInScreen); });

  // ===== Affirmation Spinner (from earlier) =====
  const AFFIRMATIONS = [
    "I can be both strong and gentle.",
    "My patience grows with each breath I take.",
    "Today, progress matters more than perfection.",
    "I am building trust with my child one moment at a time.",
    "I can choose connection over control.",
    "My love is a steady anchor for my child.",
    "It’s okay to rest when I am tired.",
    "I am the calm my child can return to.",
    "Even small repairs can heal big hurts.",
    "I am learning and growing alongside my child.",
    "I can listen with my whole heart.",
    "Every day is a new opportunity to connect.",
    "I forgive myself for past mistakes.",
    "I bring safety and kindness to my home.",
    "I am exactly the parent my child needs."
  ];
  let lastAffIdx = -1;
  function randomAff(){ if(!AFFIRMATIONS.length) return ""; let i=Math.floor(Math.random()*AFFIRMATIONS.length); if(i===lastAffIdx&&AFFIRMATIONS.length>1) i=(i+1)%AFFIRMATIONS.length; lastAffIdx=i; return AFFIRMATIONS[i]; }
  function showNewAffirmation(){ if(affirmationText) affirmationText.textContent = `“${randomAff()}”`; }
  getAffirmationBtn?.addEventListener("click", showNewAffirmation);
  openAffirmBtn?.addEventListener("click", () => { hideAll(); show(affirmationSection); showNewAffirmation(); });
});
