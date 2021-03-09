// Imports
import { differenceBetweenTwoDates, getDatesBetweenTwoDates } from "../date.js";
import { clamp, interpolate } from "../number.js";
import { datePicker, dataPerDay } from "../print.js";

// DOM Elements
const canvas = document.getElementById('data-per-week');

// Variables
const ctx = canvas.getContext('2d');
const OPTIONS = {
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            display: false
        }],
        // https://stackoverflow.com/a/39706986
        xAxes: [{
            ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
            }
        }]
    },
    title: {
        display: true,
        text: 'Data per week',
        padding: 0,
        fontSize: 16.5,
    },
    tooltips: {
        mode: 'index',
        intersect: false,
    }
};
const dataPerWeekChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: null,
        datasets: [
            {
                label: 'Vaccinations',
                fill: false,
                backgroundColor: 'rgb(0, 255, 128)',
                borderColor: 'rgba(0, 255, 128, 0.75)',
                data: null
            },
            {
                label: 'Cases',
                fill: false,
                backgroundColor: 'rgb(255, 128, 0)',
                borderColor: 'rgba(255, 128, 0, 0.75)',
                borderDash: [5, 5],
                data: null
            },
            {
                label: 'Deaths',
                fill: true,
                backgroundColor: 'rgba(77, 201, 246, 0.5)',
                borderColor: '#4dc9f6',
                data: null
            }
        ],
    },
    options: OPTIONS
});

// Functions
const getDataPerWeek = date => {
    const selectedDate = moment(date).format('YYYY-MM-DD');
    const minDate = dataPerDay[0].date;
    const maxDate = dataPerDay[dataPerDay.length - 1].date;

    let upperOffset = interpolate(
        -clamp({
            value: differenceBetweenTwoDates(selectedDate, maxDate),
            max: 7
        }),
        8
    );
    let lowerOffset = interpolate(
        -clamp({
            value: differenceBetweenTwoDates(minDate, selectedDate),
            max: 7
        }),
        8
    );

    if (
        (upperOffset === lowerOffset) &&
        (moment(selectedDate).isBefore(moment(maxDate).subtract(6, 'days')))
    ) upperOffset = 0;

    const previousWeek = moment(date).subtract(6 + upperOffset, 'days').format('YYYY-MM-DD');
    const nextWeek = moment(date).add(6 + lowerOffset, 'days').format('YYYY-MM-DD');

    const upperLimit = (
        moment(nextWeek).isAfter(maxDate) ?
            maxDate :
            nextWeek
    );
    const lowerLimit = (
        moment(previousWeek).isBefore(minDate) ?
            minDate :
            previousWeek
    );

    const datesToPrint = getDatesBetweenTwoDates(lowerLimit, upperLimit);
    dataPerWeekChart.data.labels = datesToPrint.map(data => moment(data).format('MMM DD'));
    // https://stackoverflow.com/a/46894484
    return dataPerDay.filter((data) => datesToPrint.includes(data.date));
}

const printChartOfCasesInWeek = () => {
    const date = moment(datePicker.value);

    const data = getDataPerWeek(date);

    const vacc = data.map(d => d.new_vaccinations ?? d.total_vaccinations ?? d.people_vaccinated ?? 0);
    const cases = data.map(d => d.new_cases ?? 0);
    const deaths = data.map(d => d.new_deaths ?? 0);

    dataPerWeekChart.data.datasets[0].data = vacc;
    dataPerWeekChart.data.datasets[1].data = cases;
    dataPerWeekChart.data.datasets[2].data = deaths;
    dataPerWeekChart.update();
}

// Exports
export { printChartOfCasesInWeek as printCasesInWeek };