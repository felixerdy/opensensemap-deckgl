import React, { useState, useEffect } from 'react'
import moment from "moment";

import Sensor from './Sensor';


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
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: panelVisible ? 'translate(-50%, 0)' : 'translate(-50%, calc(100% + 2rem))',
            transition: '200ms',
            textAlign: 'center',
            maxWidth: 'calc(100% - 2rem)'
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
                maxWidth: '100%',
                overflowX: 'scroll',
                overflowY: 'hidden',
            }}>
                {/* Closing span */}
                <span style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    padding: '1rem',
                    cursor: 'pointer',
                    zIndex: 5
                }}
                    onClick={() => setPanelVisible(!panelVisible)} >﹀</span>

                {/* Box title and last seen */}
                <h1 style={{ fontWeight: 'bold' }}>{box.properties.name}</h1>
                <h3>Zuletzt online: {
                    data ? moment(data.updatedAt).locale("de").fromNow() : null
                }</h3>

                {/* Sensor Charts */}
                <div className='sensors' style={{ padding: '1rem', display: 'flex', overflow: 'scroll' }}>
                    {data &&
                        data.sensors.map((e, i) => (
                            <Sensor key={i} boxID={data._id} sensor={e}></Sensor>
                        ))}
                </div>

            </div>

        </div >
    )
}

export default BoxPanel;