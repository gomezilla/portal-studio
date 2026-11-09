(() => {
  "use strict";

  const IMAGE_PATHS = [
    "res/img/image1.jpg",
    "res/img/image2.jpeg",
    "res/img/image3.jpeg",
    "res/img/image4.jpg",
    "res/img/image5.jpeg"
  ];
  const GUIDE_IMAGE_PATHS = [
    "res/img/instr/instr1.jpg",
    "res/img/instr/instr2.jpeg",
    "res/img/instr/instr3.jpeg"
  ];
  const MAX_GALLERY_IMAGES = 20;
  const MAX_IMAGE_BYTES = 1_048_576;
  const MAX_EXPORT_BYTES = 2_000_000;
  const DEFAULT_ERROR_MESSAGES = {
    "0": "Successful",
    "-1": "General error.",
    "-41500": "Invalid authentication type.",
    "-41501": "Failed to authenticate.",
    "-41502": "Voucher code is incorrect.(Ayaw'g Pataka)",
    "-41503": "Voucher is expired.(Gamit na.)",
    "-41504": "Voucher traffic has exceeded the limit.",
    "-41505": "The number of users has reached the limit.(Naa nay ni gamit)",
    "-41506": "Invalid authorization information.",
    "-41507": "Your authentication times out. You can get authenticated again until the next day.",
    "-41508": "Local User traffic has exceeded the limit.(Hurot na)",
    "-41512": "Local User is expired.",
    "-41513": "Local User is disabled.",
    "-41514": "MAC address is incorrect.",
    "-41515": "Local User Quota has exceeded the limit.",
    "-41516": "The number of users has reached the limit.",
    "-41517": "Incorrect password.",
    "-41518": "This SSID does not exist.",
    "-41519": "Invalid code.",
    "-41520": "The code is expired.",
    "-41521": "The number of users has reached the limit.",
    "-41522": "Failed to validate the code.",
    "-41523": "Failed to send verification code.",
    "-41524": "Authentication failed because the username does not exist.",
    "-41525": "Authentication failed because of wrong password.",
    "-41526": "Authentication failed because the client is invalid.",
    "-41527": "Authentication failed because the local user is invalid.",
    "-41528": "Failed to decrypt data.",
    "-41529": "Incorrect username or password.",
    "-41530": "Connecting to the RADIUS server times out.",
    "-41531": "Your code has reached your Wi-Fi data limit.",
    "-41532": "Your account has reached your Wi-Fi data limit.",
    "-41533": "Form authentication request is invalid.",
    "-43408": "Invalid LDAP configuration.",
    "-43409": "Invalid LDAP credentials.",
    "-41538": "Voucher is not effective."
  };
  const TEMPLATE_FILES = [
    "index.js", "light.css", "dark.css", "speedtest.js", "tabCollapsible.js",
    "res/img/image1.jpg", "res/img/image2.jpeg", "res/img/image3.jpeg", "res/img/image4.jpg", "res/img/image5.jpeg",
    ...GUIDE_IMAGE_PATHS
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
    showHeader: true,
    showGallery: true,
    showTerms: true,
    showSpeedtest: true,
    showPlans: true,
    showGuide: true,
    showNote: true,
    showFooter: true,
    preset: "main",
    accentColor: "#2359d4",
    themeMode: "system",
    cornerStyle: "soft",
    errorMessages: DEFAULT_ERROR_MESSAGES,
    plans: [
      { price: "₱5", duration: "2 hours" },
      { price: "₱10", duration: "5 hours" },
      { price: "₱20", duration: "1 day" },
      { price: "₱55", duration: "3 days" },
      { price: "₱105", duration: "7 days" }
    ]
  };
  const PRESETS = [
    { id: "main", name: "Main", light: ["#eaf2fb", "#ffffff", "#f5f8fc", "#e7eff8", "#1c2e3b", "#637b8c", "#d7e3ed"], dark: ["#111b29", "#182536", "#1e2d40", "#26384d", "#e9f1fb", "#a4b4c5", "#34465b"], accent: "#2359d4", hover: "#1948b4", mode: "light", corners: "soft" },
    { id: "material", name: "Material You", light: ["#f3f1fa", "#ffffff", "#f7f5fb", "#eeeaf7", "#262335", "#777386", "#e7e2ef"], dark: ["#171521", "#211e2c", "#272331", "#302b3d", "#f3efff", "#ada7bc", "#3b3548"], accent: "#6750a4", hover: "#55408e", mode: "system", corners: "soft" },
    { id: "facebook", name: "Facebook", light: ["#f0f2f5", "#ffffff", "#f7f8fa", "#e4e6eb", "#1c1e21", "#65676b", "#dadde1"], dark: ["#18191a", "#242526", "#3a3b3c", "#3a3b3c", "#e4e6eb", "#b0b3b8", "#4e4f50"], accent: "#0866ff", hover: "#0756d1", mode: "light", corners: "rounded" },
    { id: "social-media", name: "Social Media", light: ["#f2f4fb", "#ffffff", "#f8f9ff", "#e9eafd", "#24253a", "#74758b", "#dee0ed"], dark: ["#171827", "#222336", "#2c2e43", "#393b54", "#f3f4ff", "#b2b4cf", "#484a64"], accent: "#6557d2", hover: "#5144b8", mode: "system", corners: "rounded" },
    { id: "youtube", name: "YouTube", light: ["#f5f5f5", "#ffffff", "#fafafa", "#eeeeee", "#202020", "#737373", "#e0e0e0"], dark: ["#0f0f0f", "#181818", "#212121", "#292929", "#f1f1f1", "#aaaaaa", "#3f3f3f"], accent: "#ff0033", hover: "#cc0029", mode: "system", corners: "sharp" },
    { id: "tiktok", name: "TikTok", light: ["#ffffff", "#ffffff", "#f5f5f5", "#69c9d0", "#010101", "#555555", "#69c9d0"], dark: ["#010101", "#171717", "#212121", "#292929", "#ffffff", "#69c9d0", "#3b3b3b"], accent: "#ee1d52", hover: "#cf1644", mode: "dark", corners: "sharp" },
    { id: "gaming", name: "Gaming / Neon", light: ["#11111b", "#191925", "#20202e", "#29283a", "#f5f3ff", "#aaa7c3", "#38364c"], dark: ["#11111b", "#191925", "#20202e", "#29283a", "#f5f3ff", "#aaa7c3", "#38364c"], accent: "#8055ff", hover: "#6740de", mode: "dark", corners: "sharp" },
    { id: "ocean", name: "Ocean", light: ["#eff6fa", "#ffffff", "#f5f9fb", "#e8f2f7", "#1a2c39", "#687d89", "#dce8ee"], dark: ["#101b25", "#172734", "#1d303d", "#243a48", "#e7f5fc", "#a2b7c2", "#2e4655"], accent: "#087e9d", hover: "#066983", mode: "system", corners: "soft" },
    { id: "sunset", name: "Sunset", light: ["#fbf3ef", "#ffffff", "#fff8f4", "#f7e9e1", "#352a2a", "#897978", "#efdfd6"], dark: ["#211a1b", "#2d2324", "#362a2b", "#443536", "#f8ecea", "#b9a6a4", "#4c3b3d"], accent: "#c75d4c", hover: "#a94b3d", mode: "system", corners: "soft" },
    { id: "forest", name: "Forest", light: ["#f0f5f0", "#ffffff", "#f6f9f5", "#e8f0e7", "#243127", "#728174", "#dce6da"], dark: ["#151d18", "#1d2921", "#243128", "#2e3b32", "#eaf3ea", "#aab9ac", "#37483c"], accent: "#347953", hover: "#286441", mode: "system", corners: "soft" },
    { id: "midnight", name: "Midnight", light: ["#eff1f8", "#ffffff", "#f5f6fb", "#e9ebf5", "#20243a", "#73798f", "#dfe2ed"], dark: ["#111521", "#191f2e", "#202738", "#293147", "#eff2ff", "#a7aec3", "#323b52"], accent: "#5369cf", hover: "#4357b6", mode: "dark", corners: "sharp" },
    { id: "rose", name: "Rose", light: ["#f8f1f5", "#ffffff", "#fbf6f9", "#f2e7ee", "#332631", "#887984", "#ebdfe7"], dark: ["#201920", "#2b202b", "#342835", "#433443", "#f6edf4", "#bbaab9", "#493948"], accent: "#a34d78", hover: "#863c62", mode: "system", corners: "rounded" }
  ];
  const supabaseConfig = window.PORTAL_STUDIO_SUPABASE || {};
  const passwordRecoveryCallback = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"
    || new URLSearchParams(window.location.search).get("type") === "recovery";
  const OFFLINE_MODE = window.PORTAL_STUDIO_OFFLINE === true;
  const supabaseClient = window.supabase?.createClient && supabaseConfig.url && supabaseConfig.publishableKey
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
    : null;
  let templateHtml = "";
  let currentProject = null;
  let currentUser = null;
  let pendingCreateAfterSignIn = false;
  let quota = null;
  let isAdmin = false;
  let pendingRequest = null;
  let pendingUnlockRequest = null;
  let userRequests = [];
  let userUnlockRequests = [];
  let creditNotifications = [];
  let adminPendingRequests = [];
  let adminPendingUnlockRequests = [];
  let readNotificationUserId = "";
  let readNotificationIds = new Set();
  let adminViewingUser = null;
  let adminUserProjects = [];
  const remoteDraftIds = new Set();
  let projects = [];
  let dirty = false;
  let saveTimer = 0;
  let toastTimer = 0;
  let sizeCheckTimer = 0;
  let previewThemeOverride = null;
  let previewDevice = "mobile";
  let passwordRecoveryPromptShown = false;
  let contentWizardStep = 0;
  const templateAssets = new Map();
  let sizeCheckSequence = 0;
  const ADMIN_PAGE_SIZE = 50;
  let adminUsersPage = 0;
  let adminUsers = [];
  let adminTotalUsers = 0;
  let adminFilteredTotal = 0;
  let adminFilterTimer = 0;
  let adminUsersRequestId = 0;
  let localDatabasePromise;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const dashboardView = $("#dashboard-view");
  const adminDashboardView = $("#admin-dashboard-view");
  const editorView = $("#editor-view");
  const toast = $("#toast");
  const saveIndicator = $("#save-indicator");
  const previewFrame = $("#portal-preview");

  function openLocalDatabase() {
    if (!localDatabasePromise) {
      localDatabasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open("portal-studio-offline", 2);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains("projects")) {
            request.result.createObjectStore("projects", { keyPath: "id" });
          }
          if (!request.result.objectStoreNames.contains("settings")) {
            request.result.createObjectStore("settings", { keyPath: "key" });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Could not open offline draft storage."));
      });
    }
    return localDatabasePromise;
  }

  async function storeLocalProject(project) {
    const database = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("projects", "readwrite");
      transaction.objectStore("projects").put(project);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Could not save this offline draft."));
      transaction.onabort = () => reject(transaction.error || new Error("Offline draft storage transaction was aborted."));
    });
  }

  async function loadLocalProjects() {
    const database = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction("projects", "readonly").objectStore("projects").getAll();
      request.onsuccess = () => resolve(request.result.map(normalizeProject));
      request.onerror = () => reject(request.error || new Error("Could not read offline drafts."));
    });
  }

  async function deleteLocalProject(id) {
    const database = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("projects", "readwrite");
      transaction.objectStore("projects").delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Could not delete this offline draft."));
      transaction.onabort = () => reject(transaction.error || new Error("Offline draft deletion was aborted."));
    });
  }

  async function getLocalSetting(key) {
    const database = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction("settings", "readonly").objectStore("settings").get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error || new Error("Could not read offline settings."));
    });
  }

  async function setLocalSetting(key, value) {
    const database = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("settings", "readwrite");
      transaction.objectStore("settings").put({ key, value });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Could not save offline settings."));
      transaction.onabort = () => reject(transaction.error || new Error("Offline settings transaction was aborted."));
    });
  }

  async function chooseOfflineExportFolder() {
    if (!window.showDirectoryPicker) {
      showToast("This browser cannot save directly to a folder. Exported ZIP files will download normally.", true);
      return;
    }
    try {
      const directory = await window.showDirectoryPicker({ mode: "readwrite" });
      const permission = await directory.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") throw new Error("Folder write permission was not granted.");
      await setLocalSetting("export-directory", directory);
      showToast("Exports will be saved in the selected folder.");
    } catch (error) {
      if (error.name !== "AbortError") showToast(`Could not select the export folder: ${error.message}`, true);
    }
  }

  async function saveOfflineExport(blob, filename) {
    if (window.PORTAL_STUDIO_DESKTOP && window.webkit?.messageHandlers?.portalStudioSave) {
      const requestId = makeId();
      const data = await blobToBase64(blob);
      const result = new Promise(resolve => {
        window.portalStudioSaveCallbacks ||= {};
        window.portalStudioSaveCallbacks[requestId] = resolve;
      });
      window.webkit.messageHandlers.portalStudioSave.postMessage({ requestId, filename, data });
      return result;
    }
    const directory = await getLocalSetting("export-directory");
    if (directory && await directory.queryPermission({ mode: "readwrite" }) === "granted") {
      const file = await directory.getFileHandle(filename, { create: true });
      const writable = await file.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    }

    function blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",", 2)[1]);
        reader.onerror = () => reject(reader.error || new Error("Could not prepare the ZIP for saving."));
        reader.readAsDataURL(blob);
      });
    }

    window.portalStudioSaveComplete = (requestId, saved) => {
      const callbacks = window.portalStudioSaveCallbacks;
      const resolve = callbacks?.[requestId];
      if (!resolve) return;
      delete callbacks[requestId];
      resolve(saved);
    };
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (directory) showToast("Folder permission expired. The ZIP was downloaded instead; select the folder again to save directly.", true);
    return false;
  }

  function freshProject() {
    const now = new Date().toISOString();
    return {
      id: makeId(),
      name: "Untitled Wi-Fi Portal",
      createdAt: now,
      updatedAt: now,
      settings: JSON.parse(JSON.stringify(DEFAULTS)),
      images: IMAGE_PATHS.map(path => ({ src: path, name: path.split("/").pop() })),
      guideImages: GUIDE_IMAGE_PATHS.map(path => ({ src: path, name: path.split("/").pop() }))
    };
  }

  async function refreshAdminDashboard() {
    try {
      const { data: analytics, error: analyticsError } = await supabaseClient.rpc("get_portal_admin_analytics");
      if (analyticsError) throw analyticsError;
      $("#metric-users").textContent = Number(analytics.total_users).toLocaleString();
      $("#metric-active").textContent = Number(analytics.active_users_30d).toLocaleString();
      $("#metric-templates").textContent = Number(analytics.saved_templates).toLocaleString();
      $("#metric-exports").textContent = Number(analytics.exports_used).toLocaleString();
      $("#metric-signups").textContent = Number(analytics.signups_30d).toLocaleString();
      $("#metric-requests").textContent = Number(analytics.pending_requests).toLocaleString();
      adminTotalUsers = Number(analytics.total_users);
    } catch (error) {
      showToast(`Could not load admin analytics: ${error.message}`, true);
      return;
    }
    try {
      await loadAdminUsers();
    } catch (error) {
      showToast(`Could not load admin users: ${error.message}`, true);
    }
    await loadAdminAuditLog();
  }

  async function loadAdminUsers() {
    const body = $("#admin-user-rows");
    body.replaceChildren();
    const requestId = ++adminUsersRequestId;
    const { data, error } = await supabaseClient.rpc("search_portal_admin_users", {
      p_limit: ADMIN_PAGE_SIZE,
      p_offset: adminUsersPage * ADMIN_PAGE_SIZE,
      p_search: $("#admin-user-search").value.trim(),
      p_role: $("#admin-user-role").value,
      p_activity: $("#admin-user-activity").value,
      p_templates: $("#admin-user-templates").value,
      p_exports: $("#admin-user-exports").value,
      p_sort_by: $("#admin-user-sort").value,
      p_sort_direction: $("#admin-user-sort-direction").dataset.direction
    });
    if (error) {
      if (requestId !== adminUsersRequestId) return;
      throw error;
    }
    if (requestId !== adminUsersRequestId) return;
    if (!data || !Array.isArray(data.users) || !Number.isInteger(Number(data.total_count))) {
      throw new Error("The user-list response has an unexpected format. Run the latest Supabase schema.");
    }
    adminUsers = data.users;
    adminFilteredTotal = Number(data.total_count);
    renderAdminUsers();
  }

  function durationLabel(from, to = new Date()) {
    const days = Math.max(0, Math.floor((to.getTime() - new Date(from).getTime()) / 86_400_000));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years) return `${days} days · ${years}y ${months}mo`;
    if (months) return `${days} days · ${months}mo`;
    return `${days} days`;
  }

  function renderAdminUsers() {
    const body = $("#admin-user-rows");
    const start = adminUsers.length ? adminUsersPage * ADMIN_PAGE_SIZE + 1 : 0;
    const end = Math.min((adminUsersPage + 1) * ADMIN_PAGE_SIZE, adminFilteredTotal);
    $("#admin-user-count").textContent = `${start}–${end} of ${adminFilteredTotal}`;
    $("#admin-users-page").textContent = `Page ${adminUsersPage + 1}`;
    $("#admin-users-prev").disabled = adminUsersPage === 0;
    $("#admin-users-next").disabled = end >= adminFilteredTotal;
    if (!adminUsers.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 9;
      cell.textContent = "No users match these filters.";
      row.append(cell);
      body.append(row);
      return;
    }
    adminUsers.forEach(user => {
      const row = document.createElement("tr");
      const email = document.createElement("td");
      const emailLink = document.createElement("button");
      emailLink.type = "button";
      emailLink.className = "admin-email-link";
      emailLink.textContent = user.email;
      emailLink.addEventListener("click", () => loadAdminUserPortals(user));
      email.append(emailLink);
      const templates = document.createElement("td");
      templates.textContent = Number(user.templates_saved).toLocaleString();
      const exports = document.createElement("td");
      exports.textContent = Number(user.exports_used).toLocaleString();
      const exportsAllowed = document.createElement("td");
      exportsAllowed.textContent = user.is_admin ? "Unlimited" : Number(user.exports_allowed).toLocaleString();
      const signedUp = document.createElement("td");
      signedUp.textContent = formatDateTime(user.signed_up_at);
      const lastLogin = document.createElement("td");
      lastLogin.textContent = user.last_sign_in_at ? formatDateTime(user.last_sign_in_at) : "Never";
      const tenure = document.createElement("td");
      tenure.textContent = durationLabel(user.signed_up_at);
      const idle = document.createElement("td");
      idle.textContent = user.last_sign_in_at ? durationLabel(user.last_sign_in_at) : "Never signed in";
      const action = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "admin-action-buttons";
      const credits = document.createElement("button");
      credits.type = "button";
      credits.className = "credit-button";
      credits.textContent = "＋ Credits";
      credits.title = "Grant template and export credits";
      credits.addEventListener("click", () => grantUserCredits(user));
      const lock = document.createElement("button");
      lock.type = "button";
      lock.className = "icon-button lock-user-button";
      lock.innerHTML = user.is_locked
        ? '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 9.7-1.7M5 10h14v11H5zM12 14v3" /></svg>'
        : '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 14v3" /></svg>';
      lock.setAttribute("aria-label", `${user.is_locked ? "Unlock" : "Lock"} ${user.email}`);
      lock.title = user.is_locked
        ? `Unlock account${user.lock_reason ? `: ${user.lock_reason}` : ""}`
        : "Lock account and require an unlock request";
      lock.disabled = user.is_admin;
      lock.addEventListener("click", () => setAdminUserLock(user));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "icon-button";
      remove.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16m-10 4v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" /></svg>';
      remove.setAttribute("aria-label", `Delete ${user.email}`);
      remove.disabled = user.is_admin;
      remove.title = remove.disabled ? "Administrator accounts cannot be removed here" : "Delete this user and their saved portals";
      remove.addEventListener("click", () => removeAdminUser(user));
      actions.append(credits, lock, remove);
      action.append(actions);
      row.append(email, templates, exports, exportsAllowed, signedUp, lastLogin, tenure, idle, action);
      body.append(row);
    });
  }

  async function loadAdminUserPortals(user) {
    try {
      const { data, error } = await supabaseClient.from("portal_drafts")
        .select("id,user_id,name,payload,updated_at")
        .eq("user_id", user.account_id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      adminUserProjects = [];
      for (const row of data || []) {
        const project = normalizeProject(row.payload);
        project.id = row.id;
        project.userId = row.user_id;
        project.name = row.name;
        project.updatedAt = row.updated_at;
        remoteDraftIds.add(project.id);
        adminUserProjects.push(await hydrateCloudImages(project));
      }
      adminViewingUser = user;
      $("#admin-user-portals-title").textContent = `Portals for ${user.email}`;
      const exportAllowance = user.is_admin
        ? `${Number(user.exports_used).toLocaleString()} exports used · unlimited account allowance`
        : `${Number(user.exports_used).toLocaleString()} of ${Number(user.exports_allowed).toLocaleString()} exports used`;
      $("#admin-user-portals-quota").textContent =
        `${user.templates_saved} saved · ${exportAllowance} · Administrator preview and exports are unlimited.`;
      const list = $("#admin-user-portals-list");
      list.replaceChildren();
      if (!adminUserProjects.length) {
        const empty = document.createElement("p");
        empty.className = "notification-empty";
        empty.textContent = "This user has no saved portals yet.";
        list.append(empty);
      }
      adminUserProjects.forEach(project => {
        const row = document.createElement("article");
        row.className = "admin-user-portal-row";
        const details = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = project.name || "Untitled Wi-Fi Portal";
        const edited = document.createElement("p");
        edited.textContent = `Edited ${formatDate(project.updatedAt)}`;
        details.append(title, edited);
        const open = document.createElement("button");
        open.type = "button";
        open.className = "button button-quiet";
        open.textContent = "Open template";
        open.addEventListener("click", () => {
          currentProject = project;
          openEditor();
        });
        row.append(details, open);
        list.append(row);
      });
      $("#admin-users-panel").hidden = true;
      $("#admin-requests").hidden = true;
      $("#admin-audit-panel").hidden = true;
      $("#admin-user-portals").hidden = false;
      window.scrollTo(0, 0);
    } catch (error) {
      showToast(`Could not load this user's portals: ${error.message}`, true);
    }
  }

  async function grantUserCredits(user) {
    const templatesText = window.prompt(`How many template credits should be added for ${user.email}?`, "1");
    if (templatesText === null) return;
    const exportsText = window.prompt(`How many export credits should be added for ${user.email}?`, "1");
    if (exportsText === null) return;
    const extraTemplates = Number(templatesText);
    const extraExports = Number(exportsText);
    if (![extraTemplates, extraExports].every(value => Number.isInteger(value) && value >= 0 && value <= 1000)
      || (extraTemplates === 0 && extraExports === 0)) {
      showToast("Enter whole-number credits between 0 and 1000, and grant at least one credit.", true);
      return;
    }
    const { error } = await supabaseClient.rpc("grant_portal_credits", {
      p_user_id: user.account_id,
      p_extra_templates: extraTemplates,
      p_extra_exports: extraExports
    });
    if (error) {
      showToast(`Could not grant credits: ${error.message}`, true);
      return;
    }
    showToast(`Granted ${extraTemplates} template and ${extraExports} export credits to ${user.email}.`);
    await Promise.all([refreshAdminDashboard(), loadAdminAuditLog()]);
  }

  async function removeUserImages(userId) {
    const storage = supabaseClient.storage.from("portal-images");
    const projectFolders = [];
    for (let offset = 0; ; offset += 100) {
      const { data, error } = await storage.list(userId, { limit: 100, offset });
      if (error) throw error;
      projectFolders.push(...(data || []));
      if (!data || data.length < 100) break;
    }
    const paths = [];
    for (const folder of projectFolders) {
      for (let offset = 0; ; offset += 100) {
        const { data, error } = await storage.list(`${userId}/${folder.name}`, { limit: 100, offset });
        if (error) throw error;
        paths.push(...(data || []).map(file => `${userId}/${folder.name}/${file.name}`));
        if (!data || data.length < 100) break;
      }
    }
    for (let index = 0; index < paths.length; index += 100) {
      const { error } = await storage.remove(paths.slice(index, index + 100));
      if (error) throw error;
    }
  }

  async function removeAdminUser(user) {
    const confirmed = window.confirm(
      `Permanently remove ${user.email} and delete their saved portals, usage records, and uploaded images? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await removeUserImages(user.account_id);
      const { error } = await supabaseClient.rpc("remove_portal_user", { p_user_id: user.account_id });
      if (error) throw error;
      showToast(`Removed ${user.email}.`);
      await refreshAdminDashboard();
    } catch (error) {
      showToast(`Could not remove user: ${error.message}`, true);
    }
  }

  function renderGuideImageSlots() {
    const list = $("#guide-image-slots");
    list.replaceChildren();
    currentProject.guideImages.forEach((image, index) => {
      const row = document.createElement("div");
      row.className = "guide-image-slot";
      const title = document.createElement("strong");
      title.textContent = `Step ${index + 1} image`;
      const preview = document.createElement("img");
      preview.className = "guide-image-thumb";
      preview.alt = image ? `Connection guide step ${index + 1}` : "";
      preview.hidden = !image;
      if (image) preview.src = image.src.startsWith("data:") ? image.src : `template/${image.src}`;
      const actions = document.createElement("div");
      actions.className = "image-buttons";
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/gif,image/webp";
      input.hidden = true;
      const choose = document.createElement("button");
      choose.type = "button";
      choose.className = "image-action";
      choose.textContent = image ? "Replace image" : "Add image";
      choose.addEventListener("click", () => input.click());
      input.addEventListener("change", () => handleGuideImageFile(input, index));
      actions.append(choose);
      if (image) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "image-action remove";
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", `Remove step ${index + 1} image`);
        remove.addEventListener("click", () => {
          currentProject.guideImages[index] = null;
          renderGuideImageSlots();
          scheduleSave();
          updatePreview();
          showToast(`Step ${index + 1} image removed.`);
        });
        actions.append(remove);
      }
      row.append(title, preview, actions, input);
      list.append(row);
    });
  }

  function handleGuideImageFile(input, index) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      showToast("Choose a JPG, PNG, GIF, or WebP image.", true);
      input.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showToast("Images must be 1 MB or smaller.", true);
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => showToast("Could not read this guide image file.", true);
    reader.onload = () => {
      currentProject.guideImages[index] = { src: reader.result, name: file.name };
      renderGuideImageSlots();
      scheduleSave();
      updatePreview();
      showToast(`Step ${index + 1} image updated.`);
    };
    reader.readAsDataURL(file);
  }

  function makeId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function getPortalDeviceId() {
    const storageKey = "portal-studio-device-id";
    let deviceId = localStorage.getItem(storageKey);
    if (!deviceId || !/^[a-f0-9-]{32,128}$/i.test(deviceId)) {
      if (!window.crypto?.getRandomValues) throw new Error("This browser cannot create a secure device registration.");
      const bytes = window.crypto.getRandomValues(new Uint8Array(32));
      deviceId = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(storageKey, deviceId);
    }
    return deviceId;
  }

  function getGuideImageSource(image, index, forPreview) {
    if (forPreview || !image.src.startsWith("data:")) return image.src;
    const extension = image.src.match(/^data:image\/(jpeg|png|gif|webp);/i)?.[1]?.replace("jpeg", "jpg");
    if (!extension) throw new Error(`Guide image ${index + 1} has an unsupported image format.`);
    return `res/img/instr/custom-guide-step-${index + 1}.${extension}`;
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
    if (!currentProject || (!OFFLINE_MODE && (!currentUser || !quota))) return false;
    window.clearTimeout(saveTimer);
    currentProject.name = ($("#project-name").value.trim() || "Untitled Wi-Fi Portal").slice(0, 70);
    currentProject.updatedAt = new Date().toISOString();
    try {
      if (OFFLINE_MODE) await storeLocalProject(currentProject);
      else await persistCloudProject(currentProject);
      dirty = false;
      saveIndicator.classList.remove("unsaved");
      saveIndicator.lastChild.textContent = " All changes saved";
      renderDashboard();
      if (!silent) showToast(OFFLINE_MODE ? "Draft saved in this browser." : "Draft saved to your account.");
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
    signInButton.hidden = OFFLINE_MODE || !configured || Boolean(currentUser);
    signOutButton.hidden = OFFLINE_MODE || !configured || !currentUser;
    accountEmail.hidden = !currentUser;
    accountEmail.textContent = currentUser?.email || "";
    accountPanel.hidden = OFFLINE_MODE || !configured || Boolean(setupError);
    setupWarning.hidden = OFFLINE_MODE || !setupError;
    const savedSlotUnavailable = !OFFLINE_MODE && Boolean(currentUser && (!quota || (!isAdmin && !quota.is_locked && projects.length >= quota.saved_limit)));
    $("#create-button").disabled = !OFFLINE_MODE && (!configured || Boolean(setupError) || savedSlotUnavailable);
    $("#empty-create-button").disabled = !OFFLINE_MODE && (!configured || Boolean(setupError) || savedSlotUnavailable);
    $("#admin-dashboard-button").hidden = !isAdmin;
    const passwordChangeButton = $("#password-change-button");
    if (passwordChangeButton) passwordChangeButton.hidden = OFFLINE_MODE || !currentUser;
    const offlineFolderButton = $("#offline-folder-button");
    if (offlineFolderButton) offlineFolderButton.hidden = !OFFLINE_MODE || !window.showDirectoryPicker;
    $("#quota-summary").textContent = isAdmin
      ? `Administrator access: unlimited saved portals and exports · Saved: ${projects.length} · Exports used: ${quota?.exports_used ?? 0}`
      : quota?.is_locked
      ? `Account locked: ${quota.lock_reason || "Contact an administrator for details."}`
      : quota
      ? `Saved portals: ${projects.length} / ${quota.saved_limit} · Exports used: ${quota.exports_used} / ${quota.export_limit}`
      : "Sign in to save and export portals.";
    $("#quota-request-status").textContent = isAdmin
      ? "Administrator accounts are not subject to save or export quotas."
      : quota?.is_locked
      ? pendingUnlockRequest
        ? "Your unlock request is pending administrator review."
        : "Submit a justification to request that your account be unlocked."
      : pendingRequest
        ? `Your request is ${pendingRequest.status}.`
        : "Each account starts with one saved portal and one export.";
    const requestButton = $("#request-access-button");
    requestButton.hidden = isAdmin || !currentUser || !quota || quota.is_locked;
    requestButton.textContent = pendingRequest ? "Request pending" : "Request more access";
    const unlockButton = $("#unlock-account-button");
    unlockButton.hidden = isAdmin || !currentUser || !quota?.is_locked;
    unlockButton.textContent = pendingUnlockRequest ? "Unlock request pending" : "Request account unlock";
    $("#admin-requests").hidden = !isAdmin;
    $("#admin-unlock-requests").hidden = !isAdmin;
    renderNotifications();
  }

  function loadReadNotificationState() {
    const userId = currentUser?.id || "signed-out";
    if (userId === readNotificationUserId) return;
    readNotificationUserId = userId;
    readNotificationIds = new Set();
    if (userId === "signed-out") return;
    try {
      const saved = window.localStorage.getItem(`portal-studio-read-notifications:${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || parsed.some(id => typeof id !== "string")) {
          throw new Error("Saved notification read state has an invalid format.");
        }
        readNotificationIds = new Set(parsed);
      }
    } catch (error) {
      showToast(`Could not load notification read status: ${error.message}`, true);
    }
  }

  function markNotificationRead(id) {
    if (!id || readNotificationIds.has(id)) return;
    readNotificationIds.add(id);
    try {
      if (currentUser) {
        const savedIds = [...readNotificationIds].slice(-300);
        window.localStorage.setItem(`portal-studio-read-notifications:${currentUser.id}`, JSON.stringify(savedIds));
        readNotificationIds = new Set(savedIds);
      }
    } catch (error) {
      showToast(`Could not save notification read status: ${error.message}`, true);
    }
    renderNotifications();
  }

  function renderNotifications() {
    const list = $("#notification-list");
    if (!list) return;
    loadReadNotificationState();
    list.replaceChildren();
    const items = [];
    if (isAdmin) {
      adminPendingRequests.forEach(request => items.push({
        id: `access:${request.id}:pending`,
        title: `Access request from ${request.email}`,
        message: `${request.requested_templates} template and ${request.requested_exports} export credits requested · ${request.reason}`,
        action: "Review requests"
      }));
      adminPendingUnlockRequests.forEach(request => items.push({
        id: `unlock:${request.id}:pending`,
        title: `Account unlock request from ${request.email}`,
        message: request.reason,
        action: "Review unlock requests"
      }));
    }
    userRequests.forEach(request => {
      if (request.status === "pending") {
        items.push({
          id: `access:${request.id}:${request.status}:${request.reviewed_at || ""}`,
          title: "Access request pending",
          message: `Your request is waiting for administrator review. Requested: ${request.requested_templates} templates and ${request.requested_exports} exports.`
        });
      } else {
        items.push({
          id: `access:${request.id}:${request.status}:${request.reviewed_at || ""}`,
          title: `Access request ${request.status}`,
          message: request.status === "approved"
            ? `Approved: ${request.approved_templates} additional templates and ${request.approved_exports} additional exports. Reviewed by Admin.`
            : "Your request was denied. Reviewed by Admin."
        });
      }
    });
    userUnlockRequests.forEach(request => items.push({
      id: `unlock:${request.id}:${request.status}:${request.reviewed_at || ""}`,
      title: `Account unlock request ${request.status}`,
      message: request.status === "pending"
        ? "Your justification is waiting for administrator review."
        : request.status === "approved"
          ? "Your account has been unlocked by Admin."
          : "Your unlock request was denied by Admin."
    }));
    creditNotifications.forEach(entry => items.push({
      id: `credit:${entry.id}`,
      title: "Additional credits granted",
      message: `An administrator added ${entry.template_credits} template and ${entry.export_credits} export credits.`
    }));
    const count = $("#notification-count");
    const unreadCount = items.filter(item => !readNotificationIds.has(item.id)).length;
    count.hidden = unreadCount === 0;
    count.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
    $("#notifications-button").setAttribute("aria-label", `Notifications${unreadCount ? `, ${unreadCount} unread updates` : ""}`);
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "notification-empty";
      empty.textContent = currentUser ? "You're all caught up." : "Sign in to see account notifications.";
      list.append(empty);
      return;
    }
    items.forEach(item => {
      const row = document.createElement("article");
      const isRead = readNotificationIds.has(item.id);
      row.className = `notification-item${isRead ? " is-read" : ""}`;
      const title = document.createElement("strong");
      title.textContent = item.title;
      const message = document.createElement("p");
      message.textContent = item.message;
      const messageButton = document.createElement("button");
      messageButton.type = "button";
      messageButton.className = "notification-message";
      messageButton.setAttribute("aria-label", `${isRead ? "Read" : "Mark as read"}: ${item.title}`);
      messageButton.append(title, message);
      messageButton.addEventListener("click", () => markNotificationRead(item.id));
      row.append(messageButton);
      if (item.action) {
        const action = document.createElement("button");
        action.type = "button";
        action.className = "text-button";
        action.textContent = item.action;
        action.addEventListener("click", async () => {
          markNotificationRead(item.id);
          $("#notifications-panel").hidden = true;
          $("#notifications-button").setAttribute("aria-expanded", "false");
          let target = $("#admin-requests");
          if (item.action === "Review unlock requests") {
            target = $("#admin-unlock-requests");
          }
          await showAdminDashboard();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        row.append(action);
      }
      list.append(row);
    });
  }

  async function refreshNotifications() {
    if (!currentUser || !supabaseClient) {
      renderNotifications();
      return;
    }
    try {
      const [requestsResult, creditsResult, unlocksResult] = await Promise.all([
        supabaseClient.from("portal_access_requests")
          .select("id,status,created_at,reviewed_at,reviewed_by,reason,requested_templates,requested_exports,approved_templates,approved_exports")
          .eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(30),
        supabaseClient.from("portal_access_audit_log")
          .select("id,template_credits,export_credits,created_at")
          .eq("user_id", currentUser.id).eq("action", "credits_granted")
          .order("created_at", { ascending: false }).limit(30),
        supabaseClient.from("portal_unlock_requests")
          .select("id,status,created_at,reviewed_at,reason")
          .eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(30)
      ]);
      const { data: requests, error: requestsError } = requestsResult;
      if (requestsError) throw requestsError;
      if (creditsResult.error) throw creditsResult.error;
      if (unlocksResult.error) throw unlocksResult.error;
      userRequests = requests || [];
      creditNotifications = creditsResult.data || [];
      userUnlockRequests = unlocksResult.data || [];
      pendingRequest = userRequests.find(request => request.status === "pending") || null;
      pendingUnlockRequest = userUnlockRequests.find(request => request.status === "pending") || null;
      if (isAdmin) {
        const [pendingResult, unlocksPendingResult] = await Promise.all([
          supabaseClient.from("portal_access_requests")
            .select("id,email,reason,requested_templates,requested_exports,created_at")
            .eq("status", "pending").order("created_at", { ascending: true }),
          supabaseClient.from("portal_unlock_requests")
            .select("id,email,reason,created_at")
            .eq("status", "pending").order("created_at", { ascending: true })
        ]);
        if (pendingResult.error) throw pendingResult.error;
        if (unlocksPendingResult.error) throw unlocksPendingResult.error;
        adminPendingRequests = pendingResult.data || [];
        adminPendingUnlockRequests = unlocksPendingResult.data || [];
      }
      updateAccountControls();
    } catch (error) {
      showToast(`Could not refresh notifications: ${error.message}`, true);
    }
  }

  async function loadAccountData() {
    if (!currentUser || !supabaseClient) return;
    try {
      const [draftsResult, quotaResult, adminResult, requestResult, creditsResult, unlocksResult] = await Promise.all([
        supabaseClient.from("portal_drafts").select("id,user_id,name,payload,updated_at").eq("user_id", currentUser.id).order("updated_at", { ascending: false }),
        supabaseClient.rpc("get_my_portal_quota"),
        supabaseClient.rpc("is_portal_admin"),
        supabaseClient.from("portal_access_requests")
          .select("id,status,created_at,reviewed_at,reviewed_by,reason,requested_templates,requested_exports,approved_templates,approved_exports")
          .eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(30),
        supabaseClient.from("portal_access_audit_log")
          .select("id,template_credits,export_credits,created_at")
          .eq("user_id", currentUser.id).eq("action", "credits_granted")
          .order("created_at", { ascending: false }).limit(30),
        supabaseClient.from("portal_unlock_requests")
          .select("id,status,created_at,reviewed_at,reason")
          .eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(30)
      ]);
      if (draftsResult.error) throw draftsResult.error;
      if (quotaResult.error) throw quotaResult.error;
      if (adminResult.error) throw adminResult.error;
      if (requestResult.error) throw requestResult.error;
      if (creditsResult.error) throw creditsResult.error;
      if (unlocksResult.error) throw unlocksResult.error;
      quota = quotaResult.data?.[0] || null;
      isAdmin = adminResult.data === true;
      userRequests = requestResult.data || [];
      creditNotifications = creditsResult.data || [];
      userUnlockRequests = unlocksResult.data || [];
      pendingRequest = userRequests.find(request => request.status === "pending") || null;
      pendingUnlockRequest = userUnlockRequests.find(request => request.status === "pending") || null;
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
      renderNotifications();
      renderDashboard();
      if (isAdmin) {
        await Promise.all([renderAdminRequests(), renderAdminUnlockRequests(), refreshAdminDashboard()]);
      }
    } catch (error) {
      quota = null;
      window.portalStudioSetupError = `Account storage is not ready: ${error.message}. Run supabase/schema.sql in the Supabase SQL Editor and complete the setup steps in README.`;
      projects = [];
      userRequests = [];
      userUnlockRequests = [];
      creditNotifications = [];
      pendingRequest = null;
      pendingUnlockRequest = null;
      renderNotifications();
      renderDashboard();
    }
  }

  function showAccountLockedDialog() {
    $("#account-lock-reason").textContent = `Reason: ${quota?.lock_reason || "The administrator has restricted account access."}`;
    $("#unlock-request-status").textContent = pendingUnlockRequest
      ? "Your unlock request is pending administrator review."
      : "You can submit a justification for the administrator to review.";
    $("#unlock-justification").disabled = Boolean(pendingUnlockRequest);
    $("#unlock-request-submit").disabled = Boolean(pendingUnlockRequest);
    $("#unlock-request-message").textContent = "";
    $("#account-locked-dialog").showModal();
  }

  async function handleLockedAccountError(error) {
    if (!/account is locked/i.test(error?.message || "")) return false;
    try {
      const { data, error: quotaError } = await supabaseClient.rpc("get_my_portal_quota");
      if (quotaError) throw quotaError;
      quota = data?.[0] || { ...quota, is_locked: true };
      updateAccountControls();
    } catch (refreshError) {
      showToast(`Your account is locked, but its reason could not be refreshed: ${refreshError.message}`, true);
    }
    return true;
  }

  async function hydrateCloudImages(project) {
    for (const image of [...project.images, ...project.guideImages].filter(Boolean)) {
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
    const ownerId = project.userId || currentUser.id;
    const folder = `${ownerId}/${safeFilename(project.id)}`;
    const uploadImages = async (images, filename) => {
      for (let index = 0; index < images.length; index += 1) {
        const image = images[index];
        if (!image?.src.startsWith("data:")) continue;
        const path = `${folder}/${filename(index)}`;
        const blob = await (await fetch(image.src)).blob();
        const { error: uploadError } = await supabaseClient.storage.from("portal-images").upload(path, blob, {
          upsert: true,
          contentType: blob.type
        });
        if (uploadError) throw uploadError;
        image.src = `storage://${path}`;
      }
    };
    await uploadImages(payload.images, index => `slide-${index + 1}`);
    await uploadImages(payload.guideImages, index => `guide-step-${index + 1}`);
    const retainedPaths = new Set([...payload.images, ...payload.guideImages]
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
      user_id: ownerId,
      name: project.name || "Untitled Wi-Fi Portal",
      payload,
      updated_at: new Date().toISOString()
    };
    const result = remoteDraftIds.has(project.id)
      ? await supabaseClient.from("portal_drafts").update(record).eq("id", project.id).eq("user_id", ownerId).select("id").single()
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
    adminPendingRequests = data || [];
    renderNotifications();
    $("#admin-request-count").textContent = `${data.length} pending`;
    data.forEach(request => {
      const row = document.createElement("article");
      row.className = "admin-request";
      const text = document.createElement("div");
      const email = document.createElement("strong");
      email.textContent = request.email;
      const reason = document.createElement("p");
      reason.textContent = `${request.reason} · Requested ${request.requested_templates} template and ${request.requested_exports} export credits`;
      text.append(email, reason);
      const actions = document.createElement("div");
      actions.className = "admin-request-actions";
      [["Approve…", true], ["Deny", false]].forEach(([label, approved]) => {
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

  async function renderAdminUnlockRequests() {
    const list = $("#admin-unlock-request-list");
    const { data, error } = await supabaseClient.from("portal_unlock_requests")
      .select("id,email,reason,created_at")
      .eq("status", "pending").order("created_at", { ascending: true });
    if (error) {
      showToast(`Could not load account unlock requests: ${error.message}`, true);
      return;
    }
    adminPendingUnlockRequests = data || [];
    renderNotifications();
    $("#admin-unlock-request-count").textContent = `${adminPendingUnlockRequests.length} pending`;
    list.replaceChildren();
    adminPendingUnlockRequests.forEach(request => {
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
      [["Unlock", true], ["Deny", false]].forEach(([label, approved]) => {
        const button = document.createElement("button");
        button.textContent = label;
        if (approved) button.className = "approve";
        button.addEventListener("click", () => reviewUnlockRequest(request.id, approved));
        actions.append(button);
      });
      row.append(text, actions);
      list.append(row);
    });
    $("#admin-unlock-requests").hidden = !isAdmin;
  }

  async function setAdminUserLock(user) {
    let reason = null;
    if (user.is_locked) {
      if (!window.confirm(`Unlock the account for ${user.email}?`)) return;
    } else {
      reason = window.prompt(`Why are you locking ${user.email}? (At least 10 characters)`);
      if (reason === null) return;
      reason = reason.trim();
      if (reason.length < 10) {
        showToast("Provide a lock reason of at least 10 characters.", true);
        return;
      }
    }
    try {
      const { error } = await supabaseClient.rpc("set_portal_user_lock", {
        p_user_id: user.account_id,
        p_locked: !user.is_locked,
        p_reason: reason
      });
      if (error) throw error;
      showToast(user.is_locked ? "Account unlocked." : "Account locked.");
      await loadAccountData();
    } catch (error) {
      showToast(`Could not ${user.is_locked ? "unlock" : "lock"} account: ${error.message}`, true);
    }
  }

  async function reviewUnlockRequest(id, approved) {
    try {
      const { error } = await supabaseClient.rpc("review_portal_unlock_request", {
        p_request_id: id,
        p_approve: approved
      });
      if (error) throw error;
      showToast(approved ? "Account unlocked." : "Unlock request denied.");
      await loadAccountData();
    } catch (error) {
      showToast(`Could not review unlock request: ${error.message}`, true);
    }
  }

  async function loadAdminAuditLog() {
    const body = $("#admin-audit-rows");
    if (!body || !isAdmin) return;
    const { data, error } = await supabaseClient.from("portal_access_audit_log")
      .select("id,admin_email,user_email,action,template_credits,export_credits,details,created_at")
      .order("created_at", { ascending: false }).limit(100);
    if (error) {
      showToast(`Could not load admin activity: ${error.message}`, true);
      return;
    }
    body.replaceChildren();
    if (!data?.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 7;
      cell.textContent = "No admin activity has been recorded.";
      row.append(cell);
      body.append(row);
      return;
    }
    const labels = {
      request_approved: "Request approved",
      request_denied: "Request denied",
      credits_granted: "Credits granted",
      user_removed: "User deleted",
      account_locked: "Account locked",
      account_unlocked: "Account unlocked",
      unlock_request_approved: "Unlock request approved",
      unlock_request_denied: "Unlock request denied"
    };
    data.forEach(entry => {
      const row = document.createElement("tr");
      const values = [
        new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.created_at)),
        entry.admin_email,
        entry.user_email,
        labels[entry.action] || entry.action,
        Number(entry.template_credits).toLocaleString(),
        Number(entry.export_credits).toLocaleString(),
        entry.details?.reason || ""
      ];
      values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
      body.append(row);
    });
  }

  async function reviewAccessRequest(id, approved) {
    let extraTemplates = 0;
    let extraExports = 0;
    if (approved) {
      const templatesText = window.prompt("How many additional templates should be approved?", "1");
      if (templatesText === null) return;
      const exportsText = window.prompt("How many additional exports should be approved?", "1");
      if (exportsText === null) return;
      extraTemplates = Number(templatesText);
      extraExports = Number(exportsText);
      if (![extraTemplates, extraExports].every(value => Number.isInteger(value) && value >= 0 && value <= 10)
        || (extraTemplates === 0 && extraExports === 0)) {
        showToast("Enter whole-number grants between 0 and 10, and approve at least one credit.", true);
        return;
      }
    }
    const { error } = await supabaseClient.rpc("review_portal_access_request", {
      p_request_id: id,
      p_approve: approved,
      p_extra_templates: extraTemplates,
      p_extra_exports: extraExports
    });
    if (error) {
      showToast(`Could not review request: ${error.message}`, true);
      return;
    }
    showToast(approved
      ? `Request approved: ${extraTemplates} template and ${extraExports} export credits.`
      : "Request denied.");
    await loadAccountData();
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "recently";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }

  function formatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  function normalizeProject(project) {
    const defaultSettings = JSON.parse(JSON.stringify(DEFAULTS));
    const settings = { ...defaultSettings, ...(project.settings || {}) };
    settings.plans = Array.isArray(project.settings?.plans) ? project.settings.plans : defaultSettings.plans;
    settings.errorMessages = Object.fromEntries(Object.keys(DEFAULT_ERROR_MESSAGES).map(code => [
      code,
      typeof project.settings?.errorMessages?.[code] === "string"
        ? project.settings.errorMessages[code]
        : DEFAULT_ERROR_MESSAGES[code]
    ]));
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
      images,
      guideImages: Array.isArray(project.guideImages)
        ? GUIDE_IMAGE_PATHS.map((path, index) => {
          const image = project.guideImages[index];
          return image && typeof image.src === "string" ? image : null;
        })
        : GUIDE_IMAGE_PATHS.map(path => ({ src: path, name: path.split("/").pop() }))
    };
  }

  async function createProject() {
    if (OFFLINE_MODE) {
      currentProject = freshProject();
      try {
        await storeLocalProject(currentProject);
        projects.push(currentProject);
        openEditor();
      } catch (error) {
        currentProject = null;
        showToast(`Could not create an offline draft: ${error.message}`, true);
      }
      return;
    }
    if (!currentUser) {
      pendingCreateAfterSignIn = true;
      $("#auth-message").textContent = "Sign in to continue creating your portal.";
      $("#auth-dialog").showModal();
      return;
    }
    if (!quota) {
      showToast("Your account quota is still loading. Please try again.", true);
      return;
    }
    if (!isAdmin && quota.is_locked) {
      showAccountLockedDialog();
      return;
    }
    if (!isAdmin && projects.length >= quota.saved_limit) {
      showToast("You have reached your saved portal limit. Request additional access from the dashboard.", true);
      return;
    }
    currentProject = freshProject();
    try {
      await persistCloudProject(currentProject);
      projects.push(currentProject);
      quota = { ...quota, saved_limit: quota.saved_limit };
      openEditor();
    } catch (error) {
      currentProject = null;
      if (await handleLockedAccountError(error)) showAccountLockedDialog();
      else showToast(`Could not create a draft: ${error.message}`, true);
    }
  }

  async function duplicateProject(project) {
    if (!OFFLINE_MODE && !isAdmin && quota?.is_locked) {
      showAccountLockedDialog();
      return;
    }
    if (!OFFLINE_MODE && (!quota || (!isAdmin && projects.length >= quota.saved_limit))) {
      showToast("You have reached your saved portal limit. Request additional access from the dashboard.", true);
      return;
    }
    const duplicate = JSON.parse(JSON.stringify(project));
    duplicate.id = makeId();
    duplicate.name = `${project.name || "Wi-Fi Portal"} copy`.slice(0, 70);
    duplicate.createdAt = new Date().toISOString();
    duplicate.updatedAt = duplicate.createdAt;
    try {
      if (OFFLINE_MODE) await storeLocalProject(duplicate);
      else await persistCloudProject(duplicate);
      projects.push(duplicate);
      renderDashboard();
      showToast("Portal duplicated.");
    } catch (error) {
      if (await handleLockedAccountError(error)) showAccountLockedDialog();
      else showToast(`Could not duplicate this portal: ${error.message}`, true);
    }
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.name || "Untitled Wi-Fi Portal"}"? This cannot be undone.`)) return;
    try {
      if (OFFLINE_MODE) {
        await deleteLocalProject(project.id);
      } else {
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
      }
      projects = projects.filter(item => item.id !== project.id);
      if (!OFFLINE_MODE && quota) quota = { ...quota, saved_limit: quota.saved_limit };
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
    adminDashboardView.hidden = true;
    editorView.hidden = false;
    document.body.classList.add("editor-active");
    $("#top-save-button").hidden = false;
    $("#project-name").value = currentProject.name;
    setActiveTab($("#content-tab"));
    setContentWizardStep(0);
    renderFields();
    syncAccent();
    renderPlanRows();
    renderImageSlots();
    renderGuideImageSlots();
    renderPresets();
    previewThemeOverride = null;
    setPreviewThemeButton();
    setDirty(false);
    updatePreview();
    queueExportSizeCheck();
    window.scrollTo(0, 0);
  }

  function showDashboard() {
    if (dirty) saveCurrentProject(true);
    document.body.classList.remove("editor-active");
    editorView.hidden = true;
    $("#top-save-button").hidden = true;
    if (adminViewingUser && isAdmin) {
      dashboardView.hidden = true;
      adminDashboardView.hidden = false;
      $("#admin-user-portals").hidden = false;
    } else {
      adminDashboardView.hidden = true;
      dashboardView.hidden = false;
      renderDashboard();
    }
  }

  async function showAdminDashboard() {
    if (!isAdmin) return;
    document.body.classList.remove("editor-active");
    editorView.hidden = true;
    dashboardView.hidden = true;
    adminDashboardView.hidden = false;
    adminViewingUser = null;
    $("#admin-users-panel").hidden = false;
    $("#admin-requests").hidden = false;
    $("#admin-audit-panel").hidden = false;
    $("#admin-user-portals").hidden = true;
    $("#top-save-button").hidden = true;
    await refreshAdminDashboard();
    await Promise.all([renderAdminRequests(), renderAdminUnlockRequests()]);
    window.scrollTo(0, 0);
  }

  function setAuthMode(mode) {
    const signUp = mode === "signup";
    const recovery = mode === "recovery";
    $("#auth-title").textContent = recovery ? "Set a new password" : signUp ? "Create your account" : "Sign in to save your work";
    $("#auth-description").textContent = recovery
      ? "Choose a new password for your Portal Studio account."
      : signUp
      ? "Create an account with your email and password. Each browser device can register up to two accounts."
      : "Sign in with your email and password. Your saved portals and export allowance follow your account.";
    $("#auth-submit").textContent = recovery ? "Update password" : signUp ? "Create account" : "Sign in";
    $("#auth-mode-toggle").textContent = signUp ? "Already have an account? Sign in" : "New here? Create an account";
    $("#auth-mode-toggle").hidden = recovery;
    $("#auth-password").autocomplete = signUp || recovery ? "new-password" : "current-password";
    $("#auth-password").setAttribute("minlength", signUp || recovery ? "8" : "1");
    $("#auth-reset").hidden = signUp || recovery;
    $("#auth-message").textContent = "";
    $("#auth-message").classList.remove("warning");
    $("#auth-form").dataset.mode = mode;
  }

  function showPasswordRecoveryPrompt(session) {
    if (!session?.user || passwordRecoveryPromptShown) return;
    passwordRecoveryPromptShown = true;
    setAuthMode("recovery");
    $("#auth-email").value = session.user.email || "";
    const dialog = $("#auth-dialog");
    if (!dialog.open) dialog.showModal();
  }

  function applyAppTheme(theme) {
    const selected = ["light", "dark", "system"].includes(theme) ? theme : "system";
    document.documentElement.dataset.appTheme = selected;
    document.documentElement.dataset.colorScheme = selected === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : selected;
    const icon = selected === "dark" ? "☾" : selected === "light" ? "☼" : "◐";
    const label = `Appearance: ${selected === "system" ? "Follow device" : selected}`;
    $("#app-theme-icon").textContent = icon;
    $("#app-theme-toggle").setAttribute("aria-label", label);
    $("#app-theme-toggle").title = `${label} · Click to change`;
    localStorage.setItem("portal-studio-app-theme", selected);
  }

  function cycleAppTheme() {
    const themes = ["system", "light", "dark"];
    const current = document.documentElement.dataset.appTheme;
    applyAppTheme(themes[(themes.indexOf(current) + 1) % themes.length]);
  }

  function setContentWizardStep(step) {
    contentWizardStep = Math.max(0, Math.min(4, step));
    const titles = ["Portal basics", "Access and speed", "Plans and pricing", "Connection guide", "Finishing touches"];
    const descriptions = [
      "Start with your portal name and welcome message.",
      "Customize network status while keeping the access method available.",
      "Set up plan labels and pricing rows.",
      "Write instructions and manage their sample images.",
      "Add optional notes, a custom footer, and guest terms acceptance."
    ];
    $$("[data-content-step]").forEach(panel => {
      panel.hidden = Number(panel.dataset.contentStep) !== contentWizardStep;
    });
    $(".section-intro .step-number").textContent = `0${contentWizardStep + 1}`;
    $("#content-step-title").textContent = titles[contentWizardStep];
    $("#content-step-description").textContent = descriptions[contentWizardStep];
    $("#content-step-count").textContent = `Step ${contentWizardStep + 1} of ${titles.length}`;
    $("#content-step-back").disabled = contentWizardStep === 0;
    $("#content-step-next").textContent = contentWizardStep === titles.length - 1 ? "Done" : "Next";
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
    renderMessagePromptFields();
  }

  function renderMessagePromptFields() {
    const list = $("#message-prompt-list");
    list.replaceChildren();
    Object.keys(DEFAULT_ERROR_MESSAGES).forEach(code => {
      const row = document.createElement("label");
      row.className = "message-prompt-item";
      const codeLabel = document.createElement("code");
      codeLabel.textContent = code;
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 250;
      input.value = currentProject.settings.errorMessages[code] || "";
      input.setAttribute("aria-label", `Message for error ${code}`);
      input.placeholder = DEFAULT_ERROR_MESSAGES[code];
      input.addEventListener("input", () => {
        currentProject.settings.errorMessages[code] = input.value;
        scheduleSave();
      });
      row.append(codeLabel, input);
      list.append(row);
    });
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
    if (file.size > MAX_IMAGE_BYTES) {
      showToast("Images must be 1 MB or smaller.", true);
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
        previewThemeOverride = null;
        renderPresets();
        renderFields();
        syncAccent();
        setPreviewThemeButton();
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
      guideContent.querySelectorAll("img").forEach((image, index) => {
        const guideImage = currentProject.guideImages[index];
        if (!guideImage) {
          image.remove();
          return;
        }
        image.src = getGuideImageSource(guideImage, index, forPreview);
        image.alt = `Connection guide step ${index + 1}`;
      });
    }

    const visibility = [
      [".header", settings.showHeader !== false],
      [".carousel", settings.showGallery !== false],
      [".speed-card", settings.showSpeedtest],
      [".content", settings.showPlans, 0],
      [".content", settings.showGuide, 1],
      [".collapsible", settings.showPlans, 0],
      [".collapsible", settings.showGuide, 1],
      [".notes", settings.showNote !== false && Boolean(settings.note)],
      [".footer-note", settings.showFooter !== false],
      [".terms-acceptance", settings.showTerms !== false]
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
      const activeThemeMode = mode === "auto" ? "system" : mode;
      links.forEach(link => {
        if (link.href.endsWith("light.css")) {
          link.href = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}template/light.css`;
          link.media = activeThemeMode === "dark" ? "not all" : activeThemeMode === "light" ? "all" : "(prefers-color-scheme: light)";
        } else if (link.href.endsWith("dark.css")) {
          link.href = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}template/dark.css`;
          link.media = activeThemeMode === "light" ? "not all" : activeThemeMode === "dark" ? "all" : "(prefers-color-scheme: dark)";
        }
      });
      const customStyle = doc.createElement("style");
      customStyle.textContent = themeCss(settings, mode);
      doc.head.append(customStyle);
      doc.documentElement.dataset.theme = activeThemeMode;
      doc.body.dataset.preview = "true";
      const scripts = doc.querySelectorAll("script");
      scripts.forEach(script => script.remove());
      const voucher = query("#input-voucher");
      if (voucher) voucher.style.display = "block";
      const loginButton = query("#button-login");
      if (loginButton) loginButton.type = "button";
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
        function prompt(message,isError){var dialog=document.getElementById("oper-prompt");dialog.dataset.kind=isError?"error":"success";document.getElementById("oper-prompt-title").textContent=isError?"Unable to connect":"Connection notice";document.getElementById("oper-prompt-icon").textContent=isError?"!":"✓";document.getElementById("oper-prompt-message").textContent=message;if(!dialog.open)dialog.showModal();}
        var terms=document.getElementById("terms-acceptance"),check=document.getElementById("terms-checkbox");
        function requireTerms(){if(!terms||terms.style.display==="none"||!check||check.checked)return true;prompt("Please agree to the Terms of Service before connecting to Wi-Fi.",true);check.focus();return false;}
        var login=document.getElementById("button-login");if(login)login.addEventListener("click",function(event){if(!requireTerms())event.preventDefault();});
        var getCode=document.getElementById("get-code");if(getCode)getCode.addEventListener("click",function(event){if(!requireTerms())event.preventDefault();});
        document.getElementById("terms-open").addEventListener("click",function(){document.getElementById("terms-dialog").showModal();});
        document.getElementById("terms-close").addEventListener("click",function(){document.getElementById("terms-dialog").close();});
        document.getElementById("terms-done").addEventListener("click",function(){document.getElementById("terms-dialog").close();});
        document.getElementById("terms-dialog").addEventListener("click",function(event){if(event.target===event.currentTarget)event.currentTarget.close();});
        document.getElementById("oper-prompt-close").addEventListener("click",function(){document.getElementById("oper-prompt").close();});
        document.getElementById("oper-prompt").addEventListener("click",function(event){if(event.target===event.currentTarget)event.currentTarget.close();});
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

  function getPreviewThemeMode() {
    return previewThemeOverride || currentProject.settings.themeMode;
  }

  function isPreviewDark() {
    const mode = getPreviewThemeMode();
    return mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function updatePreview() {
    if (!templateHtml || !currentProject) return;
    const doc = new DOMParser().parseFromString(templateHtml, "text/html");
    applySettingsToDocument(doc, getPreviewThemeMode(), true);
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
    button.innerHTML = isPreviewDark()
      ? '<span aria-hidden="true">☾</span> Preview light mode'
      : '<span aria-hidden="true">☼</span> Preview dark mode';
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
    const isSupport = action === "support";
    $("#thank-you-title").textContent = isSupport ? "Support Portal Studio" : "Export complete";
    $("#thank-you-description").textContent = isSupport
      ? "If Portal Studio has been useful, you can optionally contribute to support its continued development."
      : "Your Omada ZIP is ready, and your draft is saved. You can continue editing or return to your portals.";
    $("#thank-you-continue").textContent = isSupport ? "Close" : "Continue editing";
    $("#thank-you-dashboard").hidden = isSupport;
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
    const customGuideImages = currentProject.guideImages.flatMap((image, index) => {
      if (!image?.src.startsWith("data:")) return [];
      return [{ path: getGuideImageSource(image, index, false), data: dataUrlBytes(image.src) }];
    });
    applySettingsToDocument(doc, currentProject.settings.themeMode, false);
    if (!currentProject.settings.showSpeedtest) {
      doc.querySelector('script[src="speedtest.js"]')?.remove();
    }
    const messagesScript = doc.createElement("script");
    const messagesJson = JSON.stringify(currentProject.settings.errorMessages)
      .replace(/</g, "\\u003c")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    messagesScript.textContent = `window.portalStudioErrorMessages=${messagesJson};`;
    const authScript = doc.querySelector('script[src="index.js"]');
    if (!authScript) throw new Error("The template authentication script is missing.");
    authScript.before(messagesScript);

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
    files.push(...customImages, ...customGuideImages);
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
      } else if (!OFFLINE_MODE && !isAdmin && quota?.is_locked) {
        bar.classList.add("warning");
        status.textContent = "Your account is locked. Choose Export ZIP to review the reason and request an unlock.";
        button.disabled = false;
      } else if (!OFFLINE_MODE && !isAdmin && quota && quota.exports_used >= quota.export_limit) {
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
    if (!OFFLINE_MODE && (!currentUser || !quota)) {
      showToast("Sign in and load your account quota before exporting.", true);
      return;
    }
    if (!OFFLINE_MODE && !isAdmin && quota.is_locked) {
      showAccountLockedDialog();
      return;
    }
    if (!OFFLINE_MODE && !isAdmin && quota.exports_used >= quota.export_limit) {
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
      if (!OFFLINE_MODE) {
        const { data: exportsUsed, error: reserveError } = await supabaseClient.rpc("reserve_portal_export", {
          p_draft_id: currentProject.id
        });
        if (reserveError) throw reserveError;
        quota = { ...quota, exports_used: exportsUsed };
        updateAccountControls();
      }
      const filename = `${safeFilename(currentProject.name)}-omada-portal.zip`;
      if (OFFLINE_MODE) {
        const saved = await saveOfflineExport(blob, filename);
        if (!saved) {
          showToast("Export canceled. No ZIP file was saved.", true);
          return;
        }
      }
      else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      showThankYou("exported");
    } catch (error) {
      if (await handleLockedAccountError(error)) showAccountLockedDialog();
      else showToast(`Could not export portal: ${error.message}`, true);
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
      applyAppTheme(localStorage.getItem("portal-studio-app-theme") || "system");
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (document.documentElement.dataset.appTheme === "system") applyAppTheme("system");
        if (currentProject?.settings.themeMode === "system" && previewThemeOverride === null) {
          setPreviewThemeButton();
          updatePreview();
        }
      });
      setAuthMode("signin");
      if (!OFFLINE_MODE && supabaseClient) {
        supabaseClient.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY") showPasswordRecoveryPrompt(session);
        });
      }
      const templateResponse = await fetch("template/index.html");
      if (!templateResponse.ok) throw new Error("The Omada template files could not be loaded.");
      templateHtml = await templateResponse.text();
      if (OFFLINE_MODE) {
        projects = await loadLocalProjects();
        renderDashboard();
        $("#loading-indicator")?.remove();
        return;
      }
      if (!supabaseClient) {
        window.portalStudioSetupError = "Secure account saving is unavailable: Supabase client configuration could not be loaded.";
        renderDashboard();
        return;
      }
      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          window.setTimeout(async () => {
            currentUser = session?.user || null;
            userRequests = [];
            userUnlockRequests = [];
            creditNotifications = [];
            adminPendingRequests = [];
            adminPendingUnlockRequests = [];
            quota = null;
            isAdmin = false;
            pendingRequest = null;
            pendingUnlockRequest = null;
            renderNotifications();
            if ($("#auth-form").dataset.mode !== "recovery") $("#auth-dialog").close();
            await loadAccountData();
            if (pendingCreateAfterSignIn) {
              pendingCreateAfterSignIn = false;
              await createProject();
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          currentUser = null;
          projects = [];
          userRequests = [];
          userUnlockRequests = [];
          creditNotifications = [];
          adminPendingRequests = [];
          adminPendingUnlockRequests = [];
          adminViewingUser = null;
          adminUserProjects = [];
          currentProject = null;
          quota = null;
          isAdmin = false;
          pendingRequest = null;
          pendingUnlockRequest = null;
          readNotificationUserId = "";
          readNotificationIds = new Set();
          remoteDraftIds.clear();
          editorView.hidden = true;
          dashboardView.hidden = false;
          adminDashboardView.hidden = true;
          $("#top-save-button").hidden = true;
          renderDashboard();
        }
      });
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) throw sessionError;
      currentUser = sessionData.session?.user || null;
      if (currentUser) await loadAccountData();
      else renderDashboard();
      if (passwordRecoveryCallback) {
        if (sessionData.session) {
          showPasswordRecoveryPrompt(sessionData.session);
        } else if (!passwordRecoveryPromptShown) {
          $("#auth-message").textContent = "This password-reset link could not be verified or has expired. Request a new reset link to continue.";
          $("#auth-dialog").showModal();
        }
      }
      $("#loading-indicator")?.remove();
    } catch (error) {
      window.portalStudioSetupError = `Portal Studio could not start securely: ${error.message}.`;
      renderDashboard();
      showToast(window.portalStudioSetupError, true);
    }
  }

  $("#sign-in-button").addEventListener("click", () => $("#auth-dialog").showModal());
  $("#topbar-menu-toggle").addEventListener("click", event => {
    const button = event.currentTarget;
    const panel = $("#topbar-menu-panel");
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $("#topbar-menu-panel").addEventListener("click", event => {
    if (event.target.closest("button")) {
      $("#topbar-menu-panel").hidden = true;
      $("#topbar-menu-toggle").setAttribute("aria-expanded", "false");
      $("#topbar-menu-toggle").setAttribute("aria-label", "Open menu");
    }
  });
  $("#notifications-button").addEventListener("click", async event => {
    const button = event.currentTarget;
    const panel = $("#notifications-panel");
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (open) await refreshNotifications();
  });
  $("#notifications-close").addEventListener("click", () => {
    $("#notifications-panel").hidden = true;
    $("#notifications-button").setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".topbar-menu")) {
      $("#topbar-menu-panel").hidden = true;
      $("#topbar-menu-toggle").setAttribute("aria-expanded", "false");
      $("#topbar-menu-toggle").setAttribute("aria-label", "Open menu");
    }
    if (!event.target.closest(".notification-wrap")) {
      $("#notifications-panel").hidden = true;
      $("#notifications-button").setAttribute("aria-expanded", "false");
    }
  });
  $("#support-button").addEventListener("click", () => showThankYou("support"));
  $("#offline-folder-button")?.addEventListener("click", chooseOfflineExportFolder);
  $("#password-change-button")?.addEventListener("click", () => {
    $("#password-change-message").textContent = "";
    $("#password-change-dialog").showModal();
  });
  $("#password-change-close")?.addEventListener("click", () => $("#password-change-dialog").close());
  $("#password-change-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    const password = $("#new-account-password").value;
    const confirmation = $("#confirm-account-password").value;
    const message = $("#password-change-message");
    if (password !== confirmation) {
      message.textContent = "The passwords do not match.";
      $("#confirm-account-password").focus();
      return;
    }
    if (!currentUser || !supabaseClient) {
      message.textContent = "Sign in again before changing your password.";
      return;
    }
    const button = $("#password-change-submit");
    button.disabled = true;
    message.textContent = "Updating password…";
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      $("#password-change-dialog").close();
      $("#password-change-form").reset();
      showToast("Your password was changed.");
    } catch (error) {
      message.textContent = `Could not change password: ${error.message || String(error)}`;
    } finally {
      button.disabled = false;
    }
  });
  $("#sign-out-button").addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) showToast(`Could not sign out: ${error.message}`, true);
  });
  $("#auth-close").addEventListener("click", () => $("#auth-dialog").close());
  $("#auth-mode-toggle").addEventListener("click", () => {
    setAuthMode($("#auth-form").dataset.mode === "signup" ? "signin" : "signup");
  });
  $("#auth-form").addEventListener("submit", async event => {
    event.preventDefault();
    const button = $("#auth-submit");
    const message = $("#auth-message");
    button.disabled = true;
    message.classList.remove("warning");
    const signUp = event.currentTarget.dataset.mode === "signup";
    const recovery = event.currentTarget.dataset.mode === "recovery";
    message.textContent = recovery ? "Updating your password…" : signUp ? "Creating your account…" : "Signing in…";
    try {
      const email = $("#auth-email").value.trim();
      const password = $("#auth-password").value;
      const { data, error } = recovery
        ? await supabaseClient.auth.updateUser({ password })
        : signUp
          ? await supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { portal_device_id: getPortalDeviceId() } }
          })
          : await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (recovery) {
        message.textContent = "Password updated. You can now sign in with it.";
        setAuthMode("signin");
        $("#auth-password").value = "";
        $("#auth-dialog").close();
        showToast("Password updated.");
      } else if (signUp && !data.session) {
        message.textContent = "Account created. Check your email to verify the address, then sign in with your password.";
      } else if (signUp) {
        message.textContent = "Account created. Signing you in…";
      } else {
        message.textContent = "Signed in.";
      }
    } catch (error) {
      const errorText = error.message || String(error);
      const rateLimited = /rate.?limit|too many requests/i.test(errorText);
      message.classList.toggle("warning", rateLimited);
      const deviceLimit = signUp && /device|account limit/i.test(errorText);
      const accountCreationError = signUp && /database error saving new user/i.test(errorText);
      const invalidCredentials = !signUp && !recovery && /invalid login credentials/i.test(errorText);
      message.textContent = deviceLimit
        ? "This device has reached its limit of two Portal Studio accounts."
        : accountCreationError
          ? `Could not create the account. Account creation is limited to two accounts per browser device; if you have not reached that limit, contact the administrator. (${errorText})`
        : rateLimited
        ? "Supabase’s email rate limit has been reached. Wait before trying again. For reliable delivery, configure custom SMTP in Supabase Dashboard → Authentication → SMTP Settings."
        : invalidCredentials
          ? "This email/password pair was not accepted. If this admin account previously used sign-in links, use “Forgot password?” to set a password. If no account exists yet, create one with the admin email and verify it before signing in."
          : `${recovery ? "Could not update password" : signUp ? "Could not create account" : "Could not sign in"}: ${errorText}`;
    } finally {
      button.disabled = false;
    }
  });
  $("#auth-reset").addEventListener("click", async () => {
    const email = $("#auth-email").value.trim();
    const message = $("#auth-message");
    const button = $("#auth-reset");
    if (!email) {
      message.textContent = "Enter your email address first.";
      $("#auth-email").focus();
      return;
    }
    button.disabled = true;
    message.textContent = "Requesting a password reset…";
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (error) throw error;
      message.textContent = "If an account exists for that email, a password reset message will be sent.";
    } catch (error) {
      const errorText = error.message || String(error);
      message.textContent = /rate.?limit|too many requests/i.test(errorText)
        ? "Supabase’s email rate limit has been reached. Wait before requesting another reset email, or configure custom SMTP in Supabase Dashboard → Authentication → SMTP Settings."
        : `Could not request a password reset: ${errorText}`;
    } finally {
      button.disabled = false;
    }
  });
  $("#app-theme-toggle").addEventListener("click", cycleAppTheme);
  $("#admin-dashboard-button").addEventListener("click", showAdminDashboard);
  $("#admin-return-button").addEventListener("click", () => {
    adminViewingUser = null;
    showDashboard();
  });
  $("#admin-user-portals-back").addEventListener("click", () => {
    adminViewingUser = null;
    $("#admin-users-panel").hidden = false;
    $("#admin-requests").hidden = false;
    $("#admin-audit-panel").hidden = false;
    $("#admin-user-portals").hidden = true;
  });
  $("#features-button").addEventListener("click", () => $("#features-dialog").showModal());
  $("#features-close").addEventListener("click", () => $("#features-dialog").close());
  $("#features-done").addEventListener("click", () => $("#features-dialog").close());
  $("#features-dialog").addEventListener("click", event => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
  $("#admin-refresh-button").addEventListener("click", refreshAdminDashboard);
  const reloadFilteredAdminUsers = () => {
    adminUsersPage = 0;
    loadAdminUsers().catch(error => showToast(`Could not load admin users: ${error.message}`, true));
  };
  $("#admin-user-search")?.addEventListener("input", () => {
    window.clearTimeout(adminFilterTimer);
    adminFilterTimer = window.setTimeout(reloadFilteredAdminUsers, 250);
  });
  ["admin-user-role", "admin-user-activity", "admin-user-templates", "admin-user-exports", "admin-user-sort"].forEach(id => {
    $(`#${id}`)?.addEventListener("change", reloadFilteredAdminUsers);
  });
  $("#admin-user-sort-direction")?.addEventListener("click", event => {
    const button = event.currentTarget;
    button.dataset.direction = button.dataset.direction === "asc" ? "desc" : "asc";
    button.textContent = button.dataset.direction === "asc" ? "Ascending" : "Descending";
    button.setAttribute("aria-label", `Sort ${button.dataset.direction === "asc" ? "ascending" : "descending"}`);
    reloadFilteredAdminUsers();
  });
  $("#admin-users-prev").addEventListener("click", async () => {
    if (adminUsersPage === 0) return;
    adminUsersPage -= 1;
    try {
      await loadAdminUsers();
    } catch (error) {
      showToast(`Could not load users: ${error.message}`, true);
    }
  });
  $("#admin-users-next").addEventListener("click", async () => {
    if ((adminUsersPage + 1) * ADMIN_PAGE_SIZE >= adminFilteredTotal) return;
    adminUsersPage += 1;
    try {
      await loadAdminUsers();
    } catch (error) {
      showToast(`Could not load users: ${error.message}`, true);
    }
  });
  $("#content-step-back").addEventListener("click", () => setContentWizardStep(contentWizardStep - 1));
  $("#content-step-next").addEventListener("click", () => {
    if (contentWizardStep === 4) setActiveTab($("#style-tab"));
    else setContentWizardStep(contentWizardStep + 1);
  });
  $("#request-access-button").addEventListener("click", async () => {
    if (pendingRequest) {
      window.alert("You already have an access request waiting for administrator review. Please wait for a decision before submitting another request.");
      return;
    }
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
  $("#unlock-account-button").addEventListener("click", showAccountLockedDialog);
  $("#account-locked-close").addEventListener("click", () => $("#account-locked-dialog").close());
  $("#account-unlock-form").addEventListener("submit", async event => {
    event.preventDefault();
    const message = $("#unlock-request-message");
    const button = $("#unlock-request-submit");
    const reason = $("#unlock-justification").value.trim();
    if (reason.length < 10) {
      message.textContent = "Please provide a justification of at least 10 characters.";
      return;
    }
    if (!currentUser || !supabaseClient) {
      message.textContent = "Sign in again before requesting an account unlock.";
      return;
    }
    button.disabled = true;
    message.textContent = "Sending your request…";
    try {
      const { error } = await supabaseClient.rpc("request_portal_unlock", { p_reason: reason });
      if (error) throw error;
      $("#account-locked-dialog").close();
      $("#account-unlock-form").reset();
      await loadAccountData();
      showToast("Your unlock request was sent to the administrator.");
    } catch (error) {
      message.textContent = `Could not send unlock request: ${error.message}`;
    } finally {
      button.disabled = Boolean(pendingUnlockRequest);
    }
  });

  $("#create-button").addEventListener("click", createProject);
  $("#empty-create-button").addEventListener("click", createProject);
  $("#brand-home").addEventListener("click", event => {
    event.preventDefault();
    showDashboard();
  });
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
      if (field === "themeMode") {
        previewThemeOverride = null;
        setPreviewThemeButton();
      }
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
    previewThemeOverride = isPreviewDark() ? "light" : "dark";
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
