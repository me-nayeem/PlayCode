// Initialize the growth chart
function initializeGrowthChart() {
  const canvas = document.querySelector(".growth-chart");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  // Sample data for the last 7 days
  const xpData = [5800, 6100, 6300, 6500, 6650, 6750, 6847];
  const rankData = [52, 50, 49, 48, 47, 47, 47];

  // Draw XP line
  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 2;
  ctx.beginPath();

  xpData.forEach((xp, index) => {
    const x = (index / (xpData.length - 1)) * (canvas.width / 2 - 20) + 10;
    const y = canvas.height / 2 - 20 - ((xp - 5800) / 1047) * 20;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw rank line (inverted because lower rank is better)
  ctx.strokeStyle = "#0099ff";
  ctx.lineWidth = 2;
  ctx.beginPath();

  rankData.forEach((rank, index) => {
    const x = (index / (rankData.length - 1)) * (canvas.width / 2 - 20) + 10;
    const y = canvas.height / 2 - 10 + ((rank - 47) / 5) * 15;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

// Animate XP bar on load
function animateXPBar() {
  const xpProgress = document.querySelector(".xp-progress");
  xpProgress.style.width = "0%";
  setTimeout(() => {
    xpProgress.style.width = "68%";
  }, 500);
}

// Animate stat values counting up
function animateStatValues() {
  const statValues = document.querySelectorAll(".stat-value");

  statValues.forEach((element) => {
    const finalValue = element.textContent;
    if (finalValue.includes("#") || finalValue.includes("%")) return;

    const numValue = parseInt(finalValue.replace(/,/g, ""));
    let currentValue = 0;
    const increment = numValue / 50;

    element.textContent = "0";

    const counter = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numValue) {
        element.textContent = finalValue;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(currentValue).toLocaleString();
      }
    }, 20);
  });
}

// Initialize everything when the sidebar loads
setTimeout(() => {
  initializeGrowthChart();
  animateXPBar();
  animateStatValues();
}, 1000);

// Add hover effects for achievement items
document.querySelectorAll(".achievement-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.style.transform = "translateX(10px) scale(1.02)";
  });
  item.addEventListener("mouseleave", function () {
    this.style.transform = "translateX(0) scale(1)";
  });
});


document
  .querySelector(".action-button.primary")
  .addEventListener("click", function () {
    this.innerHTML = "<span>⏳</span><span>Finding Opponent...</span>";
    setTimeout(() => {
      this.innerHTML = "<span>🎮</span><span>Quick Battle</span>";
    }, 2000);
  });

document
  .querySelector(".action-button.secondary")
  .addEventListener("click", function () {
    console.log("Navigating to full statistics page...");
  });


  window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
