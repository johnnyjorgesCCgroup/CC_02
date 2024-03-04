// chartConfig.js
export const config = {
    type: 'bar',
    data: {
      labels: ['Usuario 1', 'Usuario 2', 'Usuario 3'],
      datasets: [{
        label: 'Porcentaje de Usuarios',
        data: [20, 35, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 205, 86, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true
        }
      }
    },
  };
  