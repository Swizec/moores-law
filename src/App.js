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

const useData = () => {
    const [data, setData] = useState(null);

    // Replace this with actual data loading
    useEffect(() => {
        // Create 5 imaginary processors
        const processors = d3.range(10).map(i => `CPU ${i}`),
            random = d3.randomUniform(1000, 50000);

        let N = 1;

        // create random transistor counts for each year
        const data = d3.range(1970, 2026).map(year => {
            if (year % 5 === 0 && N < 10) {
                N += 1;
            }

            return d3.range(N).map(i => ({
                year: year,
                name: processors[i],
                transistors: Math.round(random())
            }));
        });

        setData(data);
    }, []);

    return data;
};

function App() {
    const data = useData();
    const [currentYear, setCurrentYear] = useState(1970);

    const yearIndex = d3
        .scaleOrdinal()
        .domain(d3.range(1970, 2025))
        .range(d3.range(0, 2025 - 1970));

    // Drives the main animation progressing through the years
    // It's actually a simple counter :P
    useEffect(() => {
        const interval = d3.interval(() => {
            setCurrentYear(year => {
                if (year + 1 > 2025) {
                    interval.stop();
                }

                return year + 1;
            });
        }, 2000);

        return () => interval.stop();
    }, []);

    console.log(yearIndex(currentYear));

    return (
        <Svg>
            {data ? (
                <Barchart
                    data={data[yearIndex(currentYear)]}
                    x={100}
                    y={50}
                    barThickness={20}
                    width={500}
                />
            ) : null}
        </Svg>
    );
}

export default App;
