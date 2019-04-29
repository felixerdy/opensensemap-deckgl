import React, { useState, useEffect } from "react";

const Sensor = (props) => {

    const [measurement, setMeasurement] = useState()

    useEffect(() => {
        fetch(`https://api.opensensemap.org/boxes/${props.boxID}/data/${props.sensor._id}`)
            .then(res => res.json())
            .then(data => {
                setMeasurement(data[0])
            })
    })

    return (
        <div style={{ marginLeft: '1rem', paddingLeft: "1rem", paddingRight: "1rem", borderLeft: '2px solid' }}>
            <h3 style={{ fontWeight: 300 }}>{props.sensor.title}</h3>
            {
                measurement && <div style={{ fontSize: 'xx-large', fontWeight: 500 }}>{measurement.value} {props.sensor.unit}</div>
            }
        </div>
    )
}

export default Sensor