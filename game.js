const BOARD_SIZE = 6;
const COLORS = ["#ff6b6b", "#4ecdc4", "#f7b32b", "#5f6af2", "#8bce59", "#ff8e3c"];
const BLOCK_SIZE_WEIGHTS = [
  { size: 3, weight: 0.5 },
  { size: 4, weight: 0.3 },
  { size: 5, weight: 0.2 },
];
const EASY_TARGET_SCORE = 5000;
const DIFFICULTY_START = {
  initialFilledMin: 10,
  initialFilledMax: 15,
  collapseRiseByBlockSize: { 3: 6, 4: 8, 5: 10 },
  collapseDropByLineCount: { 1: 13, 2: 24, 3: 34 },
  noClearThreshold: 3,
  noClearPenalty: 10,
  skipPenalty: 12,
  passiveTurnRise: 1,
  dangerScoreBoostThreshold: 82,
  dangerCollapseThreshold: 93,
  dangerAdjacentChance: 0.35,
  maxInitialDepth: 3,
  deepStackChance: 0.16,
  chainShockChance: 0.38,
  chainShockCells: 2,
  shockScorePerCell: 16,
  linkedClearScorePerCell: 26,
};
const DIFFICULTY_END = {
  initialFilledMin: 14,
  initialFilledMax: 20,
  collapseRiseByBlockSize: { 3: 9, 4: 11, 5: 14 },
  collapseDropByLineCount: { 1: 9, 2: 16, 3: 24 },
  noClearThreshold: 2,
  noClearPenalty: 15,
  skipPenalty: 18,
  passiveTurnRise: 3,
  dangerScoreBoostThreshold: 74,
  dangerCollapseThreshold: 86,
  dangerAdjacentChance: 0.6,
  maxInitialDepth: 4,
  deepStackChance: 0.34,
  chainShockChance: 0.72,
  chainShockCells: 5,
  shockScorePerCell: 28,
  linkedClearScorePerCell: 38,
};
const SHAPES = {
  3: [
    [[0, 0], [1, 0], [2, 0]],
    [[0, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [1, 1]],
    [[0, 1], [1, 0], [1, 1]],
  ],
  4: [
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [2, 0], [1, 1]],
    [[0, 0], [0, 1], [0, 2], [1, 2]],
    [[1, 0], [1, 1], [1, 2], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [2, 1]],
  ],
  5: [
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
    [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 0], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  ],
};

const SCORE_TABLE = {
  1: 100,
  2: 300,
  3: 600,
};

const BEST_SCORE_KEY = "block-stack-best-score-v1";
const GAMES_SINCE_ALL_CLEAR_KEY = "block-stack-games-since-all-clear-v1";
const PLAYER_ID_KEY = "block-stack-player-id-v1";
const LEADERBOARD_KEY = "block-stack-leaderboard-v1";
const AUDIO_ENABLED_KEY = "block-stack-audio-enabled-v1";
const BGM_ENABLED_KEY = "block-stack-bgm-enabled-v1";
const LOGIN_INFO_KEY = "block-stack-login-info-v1";
const ALL_CLEAR_GUARANTEE_GAP = 5;
const BASE_TURN_COUNT = 15;
const LEADERBOARD_LIMIT = 10;
const PLAYER_ID_MIN_LENGTH = 2;
const PLAYER_ID_MAX_LENGTH = 16;
const ALL_CLEAR_BONUS_BASE = 1400;
const ALL_CLEAR_BONUS_GUARANTEE = 1000;
const CHAIN_STEP_DELAY_MS = 110;
const CHAIN_STEP_MAX_DELAY_MS = 170;
const PRE_BLAST_DELAY_MS = 160;
const PRE_BLAST_MAX_DELAY_MS = 240;
const LINKED_BLAST_DELAY_MS = 90;
const LINKED_BLAST_MIN_DELAY_MS = 42;
const COMBO_VOICE_COOLDOWN_MS = 700;
const ENDING_FILL_DURATION_MS = 640;
const ENDING_RISE_DURATION_MS = 980;
const PREVIEW_GRID_SIZE = 5;
const LOW_TURN_WARNING_THRESHOLD = 5;
const BOARD_COLOR_FLASH_MIN_POPS = 15;
const BOARD_COLOR_FLASH_MS = 360;
const SCREEN_COLOR_FLASH_MS = 170;
const SOUND_GAIN_MULTIPLIER = 1.3;
const BGM_GAIN_MULTIPLIER = 4;
const SKIP_REROLL_MAX_ATTEMPTS = 12;

const elements = {
  scoreValue: document.getElementById("scoreValue"),
  bestScoreValue: document.getElementById("bestScoreValue"),
  collapseValue: document.getElementById("collapseValue"),
  rankingButton: document.getElementById("rankingButton"),
  settingsButton: document.getElementById("settingsButton"),
  collapseWrap: document.querySelector(".collapse-wrap"),
  collapseBar: document.getElementById("collapseBar"),
  board: document.getElementById("board"),
  currentBlockView: document.getElementById("currentBlockView"),
  skipButton: document.getElementById("skipButton"),
  message: document.getElementById("message"),
  gameOverLayer: document.getElementById("gameOverLayer"),
  endingBoardFx: document.getElementById("endingBoardFx"),
  endingCard: document.getElementById("endingCard"),
  endingReason: document.getElementById("endingReason"),
  endingScoreValue: document.getElementById("endingScoreValue"),
  endingContinueButton: document.getElementById("endingContinueButton"),
  endingNewGameButton: document.getElementById("endingNewGameButton"),
  settingsModal: document.getElementById("settingsModal"),
  settingsBackdrop: document.getElementById("settingsBackdrop"),
  settingsCloseButton: document.getElementById("settingsCloseButton"),
  soundSwitchButton: document.getElementById("soundSwitchButton"),
  soundSwitchState: document.getElementById("soundSwitchState"),
  bgmSwitchButton: document.getElementById("bgmSwitchButton"),
  bgmSwitchState: document.getElementById("bgmSwitchState"),
  profileButton: document.getElementById("profileButton"),
  profilePanel: document.getElementById("profilePanel"),
  playerIdInput: document.getElementById("playerIdInput"),
  editPlayerIdButton: document.getElementById("editPlayerIdButton"),
  savePlayerIdButton: document.getElementById("savePlayerIdButton"),
  loginInfoValue: document.getElementById("loginInfoValue"),
  linkAccountButton: document.getElementById("linkAccountButton"),
  accountProvidersInfo: document.getElementById("accountProvidersInfo"),
  rankingList: document.getElementById("rankingList"),
  rankingModal: document.getElementById("rankingModal"),
  rankingBackdrop: document.getElementById("rankingBackdrop"),
  rankingCloseButton: document.getElementById("rankingCloseButton"),
  myRankTabButton: document.getElementById("myRankTabButton"),
  top10TabButton: document.getElementById("top10TabButton"),
  myRankView: document.getElementById("myRankView"),
  top10View: document.getElementById("top10View"),
  myRankPlayerValue: document.getElementById("myRankPlayerValue"),
  myRankScoreValue: document.getElementById("myRankScoreValue"),
  myRankPositionValue: document.getElementById("myRankPositionValue"),
  settingsNotice: document.getElementById("settingsNotice"),
};

const audioState = {
  ctx: null,
  enabled: getAudioEnabled(),
  bgmEnabled: getBgmEnabled(),
  lastVoiceAt: 0,
  bgmTimerId: null,
  bgmStep: 0,
};

const initialPlayerId = getPlayerId();

const state = {
  board: createBoard(),
  boardCellEls: createBoardCellRefs(),
  score: 0,
  bestScore: getBestScore(),
  collapse: BASE_TURN_COUNT,
  currentBlock: null,
  freeSkipUsed: false,
  noClearStreak: 0,
  clearStreakTurns: 0,
  continueUsedThisGame: false,
  runStartBest: getBestScore(),
  hoverCell: null,
  gameOver: false,
  endingSequenceRunning: false,
  isDragging: false,
  dragGhostEl: null,
  dragPointerId: null,
  dragGrabOffset: { x: 0, y: 0 },
  dragGhostMetrics: { cellSize: 22, gap: 4 },
  dragBoardMetrics: null,
  dragMoveRafId: null,
  pendingDragPoint: null,
  dragPointerPos: null,
  previewKeys: new Set(),
  turnsPlayed: 0,
  gamesSinceAllClear: getGamesSinceAllClear(),
  allClearGuaranteeActive: false,
  allClearAwardedThisRun: false,
  isResolving: false,
  settingsOpen: false,
  rankingOpen: false,
  playerId: initialPlayerId,
  runPlayerId: initialPlayerId,
  loginInfo: getLoginInfo(),
  profileOpen: false,
  profileEditing: false,
  accountInfoOpen: false,
  rankingView: "mine",
  leaderboard: getLeaderboard(),
  rankingSavedThisGame: false,
  boardFlashTimeoutId: null,
  screenFlashTimeoutId: null,
  message: "현재 블록을 드래그해서 보드에 놓으세요.",
};

function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({ stack: [] }))
  );
}

function createBoardCellRefs() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function readBoardMetrics() {
  const rect = elements.board.getBoundingClientRect();
  const style = window.getComputedStyle(elements.board);
  const paddingX = Number.parseFloat(style.paddingLeft || "0") || 0;
  const paddingY = Number.parseFloat(style.paddingTop || "0") || 0;
  const gap = Number.parseFloat(style.gap || "8") || 8;
  const usableWidth = rect.width - paddingX * 2 - gap * (BOARD_SIZE - 1);
  const usableHeight = rect.height - paddingY * 2 - gap * (BOARD_SIZE - 1);
  return {
    rect,
    paddingX,
    paddingY,
    gap,
    cellWidth: usableWidth / BOARD_SIZE,
    cellHeight: usableHeight / BOARD_SIZE,
  };
}

function getBestScore() {
  const saved = Number(localStorage.getItem(BEST_SCORE_KEY));
  return Number.isFinite(saved) && saved > 0 ? saved : 0;
}

function getGamesSinceAllClear() {
  const saved = Number(localStorage.getItem(GAMES_SINCE_ALL_CLEAR_KEY));
  return Number.isFinite(saved) && saved >= 0 ? Math.floor(saved) : 0;
}

function setGamesSinceAllClear(value) {
  const safe = Math.max(0, Math.floor(value));
  localStorage.setItem(GAMES_SINCE_ALL_CLEAR_KEY, String(safe));
}

function setBestScore(score) {
  localStorage.setItem(BEST_SCORE_KEY, String(score));
}

function getAudioEnabled() {
  const saved = localStorage.getItem(AUDIO_ENABLED_KEY);
  return saved !== "0";
}

function setAudioEnabled(enabled) {
  localStorage.setItem(AUDIO_ENABLED_KEY, enabled ? "1" : "0");
}

function getBgmEnabled() {
  const saved = localStorage.getItem(BGM_ENABLED_KEY);
  return saved !== "0";
}

function setBgmEnabled(enabled) {
  localStorage.setItem(BGM_ENABLED_KEY, enabled ? "1" : "0");
}

function getLoginInfo() {
  const saved = String(localStorage.getItem(LOGIN_INFO_KEY) || "").trim();
  return saved || "게스트";
}

function setLoginInfo(info) {
  localStorage.setItem(LOGIN_INFO_KEY, info);
}

function normalizePlayerId(value) {
  const compact = String(value || "").trim().replace(/\s+/g, " ");
  const safe = compact.replace(/[^0-9A-Za-z가-힣 _-]/g, "");
  return safe.slice(0, PLAYER_ID_MAX_LENGTH).trim();
}

function makeGuestId() {
  return `게스트${String(Date.now() % 10000).padStart(4, "0")}`;
}

function getPlayerId() {
  const saved = normalizePlayerId(localStorage.getItem(PLAYER_ID_KEY));
  if (saved.length >= PLAYER_ID_MIN_LENGTH) return saved;
  const generated = makeGuestId();
  localStorage.setItem(PLAYER_ID_KEY, generated);
  return generated;
}

