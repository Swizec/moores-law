import React from "react";
import * as d3 from "d3";
import styled from "styled-components";

const Label = styled.text`
    fill: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
    font-size: 14px;
    text-anchor: end;
    alignment-baseline: middle;
`;

const Bar = ({ data, y, width, thickness }) => {
    return (
        <g transform={`translate(${0}, ${y})`}>
            <rect x={10} y={0} width={width} height={thickness} fill="white" />
            <Label y={thickness / 2}>{data.name}</Label>
        </g>
    );
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
