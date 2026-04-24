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

const wordDeck = document.getElementById("wordDeck");
const knownWordsCount = document.getElementById("knownWordsCount");
const reviewWordsCount = document.getElementById("reviewWordsCount");
const todayWordsCount = document.getElementById("todayWordsCount");
const wordFilterButtons = document.querySelectorAll("[data-word-filter]");

const listeningMaterial = document.getElementById("listeningMaterial");
const listeningIssue = document.getElementById("listeningIssue");
const listeningNext = document.getElementById("listeningNext");
const saveListeningBtn = document.getElementById("saveListeningBtn");
const listeningLogList = document.getElementById("listeningLogList");
const listeningEmpty = document.getElementById("listeningEmpty");

const readingMaterial = document.getElementById("readingMaterial");
const readingIssue = document.getElementById("readingIssue");
const readingNext = document.getElementById("readingNext");
const saveReadingBtn = document.getElementById("saveReadingBtn");
const readingLogList = document.getElementById("readingLogList");
const readingEmpty = document.getElementById("readingEmpty");

const writingPromptTitle = document.getElementById("writingPromptTitle");
const writingPromptGuide = document.getElementById("writingPromptGuide");
const writingDraft = document.getElementById("writingDraft");
const shufflePromptBtn = document.getElementById("shufflePromptBtn");
const saveWritingBtn = document.getElementById("saveWritingBtn");
const writingSaveTip = document.getElementById("writingSaveTip");

const mockDate = document.getElementById("mockDate");
const mockName = document.getElementById("mockName");
const mockListening = document.getElementById("mockListening");
const mockReading = document.getElementById("mockReading");
const mockWriting = document.getElementById("mockWriting");
const mockTotal = document.getElementById("mockTotal");
const mockNote = document.getElementById("mockNote");
const saveMockBtn = document.getElementById("saveMockBtn");
const mockRecordList = document.getElementById("mockRecordList");
const mockEmpty = document.getElementById("mockEmpty");

const storageKey = "cet4-study-checklist";
const streakKey = "cet4-study-streak";
const notesKey = "cet4-study-notes";
const wordStatusKey = "cet4-word-status";
const listeningLogKey = "cet4-listening-logs";
const readingLogKey = "cet4-reading-logs";
const writingKey = "cet4-writing-state";
const mockKey = "cet4-mock-records";

const checklistTemplate = [
  { id: "words", title: "背完今天的单词", note: "目标：完成今日词单，至少处理 8 张词卡" },
  { id: "listen", title: "完成一次听力训练", note: "目标：精听 1 段，并记录 1 个卡点" },
  { id: "read", title: "做完 1 篇阅读", note: "目标：保持阅读定位和速度，不让阅读掉线" },
  { id: "write", title: "完成 15 分钟写作练习", note: "目标：写完 1 段正文或一篇小作文草稿" },
  { id: "review", title: "睡前复盘 5 分钟", note: "目标：写下今天最需要补的 1 个点" }
];

