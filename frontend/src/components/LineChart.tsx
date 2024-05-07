import { Line } from 'react-chartjs-2'; 
import {
    Chart as ChartJs,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    plugins,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation';
import { ReactNode } from 'react';

ChartJs.register(LineElement, CategoryScale, LinearScale, PointElement, annotationPlugin, );

interface LineChartProps {
    data: Number[];
    curLimit: Number;
}

const LineChart = ({ data, curLimit }: LineChartProps): ReactNode => {
    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
            annotation: {
                annotations: {
                    line: {
                        type: 'line',
                        yMin: curLimit,
                        yMax: curLimit,
                        borderColor: 'red',
                        borderWidth: 2,
                    },
                },
            }
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

    return (
        <Line
            options={options}
            data={{
                labels: data.map((data, index) => index),
                datasets: [{
                    label: 'Temperature',
                    data: data.map((data) => data),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }}
        />
    );
}

export default LineChart;