function setPlayerId(playerId) {
  localStorage.setItem(PLAYER_ID_KEY, playerId);
}

function sortLeaderboard(entries) {
  return entries.slice().sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aAt = Date.parse(a.at) || 0;
    const bAt = Date.parse(b.at) || 0;
    return aAt - bAt;
  });
}

function getLeaderboard() {
  try {
    const raw = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    const parsed = [];
    for (const entry of raw) {
      const playerId = normalizePlayerId(entry?.playerId);
      const score = Number(entry?.score);
      if (playerId.length < PLAYER_ID_MIN_LENGTH) continue;
      if (!Number.isFinite(score) || score <= 0) continue;
      parsed.push({
        playerId,
        score: Math.floor(score),
        at: typeof entry?.at === "string" ? entry.at : new Date().toISOString(),
      });
    }
    return sortLeaderboard(parsed).slice(0, LEADERBOARD_LIMIT);
  } catch (_error) {
    return [];
  }
}

function setLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function addScoreToLeaderboard(playerId, score) {
  if (!Number.isFinite(score) || score <= 0) return;
  const entry = {
    playerId,
    score: Math.floor(score),
    at: new Date().toISOString(),
  };
  state.leaderboard = sortLeaderboard([entry, ...state.leaderboard]).slice(0, LEADERBOARD_LIMIT);
  setLeaderboard(state.leaderboard);
}

function formatRankingDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
}

function setSettingsNotice(message = "", type = "") {
  if (!elements.settingsNotice) return;
  elements.settingsNotice.textContent = message;
  elements.settingsNotice.classList.remove("error", "success");
  if (type) {
    elements.settingsNotice.classList.add(type);
  }
}

function getBestByPlayerEntries(sourceEntries = state.leaderboard) {
  const bestByPlayer = new Map();
  for (const entry of sourceEntries) {
    const prev = bestByPlayer.get(entry.playerId);
    const entryAt = Date.parse(entry.at) || 0;
    const prevAt = Date.parse(prev?.at) || 0;
    if (!prev || entry.score > prev.score || (entry.score === prev.score && entryAt < prevAt)) {
      bestByPlayer.set(entry.playerId, {
        playerId: entry.playerId,
        score: entry.score,
        at: entry.at,
      });
    }
  }
  return sortLeaderboard(Array.from(bestByPlayer.values()));
}

function getBestRankingEntriesWithCurrentPlayer() {
  const entries = getBestByPlayerEntries();
  const currentIndex = entries.findIndex((entry) => entry.playerId === state.runPlayerId);
  const savedBest = currentIndex >= 0 ? entries[currentIndex].score : 0;
  const liveBest = Math.max(savedBest, Math.floor(Math.max(0, state.score)));
  if (liveBest <= 0) return entries;

  const next = entries.filter((entry) => entry.playerId !== state.runPlayerId);
  next.push({
    playerId: state.runPlayerId,
    score: liveBest,
    at: new Date().toISOString(),
    temp: liveBest > savedBest,
  });
  return sortLeaderboard(next);
}

function getCurrentRankInfo() {
  const entries = getBestRankingEntriesWithCurrentPlayer();
  if (entries.length === 0) {
    return {
      playerId: state.runPlayerId,
      score: 0,
      position: null,
      total: 0,
    };
  }

  const mine = entries.findIndex((entry) => entry.playerId === state.runPlayerId);
  const myScore = mine >= 0 ? entries[mine].score : 0;
  return {
    playerId: state.runPlayerId,
    score: myScore,
    position: mine >= 0 ? mine + 1 : null,
    total: entries.length,
  };
}

function renderRankingList() {
  if (!elements.rankingList) return;
  elements.rankingList.innerHTML = "";
  const entries = getBestRankingEntriesWithCurrentPlayer().slice(0, LEADERBOARD_LIMIT);

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "ranking-empty";
    empty.textContent = "아직 등록된 기록이 없습니다.";
    elements.rankingList.appendChild(empty);
    return;
  }

  for (const entry of entries) {
    const row = document.createElement("li");

    const player = document.createElement("span");
    player.className = "rank-player";
    player.textContent = entry.temp ? `${entry.playerId} (갱신됨)` : entry.playerId;

    const meta = document.createElement("span");
    meta.className = "rank-meta";

    const score = document.createElement("span");
    score.className = "rank-score";
    score.textContent = String(entry.score);

    const date = document.createElement("span");
    date.className = "rank-date";
    date.textContent = entry.temp ? "방금" : formatRankingDate(entry.at);

    meta.appendChild(score);
    meta.appendChild(date);
    row.appendChild(player);
    row.appendChild(meta);
    elements.rankingList.appendChild(row);
  }
}

function renderMyRankView() {
  const rank = getCurrentRankInfo();
  if (elements.myRankPlayerValue) {
    elements.myRankPlayerValue.textContent = rank.playerId;
  }
  if (elements.myRankScoreValue) {
    elements.myRankScoreValue.textContent = String(rank.score);
  }
  if (elements.myRankPositionValue) {
    elements.myRankPositionValue.textContent = rank.position
      ? `${rank.position}위 / ${rank.total}명`
      : "기록 없음";
  }
}

function updateModalBodyLock() {
  document.body.classList.toggle("settings-open", state.settingsOpen || state.rankingOpen);
}

function renderSwitchButton(button, stateEl, enabled) {
  if (!button || !stateEl) return;
  button.classList.toggle("on", enabled);
  button.classList.toggle("off", !enabled);
  button.setAttribute("aria-pressed", enabled ? "true" : "false");
  stateEl.textContent = enabled ? "ON" : "OFF";
}

function renderProfileState() {
  if (elements.profilePanel) {
    elements.profilePanel.classList.toggle("hidden", !state.profileOpen);
  }
  if (elements.playerIdInput) {
    if (!state.profileEditing) {
      elements.playerIdInput.value = state.playerId;
    }
    elements.playerIdInput.readOnly = !state.profileEditing;
  }
  if (elements.savePlayerIdButton) {
    elements.savePlayerIdButton.classList.toggle("hidden", !state.profileEditing);
  }
  if (elements.accountProvidersInfo) {
    elements.accountProvidersInfo.classList.toggle("hidden", !state.accountInfoOpen);
  }
}

function renderRankingViewState() {
  const mine = state.rankingView === "mine";
  if (elements.myRankTabButton) {
    elements.myRankTabButton.classList.toggle("active", mine);
  }
  if (elements.top10TabButton) {
    elements.top10TabButton.classList.toggle("active", !mine);
  }
  if (elements.myRankView) {
    elements.myRankView.classList.toggle("hidden", !mine);
  }
  if (elements.top10View) {
    elements.top10View.classList.toggle("hidden", mine);
  }
}

function syncSettingsFields() {
  renderSwitchButton(elements.soundSwitchButton, elements.soundSwitchState, audioState.enabled);
  renderSwitchButton(elements.bgmSwitchButton, elements.bgmSwitchState, audioState.bgmEnabled);
  if (elements.loginInfoValue) {
    elements.loginInfoValue.textContent = state.loginInfo;
  }
  renderProfileState();
}

function syncRankingFields() {
  renderRankingList();
  renderMyRankView();
  renderRankingViewState();
}

function closeSettingsModal() {
  if (!state.settingsOpen || !elements.settingsModal) return;
  state.settingsOpen = false;
  state.profileOpen = false;
  state.profileEditing = false;
  state.accountInfoOpen = false;
  elements.settingsModal.classList.add("hidden");
  updateModalBodyLock();
}

function openSettingsModal() {
  if (state.settingsOpen || !elements.settingsModal) return;
  closeRankingModal();
  endDragInteraction();
  state.settingsOpen = true;
  state.profileOpen = false;
  state.profileEditing = false;
  state.accountInfoOpen = false;
  elements.settingsModal.classList.remove("hidden");
  updateModalBodyLock();
  setSettingsNotice("");
  syncSettingsFields();
}

function closeRankingModal() {
  if (!state.rankingOpen || !elements.rankingModal) return;
  state.rankingOpen = false;
  elements.rankingModal.classList.add("hidden");
  updateModalBodyLock();
}

function openRankingModal() {
  if (state.rankingOpen || !elements.rankingModal) return;
  closeSettingsModal();
  state.rankingOpen = true;
  state.rankingView = "mine";
  elements.rankingModal.classList.remove("hidden");
  updateModalBodyLock();
  syncRankingFields();
}

function setRankingView(view) {
  state.rankingView = view === "top10" ? "top10" : "mine";
  syncRankingFields();
}

function toggleProfilePanel() {
  state.profileOpen = !state.profileOpen;
  if (!state.profileOpen) {
    state.profileEditing = false;
    state.accountInfoOpen = false;
  }
  setSettingsNotice("");
  syncSettingsFields();
}

function setProfileEditing(editing) {
  state.profileEditing = editing;
  renderProfileState();
  if (editing && elements.playerIdInput) {
    elements.playerIdInput.focus();
    elements.playerIdInput.select();
  }
}

function enablePlayerIdEdit() {
  if (!state.profileOpen) {
    state.profileOpen = true;
    syncSettingsFields();
  }
  setProfileEditing(true);
}

function savePlayerIdFromInput() {
  if (!state.profileEditing) return;
  const next = normalizePlayerId(elements.playerIdInput?.value || "");
  if (next.length < PLAYER_ID_MIN_LENGTH) {
    setSettingsNotice("아이디는 2자 이상으로 입력해 주세요.", "error");
    return;
  }
  state.playerId = next;
  setPlayerId(next);
  setProfileEditing(false);
  syncSettingsFields();
  setSettingsNotice("아이디를 저장했습니다.", "success");
}

function toggleAccountProvidersInfo() {
  state.accountInfoOpen = !state.accountInfoOpen;
  syncSettingsFields();
}

function toggleSoundEnabled() {
  audioState.enabled = !audioState.enabled;
  setAudioEnabled(audioState.enabled);
  if (audioState.enabled) {
    ensureAudioContext({ force: true });
  }
  if (!audioState.enabled && !audioState.bgmEnabled && audioState.ctx && audioState.ctx.state !== "closed") {
    audioState.ctx.suspend().catch(() => {
      // Ignore suspend failures.
    });
  }
  syncSettingsFields();
}

function toggleBgmEnabled() {
  audioState.bgmEnabled = !audioState.bgmEnabled;
  setBgmEnabled(audioState.bgmEnabled);
  if (audioState.bgmEnabled) {
    ensureAudioContext({ force: true });
  }
  syncBgmPlayback();
  syncSettingsFields();
}

function clearLeaderboardRecords() {
  const confirmed = window.confirm("랭킹 기록을 모두 삭제할까요?");
  if (!confirmed) return;
  state.leaderboard = [];
  setLeaderboard(state.leaderboard);
  renderRankingList();
  setSettingsNotice("랭킹을 초기화했습니다.", "success");
}

function commitRankingIfNeeded() {
  if (state.rankingSavedThisGame) return;
  if (!state.gameOver) return;
  if (!Number.isFinite(state.score) || state.score <= 0) {
    state.rankingSavedThisGame = true;
    return;
  }
  addScoreToLeaderboard(state.runPlayerId, state.score);
  state.rankingSavedThisGame = true;
  syncRankingFields();
}

function topColor(cell) {
  return cell.stack.length > 0 ? cell.stack[cell.stack.length - 1] : null;
}

function clampCollapse(value) {
  // collapse field is reused as "remaining turns" meter.
  return Math.max(0, Math.floor(value));
}

function ensureAudioContext(options = {}) {
  const { force = false } = options;
  if (!force && !audioState.enabled) return null;
  if (!window.AudioContext && !window.webkitAudioContext) {
    audioState.enabled = false;
    audioState.bgmEnabled = false;
    return null;
  }
  if (!audioState.ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioState.ctx = new AudioCtx();
  }
  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume().catch(() => {
      // Ignore resume failures until next gesture.
    });
  }
  return audioState.ctx;
}

