import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function DashboardFalabella() {
  // Datos ficticios para los meses del año
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Ventas',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 55, 60, 70, 75], // Datos ficticios de ventas por mes
      },
    ],
  };

  return (
    <div className='content-wrapper'>
      <h2>Ventas por mes</h2>
      <Bar
        data={data}
        width={100}
        height={400}
        options={{
          maintainAspectRatio: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}
