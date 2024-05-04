import { Line } from 'react-chartjs-2'; 
import {
    Chart as ChartJs,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    plugins,
} from 'chart.js'
import { ReactNode } from 'react';

ChartJs.register(LineElement, CategoryScale, LinearScale, PointElement);

interface LineChartProps {
    data: Number[];
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
        },
    },
    scales: {
        x: {
            display: false,
            title: {
                display: true,
                text: 'Month',
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Value',
            },
        },
    },
}

const LineChart = (data : LineChartProps): ReactNode => {
    return (
        <Line
            options={options}
            data={{
                labels: data.data.map((data, index) => index),
                datasets: [{
                    label: 'Temperature',
                    data: data.data.map((data) => data),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }}
        />
    );
}

export default LineChart;