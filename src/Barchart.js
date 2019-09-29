import React from "react";
import * as d3 from "d3";

const Bar = ({ data, y, width, thickness }) => {
    return <rect x={0} y={y} width={width} height={thickness} fill="white" />;
};

// Draws the barchart for a single year
const Barchart = ({ data, x, y, barThickness, width }) => {
    const yScale = d3
        .scaleBand()
        .domain(data.map(d => d.name))
        .paddingInner(0.2)
        .range([data.length * barThickness, 0]);

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.transistors)])
        .range([0, width]);

    return (
        <g transform={`translate(${x}, ${y})`}>
            {data.map(d => (
                <Bar
                    data={d}
                    key={d.name}
                    y={yScale(d.name)}
                    width={xScale(d.transistors)}
                    thickness={yScale.bandwidth()}
                />
            ))}
        </g>
    );
};

export default Barchart;
