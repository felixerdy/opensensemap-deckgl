import React, { useState, useEffect } from 'react'
import {
    AreaChart, Area, Tooltip,
} from 'recharts';



const Sensor = ({ boxID, sensor, propHover }) => {
    const [data, setData] = useState()
    const [hoverData, setHoverData] = useState()

    useEffect(() => {
        propHover(hoverData)
    }, [hoverData])

    useEffect(() => {
        fetch(`https://api.opensensemap.org/boxes/${boxID}/data/${sensor._id}/`)
            .then(res => res.json())
            .then(resData => {
                setData(resData)
            })
    }, [boxID, sensor])

    const _currentValue = () => {
        if (hoverData && hoverData.activePayload) {
            return parseFloat(hoverData.activePayload[0].payload.y).toFixed(2)
        } else {
            return sensor.lastMeasurement ? parseFloat(sensor.lastMeasurement.value).toFixed(2) : "N/A"
        }
    }

    return (
        <div style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            borderRight: '2px solid',
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
                <h3 style={{ position: 'absolute', bottom: 0, left: '0.5rem', fontSize: 'large', fontWeight: 900 }}>{sensor.title}</h3>
                {
                    <div style={{ fontWeight: 100, position: 'absolute', right: '1rem', fontSize: 'x-large' }}>
                        <p>{_currentValue()} {sensor.unit}</p>
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
                        data={data.map((e, i) => ({ y: Number(e.value), x: new Date(e.createdAt) })).reverse()}
                        onMouseMove={(e) => setHoverData(e)}
                        onMouseLeave={(e) => setHoverData(null)}
                    >
                        <defs>
                            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {/* <Tooltip content={<></>} /> */}
                        <Area
                            type="monotone"
                            dataKey="y"
                            strokeWidth={0.5}
                            strokeOpacity={0.8}
                            stroke='#4eaf47'
                            fill="url(#color)"
                        />
                    </AreaChart>
                }
            </div>
        </div>
    )
}

export default Sensor