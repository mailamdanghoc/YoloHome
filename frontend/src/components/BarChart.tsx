import * as d3 from "d3";
import { ReactNode, useRef, useEffect } from "react";

const data = [
    { "name": "1/3/2003", "value": 10 },
    { "name": "2/3/3", "value": 12 },
    { "name": "03/03", "value": 15 },
    { "name": "4/3/3", "value": 19 },
    { "name": "5/3/3", "value": 24 },
    { "name": "6/3/3", "value": 13 },
    { "name": "7/3/3", "value": 8 },

]

interface BarChartProps {
    height: number,
    width: number
}

const BarChart = (props: BarChartProps) => {
    const { height, width } = props;
    const marginTop = 10;
    const marginBottom = 50;
    const marginLeft = 10;
    const marginRight = 10;

    const anime = useRef(null);

    useEffect(() => {

    }, [])

    const xScale = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([height - marginBottom, marginTop]);

    const Bar: ReactNode = data.map((d, i) => {
        const x = xScale(d.name);
        if (x === undefined) return null;

        return (
            <g key={i}>
                <rect
                    x={xScale(d.name)}
                    y={yScale(d.value)}
                    width={(width - marginLeft - marginRight) / 7.5}
                    height={height - marginBottom - yScale(d.value)}
                    fill="#787878"
                    rx={5}
                    ref={anime}
                >
                </rect>
            </g>
        )
    })

    const yAxis = yScale
        .ticks(6)
        .splice(1)
        .map((value, i) => {
            return (
                <g key={i}>
                    <text
                        y={yScale(value)}
                        x={marginLeft}
                        textAnchor="middle"
                    >
                        {value}
                    </text>
                </g>
            )
        })

    const xAxis = xScale
        .domain()
        .map((value, i) => {
            const x = xScale(value);
            if (x === undefined) return null;

            console.log(value);
            return (
                <g key={i}>
                    <text
                        y={height - marginBottom + 20}
                        x={x + ((width - marginLeft - marginRight) / 7.5) / 2}
                        textAnchor="middle"
                    >
                        {value}
                    </text>
                </g>
            )
        })



    return (
        <svg width={width} height={height}>
            <g width={width - marginLeft - marginRight} height={height - marginBottom - marginTop}>
                {yAxis}
                {xAxis}
                {Bar}
            </g>
        </svg>
    )
}

export default BarChart;