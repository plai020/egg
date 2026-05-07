import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ data, category }) => {
  const labels = data.map(item => item.date.split('/').slice(1).join('/')); // 只顯示 月/日

  const eggDatasets = [
    {
      label: '產地價',
      data: data.map(item => item.egg_origin),
      borderColor: '#FBC02D',
      backgroundColor: '#FBC02D',
      borderWidth: 4,
      tension: 0.3,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: '大運輸價',
      data: data.map(item => item.egg_transport),
      borderColor: '#FFA000',
      backgroundColor: '#FFA000',
      borderWidth: 4,
      tension: 0.3,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ];

  const chickenDatasets = [
    {
      label: '2.0Kg+',
      data: data.map(item => item.chicken_20kg),
      borderColor: '#FF7043',
      backgroundColor: '#FF7043',
      borderWidth: 4,
      tension: 0.3,
      pointRadius: 6,
    },
    {
      label: '1.75-1.95Kg',
      data: data.map(item => item.chicken_175_195kg),
      borderColor: '#EF5350',
      backgroundColor: '#EF5350',
      borderWidth: 4,
      tension: 0.3,
      pointRadius: 6,
    },
    {
      label: '門市價',
      data: data.map(item => item.chicken_market),
      borderColor: '#D32F2F',
      backgroundColor: '#D32F2F',
      borderWidth: 4,
      tension: 0.3,
      pointRadius: 6,
    },
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#555',
        },
        grid: {
          color: '#EEEEEE',
        },
      },
      x: {
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#555',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: category === 'egg' ? eggDatasets : chickenDatasets,
  };

  return (
    <div style={{ height: '350px', width: '100%', padding: '10px' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default PriceChart;
