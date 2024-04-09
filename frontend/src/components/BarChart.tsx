import * as d3 from "d3";
import { useRef, useEffect, ReactElement } from "react";

/** Customize BarChart
 * 
 *  * Props List:
 *  - height, width:    Outer height and width of the Bar chart
 *  - barColor:         Color of the bars in Bar chart; written in class, so that you can use with either Bootstraps or Tailwind CSS
 *  - textStyle:        Style of text displayed in axes; written in class, so that you can use with either Bootstraps or Tailwind CSS
 *  - margin:           Margin for the inner Bar chart; optional (recommended to modify)
 *  - data:             Data used to draw the Bar Chart, it's two-dimensional, so any data with a format {name, value} will work; array 
 * 
 *  * Rerender:
 *  - BarChart will rerender when there're some changes in height, width or data
 * 
 *  * Other:
 *  - Duration of animation when render is 150 (0.15 seconds) 
 *  - xAxis, when there're more than 20 bars, it'll not display (see line 90)
 *  - yAxis, only display 5 values (see line 99)
 *  - when component unmounts, it'll remove all it's child element so there would be no duplicates
 *  - All lines of axes're removed during render (see line 105)
 * 
 *  *** Feel free to use or modify 
 *  *** Happy coding!!!
 */

interface BarChartProps {
    height: number,
    width: number,
    barColor?: string,
    textStyle?: string,
    margin?: {
        top?: number,
        bottom?: number,
        left?: number,
        right?: number,
    },
    data: {
        name: string,
        value: number
    }[]
}

const BarChart = (props: BarChartProps): ReactElement => {
    const { height, width, barColor, textStyle, data} = props;

    const marginTop = props.margin ? (props.margin.top ? props.margin.top : 10) : 10;
    const marginBottom = props.margin ? (props.margin.bottom ? props.margin.bottom : 10) : 10;
    const marginLeft = props.margin ? (props.margin.left ? props.margin.left : 10) : 10;
    const marginRight = props.margin ? (props.margin.right ? props.margin.right : 10) : 10;

    const svgRef = useRef(null);

    useEffect(() => {
        if(height == 0 || width == 0) {
            return;
        }

        // set up xScale
        const xScale = d3.scaleBand()
            .domain(data.map((d) => d.name))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        //get max to set up yScale
        const max = Math.max(...data.map(d => d.value));

        //set up yScale
        const yScale = d3.scaleLinear()
            .domain([0, max > 24 ? max : 24])
            .range([height - marginBottom, marginTop]);

        // check Ref, if component is mounted then render data
        if(svgRef.current) {
            const svg = d3.select(svgRef.current);            

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                    .attr("x", (d) => xScale(d.name)!)
                    .attr("y", (d) => yScale(0))
                    .attr("height", (d) => height - marginBottom - yScale(0))
                    .attr("width", (d) => xScale.bandwidth())
                    .attr("rx", xScale.domain().length > 20 ? "5" : "15")
                    .attr("class", barColor ? barColor : "fill-gray-500")
                    .transition()
                    .duration(150)
                    .attr("height", (d) => height - marginBottom - yScale(d.value))
                    .attr("y", (d) => yScale(d.value));

            //attach xAxis
            svg.append("g")
                .attr("transform", "translate(0," + (height - marginBottom) + ")")
                .call(d3.axisBottom(xScale))
                .style("text-anchor", "center")
                .attr("class", textStyle ? textStyle : "")
                .attr("class", xScale.domain().length > 20 ? "text-transparent" : "")
                
            //attach yAxis    
            svg.append("g")
                .attr("transform", "translate(" + (marginLeft) + ", 0)")
                .call(d3.axisLeft(yScale).ticks(5))
                .style("text-anchor", "middle")
                .attr("class", textStyle ? textStyle : "")

            //remove line
            svg.selectAll("path,line").remove();        

            //when component unmounts, it will remove all objects thus no object will be duplicated
            return () => {
                svg.selectAll('*').remove()
            }
        }
    }, [height, width, data])
    
    return (
        <svg width={width} height={height} ref={svgRef}></svg>
    )
}

export default BarChart;