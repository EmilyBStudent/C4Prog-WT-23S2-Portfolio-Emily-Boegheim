/**
 * Ensure only one of the stars/planets checkboxes is checked at any time.
 * @param event The event triggered by changing a checkbox value.
 */
function checkOnlyOneBox(event) {
  const starsCheckbox = document.getElementById('stars');
  const planetsCheckbox = document.getElementById('planets');
  if (event.target === starsCheckbox) {
    planetsCheckbox.checked = false;
  } else {
    starsCheckbox.checked = false;
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