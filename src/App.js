import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import faker from "faker";

import Barchart from "./Barchart";

const Svg = styled.svg`
    width: 100vw;
    height: 100vh;
    background: #0b0c10;
`;

const Year = styled.text`
    fill: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
    font-size: 120px;
    font-weight: bold;
    text-anchor: end;
`;

const Title = styled.text`
    fill: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
    font-size: 26px;
    font-weight: bold;
    text-anchor: middle;
`;

const useData = () => {
    const [data, setData] = useState(null);

    // Replace this with actual data loading
    useEffect(function() {
        (async () => {
            const datas = await Promise.all([
                d3.csv("data/microprocessors.csv", row => {
                    const year = Number(
                        row["Date of introduction"].replace(/\[.*\]/g, "")
                    );

                    return {
                        name: `${row["Processor"].replace(
                            /\(.*\)/g,
                            ""
                        )} - ${year}`,
                        designer: row["Designer"],
                        year: year,
                        transistors: Number(
                            row["MOS transistor count"]
                                .replace(/\[.*\]/g, "")
                                .replace(/[^0-9]/g, "")
                        )
                    };
                })
            ]);

            // Group by year and accumulate everything form previous
            const grouped = datas
                .flat()
                .sort((a, b) => a.year - b.year)
                .reduce((groups, el) => {
                    if (!groups[el.year]) {
                        const previous = groups[el.year - 1];
                        groups[el.year] = previous || [];
                    }

                    groups[el.year] = [...groups[el.year], el];

                    return groups;
                }, {});

            setData(grouped);
        })();
    }, []);

    return data;
};

function App() {
    const data = useData();
    const [currentYear, setCurrentYear] = useState(1970);

    // Drives the main animation progressing through the years
    // It's actually a simple counter :P
    useEffect(() => {
        const interval = d3.interval(() => {
            setCurrentYear(year => {
                if (!data[year + 1]) {
                    interval.stop();
                    return year;
                }

                return year + 1;
            });
        }, 2000);

        return () => interval.stop();
    }, [data]);

    return (
        <Svg>
            <Title x={"50%"} y={30}>
                Moore's law vs. actual transistor count in React & D3
            </Title>
            {data && data[currentYear] ? (
                <Barchart
                    data={data[currentYear]}
                    x={150}
                    y={50}
                    barThickness={20}
                    width={500}
                />
            ) : null}
            <Year x={"95%"} y={"95%"}>
                {currentYear}
            </Year>
        </Svg>
    );
}

export default App;
