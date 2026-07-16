document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobileMenu");
  const mobileNav = document.getElementById("mobileNav");
  const justiceLogo = document.getElementById("justiceLogo");
  const legacyOverlay = document.getElementById("legacyOverlay");
  const closeLegacy = document.getElementById("closeLegacy");
  const developerOverlay = document.getElementById("developerOverlay");
  const closeDeveloper = document.getElementById("closeDeveloper");

  const bootScreen = document.getElementById("bootScreen");
  const bootLog = document.getElementById("bootLog");
  const bootProgress = document.getElementById("bootProgress");
  const skipBoot = document.getElementById("skipBoot");

  // Mobile menu
  if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      mobileMenuButton.setAttribute("aria-expanded", String(open));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Legacy Mode — five fast clicks
  let logoClicks = 0;
  let clickResetTimer;

  if (justiceLogo) {
    justiceLogo.addEventListener("click", () => {
      logoClicks += 1;
      clearTimeout(clickResetTimer);

      if (typeof justiceLogo.animate === "function") {
        justiceLogo.animate(
          [
            { transform: "scale(1) rotate(0deg)" },
            { transform: "scale(1.065) rotate(-2deg)" },
            { transform: "scale(1) rotate(0deg)" }
          ],
          { duration: 330, easing: "ease-out" }
        );
      }

      if (logoClicks >= 5) {
        logoClicks = 0;
        activateLegacyMode();
      } else {
        clickResetTimer = window.setTimeout(() => {
          logoClicks = 0;
        }, 2100);
      }
    });

    justiceLogo.addEventListener("dblclick", (event) => {
      event.preventDefault();
      createRain(22);
    });
  }

  function activateLegacyMode() {
    if (!legacyOverlay) return;
    legacyOverlay.classList.add("active");
    legacyOverlay.setAttribute("aria-hidden", "false");
    createRain(54);
  }

  function closeLegacyMode() {
    if (!legacyOverlay) return;
    legacyOverlay.classList.remove("active");
    legacyOverlay.setAttribute("aria-hidden", "true");
  }

  closeLegacy?.addEventListener("click", closeLegacyMode);

  legacyOverlay?.addEventListener("click", (event) => {
    if (event.target === legacyOverlay) closeLegacyMode();
  });

  function createRain(amount = 30) {
    const symbols = ["♛", "♔", "♜", "♞", "♝", "♟"];

    for (let index = 0; index < amount; index += 1) {
      const piece = document.createElement("span");
      piece.className = "rain-piece";
      piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.fontSize = `${18 + Math.random() * 28}px`;
      piece.style.animationDuration = `${3.8 + Math.random() * 3.7}s`;
      piece.style.animationDelay = `${Math.random() * 1.8}s`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 9500);
    }
  }

  // Ambient particles
  const ambientCanvas = document.getElementById("ambientCanvas");
  const ambientContext = ambientCanvas?.getContext("2d");
  let ambientParticles = [];

  function resizeAmbientCanvas() {
    if (!ambientCanvas || !ambientContext) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    ambientCanvas.width = Math.floor(window.innerWidth * ratio);
    ambientCanvas.height = Math.floor(window.innerHeight * ratio);
    ambientCanvas.style.width = `${window.innerWidth}px`;
    ambientCanvas.style.height = `${window.innerHeight}px`;
    ambientContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(90, Math.max(32, Math.floor(window.innerWidth / 16)));
    ambientParticles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 0.3 + Math.random() * 1.35,
      speed: 0.03 + Math.random() * 0.17,
      drift: (Math.random() - 0.5) * 0.08,
      alpha: 0.05 + Math.random() * 0.36
    }));
  }

  function animateAmbient() {
    if (!ambientCanvas || !ambientContext) return;

    ambientContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ambientParticles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;

      if (particle.y < -5) {
        particle.y = window.innerHeight + 5;
        particle.x = Math.random() * window.innerWidth;
      }

      if (particle.x < -5) particle.x = window.innerWidth + 5;
      if (particle.x > window.innerWidth + 5) particle.x = -5;

      ambientContext.beginPath();
      ambientContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ambientContext.fillStyle = `rgba(242, 215, 145, ${particle.alpha})`;
      ambientContext.fill();
    });

    window.requestAnimationFrame(animateAmbient);
  }

  if (ambientCanvas && ambientContext) {
    resizeAmbientCanvas();
    animateAmbient();
  }

  // Gold Matrix code rain
  const matrixCanvas = document.getElementById("matrixCanvas");
  const matrixContext = matrixCanvas?.getContext("2d");
  let matrixColumns = [];
  let matrixWidth = 0;
  let matrixHeight = 0;
  let matrixFontSize = 16;

  const matrixTokens = [
    "♔", "♕", "♖", "♗", "♘", "♙",
    "ACFA", "e4", "Nf3", "O-O", "c5", "d4", "ELO",
    "0101", "1010", "BOARD", "MOVE", "JOIN", "LIVE"
  ];

  function resizeMatrixCanvas() {
    if (!matrixCanvas || !matrixContext) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    matrixCanvas.width = Math.floor(window.innerWidth * ratio);
    matrixCanvas.height = Math.floor(window.innerHeight * ratio);
    matrixCanvas.style.width = `${window.innerWidth}px`;
    matrixCanvas.style.height = `${window.innerHeight}px`;
    matrixContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    matrixWidth = window.innerWidth;
    matrixHeight = window.innerHeight;
    matrixFontSize = window.innerWidth < 650 ? 18 : 16;

    const count = Math.ceil(matrixWidth / matrixFontSize);
    matrixColumns = Array.from({ length: count }, () => Math.random() * -80);
  }

  function drawMatrix() {
    if (!matrixCanvas || !matrixContext) return;

    matrixContext.fillStyle = "rgba(5,3,2,0.09)";
    matrixContext.fillRect(0, 0, matrixWidth, matrixHeight);
    matrixContext.font = `700 ${matrixFontSize}px ui-monospace, monospace`;

    for (let index = 0; index < matrixColumns.length; index += 1) {
      const token = matrixTokens[Math.floor(Math.random() * matrixTokens.length)];
      const x = index * matrixFontSize;
      const y = matrixColumns[index] * matrixFontSize;
      const bright = Math.random() > 0.965;

      matrixContext.fillStyle = bright
        ? "rgba(255,239,184,.9)"
        : `rgba(215,170,77,${0.18 + Math.random() * 0.34})`;

      matrixContext.fillText(token, x, y);

      if (y > matrixHeight && Math.random() > 0.973) {
        matrixColumns[index] = Math.random() * -20;
      }

      matrixColumns[index] += window.innerWidth < 650 ? 0.34 : 0.48;
    }

    window.requestAnimationFrame(drawMatrix);
  }

  if (matrixCanvas && matrixContext) {
    resizeMatrixCanvas();
    drawMatrix();
  }

  window.addEventListener("resize", () => {
    resizeAmbientCanvas();
    resizeMatrixCanvas();
  });

  // Boot sequence — fail-safe and skippable
  const bootSteps = [
    "Initializing ACFA core...",
    "Loading community database...",
    "Synchronizing activity modules...",
    "Connecting ACFA Network...",
    "Starting gold matrix renderer...",
    "Calibrating scanner systems...",
    "Verifying Lady Justice core...",
    "Rendering public interface...",
    "WELCOME TO ACFA"
  ];

  let bootIndex = 0;
  let bootTimer;
  let bootComplete = false;

  function runCardScans() {
    const cards = [
      ...document.querySelectorAll(".stat-card"),
      ...document.querySelectorAll(".module-card"),
      ...document.querySelectorAll(".command-panel"),
      ...document.querySelectorAll(".activity-feed")
    ];

    cards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.add("scanning");
        window.setTimeout(() => card.classList.remove("scanning"), 1300);
      }, index * 190);
    });
  }

  function runVerification() {
    const rows = [...document.querySelectorAll("[data-verify]")];

    rows.forEach((row, index) => {
      window.setTimeout(() => {
        row.classList.add("active");
        const status = row.querySelector("em");
        if (status) status.textContent = "SCANNING";

        window.setTimeout(() => {
          row.classList.remove("active");
          row.classList.add("verified");
          if (status) status.textContent = "VERIFIED";
        }, 650);
      }, index * 720);
    });
  }

  function finishBoot() {
    if (bootComplete) return;
    bootComplete = true;
    clearTimeout(bootTimer);

    document.body.classList.remove("booting");

    if (bootScreen) {
      bootScreen.classList.add("hidden");
    }

    try {
      sessionStorage.setItem("acfaBootSeen", "true");
    } catch (_) {
      // Session storage is optional.
    }

    window.setTimeout(() => {
      runCardScans();
      runVerification();
    }, 450);
  }

  function runBootStep() {
    if (!bootLog || !bootProgress) {
      finishBoot();
      return;
    }

    if (bootIndex >= bootSteps.length) {
      finishBoot();
      return;
    }

    const line = document.createElement("div");
    line.textContent = bootSteps[bootIndex];

    if (bootIndex === bootSteps.length - 1) {
      line.classList.add("complete");
    }

    bootLog.appendChild(line);
    bootProgress.style.width = `${((bootIndex + 1) / bootSteps.length) * 100}%`;
    bootIndex += 1;

    bootTimer = window.setTimeout(
      runBootStep,
      bootIndex === bootSteps.length ? 650 : 360
    );
  }

  skipBoot?.addEventListener("click", finishBoot);

  let bootSeen = false;
  try {
    bootSeen = sessionStorage.getItem("acfaBootSeen") === "true";
  } catch (_) {
    bootSeen = false;
  }

  if (!bootScreen) {
    document.body.classList.remove("booting");
  } else if (bootSeen) {
    finishBoot();
  } else {
    window.setTimeout(runBootStep, 350);
  }

  // Absolute fail-safe: never leave the public page trapped on loading.
  window.setTimeout(finishBoot, 6500);

  // Konami code — Developer Mode
  const konami = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === konami[konamiIndex]) {
      konamiIndex += 1;

      if (konamiIndex === konami.length) {
        konamiIndex = 0;

        if (developerOverlay) {
          developerOverlay.classList.add("active");
          developerOverlay.setAttribute("aria-hidden", "false");
        }

        document.body.classList.add("matrix-flash");
        window.setTimeout(() => {
          document.body.classList.remove("matrix-flash");
        }, 700);
      }
    } else {
      konamiIndex = 0;
    }
  });

  function closeDeveloperMode() {
    if (!developerOverlay) return;
    developerOverlay.classList.remove("active");
    developerOverlay.setAttribute("aria-hidden", "true");
  }

  closeDeveloper?.addEventListener("click", closeDeveloperMode);

  developerOverlay?.addEventListener("click", (event) => {
    if (event.target === developerOverlay) closeDeveloperMode();
  });

  // Type ACFA anywhere
  let typedBuffer = "";

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLegacyMode();
      closeDeveloperMode();
    }

    if (event.key.length !== 1) return;

    typedBuffer = (typedBuffer + event.key.toLowerCase()).slice(-4);

    if (typedBuffer === "acfa") {
      typedBuffer = "";
      document.body.classList.add("matrix-flash");
      createRain(28);

      window.setTimeout(() => {
        document.body.classList.remove("matrix-flash");
      }, 700);
    }
  });
});
