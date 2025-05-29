/**
 * Ensure only one of the stars/planets checkboxes is checked at any time.
 * @param event The event triggered by changing a checkbox value.
 */
function checkOnlyOneBox(event) {
  const starsCheckbox = document.getElementById('stars');
  const planetsCheckbox = document.getElementById('planets');
  const starsOptions = document.getElementById('stars-options');
  const planetsOptions = document.getElementById('planets-options');
  if (event.target === starsCheckbox && starsCheckbox.checked) {
    planetsCheckbox.checked = false;
    starsOptions.style.display = 'block';
    planetsOptions.style.display = 'none';
  } else if (event.target === planetsCheckbox && planetsCheckbox.checked) {
    starsCheckbox.checked = false;
    starsOptions.style.display = 'none';
    planetsOptions.style.display = 'block';
  } else {
    starsOptions.style.display = 'none';
    planetsOptions.style.display = 'none';
  }
}

/**
 * Initialise the Stars/Planets API request form.
 * @param event The window load event.
 */
function initForm(event) {
  const starsOrPlanets = document.getElementById('stars-or-planets');
  starsOrPlanets.addEventListener('change', checkOnlyOneBox);
}

window.addEventListener('load', initForm);