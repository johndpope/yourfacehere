const categoryKeyMap = {
  "league_of_legends": "League of Legends",
  "disney": "Disney"
}

export default {
  getLabelByKey(categoryKey) {
    for (var key in categoryKeyMap){
      if (key === categoryKey) {
        return categoryKeyMap[key]
      }
    }
    return categoryKey;
  }
};
