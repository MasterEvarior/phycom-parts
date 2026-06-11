/**
 * @typedef {Object} Part
 * @property {string} name - The name of the component.
 * @property {string} source - The wiki or source URL where the component is listed.
 * @property {'actuator' | 'sensor' | 'adapter' | 'cable'} category - The category classification of the component.
 * @property {string} image - The URL to an image of the component.
 */

/**
 * Load data from JSON file
 * @returns {Part[]} - All available parts
 */
export const loadData = async () => {
  const response = await fetch("./assets/data.json");
  return await response.json();
};

/**
 * Filter all parts depending on the search terms, which are just the search term split by " "
 * @param {string} input - Search term the user entered
 * @param {Part[]} parts - All parts that should be filtered
 * @returns {Part[]} - A list of filtered parts
 */
export const filter = (input, parts) => {
  return parts.filter((p) => {
    const partIdentity = (p.name + " " + p.category).toLocaleLowerCase();
    const searchTerms = input.toLocaleLowerCase().split(" ");

    console.log(partIdentity);

    for (const term of searchTerms) {
      if (!partIdentity.includes(term)) {
        console.log(`${partIdentity} does not include ${term}`);
        return false;
      }
    }

    return true;
  });
};

/**
 * Sets the output area content.
 * @param {string} html - The HTML content to display.
 */
export const setOutput = (html) => {
  document.getElementById("output").innerHTML = html;
};

/**
 * Create a single row, out of a single part
 * @param {Part} part - Single part to display.
 * @returns {string} - A single <tr>.
 */
export const constructRow = (part) => {
  return `
    <tr>
      <td>
        <img src="${part.image}" alt="${part.name}">
      </td>
      <td>${part.name}</td>
      <td>${part.category}</td>
      <td>
        <a href="${part.source}">Wiki</a></td>
    </tr>
  `;
};

/**
 * Construct result table with all parts
 * @param {Part[]} parts - All parts to display.
 * @returns {string} - A complete <table>.
 */
export const constructTable = (parts) => {
  return `
    <table>
      <tr>
        <th>IMAGE</th>
        <th>NAME</th>
        <th>CATEGORY</th>
        <th>SOURCE</th>
      </tr>
      ${parts.map((p) => constructRow(p)).reduce((a, b) => a + " " + b, "")}
    </table>
  `;
};

export const setSearchLabel = (parts) => {
  const label = document.getElementById("label");
  label.innerText = `SEARCH (${parts.length})`;
};

/**
 * Initializes the command input listener and sets up event handling.
 */
export const setup = async () => {
  const data = await loadData();
  const input = document.getElementById("input");

  // Set Initial available parts
  setSearchLabel(data);

  // Display data once initially
  const result = constructTable(data);
  setOutput(result);

  input.addEventListener("keyup", (_) => {
    const searchInput = input.value;
    let parts = data;

    if (searchInput) {
      parts = filter(input.value, data);
      setSearchLabel(parts);
    }

    const result = constructTable(parts);
    setOutput(result);
  });
};
