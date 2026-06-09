export const levelItemsTable = [
  { levelId: 1, items: ["potion", "herb", "book", "broom", "mushroom", "crystal", "coin"] },
  { levelId: 2, items: ["coin", "crystal", "book", "broom", "potion", "herb", "scroll", "mushroom"] },
  { levelId: 3, items: ["fire", "cloth", "broom", "book", "potion", "herb", "scroll", "crystal", "coin"] },
  { levelId: 4, items: ["book", "wand", "scroll", "potion", "crystal", "herb", "coin", "lantern"] },
  { levelId: 5, items: ["fire", "potion", "herb", "book", "broom", "crystal", "coin", "cloth", "lantern"] }
];

export const getLevelItems = (levelId) => {
  return levelItemsTable.find(item => item.levelId === levelId)?.items || [];
};