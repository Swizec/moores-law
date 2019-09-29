import React, { useEffect, useState } from "react";
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

const useTransition = ({ targetValue, name, startValue, easing }) => {
    const [renderValue, setRenderValue] = useState(startValue || targetValue);

    useEffect(() => {
        d3.selection()
            .transition(name)
            .duration(2000)
            .ease(easing || d3.easeLinear)
            .tween(name, () => {
                const interpolate = d3.interpolate(renderValue, targetValue);
                return t => setRenderValue(interpolate(t));
            });
    }, [targetValue]);

    return renderValue;
};

const Bar = ({ data, y, width, thickness }) => {
    const renderWidth = useTransition({
        targetValue: width,
        name: `width-${data.name}`
    });
    const renderY = useTransition({
        targetValue: y,
        name: `y-${data.name}`,
        startValue: -500 + Math.random() * 200,
        easing: d3.easeCubicInOut
    });
    const renderX = useTransition({
        targetValue: 0,
        name: `x-${data.name}`,
        startValue: 1000 + Math.random() * 200,
        easing: d3.easeCubicInOut
    });

    return (
        <g transform={`translate(${renderX}, ${renderY})`}>
            <rect
                x={10}
                y={0}
                width={renderWidth}
                height={thickness}
                fill="white"
            />
            <Label y={thickness / 2}>{data.name}</Label>
        </g>
    );
};

// Draws the barchart for a single year
const Barchart = ({ data, x, y, barThickness, width }) => {
    const yScale = d3
        .scaleBand()
        .domain(d3.range(0, data.length))
        .paddingInner(0.2)
        .range([data.length * barThickness, 0]);

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.transistors)])
        .range([0, width]);

    return (
        <g transform={`translate(${x}, ${y})`}>
            {data
                .sort((a, b) => a.transistors - b.transistors)
                .map((d, index) => (
                    <Bar
                        data={d}
                        key={d.name}
                        y={yScale(index)}
                        width={xScale(d.transistors)}
                        thickness={yScale.bandwidth()}
                    />
                ))}
        </g>
    );
};

export default Barchart;