const words = [
  { word: "benefit", meaning: "n./v. 好处；使受益", example: "Regular review can benefit your long-term memory.", tip: "作文和阅读高频词，常与 from 连用" },
  { word: "concentrate", meaning: "v. 集中注意力", example: "It is hard to concentrate when you are tired.", tip: "搭配 on，听力和写作都常见" },
  { word: "approach", meaning: "n./v. 方法；接近", example: "A smart approach can save a lot of time.", tip: "写作里常表示做事方法" },
  { word: "opportunity", meaning: "n. 机会", example: "College offers students many opportunities to grow.", tip: "作文万能词之一" },
  { word: "positive", meaning: "adj. 积极的；正面的", example: "A positive attitude helps us keep going.", tip: "常用于写作态度表达" },
  { word: "efficient", meaning: "adj. 高效的", example: "An efficient plan is better than blind effort.", tip: "适合写时间管理类作文" },
  { word: "improve", meaning: "v. 改善，提高", example: "Listening practice can improve your reaction speed.", tip: "基础但高频，一定要熟练" },
  { word: "available", meaning: "adj. 可获得的；可用的", example: "Many learning resources are available online.", tip: "阅读里很常见" },
  { word: "essential", meaning: "adj. 必要的；本质的", example: "Daily review is essential for vocabulary learning.", tip: "写作加分词" },
  { word: "focus", meaning: "v./n. 关注；焦点", example: "You should focus on your weakest part first.", tip: "搭配 on" },
  { word: "participate", meaning: "v. 参加", example: "Students are encouraged to participate in group discussions.", tip: "搭配 in" },
  { word: "pressure", meaning: "n. 压力", example: "Too much pressure may reduce learning efficiency.", tip: "常见心理话题词" },
  { word: "adapt", meaning: "v. 适应", example: "We need time to adapt to a new learning rhythm.", tip: "搭配 to" },
  { word: "reduce", meaning: "v. 减少", example: "A clear plan can reduce unnecessary stress.", tip: "作文里很常用" },
  { word: "challenge", meaning: "n./v. 挑战", example: "Listening is a real challenge for many students.", tip: "名词和动词都常见" },
  { word: "maintain", meaning: "v. 保持，维持", example: "It is important to maintain a stable study habit.", tip: "阅读和写作常用" },
  { word: "reasonable", meaning: "adj. 合理的", example: "A reasonable schedule is easier to follow.", tip: "写作评价型词汇" },
  { word: "independent", meaning: "adj. 独立的", example: "College students should become more independent.", tip: "校园话题高频" },
  { word: "perform", meaning: "v. 表现；执行", example: "She performed much better after regular practice.", tip: "真题阅读常见" },
  { word: "recommend", meaning: "v. 推荐", example: "Teachers often recommend repeated listening.", tip: "搭配 doing 或 that 从句" },
  { word: "remind", meaning: "v. 提醒", example: "The app reminds me to review every night.", tip: "搭配 sb. to do / of" },
  { word: "significant", meaning: "adj. 重要的；显著的", example: "There has been a significant improvement in his writing.", tip: "写作和阅读加分词" },
  { word: "specific", meaning: "adj. 具体的", example: "You need a specific goal for each study session.", tip: "写复盘时很有用" },
  { word: "solution", meaning: "n. 解决办法", example: "Recording mistakes is a useful solution.", tip: "问题解决类作文常用" },
  { word: "strategy", meaning: "n. 策略", example: "A smart listening strategy can raise your score.", tip: "学习计划高频词" },
  { word: "suffer", meaning: "v. 遭受", example: "Some students suffer from test anxiety.", tip: "搭配 from" },
  { word: "tend", meaning: "v. 倾向于", example: "We tend to forget words that are never reviewed.", tip: "搭配 to do" },
  { word: "transfer", meaning: "v. 转移；迁移", example: "Try to transfer new words into your writing.", tip: "单词会用比只会认更重要" },
  { word: "various", meaning: "adj. 各种各样的", example: "There are various ways to practice listening.", tip: "万能形容词" },
  { word: "aware", meaning: "adj. 意识到的", example: "You should be aware of your weak points.", tip: "搭配 be aware of" },
  { word: "effective", meaning: "adj. 有效的", example: "Short daily review is more effective than last-minute cramming.", tip: "作文高频褒义词" },
  { word: "evidence", meaning: "n. 证据", example: "Good examples can serve as evidence in writing.", tip: "议论文常见" },
  { word: "ignore", meaning: "v. 忽视", example: "Do not ignore reading while focusing on listening.", tip: "提醒型表达" },
  { word: "motivate", meaning: "v. 激励", example: "Visible progress can motivate students to continue.", tip: "搭配 sb. to do" },
  { word: "process", meaning: "n./v. 过程；处理", example: "Learning is a gradual process.", tip: "抽象表达常用" },
  { word: "resource", meaning: "n. 资源", example: "Online resources can support your daily practice.", tip: "复数形式高频" }
];

const writingPrompts = [
  { title: "How to Make Better Use of Time in College", guide: "可以从计划、专注和自我管理三个角度展开。" },
  { title: "Should College Students Develop One Practical Skill", guide: "可以从就业、成长和自信三个角度写。" },
  { title: "The Importance of Keeping a Healthy Lifestyle", guide: "可以从身体、学习效率和长期习惯写。" },
  { title: "Why Teamwork Matters for Young People", guide: "可以从沟通、效率和未来工作场景写。" },
  { title: "How to Reduce Stress Before an Important Exam", guide: "可以从计划、心态和行动三个层面展开。" }
];

let deferredPrompt = null;
let activeWordFilter = "today";

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

