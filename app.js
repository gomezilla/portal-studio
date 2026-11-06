(() => {
  "use strict";

  const STORE_NAME = "portals";
  const DB_NAME = "portal-studio";
  const IMAGE_PATHS = [
    "res/img/image1.jpg",
    "res/img/image2.jpeg",
    "res/img/image3.jpeg",
    "res/img/image4.jpg",
    "res/img/image5.jpeg"
  ];
  const MAX_GALLERY_IMAGES = 20;
  const DEFAULTS = {
    portalName: "Prepaid Wi-Fi Access",
    headline: "Get connected.",
    subheading: "Your connection, ready when you are.",
    captionEyebrow: "YOUR LOCAL CONNECTION",
    captionTitle: "Wi-Fi made simple",
    speedEyebrow: "NETWORK CHECK",
    speedTitle: "Internet speed",
    speedLiveLabel: "LIVE TEST",
    uploadLabel: "Upload",
    downloadLabel: "Download",
    speedDisclaimer: "One test uses about 3 MB; ISP lookup uses your public IP.",
    ispLabel: "ISP",
    buttonLabel: "Connect to Wi-Fi",
    footer: "Secure access · Simple prepaid plans",
    note: "Hourly plans pause automatically when you disconnect.",
    plansTitle: "Plans & pricing",
    priceHeading: "Price",
    durationHeading: "Duration",
    guideTitle: "How to connect",
    guideSecondaryLabel: "(Paano kumonekta)",
    guideStep1: "1. Open Wi-Fi settings and connect to Prepaid Hotspot or Prepaid Hotspot_2.4G.",
    guideStep2: "2. Select Voucher Access.",
    guideStep3: "3. Enter your voucher code and tap Connect to Wi-Fi.",
    showSpeedtest: true,
    showPlans: true,
    showGuide: true,
    preset: "material",
    accentColor: "#6750a4",
    themeMode: "system",
    cornerStyle: "soft",
    plans: [
      { price: "₱5", duration: "2 hours" },
      { price: "₱10", duration: "5 hours" },
      { price: "₱20", duration: "1 day" },
      { price: "₱55", duration: "3 days" },
      { price: "₱105", duration: "7 days" }
    ]
  };
  const PRESETS = [
    { id: "material", name: "Material You", light: ["#f3f1fa", "#ffffff", "#f7f5fb", "#eeeaf7", "#262335", "#777386", "#e7e2ef"], dark: ["#171521", "#211e2c", "#272331", "#302b3d", "#f3efff", "#ada7bc", "#3b3548"], accent: "#6750a4", hover: "#55408e", mode: "system", corners: "soft" },
    { id: "facebook", name: "Facebook", light: ["#f0f2f5", "#ffffff", "#f7f8fa", "#e4e6eb", "#1c1e21", "#65676b", "#dadde1"], dark: ["#18191a", "#242526", "#3a3b3c", "#3a3b3c", "#e4e6eb", "#b0b3b8", "#4e4f50"], accent: "#0866ff", hover: "#0756d1", mode: "light", corners: "rounded" },
    { id: "gaming", name: "Gaming / Neon", light: ["#11111b", "#191925", "#20202e", "#29283a", "#f5f3ff", "#aaa7c3", "#38364c"], dark: ["#11111b", "#191925", "#20202e", "#29283a", "#f5f3ff", "#aaa7c3", "#38364c"], accent: "#8055ff", hover: "#6740de", mode: "dark", corners: "sharp" },
    { id: "ocean", name: "Ocean", light: ["#eff6fa", "#ffffff", "#f5f9fb", "#e8f2f7", "#1a2c39", "#687d89", "#dce8ee"], dark: ["#101b25", "#172734", "#1d303d", "#243a48", "#e7f5fc", "#a2b7c2", "#2e4655"], accent: "#087e9d", hover: "#066983", mode: "system", corners: "soft" },
    { id: "sunset", name: "Sunset", light: ["#fbf3ef", "#ffffff", "#fff8f4", "#f7e9e1", "#352a2a", "#897978", "#efdfd6"], dark: ["#211a1b", "#2d2324", "#362a2b", "#443536", "#f8ecea", "#b9a6a4", "#4c3b3d"], accent: "#c75d4c", hover: "#a94b3d", mode: "system", corners: "soft" },
    { id: "forest", name: "Forest", light: ["#f0f5f0", "#ffffff", "#f6f9f5", "#e8f0e7", "#243127", "#728174", "#dce6da"], dark: ["#151d18", "#1d2921", "#243128", "#2e3b32", "#eaf3ea", "#aab9ac", "#37483c"], accent: "#347953", hover: "#286441", mode: "system", corners: "soft" },
    { id: "midnight", name: "Midnight", light: ["#eff1f8", "#ffffff", "#f5f6fb", "#e9ebf5", "#20243a", "#73798f", "#dfe2ed"], dark: ["#111521", "#191f2e", "#202738", "#293147", "#eff2ff", "#a7aec3", "#323b52"], accent: "#5369cf", hover: "#4357b6", mode: "dark", corners: "sharp" },
    { id: "rose", name: "Rose", light: ["#f8f1f5", "#ffffff", "#fbf6f9", "#f2e7ee", "#332631", "#887984", "#ebdfe7"], dark: ["#201920", "#2b202b", "#342835", "#433443", "#f6edf4", "#bbaab9", "#493948"], accent: "#a34d78", hover: "#863c62", mode: "system", corners: "rounded" }
  ];
  const database = openDatabase();
  let templateHtml = "";
  let currentProject = null;
  let projects = [];
  let dirty = false;
  let saveTimer = 0;
  let toastTimer = 0;
  let previewDark = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const dashboardView = $("#dashboard-view");
  const editorView = $("#editor-view");
  const toast = $("#toast");
  const saveIndicator = $("#save-indicator");
  const previewFrame = $("#portal-preview");

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open browser storage."));
    });
  }

  function storeRequest(mode, action, value) {
    return database.then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const request = action === "all" ? transaction.objectStore(STORE_NAME).getAll() :
        action === "delete" ? transaction.objectStore(STORE_NAME).delete(value) :
          transaction.objectStore(STORE_NAME).put(value);
      let result;
      request.onsuccess = () => { result = request.result; };
      request.onerror = () => reject(request.error || new Error("Browser storage request failed."));
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error || new Error("Could not write to browser storage."));
      transaction.onabort = () => reject(transaction.error || new Error("Browser storage transaction was aborted."));
    }));
  }

  function freshProject() {
    const now = new Date().toISOString();
    return {
      id: makeId(),
      name: "Untitled Wi-Fi Portal",
      createdAt: now,
      updatedAt: now,
      settings: JSON.parse(JSON.stringify(DEFAULTS)),
      images: IMAGE_PATHS.map(path => ({ src: path, name: path.split("/").pop() }))
    };
  }

  function makeId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3000);
  }

  function setDirty(isDirty) {
    dirty = isDirty;
    saveIndicator.classList.toggle("unsaved", isDirty);
    saveIndicator.lastChild.textContent = isDirty ? " Unsaved changes" : " All changes saved";
    if (isDirty) {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => saveCurrentProject(true), 800);
    }
  }

  async function saveCurrentProject(silent = false) {
    if (!currentProject) return;
    window.clearTimeout(saveTimer);
    currentProject.name = ($("#project-name").value.trim() || "Untitled Wi-Fi Portal").slice(0, 70);
    currentProject.updatedAt = new Date().toISOString();
    try {
      await storeRequest("readwrite", "put", currentProject);
      dirty = false;
      saveIndicator.classList.remove("unsaved");
      saveIndicator.lastChild.textContent = " All changes saved";
      renderDashboard();
      if (!silent) showToast("Draft saved on this device.");
    } catch (error) {
      dirty = true;
      saveIndicator.classList.add("unsaved");
      saveIndicator.lastChild.textContent = " Save failed";
      showToast(`Could not save this draft: ${error.message}`, true);
    }
  }

  function scheduleSave() {
    if (!currentProject) return;
    setDirty(true);
  }

  function renderDashboard() {
    const list = $("#portal-list");
    list.replaceChildren();
    $("#portal-count").textContent = `${projects.length} ${projects.length === 1 ? "draft" : "drafts"}`;
    $("#empty-state").hidden = projects.length > 0;
    list.hidden = projects.length === 0;
    [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).forEach(project => {
      const card = document.createElement("article");
      card.className = "portal-card";
      const color = isHexColor(project.settings.accentColor) ? project.settings.accentColor : "#6750a4";
      card.innerHTML = `<div class="card-preview" style="--card-color:${color}"><span class="card-pill"></span><span class="card-lines"></span></div>
        <div class="card-content"><div class="card-title-row"><h3></h3><span class="card-status">DRAFT</span></div>
        <p class="card-subtitle"></p><div class="card-bottom"><span class="card-date"></span>
        <div class="card-actions"><button class="icon-button" data-action="duplicate" aria-label="Duplicate portal" title="Duplicate">⧉</button>
        <button class="icon-button" data-action="edit" aria-label="Edit portal" title="Edit">↗</button>
        <button class="icon-button" data-action="delete" aria-label="Delete portal" title="Delete">×</button></div></div></div>`;
      card.querySelector("h3").textContent = project.name || "Untitled Wi-Fi Portal";
      card.querySelector(".card-subtitle").textContent = project.settings.headline || "No headline";
      card.querySelector(".card-date").textContent = `Edited ${formatDate(project.updatedAt)}`;
      card.dataset.projectId = project.id;
      card.querySelector(".card-preview").addEventListener("click", () => openProject(project.id));
      card.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", event => {
        event.stopPropagation();
        if (button.dataset.action === "edit") openProject(project.id);
        if (button.dataset.action === "duplicate") duplicateProject(project);
        if (button.dataset.action === "delete") deleteProject(project);
      }));
      card.querySelector(".card-content").addEventListener("dblclick", () => openProject(project.id));
      list.append(card);
    });
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "recently";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }

  function normalizeProject(project) {
    const defaultSettings = JSON.parse(JSON.stringify(DEFAULTS));
    const settings = { ...defaultSettings, ...(project.settings || {}) };
    settings.plans = Array.isArray(project.settings?.plans) ? project.settings.plans : defaultSettings.plans;
    const images = Array.isArray(project.images)
      ? project.images.filter(image => image && typeof image.src === "string").slice(0, MAX_GALLERY_IMAGES)
      : IMAGE_PATHS.map(path => ({ src: path, name: path.split("/").pop() }));
    return {
      ...project,
      id: project.id || makeId(),
      name: project.name || "Untitled Wi-Fi Portal",
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: project.updatedAt || new Date().toISOString(),
      settings,
      images
    };
  }

  async function createProject() {
    currentProject = freshProject();
    try {
      await storeRequest("readwrite", "put", currentProject);
      projects.push(currentProject);
      openEditor();
      showToast("New portal created from the Omada template.");
    } catch (error) {
      currentProject = null;
      showToast(`Could not create a draft: ${error.message}`, true);
    }
  }

  async function duplicateProject(project) {
    const duplicate = JSON.parse(JSON.stringify(project));
    duplicate.id = makeId();
    duplicate.name = `${project.name || "Wi-Fi Portal"} copy`.slice(0, 70);
    duplicate.createdAt = new Date().toISOString();
    duplicate.updatedAt = duplicate.createdAt;
    try {
      await storeRequest("readwrite", "put", duplicate);
      projects.push(duplicate);
      renderDashboard();
      showToast("Portal duplicated.");
    } catch (error) {
      showToast(`Could not duplicate this portal: ${error.message}`, true);
    }
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.name || "Untitled Wi-Fi Portal"}"? This cannot be undone.`)) return;
    try {
      await storeRequest("readwrite", "delete", project.id);
      projects = projects.filter(item => item.id !== project.id);
      renderDashboard();
      showToast("Portal deleted.");
    } catch (error) {
      showToast(`Could not delete this portal: ${error.message}`, true);
    }
  }

  function openProject(id) {
    currentProject = projects.find(project => project.id === id);
    if (!currentProject) return;
    openEditor();
  }

  function openEditor() {
    dashboardView.hidden = true;
    editorView.hidden = false;
    $("#dashboard-button").hidden = false;
    $("#top-save-button").hidden = false;
    $("#project-name").value = currentProject.name;
    renderFields();
    syncAccent();
    renderPlanRows();
    renderImageSlots();
    renderPresets();
    previewDark = false;
    setPreviewThemeButton();
    setDirty(false);
    updatePreview();
    window.scrollTo(0, 0);
  }

  function showDashboard() {
    if (dirty) saveCurrentProject(true);
    editorView.hidden = true;
    dashboardView.hidden = false;
    $("#top-save-button").hidden = true;
    $("#dashboard-button").hidden = true;
    renderDashboard();
  }

  function renderFields() {
    const settings = currentProject.settings;
    $$("[data-field]").forEach(input => {
      const value = settings[input.dataset.field];
      if (input.type === "checkbox") input.checked = Boolean(value);
      else if (input.type === "color") input.value = isHexColor(value) ? value : DEFAULTS.accentColor;
      else input.value = value ?? "";
    });
    $("#accent-hex").textContent = settings.accentColor.toUpperCase();
  }

  function renderPlanRows() {
    const list = $("#plan-rows");
    list.replaceChildren();
    currentProject.settings.plans.forEach((plan, index) => {
      const row = document.createElement("div");
      row.className = "plan-row";
      const price = document.createElement("input");
      price.value = plan.price;
      price.maxLength = 30;
      price.setAttribute("aria-label", `Plan ${index + 1} price`);
      price.placeholder = "Price";
      const duration = document.createElement("input");
      duration.value = plan.duration;
      duration.maxLength = 30;
      duration.setAttribute("aria-label", `Plan ${index + 1} duration`);
      duration.placeholder = "Duration";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.title = "Remove plan";
      remove.setAttribute("aria-label", `Remove plan ${index + 1}`);
      [price, duration].forEach(input => input.addEventListener("input", () => {
        currentProject.settings.plans[index] = { price: price.value, duration: duration.value };
        scheduleSave();
        updatePreview();
      }));
      remove.addEventListener("click", () => {
        currentProject.settings.plans.splice(index, 1);
        renderPlanRows();
        scheduleSave();
        updatePreview();
      });
      row.append(price, duration, remove);
      list.append(row);
    });
  }

  function renderImageSlots() {
    const list = $("#image-slots");
    list.replaceChildren();
    $("#gallery-count").textContent = `${currentProject.images.length} of ${MAX_GALLERY_IMAGES} images`;
    $("#add-gallery-image-button").disabled = currentProject.images.length >= MAX_GALLERY_IMAGES;
    currentProject.images.forEach((image, index) => {
      const row = document.createElement("div");
      row.className = "image-slot";
      const thumbnail = document.createElement("img");
      thumbnail.className = "image-thumb";
      thumbnail.alt = "";
      thumbnail.src = image ? image.src.startsWith("data:") ? image.src : `template/${image.src}` : "";
      const info = document.createElement("div");
      info.className = "image-slot-info";
      const title = document.createElement("strong");
      title.textContent = `Gallery image ${index + 1}`;
      const filename = document.createElement("span");
      filename.textContent = image ? image.name : "No image · hidden from gallery";
      const actions = document.createElement("div");
      actions.className = "image-buttons";
      const upload = document.createElement("button");
      upload.type = "button";
      upload.className = "image-action";
      upload.textContent = "Replace image";
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/gif,image/webp";
      input.hidden = true;
      upload.addEventListener("click", () => input.click());
      input.addEventListener("change", () => handleImageFile(input, index));
      actions.append(upload);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "image-action remove";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove gallery image ${index + 1}`);
      remove.addEventListener("click", () => {
        currentProject.images.splice(index, 1);
        renderImageSlots();
        scheduleSave();
        updatePreview();
        showToast("Gallery image removed.");
      });
      actions.append(remove);
      info.append(title, filename, actions, input);
      row.append(thumbnail, info);
      list.append(row);
    });
  }

  function handleImageFile(input, index) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (index === null && currentProject.images.length >= MAX_GALLERY_IMAGES) {
      showToast(`A gallery can contain up to ${MAX_GALLERY_IMAGES} images.`, true);
      input.value = "";
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      showToast("Choose a JPG, PNG, GIF, or WebP image.", true);
      input.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Images must be 5 MB or smaller.", true);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => showToast("Could not read this image file.", true);
    reader.onload = () => {
      const image = { src: reader.result, name: file.name };
      if (index === null) currentProject.images.push(image);
      else currentProject.images[index] = image;
      renderImageSlots();
      scheduleSave();
      updatePreview();
      showToast(index === null ? "Gallery image added." : "Gallery image updated.");
    };
    reader.readAsDataURL(file);
  }

  function renderPresets() {
    const grid = $("#preset-grid");
    grid.replaceChildren();
    PRESETS.forEach(preset => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `preset${currentProject.settings.preset === preset.id ? " selected" : ""}`;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(currentProject.settings.preset === preset.id));
      const swatches = document.createElement("span");
      swatches.className = "preset-swatches";
      swatches.style.setProperty("--swatch-page", preset.light[0]);
      swatches.style.setProperty("--swatch-primary", preset.accent);
      swatches.innerHTML = "<i></i>";
      const name = document.createElement("span");
      name.className = "preset-name";
      name.textContent = preset.name;
      button.append(swatches, name);
      button.addEventListener("click", () => {
        currentProject.settings.preset = preset.id;
        currentProject.settings.accentColor = preset.accent;
        currentProject.settings.themeMode = preset.mode;
        currentProject.settings.cornerStyle = preset.corners;
        renderPresets();
        renderFields();
        syncAccent();
        scheduleSave();
        updatePreview();
      });
      grid.append(button);
    });
  }

  function syncAccent() {
    $("#accent-hex").textContent = currentProject.settings.accentColor.toUpperCase();
    document.documentElement.style.setProperty("--accent", currentProject.settings.accentColor);
  }

  function isHexColor(value) {
    return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
  }

  function getPreset() {
    return PRESETS.find(preset => preset.id === currentProject.settings.preset) || PRESETS[0];
  }

  function themeCss(settings, mode) {
    const preset = PRESETS.find(item => item.id === settings.preset) || PRESETS[0];
    const accent = isHexColor(settings.accentColor) ? settings.accentColor : preset.accent;
    const light = preset.light;
    const dark = preset.dark;
    const corners = { soft: "18px", rounded: "24px", sharp: "8px" };
    const radii = corners[settings.cornerStyle] || corners.soft;
    const vars = palette => `--page:${palette[0]};--surface:${palette[1]};--surface-soft:${palette[2]};--surface-tint:${palette[3]};--text:${palette[4]};--muted:${palette[5]};--border:${palette[6]};--primary:${accent};--primary-hover:${preset.hover};--primary-soft:${accent}22;--focus-ring:${accent}30;`;
    return `:root{${vars(light)}--portal-radius:${radii};}
      :root[data-theme="dark"]{${vars(dark)}color-scheme:dark;}
      :root[data-theme="light"]{${vars(light)}color-scheme:light;}
      @media(prefers-color-scheme:dark){:root[data-theme="system"]{${vars(dark)}color-scheme:dark;}}
      @media(prefers-color-scheme:light){:root[data-theme="system"]{${vars(light)}color-scheme:light;}}
      .container{border-radius:var(--portal-radius)!important}
      .carousel,.speed-card,.access-column{border-radius:calc(var(--portal-radius) * .72)!important}
      .portal-badge,.collapsible{border-radius:calc(var(--portal-radius) * .45)!important}
      .button,#button-login,#get-code{background-color:var(--primary)!important}
      .button:hover,#button-login:hover,#get-code:hover{background-color:var(--primary-hover)!important}
      ${preset.id === "gaming" ? `.container{box-shadow:0 24px 70px rgba(0,0,0,.5),0 0 34px ${accent}35!important}.portal-badge{border-color:${accent}66!important}.button,#button-login,#get-code{box-shadow:0 0 20px ${accent}55!important}` : ""}`;
  }

  function applySettingsToDocument(doc, mode, forPreview = false) {
    const settings = currentProject.settings;
    const query = selector => doc.querySelector(selector);
    doc.title = settings.portalName || "Wi-Fi Access";
    const setText = (selector, value) => {
      const element = query(selector);
      if (element && value !== undefined) element.textContent = value;
    };
    const badge = query(".portal-badge");
    if (badge) {
      const labelNode = Array.from(badge.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (labelNode) labelNode.textContent = settings.portalName;
      else badge.append(doc.createTextNode(settings.portalName));
    }
    setText(".portal-title", settings.headline);
    setText(".portal-subtitle", settings.subheading);
    setText(".caption-eyebrow", settings.captionEyebrow);
    setText(".caption-title", settings.captionTitle);
    setText(".speed-heading h2", settings.speedTitle);
    setText(".section-eyebrow", settings.speedEyebrow);
    setText(".speed-result.upload-result .speed-label", settings.uploadLabel);
    setText(".speed-result.download-result .speed-label", settings.downloadLabel);
    setText(".speed-disclaimer", settings.speedDisclaimer);
    const speedLive = query(".speed-live");
    if (speedLive) {
      const labelNode = Array.from(speedLive.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (labelNode) labelNode.textContent = settings.speedLiveLabel;
      else speedLive.append(doc.createTextNode(settings.speedLiveLabel));
    }
    const ispLine = query(".isp-line");
    if (ispLine) {
      const labelNode = Array.from(ispLine.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (labelNode) labelNode.textContent = `${settings.ispLabel} `;
    }
    setText(".login-button-label", settings.buttonLabel);
    setText(".footer-note", settings.footer);
    setText("#note1", settings.note);

    const collapsibles = doc.querySelectorAll(".collapsible");
    if (collapsibles[0]) collapsibles[0].firstChild.textContent = `${settings.plansTitle} `;
    if (collapsibles[1]) collapsibles[1].firstChild.textContent = `${settings.guideTitle} `;
    const secondaryGuideLabel = query(".secondary-label");
    if (secondaryGuideLabel) {
      secondaryGuideLabel.textContent = settings.guideSecondaryLabel;
      secondaryGuideLabel.style.display = settings.guideSecondaryLabel ? "" : "none";
    }
    const table = query("#priceTable");
    if (table) {
      const headings = table.querySelectorAll("thead th");
      if (headings[0]) headings[0].textContent = settings.priceHeading;
      if (headings[1]) headings[1].textContent = settings.durationHeading;
      const body = table.querySelector("tbody");
      body.replaceChildren();
      settings.plans.forEach(plan => {
        const row = doc.createElement("tr");
        const priceCell = doc.createElement("td");
        const durationCell = doc.createElement("td");
        priceCell.textContent = plan.price;
        durationCell.textContent = plan.duration;
        row.append(priceCell, durationCell);
        body.append(row);
      });
    }
    const guideContent = doc.querySelectorAll(".content")[1];
    if (guideContent) {
      const steps = guideContent.querySelectorAll("p");
      [settings.guideStep1, settings.guideStep2, settings.guideStep3].forEach((text, index) => {
        if (steps[index]) steps[index].textContent = text;
      });
    }

    const visibility = [
      [".speed-card", settings.showSpeedtest],
      [".content", settings.showPlans, 0],
      [".content", settings.showGuide, 1],
      [".collapsible", settings.showPlans, 0],
      [".collapsible", settings.showGuide, 1],
      [".notes", Boolean(settings.note)]
    ];
    visibility.forEach(([selector, visible, index]) => {
      const element = index === undefined ? query(selector) : doc.querySelectorAll(selector)[index];
      if (element) element.style.display = visible ? "" : "none";
    });

    const carousel = query(".carousel");
    const imagePrototype = query(".carouselImage");
    if (carousel && imagePrototype) {
      doc.querySelectorAll(".carouselImage").forEach(element => element.remove());
      currentProject.images.forEach((image, index) => {
        const element = imagePrototype.cloneNode(false);
        element.id = `carouselImage${index + 1}`;
        element.removeAttribute("data-hidden-by-editor");
        element.src = getImageSource(image, index, forPreview);
        element.alt = `${settings.portalName || "Wi-Fi"} gallery image ${index + 1}`;
        element.style.display = index === 0 ? "block" : "none";
        carousel.insertBefore(element, carousel.querySelector(".image-caption"));
      });
    }

    if (forPreview) {
      const base = doc.createElement("base");
      base.href = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}template/`;
      doc.head.prepend(base);
      const links = doc.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        if (link.href.endsWith("light.css")) {
          link.href = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}template/light.css`;
          link.media = "all";
        } else if (link.href.endsWith("dark.css")) {
          link.href = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}template/dark.css`;
          link.media = "not all";
        }
      });
      const customStyle = doc.createElement("style");
      customStyle.textContent = themeCss(settings, mode);
      doc.head.append(customStyle);
      doc.documentElement.dataset.theme = mode === "auto" ? "system" : mode;
      doc.body.dataset.preview = "true";
      const scripts = doc.querySelectorAll("script");
      scripts.forEach(script => script.remove());
      const voucher = query("#input-voucher");
      if (voucher) voucher.style.display = "block";
      const loginButton = query("#button-login");
      if (loginButton) loginButton.type = "button";
      const hint = query("#oper-hint");
      if (hint) hint.style.display = "none";
      setText("#speedtest-status", "Live speed testing runs on your deployed Omada portal.");
      const ispOutput = query("#isp-name");
      if (ispOutput) ispOutput.textContent = "Preview";
      const previewScript = doc.createElement("script");
      previewScript.textContent = `document.addEventListener("DOMContentLoaded",function(){
        var slides=document.querySelectorAll(".carouselImage:not([data-hidden-by-editor])");var at=0;
        slides.forEach(function(slide,index){slide.style.display=index===0?"block":"none";});
        if(slides.length>1)setInterval(function(){slides[at].style.display="none";at=(at+1)%slides.length;slides[at].style.display="block";},3000);
        document.querySelectorAll(".collapsible").forEach(function(button){button.addEventListener("click",function(){
          var panel=button.nextElementSibling;var open=button.classList.toggle("active");button.setAttribute("aria-expanded",String(open));panel.style.display=open?"block":"none";
        });});
        var toggle=document.getElementById("togglePassword");if(toggle)toggle.addEventListener("click",function(){var input=document.getElementById("password");var show=input.type==="password";input.type=show?"text":"password";toggle.textContent=show?"Hide":"Show";});
      });`;
      doc.body.append(previewScript);
    } else {
      doc.documentElement.dataset.theme = settings.themeMode;
      const links = doc.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        if (link.href.endsWith("light.css")) link.media = settings.themeMode === "dark" ? "not all" : settings.themeMode === "light" ? "all" : "(prefers-color-scheme: light)";
        if (link.href.endsWith("dark.css")) link.media = settings.themeMode === "light" ? "not all" : settings.themeMode === "dark" ? "all" : "(prefers-color-scheme: dark)";
      });
      const customStyle = doc.createElement("style");
      customStyle.textContent = themeCss(settings, settings.themeMode);
      doc.head.append(customStyle);
    }
  }

  function updatePreview() {
    if (!templateHtml || !currentProject) return;
    const doc = new DOMParser().parseFromString(templateHtml, "text/html");
    applySettingsToDocument(doc, previewDark ? "dark" : "auto", true);
    previewFrame.srcdoc = `<!doctype html>${doc.documentElement.outerHTML}`;
  }

  function getImageSource(image, index, forPreview) {
    if (forPreview || !image.src.startsWith("data:")) return image.src;
    const extension = image.src.match(/^data:image\/(jpeg|png|gif|webp);/i)?.[1]?.replace("jpeg", "jpg");
    if (!extension) throw new Error(`Gallery image ${index + 1} has an unsupported image format.`);
    return `res/img/custom-slide-${index + 1}.${extension}`;
  }

  function setPreviewThemeButton() {
    const button = $("#theme-preview-button");
    button.innerHTML = previewDark ? '<span aria-hidden="true">☾</span> Preview light mode' : '<span aria-hidden="true">☼</span> Preview dark mode';
  }

  async function exportProject() {
    if (!currentProject || !templateHtml) return;
    const button = $("#export-button");
    button.disabled = true;
    button.textContent = "Preparing ZIP…";
    try {
      const doc = new DOMParser().parseFromString(templateHtml, "text/html");
      const customImages = currentProject.images.flatMap((image, index) => {
        if (!image.src.startsWith("data:")) return [];
        return [{ path: getImageSource(image, index, false), data: dataUrlBytes(image.src) }];
      });
      applySettingsToDocument(doc, currentProject.settings.themeMode, false);
      if (!currentProject.settings.showSpeedtest) {
        doc.querySelector('script[src="speedtest.js"]')?.remove();
      }
      const customizedHtml = `<!doctype html>\n${doc.documentElement.outerHTML}`;
      const files = [
        { path: "index.html", data: new TextEncoder().encode(customizedHtml) },
        ...customImages
      ];
      const templateFiles = [
        "index.js", "light.css", "dark.css", "speedtest.js", "tabCollapsible.js",
        "res/img/image1.jpg", "res/img/image2.jpeg", "res/img/image3.jpeg", "res/img/image4.jpg", "res/img/image5.jpeg",
        "res/img/instr/instr1.jpg", "res/img/instr/instr2.jpeg", "res/img/instr/instr3.jpeg"
      ];
      for (const path of templateFiles) {
        const response = await fetch(`template/${path}`);
        if (!response.ok) throw new Error(`Could not load template file: ${path}`);
        files.push({ path, data: new Uint8Array(await response.arrayBuffer()) });
      }
      const blob = makeZip(files);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${safeFilename(currentProject.name)}-omada-portal.zip`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      await saveCurrentProject(true);
      showToast("Portal ZIP exported and draft saved.");
    } catch (error) {
      showToast(`Could not export portal: ${error.message}`, true);
    } finally {
      button.disabled = false;
      button.innerHTML = '<span aria-hidden="true">↓</span> Export ZIP';
    }
  }

  function dataUrlBytes(dataUrl) {
    const match = dataUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
    if (!match) throw new Error("A custom image could not be decoded.");
    const binary = atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function safeFilename(name) {
    return (name || "wifi-portal").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "wifi-portal";
  }

  function makeZip(files) {
    const encoder = new TextEncoder();
    const crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      crcTable[n] = c >>> 0;
    }
    const crc32 = bytes => {
      let crc = 0xffffffff;
      for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
      return (crc ^ 0xffffffff) >>> 0;
    };
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const write16 = (view, at, value) => view.setUint16(at, value, true);
    const write32 = (view, at, value) => view.setUint32(at, value >>> 0, true);
    files.forEach(file => {
      const name = encoder.encode(file.path);
      const bytes = file.data;
      const checksum = crc32(bytes);
      const local = new Uint8Array(30 + name.length);
      const localView = new DataView(local.buffer);
      write32(localView, 0, 0x04034b50);
      write16(localView, 4, 20);
      write16(localView, 6, 0x0800);
      write16(localView, 8, 0);
      write16(localView, 10, 0);
      write16(localView, 12, 0x21);
      write32(localView, 14, checksum);
      write32(localView, 18, bytes.length);
      write32(localView, 22, bytes.length);
      write16(localView, 26, name.length);
      write16(localView, 28, 0);
      local.set(name, 30);
      localParts.push(local, bytes);
      const central = new Uint8Array(46 + name.length);
      const centralView = new DataView(central.buffer);
      write32(centralView, 0, 0x02014b50);
      write16(centralView, 4, 20);
      write16(centralView, 6, 20);
      write16(centralView, 8, 0x0800);
      write16(centralView, 10, 0);
      write16(centralView, 12, 0);
      write16(centralView, 14, 0x21);
      write32(centralView, 16, checksum);
      write32(centralView, 20, bytes.length);
      write32(centralView, 24, bytes.length);
      write16(centralView, 28, name.length);
      write16(centralView, 30, 0);
      write16(centralView, 32, 0);
      write16(centralView, 34, 0);
      write16(centralView, 36, 0);
      write32(centralView, 38, 0);
      write32(centralView, 42, offset);
      central.set(name, 46);
      centralParts.push(central);
      offset += local.length + bytes.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    write32(endView, 0, 0x06054b50);
    write16(endView, 4, 0);
    write16(endView, 6, 0);
    write16(endView, 8, files.length);
    write16(endView, 10, files.length);
    write32(endView, 12, centralSize);
    write32(endView, 16, offset);
    write16(endView, 20, 0);
    return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
  }

  function setActiveTab(tab) {
    $$(".settings-tab").forEach(button => {
      const active = button === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      $(`#${button.dataset.panel}`).hidden = !active;
    });
  }

  async function initialize() {
    try {
      const [templateResponse, loadedProjects] = await Promise.all([
        fetch("template/index.html"),
        storeRequest("readonly", "all")
      ]);
      if (!templateResponse.ok) throw new Error("The Omada template files could not be loaded.");
      templateHtml = await templateResponse.text();
      projects = (loadedProjects || []).map(normalizeProject);
      renderDashboard();
      $("#loading-indicator")?.remove();
    } catch (error) {
      showToast(`Portal Studio could not start: ${error.message}. Open it through a local web server.`, true);
      $("#create-button").disabled = true;
    }
  }

  $("#create-button").addEventListener("click", createProject);
  $("#empty-create-button").addEventListener("click", createProject);
  $("#brand-home").addEventListener("click", event => {
    event.preventDefault();
    showDashboard();
  });
  $("#dashboard-button").addEventListener("click", showDashboard);
  $("#back-button").addEventListener("click", showDashboard);
  $("#top-save-button").addEventListener("click", () => saveCurrentProject());
  $("#editor-save-button").addEventListener("click", () => saveCurrentProject());
  $("#export-button").addEventListener("click", exportProject);
  $("#project-name").addEventListener("input", () => {
    if (!currentProject) return;
    currentProject.name = $("#project-name").value;
    scheduleSave();
  });
  $$(".settings-tab").forEach(tab => tab.addEventListener("click", () => setActiveTab(tab)));
  $$("[data-field]").forEach(input => {
    input.addEventListener(input.type === "checkbox" || input.tagName === "SELECT" || input.type === "color" ? "change" : "input", () => {
      const field = input.dataset.field;
      currentProject.settings[field] = input.type === "checkbox" ? input.checked : input.value;
      if (field === "accentColor") {
        syncAccent();
        renderPresets();
      }
      scheduleSave();
      updatePreview();
    });
  });
  $("#add-plan-button").addEventListener("click", () => {
    if (currentProject.settings.plans.length >= 20) {
      showToast("A portal can have up to 20 plan rows.", true);
      return;
    }
    currentProject.settings.plans.push({ price: "", duration: "" });
    renderPlanRows();
    scheduleSave();
    updatePreview();
  });
  $("#add-gallery-image-button").addEventListener("click", () => {
    if (currentProject.images.length >= MAX_GALLERY_IMAGES) {
      showToast(`A gallery can contain up to ${MAX_GALLERY_IMAGES} images.`, true);
      return;
    }
    $("#gallery-image-input").click();
  });
  $("#gallery-image-input").addEventListener("change", event => {
    handleImageFile(event.currentTarget, null);
    event.currentTarget.value = "";
  });
  $("#theme-preview-button").addEventListener("click", () => {
    previewDark = !previewDark;
    setPreviewThemeButton();
    updatePreview();
  });

  initialize();
})();
