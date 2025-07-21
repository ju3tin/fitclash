import { initializeAskChart, destroyChart } from './modules/ask_chart.js';

let askChartInstance = null;
const ASK_CHART_SLIDE_INDEX = 9; // Slide 10 is index 9

function handleSlideChange(event) {
    const { currentIndex } = event.detail;

    if (currentIndex === ASK_CHART_SLIDE_INDEX) {
        if (!askChartInstance) {
            askChartInstance = initializeAskChart();
        }
    } else {
        if (askChartInstance) {
            askChartInstance = destroyChart(askChartInstance);
        }
    }
}

document.addEventListener('slideChanged', handleSlideChange);


document.addEventListener('presentationReady', (event) => {
    const { currentSlide } = event.detail;
    if (currentSlide === ASK_CHART_SLIDE_INDEX) {
         if (!askChartInstance) {
            askChartInstance = initializeAskChart();
        }
    }
});
