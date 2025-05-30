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
 * When the form Submit button is clicked, call the appropriate API and display
 * the results.
 * @param event The event triggered by clicking the Submit button.
 */
async function callApi(event) {
  event.preventDefault();
  const requestValues = getFormValues();
  const requestUrl = buildApiUrl(requestValues);
  await fetch(requestUrl, {
    headers: {'X-Api-Key': apiKey}
    })
    .then(async function (response) {
      if (!response.ok) {
        // TODO: error handling
      }
      return await response.json();
    })
    .then(function (results) {
      displayApiResults(results);
    });
}

/**
 * Get the values for the API request from the form and return them as an
 * object.
 * @returns {Object} with fields route and name, giving the API route to use and
 *   the name parameter to pass to the API.
 */
function getFormValues() {
  const selectedCheckbox = document.querySelector('#stars-or-planets input:checked');
  if (!selectedCheckbox) {
    // TODO: error handling
    // stop here
    return;
  }

  const apiRequestValues = new Object();
  apiRequestValues.route = selectedCheckbox.dataset.api;
  const optionsInputId = selectedCheckbox.dataset.options;
  apiRequestValues.name = document.getElementById(optionsInputId).value;
  return apiRequestValues;
}

/**
 * Builds a URL for the API request.
 * @param requestValues {Object} with fields route and name, giving the API
 *   route to use and the name parameter to pass to the API.
 * @returns {string} The API request URL as a string.
 */
function buildApiUrl(requestValues) {
  const apiUrl = `https://api.api-ninjas.com/${requestValues.route}?` +
    `name=${requestValues.name}`;
  return apiUrl;
}

/**
 * Build an HTML table from one star or planet object returned by the API.
 * @param data {Object} An object containing the data of one star or planet.
 * @returns {HTMLTableElement} A table element containing the API data.
 */
function buildResultsTable(data) {
  const table = document.createElement('table');
  let tableContents = `<thead><tr><th colspan="2" scope="col"><h3>${data.name}</h3></th></tr></thead>`;
  tableContents += '<tbody>';
  for (let property in data) {
    if (property !== 'name') {
      const propAsTitle = property.replaceAll('_', ' ');
      tableContents += `<tr><th scope="row">${propAsTitle}</th><td>${data[property]}</td></tr>`
    }
  }
  tableContents += '</tbody>';
  table.innerHTML = tableContents;
  return table;
}

/**
 * Displays the results of the API request in the results section of the form.
 * @param results {Object} The parsed results of the API request.
 */
function displayApiResults(results) {
  const resultsBox = document.getElementById('form-results');
  while (resultsBox.childElementCount > 1) {
    resultsBox.lastElementChild.remove();
  }
  for (const index in results) {
    const table = buildResultsTable(results[index]);
    resultsBox.append(table);
  }
}

/**
 * Initialise the Stars/Planets API request form.
 * @param event The window load event.
 */
function initForm(event) {
  const starsOrPlanets = document.getElementById('stars-or-planets');
  starsOrPlanets.addEventListener('change', checkOnlyOneBox);
  const apiRequestForm = document.getElementById('api-request-form');
  apiRequestForm.addEventListener('submit', callApi);
}

window.addEventListener('load', initForm);