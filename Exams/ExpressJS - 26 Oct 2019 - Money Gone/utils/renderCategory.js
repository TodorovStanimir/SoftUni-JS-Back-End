const category = [["advertising", "Advertising"], ["benefits", "Benefits"], ["car", "Car"], ["equipment", "Equipment"],
["fees", "Fees"], ["home-office", "Home Office"], ["insurance", "Insurance"], ["interest", "Interest"], ["Labor", "Labor"],
["maintenance", "Maintenance"], ["materials", "Materials"], ["meals-and-entertainment", "Meals and Entertainment"], ["office-supplies", "Office Supplies"],
["other", "Other"], ["professional-services", "Professional Services"], ["rent", "Rent"], ["taxes", "Taxes"], ["travel", "Travel"], ["utilities", "Utilities"]];

module.exports = renderCategory = (currentCategory) => {

  return category.map(el =>
    el[0] === currentCategory
      ? `<option value="${el[0]}" selected="selected">${el[1]}</option>`
      : `<option value="${el[0]}">${el[1]}</option>`
  ).join('');
}