// 以下のコードは ChartComponent.js に関する部分です
import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartComponent = ({ data, selectedNumCols }) => {
  const labels = data.labels || []; // あなたのデータに応じて調整してください

  const generateDatasets = () => {
    if (!data || !selectedNumCols) return [];

    return selectedNumCols.map((key) => {
      return {
        label: key,
        data: data[key],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)'

    };
});
};

    const chartData = {
        labels: labels,
        datasets: generateDatasets(),
    };

    return (
        <div>
            <h2>Weather Chart</h2>
            <Line data={chartData} />
        </div>
        );
};

export default ChartComponent;
