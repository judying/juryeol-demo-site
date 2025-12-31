// main.js - 공통 레이아웃 로딩 + 네비/아코디언 + 기본 UX
(function () {
  const isHtmlFolder = window.location.pathname.includes("/html/");
  const base = isHtmlFolder ? ".." : ".";

  const routes = {
    header: `${base}/layout/header.html`,
    footer: `${base}/layout/footer.html`,
    css: `${base}/css/styles.css`,
    js: `${base}/js/main.js`,
  };

  async function injectLayout() {
    const headerMount = document.querySelector("[data-include='header']");
    const footerMount = document.querySelector("[data-include='footer']");
    if (headerMount) headerMount.innerHTML = await fetchText(routes.header);
    if (footerMount) footerMount.innerHTML = await fetchText(routes.footer);

    setupMobileNav();
    highlightNav();
    setupSmoothScroll();
  }

  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    return await res.text();
  }

  function setupMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // 메뉴 클릭 시 닫기 (모바일 UX)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  function highlightNav() {
    // index 섹션(#services/#faq/#contact) 이동이면 해당 키 강조
    const hash = window.location.hash;
    let key = "home";
    if (hash === "#services") key = "services";
    if (hash === "#faq") key = "faq";
    if (hash === "#contact") key = "contact";

    document.querySelectorAll(".nav-link").forEach((el) => {
      const navKey = el.getAttribute("data-navkey");
      el.classList.toggle("is-active", navKey === key);
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll("[data-scroll]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setupFAQ() {
    document.querySelectorAll("[data-faq-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        if (!item) return;

        // 하나만 열고 싶으면 아래 주석 해제
        // document.querySelectorAll(".faq-item.is-open").forEach(x => x.classList.remove("is-open"));

        item.classList.toggle("is-open");
      });
    });
  }

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      // TODO: 여기서 API로 보내거나, Airbridge/Braze/Amplitude 이벤트를 붙이면 됨
      console.log("[CONTACT_SUBMIT]", payload);

      alert("문의가 접수되었습니다! (데모)");
      form.reset();
    });
  }

  // Hero 배경 설정 (각 페이지에서 data-hero-img로 바꿀 수 있게)
  function applyHeroBg() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    const img = hero.getAttribute("data-hero-img");
    if (!img) return;
    hero.style.setProperty("--hero-image", `url('${img}')`);
  }

  // init
  document.addEventListener("DOMContentLoaded", async () => {
    applyHeroBg();
    await injectLayout();
    setupFAQ();
    setupContactForm();
  });
})();

// ==============================
// Modal open/close (3 solutions)
// ==============================

function openModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // 배경 스크롤 잠금
}

function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // 스크롤 복구
}

function closeAllModals() {
  document.querySelectorAll(".modal.show").forEach((m) => {
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

// 1) 서비스 섹션 버튼 -> 해당 모달 오픈
document.querySelectorAll(".open-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target; // airbridgeModal | brazeModal | amplitudeModal
    if (!target) return;
    openModalById(target);
  });
});

// 2) 모달 내부 닫기 버튼/백드롭 클릭 -> 닫기
//   - HTML에서 data-close="airbridgeModal" 같은 형태로 이미 지정해둠
document.addEventListener("click", (e) => {
  const closeEl = e.target.closest("[data-close]");
  if (!closeEl) return;

  const modalId = closeEl.dataset.close;
  if (!modalId) return;

  closeModalById(modalId);
});

// 3) ESC 키 -> 열려있는 모달 닫기
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
  }
});

// ==============================
// Modal open/close
// ==============================
function openModal(modalEl) {
  modalEl.classList.add("show");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  modalEl.classList.remove("show");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function closeAllModals() {
  document.querySelectorAll(".modal.show").forEach((m) => {
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

// 서비스 버튼 -> 특정 모달 오픈
document.querySelectorAll(".open-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.target;
    const modal = document.getElementById(id);
    if (!modal) return;

    // 모달 열 때 첫 탭을 기본 활성화(모달마다 is-active가 이미 붙어있긴 하지만 안전장치)
    activateTab(modal, modal.querySelector(".tab.is-active")?.dataset.tab || modal.querySelector(".tab:not([disabled])")?.dataset.tab);

    openModal(modal);
  });
});

// 닫기(백드롭/닫기버튼)
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest("[data-close]");
  if (!closeBtn) return;

  const modalId = closeBtn.dataset.close;
  const modal = document.getElementById(modalId);
  if (!modal) return;

  closeModal(modal);
});

// ESC 닫기
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

// ==============================
// Tabs (per modal)
// ==============================
function activateTab(modalEl, tabName) {
  if (!modalEl || !tabName) return;

  // 탭 버튼 상태
  modalEl.querySelectorAll(".tab").forEach((btn) => {
    const isTarget = btn.dataset.tab === tabName;
    btn.classList.toggle("is-active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  // 패널 상태
  modalEl.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === tabName);
  });
}

