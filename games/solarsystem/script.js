(() => {
  const STORAGE_KEY = "solar-system-explorer-v2";

  const planets = [
    {
      name: "Mercury",
      type: "Rocky planet",
      orbit: 0.39,
      period: 88,
      radius: 4,
      eccentricity: 0.206,
      phase: 0.35,
      colorA: "#fff1c4",
      colorB: "#b58e58",
      distanceLabel: "0.39 AU",
      yearLabel: "88 days",
      moons: "0",
      temp: "167 C",
      tagline: "A scorched, cratered world that races around the Sun.",
      fact: "Mercury has almost no atmosphere, so its day and night temperatures swing dramatically."
    },
    {
      name: "Venus",
      type: "Rocky planet",
      orbit: 0.72,
      period: 225,
      radius: 7,
      eccentricity: 0.007,
      phase: 2.2,
      colorA: "#ffe3c4",
      colorB: "#df8d4c",
      distanceLabel: "0.72 AU",
      yearLabel: "225 days",
      moons: "0",
      temp: "464 C",
      tagline: "A bright but hostile world wrapped in dense clouds.",
      fact: "Venus is hotter than Mercury because its carbon dioxide atmosphere traps heat in an extreme greenhouse effect."
    },
    {
      name: "Earth",
      type: "Rocky planet",
      orbit: 1,
      period: 365,
      radius: 7.5,
      eccentricity: 0.017,
      phase: 1.4,
      colorA: "#c7f6ff",
      colorB: "#236cb7",
      distanceLabel: "1.00 AU",
      yearLabel: "365 days",
      moons: "1",
      temp: "15 C",
      tagline: "Our ocean world and the baseline for every comparison here.",
      fact: "Earth is the only known planet with long-term stable liquid water on its surface."
    },
    {
      name: "Mars",
      type: "Rocky planet",
      orbit: 1.52,
      period: 687,
      radius: 5.5,
      eccentricity: 0.093,
      phase: 0.8,
      colorA: "#ffd1c1",
      colorB: "#bc4d2b",
      distanceLabel: "1.52 AU",
      yearLabel: "687 days",
      moons: "2",
      temp: "-63 C",
      tagline: "A dusty frontier marked by canyons, volcanoes, and polar ice.",
      fact: "Olympus Mons on Mars is the tallest known volcano in the solar system."
    },
    {
      name: "Jupiter",
      type: "Gas giant",
      orbit: 5.2,
      period: 4333,
      radius: 16,
      eccentricity: 0.049,
      phase: 1.15,
      colorA: "#fff0d1",
      colorB: "#c58243",
      distanceLabel: "5.20 AU",
      yearLabel: "11.9 years",
      moons: "95",
      temp: "-110 C",
      tagline: "The giant of giants, banded by storms and deep atmosphere.",
      fact: "Jupiter's Great Red Spot is a storm that has lasted for centuries."
    },
    {
      name: "Saturn",
      type: "Gas giant",
      orbit: 9.58,
      period: 10759,
      radius: 14,
      eccentricity: 0.057,
      phase: 4.6,
      colorA: "#fff5cc",
      colorB: "#d9b15e",
      distanceLabel: "9.58 AU",
      yearLabel: "29.5 years",
      moons: "146",
      temp: "-140 C",
      tagline: "A pale giant wrapped by the most iconic ring system.",
      fact: "Saturn is less dense than water, so it would float in a large enough ocean."
    },
    {
      name: "Uranus",
      type: "Ice giant",
      orbit: 19.2,
      period: 30687,
      radius: 11,
      eccentricity: 0.046,
      phase: 5.65,
      colorA: "#d5ffff",
      colorB: "#5ec5c8",
      distanceLabel: "19.2 AU",
      yearLabel: "84 years",
      moons: "27",
      temp: "-195 C",
      tagline: "An ice giant tipped sideways with a strange rotation.",
      fact: "Uranus rotates almost on its side, likely because of a massive ancient collision."
    },
    {
      name: "Neptune",
      type: "Ice giant",
      orbit: 30.05,
      period: 60190,
      radius: 10.5,
      eccentricity: 0.011,
      phase: 3.5,
      colorA: "#c8ecff",
      colorB: "#2a63cc",
      distanceLabel: "30.05 AU",
      yearLabel: "165 years",
      moons: "14",
      temp: "-200 C",
      tagline: "The deep-blue edge of the major planets and a world of violent winds.",
      fact: "Neptune hosts some of the fastest winds ever recorded in the solar system."
    }
  ];

  const missionDeck = [
    {
      title: "Find the red planet.",
      body: "Click the dusty world famous for giant volcanoes and future crewed mission dreams.",
      answer: "Mars",
      hint: "It sits just beyond Earth."
    },
    {
      title: "Locate the hottest planet.",
      body: "Select the world where thick clouds trap heat so effectively that it outbakes Mercury.",
      answer: "Venus",
      hint: "The brightest evening star is not really a star."
    },
    {
      title: "Pick the fastest orbit.",
      body: "Which planet loops around the Sun in only 88 Earth days?",
      answer: "Mercury",
      hint: "It hugs the Sun closest."
    },
    {
      title: "Choose the ring icon.",
      body: "Select the gas giant with the most recognizable ring system in astronomy.",
      answer: "Saturn",
      hint: "Its rings are broad, bright, and impossible to miss."
    },
    {
      title: "Find the largest world.",
      body: "Click the planet that dominates the solar system by mass and size.",
      answer: "Jupiter",
      hint: "It owns the Great Red Spot."
    },
    {
      title: "Track the deep-blue frontier.",
      body: "Select the far major planet known for extreme winds and an intense blue tone.",
      answer: "Neptune",
      hint: "It lies beyond Uranus."
    }
  ];

  const ui = {
    canvas: document.getElementById("universe"),
    scoreValue: document.getElementById("scoreValue"),
    streakValue: document.getElementById("streakValue"),
    discoveredValue: document.getElementById("discoveredValue"),
    highScoreValue: document.getElementById("highScoreValue"),
    togglePlayBtn: document.getElementById("togglePlayBtn"),
    followBtn: document.getElementById("followBtn"),
    resetViewBtn: document.getElementById("resetViewBtn"),
    newRunBtn: document.getElementById("newRunBtn"),
    helpBtn: document.getElementById("helpBtn"),
    missionStatus: document.getElementById("missionStatus"),
    missionTitle: document.getElementById("missionTitle"),
    missionBody: document.getElementById("missionBody"),
    missionProgress: document.getElementById("missionProgress"),
    missionStep: document.getElementById("missionStep"),
    hintText: document.getElementById("hintText"),
    skipMissionBtn: document.getElementById("skipMissionBtn"),
    focusMissionBtn: document.getElementById("focusMissionBtn"),
    speedRange: document.getElementById("speedRange"),
    speedValue: document.getElementById("speedValue"),
    zoomRange: document.getElementById("zoomRange"),
    zoomValue: document.getElementById("zoomValue"),
    toggleOrbitsBtn: document.getElementById("toggleOrbitsBtn"),
    toggleLabelsBtn: document.getElementById("toggleLabelsBtn"),
    dayValue: document.getElementById("dayValue"),
    selectedName: document.getElementById("selectedName"),
    selectedType: document.getElementById("selectedType"),
    planetPreview: document.getElementById("planetPreview"),
    planetName: document.getElementById("planetName"),
    planetTagline: document.getElementById("planetTagline"),
    planetDistance: document.getElementById("planetDistance"),
    planetYear: document.getElementById("planetYear"),
    planetMoons: document.getElementById("planetMoons"),
    planetTemp: document.getElementById("planetTemp"),
    planetFact: document.getElementById("planetFact"),
    planetList: document.getElementById("planetList"),
    searchInput: document.getElementById("searchInput"),
    toast: document.getElementById("toast"),
    helpModal: document.getElementById("helpModal"),
    closeHelpBtn: document.getElementById("closeHelpBtn")
  };

  const ctx = ui.canvas.getContext("2d");
  const camera = { x: 0, y: 0, targetX: 0, targetY: 0, zoom: 1 };
  const pointer = {
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  };

  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let orbitalScale = 0;
  let stars = [];
  let renderTargets = [];
  let animationFrame = 0;
  let lastTime = 0;
  let toastTimer = 0;
  let missionAdvanceTimer = 0;

  const state = {
    timeDays: 0,
    speed: 12,
    paused: false,
    showOrbits: true,
    showLabels: true,
    missionLocked: false,
    selectedPlanet: planets[2],
    followedPlanet: null,
    score: 0,
    streak: 0,
    highScore: 0,
    discovered: new Set(),
    missionOrder: shuffle([...missionDeck]),
    missionIndex: 0,
    searchTerm: ""
  };

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function showToast(message, tone = "info") {
    window.clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.style.borderColor = tone === "bad" ? "rgba(255, 134, 119, 0.36)" : "rgba(126, 248, 215, 0.32)";
    ui.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      ui.toast.classList.remove("is-visible");
    }, 2200);
  }

  function saveProgress() {
    const payload = {
      highScore: state.highScore,
      discovered: [...state.discovered]
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      state.highScore = Number(parsed.highScore) || 0;
      state.discovered = new Set(Array.isArray(parsed.discovered) ? parsed.discovered : []);
    } catch (error) {
      state.highScore = 0;
      state.discovered = new Set();
    }
  }

  function resetMissionRun() {
    window.clearTimeout(missionAdvanceTimer);
    state.score = 0;
    state.streak = 0;
    state.timeDays = 0;
    state.paused = false;
    state.missionLocked = false;
    state.missionOrder = shuffle([...missionDeck]);
    state.missionIndex = 0;
    state.followedPlanet = null;
    state.selectedPlanet = planets[2];
    syncPlayButton();
    showToast("New mission run started.");
  }

  function getCurrentMission() {
    return state.missionOrder[state.missionIndex] || null;
  }

  function getPlanetPosition(planet) {
    const angle = planet.phase + (state.timeDays / planet.period) * Math.PI * 2;
    const squash = 0.82 - planet.eccentricity * 0.4;
    return {
      x: Math.cos(angle) * planet.orbit,
      y: Math.sin(angle) * planet.orbit * squash
    };
  }

  function worldToScreen(position) {
    return {
      x: centerX + (position.x - camera.x) * orbitalScale * camera.zoom,
      y: centerY + (position.y - camera.y) * orbitalScale * camera.zoom
    };
  }

  function screenToWorld(point) {
    return {
      x: (point.x - centerX) / (orbitalScale * camera.zoom) + camera.x,
      y: (point.y - centerY) / (orbitalScale * camera.zoom) + camera.y
    };
  }

  function buildStars() {
    stars = Array.from({ length: Math.max(120, Math.floor((width * height) / 9000)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.65 + 0.2,
      drift: Math.random() * 0.02 + 0.01
    }));
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2 + 28;
    orbitalScale = Math.min(width, height) * 0.018;

    ui.canvas.width = Math.round(width * dpr);
    ui.canvas.height = Math.round(height * dpr);
    ui.canvas.style.width = `${width}px`;
    ui.canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildStars();
  }

  function updateMissionUI() {
    const mission = getCurrentMission();
    const progress = mission ? ((state.missionIndex + 1) / state.missionOrder.length) * 100 : 100;

    if (!mission) {
      ui.missionStatus.textContent = "Complete";
      ui.missionTitle.textContent = "Run complete.";
      ui.missionBody.textContent = "You cleared the full mission deck. Start a new run or keep exploring.";
      ui.hintText.textContent = "All major worlds have been surveyed for this round.";
      ui.missionStep.textContent = `${state.missionOrder.length}/${state.missionOrder.length}`;
      ui.missionProgress.style.width = "100%";
      return;
    }

    ui.missionStatus.textContent = state.paused ? "Paused" : "Live";
    ui.missionTitle.textContent = mission.title;
    ui.missionBody.textContent = mission.body;
    ui.hintText.textContent = `Hint: ${mission.hint}`;
    ui.missionStep.textContent = `${state.missionIndex + 1}/${state.missionOrder.length}`;
    ui.missionProgress.style.width = `${progress}%`;
  }

  function updateSelectionUI() {
    const planet = state.selectedPlanet;
    ui.selectedName.textContent = planet.name;
    ui.selectedType.textContent = planet.type;
    ui.planetName.textContent = planet.name;
    ui.planetTagline.textContent = planet.tagline;
    ui.planetDistance.textContent = planet.distanceLabel;
    ui.planetYear.textContent = planet.yearLabel;
    ui.planetMoons.textContent = planet.moons;
    ui.planetTemp.textContent = planet.temp;
    ui.planetFact.textContent = planet.fact;
    ui.planetPreview.style.background = `radial-gradient(circle at 35% 35%, ${planet.colorA}, ${planet.colorB} 70%, #0a1020 100%)`;
    ui.planetPreview.style.boxShadow = `0 0 30px ${planet.colorB}66`;
  }

  function updateStatsUI() {
    ui.scoreValue.textContent = String(state.score);
    ui.streakValue.textContent = String(state.streak);
    ui.discoveredValue.textContent = `${state.discovered.size}/${planets.length}`;
    ui.highScoreValue.textContent = String(state.highScore);
    ui.dayValue.textContent = `Day ${Math.floor(state.timeDays).toLocaleString()}`;
  }

  function updateControlUI() {
    ui.speedRange.value = String(state.speed);
    ui.speedValue.textContent = `${state.speed}x`;
    ui.zoomValue.textContent = `${Math.round(camera.zoom * 100)}%`;
    ui.zoomRange.value = String(Math.round(camera.zoom * 100));
    ui.toggleOrbitsBtn.classList.toggle("is-active", state.showOrbits);
    ui.toggleOrbitsBtn.querySelector("strong").textContent = state.showOrbits ? "On" : "Off";
    ui.toggleLabelsBtn.classList.toggle("is-active", state.showLabels);
    ui.toggleLabelsBtn.querySelector("strong").textContent = state.showLabels ? "On" : "Off";
    ui.followBtn.classList.toggle("is-active", Boolean(state.followedPlanet));
    ui.followBtn.textContent = state.followedPlanet ? `Following ${state.followedPlanet.name}` : "Follow";
  }

  function renderPlanetList() {
    const term = state.searchTerm.trim().toLowerCase();
    const matches = planets.filter((planet) => planet.name.toLowerCase().includes(term));

    ui.planetList.innerHTML = "";

    matches.forEach((planet) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "planet-item";
      if (state.selectedPlanet.name === planet.name) {
        item.classList.add("is-selected");
      }

      item.innerHTML = `
        <span class="planet-dot" style="background: linear-gradient(135deg, ${planet.colorA}, ${planet.colorB}); box-shadow: 0 0 14px ${planet.colorB}66;"></span>
        <span class="planet-copy">
          <strong>${planet.name}</strong>
          <span class="planet-tag">${planet.type}</span>
        </span>
        <span class="planet-badge ${state.discovered.has(planet.name) ? "is-done" : ""}">
          ${state.discovered.has(planet.name) ? "Surveyed" : "Unseen"}
        </span>
      `;

      item.addEventListener("click", () => handlePlanetSelection(planet, "roster"));
      ui.planetList.appendChild(item);
    });
  }

  function syncPlayButton() {
    ui.togglePlayBtn.textContent = state.paused ? "Play" : "Pause";
    ui.togglePlayBtn.classList.toggle("is-active", !state.paused);
  }

  function syncAllUI() {
    updateMissionUI();
    updateSelectionUI();
    updateStatsUI();
    updateControlUI();
    renderPlanetList();
  }

  function focusOnPlanet(planet, shouldFollow) {
    const position = getPlanetPosition(planet);
    camera.targetX = position.x;
    camera.targetY = position.y;

    if (shouldFollow) {
      state.followedPlanet = planet;
    }

    updateControlUI();
  }

  function advanceMission() {
    missionAdvanceTimer = 0;
    state.missionLocked = false;
    state.missionIndex += 1;

    if (state.missionIndex >= state.missionOrder.length) {
      showToast("Mission deck cleared. Explorer rank secured.");
    }

    syncAllUI();
  }

  function registerCorrectAnswer(planet) {
    if (state.missionLocked) {
      return;
    }

    state.missionLocked = true;
    const bonus = 120 + state.streak * 30;
    state.score += bonus;
    state.streak += 1;
    state.discovered.add(planet.name);
    state.highScore = Math.max(state.highScore, state.score);
    saveProgress();
    syncAllUI();
    showToast(`${planet.name} confirmed. +${bonus} points`, "good");

    window.clearTimeout(missionAdvanceTimer);
    missionAdvanceTimer = window.setTimeout(advanceMission, 900);
  }

  function registerWrongAnswer(planet) {
    state.streak = 0;
    syncAllUI();
    showToast(`${planet.name} is not the target.`, "bad");
  }

  function handlePlanetSelection(planet, origin = "canvas") {
    state.selectedPlanet = planet;
    updateSelectionUI();
    updateStatsUI();
    renderPlanetList();

    if (origin === "canvas") {
      showToast(`${planet.name} selected.`);
    }

    const mission = getCurrentMission();
    if (!mission || state.missionLocked) {
      return;
    }

    if (planet.name === mission.answer) {
      registerCorrectAnswer(planet);
    } else {
      registerWrongAnswer(planet);
    }
  }

  function drawBackground(time) {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(width, height) * 0.8);
    gradient.addColorStop(0, "rgba(12, 24, 50, 0.2)");
    gradient.addColorStop(1, "rgba(1, 3, 10, 0.92)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star, index) => {
      const pulse = 0.35 + Math.sin(time * star.drift + index) * 0.25;
      ctx.fillStyle = `rgba(214, 236, 255, ${star.alpha + pulse * 0.18})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(73, 136, 230, 0.06)";
    ctx.beginPath();
    ctx.ellipse(width * 0.23, height * 0.18, width * 0.18, height * 0.08, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(33, 217, 173, 0.04)";
    ctx.beginPath();
    ctx.ellipse(width * 0.77, height * 0.72, width * 0.2, height * 0.1, 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSun() {
    const screen = worldToScreen({ x: 0, y: 0 });
    const glow = ctx.createRadialGradient(screen.x, screen.y, 0, screen.x, screen.y, 70 * camera.zoom + 50);
    glow.addColorStop(0, "rgba(255, 245, 180, 0.95)");
    glow.addColorStop(0.28, "rgba(255, 191, 87, 0.82)");
    glow.addColorStop(1, "rgba(255, 130, 35, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 90 * camera.zoom + 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffb74d";
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, clamp(18 * camera.zoom, 14, 34), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOrbit(planet) {
    if (!state.showOrbits) {
      return;
    }

    ctx.strokeStyle = "rgba(143, 172, 220, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(
      centerX + (0 - camera.x) * orbitalScale * camera.zoom,
      centerY + (0 - camera.y) * orbitalScale * camera.zoom,
      planet.orbit * orbitalScale * camera.zoom,
      planet.orbit * orbitalScale * camera.zoom * (0.82 - planet.eccentricity * 0.4),
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  function drawPlanet(planet, time) {
    const world = getPlanetPosition(planet);
    const screen = worldToScreen(world);
    const radius = clamp(planet.radius * (0.65 + camera.zoom * 0.24), 4, planet.radius * 1.7);
    const pulse = state.selectedPlanet.name === planet.name ? 1 + Math.sin(time * 0.004) * 0.05 : 1;
    const gradient = ctx.createRadialGradient(
      screen.x - radius * 0.32,
      screen.y - radius * 0.32,
      radius * 0.15,
      screen.x,
      screen.y,
      radius * 1.3
    );

    gradient.addColorStop(0, planet.colorA);
    gradient.addColorStop(1, planet.colorB);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    if (planet.name === "Saturn") {
      ctx.strokeStyle = "rgba(246, 225, 177, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(screen.x, screen.y, radius * 1.9, radius * 0.8, 0.25, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (state.selectedPlanet.name === planet.name) {
      ctx.strokeStyle = "rgba(126, 248, 215, 0.92)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (state.followedPlanet && state.followedPlanet.name === planet.name) {
      ctx.strokeStyle = "rgba(111, 208, 255, 0.85)";
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const shouldShowLabel = state.selectedPlanet.name === planet.name || (
      state.showLabels && (camera.zoom > 1.2 || planet.orbit >= 5)
    );

    if (shouldShowLabel) {
      const sunScreen = worldToScreen({ x: 0, y: 0 });
      const labelVectorX = screen.x - sunScreen.x;
      const labelVectorY = screen.y - sunScreen.y;
      const labelLength = Math.hypot(labelVectorX, labelVectorY) || 1;
      const offsetX = (labelVectorX / labelLength) * (radius + 14);
      const offsetY = (labelVectorY / labelLength) * (radius + 10);

      ctx.fillStyle = "rgba(237, 246, 255, 0.95)";
      ctx.font = "12px Trebuchet MS";
      ctx.textAlign = offsetX >= 0 ? "left" : "right";
      ctx.fillText(planet.name, screen.x + offsetX, screen.y + offsetY);
    }

    renderTargets.push({
      planet,
      x: screen.x,
      y: screen.y,
      radius: Math.max(radius + 8, 14)
    });
  }

  function updateCamera() {
    if (state.followedPlanet) {
      const world = getPlanetPosition(state.followedPlanet);
      camera.targetX = world.x;
      camera.targetY = world.y;
    }

    camera.x = lerp(camera.x, camera.targetX, 0.08);
    camera.y = lerp(camera.y, camera.targetY, 0.08);
  }

  function renderFrame(time) {
    drawBackground(time);
    updateCamera();
    drawSun();

    renderTargets = [];

    planets.forEach((planet) => drawOrbit(planet));
    planets.forEach((planet) => drawPlanet(planet, time));
  }

  function tick(time) {
    const deltaSeconds = clamp((time - lastTime) / 1000 || 0, 0, 0.04);
    lastTime = time;

    if (!state.paused) {
      state.timeDays += deltaSeconds * state.speed * 14;
      ui.dayValue.textContent = `Day ${Math.floor(state.timeDays).toLocaleString()}`;
    }

    renderFrame(time);
    animationFrame = window.requestAnimationFrame(tick);
  }

  function findPlanetAtPoint(point) {
    for (let index = renderTargets.length - 1; index >= 0; index -= 1) {
      const target = renderTargets[index];
      const distance = Math.hypot(point.x - target.x, point.y - target.y);

      if (distance <= target.radius) {
        return target.planet;
      }
    }

    return null;
  }

  function onPointerDown(event) {
    pointer.active = true;
    pointer.moved = false;
    pointer.startX = event.clientX;
    pointer.startY = event.clientY;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    ui.canvas.classList.add("is-dragging");
  }

  function onPointerMove(event) {
    if (!pointer.active) {
      return;
    }

    const dx = event.clientX - pointer.lastX;
    const dy = event.clientY - pointer.lastY;
    const travel = Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY);

    if (travel > 3) {
      pointer.moved = true;
    }

    if (pointer.moved) {
      state.followedPlanet = null;
      camera.targetX -= dx / (orbitalScale * camera.zoom);
      camera.targetY -= dy / (orbitalScale * camera.zoom);
      updateControlUI();
    }

    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
  }

  function onPointerUp(event) {
    ui.canvas.classList.remove("is-dragging");

    if (!pointer.active) {
      return;
    }

    const point = { x: event.clientX, y: event.clientY };
    if (!pointer.moved) {
      const planet = findPlanetAtPoint(point);
      if (planet) {
        handlePlanetSelection(planet);
      }
    }

    pointer.active = false;
  }

  function onWheel(event) {
    event.preventDefault();
    const nextZoom = clamp(camera.zoom * (event.deltaY > 0 ? 0.92 : 1.08), 0.55, 2.2);
    camera.zoom = nextZoom;
    ui.zoomRange.value = String(Math.round(camera.zoom * 100));
    updateControlUI();
  }

  function onCanvasDoubleClick(event) {
    const planet = findPlanetAtPoint({ x: event.clientX, y: event.clientY });
    if (!planet) {
      return;
    }

    state.selectedPlanet = planet;
    focusOnPlanet(planet, true);
    updateSelectionUI();
    renderPlanetList();
    showToast(`Camera locked to ${planet.name}.`);
  }

  function setupEvents() {
    ui.togglePlayBtn.addEventListener("click", () => {
      state.paused = !state.paused;
      syncPlayButton();
      updateMissionUI();
    });

    ui.followBtn.addEventListener("click", () => {
      if (state.followedPlanet) {
        state.followedPlanet = null;
        updateControlUI();
        showToast("Follow mode disabled.");
        return;
      }

      focusOnPlanet(state.selectedPlanet, true);
      showToast(`Following ${state.selectedPlanet.name}.`);
    });

    ui.resetViewBtn.addEventListener("click", () => {
      state.followedPlanet = null;
      camera.targetX = 0;
      camera.targetY = 0;
      camera.zoom = 1;
      syncAllUI();
      showToast("View reset.");
    });

    ui.newRunBtn.addEventListener("click", () => {
      resetMissionRun();
      syncAllUI();
    });

    ui.helpBtn.addEventListener("click", () => {
      ui.helpModal.classList.remove("hidden");
    });

    ui.closeHelpBtn.addEventListener("click", () => {
      ui.helpModal.classList.add("hidden");
    });

    ui.helpModal.addEventListener("click", (event) => {
      if (event.target === ui.helpModal) {
        ui.helpModal.classList.add("hidden");
      }
    });

    ui.skipMissionBtn.addEventListener("click", () => {
      const mission = getCurrentMission();
      if (!mission) {
        return;
      }

      state.streak = 0;
      advanceMission();
      showToast(`Mission skipped. ${mission.answer} was the answer.`);
    });

    ui.focusMissionBtn.addEventListener("click", () => {
      const mission = getCurrentMission();
      if (!mission) {
        return;
      }

      const target = planets.find((planet) => planet.name === mission.answer);
      if (!target) {
        return;
      }

      state.selectedPlanet = target;
      updateSelectionUI();
      renderPlanetList();
      focusOnPlanet(target, false);
      showToast(`Hint locked onto ${target.name}.`);
    });

    ui.speedRange.addEventListener("input", () => {
      state.speed = Number(ui.speedRange.value);
      updateControlUI();
    });

    ui.zoomRange.addEventListener("input", () => {
      camera.zoom = Number(ui.zoomRange.value) / 100;
      updateControlUI();
    });

    ui.toggleOrbitsBtn.addEventListener("click", () => {
      state.showOrbits = !state.showOrbits;
      updateControlUI();
    });

    ui.toggleLabelsBtn.addEventListener("click", () => {
      state.showLabels = !state.showLabels;
      updateControlUI();
    });

    ui.searchInput.addEventListener("input", () => {
      state.searchTerm = ui.searchInput.value;
      renderPlanetList();
    });

    ui.canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    ui.canvas.addEventListener("wheel", onWheel, { passive: false });
    ui.canvas.addEventListener("dblclick", onCanvasDoubleClick);
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
        state.paused = !state.paused;
        syncPlayButton();
        updateMissionUI();
      }

      if (event.key.toLowerCase() === "o") {
        state.showOrbits = !state.showOrbits;
        updateControlUI();
      }

      if (event.key.toLowerCase() === "l") {
        state.showLabels = !state.showLabels;
        updateControlUI();
      }

      if (event.key.toLowerCase() === "r") {
        state.followedPlanet = null;
        camera.targetX = 0;
        camera.targetY = 0;
        camera.zoom = 1;
        syncAllUI();
      }

      if (event.key === "Escape") {
        ui.helpModal.classList.add("hidden");
      }
    });
  }

  function init() {
    loadProgress();
    resizeCanvas();
    setupEvents();
    syncPlayButton();
    syncAllUI();
    updateSelectionUI();
    animationFrame = window.requestAnimationFrame(tick);
  }

  init();

  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
})();
