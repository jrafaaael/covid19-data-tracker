// DOM elements
const canvas = document.getElementById('vaccinations');

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
            gridLines: {
                display: false
            },
            display: false
        }]
    },
    title: {
        display: true,
        text: 'Vaccinations Data',
        padding: 0,
        fontSize: 16.5,
    },
}
const vaccinationsChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Vaccinated', 'Unvaccinated', 'Fully Vaccinated'],
        datasets: [{
            label: null,
            data: null,
            backgroundColor: ['rgba(0, 255, 128, 0.5)', 'rgba(77, 201, 246, 0.5)', 'rgba(255, 128, 0, 0.5)'],
            borderColor: ['rgb(0, 255, 128)', 'rgb(77, 201, 246)', 'rgb(255, 128, 0)'],
            borderWidth: 1
        }],
    },
    options: OPTIONS
});

// Exports
export const printVaccinationsChart = ({
    peopleVaccinated,
    unvaccinatedPeople,
    peopleFullyVaccinated
}) => {
    vaccinationsChart.data.datasets[0].data = [
        peopleVaccinated,
        unvaccinatedPeople,
        peopleFullyVaccinated
    ];
    vaccinationsChart.update();
}