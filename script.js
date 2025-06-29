document.getElementById("startBtn").addEventListener("click", function () {
  document.getElementById("checkInSection").style.display = "block";
  this.style.display = "none"; // hide start button
});

document.getElementById("getSupportBtn").addEventListener("click", function () {
  const mood = document.getElementById("moodSelect").value;
  const messageDiv = document.getElementById("supportMessage");
  const restartSection = document.getElementById("restartSection");

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
  }
});

document.getElementById("restartBtn").addEventListener("click", function () {
  // Reset all sections
  document.getElementById("moodSelect").value = "";
  document.getElementById("supportMessage").textContent = "";
  document.getElementById("checkInSection").style.display = "none";
  document.getElementById("restartSection").style.display = "none";
  document.getElementById("startBtn").style.display = "inline-block";
});