function playTone(ctx, {
  frequency = 440,
  frequencyEnd = null,
  duration = 0.09,
  start = ctx.currentTime,
  type = "triangle",
  gain = 0.04,
} = {}) {
  // Prevent queued bursts while AudioContext is suspended by autoplay policy.
  if (!ctx || ctx.state !== "running") return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const finalGain = Math.min(0.25, Math.max(0.0001, gain * SOUND_GAIN_MULTIPLIER));
  osc.type = type;
  osc.frequency.value = frequency;
  if (Number.isFinite(frequencyEnd)) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, frequencyEnd), start + duration);
  }
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(finalGain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playBgmStep() {
  if (!audioState.bgmEnabled) return;
  const ctx = ensureAudioContext({ force: true });
  if (!ctx || ctx.state !== "running") return;
  const melody = [262, 294, 330, 392, 349, 330, 294, 262];
  const bass = [131, 147, 165, 196, 175, 165, 147, 131];
  const step = audioState.bgmStep % melody.length;
  const now = ctx.currentTime + 0.01;
  playTone(ctx, {
    frequency: melody[step],
    duration: 0.22,
    start: now,
    type: "triangle",
    gain: 0.018 * BGM_GAIN_MULTIPLIER,
  });
  playTone(ctx, {
    frequency: bass[step],
    duration: 0.24,
    start: now,
    type: "sine",
    gain: 0.013 * BGM_GAIN_MULTIPLIER,
  });
  audioState.bgmStep += 1;
}

function startBgmLoop() {
  if (!audioState.bgmEnabled) return;
  if (audioState.bgmTimerId !== null) return;
  audioState.bgmStep = 0;
  playBgmStep();
  audioState.bgmTimerId = window.setInterval(playBgmStep, 290);
}

function stopBgmLoop() {
  if (audioState.bgmTimerId === null) return;
  window.clearInterval(audioState.bgmTimerId);
  audioState.bgmTimerId = null;
}

function syncBgmPlayback() {
  if (audioState.bgmEnabled) {
    startBgmLoop();
  } else {
    stopBgmLoop();
  }
  if (!audioState.enabled && !audioState.bgmEnabled && audioState.ctx && audioState.ctx.state !== "closed") {
    audioState.ctx.suspend().catch(() => {
      // Ignore suspend failures.
    });
  }
}

function playPlacementSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, { frequency: 310, duration: 0.06, start: now, type: "sine", gain: 0.03 });
}

function playClearSound(linesCleared, scoreGain) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = Math.min(5, Math.max(2, linesCleared + 2));
  playTone(ctx, {
    frequency: 120 + linesCleared * 18,
    duration: 0.1,
    start: now,
    type: "sawtooth",
    gain: 0.028,
  });
  for (let i = 0; i < notes; i += 1) {
    const frequency = 460 + i * 96 + linesCleared * 20;
    playTone(ctx, {
      frequency,
      duration: 0.095,
      start: now + 0.02 + i * 0.05,
      type: "square",
      gain: 0.04,
    });
  }
  if (scoreGain >= 600) {
    playTone(ctx, {
      frequency: 1060,
      duration: 0.14,
      start: now + notes * 0.05,
      type: "triangle",
      gain: 0.06,
    });
  }
}

function playLinkedBurstSound({ cells = 1, wave = 1, totalCells = 1 } = {}) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const power = Math.min(12, cells + Math.floor(totalCells / 3));
  const hits = Math.min(7, Math.max(2, Math.ceil(cells / 2) + Math.floor(totalCells / 6)));
  const cadence = Math.max(0.02, 0.072 - power * 0.003 - wave * 0.0018);
  const basePitch = 420 + Math.min(140, cells * 18);

  for (let i = 0; i < hits; i += 1) {
    const start = now + i * cadence;
    playTone(ctx, {
      frequency: basePitch + i * 24,
      frequencyEnd: 300 + i * 10,
      duration: 0.07,
      start,
      type: "sine",
      gain: 0.018 + Math.min(0.022, cells * 0.0032),
    });
    playTone(ctx, {
      frequency: 690 + i * 20 + wave * 18,
      frequencyEnd: 520 + i * 6,
      duration: 0.045,
      start: start + 0.01,
      type: "triangle",
      gain: 0.012 + Math.min(0.014, totalCells * 0.0012),
    });
  }

  if (cells >= 5 || totalCells >= 12) {
    playTone(ctx, {
      frequency: 360 + Math.min(80, cells * 8),
      frequencyEnd: 260,
      duration: 0.1,
      start: now + hits * cadence * 0.35,
      type: "triangle",
      gain: 0.016,
    });
  }
}

function playComboVoiceCue(text = "굿", options = {}) {
  const nowMs = Date.now();
  if (nowMs - audioState.lastVoiceAt < COMBO_VOICE_COOLDOWN_MS) return false;
  audioState.lastVoiceAt = nowMs;
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  const now = ctx.currentTime;
  const cue = (text || "").toLowerCase();
  const volume = options.volume ?? 0.9;

  if (cue.includes("wow") || cue.includes("와")) {
    playTone(ctx, {
      frequency: 290,
      frequencyEnd: 220,
      duration: 0.2,
      start: now,
      type: "sawtooth",
      gain: 0.03 * volume,
    });
    playTone(ctx, {
      frequency: 520,
      frequencyEnd: 420,
      duration: 0.22,
      start: now + 0.04,
      type: "triangle",
      gain: 0.024 * volume,
    });
    playTone(ctx, {
      frequency: 760,
      frequencyEnd: 560,
      duration: 0.24,
      start: now + 0.09,
      type: "sine",
      gain: 0.02 * volume,
    });
    return true;
  }

  playTone(ctx, {
    frequency: 360,
    frequencyEnd: 270,
    duration: 0.18,
    start: now,
    type: "triangle",
    gain: 0.026 * volume,
  });
  playTone(ctx, {
    frequency: 430,
    frequencyEnd: 300,
    duration: 0.22,
    start: now + 0.06,
    type: "sine",
    gain: 0.022 * volume,
  });
  return true;
}

function playDopamineClearSound({ lines = 2, chain = 1 } = {}) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = Math.min(6, 3 + lines + Math.floor(chain / 2));
  const step = Math.max(0.024, 0.056 - (lines - 2) * 0.006 - Math.max(0, chain - 1) * 0.003);

  playTone(ctx, {
    frequency: 260 + lines * 20,
    frequencyEnd: 180,
    duration: 0.11,
    start: now,
    type: "sawtooth",
    gain: 0.028,
  });

  for (let i = 0; i < notes; i += 1) {
    const start = now + 0.014 + i * step;
    playTone(ctx, {
      frequency: 690 + i * 88 + lines * 18,
      frequencyEnd: 520 + i * 40,
      duration: 0.085,
      start,
      type: "square",
      gain: 0.038,
    });
    playTone(ctx, {
      frequency: 520 + i * 64,
      frequencyEnd: 360 + i * 28,
      duration: 0.07,
      start: start + 0.01,
      type: "triangle",
      gain: 0.026,
    });
  }
}

function playAllClearSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const chord = [523, 659, 784, 988];
  for (let i = 0; i < chord.length; i += 1) {
    playTone(ctx, {
      frequency: chord[i],
      duration: 0.16 + i * 0.02,
      start: now + i * 0.04,
      type: "triangle",
      gain: 0.06,
    });
  }
  playTone(ctx, {
    frequency: 1320,
    duration: 0.2,
    start: now + 0.22,
    type: "sine",
    gain: 0.07,
  });
}

function playMegaBurstCelebrateSound(poppedCells) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const power = Math.min(8, Math.floor((poppedCells - BOARD_COLOR_FLASH_MIN_POPS) / 2) + 3);

  // "쀼루룩" 느낌의 빠른 상승 글라이드.
  for (let i = 0; i < 4; i += 1) {
    const start = now + i * 0.028;
    playTone(ctx, {
      frequency: 420 + i * 110,
      frequencyEnd: 660 + i * 130,
      duration: 0.08,
      start,
      type: "triangle",
      gain: 0.024 + power * 0.0018,
    });
  }

  // "빵빵빵" 3연타 임팩트.
  for (let i = 0; i < 3; i += 1) {
    const start = now + 0.14 + i * 0.085;
    playTone(ctx, {
      frequency: 220 + i * 26,
      frequencyEnd: 120,
      duration: 0.13,
      start,
      type: "sawtooth",
      gain: 0.028 + power * 0.0022,
    });
    playTone(ctx, {
      frequency: 780 + i * 34,
      frequencyEnd: 430 + i * 16,
      duration: 0.09,
      start: start + 0.012,
      type: "square",
      gain: 0.026 + power * 0.0017,
    });
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function markPositionKeysForBlast(positionKeys, { depth = 1, linked = false } = {}) {
  const classNames = ["blast-target"];
  if (linked) classNames.push("linked");
  if (depth > 1) classNames.push("chain-step");
  for (const key of positionKeys) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cellEl = state.boardCellEls[y]?.[x];
    if (!cellEl) continue;
    cellEl.classList.add(...classNames);
  }
}

function getDifficultyT(score) {
  const t = score / EASY_TARGET_SCORE;
  return Math.max(0, Math.min(1, t));
}

