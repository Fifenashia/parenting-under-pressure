document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded ✅");

  // -----------------------------
  // Tiny helpers
  // -----------------------------
  const $ = (id) => document.getElementById(id);
  const show = (el) => el && (el.style.display = "block");
  const hide = (el) => el && (el.style.display = "none");

  // -----------------------------
  // Main sections (existing)
  // -----------------------------
  const homeScreen    = $("homeScreen");
  const checkInScreen = $("checkInScreen");
  const angrySupport  = $("angrySupport");
  const okaySupport   = $("okaySupport");

  // New sections
  const scenarioScreen = $("scenarioScreen");
  const outcomeScreen  = $("outcomeScreen");

  // Buttons (existing)
  const goToCheckInBtn = $("goToCheckIn");
  const getSupportBtn  = $("getSupportBtn");

  // New buttons
  const practiceBtn       = $("practiceScenariosBtn");
  const nextScenarioBtn   = $("nextScenarioBtn");
  const exitScenariosBtn  = $("exitScenariosBtn");
  const restartRunBtn     = $("restartRunBtn");
  const backToCheckInBtn  = $("backToCheckInBtn");

  // Scenario DOM refs
  const scenarioTitle    = $("scenarioTitle");
  const scenarioIntro    = $("scenarioIntro");
  const choicesContainer = $("choicesContainer");
  const scenarioFeedback = $("scenarioFeedback");
  const scenarioEvidence = $("scenarioEvidence");

  // Outcome DOM refs
  const traitBars      = $("traitBars");
  const outcomeSummary = $("outcomeSummary");

  // Utility: Hide all content sections
  function hideAllSections() {
    hide(homeScreen);
    hide(checkInScreen);
    hide(angrySupport);
    hide(okaySupport);
    hide(scenarioScreen);
    hide(outcomeScreen);
  }

  // --------------------------------
  // Existing navigation logic
  // --------------------------------
  goToCheckInBtn?.addEventListener("click", function () {
    hideAllSections();
    show(checkInScreen);
  });

  getSupportBtn?.addEventListener("click", function () {
    const mood = document.getElementById("moodSelect").value;
    hideAllSections();

    switch (mood) {
      case "angry":
        show(angrySupport);
        break;
      case "okay":
        show(okaySupport);
        break;
      default:
        show(checkInScreen);
        alert("Support for that emotion is coming soon!");
    }
  });

  document.querySelectorAll(".backToCheckInBtn").forEach((button) => {
    button.addEventListener("click", function () {
      hideAllSections();
      show(checkInScreen);
    });
  });

  // --------------------------------
  // Practice Scenarios + Trait Meters
  // --------------------------------

  // Config: how many scenarios per run
  const RUN_LENGTH = 8;

  // Long-term trait meters
  const meters = {
    empathy: 0,
    trust: 0,
    attachment: 0,
    self_regulation: 0,
    independence: 0,
    resilience: 0,
    problem_solving: 0,
  };

  // Label traits for end-screen
  function labelTrait(score) {
    if (score >= 6) return "strong";
    if (score >= 2) return "developing";
    if (score >= -1) return "emerging";
    return "needs support";
  }

  // Minimal demo scenarios (swap to fetch('./scenarios_demo_with_traits.json') later)
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
          points: 2,
          badge: "Emotion Coach",
          delta: { empathy:2, trust:1, self_regulation:1, attachment:1, independence:0, resilience:0, problem_solving:0 },
        },
        {
          text: "Threaten to leave.",
          feedback: "Holds limit, but misses empathy.",
          points: 0,
          badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 },
        },
        {
          text: "Give them the candy.",
          feedback: "Stops noise now, reinforces tantrums later.",
          points: 0,
          badge: null,
          delta: { empathy:-1, trust:-2, self_regulation:-1, attachment:0, independence:0, resilience:0, problem_solving:0 },
        },
      ],
    },
    {
      id: "teen_curfew_text",
      title: "Curfew Check-In",
      intro: "It’s 10:15 pm. Your teen texts asking to stay out an extra hour. Curfew is 11:00.",
      evidence: "Consistency + collaborative problem-solving build trust.",
      choices: [
        {
          text: "Hold tonight’s limit; invite talk tomorrow.",
          feedback: "Balances empathy with consistency and models healthy negotiation.",
          points: 2,
          badge: "Boundary Builder",
          delta: { empathy:0, trust:1, self_regulation:0, attachment:0, independence:1, resilience:0, problem_solving:2 },
        },
        {
          text: "No. Don’t ask me again.",
          feedback: "Holds limit but shuts down dialogue.",
          points: 0,
          badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 },
        },
        {
          text: "Okay, just this once—midnight is fine.",
          feedback: "Undermines consistency; invites future pressure.",
          points: 0,
          badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:-1 },
        },
      ],
    },
  ];

  // State
  let scenarioPool = [];
  let scenarioIndex = 0;
  let choiceLocked = false;

  // Entry-point from Check-In screen
  practiceBtn?.addEventListener("click", () => {
    hideAllSections();
    startParentingRun(demoScenarios);
  });

  // Start a new run
  function startParentingRun(all = demoScenarios) {
    // reset meters
    Object.keys(meters).forEach((k) => (meters[k] = 0));

    // build/trim pool
    scenarioPool = [...all];
    if (scenarioPool.length > RUN_LENGTH) {
      scenarioPool.sort(() => Math.random() - 0.5);
      scenarioPool = scenarioPool.slice(0, RUN_LENGTH);
    }

    scenarioIndex = 0;
    choiceLocked = false;
    show(scenarioScreen);
    hide(outcomeScreen);
    loadScenario(scenarioIndex);
  }

  // Render a scenario
  function loadScenario(i) {
    const s = scenarioPool[i];
    if (!s) return;

    if (scenarioTitle) scenarioTitle.textContent = s.title || "";
    if (scenarioIntro) scenarioIntro.textContent = s.intro || "";
    if (choicesContainer) choicesContainer.innerHTML = "";
    if (scenarioFeedback) scenarioFeedback.textContent = "";
    if (scenarioEvidence) scenarioEvidence.textContent = "";
    if (nextScenarioBtn) nextScenarioBtn.disabled = true;

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
      choicesContainer?.appendChild(btn);
    });
  }

  // Apply selected choice
  function applyChoice(choice, scenario) {
    if (scenarioFeedback) scenarioFeedback.textContent = choice.feedback || "";
    if (scenarioEvidence) scenarioEvidence.textContent = scenario.evidence || "";

    // long-term trait deltas
    if (choice.delta) {
      Object.entries(choice.delta).forEach(([k, v]) => {
        meters[k] = (meters[k] || 0) + (v || 0);
      });
    }

    // (Optional) points/badges hooks here

    if (nextScenarioBtn) nextScenarioBtn.disabled = false;
  }

  // Next / Exit
  nextScenarioBtn?.addEventListener("click", () => {
    scenarioIndex++;
    if (scenarioIndex >= scenarioPool.length) {
      showOutcome();
    } else {
      loadScenario(scenarioIndex);
    }
  });

  exitScenariosBtn?.addEventListener("click", () => {
    hideAllSections();
    show(checkInScreen);
  });

  // Outcome screen
  function showOutcome() {
    hide(scenarioScreen);
    drawOutcomeBars();
    if (outcomeSummary) outcomeSummary.innerHTML = buildOutcomeSummary();
    show(outcomeScreen);
  }

  function drawOutcomeBars() {
    if (!traitBars) return;
    traitBars.innerHTML = "";
    const maxAbs = 10; // visual clamp; tweak as needed

    Object.entries(meters).forEach(([trait, score]) => {
      const row = document.createElement("div");
      row.className = "trait";

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = `${human(trait)}: ${score} (${labelTrait(score)})`;

      const bar = document.createElement("div");
      bar.className = "bar";

      const fill = document.createElement("div");
      fill.className = "fill";
      const pct = Math.max(0, Math.min(100, ((score + maxAbs) / (2 * maxAbs)) * 100));
      fill.style.width = pct + "%";

      bar.appendChild(fill);
      row.appendChild(label);
      row.appendChild(bar);
      traitBars.appendChild(row);
    });
  }

  function buildOutcomeSummary() {
    const parts = [];
    const asc = Object.entries(meters).sort((a, b) => a[1] - b[1]); // lowest first
    const desc = [...asc].reverse();

    const highlights = desc.slice(0, 2).map(([k]) => human(k)).join(", ");
    const needs = asc.slice(0, 2).map(([k, v]) => `${human(k)} (${labelTrait(v)})`).join(", ");

    parts.push(`<p><strong>Highlights:</strong> ${highlights}.</p>`);
    parts.push(`<p><strong>Growth edges:</strong> ${needs}.</p>`);
    parts.push(tipsForNeeds(asc.slice(0, 2).map(([k]) => k)));
    return parts.join("");
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
    return `<ul>${keys.map((k) => `<li><strong>${human(k)}:</strong> ${tipbook[k]}</li>`).join("")}</ul>`;
  }

  function human(k) {
    return k.replace("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  // Outcome buttons
  restartRunBtn?.addEventListener("click", () => startParentingRun(demoScenarios));
  backToCheckInBtn?.addEventListener("click", () => {
    hideAllSections();
    show(checkInScreen);
  });

  // -----------------------------
  // (Optional) JSON loader example
  // -----------------------------
  // Uncomment later when you add scenarios_demo_with_traits.json to your repo:
  /*
  fetch('./scenarios_demo_with_traits.json')
    .then(r => r.ok ? r.json() : Promise.reject('Failed to load scenarios JSON'))
    .then(list => {
      // Replace demoScenarios with loaded list:
      practiceBtn?.addEventListener("click", () => {
        hideAllSections();
        startParentingRun(list);
      });
    })
    .catch(err => console.warn(err));
  */
});
