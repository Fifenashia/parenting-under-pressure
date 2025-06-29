document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and script running ✅");

  document.getElementById("startBtn").addEventListener("click", function () {
    document.getElementById("checkInSection").style.display = "block";
    this.style.display = "none";
  });

  document.getElementById("getSupportBtn").addEventListener("click", function () {
    const mood = document.getElementById("moodSelect").value;
    const messageDiv = document.getElementById("supportMessage");
    const restartSection = document.getElementById("restartSection");
    const winsSection = document.getElementById("winsSection");
    const winsMessage = document.getElementById("winsMessage");

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
      restartSection.style.display = "block";
      winsSection.style.display = "block";
    }

    winsMessage.textContent = ""; // Clear previous
  });

  document.getElementById("winsForm").addEventListener("change", function () {
    const anyChecked = Array.from(document.querySelectorAll('input[name="win"]')).some(
      checkbox => checkbox.checked
    );
    document.getElementById("winsMessage").textContent = anyChecked
      ? "✨ You showed up—and that matters."
      : "";
  });

  document.getElementById("restartBtn").addEventListener("click", function () {
    document.getElementById("moodSelect").value = "";
    document.getElementById("supportMessage").textContent = "";
    document.getElementById("checkInSection").style.display = "none";
    document.getElementById("restartSection").style.display = "none";
    document.getElementById("winsSection").style.display = "none";
    document.getElementById("winsMessage").textContent = "";
    document.getElementById("startBtn").style.display = "inline-block";

    document.querySelectorAll('input[name="win"]').forEach(cb => (cb.checked = false));
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
    // Quick Calm Toolkit
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
