import React, { useState, useEffect } from "react";
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { FlyToInterpolator } from "@deck.gl/core";

const Map = (props) => {

    const scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    // Viewport settings
    const [viewport, setViewport] = useState({
        width: "100%",
        height: "100%",
        altitude: 1.5,
        latitude: 45,
        longitude: 9,
        zoom: 4,
        maxPitch: 60,
        maxZoom: 20,
        minPitch: 0,
        minZoom: 0,
        pitch: 0,
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator()
    })
    const [layer, setLayer] = useState()
    const [tooltip, setTooltip] = useState()

    useEffect(() => {
        _fetchAndSetBoxes()
        setInterval(() => {
            _fetchAndSetBoxes()
        }, 30000)
    }, [])

    const ICON_MAPPING = {
        marker: { x: 0, y: 0, width: 32, height: 32, mask: true }
    };

    const _fetchAndSetBoxes = () => {
        console.log("fetching data 📡")
        fetch('https://api.opensensemap.org/boxes?format=geojson')
            .then(res => res.json())
            .then(data => {
                console.log("creating layer 🤓")
                const boxLayer = new GeoJsonLayer({
                    id: 'geojson',
                    data,
                    pickable: true,
                    stroked: false,
                    pointRadiusMinPixels: 4,
                    getRadius: 10,
                    fp64: true,
                    // _subLayerProps: {
                    //     points: {
                    //         type: IconLayer,
                    //         iconAtlas: 'images/icon.png',
                    //         iconMapping: ICON_MAPPING,
                    //         getIcon: d => 'marker',
                    //         getColor: [255, 200, 0],
                    //         getSize: 32
                    //     }
                    // },
                    getFillColor: d => {
                        const diff = new Date() - new Date(d.properties.updatedAt)
                        const scaled = scale(diff, 0, 604800000, 255, 50)
                        return diff < 604800000 ? [78, 175, 71, scaled] : [78, 175, 71, 50]
                    },
                    onHover: ({ object, x, y }) => {
                        setTooltip({
                            object: object,
                            pointerX: x,
                            pointerY: y
                        })
                    },
                    onClick: ({ object }) => {
                        props.onBoxSelect(object)
                        console.log(object)
                    }
                })
                setLayer(boxLayer)
            })
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
            {object.properties.name}
        </div>
    }

    return (
        <DeckGL
            viewState={viewport}
            controller
            onViewStateChange={({ viewState }) => setViewport(viewState)}
            layers={[layer]}>
            {_renderTooltip.bind(this)}
            <StaticMap
                mapStyle={'mapbox://styles/mapbox/' + props.basemap} />
        </DeckGL>
    )
}

export default Map