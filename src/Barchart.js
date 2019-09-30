import React, { useEffect, useState, useMemo } from "react";
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

const EndLabel = styled.text`
    fill: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
    font-size: 14px;
    text-anchor: start;
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

const Bar = ({ data, y, width, thickness, formatter, color }) => {
    const renderWidth = useTransition({
        targetValue: width,
        name: `width-${data.name}`,
        easing: data.designer === "Moore" ? d3.easeLinear : d3.easeCubicInOut
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
    const transistors = useTransition({
        targetValue: data.transistors,
        name: `trans-${data.name}`,
        easing: d3.easeLinear
    });

    return (
        <g transform={`translate(${renderX}, ${renderY})`}>
            <rect
                x={10}
                y={0}
                width={renderWidth}
                height={thickness}
                fill={color}
            />
            <Label y={thickness / 2}>{data.name}</Label>
            <EndLabel y={thickness / 2} x={renderWidth + 15}>
                {data.designer === "Moore"
                    ? Math.round(transistors)
                    : formatter(data.transistors)}
            </EndLabel>
        </g>
    );
};

// Draws the barchart for a single year
const Barchart = ({ data, x, y, barThickness, width }) => {
    const yScale = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(d3.range(0, data.length))
                .paddingInner(0.2)
                .range([data.length * barThickness, 0]),
        [data.length, barThickness]
    );
    const color = useMemo(
        () =>
            d3
                .scaleOrdinal()
                .domain([
                    "AMD",
                    "ARM",
                    "Apple",
                    "Fujitsu",
                    "Hitachi",
                    "Huawei",
                    "IBM",
                    "Intel",
                    "Microsoft/AMD",
                    "Motorola",
                    "NEC",
                    "Nvidia",
                    "Oracle",
                    "Samsung",
                    "Sun/Oracle",
                    "Toshiba",
                    "Moore"
                ])
                .range([
                    "#009933",
                    "#0091BD",
                    "#A3AAAE",
                    "#d30909",
                    "#F4ABAA",
                    "#FA0505",
                    "#1F70C1",
                    "#0171C5",
                    "#7FBA02",
                    "#008DD2",
                    "#14149F",
                    "#77B900",
                    "#F70000",
                    "#034EA1",
                    "#7F7F7F",
                    "#FF0000",
                    "#D92AAD"
                ]),
        []
    );

    // not worth memoizing because data changes every time
    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.transistors)])
        .range([0, width]);

    const formatter = xScale.tickFormat();

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
                        formatter={formatter}
                        thickness={yScale.bandwidth()}
                        color={color(d.designer) || "white"}
                    />
                ))}
        </g>
    );
};

export default Barchart;
