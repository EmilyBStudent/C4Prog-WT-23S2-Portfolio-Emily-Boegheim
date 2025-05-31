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
  clearResults();
  let requestValues;
  try {
    requestValues = getFormValues();
  } catch (error) {
    console.error(error);
    displayError(error);
    return;
  }
  const requestUrl = buildApiUrl(requestValues);
  await fetch(requestUrl, {
    headers: {'X-Api-Key': apiKey}
    })
    .then(async function (response) {
      try {
        return await checkAndParseResponse(response);
      } catch (error) {
        throw error;
      }
    })
    .then(function (results) {
      displayApiResults(results);
    })
    .catch(function (error) {
      console.error(error);
      displayError(error);
    });
}

/**
 * Clear all results and error messages from the results box, leaving only the
 * box's legend in place.
 */
function clearResults() {
  const resultsBox = document.getElementById('form-results');
  while (resultsBox.childElementCount > 1) {
    resultsBox.lastElementChild.remove();
  }
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
    throw new Error('Please select either stars or planets.');
  }

  const apiRequestValues = new Object();
  apiRequestValues.route = selectedCheckbox.dataset.api;
  const optionsInputId = selectedCheckbox.dataset.options;
  apiRequestValues.name = document.getElementById(optionsInputId).value;
  if (!apiRequestValues.name) {
    throw new Error(`Please select a ${optionsInputId} to learn more about.`);
  }
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
 * Check the API response status and throw an Error if the status is not ok.
 * If ok, parse the response as JSON.
 * @param response The API response object.
 * @returns {Promise<any>} The response parsed from JSON into an object.
 */
async function checkAndParseResponse(response) {
  if (!response.ok) {
    const responseData = await response.json();
    let responseText;
    if (responseData && responseData.error) {
      responseText = responseData.error;
    } else {
      responseText = response.statusText;
    }
    throw new Error(`Error ${response.status} ${responseText}`);
  }
  return await response.json();
}

/**
 * Build an HTML table from one star or planet object returned by the API.
 * @param data {Object} An object containing the data of one star or planet.
 * @returns {HTMLTableElement} A table element containing the API data.
 */
function buildResultsTable(data) {
  const unitInfo = {
    'mass': 'Jupiters (1 Jupiter = 1.898 × 1027 kg)',
    'radius': 'Jupiters (1 Jupiter = 69911 km)',
    'period': 'Earth days',
    'temperature': 'Kelvin',
    'distance_light_year': 'light years from Earth',
    'semi_major_axis': 'astronomical units (AU)',
    'host_star_mass': 'Suns (approximately 2×1030 kg)',
    'host_star_temperature': 'Kelvin'
  }
  const table = document.createElement('table');
  let tableContents = `<thead><tr><th colspan="2" scope="col"><h3>${data.name}</h3></th></tr></thead>`;
  tableContents += '<tbody>';
  for (let property in data) {
    if (property !== 'name') {
      const propAsTitle = property.replaceAll('_', ' ');
      let dataWithUnit = data[property];
      if (property in unitInfo) {
        dataWithUnit += ` ${unitInfo[property]}`;
      }
      tableContents += `<tr><th scope="row">${propAsTitle}</th><td>${dataWithUnit}</td></tr>`
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
  for (const index in results) {
    const table = buildResultsTable(results[index]);
    resultsBox.append(table);
  }
}

/**
 * Display a given error in the results box to advise the user of the issue.
 * @param error The Error object to be displayed.
 */
function displayError(error) {
  const resultsBox = document.getElementById('form-results');
  const errorElement = document.createElement('p');
  errorElement.classList.add('error');
  errorElement.textContent = error.message;
  resultsBox.append(errorElement);
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