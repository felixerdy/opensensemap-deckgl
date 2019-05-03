import React, { useState, useEffect } from 'react'
import './App.css'
import Map from "./Map"

import Sensor from './Sensor'

import 'bulma/css/bulma.css'


const App = () => {
  const [basemap, setBasemap] = useState('dark-v10')

  const [panelVisible, setPanelVisible] = useState(true)
  const [tiltWithDevice, setTiltWithDevice] = useState(false)

  const [box, setBox] = useState()

  const [layersVisible, setLayersVisible] = useState({
    scatter: true,
    heat: true
  })

  // navbar burger toggle
  useEffect(() => {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {

          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');

        });
      });
    }
  }, [])

  const handleOptionChange = (changeEvent) => {
    setBasemap(changeEvent.target.value)
  }

  return (
    <React.Fragment>
      <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="">
            <img src="https://sensebox.de/images/sensebox_logo.svg" />
          </a>

          <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item">
              <h3 className="heading">Layers</h3>
              <input type='checkbox' checked={layersVisible.scatter} onChange={() => setLayersVisible({ ...layersVisible, scatter: !layersVisible.scatter })} />
              <label>Scatterplot</label>
              <br />
              <input type='checkbox' checked={layersVisible.heat} onChange={() => setLayersVisible({ ...layersVisible, heat: !layersVisible.heat })} />
              <label>3D Heatmap</label>
            </div>

            <div className="navbar-item">
              <h3 className="heading">Basemap</h3>
              <select onChange={handleOptionChange} value={basemap}>
                <option value='streets-v11' >Streets</option>
                <option value='light-v10' >Light</option>
                <option value='dark-v10' >Dark</option>
                <option value='outdoors-v11' >Outdoors</option>
                <option value='satellite-v9' >Satellite</option>
              </select>
            </div>
            <div className="navbar-item">
              <input type='checkbox' checked={tiltWithDevice} onChange={() => setTiltWithDevice(!tiltWithDevice)} />
              <label>Tilt With Device</label>
            </div>
          </div>
        </div>
      </nav>


      <div>
        <Map basemap={basemap}
          layersVisible={layersVisible}
          tiltWithDevice={tiltWithDevice}
          onBoxSelect={(object) => {
            setPanelVisible(true)
            setBox(object)
          }} />
        {/* {
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
        } */}
      </div>
    </React.Fragment>
  )
}

export default App
