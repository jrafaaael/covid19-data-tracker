// Imports
import { structureData } from "./JS/structure_data.js";

// DOM Elements
const select = document.getElementById('country');
const loadingAnimation = document.getElementById('loading-animation');

// Variables
const COVID_DATA_URL = `https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json`;
const COUNTRIES_ACRONYMS_IN_ISO3166_URL = `https://raw.githubusercontent.com/hampusborgos/country-flags/master/countries.json`;

// Functions
const listAllCountries = (countriesData) => {
    for (const country in countriesData) {
        if (countriesData[country].hasOwnProperty('continent') || country === 'OWID_WRL') {
            const option = document.createElement('option');
            const optgroup = document.querySelector(`[label="${countriesData[country].continent}"]`) ?? document.createElement('optgroup');
            optgroup.label = countriesData[country].continent ?? 'World';
            option.textContent = option.value = countriesData[country].location;
            optgroup.appendChild(option)
            select.appendChild(optgroup);
        }
    }
}

const getDataOfSelectedCountry = ({ data, acronyms, value = select.value }) => {
    return ({
        country_data: data[getCountryAcronym(data, value)],
        acronym: (getCountryAcronym(acronyms, value) ?? getCountryAcronym(data, value)).toLowerCase()
    });
}

const getCountryAcronym = (object, value, nested = 'location') => {
    return (
        Object
            .keys(object)
            .find(key => (object[key][nested] ?? object[key])
                .includes(value))
    )
}

// Code
document.body.classList.add('loading-state');

const animation = lottie.loadAnimation({
    container: loadingAnimation,
    path: 'media/lottie_files/coronavirus.json',
    renderer: 'svg',
    loop: true,
    autoplay: true
});

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const [
            responseCOVIDData,
            responseCountriesAcronyms
        ] = await Promise.all([
            fetch(COVID_DATA_URL),
            fetch(COUNTRIES_ACRONYMS_IN_ISO3166_URL)
        ]);

        const COVIDData = await responseCOVIDData.json();
        const countriesAcronyms = await responseCountriesAcronyms.json();

        listAllCountries(COVIDData);
        structureData(
            getDataOfSelectedCountry({
                data: COVIDData,
                acronyms: countriesAcronyms,
                value: 'World'
            })
        )

        select.addEventListener('change', () => {
            const countryData = getDataOfSelectedCountry({
                data: COVIDData,
                acronyms: countriesAcronyms
            });
            structureData(countryData);
        }, false);

        document.body.classList.remove('loading-state');
        loadingAnimation.parentElement.style.display = 'none';
    } catch (error) {
        console.log(error);
    }
}, false);

Chart.defaults.global.defaultFontFamily = 'Montserrat';