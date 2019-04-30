import React, { useState, useEffect } from 'react'
import './App.css'
import Map from "./Map"

import Sensor from './Sensor'

const App = () => {
  const [basemap, setBasemap] = useState('light-v10')

  const [panelVisible, setPanelVisible] = useState(true)
  const [tiltWithDevice, setTiltWithDevice] = useState(false)

  const [box, setBox] = useState()

  const [layersVisible, setLayersVisible] = useState({
    scatter: true,
    heat: true
  })

  const handleOptionChange = (changeEvent) => {
    setBasemap(changeEvent.target.value)
  }

  return (
    <React.Fragment>
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        margin: '1rem',
        padding: '1rem',
        zIndex: 1,
        background: 'white',
        borderRadius: '1rem'
      }}>
        <h3 className="heading">Basemap</h3>
        <select onChange={handleOptionChange} value={basemap}>
          <option value='streets-v11' >Streets</option>
          <option value='light-v10' >Light</option>
          <option value='dark-v10' >Dark</option>
          <option value='outdoors-v11' >Outdoors</option>
          <option value='satellite-v9' >Satellite</option>
        </select>
        <hr />
        <h3 className="heading">Layers</h3>
        <input type='checkbox' checked={layersVisible.scatter} onChange={() => setLayersVisible({ ...layersVisible, scatter: !layersVisible.scatter })} />
        <label>Scatterplot</label>
        <br />
        <input type='checkbox' checked={layersVisible.heat} onChange={() => setLayersVisible({ ...layersVisible, heat: !layersVisible.heat })} />
        <label>3D Heatmap</label>
        <hr />
        <input type='checkbox' checked={tiltWithDevice} onChange={() => setTiltWithDevice(!tiltWithDevice)} />
        <label>Tilt With Device</label>
      </div>
      <div>
        <Map basemap={basemap}
          layersVisible={layersVisible}
          tiltWithDevice={tiltWithDevice}
          onBoxSelect={(object) => {
            setPanelVisible(true)
            setBox(object)
          }} />
        {
          box && <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            margin: '1rem',
            marginBottom: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            fontWeight: 500,
            transform: panelVisible ? 'translateY(0)' : 'translateY(calc(100% + 2rem))',
            transition: '200ms',
            display: 'flex',
            flexDirection: 'row'
          }}>
            <span style={{
              position: 'absolute',
              right: 0,
              top: 0,
              margin: '1rem',
              cursor: 'pointer',
            }}
              onClick={() => setPanelVisible(!panelVisible)}>﹀</span>

            {
              box.properties.image && <img style={{
                height: '6rem',
                borderRadius: '1rem 0rem 0rem 1rem'
              }}
                src={`https://opensensemap.org/userimages/${box.properties.image}`}></img>
            }

            <div style={{ padding: '1rem', display: 'flex', overflow: 'scroll' }}>
              <h2>{box.properties.name}</h2>
              {box.properties.sensors.map((e, i) => (
                <Sensor boxID={box.properties._id} id={i} sensor={e}></Sensor>
              ))}
            </div>

          </div>
        }
      </div>
    </React.Fragment>
  )
}

export default App
