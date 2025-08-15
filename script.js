document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded ✅");

  // ---------- tiny helpers ----------
  const $ = (id) => document.getElementById(id);
  const show = (el) => el && (el.style.display = "block");
  const hide = (el) => el && (el.style.display = "none");

  // ---------- sections (from index.html) ----------
  const homeScreen       = $("homeScreen");
  const checkInScreen    = $("checkInScreen");
  const angrySupport     = $("angrySupport");
  const overwhelmedSupport = $("overwhelmedSupport");
  const sadSupport       = $("sadSupport");
  const hopefulSupport   = $("hopefulSupport");
  const okaySupport      = $("okaySupport");
  const calmToolkit      = $("calmToolkit");
  const winsSection      = $("winsSection");
  const affirmationSection = $("affirmationSection");
  const resourcesMenu    = $("resourcesMenu");
  const scenarioScreen   = $("scenarioScreen");
  const outcomeScreen    = $("outcomeScreen");

  // ---------- nav buttons ----------
  const goToCheckInBtn   = $("goToCheckIn");
  const practiceBtn      = $("practiceScenariosBtn");
  const goToResourcesBtn = $("goToResources");
  const getSupportBtn    = $("getSupportBtn");

  const openCalmBtn        = $("openCalmToolkit");
  const openWinsBtn        = $("openWins");
  const openAffirmBtn      = $("openAffirmations");

  const nextScenarioBtn    = $("nextScenarioBtn");
  const exitScenariosBtn   = $("exitScenariosBtn");
  const restartRunBtn      = $("restartRunBtn");
  const backToCheckInBtn   = $("backToCheckInBtn");

  // Affirmations UI
  const getAffirmationBtn = $("getAffirmationBtn");
  const affirmationText   = $("affirmationText");

  // scenario DOM
  const scenarioTitle    = $("scenarioTitle");
  const scenarioIntro    = $("scenarioIntro");
  const choicesContainer = $("choicesContainer");
  const scenarioFeedback = $("scenarioFeedback");
  const scenarioEvidence = $("scenarioEvidence");

  // outcome DOM
  const traitBars      = $("traitBars");
  const outcomeSummary = $("outcomeSummary");

  // ---------- utilities ----------
  function hideAllSections() {
    [homeScreen, checkInScreen, angrySupport, okaySupport,
     calmToolkit, winsSection, affirmationSection, resourcesMenu,
     scenarioScreen, outcomeScreen].forEach(hide);
  }

  // ---------- HOME NAV ----------
  goToCheckInBtn?.addEventListener("click", () => {
    hideAllSections(); show(checkInScreen);
  });

  practiceBtn?.addEventListener("click", () => {
    hideAllSections(); startParentingRun();
  });

  goToResourcesBtn?.addEventListener("click", () => {
    hideAllSections(); show(resourcesMenu);
  });

  // back to home (from Check-In & Resources)
  document.querySelectorAll(".backToHomeBtn").forEach(btn => {
    btn.addEventListener("click", () => { hideAllSections(); show(homeScreen); });
  });

  // ---------- CHECK-IN NAV ----------
 getSupportBtn?.addEventListener("click", () => {
  const mood = document.getElementById("moodSelect")?.value || "";
  hideAllSections();

  switch (mood) {
    case "angry":
      show(angrySupport);
      break;
    case "overwhelmed":
      show(overwhelmedSupport);
      break;
    case "sad":
      show(sadSupport);
      break;
    case "okay":
      show(okaySupport);
      break;
    case "hopeful":
      show(hopefulSupport);
      break;
    default:
      show(checkInScreen);
      alert("Support for that emotion is coming soon!");
  }
});


  // back from mood-specific to check-in
  document.querySelectorAll(".backToCheckInBtn").forEach(btn => {
    btn.addEventListener("click", () => { hideAllSections(); show(checkInScreen); });
  });

  // ---------- RESOURCES NAV ----------
  openCalmBtn?.addEventListener("click", () => { hideAllSections(); show(calmToolkit); });
  openWinsBtn?.addEventListener("click", () => { hideAllSections(); show(winsSection); });
  openAffirmBtn?.addEventListener("click", () => { hideAllSections(); show(affirmationSection); });

  // back to resources
  document.querySelectorAll(".backToResourcesBtn").forEach(btn => {
    btn.addEventListener("click", () => { hideAllSections(); show(resourcesMenu); });
  });

  // ---------- SCENARIOS ENGINE (with long-term trait meters) ----------
  const RUN_LENGTH = 8;

  const meters = {
    empathy: 0,
    trust: 0,
    attachment: 0,
    self_regulation: 0,
    independence: 0,
    resilience: 0,
    problem_solving: 0,
  };

  function labelTrait(score) {
    if (score >= 6) return "strong";
    if (score >= 2) return "developing";
    if (score >= -1) return "emerging";
    return "needs support";
  }

  // use small demo set; later swap to fetch JSON with trait deltas
  const demoScenarios = [
    {
      id: "toddler_tantrum_store",
      title: "Grocery Store Tantrum",
      intro: "Your 2-year-old sees a candy bar and starts yelling at checkout.",
      evidence: "Emotional coaching + consistent limits support self-regulation.",
      choices: [
        {
          text: "Name feeling + hold limit + offer alternative.",
          feedback: "Great: empathy + boundary + choice.",
          points: 2, badge: "Emotion Coach",
          delta: { empathy:2, trust:1, self_regulation:1, attachment:1, independence:0, resilience:0, problem_solving:0 }
        },
        {
          text: "Threaten to leave.",
          feedback: "Holds limit, but misses empathy.",
          points: 0, badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 }
        },
        {
          text: "Give them the candy.",
          feedback: "Stops noise now, reinforces tantrums later.",
          points: 0, badge: null,
          delta: { empathy:-1, trust:-2, self_regulation:-1, attachment:0, independence:0, resilience:0, problem_solving:0 }
        }
      ]
    },
    {
      id: "teen_curfew_text",
      title: "Curfew Check-In",
      intro: "It’s 10:15 pm. Your teen asks to stay out an extra hour. Curfew is 11:00.",
      evidence: "Consistency + collaborative problem-solving build trust.",
      choices: [
        {
          text: "Hold tonight’s limit; invite talk tomorrow.",
          feedback: "Balances empathy with consistency and models negotiation.",
          points: 2, badge: "Boundary Builder",
          delta: { empathy:0, trust:1, self_regulation:0, attachment:0, independence:1, resilience:0, problem_solving:2 }
        },
        {
          text: "No. Don’t ask me again.",
          feedback: "Holds limit but shuts down dialogue.",
          points: 0, badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 }
        },
        {
          text: "Okay, just this once—midnight is fine.",
          feedback: "Undermines consistency; invites future pressure.",
          points: 0, badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:-1 }
        }
      ]
    }
  ];

  let scenarioPool = [];
  let scenarioIndex = 0;
  let choiceLocked = false;

  function startParentingRun(all = demoScenarios) {
    // reset meters
    Object.keys(meters).forEach(k => meters[k] = 0);

    // build/trim pool
    scenarioPool = [...all];
    if (scenarioPool.length > RUN_LENGTH) {
      scenarioPool.sort(() => Math.random() - 0.5);
      scenarioPool = scenarioPool.slice(0, RUN_LENGTH);
    }

    scenarioIndex = 0;
    choiceLocked = false;
    hideAllSections();
    show(scenarioScreen);
    hide(outcomeScreen);
    loadScenario(scenarioIndex);
  }

  function loadScenario(i) {
    const s = scenarioPool[i];
    if (!s) { showOutcome(); return; }

    scenarioTitle.textContent = s.title || "";
    scenarioIntro.textContent = s.intro || "";
    choicesContainer.innerHTML = "";
    scenarioFeedback.textContent = "";
    scenarioEvidence.textContent = "";
    nextScenarioBtn.disabled = true;
    choiceLocked = false;

    s.choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        if (choiceLocked) return;
        choiceLocked = true;
        applyChoice(c, s);
      });
      choicesContainer.appendChild(btn);
    });
  }

  function applyChoice(choice, scenario) {
    scenarioFeedback.textContent = choice.feedback || "";
    scenarioEvidence.textContent = scenario.evidence || "";

    if (choice.delta) {
      Object.entries(choice.delta).forEach(([k, v]) => {
        meters[k] = (meters[k] || 0) + (v || 0);
      });
    }

    nextScenarioBtn.disabled = false;
  }

  nextScenarioBtn?.addEventListener("click", () => {
    scenarioIndex++;
    if (scenarioIndex >= scenarioPool.length) showOutcome();
    else loadScenario(scenarioIndex);
  });

  exitScenariosBtn?.addEventListener("click", () => {
    hideAllSections(); show(homeScreen);
  });

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

      bar.appendChild(fill);
      row.appendChild(label);
      row.appendChild(bar);
      traitBars.appendChild(row);
    });
  }

  function buildOutcomeSummary() {
    const asc  = Object.entries(meters).sort((a,b)=>a[1]-b[1]);
    const desc = [...asc].reverse();

    const highlights = desc.slice(0,2).map(([k])=>human(k)).join(", ");
    const needs = asc.slice(0,2).map(([k,v])=>`${human(k)} (${labelTrait(v)})`).join(", ");

    const tips = tipsForNeeds(asc.slice(0,2).map(([k])=>k));
    return `<p><strong>Highlights:</strong> ${highlights}.</p>
            <p><strong>Growth edges:</strong> ${needs}.</p>${tips}`;
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

  restartRunBtn?.addEventListener("click", () => startParentingRun());
  backToCheckInBtn?.addEventListener("click", () => { hideAllSections(); show(checkInScreen); });

  /*************** Affirmation Spinner ***************/
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

let lastAffirmationIndex = -1;

function randomAffirmation() {
  if (AFFIRMATIONS.length === 0) return "";
  let i = Math.floor(Math.random() * AFFIRMATIONS.length);
  if (i === lastAffirmationIndex && AFFIRMATIONS.length > 1) {
    // avoid immediate repeats
    i = (i + 1) % AFFIRMATIONS.length;
  }
  lastAffirmationIndex = i;
  return AFFIRMATIONS[i];
}

function showNewAffirmation() {
  if (!affirmationText) return;
  affirmationText.textContent = `“${randomAffirmation()}”`;
}

getAffirmationBtn?.addEventListener("click", showNewAffirmation);

// When user opens the Affirmations screen from Resources, show one automatically
openAffirmBtn?.addEventListener("click", () => {
  show(affirmationSection);
  showNewAffirmation();
});

// Optional: keyboard shortcut “A” to spin again when viewing the Affirmations screen
document.addEventListener("keydown", (e) => {
  if (affirmationSection && affirmationSection.style.display !== "none" && e.key.toLowerCase() === "a") {
    showNewAffirmation();
  }
});
/***************************************************/


  // Optional keyboard shortcut: press "S" on Home to start scenarios
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s" && homeScreen && homeScreen.style.display !== "none") {
      startParentingRun();
    }
  });
});
