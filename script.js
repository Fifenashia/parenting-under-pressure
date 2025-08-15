document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded ✅ (debug build)");

  // -----------------------------
  // Global debug handlers
  // -----------------------------
  window.onerror = (msg, src, line, col, err) => {
    console.error("❌ JS Error:", msg, "at", src, line + ":" + col, err);
    alert("A script error occurred. Open DevTools → Console to see details.");
  };
  window.addEventListener("unhandledrejection", (ev) => {
    console.error("❌ Unhandled Promise Rejection:", ev.reason);
    alert("An async error occurred. Check console for details.");
  });

  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (id) => document.getElementById(id);
  const show = (el) => el && (el.style.display = "block");
  const hide = (el) => el && (el.style.display = "none");
  const exists = (id) => !!$(id);

  function expect(id) {
    const el = $(id);
    if (!el) console.warn(`[expect] Missing element: #${id}`);
    return el;
  }

  // -----------------------------
  // Sections
  // -----------------------------
  const homeScreen    = expect("homeScreen");
  const checkInScreen = expect("checkInScreen");
  const angrySupport  = expect("angrySupport");
  const okaySupport   = expect("okaySupport");

  const scenarioScreen = expect("scenarioScreen"); // NEW
  const outcomeScreen  = expect("outcomeScreen");  // NEW

  // Buttons
  const goToCheckInBtn = expect("goToCheckIn");
  const getSupportBtn  = expect("getSupportBtn");
  let   practiceBtn    = $("practiceScenariosBtn"); // may add if missing

  const nextScenarioBtn  = $("nextScenarioBtn");
  const exitScenariosBtn = $("exitScenariosBtn");
  const restartRunBtn    = $("restartRunBtn");
  const backToCheckInBtn = $("backToCheckInBtn");

  // Scenario DOM refs
  const scenarioTitle    = $("scenarioTitle");
  const scenarioIntro    = $("scenarioIntro");
  const choicesContainer = $("choicesContainer");
  const scenarioFeedback = $("scenarioFeedback");
  const scenarioEvidence = $("scenarioEvidence");

  // Outcome DOM refs
  const traitBars      = $("traitBars");
  const outcomeSummary = $("outcomeSummary");

  // -----------------------------
  // Visibility utils
  // -----------------------------
  function hideAllSections() {
    [homeScreen, checkInScreen, angrySupport, okaySupport, scenarioScreen, outcomeScreen]
      .forEach(hide);
  }

  // -----------------------------
  // Existing nav
  // -----------------------------
  goToCheckInBtn?.addEventListener("click", () => {
    console.log("[Nav] Home → Check-In");
    hideAllSections(); show(checkInScreen);
  });

  getSupportBtn?.addEventListener("click", () => {
    const mood = $("moodSelect")?.value;
    console.log("[Check-In] Mood =", mood);
    hideAllSections();

    switch (mood) {
      case "angry": show(angrySupport); break;
      case "okay":  show(okaySupport);  break;
      default:
        show(checkInScreen);
        alert("Support for that emotion is coming soon!");
    }
  });

  document.querySelectorAll(".backToCheckInBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("[Nav] Back to Check-In");
      hideAllSections(); show(checkInScreen);
    });
  });

  // -----------------------------
  // Scenarios Engine (with debug)
  // -----------------------------
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

  const demoScenarios = [
    {
      id: "toddler_tantrum_store",
      title: "Grocery Store Tantrum",
      intro: "Your 2-year-old sees a candy bar and starts yelling at checkout.",
      evidence: "Emotional coaching + consistent limits support self-regulation.",
      choices: [
        { text: "Name feeling + hold limit + offer alternative.",
          feedback: "Great: empathy + boundary + choice.",
          points: 2, badge: "Emotion Coach",
          delta: { empathy:2, trust:1, self_regulation:1, attachment:1, independence:0, resilience:0, problem_solving:0 }
        },
        { text: "Threaten to leave.",
          feedback: "Holds limit, but misses empathy.", points: 0, badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 }
        },
        { text: "Give them the candy.",
          feedback: "Stops noise now, reinforces tantrums later.", points: 0, badge: null,
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
        { text: "Hold tonight’s limit; invite talk tomorrow.",
          feedback: "Balances empathy with consistency and models negotiation.",
          points: 2, badge: "Boundary Builder",
          delta: { empathy:0, trust:1, self_regulation:0, attachment:0, independence:1, resilience:0, problem_solving:2 }
        },
        { text: "No. Don’t ask me again.",
          feedback: "Holds limit but shuts down dialogue.", points: 0, badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:0 }
        },
        { text: "Okay, just this once—midnight is fine.",
          feedback: "Undermines consistency; invites future pressure.", points: 0, badge: null,
          delta: { empathy:0, trust:-1, self_regulation:0, attachment:0, independence:0, resilience:0, problem_solving:-1 }
        }
      ]
    }
  ];

  let scenarioPool = [];
  let scenarioIndex = 0;
  let choiceLocked = false;

  function startParentingRun(all = demoScenarios) {
    console.log("[Run] Starting run with", all.length, "scenarios");
    if (!scenarioScreen) {
      alert("Scenario screen (#scenarioScreen) is missing in index.html.");
      throw new Error("Missing #scenarioScreen");
    }
    if (!choicesContainer) {
      alert("Choices container (#choicesContainer) is missing in index.html.");
      throw new Error("Missing #choicesContainer");
    }

    Object.keys(meters).forEach(k => meters[k] = 0);

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
    if (!s) {
      console.warn("[Run] No scenario at index", i);
      showOutcome();
      return;
    }
    console.log("[Scenario] Loading:", s.id);

    if (scenarioTitle)   scenarioTitle.textContent = s.title || "";
    if (scenarioIntro)   scenarioIntro.textContent = s.intro || "";
    if (choicesContainer) choicesContainer.innerHTML = "";
    if (scenarioFeedback) scenarioFeedback.textContent = "";
    if (scenarioEvidence) scenarioEvidence.textContent = "";
    if (nextScenarioBtn)  nextScenarioBtn.disabled  = true;

    choiceLocked = false;

    s.choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        if (choiceLocked) return;
        choiceLocked = true;
        console.log("[Choice] Selected option", idx + 1, c);
        applyChoice(c, s);
      });
      choicesContainer.appendChild(btn);
    });
  }

  function applyChoice(choice, scenario) {
    if (scenarioFeedback) scenarioFeedback.textContent = choice.feedback || "";
    if (scenarioEvidence) scenarioEvidence.textContent = scenario.evidence || "";

    if (choice.delta) {
      Object.entries(choice.delta).forEach(([k, v]) => {
        meters[k] = (meters[k] || 0) + (v || 0);
      });
      console.log("[Meters]", JSON.stringify(meters));
    }

    if (nextScenarioBtn) nextScenarioBtn.disabled = false;
  }

  nextScenarioBtn?.addEventListener("click", () => {
    console.log("[Nav] Next scenario");
    scenarioIndex++;
    if (scenarioIndex >= scenarioPool.length) {
      showOutcome();
    } else {
      loadScenario(scenarioIndex);
    }
  });

  exitScenariosBtn?.addEventListener("click", () => {
    console.log("[Nav] Exit scenarios → Check-In");
    hideAllSections(); show(checkInScreen);
  });

  function showOutcome() {
    console.log("[Outcome] Showing outcome");
    hide(scenarioScreen);
    drawOutcomeBars();
    if (outcomeSummary) outcomeSummary.innerHTML = buildOutcomeSummary();
    show(outcomeScreen);
  }

  function drawOutcomeBars() {
    if (!traitBars) return console.warn("[Outcome] Missing #traitBars");
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

  restartRunBtn?.addEventListener("click", () => {
    console.log("[Run] Restart");
    startParentingRun(demoScenarios);
  });

  backToCheckInBtn?.addEventListener("click", () => {
    console.log("[Nav] Outcome → Check-In");
    hideAllSections(); show(checkInScreen);
  });

  // -----------------------------
  // PRACTICE BUTTON: rock-solid wiring
  // -----------------------------
  function wirePracticeButton() {
    practiceBtn = $("practiceScenariosBtn");
    if (!practiceBtn) {
      console.warn("[Practice] #practiceScenariosBtn not found. Creating a temporary one inside #checkInScreen.");
      if (checkInScreen) {
        const temp = document.createElement("button");
        temp.id = "practiceScenariosBtn";
        temp.textContent = "Practice Scenarios (debug)";
        temp.style.marginLeft = "8px";
        checkInScreen.appendChild(temp);
        practiceBtn = temp;
      }
    }
    if (practiceBtn) {
      practiceBtn.addEventListener("click", () => {
        console.log("[Practice] Clicked");
        startParentingRun(demoScenarios);
      });
      console.log("[Practice] Button wired ✅");
    }
  }
  wirePracticeButton();

  // Keyboard shortcut: press "S" to start scenarios
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s") {
      console.log("[Practice] Keyboard shortcut S");
      startParentingRun(demoScenarios);
    }
  });

  // Final presence report
  console.table({
    homeScreen: !!homeScreen,
    checkInScreen: !!checkInScreen,
    angrySupport: !!angrySupport,
    okaySupport: !!okaySupport,
    scenarioScreen: !!scenarioScreen,
    outcomeScreen: !!outcomeScreen,
    practiceBtn: !!practiceBtn,
    nextScenarioBtn: !!nextScenarioBtn,
  });
});
