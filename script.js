document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded ✅");

  // Main sections
  const homeScreen = document.getElementById("homeScreen");
  const checkInScreen = document.getElementById("checkInScreen");
  const angrySupport = document.getElementById("angrySupport");
  const okaySupport = document.getElementById("okaySupport");

  // Utility: Hide all main content sections
  function hideAllSections() {
    homeScreen.style.display = "none";
    checkInScreen.style.display = "none";
    angrySupport.style.display = "none";
    okaySupport.style.display = "none";
  }

  // Navigation: Home → Check-In
  document.getElementById("goToCheckIn").addEventListener("click", function () {
    hideAllSections();
    checkInScreen.style.display = "block";
  });

  // Get Support → Show mood-specific section
  document.getElementById("getSupportBtn").addEventListener("click", function () {
    const mood = document.getElementById("moodSelect").value;

    hideAllSections();

    switch (mood) {
      case "angry":
        angrySupport.style.display = "block";
        break;
      case "okay":
        okaySupport.style.display = "block";
        break;
      default:
        // If mood is not one of the custom screens, go back to check-in
        checkInScreen.style.display = "block";
        alert("Support for that emotion is coming soon!");
    }
  });

  // Back buttons on support screens → Return to Check-In
  document.querySelectorAll(".backToCheckInBtn").forEach((button) => {
    button.addEventListener("click", function () {
      hideAllSections();
      checkInScreen.style.display = "block";
    });
  });
});