function getDifficulty(score) {
  const t = getDifficultyT(score);
  return {
    initialFilledMin: Math.round(lerp(DIFFICULTY_START.initialFilledMin, DIFFICULTY_END.initialFilledMin, t)),
    initialFilledMax: Math.round(lerp(DIFFICULTY_START.initialFilledMax, DIFFICULTY_END.initialFilledMax, t)),
    collapseRiseByBlockSize: {
      3: Math.round(lerp(DIFFICULTY_START.collapseRiseByBlockSize[3], DIFFICULTY_END.collapseRiseByBlockSize[3], t)),
      4: Math.round(lerp(DIFFICULTY_START.collapseRiseByBlockSize[4], DIFFICULTY_END.collapseRiseByBlockSize[4], t)),
      5: Math.round(lerp(DIFFICULTY_START.collapseRiseByBlockSize[5], DIFFICULTY_END.collapseRiseByBlockSize[5], t)),
    },
    collapseDropByLineCount: {
      1: Math.round(lerp(DIFFICULTY_START.collapseDropByLineCount[1], DIFFICULTY_END.collapseDropByLineCount[1], t)),
      2: Math.round(lerp(DIFFICULTY_START.collapseDropByLineCount[2], DIFFICULTY_END.collapseDropByLineCount[2], t)),
      3: Math.round(lerp(DIFFICULTY_START.collapseDropByLineCount[3], DIFFICULTY_END.collapseDropByLineCount[3], t)),
    },
    noClearThreshold: Math.round(lerp(DIFFICULTY_START.noClearThreshold, DIFFICULTY_END.noClearThreshold, t)),
    noClearPenalty: Math.round(lerp(DIFFICULTY_START.noClearPenalty, DIFFICULTY_END.noClearPenalty, t)),
    skipPenalty: Math.round(lerp(DIFFICULTY_START.skipPenalty, DIFFICULTY_END.skipPenalty, t)),
    passiveTurnRise: Math.round(lerp(DIFFICULTY_START.passiveTurnRise, DIFFICULTY_END.passiveTurnRise, t)),
    dangerScoreBoostThreshold: Math.round(lerp(DIFFICULTY_START.dangerScoreBoostThreshold, DIFFICULTY_END.dangerScoreBoostThreshold, t)),
    dangerCollapseThreshold: Math.round(lerp(DIFFICULTY_START.dangerCollapseThreshold, DIFFICULTY_END.dangerCollapseThreshold, t)),
    dangerAdjacentChance: Number(lerp(DIFFICULTY_START.dangerAdjacentChance, DIFFICULTY_END.dangerAdjacentChance, t).toFixed(2)),
    maxInitialDepth: Math.round(lerp(DIFFICULTY_START.maxInitialDepth, DIFFICULTY_END.maxInitialDepth, t)),
    deepStackChance: Number(lerp(DIFFICULTY_START.deepStackChance, DIFFICULTY_END.deepStackChance, t).toFixed(2)),
    chainShockChance: Number(lerp(DIFFICULTY_START.chainShockChance, DIFFICULTY_END.chainShockChance, t).toFixed(2)),
    chainShockCells: Math.round(lerp(DIFFICULTY_START.chainShockCells, DIFFICULTY_END.chainShockCells, t)),
    shockScorePerCell: Math.round(lerp(DIFFICULTY_START.shockScorePerCell, DIFFICULTY_END.shockScorePerCell, t)),
    linkedClearScorePerCell: Math.round(
      lerp(DIFFICULTY_START.linkedClearScorePerCell, DIFFICULTY_END.linkedClearScorePerCell, t)
    ),
  };
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function weightedBlockSize() {
  const r = Math.random();
  let sum = 0;
  for (const entry of BLOCK_SIZE_WEIGHTS) {
    sum += entry.weight;
    if (r <= sum) return entry.size;
  }
  return 3;
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function parseRgbTriplet(rgbString) {
  if (typeof rgbString !== "string") return null;
  const channels = rgbString.split(",").map((value) => Number.parseInt(value.trim(), 10));
  if (channels.length !== 3 || channels.some((value) => !Number.isFinite(value))) return null;
  return channels.map((value) => Math.max(0, Math.min(255, value)));
}

function rgbTripletToCss(channels) {
  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

function blendRgbWithWhite(channels, amount) {
  const ratio = Math.max(0, Math.min(1, amount));
  return channels.map((value) => Math.round(value + (255 - value) * ratio));
}

function applyAmbientThemeFromRgb(rgbString) {
  const channels = parseRgbTriplet(rgbString);
  if (!channels) return;
  const top = blendRgbWithWhite(channels, 0.82);
  const bottom = blendRgbWithWhite(channels, 0.7);
  document.documentElement.style.setProperty("--bg0", rgbTripletToCss(top));
  document.documentElement.style.setProperty("--bg1", rgbTripletToCss(bottom));
}

function clearAmbientTheme() {
  document.documentElement.style.removeProperty("--bg0");
  document.documentElement.style.removeProperty("--bg1");
}

function triggerScreenColorFlash(rgbString, poppedCells) {
  const channels = parseRgbTriplet(rgbString);
  if (!channels) return;
  const alpha = Math.min(0.46, 0.2 + Math.max(0, poppedCells - BOARD_COLOR_FLASH_MIN_POPS) * 0.025);
  document.documentElement.style.setProperty("--screen-flash-rgb", channels.join(", "));
  document.documentElement.style.setProperty("--screen-flash-alpha", alpha.toFixed(2));

  if (state.screenFlashTimeoutId) {
    window.clearTimeout(state.screenFlashTimeoutId);
  }
  state.screenFlashTimeoutId = window.setTimeout(() => {
    document.documentElement.style.setProperty("--screen-flash-alpha", "0");
    state.screenFlashTimeoutId = null;
  }, SCREEN_COLOR_FLASH_MS);
}

function hexToRgbString(hexColor) {
  if (typeof hexColor !== "string") return null;
  const value = hexColor.trim();
  if (!value.startsWith("#")) return null;
  const raw = value.slice(1);
  const normalized = raw.length === 3
    ? raw.split("").map((ch) => `${ch}${ch}`).join("")
    : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function getDominantColorFromPositionKeys(positionKeys) {
  const counts = new Map();
  for (const key of positionKeys) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    if (!isInsideBoard(x, y)) continue;
    const color = topColor(state.board[y][x]);
    if (!color) continue;
    counts.set(color, (counts.get(color) || 0) + 1);
  }
  let dominantColor = null;
  let maxCount = 0;
  for (const [color, count] of counts.entries()) {
    if (count > maxCount) {
      dominantColor = color;
      maxCount = count;
    }
  }
  return dominantColor;
}

function shuffleArray(source) {
  const list = source.slice();
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function randomStackDepth(difficulty) {
  const maxDepth = Math.max(2, difficulty.maxInitialDepth);
  const r = Math.random();
  if (r < 0.46) return 1;
  if (r < 0.78) return Math.min(2, maxDepth);
  if (r < 1 - difficulty.deepStackChance) return Math.min(3, maxDepth);
  return maxDepth;
}

function overwriteTopWithDifferentColor(cell) {
  const current = topColor(cell);
  let next = current;
  let guard = 0;
  while (next === current && guard < 10) {
    next = choose(COLORS);
    guard += 1;
  }
  if (cell.stack.length === 0) {
    cell.stack.push(next);
  } else {
    cell.stack[cell.stack.length - 1] = next;
  }
}

function createSeededBoard(difficulty = getDifficulty(state.score)) {
  const board = createBoard();
  const fillCount = randomInt(difficulty.initialFilledMin, difficulty.initialFilledMax);
  const used = new Set();

  while (used.size < fillCount) {
    const x = randomInt(0, BOARD_SIZE - 1);
    const y = randomInt(0, BOARD_SIZE - 1);
    const key = `${x},${y}`;
    if (used.has(key)) continue;

    used.add(key);
    const cell = board[y][x];
    const depth = randomStackDepth(difficulty);
    for (let i = 0; i < depth; i += 1) {
      cell.stack.push(choose(COLORS));
    }
  }

  let fixGuard = 0;
  while (fixGuard < 24) {
    const lines = findUniformLines(board);
    if (lines.rows.size === 0 && lines.cols.size === 0) break;

    for (const row of lines.rows) {
      const x = randomInt(0, BOARD_SIZE - 1);
      overwriteTopWithDifferentColor(board[row][x]);
    }
    for (const col of lines.cols) {
      const y = randomInt(0, BOARD_SIZE - 1);
      overwriteTopWithDifferentColor(board[y][col]);
    }
    fixGuard += 1;
  }

  return board;
}

function generateBlock() {
  const size = weightedBlockSize();
  return {
    color: choose(COLORS),
    shape: choose(SHAPES[size]),
  };
}

function isInsideBoard(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function canPlaceBlock(block, anchorX, anchorY) {
  return block.shape.every(([dx, dy]) => {
    const x = anchorX + dx;
    const y = anchorY + dy;
    return isInsideBoard(x, y);
  });
}

function hasAnyPlacement(block) {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (canPlaceBlock(block, x, y)) return true;
    }
  }
  return false;
}

function placeBlock(block, anchorX, anchorY) {
  for (const [dx, dy] of block.shape) {
    const x = anchorX + dx;
    const y = anchorY + dy;
    state.board[y][x].stack.push(block.color);
  }
}

function baseScoreForLineCount(lineCount) {
  if (lineCount <= 0) return 0;
  if (lineCount === 1) return SCORE_TABLE[1];
  if (lineCount === 2) return SCORE_TABLE[2];
  return SCORE_TABLE[3];
}

function findUniformLines(board = state.board) {
  const rows = new Set();
  const cols = new Set();

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    const first = topColor(board[y][0]);
    if (!first) continue;
    let same = true;
    for (let x = 1; x < BOARD_SIZE; x += 1) {
      if (topColor(board[y][x]) !== first) {
        same = false;
        break;
      }
    }
    if (same) rows.add(y);
  }

  for (let x = 0; x < BOARD_SIZE; x += 1) {
    const first = topColor(board[0][x]);
    if (!first) continue;
    let same = true;
    for (let y = 1; y < BOARD_SIZE; y += 1) {
      if (topColor(board[y][x]) !== first) {
        same = false;
        break;
      }
    }
    if (same) cols.add(x);
  }

  return { rows, cols };
}

function calcCollapseDrop({
  lineCount,
  lineCellPops,
  linkedPops,
  shockPops,
  chainDepth,
  difficulty,
}) {
  if (lineCount <= 0) return 0;
  const baseDrop = lineCount === 1
    ? difficulty.collapseDropByLineCount[1]
    : lineCount === 2
      ? difficulty.collapseDropByLineCount[2]
      : difficulty.collapseDropByLineCount[3];

  const totalPops = lineCellPops + linkedPops + shockPops;
  const linkedBonus = Math.floor(linkedPops * 0.9);
  const shockBonus = Math.floor(shockPops / 2);
  const lineMassBonus = Math.floor(lineCellPops / 4);
  const comboBonus = Math.max(0, chainDepth - 1) * 7;
  const burstBonus = Math.floor(Math.max(0, totalPops - 8) / 3);
  const stabilityBonus = difficulty.passiveTurnRise;
  const drop = baseDrop + linkedBonus + shockBonus + lineMassBonus + comboBonus + burstBonus + stabilityBonus;
  return Math.min(95, drop);
}

function addDangerCollapses(lines, difficulty) {
  if (state.collapse < difficulty.dangerCollapseThreshold) return lines;

  const rows = new Set(lines.rows);
  const cols = new Set(lines.cols);

  for (const row of lines.rows) {
    if (Math.random() >= difficulty.dangerAdjacentChance) continue;
    const options = [];
    if (row > 0) options.push(row - 1);
    if (row < BOARD_SIZE - 1) options.push(row + 1);
    if (options.length > 0) rows.add(choose(options));
  }

  for (const col of lines.cols) {
    if (Math.random() >= difficulty.dangerAdjacentChance) continue;
    const options = [];
    if (col > 0) options.push(col - 1);
    if (col < BOARD_SIZE - 1) options.push(col + 1);
    if (options.length > 0) cols.add(choose(options));
  }

  return { rows, cols };
}

function getLinePositionSet(lines) {
  const positions = new Set();
  for (const row of lines.rows) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      positions.add(`${x},${row}`);
    }
  }
  for (const col of lines.cols) {
    for (let y = 0; y < BOARD_SIZE; y += 1) {
      positions.add(`${col},${y}`);
    }
  }
  return positions;
}

function collectLinkedSameColorCells(lines, linePositions) {
  const queue = [];
  const visited = new Set();
  const linked = new Set();

  for (const key of linePositions) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const color = topColor(state.board[y][x]);
    if (!color) continue;
    const visitKey = `${x},${y},${color}`;
    visited.add(visitKey);
    queue.push({ x, y, color });
  }

  while (queue.length > 0) {
    const node = queue.shift();
    const neighbors = [
      [node.x + 1, node.y],
      [node.x - 1, node.y],
      [node.x, node.y + 1],
      [node.x, node.y - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (!isInsideBoard(nx, ny)) continue;
      const neighborColor = topColor(state.board[ny][nx]);
      if (neighborColor !== node.color) continue;
      const visitKey = `${nx},${ny},${node.color}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);
      queue.push({ x: nx, y: ny, color: node.color });
      const posKey = `${nx},${ny}`;
      if (!linePositions.has(posKey)) {
        linked.add(posKey);
      }
    }
  }

  return linked;
}

function collectLinkedCascadeGroups(linePositions) {
  const queue = [];
  const visited = new Set();
  const depthByPos = new Map();

  for (const key of linePositions) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const color = topColor(state.board[y][x]);
    if (!color) continue;
    const visitKey = `${x},${y},${color}`;
    if (visited.has(visitKey)) continue;
    visited.add(visitKey);
    queue.push({ x, y, color, depth: 0 });
  }

  while (queue.length > 0) {
    const node = queue.shift();
    const neighbors = [
      [node.x + 1, node.y],
      [node.x - 1, node.y],
      [node.x, node.y + 1],
      [node.x, node.y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (!isInsideBoard(nx, ny)) continue;
      const neighborColor = topColor(state.board[ny][nx]);
      if (neighborColor !== node.color) continue;
      const visitKey = `${nx},${ny},${node.color}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);
      const nextDepth = node.depth + 1;
      queue.push({ x: nx, y: ny, color: node.color, depth: nextDepth });
      const posKey = `${nx},${ny}`;
      if (!linePositions.has(posKey)) {
        const prev = depthByPos.get(posKey);
        if (prev === undefined || nextDepth < prev) {
          depthByPos.set(posKey, nextDepth);
        }
      }
    }
  }

  if (depthByPos.size === 0) return [];
  const grouped = new Map();
  for (const [posKey, distance] of depthByPos.entries()) {
    if (!grouped.has(distance)) grouped.set(distance, new Set());
    grouped.get(distance).add(posKey);
  }
  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map((entry) => entry[1]);
}