function daySeed() {
  const start = new Date("2026-01-01T00:00:00+08:00");
  const now = new Date();
  return Math.abs(Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function getTodayWords() {
  const seed = daySeed();
  const start = seed % words.length;
  const picked = [];

  for (let index = 0; index < 12; index += 1) {
    picked.push(words[(start + index) % words.length]);
  }

  return picked;
}

function renderWordStats() {
  const statusState = safeRead(wordStatusKey, {});
  const knownCount = Object.values(statusState).filter((value) => value === "known").length;
  const reviewCount = Object.values(statusState).filter((value) => value === "review").length;
  knownWordsCount.textContent = knownCount;
  reviewWordsCount.textContent = reviewCount;
  todayWordsCount.textContent = getTodayWords().length;
}

function getWordsForFilter() {
  const statusState = safeRead(wordStatusKey, {});

  if (activeWordFilter === "review") {
    return words.filter((item) => statusState[item.word] === "review");
  }

  if (activeWordFilter === "all") {
    return words;
  }

  return getTodayWords();
}

function markWord(word, status) {
  const statusState = safeRead(wordStatusKey, {});

  if (!status) {
    delete statusState[word];
  } else {
    statusState[word] = status;
  }

  safeWrite(wordStatusKey, statusState);
  renderWords();
}

function renderWords() {
  if (!wordDeck) {
    return;
  }

  const statusState = safeRead(wordStatusKey, {});
  const filteredWords = getWordsForFilter();

  wordDeck.innerHTML = "";

  if (filteredWords.length === 0) {
    const empty = document.createElement("article");
    empty.className = "word-card";
    empty.innerHTML = "<h3>今天没有待复习词卡</h3><p class='word-meta'>这很好，说明你把当前标记处理得差不多了，可以去学今日词单。</p>";
    wordDeck.append(empty);
  } else {
    filteredWords.forEach((item) => {
      const card = document.createElement("article");
      card.className = "word-card";

      const statusLabel = statusState[item.word] === "known"
        ? "已掌握"
        : statusState[item.word] === "review"
          ? "待复习"
          : "未标记";

      card.innerHTML = `
        <p class="mini-label">${statusLabel}</p>
        <h3>${item.word}</h3>
        <p class="word-meaning">${item.meaning}</p>
        <p class="word-example">${item.example}</p>
        <p class="word-meta">${item.tip}</p>
      `;

      const actions = document.createElement("div");
      actions.className = "action-row";

      const knownBtn = document.createElement("button");
      knownBtn.className = "small-btn";
      knownBtn.textContent = "标记已会";
      knownBtn.addEventListener("click", () => markWord(item.word, "known"));

      const reviewBtn = document.createElement("button");
      reviewBtn.className = "small-btn review";
      reviewBtn.textContent = "加入复习";
      reviewBtn.addEventListener("click", () => markWord(item.word, "review"));

      const clearBtn = document.createElement("button");
      clearBtn.className = "small-btn clear";
      clearBtn.textContent = "清除标记";
      clearBtn.addEventListener("click", () => markWord(item.word, ""));

      actions.append(knownBtn, reviewBtn, clearBtn);
      card.append(actions);
      wordDeck.append(card);
    });
  }

  renderWordStats();
}

function setupWordFilters() {
  wordFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeWordFilter = button.dataset.wordFilter;
      wordFilterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderWords();
    });
  });
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
  saveTip.textContent = "已保存，你下次回来还能继续看。";
  window.setTimeout(() => {
    saveTip.textContent = "内容保存在这台设备的浏览器里。";
  }, 2200);
}

function renderListeningLogs() {
  const logs = safeRead(listeningLogKey, []);
  listeningLogList.innerHTML = "";
  listeningEmpty.style.display = logs.length ? "none" : "block";

  logs.slice(0, 6).forEach((item) => {
    const card = document.createElement("article");
    card.className = "log-item";
    card.innerHTML = `
      <strong>${item.material}</strong>
      <span>卡点：${item.issue}</span>
      <span>下次改法：${item.next}</span>
      <span>${item.date}</span>
    `;
    listeningLogList.append(card);
  });
}

function saveListeningLog() {
  const material = listeningMaterial.value.trim();
  const issue = listeningIssue.value.trim();
  const next = listeningNext.value.trim();

  if (!material || !issue || !next) {
    return;
  }

  const logs = safeRead(listeningLogKey, []);
  logs.unshift({
    material,
    issue,
    next,
    date: getTodayKey()
  });
  safeWrite(listeningLogKey, logs);
  listeningMaterial.value = "";
  listeningIssue.value = "";
  listeningNext.value = "";
  renderListeningLogs();
}

