// Imports
import { getRandomNumber } from "../number.js";

// DOM Elements
const canvas = document.getElementById('cases-per-month');

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
        }]
    },
    title: {
        display: true,
        text: 'Cases per month',
        padding: 0,
        fontSize: 16.5
    },
    // https://stackoverflow.com/a/47921524
    tooltips: {
        mode: 'label',
        callbacks: {
            label: function (t, d) {
                const dstLabel = d.datasets[t.datasetIndex].label;
                const yLabel = t.yLabel;
                return dstLabel + ': ' + yLabel;
            }
        },
        intersect: false
    }
};
const casesPerMonthChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: null,
    },
    options: OPTIONS
});

// Functions
const createCustomRGBColor = () => {
    const r = getRandomNumber(0, 255)
    const g = getRandomNumber(0, 255)
    const b = getRandomNumber(0, 255)
    return ({
        fill: `rgba(${r}, ${g}, ${b}, 0.5)`,
        border: `rgba(${r}, ${g}, ${b}, 1)`,
    })
}

const getCasesPerMonth = (updatesClasifiedPerYear, yearsWithCovid) => {
    const data = [];
    const casesPerMonth = updatesClasifiedPerYear.map((updatesPerMonth, yearIndex) => {
        return updatesPerMonth.map((updateInMonth, monthIndex) => {
            const casesInCurrentMonth = updateInMonth.total_cases ?? 0;
            const casesInPreviousMonth = (
                // If it is any month except January (JAN = 0)...
                monthIndex > 0 ?
                    // The cases are obtained in the previous month (monthIndex - 1). e.g.
                    // If is february (monthIndex = 1), casesInPreviousMonth = cases in january (monthIndex - 1 = 0)
                    updatesPerMonth[monthIndex - 1]?.total_cases ?? 0 :
                    // Otherwise, the cases of the month of december of the previous year are obtained.
                    // (yearIndex - 1) refers to the array of last update data from the months of the previous year.
                    // [11] because december = 11 (zero-based numbering).
                    updatesClasifiedPerYear[yearIndex - 1]?.[11].total_cases ?? 0
            )
            return casesInCurrentMonth - casesInPreviousMonth;
        })
    });

    yearsWithCovid.forEach((year, index) => {
        const color = createCustomRGBColor()
        data.push({
            label: year,
            data: casesPerMonth[index],
            backgroundColor: color.fill,
            borderColor: color.border,
            borderWidth: 1
        })
    });

    return data;
}

const printChartOfCasesPerMonth = ({
    updatesClasifiedPerYear,
    yearsWithCovid
}) => {
    casesPerMonthChart.data.datasets = getCasesPerMonth(updatesClasifiedPerYear, yearsWithCovid);
    casesPerMonthChart.update();
}

// Exports
export { printChartOfCasesPerMonth as printCasesPerMonth }