function popCellsByPositionKeys(positionKeys) {
  const removedCells = [];
  for (const key of positionKeys) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cell = state.board[y][x];
    if (!cell || cell.stack.length === 0) continue;
    cell.stack.pop();
    removedCells.push({ x, y });
  }
  return removedCells;
}

function isBoardAllClear() {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (state.board[y][x].stack.length > 0) return false;
    }
  }
  return true;
}

function clearBoardCompletely() {
  const removed = [];
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = state.board[y][x];
      if (cell.stack.length > 0) {
        removed.push({ x, y });
        cell.stack = [];
      }
    }
  }
  return removed;
}

function applyChainShockwave(removedCells, difficulty, depth) {
  if (removedCells.length === 0) return [];
  const candidates = new Set();

  for (const { x, y } of removedCells) {
    candidates.add(`${x},${y}`);
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (!isInsideBoard(nx, ny)) continue;
      candidates.add(`${nx},${ny}`);
    }
  }

  const keys = shuffleArray(Array.from(candidates));
  const maxShockPops = Math.max(1, difficulty.chainShockCells + Math.floor(depth / 2));
  const shockPopped = [];

  for (const key of keys) {
    if (shockPopped.length >= maxShockPops) break;
    if (Math.random() > difficulty.chainShockChance) continue;

    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cell = state.board[y][x];
    if (!cell || cell.stack.length <= 1) continue;
    cell.stack.pop();
    shockPopped.push({ x, y });
  }
  return shockPopped;
}

function triggerBoardBurst(linesCleared, poppedCells, burstIntensity = 1) {
  elements.board.classList.remove("burst");
  elements.board.classList.remove("burst-heavy");
  elements.board.classList.remove("burst-ultra");
  // Force reflow to replay animation reliably.
  void elements.board.offsetWidth;
  elements.board.classList.add("burst");
  if (poppedCells >= 10 || linesCleared >= 2) {
    elements.board.classList.add("burst-heavy");
  }
  if (burstIntensity >= 3 || poppedCells >= 20 || linesCleared >= 3) {
    elements.board.classList.add("burst-ultra");
  }
  window.setTimeout(() => {
    elements.board.classList.remove("burst");
    elements.board.classList.remove("burst-heavy");
    elements.board.classList.remove("burst-ultra");
  }, 260 + linesCleared * 55);
}

function triggerBoardColorFlash(color, poppedCells) {
  if (!elements.board || poppedCells < BOARD_COLOR_FLASH_MIN_POPS) return;
  const rgb = hexToRgbString(color);
  if (!rgb) return;

  const alpha = Math.min(0.5, 0.2 + (poppedCells - BOARD_COLOR_FLASH_MIN_POPS) * 0.025);
  elements.board.style.setProperty("--board-flash-rgb", rgb);
  elements.board.style.setProperty("--board-flash-alpha", alpha.toFixed(2));

  if (state.boardFlashTimeoutId) {
    window.clearTimeout(state.boardFlashTimeoutId);
  }
  state.boardFlashTimeoutId = window.setTimeout(() => {
    elements.board.style.setProperty("--board-flash-alpha", "0");
    state.boardFlashTimeoutId = null;
  }, BOARD_COLOR_FLASH_MS);

  triggerScreenColorFlash(rgb, poppedCells);
  applyAmbientThemeFromRgb(rgb);
}

function triggerBoardGlitter(intensity = 1) {
  elements.board.classList.remove("glitter");
  // Force reflow to replay animation reliably.
  void elements.board.offsetWidth;
  elements.board.classList.add("glitter");
  const sparkleCount = Math.min(32, 10 + intensity * 5);
  for (let i = 0; i < sparkleCount; i += 1) {
    const glitter = document.createElement("span");
    glitter.className = "glitter-spark";
    glitter.style.left = `${randomInt(6, Math.max(8, elements.board.clientWidth - 8))}px`;
    glitter.style.top = `${randomInt(6, Math.max(8, elements.board.clientHeight - 8))}px`;
    glitter.style.setProperty("--glitter-rot", `${randomInt(-30, 30)}deg`);
    glitter.style.setProperty("--glitter-scale", (0.65 + Math.random() * 1.1).toFixed(2));
    glitter.style.animationDelay = `${Math.random() * 100}ms`;
    elements.board.appendChild(glitter);
    glitter.addEventListener("animationend", () => glitter.remove(), { once: true });
  }
  window.setTimeout(() => {
    elements.board.classList.remove("glitter");
  }, 300 + intensity * 50);
}

function resetEndingLayerVisuals() {
  if (elements.endingBoardFx) {
    elements.endingBoardFx.classList.remove("clearing", "hidden");
    elements.endingBoardFx.innerHTML = "";
  }
  if (elements.endingCard) {
    elements.endingCard.classList.add("hidden");
  }
  const fireworks = document.querySelectorAll(".ending-firework");
  for (const firework of fireworks) {
    firework.remove();
  }
}

function buildEndingBoardFx() {
  if (!elements.endingBoardFx) return;
  syncEndingBoardFxBounds();
  elements.endingBoardFx.innerHTML = "";
  const totalCells = BOARD_SIZE * BOARD_SIZE;
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const idx = y * BOARD_SIZE + x;
      const fxCell = document.createElement("span");
      fxCell.className = "ending-fx-cell";
      const color = topColor(state.board[y][x]) || choose(COLORS);
      fxCell.style.setProperty("--fx-color", color);
      fxCell.style.setProperty("--row", String(y));
      fxCell.style.setProperty("--col", String(x));
      fxCell.style.setProperty("--reverse", String(totalCells - 1 - idx));
      elements.endingBoardFx.appendChild(fxCell);
    }
  }
}

function syncEndingBoardFxBounds() {
  if (!elements.endingBoardFx || !elements.gameOverLayer || !elements.board) return;
  const layerRect = elements.gameOverLayer.getBoundingClientRect();
  const boardRect = elements.board.getBoundingClientRect();
  if (layerRect.width <= 0 || layerRect.height <= 0 || boardRect.width <= 0 || boardRect.height <= 0) {
    return;
  }

  const offsetX = Math.max(0, boardRect.left - layerRect.left);
  const offsetY = Math.max(0, boardRect.top - layerRect.top);
  elements.endingBoardFx.style.setProperty("--ending-fx-left", `${offsetX}px`);
  elements.endingBoardFx.style.setProperty("--ending-fx-top", `${offsetY}px`);
  elements.endingBoardFx.style.setProperty("--ending-fx-width", `${boardRect.width}px`);
  elements.endingBoardFx.style.setProperty("--ending-fx-height", `${boardRect.height}px`);
}

function spawnEndingFireworks(level = 1) {
  if (!elements.gameOverLayer) return;
  const count = Math.min(28, 10 + level * 4);
  for (let i = 0; i < count; i += 1) {
    const fw = document.createElement("span");
    fw.className = "ending-firework";
    fw.style.left = `${randomInt(14, 86)}%`;
    fw.style.top = `${randomInt(12, 60)}%`;
    fw.style.setProperty("--fw-dx", `${randomInt(-70, 70)}px`);
    fw.style.setProperty("--fw-dy", `${randomInt(-96, -24)}px`);
    fw.style.animationDelay = `${randomInt(0, 220)}ms`;
    elements.gameOverLayer.appendChild(fw);
    fw.addEventListener("animationend", () => fw.remove(), { once: true });
  }
}

async function startEndingSequence(reason) {
  if (!state.gameOver || state.endingSequenceRunning) return;
  state.endingSequenceRunning = true;
  resetEndingLayerVisuals();
  if (elements.endingReason) {
    elements.endingReason.textContent = reason;
  }
  if (elements.endingScoreValue) {
    elements.endingScoreValue.textContent = String(state.score);
  }
  if (elements.gameOverLayer) {
    elements.gameOverLayer.classList.remove("hidden");
  }
  buildEndingBoardFx();
  await wait(ENDING_FILL_DURATION_MS);
  if (!state.gameOver) {
    state.endingSequenceRunning = false;
    return;
  }
  if (elements.endingBoardFx) {
    elements.endingBoardFx.classList.add("clearing");
  }
  await wait(ENDING_RISE_DURATION_MS);
  if (!state.gameOver) {
    state.endingSequenceRunning = false;
    return;
  }
  if (elements.endingBoardFx) {
    elements.endingBoardFx.classList.add("hidden");
  }
  const canContinue = !state.continueUsedThisGame;
  if (elements.endingContinueButton) {
    elements.endingContinueButton.classList.toggle("hidden", !canContinue);
  }
  if (elements.endingNewGameButton) {
    elements.endingNewGameButton.textContent = canContinue ? "새로하기" : "다음판하기";
  }
  if (elements.endingCard) {
    elements.endingCard.classList.remove("hidden");
  }

  const isNewBestThisRun = state.score > state.runStartBest;
  if (isNewBestThisRun) {
    spawnEndingFireworks(Math.max(1, Math.floor(state.score / 1800)));
    playDopamineClearSound({ lines: 3, chain: 3 });
  }
  state.endingSequenceRunning = false;
  if (elements.endingContinueButton) {
    elements.endingContinueButton.disabled = false;
  }
}

function runEndingContinue() {
  if (!state.gameOver || state.endingSequenceRunning || state.continueUsedThisGame) return;
  state.continueUsedThisGame = true;
  state.collapse = clampCollapse(state.collapse + 5);
  state.gameOver = false;
  state.clearStreakTurns = 0;
  state.message = "횟수 5회 추가! 계속 진행합니다.";
  resetEndingLayerVisuals();
  nextTurnBlock();
  if (!hasAnyPlacement(state.currentBlock)) {
    setGameOver("이어하기 후 배치 가능한 공간이 없습니다.");
    render();
    return;
  }
  render();
}

function spawnCellBurstParticles(cells, burstIntensity = 1) {
  const unique = new Set(cells.map((cell) => `${cell.x},${cell.y}`));
  const cappedKeys = Array.from(unique).slice(0, 24 + burstIntensity * 8);
  const sparksPerCell = Math.min(4, 2 + Math.floor(burstIntensity / 2));
  for (const key of cappedKeys) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cellEl = state.boardCellEls[y]?.[x];
    if (!cellEl) continue;

    for (let i = 0; i < sparksPerCell; i += 1) {
      const burst = document.createElement("span");
      burst.className = "burst-spark";
      const spreadX = randomInt(-40 - burstIntensity * 8, 40 + burstIntensity * 8);
      const spreadY = randomInt(-58 - burstIntensity * 10, -10);
      const scale = (0.75 + Math.random() * (1.1 + burstIntensity * 0.16)).toFixed(2);
      burst.style.left = `${cellEl.offsetLeft + cellEl.offsetWidth / 2}px`;
      burst.style.top = `${cellEl.offsetTop + cellEl.offsetHeight / 2}px`;
      burst.style.setProperty("--spark-dx", `${spreadX}px`);
      burst.style.setProperty("--spark-dy", `${spreadY}px`);
      burst.style.setProperty("--spark-scale", scale);
      elements.board.appendChild(burst);
      burst.addEventListener("animationend", () => burst.remove(), { once: true });
    }
  }
}

function spawnBurstWave(cells, intensity) {
  if (cells.length === 0) return;
  const unique = Array.from(new Set(cells.map((cell) => `${cell.x},${cell.y}`)));
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (const key of unique) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cellEl = state.boardCellEls[y]?.[x];
    if (!cellEl) continue;
    sumX += cellEl.offsetLeft + cellEl.offsetWidth / 2;
    sumY += cellEl.offsetTop + cellEl.offsetHeight / 2;
    count += 1;
  }
  if (count === 0) return;

  const wave = document.createElement("div");
  wave.className = "burst-wave";
  wave.style.left = `${sumX / count}px`;
  wave.style.top = `${sumY / count}px`;
  wave.style.setProperty("--wave-size", `${100 + intensity * 14}px`);
  elements.board.appendChild(wave);
  wave.addEventListener("animationend", () => wave.remove(), { once: true });
}

