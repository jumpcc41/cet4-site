const examDate = new Date("2026-06-13T09:00:00+08:00");
const countdownDays = document.getElementById("countdownDays");
const installBtn = document.getElementById("installBtn");

const checklistContainer = document.getElementById("checklist");
const doneCount = document.getElementById("doneCount");
const streakCount = document.getElementById("streakCount");
const dailyFocus = document.getElementById("dailyFocus");
const weeklyReview = document.getElementById("weeklyReview");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const saveTip = document.getElementById("saveTip");

const wordbookDate = document.getElementById("wordbookDate");
const wordbookUnit = document.getElementById("wordbookUnit");
const wordbookCount = document.getElementById("wordbookCount");
const wordbookFeeling = document.getElementById("wordbookFeeling");
const wordbookHardWords = document.getElementById("wordbookHardWords");
const saveWordbookBtn = document.getElementById("saveWordbookBtn");
const wordbookLogList = document.getElementById("wordbookLogList");
const wordbookEmpty = document.getElementById("wordbookEmpty");
const wordbookDaysCount = document.getElementById("wordbookDaysCount");
const wordbookWordsCount = document.getElementById("wordbookWordsCount");
const wordbookTodayTarget = document.getElementById("wordbookTodayTarget");

const practiceDate = document.getElementById("practiceDate");
const practiceType = document.getElementById("practiceType");
const practiceMaterial = document.getElementById("practiceMaterial");
const practiceProblem = document.getElementById("practiceProblem");
const practiceNext = document.getElementById("practiceNext");
const savePracticeBtn = document.getElementById("savePracticeBtn");
const practiceLogList = document.getElementById("practiceLogList");
const practiceEmpty = document.getElementById("practiceEmpty");

const errorCorrection = document.getElementById("errorCorrection");
const saveErrorBtn = document.getElementById("saveErrorBtn");
const errorSaveTip = document.getElementById("errorSaveTip");

const checklistTemplate = [
  { id: "wordbook", title: "记录了今天的背词进度", note: "至少写下今天背到哪一页、多少词" },
  { id: "practice", title: "记录了今天的做题内容", note: "至少写下一组题型和最大问题" },
  { id: "error", title: "写下了 1 条纠错笔记", note: "把今天最容易重复错的点写清楚" },
  { id: "review", title: "做了睡前回顾", note: "回看今天背词、做题和错因记录" },
  { id: "plan", title: "写好了明天先补什么", note: "明天开学前先知道第一件事干什么" }
];

const storageKey = "cet4-book-checklist";
const streakKey = "cet4-book-streak";
const notesKey = "cet4-book-notes";
const wordbookKey = "cet4-book-wordbook-logs";
const practiceKey = "cet4-book-practice-logs";
const errorKey = "cet4-book-error-note";

