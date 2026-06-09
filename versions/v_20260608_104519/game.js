const CELL = 58;
const GAP = 6;

let COLS = 6;
let ROWS = 5;

const itemsTable = [
  { id: "potion", name: "药水", icon: "potion", width: 1, height: 1, score: 2, type: "potion", tag: "1x1 药剂", color: "#B7E6D0" },
  { id: "herb", name: "草药", icon: "herb", width: 2, height: 1, score: 3, type: "herb", tag: "2x1 草药", color: "#9FD39C" },
  { id: "book", name: "魔法书", icon: "book", width: 2, height: 2, score: 6, type: "magic", tag: "2x2 魔法", color: "#C4B5FD" },
  { id: "broom", name: "扫帚", icon: "broom", width: 1, height: 4, score: 8, type: "tool", tag: "1x4 工具", color: "#F2C46D" },
  { id: "mushroom", name: "蘑菇篮", icon: "mushroom", width: 2, height: 1, score: 3, type: "herb", tag: "2x1 食材", color: "#DFA7C7" },
  { id: "crystal", name: "水晶球", icon: "crystal", width: 2, height: 2, score: 7, type: "magic", tag: "2x2 占卜", color: "#A7D8F2" },
  { id: "coin", name: "金币袋", icon: "coin", width: 1, height: 2, score: 4, type: "treasure", tag: "1x2 财富", color: "#F3C66D" },
  { id: "scroll", name: "卷轴", icon: "scroll", width: 1, height: 3, score: 5, type: "magic", tag: "1x3 魔法", color: "#E9D7B4" },
  { id: "fire", name: "火焰石", icon: "fire", width: 1, height: 1, score: 5, type: "fire", tag: "1x1 火", color: "#F2A09A" },
  { id: "cloth", name: "披风", icon: "cloth", width: 2, height: 3, score: 7, type: "cloth", tag: "2x3 布料", color: "#BBA4D8" },
  { id: "wand", name: "魔杖", icon: "wand", width: 1, height: 3, score: 6, type: "magic", tag: "1x3 工具", color: "#D4C5E8" },
  { id: "lantern", name: "魔法灯", icon: "lantern", width: 1, height: 2, score: 4, type: "tool", tag: "1x2 工具", color: "#FFD966" }
];

const levelsTable = [
  { id: 1, day: "Day 1", name: "森林采露水", gridCols: 6, gridRows: 5, targetScore: 18, itemsTotalScore: 36, rules: ["adjacent_bonus"], rulesDescription: "相邻加成", brief: "今天要去森林采集晨露。", clearMessage: "背包啪地合上。" },
  { id: 2, day: "Day 2", name: "月光集市", gridCols: 6, gridRows: 5, targetScore: 24, itemsTotalScore: 40, rules: ["adjacent_bonus", "rotation"], rulesDescription: "相邻加成 + 旋转", brief: "集市很热闹。", clearMessage: "金币袋轻轻一响。" },
  { id: 3, day: "Day 3", name: "旧钟楼", gridCols: 6, gridRows: 5, targetScore: 28, itemsTotalScore: 45, rules: ["forbidden_adjacent"], rulesDescription: "禁忌相邻", brief: "旧钟楼里到处是旧布和魔火。", clearMessage: "火焰石被妥帖隔开。" },
  { id: 4, day: "Day 4", name: "魔法学院", gridCols: 6, gridRows: 6, targetScore: 32, itemsTotalScore: 44, rules: ["adjacent_bonus", "rotation"], rulesDescription: "相邻加成 + 旋转", brief: "魔法学院的课程。", clearMessage: "魔杖和魔法书准备完毕。" },
  { id: 5, day: "Day 5", name: "龙穴探险", gridCols: 7, gridRows: 6, targetScore: 38, itemsTotalScore: 55, rules: ["adjacent_bonus", "forbidden_adjacent"], rulesDescription: "相邻加成 + 禁忌相邻", brief: "龙穴探险充满危险！", clearMessage: "装备已准备就绪。" }
];

const levelItemsTable = [
  { levelId: 1, items: ["potion", "herb", "book", "broom", "mushroom", "crystal", "coin"] },
  { levelId: 2, items: ["coin", "crystal", "book", "broom", "potion", "herb", "scroll", "mushroom"] },
  { levelId: 3, items: ["fire", "cloth", "broom", "book", "potion", "herb", "scroll", "crystal", "coin"] },
  { levelId: 4, items: ["book", "wand", "scroll", "potion", "crystal", "herb", "coin", "lantern"] },
  { levelId: 5, items: ["fire", "potion", "herb", "book", "broom", "crystal", "coin", "cloth", "lantern"] }
];

