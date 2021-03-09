// DOM Elements
const toggleDarkMode = document.getElementById('toggle');
const animationContainer = toggleDarkMode.querySelector('#animation');

// Variables
let darkMode = JSON.parse(localStorage.getItem('darkMode'));
let dir = -1;

// Functions
const enableDarkMode = () => {
    document.body.classList.add('dark');
    Chart.defaults.global.defaultFontColor = 'snow';
    localStorage.setItem('darkMode', true);
}

const disableDarkMode = () => {
    document.body.classList.remove('dark');
    Chart.defaults.global.defaultFontColor = '#444';
    localStorage.setItem('darkMode', false);
}

// https://stackoverflow.com/a/63587826
const updateAllCharts = () => {
    Chart.helpers.each(Chart.instances, function (instance) {
        instance.chart.update();
    });
}

// Code
const animation = lottie.loadAnimation({
    container: animationContainer,
    path: 'media/lottie_files/dark_mode_toggle.json',
    renderer: 'svg',
    loop: false,
    autoplay: false
})

toggleDarkMode.addEventListener('click', () => {
    dir = -dir;
    animation.setDirection(dir);
    animation.play();

    darkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (!darkMode) enableDarkMode();
    else disableDarkMode();

    updateAllCharts();
}, false);

if (darkMode) enableDarkMode();
else Chart.defaults.global.defaultFontColor = '#444';