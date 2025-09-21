window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "transparent";
  } else {
    navbar.style.background = "rgba(26, 26, 26, 0.95)";
  }
});


const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = Math.random() * 0.3 + "s";
      entry.target.classList.add("fade-in");
    }
  });
}, observerOptions);

document.querySelectorAll(".feature-card, .service-card").forEach((card) => {
  observer.observe(card);
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.05) rotateY(8deg)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1) rotateY(0deg)";
  });
});

// Code animation cycling for cool home page.
const codeLines = [
  [
    '<span class="keyword">function</span> <span class="string">battle</span>() {',
    '  <span class="keyword">let</span> winner = <span class="string">null</span>;',
    '  <span class="keyword">while</span> (!solved) {',
    '    player.<span class="string">think</span>() && player.<span class="string">code</span>();',
    '  } <span class="comment">// Victory awaits!</span>',
  ],
  [
    '<span class="keyword">class</span> <span class="string">CodeWarrior</span> {',
    '  <span class="keyword">constructor</span>() {',
    '    this.skill = <span class="string">"growing"</span>;',
    '    this.fun = <span class="string">Infinity</span>;',
    '  } <span class="comment">// Level up!</span>',
  ],
  [
    '<span class="keyword">const</span> challenge = <span class="string">new Problem()</span>;',
    '<span class="keyword">const</span> solution = <span class="string">think(challenge)</span>;',
    '<span class="keyword">if</span> (solution.isCorrect()) {',
    '  player.<span class="string">celebrate</span>();',
    '} <span class="comment">// Keep coding!</span>',
  ],
];

let currentSet = 0;
setInterval(() => {
  const codeAnimation = document.querySelector(".code-animation");
  const lines = codeAnimation.querySelectorAll(".code-line");

  lines.forEach((line, index) => {
    setTimeout(() => {
      line.style.opacity = "0";
      setTimeout(() => {
        line.innerHTML = codeLines[currentSet][index];
        line.style.opacity = "1";
      }, 200);
    }, index * 100);
  });

  currentSet = (currentSet + 1) % codeLines.length;
}, 8000);
