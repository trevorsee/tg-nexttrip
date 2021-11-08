export const filterByQuery = (items, query, searchFor) => {
  return items.filter((item) => {
    if (!query) return true;
    return item[searchFor].toLowerCase().indexOf(query.toLowerCase()) > -1;
  });
};
