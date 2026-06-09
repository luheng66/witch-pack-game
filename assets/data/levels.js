import { itemsTable, getItemById } from './items.js';

export const levelsTable = [
  {
    id: 1,
    day: "Day 1",
    name: "森林采露水",
    gridCols: 6,
    gridRows: 5,
    targetScore: 18,
    rules: ["adjacent_bonus"],
    rulesDescription: "相邻加成",
    availableItems: ["potion","herb","book","broom","mushroom","crystal","coin"],
    brief: "今天要去森林采集晨露。至少准备 18 点，草药靠近药水会有额外加成。",
    clearMessage: "背包啪地合上，露娜带着晨露瓶和草药走进森林。"
  },
  {
    id: 2,
    day: "Day 2",
    name: "月光集市",
    gridCols: 6,
    gridRows: 5,
    targetScore: 24,
    rules: ["adjacent_bonus","rotation"],
    rulesDescription: "相邻加成 + 旋转",
    availableItems: ["coin","crystal","book","broom","potion","herb","scroll","mushroom"],
    brief: "集市很热闹，但背包空间更紧。金币袋靠近水晶会额外加分。",
    clearMessage: "金币袋轻轻一响，水晶映出月光。露娜准备好去集市换取新材料。"
  },
  {
    id: 3,
    day: "Day 3",
    name: "旧钟楼",
    gridCols: 6,
    gridRows: 5,
    targetScore: 28,
    rules: ["forbidden_adjacent"],
    rulesDescription: "禁忌相邻",
    availableItems: ["fire","cloth","broom","book","potion","herb","scroll","crystal","coin"],
    brief: "旧钟楼里到处是旧布和魔火。火焰石不能贴着布料，否则会被判定为危险收纳。",
    clearMessage: "火焰石被妥帖隔开，披风没有一点焦痕。露娜满意地扣上背包。"
  },
  {
    id: 4,
    day: "Day 4",
    name: "魔法学院",
    gridCols: 6,
    gridRows: 6,
    targetScore: 32,
    rules: ["adjacent_bonus","rotation"],
    rulesDescription: "相邻加成 + 旋转",
    availableItems: ["book","wand","scroll","potion","crystal","herb","coin","lantern"],
    brief: "魔法学院的课程需要更多魔法物品。合理安排空间获得更高分数。",
    clearMessage: "魔杖和魔法书准备完毕，露娜自信地走向学院大门。"
  },
  {
    id: 5,
    day: "Day 5",
    name: "龙穴探险",
    gridCols: 7,
    gridRows: 6,
    targetScore: 38,
    rules: ["adjacent_bonus","forbidden_adjacent"],
    rulesDescription: "相邻加成 + 禁忌相邻",
    availableItems: ["fire","potion","herb","book","broom","crystal","coin","cloth","lantern"],
    brief: "龙穴探险充满危险！火焰石不能靠近布料，但可以和药水相邻获得加成。",
    clearMessage: "装备已准备就绪，露娜勇敢地踏入龙穴。"
  }
];

export const getLevelById = (id) => {
  return levelsTable.find(level => level.id === id);
};

export const getLevelByIndex = (index) => {
  return levelsTable[index];
};

export const getTotalLevels = () => {
  return levelsTable.length;
};

export const calculateAvailableItemsScore = (level) => {
  let totalScore = 0;
  level.availableItems.forEach(itemId => {
    const item = getItemById(itemId);
    if (item) {
      totalScore += item.score;
    }
  });
  return totalScore;
};

export const getLevelConfig = (index) => {
  if (index < 0 || index >= levelsTable.length) {
    return null;
  }
  
  const current = levelsTable[index];
  const previous = index > 0 ? levelsTable[index - 1] : null;
  
  return {
    id: current.id,
    day: current.day || previous?.day || "Day 1",
    name: current.name || previous?.name || "未知关卡",
    gridCols: current.gridCols || previous?.gridCols || 6,
    gridRows: current.gridRows || previous?.gridRows || 5,
    targetScore: current.targetScore || previous?.targetScore || 18,
    rules: current.rules || previous?.rules || [],
    rulesDescription: current.rulesDescription || previous?.rulesDescription || "",
    availableItems: current.availableItems || previous?.availableItems || [],
    brief: current.brief || previous?.brief || "",
    clearMessage: current.clearMessage || previous?.clearMessage || ""
  };
};
