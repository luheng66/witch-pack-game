export const itemsTable = [
  { id: "potion", name: "药水", icon: "potion", width: 1, height: 1, score: 2, type: "potion", tag: "1x1 药剂", color: "#B7E6D0", description: "恢复魔力的药剂" },
  { id: "herb", name: "草药", icon: "herb", width: 2, height: 1, score: 3, type: "herb", tag: "2x1 草药", color: "#9FD39C", description: "新鲜采集的草药" },
  { id: "book", name: "魔法书", icon: "book", width: 2, height: 2, score: 6, type: "magic", tag: "2x2 魔法", color: "#C4B5FD", description: "记载古老咒语的魔法书" },
  { id: "broom", name: "扫帚", icon: "broom", width: 1, height: 4, score: 8, type: "tool", tag: "1x4 工具", color: "#F2C46D", description: "可飞行的魔法扫帚" },
  { id: "mushroom", name: "蘑菇篮", icon: "mushroom", width: 2, height: 1, score: 3, type: "herb", tag: "2x1 食材", color: "#DFA7C7", description: "新鲜采摘的蘑菇" },
  { id: "crystal", name: "水晶球", icon: "crystal", width: 2, height: 2, score: 7, type: "magic", tag: "2x2 占卜", color: "#A7D8F2", description: "用于占卜的水晶球" },
  { id: "coin", name: "金币袋", icon: "coin", width: 1, height: 2, score: 4, type: "treasure", tag: "1x2 财富", color: "#F3C66D", description: "装满金币的袋子" },
  { id: "scroll", name: "卷轴", icon: "scroll", width: 1, height: 3, score: 5, type: "magic", tag: "1x3 魔法", color: "#E9D7B4", description: "记载魔法卷轴" },
  { id: "fire", name: "火焰石", icon: "fire", width: 1, height: 1, score: 5, type: "fire", tag: "1x1 火", color: "#F2A09A", description: "蕴含火焰力量的石头" },
  { id: "cloth", name: "披风", icon: "cloth", width: 2, height: 3, score: 7, type: "cloth", tag: "2x3 布料", color: "#BBA4D8", description: "魔法防护披风" },
  { id: "wand", name: "魔杖", icon: "wand", width: 1, height: 3, score: 6, type: "magic", tag: "1x3 工具", color: "#D4C5E8", description: "施放魔法的魔杖" },
  { id: "lantern", name: "魔法灯", icon: "lantern", width: 1, height: 2, score: 4, type: "tool", tag: "1x2 工具", color: "#FFD966", description: "永不熄灭的魔法灯" }
];

export const getItemById = (id) => {
  return itemsTable.find(item => item.id === id);
};

export const getItemsByType = (type) => {
  return itemsTable.filter(item => item.type === type);
};

export const getItemScore = (id) => {
  const item = getItemById(id);
  return item ? item.score : 0;
};