function pulseScoreHud() {
  const target = elements.scoreValue;
  if (!target) return;
  target.classList.remove("score-hit");
  // Force reflow so rapid consecutive score hits still replay.
  void target.offsetWidth;
  target.classList.add("score-hit");
  window.setTimeout(() => {
    target.classList.remove("score-hit");
  }, 420);
}

function spawnScoreFlyToHud({ scoreGain, startX, startY, level }) {
  if (!Number.isFinite(scoreGain) || scoreGain <= 0) return;
  const target = elements.scoreValue;
  if (!target) return;
  const targetRect = target.getBoundingClientRect();
  const tx = targetRect.left + targetRect.width / 2;
  const ty = targetRect.top + targetRect.height / 2;

  const fly = document.createElement("div");
  fly.className = "score-fly";
  fly.classList.add(`lv${Math.max(1, Math.min(4, level || 1))}`);
  fly.textContent = `+${scoreGain}`;
  fly.style.left = `${startX}px`;
  fly.style.top = `${startY}px`;
  fly.style.setProperty("--fly-dx", `${tx - startX}px`);
  fly.style.setProperty("--fly-dy", `${ty - startY}px`);
  document.body.appendChild(fly);
  fly.addEventListener("animationend", () => {
    fly.remove();
    pulseScoreHud();
  }, { once: true });
}

function spawnScorePopup(cells, scoreGain, poppedCells, burstIntensity) {
  if (scoreGain <= 0 || cells.length === 0) return;
  const unique = Array.from(new Set(cells.map((cell) => `${cell.x},${cell.y}`)));
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (const key of unique) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cellEl = state.boardCellEls[y]?.[x];
    if (!cellEl) continue;
    sumX += cellEl.offsetLeft + cellEl.offsetWidth / 2;
    sumY += cellEl.offsetTop + cellEl.offsetHeight / 2;
    count += 1;
  }
  if (count === 0) return;

  const level = Math.min(
    4,
    1 + Math.floor(scoreGain / 900) + Math.floor(poppedCells / 12) + Math.floor(burstIntensity / 2)
  );
  const popup = document.createElement("div");
  popup.className = "score-pop";
  popup.classList.add(`lv${level}`);
  popup.textContent = `+${scoreGain}`;
  popup.style.left = `${sumX / count}px`;
  popup.style.top = `${sumY / count}px`;
  popup.style.setProperty("--score-scale", `${(1 + level * 0.14).toFixed(2)}`);
  popup.style.setProperty("--score-rise", `${120 + level * 20}%`);

  const bang = document.createElement("div");
  bang.className = "score-pop-bang";
  bang.style.left = `${sumX / count}px`;
  bang.style.top = `${sumY / count}px`;
  bang.style.setProperty("--bang-size", `${78 + level * 26}px`);

  elements.board.appendChild(bang);
  elements.board.appendChild(popup);
  const boardRect = elements.board.getBoundingClientRect();
  const centerX = boardRect.left + sumX / count;
  const centerY = boardRect.top + sumY / count;
  window.setTimeout(() => {
    spawnScoreFlyToHud({
      scoreGain,
      startX: centerX,
      startY: centerY,
      level,
    });
  }, 70);
  bang.addEventListener("animationend", () => bang.remove(), { once: true });
  popup.addEventListener("animationend", () => popup.remove(), { once: true });
}

function spawnAllClearBanner(bonus, guaranteed) {
  const banner = document.createElement("div");
  banner.className = "all-clear-banner";
  if (guaranteed) banner.classList.add("guaranteed");
  banner.innerHTML = `<strong>ALL CLEAR!</strong><span>보너스 +${bonus}</span>`;
  elements.board.appendChild(banner);
  banner.addEventListener("animationend", () => banner.remove(), { once: true });
}

function spawnMegaBurstBanner(poppedCells) {
  if (!elements.board) return;
  const banner = document.createElement("div");
  banner.className = "mega-burst-banner";
  banner.innerHTML = `<strong>${poppedCells} BURST!</strong><span>쀼루룩 빵빵빵</span>`;
  elements.board.appendChild(banner);
  banner.addEventListener("animationend", () => banner.remove(), { once: true });
}

function updateHoverCell(nextCell) {
  const prev = state.hoverCell;
  const changed = !prev && nextCell
    || prev && !nextCell
    || (prev && nextCell && (prev.x !== nextCell.x || prev.y !== nextCell.y));
  if (!changed) return;
  state.hoverCell = nextCell;
  paintPreviewOnBoard();
}

function clearPreviewOnBoard() {
  if (state.previewKeys.size === 0) return;
  for (const key of state.previewKeys) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cell = state.boardCellEls[y]?.[x];
    if (!cell) continue;
    cell.classList.remove("preview-valid", "preview-invalid");
  }
  state.previewKeys.clear();
}

function paintPreviewOnBoard() {
  clearPreviewOnBoard();
  const preview = getPreviewCells();
  if (!preview) return;
  for (const key of preview.cells) {
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cell = state.boardCellEls[y]?.[x];
    if (!cell) continue;
    cell.classList.add(preview.valid ? "preview-valid" : "preview-invalid");
    state.previewKeys.add(key);
  }
}

function releaseDragPointerCapture() {
  if (state.dragPointerId === null) return;
  try {
    if (elements.currentBlockView.hasPointerCapture(state.dragPointerId)) {
      elements.currentBlockView.releasePointerCapture(state.dragPointerId);
    }
  } catch (_error) {
    // No-op
  }
}

function endDragInteraction() {
  if (!state.isDragging) return;
  releaseDragPointerCapture();
  state.dragPointerId = null;
  state.isDragging = false;
  if (state.dragMoveRafId !== null) {
    cancelAnimationFrame(state.dragMoveRafId);
    state.dragMoveRafId = null;
  }
  state.pendingDragPoint = null;
  state.dragPointerPos = null;
  state.dragGrabOffset = { x: 0, y: 0 };
  state.dragGhostMetrics = { cellSize: 22, gap: 4 };
  state.dragBoardMetrics = null;
  document.body.classList.remove("dragging-block");
  elements.currentBlockView.classList.remove("is-dragging");
  if (state.dragGhostEl) {
    state.dragGhostEl.remove();
    state.dragGhostEl = null;
  }
  updateHoverCell(null);
}

function setGameOver(reason) {
  if (state.gameOver) return;
  endDragInteraction();
  state.gameOver = true;
  state.message = reason;
  if (state.continueUsedThisGame) {
    commitRankingIfNeeded();
  }
  startEndingSequence(reason);
}

function nextTurnBlock() {
  state.currentBlock = generateBlock();
}

function drawSkipBlock(maxAttempts = SKIP_REROLL_MAX_ATTEMPTS) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    nextTurnBlock();
    if (hasAnyPlacement(state.currentBlock)) {
      return attempt;
    }
  }
  return 0;
}

function updateBestScore() {
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    setBestScore(state.bestScore);
  }
}

