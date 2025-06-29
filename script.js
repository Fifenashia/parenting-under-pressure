document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded ✅");

  // Navigation buttons
  const checkInBtn = document.getElementById("goToCheckIn");
  const homeScreen = document.getElementById("homeScreen");
  const checkInScreen = document.getElementById("checkInScreen");
  const supportMenu = document.getElementById("supportMenu");
  const calmToolkit = document.getElementById("calmToolkit");
  const winsSection = document.getElementById("winsSection");
  const affirmationSection = document.getElementById("affirmationSection");

  function hideAllSections() {
    checkInScreen.style.display = "none";
    supportMenu.style.display = "none";
    calmToolkit.style.display = "none";
    winsSection.style.display = "none";
    affirmationSection.style.display = "none";
  }

  function showSection(section) {
    hideAllSections();
    section.style.display = "block";
  }

  checkInBtn.addEventListener("click", function () {
    homeScreen.style.display = "none";
    showSection(checkInScreen);
  });

  // Get Support logic
  document.getElementById("getSupportBtn").addEventListener("click", function () {
    const mood = document.getElementById("moodSelect").value;
    const messageDiv = document.getElementById("supportMessage");

    let message = "";

    switch (mood) {
      case "overwhelmed":
        message = "🫶 You're doing your best. Pause. Breathe. This moment will pass.";
        break;
      case "angry":
        message = "💡 Step away if you need to. Silence isn’t failure—it’s space to cool down.";
        break;
      case "sad":
        message = "💗 You don’t have to fix everything today. Just be present, even in small ways.";
        break;
      case "okay":
        message = "🌱 Keep going. Even okay is a sign of growth.";
        break;
      case "hopeful":
        message = "🌞 Hold onto that hope. You're building something beautiful.";
        break;
      default:
        message = "Please choose how you're feeling.";
    }

    messageDiv.textContent = message;

    if (mood) {
      checkInScreen.style.display = "none";
      supportMenu.style.display = "block";
    }
  });

  // Support menu navigation
  document.getElementById("toCalmBtn").addEventListener("click", () => showSection(calmToolkit));
  document.getElementById("toWinsBtn").addEventListener("click", () => showSection(winsSection));
  document.getElementById("toAffirmBtn").addEventListener("click", () => showSection(affirmationSection));

  // Back buttons
  document.querySelectorAll(".backBtn").forEach(button => {
    button.addEventListener("click", () => {
      showSection(supportMenu);
    });
  });

  // Restart button
  document.getElementById("restartBtn").addEventListener("click", function () {
    document.getElementById("moodSelect").value = "";
    document.getElementById("supportMessage").textContent = "";
    document.getElementById("winsMessage").textContent = "";
    document.getElementById("affirmationText").textContent = "";
    document.getElementById("calmOutput").textContent = "";
    document.querySelectorAll('input[name="win"]').forEach(cb => (cb.checked = false));

    hideAllSections();
    homeScreen.style.display = "block";
  });

  // Wins tracker logic
  document.getElementById("winsForm").addEventListener("change", function () {
    const anyChecked = Array.from(document.querySelectorAll('input[name="win"]')).some(
      checkbox => checkbox.checked
    );
    document.getElementById("winsMessage").textContent = anyChecked
      ? "✨ You showed up—and that matters."
      : "";
  });

  // Affirmation Spinner
  const affirmations = [
    "You are not your worst moment.",
    "Messy is still trying.",
    "Your effort counts, even when no one sees it.",
    "You are worthy of kindness—even from yourself.",
    "This hard moment doesn’t define your whole day.",
    "You are building safety. That’s sacred.",
    "You are not failing—you’re learning while tired.",
    "You are not alone. Others have been here too."
  ];

  document.getElementById("getAffirmationBtn").addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const affirmation = affirmations[randomIndex];
    document.getElementById("affirmationText").textContent = `"${affirmation}"`;
  });

  // Calm Toolkit buttons
  document.getElementById("breatheBtn").addEventListener("click", function () {
    document.getElementById("calmOutput").innerHTML = `
      <p>Inhale... <span style="font-size: 24px;">⬆️</span></p>
      <p>Hold... 2... 3...</p>
      <p>Exhale... <span style="font-size: 24px;">⬇️</span></p>
      <p>Repeat slowly, 3–5 times.</p>
    `;
  });

  document.getElementById("groundBtn").addEventListener("click", function () {
    document.getElementById("calmOutput").innerHTML = `
      <p><strong>5</strong> things you can see<br>
      <strong>4</strong> things you can touch<br>
      <strong>3</strong> things you can hear<br>
      <strong>2</strong> things you can smell<br>
      <strong>1</strong> thing you can taste</p>
    `;
  });

  document.getElementById("soundBtn").addEventListener("click", function () {
    window.open("https://www.youtube.com/watch?v=1ZYbU82GVz4", "_blank");
  });
});
