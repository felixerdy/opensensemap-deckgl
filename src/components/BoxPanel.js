import React, { useState, useEffect } from 'react'
import moment from "moment";


const BoxPanel = ({ box }) => {

    const [panelVisible, setPanelVisible] = useState(true)
    const [data, setData] = useState()

    useEffect(() => {
        setPanelVisible(true)
        fetch(`https://api.opensensemap.org/boxes/${box.properties._id}/`)
            .then(res => res.json())
            .then(resData => {
                console.log(resData)
                setData(resData)
            })
    }, [box])


    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            margin: '1rem',
            marginBottom: '2rem',
            overflow: 'scroll',
            transform: panelVisible ? 'translate(0, 0)' : 'translate(0, calc(100% + 2rem))',
            transition: '200ms',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(29, 29, 29, 0.9)',
                color: 'white',
                borderRadius: '1rem',
                fontWeight: 500,
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'inline-block',
                position: 'relative',
                maxWidth: '100%'
            }}>
                <span style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    margin: '1rem',
                    cursor: 'pointer',
                }}
                    onClick={() => setPanelVisible(!panelVisible)} >﹀</span>

                {
                    box.properties.image && <img style={{
                        height: '6rem',
                        borderRadius: '1rem 0rem 0rem 1rem'
                    }}
                        src={`https://opensensemap.org/userimages/${box.properties.image}`}></img>
                }

                <div style={{ padding: '1rem', display: 'flex', overflow: 'scroll' }}>
                    <div>
                        <h1 style={{ width: '10rem', fontWeight: 'bold' }}>{box.properties.name}</h1>
                        {
                            data &&
                            <p>{moment(data.updatedAt)
                                .locale("de")
                                .fromNow()}
                            </p>
                        }
                    </div>
                    {data &&
                        data.sensors.map((e, i) => (
                            <div key={i} style={{ marginLeft: '1rem', paddingLeft: "1rem", paddingRight: "1rem", borderLeft: '2px solid' }}>
                                <h3 style={{ fontWeight: 300 }}>{e.title}</h3>
                                {
                                    <div style={{ fontWeight: 500 }}>
                                        {
                                            e.lastMeasurement ? e.lastMeasurement.value : "N/A"
                                        } {e.unit}
                                    </div>
                                }
                            </div>
                        ))}
                </div>

            </div>

        </div >
    )
}

export default BoxPanel;