// 탭 클릭 (이벤트 위임: 모달이 3개여도 한 번만)
document.addEventListener("click", (e) => {
  const tabBtn = e.target.closest(".tab");
  if (!tabBtn) return;
  if (tabBtn.disabled) return;

  const modalEl = tabBtn.closest(".modal-dialog")?.closest(".modal");
  if (!modalEl) return;

  activateTab(modalEl, tabBtn.dataset.tab);
});

// ==============================
// (Demo) submit handlers
// ==============================
function safeJsonParse(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Airbridge
document.getElementById("airbridgeLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = new FormData(e.target).get("user_id");
  console.log("[Airbridge][LOGIN]", { user_id: userId });
});

document.getElementById("airbridgeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Airbridge][EVENT]", {
    event_name: fd.get("event_name"),
    props: safeJsonParse(fd.get("props")),
  });
});

document.getElementById("airbridgeAttrForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Airbridge][ATTRIBUTE]", { key: fd.get("key"), value: fd.get("value") });
});

// Braze
document.getElementById("brazeLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const externalId = new FormData(e.target).get("external_id");
  console.log("[Braze][LOGIN]", { external_id: externalId });
});

document.getElementById("brazeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Braze][EVENT]", {
    event_name: fd.get("event_name"),
    props: safeJsonParse(fd.get("props")),
  });
});

document.getElementById("brazeAttrForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Braze][ATTRIBUTE]", { key: fd.get("key"), value: fd.get("value") });
});

// Amplitude
document.getElementById("amplitudeLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = new FormData(e.target).get("user_id");

  console.log("[Amplitude][LOGIN]", { user_id: userId });

  amplitude.setUserId(userId);
});

document.getElementById("amplitudeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Amplitude][EVENT]", {
    event_name: fd.get("event_name"),
    event_properties: safeJsonParse(fd.get("event_props")),
  });
});

document.getElementById("amplitudeUserPropsForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  console.log("[Amplitude][USER_PROPS]", {
    user_properties: safeJsonParse(fd.get("user_props")),
  });
});


// ==============================
// Key-Value rows (Amplitude)
// ==============================
function createKvRow(group) {
  // group: "event" | "user"
  const row = document.createElement("div");
  row.className = "kv-row";

  row.innerHTML = `
    <input class="kv-input" name="${group}_key[]" type="text" placeholder="key" />
    <input class="kv-input" name="${group}_value[]" type="text" placeholder="value" />
    <button class="kv-remove" type="button" aria-label="삭제">－</button>
  `;
  return row;
}

function updateRemoveButtons(listEl) {
  const rows = listEl.querySelectorAll(".kv-row");
  const shouldDisable = rows.length <= 1;

  rows.forEach((r) => {
    const btn = r.querySelector(".kv-remove");
    if (btn) btn.disabled = shouldDisable;
  });
}

document.addEventListener("click", (e) => {
  // + 버튼
  const addBtn = e.target.closest("[data-add-kv]");
  if (addBtn) {
    const type = addBtn.dataset.addKv; // "event" | "user"
     if (type !== "event" && type !== "user") return;
    const listEl = document.getElementById(type === "event" ? "ampEventProps" : "ampUserProps");
    if (!listEl) return;

    listEl.appendChild(createKvRow(type));
    updateRemoveButtons(listEl);
    return;
  }

  // - 버튼
  const removeBtn = e.target.closest(".kv-remove");
  if (removeBtn) {
    const listEl = removeBtn.closest(".kv-list");
    if (!listEl) return;

    const rows = listEl.querySelectorAll(".kv-row");
    if (rows.length <= 1) return; // 1개면 삭제 금지

    removeBtn.closest(".kv-row")?.remove();
    updateRemoveButtons(listEl);
  }
});

// 폼에서 Key-Value를 JSON으로 만들기
function kvListToObject(listEl, keyName, valueName) {
  const obj = {};
  const keys = listEl.querySelectorAll(`input[name="${keyName}"]`);
  const values = listEl.querySelectorAll(`input[name="${valueName}"]`);

  keys.forEach((kEl, idx) => {
    const key = (kEl.value || "").trim();
    const val = (values[idx]?.value || "").trim();
    if (!key) return;

    // 간단한 타입 추정: true/false/숫자
    let parsed = val;
    if (val === "true") parsed = true;
    else if (val === "false") parsed = false;
    else if (val !== "" && !Number.isNaN(Number(val))) parsed = Number(val);

    obj[key] = parsed;
  });

  return obj;
}

