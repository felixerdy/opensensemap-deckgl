import React, { useState, useEffect } from 'react'
// import { XYPlot, FlexibleXYPlot, GradientDefs, AreaSeries, HorizontalGridLines, VerticalGridLines, XAxis, YAxis } from 'react-vis'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';



const Sensor = ({ boxID, sensor }) => {
    const [data, setData] = useState()

    useEffect(() => {
        fetch(`https://api.opensensemap.org/boxes/${boxID}/data/${sensor._id}/`)
            .then(res => res.json())
            .then(resData => {
                setData(resData)
            })
    }, [boxID, sensor])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload) {
            return (
                <div style={{
                    backgroundColor: 'rgba(29, 29, 29, 0.9)',
                    color: 'white',
                    borderRadius: '1rem',
                    padding: '1rem'
                }}>
                    {payload[0].value} {sensor.unit}
                    <br />
                    {payload[0].payload.x.toUTCString()}
                </div>
            );
        }

        return null;
    };

    return (
        <div style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            borderLeft: '2px solid',
            width: 200,
            height: 100,
            position: 'relative',
            flexShrink: 0
        }}>
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                textAlign: 'center'
            }}>
                <h3 style={{ position: 'absolute', bottom: 0, left: '0.5rem', fontSize: 'x-large', fontWeight: 900 }}>{sensor.title}</h3>
                {
                    <div style={{ fontWeight: 500 }}>
                        {
                            sensor.lastMeasurement ? sensor.lastMeasurement.value : "N/A"
                        } {sensor.unit}
                    </div>
                }
            </div>
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }}>
                {
                    data && <AreaChart
                        width={198}
                        height={100}
                        data={data.map((e, i) => ({ y: Number(e.value), x: new Date(e.createdAt) }))}
                    >
                        <defs>
                            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="y" strokeWidth={0.5} strokeOpacity={0.8} stroke='#4eaf47' fill="url(#color)" />
                    </AreaChart>
                }
                {/* <XYPlot width={198} height={100}>
                        <GradientDefs>
                            <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={'red'} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={'blue'} stopOpacity={0.3} />
                            </linearGradient>
                        </GradientDefs>
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        <XAxis />
                        <YAxis />
                        {
                            data && <AreaSeries
                                color={'url(#CoolGradient)'}
                                data={data.map((e, i) => ({ y: Number(e.value), x: i }))}
                            />
                        }
                    </XYPlot> */}
            </div>
        </div>
    )
}

export default Sensor