function renderReadingLogs() {
  const logs = safeRead(readingLogKey, []);
  readingLogList.innerHTML = "";
  readingEmpty.style.display = logs.length ? "none" : "block";

  logs.slice(0, 6).forEach((item) => {
    const card = document.createElement("article");
    card.className = "log-item";
    card.innerHTML = `
      <strong>${item.material}</strong>
      <span>问题：${item.issue}</span>
      <span>下次改法：${item.next}</span>
      <span>${item.date}</span>
    `;
    readingLogList.append(card);
  });
}

function saveReadingLog() {
  const material = readingMaterial.value.trim();
  const issue = readingIssue.value.trim();
  const next = readingNext.value.trim();

  if (!material || !issue || !next) {
    return;
  }

  const logs = safeRead(readingLogKey, []);
  logs.unshift({
    material,
    issue,
    next,
    date: getTodayKey()
  });
  safeWrite(readingLogKey, logs);
  readingMaterial.value = "";
  readingIssue.value = "";
  readingNext.value = "";
  renderReadingLogs();
}

function getWritingState() {
  return safeRead(writingKey, { promptIndex: 0, drafts: {} });
}

function renderWritingPrompt() {
  const state = getWritingState();
  const prompt = writingPrompts[state.promptIndex] || writingPrompts[0];
  writingPromptTitle.textContent = prompt.title;
  writingPromptGuide.textContent = prompt.guide;
  writingDraft.value = state.drafts[prompt.title] || "";
}

function shuffleWritingPrompt() {
  const state = getWritingState();
  state.promptIndex = (state.promptIndex + 1) % writingPrompts.length;
  safeWrite(writingKey, state);
  renderWritingPrompt();
}

function saveWritingDraft() {
  const state = getWritingState();
  const prompt = writingPrompts[state.promptIndex] || writingPrompts[0];
  state.drafts[prompt.title] = writingDraft.value.trim();
  safeWrite(writingKey, state);
  writingSaveTip.textContent = "作文草稿已保存。";
  window.setTimeout(() => {
    writingSaveTip.textContent = "草稿保存在这台设备的浏览器里。";
  }, 2200);
}

function renderMockRecords() {
  const records = safeRead(mockKey, []);
  mockRecordList.innerHTML = "";
  mockEmpty.style.display = records.length ? "none" : "block";

  records.forEach((item) => {
    const card = document.createElement("article");
    card.className = "record-item";
    card.innerHTML = `
      <strong>${item.name} · ${item.date}</strong>
      <span>听力 ${item.listening} ｜ 阅读 ${item.reading} ｜ 写作翻译 ${item.writing} ｜ 总分 ${item.total}</span>
      <span class="record-note">复盘：${item.note}</span>
    `;
    mockRecordList.append(card);
  });
}

function saveMockRecord() {
  const payload = {
    date: mockDate.value,
    name: mockName.value.trim(),
    listening: mockListening.value.trim(),
    reading: mockReading.value.trim(),
    writing: mockWriting.value.trim(),
    total: mockTotal.value.trim(),
    note: mockNote.value.trim()
  };

  if (!payload.date || !payload.name || !payload.total) {
    return;
  }

  const records = safeRead(mockKey, []);
  records.unshift(payload);
  safeWrite(mockKey, records);

  mockDate.value = "";
  mockName.value = "";
  mockListening.value = "";
  mockReading.value = "";
  mockWriting.value = "";
  mockTotal.value = "";
  mockNote.value = "";

  renderMockRecords();
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

saveNotesBtn?.addEventListener("click", persistNotes);
saveListeningBtn?.addEventListener("click", saveListeningLog);
saveReadingBtn?.addEventListener("click", saveReadingLog);
shufflePromptBtn?.addEventListener("click", shuffleWritingPrompt);
saveWritingBtn?.addEventListener("click", saveWritingDraft);
saveMockBtn?.addEventListener("click", saveMockRecord);

if (window.location.protocol !== "file:" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

getCountdown();
setupWordFilters();
renderWords();
renderChecklist();
renderNotes();
renderListeningLogs();
renderReadingLogs();
renderWritingPrompt();
renderMockRecords();