async function runPlacement(anchorX, anchorY) {
  if (state.gameOver || !state.currentBlock || state.isResolving) return;
  const difficulty = getDifficulty(state.score);
  state.turnsPlayed += 1;

  if (!canPlaceBlock(state.currentBlock, anchorX, anchorY)) {
    state.message = "드롭 위치가 유효하지 않습니다.";
    render();
    return;
  }

  state.isResolving = true;
  placeBlock(state.currentBlock, anchorX, anchorY);
  // One placement always consumes one turn.
  state.collapse = clampCollapse(state.collapse - 1);

  const dangerScoreBoost = 1;
  let depth = 1;
  let turnScore = 0;
  let turnLineCount = 0;
  const burstCells = [];
  let turnLineCellPops = 0;
  let turnLinkedPops = 0;
  let turnShockPops = 0;
  let allClearTriggered = false;
  let allClearGuaranteed = false;
  let allClearBonus = 0;
  let comboVoicePlayed = false;
  let dopamineClearPlayed = false;
  try {
    let found = findUniformLines();
    while (found.rows.size > 0 || found.cols.size > 0) {
      const lines = found;
      const lineCount = lines.rows.size + lines.cols.size;
      if (lineCount === 0) break;

      const cycleColorCounts = new Map();
      let cyclePoppedTotal = 0;
      const cycleBurstCells = [];
      const registerCycleColor = (color, amount) => {
        if (!color || amount <= 0) return;
        cycleColorCounts.set(color, (cycleColorCounts.get(color) || 0) + amount);
      };

      const linePositions = getLinePositionSet(lines);
      const linkedGroups = collectLinkedCascadeGroups(linePositions);
      const lineBurstColor = getDominantColorFromPositionKeys(linePositions);
      state.message = depth > 1 ? `${depth}단 연쇄 준비... 둥!` : "둥! 폭발 준비...";
      render();
      markPositionKeysForBlast(linePositions, { depth, linked: false });
      const preBlastDelay = Math.min(PRE_BLAST_MAX_DELAY_MS, PRE_BLAST_DELAY_MS + (depth - 1) * 24);
      await wait(preBlastDelay);

      const removedLineCells = popCellsByPositionKeys(linePositions);
      turnLineCellPops += removedLineCells.length;
      cyclePoppedTotal += removedLineCells.length;
      cycleBurstCells.push(...removedLineCells);
      registerCycleColor(lineBurstColor, removedLineCells.length);
      const lineRawScore = baseScoreForLineCount(lineCount) * depth;
      const lineScore = Math.round(lineRawScore * dangerScoreBoost);
      turnScore += lineRawScore;
      turnLineCount += lineCount;
      burstCells.push(...removedLineCells);

      state.message = depth > 1 ? `${depth}단 연쇄 뿅!!!!` : `${lineCount}줄 제거 뿅!!!`;
      render();

      const lineBurstIntensity = Math.min(
        5,
        1 + Math.floor(lineScore / 900) + Math.floor(removedLineCells.length / 8) + Math.floor((depth - 1) / 2)
      );
      const lineEffectCells = removedLineCells.length > 0 ? removedLineCells : [{ x: 2, y: 2 }, { x: 3, y: 3 }];
      triggerBoardBurst(lineCount, lineEffectCells.length, lineBurstIntensity);
      spawnCellBurstParticles(lineEffectCells, lineBurstIntensity);
      spawnBurstWave(lineEffectCells, lineCount + Math.floor(lineEffectCells.length / 3) + lineBurstIntensity);
      spawnScorePopup(lineEffectCells, lineScore, lineEffectCells.length, lineBurstIntensity);
      playClearSound(lineCount, lineScore);
      if (depth > 1 || linkedGroups.length > 0) {
        triggerBoardGlitter(Math.min(4, depth + Math.min(2, linkedGroups.length)));
        if (!comboVoicePlayed) {
          playComboVoiceCue("구우우웃~", { rate: 0.72, pitch: 0.64, volume: 0.9 });
          comboVoicePlayed = true;
        }
      }
      if (!dopamineClearPlayed && turnLineCount >= 2) {
        playDopamineClearSound({ lines: Math.max(2, lineCount), chain: depth });
        triggerBoardGlitter(Math.min(5, 3 + Math.floor(turnLineCount / 2)));
        playComboVoiceCue("나이스", { rate: 0.96, pitch: 0.74, volume: 0.9 });
        dopamineClearPlayed = true;
      }

      if (linkedGroups.length > 0) {
        await wait(Math.floor(CHAIN_STEP_DELAY_MS * 0.5));
      }

      const totalLinkedTargets = linkedGroups.reduce((sum, group) => sum + group.size, 0);
      let linkedWave = 0;
      for (const group of linkedGroups) {
        linkedWave += 1;
        const linkedBurstColor = getDominantColorFromPositionKeys(group);
        state.message = `연결 블록 펑${"!".repeat(Math.min(4, linkedWave + 1))}`;
        render();
        markPositionKeysForBlast(group, { depth, linked: true });
        const accel = Math.min(52, linkedWave * 6 + Math.min(26, group.size * 4) + Math.min(18, totalLinkedTargets));
        const linkedDelay = Math.max(LINKED_BLAST_MIN_DELAY_MS, LINKED_BLAST_DELAY_MS - accel);
        await wait(linkedDelay);

        const removedLinkedCells = popCellsByPositionKeys(group);
        if (removedLinkedCells.length === 0) continue;
        turnLinkedPops += removedLinkedCells.length;
        cyclePoppedTotal += removedLinkedCells.length;
        cycleBurstCells.push(...removedLinkedCells);
        registerCycleColor(linkedBurstColor, removedLinkedCells.length);
        burstCells.push(...removedLinkedCells);

        const linkedRawScore = removedLinkedCells.length * difficulty.linkedClearScorePerCell * depth;
        const linkedScore = Math.round(linkedRawScore * dangerScoreBoost);
        turnScore += linkedRawScore;

        state.message = `펑! 연결 ${removedLinkedCells.length}칸`;
        render();
        const linkedBurstIntensity = Math.min(
          4,
          1 + Math.floor(removedLinkedCells.length / 3) + Math.floor(linkedWave / 2)
        );
        triggerBoardBurst(1, removedLinkedCells.length, linkedBurstIntensity);
        spawnCellBurstParticles(removedLinkedCells, linkedBurstIntensity);
        spawnBurstWave(removedLinkedCells, linkedBurstIntensity + Math.floor(removedLinkedCells.length / 2));
        spawnScorePopup(removedLinkedCells, linkedScore, removedLinkedCells.length, linkedBurstIntensity);
        playLinkedBurstSound({
          cells: removedLinkedCells.length,
          wave: linkedWave,
          totalCells: totalLinkedTargets,
        });
        if (removedLinkedCells.length >= 4) {
          triggerBoardGlitter(Math.min(4, 2 + Math.floor(removedLinkedCells.length / 3)));
        }
      }

      if (cyclePoppedTotal >= BOARD_COLOR_FLASH_MIN_POPS && cycleColorCounts.size > 0) {
        let dominantColor = null;
        let dominantCount = 0;
        for (const [color, count] of cycleColorCounts.entries()) {
          if (count > dominantCount) {
            dominantColor = color;
            dominantCount = count;
          }
        }
        triggerBoardColorFlash(dominantColor, cyclePoppedTotal);
        triggerBoardGlitter(Math.min(6, 4 + Math.floor(cyclePoppedTotal / 6)));
        spawnMegaBurstBanner(cyclePoppedTotal);
        playMegaBurstCelebrateSound(cyclePoppedTotal);
        if (cycleBurstCells.length > 0) {
          spawnBurstWave(cycleBurstCells, Math.min(8, 5 + Math.floor(cyclePoppedTotal / 4)));
        }
      }

      depth += 1;
      found = findUniformLines();
      if (found.rows.size > 0 || found.cols.size > 0) {
        const waitMs = Math.min(CHAIN_STEP_MAX_DELAY_MS, CHAIN_STEP_DELAY_MS + (depth - 2) * 22);
        await wait(waitMs);
      } else {
        await wait(Math.floor(CHAIN_STEP_DELAY_MS * 0.9));
      }
    }

    const naturalAllClear = isBoardAllClear();
    if (naturalAllClear) {
      const uniqueBurst = new Set(burstCells.map((cell) => `${cell.x},${cell.y}`)).size;
      const clearScale = Math.max(1, Math.floor(uniqueBurst / 7));
      allClearGuaranteed = state.allClearGuaranteeActive && !state.allClearAwardedThisRun;
      allClearBonus = ALL_CLEAR_BONUS_BASE
        + clearScale * 120
        + depth * 140
        + (allClearGuaranteed ? ALL_CLEAR_BONUS_GUARANTEE : 0);
      turnScore += allClearBonus;
      state.allClearAwardedThisRun = true;
      state.allClearGuaranteeActive = false;
      state.gamesSinceAllClear = 0;
      setGamesSinceAllClear(0);
      allClearTriggered = true;

      const allClearCells = burstCells.length > 0 ? burstCells : [{ x: 2, y: 2 }, { x: 3, y: 3 }];
      const allClearScore = Math.round(allClearBonus * dangerScoreBoost);
      const allClearBurstIntensity = Math.min(5, 4 + Math.floor(allClearBonus / 1100));
      triggerBoardBurst(Math.max(3, turnLineCount), allClearCells.length, allClearBurstIntensity);
      spawnCellBurstParticles(allClearCells, allClearBurstIntensity);
      spawnBurstWave(allClearCells, Math.max(5, turnLineCount + Math.floor(allClearCells.length / 3)));
      spawnScorePopup(allClearCells, allClearScore, allClearCells.length, allClearBurstIntensity);
      spawnAllClearBanner(allClearBonus, allClearGuaranteed);
      playAllClearSound();
      await wait(CHAIN_STEP_DELAY_MS);
    }

    if (turnLineCount > 0 || allClearTriggered) {
      state.noClearStreak = 0;
      if (turnLineCount > 0) {
        state.clearStreakTurns += 1;
      } else {
        state.clearStreakTurns = 0;
      }
      const poppedBlocks = turnLineCellPops + turnLinkedPops + turnShockPops;
      const gainedTurns = Math.floor(poppedBlocks / 3);
      if (gainedTurns > 0) {
        state.collapse = clampCollapse(state.collapse + gainedTurns);
      }
      if (state.clearStreakTurns >= 3 && state.clearStreakTurns % 3 === 0) {
        playComboVoiceCue("와아아우~~~~", { rate: 0.86, pitch: 0.78, volume: 0.92 });
        playDopamineClearSound({ lines: Math.max(2, turnLineCount), chain: Math.max(2, depth - 1) });
        triggerBoardGlitter(Math.min(5, 3 + Math.floor(turnLineCount / 2)));
      }
      if (allClearTriggered) {
        const base = allClearGuaranteed
          ? `올클리어 보장 발동! 보너스 +${allClearBonus}`
          : `ALL CLEAR! 보너스 +${allClearBonus}`;
        state.message = gainedTurns > 0 ? `${base} 횟수 +${gainedTurns}` : base;
      } else {
        const base = depth > 2 ? `연쇄 ${depth - 1}단계!` : `${turnLineCount}줄 제거 성공!`;
        state.message = gainedTurns > 0 ? `${base} 횟수 +${gainedTurns}` : base;
      }
    } else {
      state.noClearStreak = 0;
      state.clearStreakTurns = 0;
      state.message = "이번 턴은 클리어 실패.";
    }

    turnScore = Math.round(turnScore * dangerScoreBoost);
    state.score += turnScore;
    updateBestScore();

    if (state.collapse <= 0) {
      setGameOver("남은 횟수를 모두 사용했습니다.");
      return;
    }

    nextTurnBlock();
    if (!hasAnyPlacement(state.currentBlock)) {
      setGameOver("배치 가능한 공간이 없어 종료됩니다.");
    } else {
      state.message = `${state.message} 새 블록을 드래그해 배치하세요.`;
    }

    if (!(turnLineCount > 0 || allClearTriggered)) {
      playPlacementSound();
    }
  } finally {
    state.isResolving = false;
    render();
  }
}

function runSkip() {
  if (state.gameOver || state.isResolving) return;
  endDragInteraction();

  if (!state.freeSkipUsed) {
    state.freeSkipUsed = true;
  } else {
    const confirmed = window.confirm("광고 시청 후 스킵하시겠습니까?");
    if (!confirmed) return;
  }

  const drawAttempts = drawSkipBlock();

  if (drawAttempts === 0) {
    setGameOver("스킵 이후에도 배치 가능한 블록이 없습니다.");
  } else {
    state.clearStreakTurns = 0;
    state.noClearStreak = 0;
  }

  render();
}

function getPreviewCells() {
  if (!state.isDragging || !state.hoverCell || state.gameOver || !state.currentBlock) {
    return null;
  }
  const { x, y } = state.hoverCell;
  const valid = canPlaceBlock(state.currentBlock, x, y);
  const cells = new Set();
  for (const [dx, dy] of state.currentBlock.shape) {
    const nx = x + dx;
    const ny = y + dy;
    if (isInsideBoard(nx, ny)) cells.add(`${nx},${ny}`);
  }
  return { cells, valid };
}

function renderBoard() {
  elements.board.innerHTML = "";
  state.boardCellEls = createBoardCellRefs();

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = state.board[y][x];
      const top = topColor(cell);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.dataset.x = String(x);
      button.dataset.y = String(y);
      button.tabIndex = -1;

      if (top) {
        button.classList.add("filled");
        button.style.setProperty("--cell-color", top);
      }

      const depth = cell.stack.length;
      if (depth > 1) {
        const badge = document.createElement("span");
        badge.className = "depth";
        badge.textContent = String(depth);
        button.appendChild(badge);
      }

      elements.board.appendChild(button);
      state.boardCellEls[y][x] = button;
    }
  }
  paintPreviewOnBoard();
}

function createMiniGrid(block, options = {}) {
  const {
    cellSize = 20,
    gap = 4,
    attachShapeData = false,
    fixedWidth = null,
    fixedHeight = null,
    centerShape = false,
  } = options;
  const maxX = Math.max(...block.shape.map(([x]) => x));
  const maxY = Math.max(...block.shape.map(([, y]) => y));
  const width = maxX + 1;
  const height = maxY + 1;
  const gridWidth = Number.isFinite(fixedWidth) ? Math.max(width, fixedWidth) : width;
  const gridHeight = Number.isFinite(fixedHeight) ? Math.max(height, fixedHeight) : height;
  const offsetX = centerShape ? Math.floor((gridWidth - width) / 2) : 0;
  const offsetY = centerShape ? Math.floor((gridHeight - height) / 2) : 0;

  const onCells = new Set(block.shape.map(([x, y]) => `${x},${y}`));
  const grid = document.createElement("div");
  grid.className = "mini-grid";
  grid.style.gridTemplateColumns = `repeat(${gridWidth}, ${cellSize}px)`;
  grid.style.gridTemplateRows = `repeat(${gridHeight}, ${cellSize}px)`;
  grid.style.gap = `${gap}px`;
  grid.style.setProperty("--mini-cell-size", `${cellSize}px`);

  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      const shapeX = x - offsetX;
      const shapeY = y - offsetY;
      const mini = document.createElement("div");
      mini.className = "mini-cell";
      if (onCells.has(`${shapeX},${shapeY}`)) {
        mini.classList.add("fill");
        mini.style.setProperty("--cell-color", block.color);
        if (attachShapeData) {
          mini.dataset.dx = String(shapeX);
          mini.dataset.dy = String(shapeY);
        }
      }
      grid.appendChild(mini);
    }
  }
  return grid;
}

function renderBlockView(container, block, { draggable = false } = {}) {
  if (!container) return;
  container.innerHTML = "";
  if (!block) return;

  container.classList.toggle("draggable-source", draggable);
  if (draggable) {
    container.classList.toggle("is-dragging", state.isDragging);
  }

  const blockGrid = createMiniGrid(block, {
    cellSize: 20,
    gap: 4,
    attachShapeData: draggable,
    fixedWidth: PREVIEW_GRID_SIZE,
    fixedHeight: PREVIEW_GRID_SIZE,
    centerShape: true,
  });
  container.appendChild(blockGrid);
}

function renderCollapseBar() {
  if (!elements.collapseBar) return;
  const value = state.collapse;
  const ratio = Math.max(0, Math.min(100, (value / BASE_TURN_COUNT) * 100));
  elements.collapseBar.style.width = `${ratio}%`;
  if (value <= 3) {
    elements.collapseBar.style.background = "linear-gradient(90deg, #b81e0d, #ff5555)";
  } else if (value <= 6) {
    elements.collapseBar.style.background = "linear-gradient(90deg, #cc6d00, #f7b32b)";
  } else {
    elements.collapseBar.style.background = "linear-gradient(90deg, #1f8f5f, #8bcf32)";
  }
}

