import React, { useState, useEffect } from 'react'
import { FlexibleXYPlot, GradientDefs, linearGradient, AreaSeries } from 'react-vis'

const Sensor = ({ boxID, sensor }) => {
    const [data, setData] = useState()

    useEffect(() => {
        fetch(`https://api.opensensemap.org/boxes/${boxID}/data/${sensor._id}/`)
            .then(res => res.json())
            .then(resData => {
                setData(resData)
            })
    }, [boxID, sensor])
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
                left: 0
            }}>
                <FlexibleXYPlot>
                    <GradientDefs>
                        <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={'red'} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={'blue'} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={'blue'} stopOpacity={0} />
                        </linearGradient>
                    </GradientDefs>
                    {
                        data && <AreaSeries
                            color={'url(#CoolGradient)'}
                            data={data.map((e, i) => ({ y: Number(e.value), x: i }))}
                        />
                    }
                </FlexibleXYPlot>
            </div>
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            }}>
                <h3 style={{ fontWeight: 300 }}>{sensor.title}</h3>
                {
                    <div style={{ fontWeight: 500 }}>
                        {
                            sensor.lastMeasurement ? sensor.lastMeasurement.value : "N/A"
                        } {sensor.unit}
                    </div>
                }
            </div>
        </div>
    )
}

export default Sensor