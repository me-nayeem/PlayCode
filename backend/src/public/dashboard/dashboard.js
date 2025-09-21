function animateSemiCircle(chartElement, percentage, colors) {
  const svg = chartElement.querySelector(".chart-svg");
  const radius = 80;
  const centerX = 100;
  const centerY = 80;
  const startAngle = Math.PI;
  const endAngle = startAngle + (percentage / 100) * Math.PI;

  const existingPaths = svg.querySelectorAll(".animated-path");
  existingPaths.forEach((path) => path.remove());

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.classList.add("animated-path");

  // Calculate path coordinates
  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

  path.setAttribute("d", pathData);
  path.setAttribute("stroke", colors[0] || "#00ff88");
  path.setAttribute("stroke-width", "8");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-linecap", "round");

  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  svg.appendChild(path);

  setTimeout(() => {
    path.style.transition = "stroke-dashoffset 2s ease-out";
    path.style.strokeDashoffset = 0;
  }, 100);
}

// Multi-segment semi-circle for problems solved chart
function animateMultiSegmentChart(chartElement, segments) {
  const svg = chartElement.querySelector(".chart-svg");
  const radius = 80;
  const centerX = 100;
  const centerY = 80;
  let currentAngle = Math.PI;

  // Clear existing animated paths
  const existingPaths = svg.querySelectorAll(".animated-path");
  existingPaths.forEach((path) => path.remove());

  let delay = 0;
  segments.forEach((segment, index) => {
    const segmentAngle = (segment.percentage / 100) * Math.PI;
    const endAngle = currentAngle + segmentAngle;

    const startX = centerX + radius * Math.cos(currentAngle);
    const startY = centerY + radius * Math.sin(currentAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;
    const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("animated-path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", segment.color);
    path.setAttribute("stroke-width", "8");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");

    // Animation setup
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    svg.appendChild(path);

    // Animate with delay
    setTimeout(() => {
      path.style.transition = "stroke-dashoffset 1.5s ease-out";
      path.style.strokeDashoffset = 0;
    }, delay);

    currentAngle = endAngle;
    delay += 300; 
  });
}

// Initialize all semi-circle charts
function initSemiCircleCharts() {
  const problemsChart = document.querySelector(
    ".chart-card:nth-child(1) .semi-circle-chart"
  );
  if (problemsChart) {
    const segments = [
      { percentage: 45, color: "#00ff88" }, 
      { percentage: 15, color: "#ffa500" }, 
      { percentage: 8, color: "#ff4757" }, 
    ];
    animateMultiSegmentChart(problemsChart, segments);
  }

  // Contest Performance Chart
  const contestChart = document.querySelector(
    ".chart-card:nth-child(2) .semi-circle-chart"
  );
  if (contestChart) {
    animateSemiCircle(contestChart, 72, ["#8b5cf6"]);
  }

  // Game Battles Chart
  const gamesChart = document.querySelector(
    ".chart-card:nth-child(3) .semi-circle-chart"
  );
  if (gamesChart) {
    animateSemiCircle(gamesChart, 73, ["#14b8a6"]); 
  }


  const skillChart = document.querySelector(
    ".chart-card:nth-child(4) .semi-circle-chart"
  );
  if (skillChart) {
    animateSemiCircle(skillChart, 68, ["#f97316"]);
  }
}


function initTrendsChart() {
  const canvas = document.getElementById("trendsChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");


  canvas.width = 400;
  canvas.height = 200;

 
  const weeklyData = [5, 8, 12, 7, 15, 10, 18];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = (i / 4) * 160 + 20;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(360, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 3;
  ctx.beginPath();

  weeklyData.forEach((value, index) => {
    const x = (index / (weeklyData.length - 1)) * 320 + 40;
    const y = 180 - (value / 20) * 160;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    // Draw data points
    ctx.fillStyle = "#00ff88";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.stroke();

  // Draw labels
  ctx.fillStyle = "#b0b0b0";
  ctx.font = "12px Rajdhani";
  ctx.textAlign = "center";
  days.forEach((day, index) => {
    const x = (index / (days.length - 1)) * 320 + 40;
    ctx.fillText(day, x, 195);
  });
}


// Countdown timer
function updateCountdown() {
  const countdownElements = document.querySelectorAll(".countdown-number");
  let days = parseInt(countdownElements[0].textContent);
  let hours = parseInt(countdownElements[1].textContent);
  let minutes = parseInt(countdownElements[2].textContent);

  minutes--;
  if (minutes < 0) {
    minutes = 59;
    hours--;
    if (hours < 0) {
      hours = 23;
      days--;
    }
  }

  countdownElements[0].textContent = days.toString().padStart(2, "0");
  countdownElements[1].textContent = hours.toString().padStart(2, "0");
  countdownElements[2].textContent = minutes.toString().padStart(2, "0");
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 2rem;
                background: var(--secondary-bg);
                border: 1px solid var(--accent-color);
                color: var(--text-primary);
                padding: 1rem;
                border-radius: 8px;
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Progress bar animations
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill");
  progressBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.width = bar.style.width;
    }, index * 200);
  });
}

// Trends tab switching
document.querySelectorAll(".trends-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document
      .querySelectorAll(".trends-tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    // Re-draw chart with different data
    initTrendsChart();
  });
});

// Chart card click animations
document.querySelectorAll(".chart-card").forEach((card) => {
  card.addEventListener("click", function () {
    this.style.transform = "scale(0.98)";
    setTimeout(() => {
      this.style.transform = "translateY(-2px)";
    }, 100);
  });
});


document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    initSemiCircleCharts(); 
    initTrendsChart();
    animateProgressBars();
  }, 500);

  //countdown
  setInterval(updateCountdown, 60000);

  // Add fade-in animations for viewport intersection elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
});

// Simulate real-time updates
setInterval(() => {
  if (Math.random() > 0.8) {
    const messages = [
      "New achievement unlocked!",
      "Contest starting in 10 minutes",
      "Friend challenge received",
      "Daily streak maintained!",
    ];
    showNotification(messages[Math.floor(Math.random() * messages.length)]);
  }
}, 30000);


window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});
