const authCookieName = 'auth_cookie';
const difficultyLevel = [
  '1 - Very Easy',
  '2 - Easy',
  '3 - Medium (Standard 3x3)',
  '4 - Intermediate',
  '5 - Expert',
  '6 - Hardcore'
];

function renderDificultyLevel(currentLevel) {
  return difficultyLevel.map(level => {
    const valueLevel = +level.split(' - ')[0];
    return valueLevel === Number(currentLevel)
      ? `<option value="${valueLevel}" selected="selected">${level}</option>`
      : `<option value="${valueLevel}">${level}</option>`
  }).join('');
}

function handleValidationErrors(err, res, template, cube) {

    const cubeDifficultyLevel = renderDificultyLevel(cube.difficultyLevel);
    res.render(template, {
      errors: err.errors,
      cube, cubeDifficultyLevel
    });
    return;
  
}
module.exports = {
  authCookieName,
  renderDificultyLevel,
  handleValidationErrors
}