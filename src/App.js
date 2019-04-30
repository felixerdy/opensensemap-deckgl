import React, { useState, useEffect } from 'react'
import './App.css'
import Map from "./Map"

import Sensor from './Sensor'

const App = () => {
  const [basemap, setBasemap] = useState('light-v10')

  const [panelVisible, setPanelVisible] = useState(true)

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
        <input id='streets-v11' type='radio' name='rtoggle' value='streets-v11' checked={basemap == 'streets-v11'} onChange={handleOptionChange} />
        <label htmlFor='streets'>Streets</label>
        <br />
        <input id='light-v10' type='radio' name='rtoggle' value='light-v10' checked={basemap == 'light-v10'} onChange={handleOptionChange} />
        <label htmlFor='light'>Light</label>
        <br />
        <input id='dark-v10' type='radio' name='rtoggle' value='dark-v10' checked={basemap == 'dark-v10'} onChange={handleOptionChange} />
        <label htmlFor='dark'>Dark</label>
        <br />
        <input id='outdoors-v11' type='radio' name='rtoggle' value='outdoors-v11' checked={basemap == 'outdoors-v11'} onChange={handleOptionChange} />
        <label htmlFor='outdoors'>Outdoors</label>
        <br />
        <input id='satellite-v9' type='radio' name='rtoggle' value='satellite-v9' checked={basemap == 'satellite-v9'} onChange={handleOptionChange} />
        <label htmlFor='satellite'>Satellite</label>
        <hr />
        <button onClick={() => setPanelVisible(!panelVisible)}>Toggle Panel</button>
        <hr />
        <input type='checkbox' checked={layersVisible.scatter} onChange={() => setLayersVisible({ ...layersVisible, scatter: !layersVisible.scatter })} />
        <label>Scatterplot</label>
        <br />
        <input type='checkbox' checked={layersVisible.heat} onChange={() => setLayersVisible({ ...layersVisible, heat: !layersVisible.heat })} />
        <label>3D Heatmap</label>
      </div>
      <div>
        <Map basemap={basemap}
          layersVisible={layersVisible}
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
