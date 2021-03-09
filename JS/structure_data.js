// Imports
import { getLastDateOfMonth } from "./date.js";
import { printData } from "./print.js";

// Variables
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Classes
class Country {
    constructor(name, population, dataPerDay, img) {
        this.name = name,
            this.population = population,
            this.data_per_day = dataPerDay,
            this.img = img,
            this.last_update = this.data_per_day[this.data_per_day.length - 1],
            this.first_update = this.data_per_day[0],
            this.years_with_COVID = getYearsWithCOVID(this.data_per_day),
            this.updates_clasified_per_year = getLastUpdatePerMonth(this.years_with_COVID, this.data_per_day),
            this.vaccinations = findLast(this.data_per_day, 'total_vaccinations') ?? 0,
            this.people_vaccinated = findLast(this.data_per_day, 'people_vaccinated') ?? this.vaccinations,
            this.people_fully_vaccinated = findLast(this.data_per_day, 'people_fully_vaccinated') ?? 0,
            this.unvaccinated_people = this.population - this.people_vaccinated,
            this.deaths = this.last_update.total_deaths ?? 0,
            this.new_cases = this.last_update.new_cases ?? 0,
            this.cases = this.last_update.total_cases ?? 0
    }
}

// Functions
const getYearsWithCOVID = dataPerDay => {
    return [...new Set(
        dataPerDay.map(info => info.date.slice(0, 4))
    )];
}

const getLastUpdatePerMonth = (years_with_COVID, dataPerDay) => {
    const lastUpdatesPerMonth = (
        years_with_COVID.map(year => {
            return MONTHS.map(month => {
                const lastDateOfMonth = getLastDateOfMonth(month, year);
                return dataPerDay.find(data => data.date === lastDateOfMonth) ?? 0
            })
        })
    );
    lastUpdatesPerMonth[lastUpdatesPerMonth.length - 1]
        .splice(new Date().getMonth());

    return lastUpdatesPerMonth;
}

const findLast = (arr, find) => {
    for (let index = arr.length - 1; index >= 0; index--) {
        if (arr[index][find]) return (arr[index][find])
    }
}

const structureDataOfCountry = countryData => {
    const countryName = countryData.country_data.location;
    const population = countryData.country_data.population;
    const dataPerDay = countryData.country_data.data;
    const img = (
        (countryData.acronym.startsWith('owid_') || countryData.acronym.startsWith('eu')) ?
            `media/images/worldwide.svg` :
            `https://hatscripts.github.io/circle-flags/flags/${countryData.acronym}.svg`
    );

    const country = new Country(
        countryName,
        population,
        dataPerDay,
        img
    );

    printData(country);
}

// Exports
export { structureDataOfCountry as structureData };