import React, { useState, useEffect } from 'react'
import Map from "./Map"
import BoxPanel from './BoxPanel'

import 'bulma/css/bulma.css'


const App = () => {

  const [box, setBox] = useState()

  return (
    <React.Fragment>
      <div>
        <Map
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
