// Imports
import { getFormatNumber, getNumberInSI } from "./number.js";
import { printVaccinationsChart } from "./charts/vaccinations_chart.js";
import { printCasesPerMonth } from "./charts/cases_per_month_chart.js";
import { printCasesInWeek } from "./charts/data_per_week_chart.js";

// Variables
let dataPerDay = null;

// DOM elements
const countryName = document.getElementById('country-name');
const countryFlag = document.getElementById('country-flag');
const lastUpdate = document.querySelector('.last-update span');
const population = document.querySelector('#population abbr');
const newCasesInLastUpdate = document.querySelector('.last-update-information .new-cases abbr');
const casesInLastUpdate = document.querySelector('.last-update-information .total-cases abbr');
const vaccinationsInLastUpdate = document.querySelector('.last-update-information .total-vaccinations abbr');
const deathsInLastUpdate = document.querySelector('.last-update-information .total-deaths abbr');
const datePicker = document.getElementById('date');

// Functions
const printInformation = (element, number) => {
    element.textContent = getNumberInSI(number);
    element.setAttribute('title', `${getFormatNumber(number)}`);
}

// Exports
export const printData = country => {
    countryName.textContent = country.name;

    countryFlag.src = country.img;
    countryFlag.setAttribute('alt', `${countryName} flag`);

    lastUpdate.textContent = country.last_update.date;

    printInformation(population, country.population);
    printInformation(newCasesInLastUpdate, country.new_cases);
    printInformation(casesInLastUpdate, country.cases);
    printInformation(vaccinationsInLastUpdate, country.vaccinations);
    printInformation(deathsInLastUpdate, country.deaths);

    printVaccinationsChart({
        peopleVaccinated: country.people_vaccinated,
        unvaccinatedPeople: country.unvaccinated_people,
        peopleFullyVaccinated: country.people_fully_vaccinated
    });

    printCasesPerMonth({
        updatesClasifiedPerYear: country.updates_clasified_per_year,
        yearsWithCovid: country.years_with_COVID
    });

    dataPerDay = country.data_per_day;
    datePicker.setAttribute('min', country.first_update.date);
    datePicker.setAttribute('max', country.last_update.date);
    datePicker.value = country.last_update.date;
    printCasesInWeek();
    datePicker.addEventListener('change', printCasesInWeek, false);
}

// Exports
export { datePicker, dataPerDay };