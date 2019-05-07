import React, { useState, useEffect } from "react";
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { StaticMap, NavigationControl } from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { FlyToInterpolator } from 'deck.gl'

const Map = (props) => {
    const scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    const [data, setData] = useState()

    const [tiltWithDevice, setTiltWithDevice] = useState(false)

    const [layerPanelOpen, setLayerPanelOpen] = useState(false)

    const [layersVisible, setLayersVisible] = useState({
        scatter: true,
        heat: true
    })

    const [basemap, setBasemap] = useState('dark-v10')

    const handleOptionChange = (changeEvent) => {
        setBasemap(changeEvent.target.value)
    }


    // Viewport settings
    const [viewport, setViewport] = useState({
        width: "100%",
        height: "100%",
        latitude: 50,
        longitude: 9,
        zoom: 4,
        pitch: 0,
        bearing: 0,
        transitionDuration: 200,
        transitionInterpolator: new FlyToInterpolator()
    })

    const scatter = new GeoJsonLayer({
        id: 'geojson',
        data,
        pickable: true,
        stroked: false,
        pointRadiusMinPixels: 6,
        getRadius: 10,
        visible: !layersVisible.heat ? true : (layersVisible.scatter && (viewport.zoom < 5 ? false : true)),
        opacity: () => {
            if (layersVisible.heat) {
                if (viewport.zoom < 5) {
                    return 0
                }
                if (viewport.zoom > 8) {
                    return 1
                }
                return scale(viewport.zoom, 5, 8, 0, 1)
            } else {
                return 1
            }
        },
        getFillColor: d => {
            const diff = new Date() - new Date(d.properties.lastMeasurementAt)
            // scale alpha value from today (255) to 7 days ago (50)
            const scaled = scale(diff, 0, 604800000, 255, 50)
            if (d.properties.exposure == "mobile") {
                return diff < 604800000 ? [0, 0, 255, scaled] : [0, 0, 255, 50]
            }
            return diff < 604800000 ? [78, 175, 71, scaled] : [78, 175, 71, 50]
        },
        onHover: ({ object, x, y }) => {
            if (viewport.zoom > 6 || !layersVisible.heat) {
                setTooltip({
                    object: object,
                    pointerX: x,
                    pointerY: y
                })
            }
        },
        onClick: ({ object }) => {
            if (viewport.zoom > 6 || !layersVisible.heat) {
                props.onBoxSelect(object)
                console.log(object)
            }
        }
    })

    const heat = new HexagonLayer({
        id: 'heatmap',
        colorRange: [
            [161, 217, 155],
            [116, 196, 118],
            [49, 163, 84],
            [0, 109, 44],
        ],
        data: data ? data.features : [],
        elevationScale: 200,
        extruded: true,
        radius: 20000,
        coverage: 0.8,
        visible: layersVisible.heat && (viewport.zoom > 6 ? false : true),
        pickable: true,
        onHover: ({ object, x, y }) => {
            if (viewport.zoom < 6) {
                setTooltip({
                    object: object,
                    pointerX: x,
                    pointerY: y
                })
            }
        },
        getPosition: d => d.geometry.coordinates,
        opacity: () => {
            if (viewport.zoom < 4) {
                return 1
            }
            if (viewport.zoom > 6) {
                return 0
            }
            return scale(viewport.zoom, 4, 6, 1, 0)
        },


    })

    const [scatterLayer, setScatterLayer] = useState(scatter)
    const [heatLayer, setHeatLayer] = useState(heat)

    const [tooltip, setTooltip] = useState()

    // fetching API data
    useEffect(() => {
        _fetchData()
        setInterval(_fetchData, 30000)

    }, [])

    const _fetchData = () => {
        console.log("Fetching new Data... 📡")
        fetch('https://api.opensensemap.org/boxes?format=geojson&minimal=true')
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
    }

    useEffect(() => {
        setScatterLayer(scatter)
        setHeatLayer(heat)
    }, [layersVisible, viewport.zoom, data])

    //  device orientation
    useEffect(() => {
        if (tiltWithDevice) {
            window.addEventListener("deviceorientation", _handleOrientation, true);
        }

        return () => {
            window.removeEventListener("deviceorientation", _handleOrientation, true)
            setTimeout(() => {
                setViewport(prevState => ({
                    ...prevState,
                    pitch: 0,
                    bearing: 0,
                    transitionDuration: 200,
                    transitionInterpolator: new FlyToInterpolator()
                }))
            }, 200)
        };
    }, [tiltWithDevice])

    const _handleOrientation = (e) => {
        if (e.beta <= 60 && e.beta >= 0) {
            setViewport(prevState => ({
                ...prevState,
                pitch: e.beta,
                bearing: -e.alpha + 90,
                transitionDuration: 200,
                transitionInterpolator: new FlyToInterpolator()
            }))
        } else {
            setViewport(prevState => ({
                ...prevState,
                bearing: -e.alpha + 90,
                transitionDuration: 200,
                transitionInterpolator: new FlyToInterpolator()
            }))
        }

    }

    const _renderTooltip = () => {
        const { object, pointerX, pointerY } = tooltip || {}
        return object && <div style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: pointerX,
            top: pointerY,
            transform: "translateX(-50%) translateY(calc(-100% - 1rem))",
            background: '#000000aa',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '1rem',
            color: 'white'
        }}>
            {object.properties && object.properties.name}
            {object.elevationValue && `${object.elevationValue} Boxes`}
        </div>
    }

    return (
        <React.Fragment>
            <DeckGL
                viewState={viewport}
                controller
                onViewStateChange={({ viewState }) => setViewport(prevState => ({ ...prevState, ...viewState }))}
                layers={[heatLayer, scatterLayer]}>
                {_renderTooltip.bind(this)}
                <StaticMap mapStyle={'mapbox://styles/mapbox/' + basemap}>
                    <div style={{ position: 'absolute', right: 0, margin: '1rem', zIndex: 999 }}>
                        <NavigationControl onViewportChange={(viewState) => setViewport(prevState => ({ ...prevState, ...viewState }))} />
                        <div style={{ marginTop: '1rem' }} className="mapboxgl-ctrl mapboxgl-ctrl-group">
                            <button className="mapboxgl-ctrl-icon" type="button" onClick={() => setTiltWithDevice(!tiltWithDevice)}>
                                <i style={{ color: 'blue' }} className={tiltWithDevice ? 'material-icons' : "material-icons-two-tone"}>
                                    screen_rotation
                                </i>
                            </button>
                        </div>
                        <div style={{ marginTop: '1rem' }} className="mapboxgl-ctrl mapboxgl-ctrl-group">
                            <button className="mapboxgl-ctrl-icon" type="button" onClick={() => setLayerPanelOpen(!layerPanelOpen)}>
                                <i className='material-icons'>
                                    layers
                                </i>
                            </button>
                        </div>
                        <div style={{
                            width: layerPanelOpen ? 'auto' : 0,
                            height: layerPanelOpen ? 'auto' : 0,
                            transition: '200ms',
                            position: 'absolute',
                            right: '0',
                            overflow: 'hidden',
                            borderRadius: '4px',
                            padding: layerPanelOpen ? '1rem' : 0,
                            background: '#fff',
                            marginTop: '1rem'
                        }}>
                            <h3 className="heading">Basemap</h3>
                            <select onChange={handleOptionChange} value={basemap}>
                                <option value='streets-v11' >Streets</option>
                                <option value='light-v10' >Light</option>
                                <option value='dark-v10' >Dark</option>
                                <option value='outdoors-v11' >Outdoors</option>
                                <option value='satellite-v9' >Satellite</option>
                            </select>
                            <hr></hr>
                            <h3 className="heading">Layers</h3>
                            <p
                                style={{
                                    textDecoration: layersVisible.scatter ? 'none' : 'line-through',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setLayersVisible({ ...layersVisible, scatter: !layersVisible.scatter })}
                            >Scatterplot</p>
                            <p
                                style={{
                                    textDecoration: layersVisible.heat ? 'none' : 'line-through',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setLayersVisible({ ...layersVisible, heat: !layersVisible.heat })}
                            >Heatmap</p>
                        </div>
                    </div>
                </StaticMap>
            </DeckGL>
        </React.Fragment>
    )
}

export default Map