const getItemById = (id) => itemsTable.find(item => item.id === id);
const getLevelItems = (levelId) => levelItemsTable.find(item => item.levelId === levelId)?.items || [];
const getLevelConfig = (index) => {
  if (index < 0 || index >= levelsTable.length) return null;
  const current = levelsTable[index];
  return { ...current, availableItems: getLevelItems(current.id) };
};
const getTotalLevels = () => levelsTable.length;

const getItemDef = (id) => {
  const item = getItemById(id);
  if (!item) return null;
  return { name: item.name, icon: item.icon, w: item.width, h: item.height, score: item.score, type: item.type, color: item.color, tag: item.tag };
};

const getCurrentLevel = (index) => getLevelConfig(index);

const els = {
  dayLabel: document.querySelector("#dayLabel"),
  destination: document.querySelector("#destination"),
  scoreText: document.querySelector("#scoreText"),
  progressFill: document.querySelector("#progressFill"),
  stars: document.querySelector("#stars"),
  brief: document.querySelector("#brief"),
  ruleChip: document.querySelector("#ruleChip"),
  hint: document.querySelector("#hint"),
  grid: document.querySelector("#grid"),
  placedLayer: document.querySelector("#placedLayer"),
  dragPreview: document.querySelector("#dragPreview"),
  itemPool: document.querySelector("#itemPool"),
  remainingText: document.querySelector("#remainingText"),
  rotateBtn: document.querySelector("#rotateBtn"),
  undoBtn: document.querySelector("#undoBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  exitBtn: document.querySelector("#exitBtn"),
  gmResetBtn: document.querySelector("#gmResetBtn"),
  departBtn: document.querySelector("#departBtn"),
  toast: document.querySelector("#toast"),
  modal: document.querySelector("#clearModal"),
  ratingText: document.querySelector("#ratingText"),
  clearCopy: document.querySelector("#clearCopy"),
  nextBtn: document.querySelector("#nextBtn"),
  exitModal: document.querySelector("#exitModal"),
  cancelExitBtn: document.querySelector("#cancelExitBtn"),
  confirmExitBtn: document.querySelector("#confirmExitBtn")
};

let levelIndex = 0;
let placed = [];
let used = new Set();
let dragging = null;
let toastTimer = null;
let previousScore = 0;

const instanceDef = (id) => {
  const [base] = id.split("-");
  return getItemDef(base);
};

const levelItems = () => {
  const level = getCurrentLevel(levelIndex);
  if (!level) return [];
  const items = getLevelItems(level.id);
  return items.map((key, index) => `${key}-${index}`);
};

const initGrid = () => {
  els.grid.innerHTML = "";
  for (let i = 0; i < COLS * ROWS; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    els.grid.appendChild(cell);
  }
};

const itemSize = (def, rotated = false) => rotated ? { w: def.h, h: def.w } : { w: def.w, h: def.h };

const pixelSize = (def, rotated = false) => {
  const size = itemSize(def, rotated);
  return { width: size.w * CELL + (size.w - 1) * GAP, height: size.h * CELL + (size.h - 1) * GAP };
};

const createItemNode = (id, className, rotated = false) => {
  const def = instanceDef(id);
  const node = document.createElement("div");
  const size = pixelSize(def, rotated);
  node.className = `item ${className}`;
  node.dataset.id = id;
  node.style.width = `${size.width}px`;
  node.style.height = `${size.height}px`;
  node.style.background = def.color;
  const iconSize = Math.min(size.width, size.height) * 0.55;
  const hasIcon = def.icon && def.icon !== "";
  node.innerHTML = `${hasIcon ? `<img class="item-icon" src="./assets/images/icons/${def.icon}.svg" alt="${def.name}" style="width: ${iconSize}px; height: ${iconSize}px;" />` : ''}<span class="score-badge">${def.score}</span><span class="item-name">${def.name}</span><span class="item-tag">${rotated ? "已旋转 " : ""}${def.tag}</span>`;
  return node;
};

const renderLevel = () => {
  const level = getCurrentLevel(levelIndex);
  if (!level) return;
  COLS = level.gridCols;
  ROWS = level.gridRows;
  placed = [];
  used = new Set();
  previousScore = 0;
  clearDrag();
  els.dayLabel.textContent = level.day;
  els.destination.textContent = level.name;
  els.brief.textContent = level.brief;
  els.ruleChip.textContent = `规则：${level.rulesDescription}`;
  initGrid();
  els.modal.hidden = true;
  renderPool();
  renderPlaced();
  updateScore();
  showToast(`${level.day}：${level.name}`);
};

const renderPool = () => {
  els.itemPool.innerHTML = "";
  const items = levelItems();
  for (const id of items) {
    const node = createItemNode(id, "pool");
    if (used.has(id)) node.classList.add("used");
    node.addEventListener("pointerdown", (e) => startDrag(e, id));
    els.itemPool.appendChild(node);
  }
  const remaining = levelItems().length - used.size;
  els.remainingText.textContent = `剩余 ${remaining} 件`;
};

const renderPlaced = () => {
  els.placedLayer.innerHTML = "";
  for (const item of placed) {
    const node = createItemNode(item.id, "placed", item.rotated);
    node.style.left = `${item.x * (CELL + GAP)}px`;
    node.style.top = `${item.y * (CELL + GAP)}px`;
    node.addEventListener("pointerdown", (e) => startDrag(e, item.id, item));
    els.placedLayer.appendChild(node);
  }
};

const updateScore = () => {
  const level = getCurrentLevel(levelIndex);
  let score = 0;
  for (const item of placed) {
    const def = instanceDef(item.id);
    if (def) score += def.score;
  }
  const target = level?.targetScore || 18;
  const pct = Math.min(100, (score / target) * 100);
  els.progressFill.style.width = `${pct}%`;
  els.scoreText.textContent = `准备值 ${score} / ${target}`;
  els.departBtn.disabled = score < target;
  els.departBtn.textContent = score >= target ? "出发" : "未达成";
  previousScore = score;
};

const canPlace = (id, x, y, rotated, excludeIdx = -1) => {
  const def = instanceDef(id);
  if (!def) return false;
  const size = itemSize(def, rotated);
  for (let dx = 0; dx < size.w; dx++) {
    for (let dy = 0; dy < size.h; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;
      for (let i = 0; i < placed.length; i++) {
        if (i === excludeIdx) continue;
        const p = placed[i];
        const ps = itemSize(instanceDef(p.id), p.rotated);
        if (nx >= p.x && nx < p.x + ps.w && ny >= p.y && ny < p.y + ps.h) return false;
      }
    }
  }
  return true;
};

const placeItem = (id, x, y, rotated, excludeIdx = -1) => {
  if (!canPlace(id, x, y, rotated, excludeIdx)) return false;
  placed.push({ id, x, y, rotated });
  used.add(id);
  return true;
};

const startDrag = (e, id, placedItem = null) => {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  const rotated = placedItem ? placedItem.rotated : false;
  dragging = { id, startX: e.clientX, startY: e.clientY, rotated, placedItem };
  els.dragPreview.innerHTML = "";
  const node = createItemNode(id, "preview", rotated);
  els.dragPreview.appendChild(node);
  els.dragPreview.hidden = false;
  updateDragPosition(e.clientX, e.clientY);
  document.addEventListener("pointermove", onDragMove);
  document.addEventListener("pointerup", onDragEnd);
};

const updateDragPosition = (cx, cy) => {
  if (!dragging) return;
  const def = instanceDef(dragging.id);
  
  els.dragPreview.style.left = `${cx}px`;
  els.dragPreview.style.top = `${cy}px`;
  
  const rect = els.grid.getBoundingClientRect();
  const halfW = Math.floor(itemSize(def, dragging.rotated).w / 2);
  const halfH = Math.floor(itemSize(def, dragging.rotated).h / 2);
  
  const mouseX = Math.round((cx - rect.left) / (CELL + GAP));
  const mouseY = Math.round((cy - rect.top) / (CELL + GAP));
  
  let x = mouseX - halfW;
  let y = mouseY - halfH;
  
  x = Math.max(0, Math.min(x, COLS - itemSize(def, dragging.rotated).w));
  y = Math.max(0, Math.min(y, ROWS - itemSize(def, dragging.rotated).h));
  
  els.dragPreview.dataset.gridX = x;
  els.dragPreview.dataset.gridY = y;
  
  requestAnimationFrame(() => {
    highlightCells(dragging.id, x, y, dragging.rotated);
  });
};

const highlightCells = (id, x, y, rotated) => {
  document.querySelectorAll(".cell").forEach(c => c.classList.remove("ok", "no"));
  if (!dragging) return;
  const def = instanceDef(id);
  if (!def) return;
  const size = itemSize(def, rotated);
  const excludeIdx = dragging.placedItem ? placed.indexOf(dragging.placedItem) : -1;
  
  for (let dx = 0; dx < size.w; dx++) {
    for (let dy = 0; dy < size.h; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      const idx = ny * COLS + nx;
      const cell = els.grid.children[idx];
      if (!cell) continue;
      if (canPlace(id, x, y, rotated, excludeIdx)) {
        cell.classList.add("ok");
      } else {
        cell.classList.add("no");
      }
    }
  }
};

let dragMovePending = false;
let dragMoveX = 0;
let dragMoveY = 0;

const onDragMove = (e) => {
  dragMoveX = e.clientX;
  dragMoveY = e.clientY;
  if (!dragMovePending) {
    dragMovePending = true;
    requestAnimationFrame(() => {
      dragMovePending = false;
      updateDragPosition(dragMoveX, dragMoveY);
    });
  }
};

const onDragEnd = (e) => {
  document.removeEventListener("pointermove", onDragMove);
  document.removeEventListener("pointerup", onDragEnd);
  if (!dragging) return;
  const x = parseInt(els.dragPreview.dataset.gridX);
  const y = parseInt(els.dragPreview.dataset.gridY);
  
  const excludeIdx = dragging.placedItem ? placed.indexOf(dragging.placedItem) : -1;
  
  if (!isNaN(x) && !isNaN(y) && placeItem(dragging.id, x, y, dragging.rotated, excludeIdx)) {
    if (dragging.placedItem) {
      const idx = placed.indexOf(dragging.placedItem);
      if (idx !== -1) {
        placed.splice(idx, 1);
        used.delete(dragging.placedItem.id);
      }
    }
    renderPool();
    renderPlaced();
    updateScore();
  }
  clearDrag();
};

const clearDrag = () => {
  dragging = null;
  els.dragPreview.hidden = true;
  els.dragPreview.innerHTML = "";
  document.querySelectorAll(".cell").forEach(c => c.classList.remove("ok", "no"));
};

const rotateDragging = () => {
  if (!dragging) return;
  dragging.rotated = !dragging.rotated;
  els.dragPreview.innerHTML = "";
  const node = createItemNode(dragging.id, "preview", dragging.rotated);
  els.dragPreview.appendChild(node);
  const cx = dragging.startX;
  const cy = dragging.startY;
  updateDragPosition(cx, cy);
};

const undo = () => {
  if (placed.length === 0) return;
  const item = placed.pop();
  used.delete(item.id);
  renderPool();
  renderPlaced();
  updateScore();
};

const resetLevel = () => {
  placed = [];
  used = new Set();
  previousScore = 0;
  renderPool();
  renderPlaced();
  updateScore();
};

const clearLevel = () => {
  const level = getCurrentLevel(levelIndex);
  let score = 0;
  for (const item of placed) {
    const def = instanceDef(item.id);
    if (def) score += def.score;
  }
  const target = level?.targetScore || 18;
  const stars = score >= target ? (score >= target * 1.5 ? 3 : score >= target * 1.2 ? 2 : 1) : 0;
  els.ratingText.textContent = stars > 0 ? `完美收纳 ${"★".repeat(stars)}${"☆".repeat(3 - stars)}` : "未达成目标";
  els.clearCopy.textContent = level?.clearMessage || "完成！";
  els.modal.hidden = false;
};

const nextLevel = () => {
  const total = getTotalLevels();
  levelIndex = (levelIndex + 1) % total;
  localStorage.setItem('gameProgress', JSON.stringify({ levelIndex }));
  renderLevel();
};

const resetGame = () => {
  levelIndex = 0;
  localStorage.removeItem('gameProgress');
  renderLevel();
};

const showToast = (message) => {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.hidden = false;
  toastTimer = setTimeout(() => { els.toast.hidden = true; }, 1600);
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem('gameProgress');
    if (saved) {
      const p = JSON.parse(saved);
      levelIndex = p.currentLevel || 0;
    }
  } catch (e) { levelIndex = 0; }
  const level = getCurrentLevel(levelIndex);
  if (level) { COLS = level.gridCols; ROWS = level.gridRows; }
  initGrid();
  renderLevel();
  els.rotateBtn.addEventListener("click", rotateDragging);
  els.undoBtn.addEventListener("click", undo);
  els.resetBtn.addEventListener("click", resetLevel);
  els.exitBtn.addEventListener("click", () => { els.exitModal.hidden = false; });
  els.gmResetBtn.addEventListener("click", resetGame);
  els.departBtn.addEventListener("click", clearLevel);
  els.nextBtn.addEventListener("click", nextLevel);
  els.cancelExitBtn.addEventListener("click", () => { els.exitModal.hidden = true; });
  els.confirmExitBtn.addEventListener("click", () => {
    localStorage.setItem('gameProgress', JSON.stringify({ levelIndex, placed, used: Array.from(used) }));
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
  });
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") rotateDragging();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") undo();
  });
});