import * as d3 from "d3";
import { ReactNode, useRef, useEffect } from "react";

/*
    Description for Son, if you want to reuse this component:
    * Component co 3 props quan trong nhat:
    *** height: chieu cao cua do thi 
    *** width: do rong cua do thi
    *** data: [object] , object{name, value} => ve do thi 2 chieu

    * Cac props khacL
    *** barColor(optional): mau cua do thi, viet bang tailwind
    *** textStyle: style cua chu cua truc x va truc y, viet bang tailwind
    *** margin: margin cua do thi, mac dinh {10, 10, 10, 10}

    * ComponentDidUpdate: Do thi se update khi co su thay doi cua 3 cai props quan trong o tren
    * Responsiveness: Neu muon do thi responsive thi phai thay doi thuoc tinh cua height va width, noi cach khac
    *   la doi thuoc tinh cua <parent> cua component nay, su dung useRef => gan cai ref vo parent => roi pass ref 
    *   vo cai hook useDimension(import tu folder customizes) => pass width, height cho do thi. 
    *   Xem vi du tu ./controlBoardChart.tsx

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

const BarChart = (props: BarChartProps): ReactNode => {
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
                    .duration(800)
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