let deferredPrompt = null;

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function safeRead(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCountdown() {
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  countdownDays.textContent = Math.max(days, 0);
}

function setAdaptiveTarget() {
  if (!wordbookTodayTarget) {
    return;
  }

  const day = new Date().getDay();
  if (day === 6) {
    wordbookTodayTarget.textContent = "80 词";
    return;
  }

  if (day === 0) {
    wordbookTodayTarget.textContent = "40 词复习日";
    return;
  }

  wordbookTodayTarget.textContent = "60 词";
}

function renderWordbookStats() {
  const logs = safeRead(wordbookKey, []);
  const totalWords = logs.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const days = new Set(logs.map((item) => item.date)).size;
  wordbookDaysCount.textContent = days;
  wordbookWordsCount.textContent = totalWords;
}

function renderWordbookLogs() {
  const logs = safeRead(wordbookKey, []);
  wordbookLogList.innerHTML = "";
  wordbookEmpty.style.display = logs.length ? "none" : "block";

  logs.slice(0, 8).forEach((item) => {
    const card = document.createElement("article");
    card.className = "log-item";
    card.innerHTML = `
      <strong>${item.date} · ${item.unit}</strong>
      <span>今天背词：${item.count} 个</span>
      <span>状态：${item.feeling}</span>
      <span>最卡的词：${item.hardWords || "未填写"}</span>
    `;
    wordbookLogList.append(card);
  });

  renderWordbookStats();
}

function saveWordbookLog() {
  const payload = {
    date: wordbookDate.value || getTodayKey(),
    unit: wordbookUnit.value.trim(),
    count: wordbookCount.value.trim(),
    feeling: wordbookFeeling.value.trim(),
    hardWords: wordbookHardWords.value.trim()
  };

  if (!payload.unit || !payload.count || !payload.feeling) {
    return;
  }

  const logs = safeRead(wordbookKey, []);
  logs.unshift(payload);
  safeWrite(wordbookKey, logs);

  wordbookDate.value = "";
  wordbookUnit.value = "";
  wordbookCount.value = "";
  wordbookFeeling.value = "";
  wordbookHardWords.value = "";

  renderWordbookLogs();
}

function renderPracticeLogs() {
  const logs = safeRead(practiceKey, []);
  practiceLogList.innerHTML = "";
  practiceEmpty.style.display = logs.length ? "none" : "block";

  logs.slice(0, 8).forEach((item) => {
    const card = document.createElement("article");
    card.className = "log-item";
    card.innerHTML = `
      <strong>${item.date} · ${item.type}</strong>
      <span>材料：${item.material}</span>
      <span>今天最大问题：${item.problem}</span>
      <span>明天补法：${item.next}</span>
    `;
    practiceLogList.append(card);
  });
}

function savePracticeLog() {
  const payload = {
    date: practiceDate.value || getTodayKey(),
    type: practiceType.value.trim(),
    material: practiceMaterial.value.trim(),
    problem: practiceProblem.value.trim(),
    next: practiceNext.value.trim()
  };

  if (!payload.type || !payload.material || !payload.problem || !payload.next) {
    return;
  }

  const logs = safeRead(practiceKey, []);
  logs.unshift(payload);
  safeWrite(practiceKey, logs);

  practiceDate.value = "";
  practiceType.value = "";
  practiceMaterial.value = "";
  practiceProblem.value = "";
  practiceNext.value = "";

  renderPracticeLogs();
}

function renderErrorNote() {
  const errorState = safeRead(errorKey, {});
  const todayKey = getTodayKey();
  errorCorrection.value = errorState[todayKey] || "";
}

function saveErrorNote() {
  const text = errorCorrection.value.trim();
  const todayKey = getTodayKey();
  const errorState = safeRead(errorKey, {});
  errorState[todayKey] = text;
  safeWrite(errorKey, errorState);

  errorSaveTip.textContent = "已保存，明天还能接着看。";
  window.setTimeout(() => {
    errorSaveTip.textContent = "纠错笔记保存在这台设备里。";
  }, 2200);
}

function renderChecklist() {
  const todayKey = getTodayKey();
  const state = safeRead(storageKey, {});
  const todayState = state[todayKey] || {};

  checklistContainer.innerHTML = "";

  checklistTemplate.forEach((item) => {
    const label = document.createElement("label");
    label.className = "check-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(todayState[item.id]);
    checkbox.addEventListener("change", () => {
      const nextState = safeRead(storageKey, {});
      const nextDayState = nextState[todayKey] || {};
      nextDayState[item.id] = checkbox.checked;
      nextState[todayKey] = nextDayState;
      safeWrite(storageKey, nextState);
      updateStats();
    });

    const content = document.createElement("div");
    const title = document.createElement("strong");
    const note = document.createElement("span");
    title.textContent = item.title;
    note.textContent = item.note;
    content.append(title, note);

    label.append(checkbox, content);
    checklistContainer.append(label);
  });

  updateStats();
}

function isYesterday(lastDate, todayDate) {
  if (!lastDate) {
    return false;
  }

  const last = new Date(`${lastDate}T00:00:00`);
  const today = new Date(`${todayDate}T00:00:00`);
  return today.getTime() - last.getTime() === 24 * 60 * 60 * 1000;
}

function updateStats() {
  const todayKey = getTodayKey();
  const state = safeRead(storageKey, {});
  const todayState = state[todayKey] || {};
  const completed = checklistTemplate.filter((item) => todayState[item.id]).length;
  doneCount.textContent = `${completed} / ${checklistTemplate.length}`;

  const streakState = safeRead(streakKey, { streak: 0, lastCompletedDate: "" });
  const allDone = checklistTemplate.every((item) => todayState[item.id]);
  const alreadyMarked = streakState.lastCompletedDate === todayKey;

  if (allDone && !alreadyMarked) {
    const nextStreak = isYesterday(streakState.lastCompletedDate, todayKey)
      ? streakState.streak + 1
      : 1;
    safeWrite(streakKey, { streak: nextStreak, lastCompletedDate: todayKey });
  }

  if (!allDone && alreadyMarked) {
    safeWrite(streakKey, { streak: Math.max(streakState.streak - 1, 0), lastCompletedDate: "" });
  }

  const freshStreak = safeRead(streakKey, { streak: 0, lastCompletedDate: "" });
  streakCount.textContent = `${freshStreak.streak} 天`;
}

function renderNotes() {
  const todayKey = getTodayKey();
  const notesState = safeRead(notesKey, {});
  const current = notesState[todayKey] || { dailyFocus: "", weeklyReview: "" };
  dailyFocus.value = current.dailyFocus;
  weeklyReview.value = current.weeklyReview;
}

function persistNotes() {
  const todayKey = getTodayKey();
  const notesState = safeRead(notesKey, {});
  notesState[todayKey] = {
    dailyFocus: dailyFocus.value.trim(),
    weeklyReview: weeklyReview.value.trim()
  };
  safeWrite(notesKey, notesState);

  saveTip.textContent = "已保存，明天回来就知道先补什么。";
  window.setTimeout(() => {
    saveTip.textContent = "内容保存在这台设备的浏览器里。";
  }, 2200);
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn?.addEventListener("click", async () => {
  if (!deferredPrompt) {
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

saveWordbookBtn?.addEventListener("click", saveWordbookLog);
savePracticeBtn?.addEventListener("click", savePracticeLog);
saveErrorBtn?.addEventListener("click", saveErrorNote);
saveNotesBtn?.addEventListener("click", persistNotes);

if (window.location.protocol !== "file:" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

getCountdown();
setAdaptiveTarget();
renderWordbookLogs();
renderPracticeLogs();
renderErrorNote();
renderChecklist();
renderNotes();
