import React, { useState, useEffect } from 'react'
import Map from "./Map"
import BoxPanel from './BoxPanel'

import 'bulma/css/bulma.css'


const App = () => {
  const [basemap, setBasemap] = useState('dark-v10')

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
      <nav className="navbar" role="navigation" aria-label="main navigation" style={{
        backgroundColor: 'rgba(29, 29, 29, 0.9)',
      }}>
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
              <p>
                <input type='checkbox' checked={layersVisible.scatter} onChange={() => setLayersVisible({ ...layersVisible, scatter: !layersVisible.scatter })} />
                <label>Scatterplot</label>
                <br />
                <input type='checkbox' checked={layersVisible.heat} onChange={() => setLayersVisible({ ...layersVisible, heat: !layersVisible.heat })} />
                <label>3D Heatmap</label>

              </p>
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
            setBox(object)
          }} />
        {
          box && <BoxPanel box={box} />
        }
      </div>
    </React.Fragment>
  )
}

export default App