// 기존 amplitudeEventForm submit 핸들러를 아래로 교체/수정
document.getElementById("amplitudeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  const eventName = fd.get("event_name");

  const eventList = document.getElementById("ampEventProps");
  const userList = document.getElementById("ampUserProps");

  const event_properties = eventList
    ? kvListToObject(eventList, "event_key[]", "event_value[]")
    : {};

  const user_properties = userList
    ? kvListToObject(userList, "user_key[]", "user_value[]")
    : {};

  console.log("[Amplitude][EVENT]", {
    event_name: eventName,
    event_properties,
    user_properties,
  });

  // TODO: 여기에 실제 Amplitude SDK 호출로 교체하면 끝
});

// 페이지 로드 후 기본 row의 remove 버튼 상태 업데이트(안전장치)
window.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("ampEventProps");
  const userList = document.getElementById("ampUserProps");
  if (eventList) updateRemoveButtons(eventList);
  if (userList) updateRemoveButtons(userList);
});


// ==============================
// Key-Value rows (Braze)
// ==============================

function createKvRowByNames(keyName, valueName) {
  const row = document.createElement("div");
  row.className = "kv-row";
  row.innerHTML = `
    <input class="kv-input" name="${keyName}" type="text" placeholder="key" />
    <input class="kv-input" name="${valueName}" type="text" placeholder="value" />
    <button class="kv-remove" type="button" aria-label="삭제">－</button>
  `;
  return row;
}

function updateRemoveButtons(listEl) {
  const rows = listEl.querySelectorAll(".kv-row");
  const shouldDisable = rows.length <= 1;
  rows.forEach((r) => {
    const btn = r.querySelector(".kv-remove");
    if (btn) btn.disabled = shouldDisable;
  });
}

function parseKvListToObject(listEl, keySelector, valueSelector) {
  const obj = {};
  const keys = listEl.querySelectorAll(keySelector);
  const values = listEl.querySelectorAll(valueSelector);

  keys.forEach((kEl, idx) => {
    const key = (kEl.value || "").trim();
    const valRaw = (values[idx]?.value || "").trim();
    if (!key) return;

    // 간단 타입 추정: true/false/숫자
    let val = valRaw;
    if (valRaw === "true") val = true;
    else if (valRaw === "false") val = false;
    else if (valRaw !== "" && !Number.isNaN(Number(valRaw))) val = Number(valRaw);

    obj[key] = val;
  });

  return obj;
}

// + / - 버튼 처리 (이벤트 위임)
document.addEventListener("click", (e) => {
  // + 버튼
  const addBtn = e.target.closest("[data-add-kv]");
  if (addBtn) {
    const type = addBtn.dataset.addKv; // "braze-event" | "braze-attr"

    if (type === "braze-event") {
      const list = document.getElementById("brazeEventProps");
      if (!list) return;
      list.appendChild(createKvRowByNames("be_key[]", "be_value[]"));
      updateRemoveButtons(list);
      return;
    }

    if (type === "braze-attr") {
      const list = document.getElementById("brazeAttrList");
      if (!list) return;
      list.appendChild(createKvRowByNames("ba_key[]", "ba_value[]"));
      updateRemoveButtons(list);
      return;
    }
  }

  // - 버튼
  const removeBtn = e.target.closest(".kv-remove");
  if (removeBtn) {
    const listEl = removeBtn.closest(".kv-list");
    if (!listEl) return;

    const rows = listEl.querySelectorAll(".kv-row");
    if (rows.length <= 1) return;

    removeBtn.closest(".kv-row")?.remove();
    updateRemoveButtons(listEl);
  }
});

// submit: Braze Event (event_name + properties object)
document.getElementById("brazeEventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const eventName = fd.get("event_name");

  const propsList = document.getElementById("brazeEventProps");
  const properties = propsList
    ? parseKvListToObject(propsList, 'input[name="be_key[]"]', 'input[name="be_value[]"]')
    : {};

  console.log("[Braze][EVENT]", { event_name: eventName, properties });

  // TODO: 여기를 실제 Braze SDK 호출로 교체
  // braze.logCustomEvent(eventName, properties);
});

// submit: Braze Attribute (attributes object)
document.getElementById("brazeAttrForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const list = document.getElementById("brazeAttrList");
  const attributes = list
    ? parseKvListToObject(list, 'input[name="ba_key[]"]', 'input[name="ba_value[]"]')
    : {};

  console.log("[Braze][ATTRIBUTE]", { attributes });

  // TODO: 여기를 실제 Braze SDK 호출로 교체
  // const user = braze.getUser();
  // Object.entries(attributes).forEach(([k,v]) => user.setCustomUserAttribute(k, v));
});

// 초기 1행일 때 remove disabled 맞추기
window.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("brazeEventProps");
  const attrList = document.getElementById("brazeAttrList");
  if (eventList) updateRemoveButtons(eventList);
  if (attrList) updateRemoveButtons(attrList);
});