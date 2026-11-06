(() => {
  "use strict";

  const IMAGE_PATHS = [
    "res/img/image1.jpg",
    "res/img/image2.jpeg",
    "res/img/image3.jpeg",
    "res/img/image4.jpg",
    "res/img/image5.jpeg"
  ];
  const MAX_GALLERY_IMAGES = 20;
  const MAX_EXPORT_BYTES = 2_000_000;
  const TEMPLATE_FILES = [
    "index.js", "light.css", "dark.css", "speedtest.js", "tabCollapsible.js",
    "res/img/image1.jpg", "res/img/image2.jpeg", "res/img/image3.jpeg", "res/img/image4.jpg", "res/img/image5.jpeg",
    "res/img/instr/instr1.jpg", "res/img/instr/instr2.jpeg", "res/img/instr/instr3.jpeg"
  ];
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
  const supabaseConfig = window.PORTAL_STUDIO_SUPABASE || {};
  const supabaseClient = window.supabase?.createClient && supabaseConfig.url && supabaseConfig.publishableKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
    : null;
  let templateHtml = "";
  let currentProject = null;
  let currentUser = null;
  let quota = null;
  let isAdmin = false;
  let pendingRequest = null;
  const remoteDraftIds = new Set();
  let projects = [];
  let dirty = false;
  let saveTimer = 0;
  let toastTimer = 0;
  let sizeCheckTimer = 0;
  let previewDark = false;
  let previewDevice = "mobile";
  const templateAssets = new Map();
  let sizeCheckSequence = 0;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const dashboardView = $("#dashboard-view");
  const editorView = $("#editor-view");
  const toast = $("#toast");
  const saveIndicator = $("#save-indicator");
  const previewFrame = $("#portal-preview");

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
    if (!currentProject || !currentUser || !quota) return false;
    window.clearTimeout(saveTimer);
    currentProject.name = ($("#project-name").value.trim() || "Untitled Wi-Fi Portal").slice(0, 70);
    currentProject.updatedAt = new Date().toISOString();
    try {
      await persistCloudProject(currentProject);
      dirty = false;
      saveIndicator.classList.remove("unsaved");
      saveIndicator.lastChild.textContent = " All changes saved";
      renderDashboard();
      if (!silent) showToast("Draft saved on this device.");
      return true;
    } catch (error) {
      dirty = true;
      saveIndicator.classList.add("unsaved");
      saveIndicator.lastChild.textContent = " Save failed";
      showToast(`Could not save this draft: ${error.message}`, true);
      return false;
    }
  }

  function scheduleSave() {
    if (!currentProject) return;
    setDirty(true);
    queueExportSizeCheck();
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
    updateAccountControls();
  }

  function updateAccountControls() {
    const configured = Boolean(supabaseClient);
    const setupWarning = $("#account-setup-warning");
    const signInButton = $("#sign-in-button");
    const signOutButton = $("#sign-out-button");
    const accountEmail = $("#account-email");
    const accountPanel = $("#account-panel");
    const setupError = window.portalStudioSetupError || "";
    setupWarning.hidden = !setupError;
    if (setupError) setupWarning.textContent = setupError;
    signInButton.hidden = !configured || Boolean(currentUser);
    signOutButton.hidden = !configured || !currentUser;
    accountEmail.hidden = !currentUser;
    accountEmail.textContent = currentUser?.email || "";
    accountPanel.hidden = !configured || Boolean(setupError);
    const savedSlotAvailable = Boolean(quota && projects.length < quota.saved_limit);
    $("#create-button").disabled = !configured || Boolean(setupError) || !currentUser || !savedSlotAvailable;
    $("#empty-create-button").disabled = !configured || Boolean(setupError) || !currentUser || !savedSlotAvailable;
    $("#dashboard-button").hidden = !currentUser;
    $("#quota-summary").textContent = quota
      ? `Saved portals: ${projects.length} / ${quota.saved_limit} · Exports used: ${quota.exports_used} / ${quota.export_limit}`
      : "Sign in to save and export portals.";
    $("#quota-request-status").textContent = pendingRequest
      ? `Your request is ${pendingRequest.status}.`
      : "Each account starts with one saved portal and one export.";
    $("#request-access-button").hidden = !currentUser || !quota || Boolean(pendingRequest);
    $("#admin-requests").hidden = !isAdmin;
  }

  async function loadAccountData() {
    if (!currentUser || !supabaseClient) return;
    try {
      const [draftsResult, quotaResult, adminResult, requestResult] = await Promise.all([
        supabaseClient.from("portal_drafts").select("id,user_id,name,payload,updated_at").order("updated_at", { ascending: false }),
        supabaseClient.rpc("get_my_portal_quota"),
        supabaseClient.rpc("is_portal_admin"),
        supabaseClient.from("portal_access_requests").select("id,status,created_at").eq("user_id", currentUser.id).eq("status", "pending").maybeSingle()
      ]);
      if (draftsResult.error) throw draftsResult.error;
      if (quotaResult.error) throw quotaResult.error;
      if (adminResult.error) throw adminResult.error;
      if (requestResult.error) throw requestResult.error;
      quota = quotaResult.data?.[0] || null;
      isAdmin = adminResult.data === true;
      pendingRequest = requestResult.data;
      remoteDraftIds.clear();
      const loaded = [];
      for (const row of draftsResult.data || []) {
        remoteDraftIds.add(row.id);
        const project = normalizeProject(row.payload);
        project.id = row.id;
        project.name = row.name;
        project.updatedAt = row.updated_at;
        loaded.push(await hydrateCloudImages(project));
      }
      projects = loaded;
      window.portalStudioSetupError = "";
      updateAccountControls();
      renderDashboard();
      if (isAdmin) await renderAdminRequests();
    } catch (error) {
      quota = null;
      window.portalStudioSetupError = `Account storage is not ready: ${error.message}. Run supabase/schema.sql in the Supabase SQL Editor and complete the setup steps in README.`;
      projects = [];
      renderDashboard();
    }
  }

  async function hydrateCloudImages(project) {
    for (const image of project.images) {
      if (!image?.src?.startsWith("storage://")) continue;
      const path = image.src.slice("storage://".length);
      const { data, error } = await supabaseClient.storage.from("portal-images").download(path);
      if (error) throw error;
      image.src = await blobToDataUrl(data);
    }
    return project;
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Could not read a saved gallery image."));
      reader.readAsDataURL(blob);
    });
  }

  async function persistCloudProject(project) {
    if (!currentUser || !quota) throw new Error("Sign in and load your account quota before saving.");
    const payload = JSON.parse(JSON.stringify(project));
    const folder = `${currentUser.id}/${safeFilename(project.id)}`;
    for (let index = 0; index < payload.images.length; index += 1) {
      const image = payload.images[index];
      if (!image?.src.startsWith("data:")) continue;
      const path = `${folder}/slide-${index + 1}`;
      const blob = await (await fetch(image.src)).blob();
      const { error: uploadError } = await supabaseClient.storage.from("portal-images").upload(path, blob, {
        upsert: true,
        contentType: blob.type
      });
      if (uploadError) throw uploadError;
      image.src = `storage://${path}`;
    }
    const retainedPaths = new Set(payload.images
      .filter(image => image?.src.startsWith("storage://"))
      .map(image => image.src.slice("storage://".length)));
    const { data: storedImages, error: listError } = await supabaseClient.storage.from("portal-images").list(folder);
    if (listError) throw listError;
    const obsoleteImages = storedImages
      .map(image => `${folder}/${image.name}`)
      .filter(path => !retainedPaths.has(path));
    if (obsoleteImages.length) {
      const { error: removeError } = await supabaseClient.storage.from("portal-images").remove(obsoleteImages);
      if (removeError) throw removeError;
    }
    const record = {
      id: project.id,
      user_id: currentUser.id,
      name: project.name || "Untitled Wi-Fi Portal",
      payload,
      updated_at: new Date().toISOString()
    };
    const result = remoteDraftIds.has(project.id)
      ? await supabaseClient.from("portal_drafts").update(record).eq("id", project.id).eq("user_id", currentUser.id).select("id").single()
      : await supabaseClient.from("portal_drafts").insert(record).select("id").single();
    if (result.error) throw result.error;
    remoteDraftIds.add(project.id);
    project.updatedAt = record.updated_at;
  }

  async function renderAdminRequests() {
    const list = $("#admin-request-list");
    list.replaceChildren();
    const { data, error } = await supabaseClient.from("portal_access_requests")
      .select("id,email,reason,requested_templates,requested_exports,created_at")
      .eq("status", "pending").order("created_at", { ascending: true });
    if (error) {
      showToast(`Could not load access requests: ${error.message}`, true);
      return;
    }
    $("#admin-request-count").textContent = `${data.length} pending`;
    data.forEach(request => {
      const row = document.createElement("article");
      row.className = "admin-request";
      const text = document.createElement("div");
      const email = document.createElement("strong");
      email.textContent = request.email;
      const reason = document.createElement("p");
      reason.textContent = request.reason;
      text.append(email, reason);
      const actions = document.createElement("div");
      actions.className = "admin-request-actions";
      [["Approve +1", true], ["Deny", false]].forEach(([label, approved]) => {
        const button = document.createElement("button");
        button.textContent = label;
        if (approved) button.className = "approve";
        button.addEventListener("click", () => reviewAccessRequest(request.id, approved));
        actions.append(button);
      });
      row.append(text, actions);
      list.append(row);
    });
    $("#admin-requests").hidden = !isAdmin;
  }

  async function reviewAccessRequest(id, approved) {
    const { error } = await supabaseClient.rpc("review_portal_access_request", {
      p_request_id: id,
      p_approve: approved,
      p_extra_templates: approved ? 1 : 0,
      p_extra_exports: approved ? 1 : 0
    });
    if (error) {
      showToast(`Could not review request: ${error.message}`, true);
      return;
    }
    showToast(approved ? "Request approved." : "Request denied.");
    await loadAccountData();
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
    if (!currentUser || !quota) {
      showToast("Sign in to create and save a portal.", true);
      return;
    }
    if (projects.length >= quota.saved_limit) {
      showToast("You have reached your saved portal limit. Request additional access from the dashboard.", true);
      return;
    }
    currentProject = freshProject();
    try {
      await persistCloudProject(currentProject);
      projects.push(currentProject);
      quota = { ...quota, saved_limit: quota.saved_limit };
      openEditor();
      showThankYou("created");
    } catch (error) {
      currentProject = null;
      showToast(`Could not create a draft: ${error.message}`, true);
    }
  }

  async function duplicateProject(project) {
    if (!quota || projects.length >= quota.saved_limit) {
      showToast("You have reached your saved portal limit. Request additional access from the dashboard.", true);
      return;
    }
    const duplicate = JSON.parse(JSON.stringify(project));
    duplicate.id = makeId();
    duplicate.name = `${project.name || "Wi-Fi Portal"} copy`.slice(0, 70);
    duplicate.createdAt = new Date().toISOString();
    duplicate.updatedAt = duplicate.createdAt;
    try {
      await persistCloudProject(duplicate);
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
      const { error: remoteError } = await supabaseClient.from("portal_drafts")
        .delete().eq("id", project.id).eq("user_id", currentUser.id);
      if (remoteError) throw remoteError;
      remoteDraftIds.delete(project.id);
      const folder = `${currentUser.id}/${safeFilename(project.id)}`;
      const { data: objects, error: listError } = await supabaseClient.storage.from("portal-images").list(folder);
      if (listError) throw listError;
      if (objects.length) {
        const { error: removeError } = await supabaseClient.storage.from("portal-images")
          .remove(objects.map(object => `${folder}/${object.name}`));
        if (removeError) throw removeError;
      }
      projects = projects.filter(item => item.id !== project.id);
      quota = { ...quota, saved_limit: quota.saved_limit };
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
    queueExportSizeCheck();
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
    $("#speedtest-preauth-help").hidden = !settings.showSpeedtest;
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

  function setPreviewDevice(device) {
    previewDevice = device;
    const frame = $(".browser-frame");
    frame.classList.toggle("mobile", previewDevice === "mobile");
    frame.classList.toggle("desktop", previewDevice === "desktop");
    $$("[data-preview-device]").forEach(button => {
      const selected = button.dataset.previewDevice === previewDevice;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function showThankYou(action) {
    const dialog = $("#thank-you-dialog");
    $("#thank-you-title").textContent = action === "exported" ? "Export complete" : "Your portal is ready";
    $("#thank-you-description").textContent = action === "exported"
      ? "Your Omada ZIP is downloading, and your draft is saved. You can continue editing or return to your portals."
      : "Your new portal draft is saved. Keep customizing it, or export it when it’s ready.";
    dialog.showModal();
  }

  function queueExportSizeCheck() {
    window.clearTimeout(sizeCheckTimer);
    sizeCheckTimer = window.setTimeout(updateExportSizeStatus, 180);
  }

  async function loadTemplateAsset(path) {
    if (templateAssets.has(path)) return templateAssets.get(path);
    const response = await fetch(`template/${path}`);
    if (!response.ok) throw new Error(`Could not load template file: ${path}`);
    const data = new Uint8Array(await response.arrayBuffer());
    templateAssets.set(path, data);
    return data;
  }

  async function buildExportFiles() {
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
    const files = [{ path: "index.html", data: new TextEncoder().encode(customizedHtml) }];
    const referencedPaths = new Set();
    doc.querySelectorAll("img[src],script[src],link[rel='stylesheet'][href]").forEach(element => {
      const path = element.getAttribute("src") || element.getAttribute("href");
      if (path && !path.startsWith("data:") && !path.startsWith("http")) {
        referencedPaths.add(path.replace(/^\.\//, "").split("?")[0]);
      }
    });

    for (const path of TEMPLATE_FILES) {
      if (referencedPaths.has(path)) {
        files.push({ path, data: await loadTemplateAsset(path) });
      }
    }
    files.push(...customImages);
    return files;
  }

  function zipSizeBytes(files) {
    const encoder = new TextEncoder();
    return 22 + files.reduce((total, file) => {
      const filenameBytes = encoder.encode(file.path).byteLength;
      return total + file.data.byteLength + 30 + filenameBytes + 46 + filenameBytes;
    }, 0);
  }

  function formatBytes(bytes) {
    if (bytes < 1000) return `${bytes} bytes`;
    if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`;
    return `${(bytes / 1_000_000).toFixed(2)} MB`;
  }

  async function updateExportSizeStatus() {
    if (!currentProject || !templateHtml) return;
    const sequence = ++sizeCheckSequence;
    const status = $("#export-size-status");
    const bar = $("#export-size-bar");
    const button = $("#export-button");
    status.textContent = "Checking ZIP size…";
    bar.classList.remove("warning", "error");
    button.disabled = true;
    try {
      const files = await buildExportFiles();
      const size = zipSizeBytes(files);
      if (sequence !== sizeCheckSequence || !currentProject) return;
      if (size >= MAX_EXPORT_BYTES) {
        bar.classList.add("error");
        status.textContent = `ZIP is ${formatBytes(size)}; it must be under 2 MB. Remove gallery images or replace large images with smaller, optimized files.`;
        button.disabled = true;
      } else if (quota && quota.exports_used >= quota.export_limit) {
        bar.classList.add("warning");
        status.textContent = `ZIP size: ${formatBytes(size)}. Your ${quota.export_limit} export allowance has been used; request additional access from the dashboard.`;
        button.disabled = true;
      } else {
        status.textContent = `ZIP size: ${formatBytes(size)} of 2 MB limit · ready to export.`;
        button.disabled = false;
      }
    } catch (error) {
      if (sequence !== sizeCheckSequence) return;
      bar.classList.add("error");
      status.textContent = `Could not check export size: ${error.message}`;
      button.disabled = true;
    }
  }

  async function exportProject() {
    if (!currentProject || !templateHtml) return;
    if (!currentUser || !quota) {
      showToast("Sign in and load your account quota before exporting.", true);
      return;
    }
    if (quota.exports_used >= quota.export_limit) {
      showToast("You have used your export allowance. Request additional access from the dashboard.", true);
      return;
    }
    const button = $("#export-button");
    button.disabled = true;
    button.textContent = "Preparing ZIP…";
    try {
      if (!await saveCurrentProject(true)) throw new Error("Save the portal before exporting.");
      const files = await buildExportFiles();
      const size = zipSizeBytes(files);
      if (size >= MAX_EXPORT_BYTES) {
        $("#export-size-bar").classList.add("error");
        $("#export-size-status").textContent = `ZIP is ${formatBytes(size)}; it must be under 2 MB. Remove gallery images or replace large images with smaller, optimized files.`;
        throw new Error("The portal ZIP exceeds the 2 MB limit.");
      }
      const blob = makeZip(files);
      const { data: exportsUsed, error: reserveError } = await supabaseClient.rpc("reserve_portal_export", {
        p_draft_id: currentProject.id
      });
      if (reserveError) throw reserveError;
      quota = { ...quota, exports_used: exportsUsed };
      updateAccountControls();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${safeFilename(currentProject.name)}-omada-portal.zip`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showThankYou("exported");
    } catch (error) {
      showToast(`Could not export portal: ${error.message}`, true);
    } finally {
      button.innerHTML = '<span aria-hidden="true">↓</span> Export ZIP';
      queueExportSizeCheck();
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
      const templateResponse = await fetch("template/index.html");
      if (!templateResponse.ok) throw new Error("The Omada template files could not be loaded.");
      templateHtml = await templateResponse.text();
      if (!supabaseClient) {
        window.portalStudioSetupError = "Secure account saving is unavailable: Supabase client configuration could not be loaded.";
        renderDashboard();
        return;
      }
      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          window.setTimeout(async () => {
            currentUser = session?.user || null;
            $("#auth-dialog").close();
            await loadAccountData();
          }, 0);
        } else if (event === "SIGNED_OUT") {
          currentUser = null;
          projects = [];
          currentProject = null;
          quota = null;
          isAdmin = false;
          pendingRequest = null;
          remoteDraftIds.clear();
          editorView.hidden = true;
          dashboardView.hidden = false;
          $("#top-save-button").hidden = true;
          renderDashboard();
        }
      });
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) throw sessionError;
      currentUser = sessionData.session?.user || null;
      if (currentUser) await loadAccountData();
      else renderDashboard();
      $("#loading-indicator")?.remove();
    } catch (error) {
      window.portalStudioSetupError = `Portal Studio could not start securely: ${error.message}.`;
      renderDashboard();
      showToast(window.portalStudioSetupError, true);
    }
  }

  $("#sign-in-button").addEventListener("click", () => $("#auth-dialog").showModal());
  $("#sign-out-button").addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) showToast(`Could not sign out: ${error.message}`, true);
  });
  $("#auth-close").addEventListener("click", () => $("#auth-dialog").close());
  $("#auth-form").addEventListener("submit", async event => {
    event.preventDefault();
    const button = $("#auth-submit");
    const message = $("#auth-message");
    button.disabled = true;
    message.textContent = "Sending your secure sign-in link…";
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: $("#auth-email").value.trim(),
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
      if (error) throw error;
      message.textContent = "Check your email for the sign-in link, then return to this page.";
    } catch (error) {
      message.textContent = `Could not send sign-in link: ${error.message}`;
    } finally {
      button.disabled = false;
    }
  });
  $("#request-access-button").addEventListener("click", async () => {
    const reason = window.prompt("Why do you need additional saved portal and export access?");
    if (!reason) return;
    const { error } = await supabaseClient.rpc("request_extra_portal_access", { p_reason: reason });
    if (error) {
      showToast(`Could not submit request: ${error.message}`, true);
      return;
    }
    showToast("Your request has been sent to the administrator.");
    await loadAccountData();
  });

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
      if (field === "showSpeedtest") {
        $("#speedtest-preauth-help").hidden = !input.checked;
      }
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
  $$("[data-preview-device]").forEach(button => {
    button.addEventListener("click", () => setPreviewDevice(button.dataset.previewDevice));
  });
  $("#thank-you-close").addEventListener("click", () => $("#thank-you-dialog").close());
  $("#thank-you-continue").addEventListener("click", () => $("#thank-you-dialog").close());
  $("#thank-you-dashboard").addEventListener("click", () => {
    $("#thank-you-dialog").close();
    showDashboard();
  });
  $("#thank-you-dialog").addEventListener("click", event => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
  $("#copy-preauth-domains").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("speed.cloudflare.com\nipwho.is");
      showToast("Pre-authentication domains copied.");
    } catch (error) {
      showToast(`Could not copy domains: ${error.message}`, true);
    }
  });

  initialize();
})();
