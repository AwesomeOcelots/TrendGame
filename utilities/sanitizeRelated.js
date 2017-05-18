module.exports = (list) => {
  var rawList = list.default.rankedList[1].rankedKeyword.slice(1, 11);
  var cleanList = [];
  rawList.forEach((listNode) => {
    cleanList.push(listNode.query);
  })
  return cleanList;
}