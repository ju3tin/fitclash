export function initializeAskChart() {
    const ctx = document.getElementById('askChart');
    if (!ctx) return null;


    let existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    const data = {
        labels: ['Product & Engineering', 'Marketing & User Acq.', 'Operations & Hires'],
        datasets: [{
            label: 'Allocation of Funds',
            data: [50, 30, 20],
            backgroundColor: [
                'rgba(0, 255, 255, 0.7)',  // Cyan
                'rgba(57, 255, 20, 0.7)',   // Neon Green
                'rgba(255, 255, 255, 0.5)' // White-ish
            ],
            borderColor: [
                '#00ffff',
                '#39ff14',
                '#ffffff'
            ],
            borderWidth: 2,
            hoverOffset: 8
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#E5E7EB',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 14
                    },
                    padding: 20,
                    boxWidth: 15,
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 16, weight: 'bold' },
                bodyFont: { size: 14 },
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed + '%';
                        }
                        return label;
                    }
                }
            }
        },
        animation: {
            duration: 1200,
            easing: 'easeInOutQuart',
            animateRotate: true,
            animateScale: true
        }
    };

    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

export function destroyChart(chartInstance) {
    if (chartInstance) {
        chartInstance.destroy();
    }
    return null;
}