function getCellFromPoint(clientX, clientY) {
  const metrics = state.dragBoardMetrics || readBoardMetrics();
  const { rect, paddingX, paddingY, gap, cellWidth, cellHeight } = metrics;
  if (
    clientX < rect.left || clientX > rect.right
    || clientY < rect.top || clientY > rect.bottom
  ) {
    return null;
  }

  const localX = clientX - rect.left - paddingX;
  const localY = clientY - rect.top - paddingY;
  if (localX < 0 || localY < 0) return null;

  const stepX = cellWidth + gap;
  const stepY = cellHeight + gap;
  const x = Math.floor(localX / stepX);
  const y = Math.floor(localY / stepY);
  if (!isInsideBoard(x, y)) return null;

  const offsetX = localX - x * stepX;
  const offsetY = localY - y * stepY;
  if (offsetX > cellWidth || offsetY > cellHeight) return null;

  return { x, y };
}

function getAnchorFromPoint(clientX, clientY) {
  const hovered = getCellFromPoint(clientX, clientY);
  if (!hovered) return null;
  return {
    x: hovered.x - state.dragGrabOffset.x,
    y: hovered.y - state.dragGrabOffset.y,
  };
}

function moveDragGhost(clientX, clientY) {
  if (!state.dragGhostEl) return;
  const { cellSize, gap } = state.dragGhostMetrics;
  const offsetX = state.dragGrabOffset.x * (cellSize + gap) + cellSize / 2;
  const offsetY = state.dragGrabOffset.y * (cellSize + gap) + cellSize / 2;
  state.dragGhostEl.style.left = `${clientX - offsetX}px`;
  state.dragGhostEl.style.top = `${clientY - offsetY}px`;
}

function getDragGhostHandlePoint() {
  if (!state.dragGhostEl) return null;
  const { cellSize, gap } = state.dragGhostMetrics;
  const offsetX = state.dragGrabOffset.x * (cellSize + gap) + cellSize / 2;
  const offsetY = state.dragGrabOffset.y * (cellSize + gap) + cellSize / 2;
  const left = Number.parseFloat(state.dragGhostEl.style.left || "0");
  const top = Number.parseFloat(state.dragGhostEl.style.top || "0");
  if (!Number.isFinite(left) || !Number.isFinite(top)) return null;
  return {
    x: left + offsetX,
    y: top + offsetY,
  };
}

function getBoardDragMetrics() {
  const metrics = state.dragBoardMetrics || readBoardMetrics();
  return {
    cellSize: metrics.cellWidth,
    gap: metrics.gap,
  };
}

function createDragGhost(block, metrics) {
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.appendChild(
    createMiniGrid(block, {
      cellSize: metrics.cellSize,
      gap: metrics.gap,
      attachShapeData: false,
    })
  );
  document.body.appendChild(ghost);
  return ghost;
}

function getBoardLaunchPoint() {
  const metrics = state.dragBoardMetrics || readBoardMetrics();
  const { rect, paddingY, gap, cellHeight } = metrics;
  const launchY = rect.top + paddingY + (BOARD_SIZE - 1) * (cellHeight + gap) + cellHeight / 2;
  return {
    x: rect.left + rect.width / 2,
    y: launchY,
  };
}

function findNearestFilledMiniCell(clientX, clientY) {
  const filled = Array.from(elements.currentBlockView.querySelectorAll(".mini-cell.fill"));
  if (filled.length === 0) return null;
  let nearest = null;
  let minDistance = Number.POSITIVE_INFINITY;
  for (const cell of filled) {
    const rect = cell.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = dx * dx + dy * dy;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = cell;
    }
  }
  return nearest;
}

function onDragStart(event) {
  if (state.gameOver || state.isResolving || !state.currentBlock) return;
  if (state.isDragging) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  let grabbedCell = event.target.closest(".mini-cell.fill");
  if (!grabbedCell || !elements.currentBlockView.contains(grabbedCell)) {
    grabbedCell = findNearestFilledMiniCell(event.clientX, event.clientY);
  }
  if (!grabbedCell) return;

  event.preventDefault();
  ensureAudioContext();
  state.isDragging = true;
  state.dragPointerId = event.pointerId ?? null;
  state.dragPointerPos = { x: event.clientX, y: event.clientY };
  state.dragGrabOffset = {
    x: Number(grabbedCell.dataset.dx || 0),
    y: Number(grabbedCell.dataset.dy || 0),
  };
  state.dragBoardMetrics = readBoardMetrics();
  state.dragGhostMetrics = getBoardDragMetrics();
  state.message = "보드 위 원하는 칸에 블록을 놓으세요.";
  state.dragGhostEl = createDragGhost(state.currentBlock, state.dragGhostMetrics);
  elements.currentBlockView.classList.add("is-dragging");
  elements.message.textContent = state.message;
  const launchPoint = getBoardLaunchPoint();
  moveDragGhost(launchPoint.x, launchPoint.y);
  updateHoverCell(getAnchorFromPoint(launchPoint.x, launchPoint.y));
  document.body.classList.add("dragging-block");

  try {
    elements.currentBlockView.setPointerCapture(event.pointerId);
  } catch (_error) {
    // No-op
  }
}

function flushPendingDragMove() {
  state.dragMoveRafId = null;
  if (!state.isDragging || !state.pendingDragPoint) return;
  const point = state.pendingDragPoint;
  state.pendingDragPoint = null;
  if (!state.dragPointerPos) {
    state.dragPointerPos = point;
    return;
  }
  const dx = point.x - state.dragPointerPos.x;
  const dy = point.y - state.dragPointerPos.y;
  state.dragPointerPos = point;

  const handlePoint = getDragGhostHandlePoint();
  if (!handlePoint) return;
  const nextX = handlePoint.x + dx;
  const nextY = handlePoint.y + dy;
  moveDragGhost(nextX, nextY);
  updateHoverCell(getAnchorFromPoint(nextX, nextY));
}

function onDragMove(event) {
  if (!state.isDragging) return;
  if (state.dragPointerId !== null && event.pointerId !== state.dragPointerId) return;
  state.pendingDragPoint = { x: event.clientX, y: event.clientY };
  if (state.dragMoveRafId !== null) return;
  state.dragMoveRafId = requestAnimationFrame(flushPendingDragMove);
}

function onDragEnd(event) {
  if (!state.isDragging) return;
  if (state.dragPointerId !== null && event.pointerId !== state.dragPointerId) return;
  const dropCell = state.hoverCell || getAnchorFromPoint(event.clientX, event.clientY);
  const canDrop = !!dropCell && canPlaceBlock(state.currentBlock, dropCell.x, dropCell.y);
  endDragInteraction();

  if (canDrop && dropCell) {
    runPlacement(dropCell.x, dropCell.y);
    return;
  }

  state.message = "유효한 칸에 드롭해 주세요.";
  render();
}

function onDragCancel(event) {
  if (!state.isDragging) return;
  if (state.dragPointerId !== null && event.pointerId !== state.dragPointerId) return;
  endDragInteraction();
  state.message = "드래그가 취소되었습니다.";
  render();
}

function onWindowKeyDown(event) {
  if (event.key !== "Escape") return;
  if (state.rankingOpen) {
    event.preventDefault();
    closeRankingModal();
    return;
  }
  if (state.settingsOpen) {
    event.preventDefault();
    closeSettingsModal();
  }
}

function render() {
  elements.scoreValue.textContent = String(state.score);
  elements.bestScoreValue.textContent = String(state.bestScore);
  elements.collapseValue.textContent = String(state.collapse);
  if (elements.collapseWrap) {
    elements.collapseWrap.classList.toggle("is-danger", state.collapse <= LOW_TURN_WARNING_THRESHOLD);
  }
  if (elements.endingScoreValue) {
    elements.endingScoreValue.textContent = String(state.score);
  }
  elements.message.textContent = state.message;
  elements.skipButton.textContent = "SKIP";
  elements.skipButton.classList.toggle("needs-ad", state.freeSkipUsed);
  elements.skipButton.classList.remove("is-paid", "is-risky");
  elements.skipButton.disabled = state.gameOver || state.isResolving;
  if (elements.endingContinueButton) {
    elements.endingContinueButton.disabled = state.endingSequenceRunning;
  }
  elements.gameOverLayer.classList.toggle("hidden", !state.gameOver);
  if (state.gameOver) {
    syncEndingBoardFxBounds();
  }

  renderCollapseBar();
  renderBoard();
  renderBlockView(elements.currentBlockView, state.currentBlock, { draggable: true });
  if (state.rankingOpen) {
    syncRankingFields();
  }
}

function resetGame() {
  commitRankingIfNeeded();
  endDragInteraction();
  clearAmbientTheme();
  if (state.screenFlashTimeoutId) {
    window.clearTimeout(state.screenFlashTimeoutId);
    state.screenFlashTimeoutId = null;
  }
  document.documentElement.style.setProperty("--screen-flash-alpha", "0");
  if (state.boardFlashTimeoutId) {
    window.clearTimeout(state.boardFlashTimeoutId);
    state.boardFlashTimeoutId = null;
  }
  if (elements.board) {
    elements.board.style.setProperty("--board-flash-alpha", "0");
  }
  resetEndingLayerVisuals();
  const nextGamesSinceAllClear = getGamesSinceAllClear() + 1;
  setGamesSinceAllClear(nextGamesSinceAllClear);
  state.gamesSinceAllClear = nextGamesSinceAllClear;
  state.allClearGuaranteeActive = nextGamesSinceAllClear >= ALL_CLEAR_GUARANTEE_GAP;
  state.allClearAwardedThisRun = false;
  state.board = createSeededBoard(getDifficulty(0));
  state.score = 0;
  state.collapse = BASE_TURN_COUNT;
  state.noClearStreak = 0;
  state.clearStreakTurns = 0;
  state.continueUsedThisGame = false;
  state.runStartBest = state.bestScore;
  state.runPlayerId = state.playerId;
  state.turnsPlayed = 0;
  state.freeSkipUsed = false;
  state.hoverCell = null;
  state.gameOver = false;
  state.rankingSavedThisGame = false;
  state.endingSequenceRunning = false;
  state.message = state.allClearGuaranteeActive
    ? "이번 판은 올클리어 달성 시 보너스 강화 모드입니다."
    : "현재 블록을 드래그해서 보드에 놓으세요.";
  state.currentBlock = generateBlock();
  render();
}

elements.skipButton.addEventListener("click", runSkip);
elements.endingContinueButton.addEventListener("click", runEndingContinue);
elements.endingNewGameButton.addEventListener("click", resetGame);
elements.currentBlockView.addEventListener("pointerdown", onDragStart);
elements.rankingButton.addEventListener("click", openRankingModal);
elements.settingsButton.addEventListener("click", openSettingsModal);
elements.settingsCloseButton.addEventListener("click", closeSettingsModal);
elements.settingsBackdrop.addEventListener("click", closeSettingsModal);
elements.soundSwitchButton.addEventListener("click", toggleSoundEnabled);
elements.bgmSwitchButton.addEventListener("click", toggleBgmEnabled);
elements.profileButton.addEventListener("click", toggleProfilePanel);
elements.editPlayerIdButton.addEventListener("click", enablePlayerIdEdit);
elements.savePlayerIdButton.addEventListener("click", savePlayerIdFromInput);
elements.linkAccountButton.addEventListener("click", toggleAccountProvidersInfo);
elements.playerIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    savePlayerIdFromInput();
  }
});
elements.rankingCloseButton.addEventListener("click", closeRankingModal);
elements.rankingBackdrop.addEventListener("click", closeRankingModal);
elements.myRankTabButton.addEventListener("click", () => setRankingView("mine"));
elements.top10TabButton.addEventListener("click", () => setRankingView("top10"));
window.addEventListener("pointermove", onDragMove);
window.addEventListener("pointerup", onDragEnd);
window.addEventListener("pointercancel", onDragCancel);
window.addEventListener("keydown", onWindowKeyDown);
window.addEventListener("resize", () => {
  if (state.gameOver) {
    syncEndingBoardFxBounds();
  }
});

syncSettingsFields();
syncRankingFields();
syncBgmPlayback();
resetGame();
