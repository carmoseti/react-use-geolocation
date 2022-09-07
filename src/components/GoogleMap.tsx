import React, {FunctionComponent, MutableRefObject, useEffect, useRef, useState} from 'react'
import {Wrapper, Status} from "@googlemaps/react-wrapper"
import MarkerOptions = google.maps.MarkerOptions;

interface OwnProps {
    center: google.maps.LatLngLiteral
    children?: React.ReactNode
}

type Props = OwnProps

const Marker: FunctionComponent<google.maps.MarkerOptions> = (options: MarkerOptions) => {
    const [marker, setMarker] = useState<google.maps.Marker>()

    useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker())
        }

        return () => {
            if (marker) {
                marker.setMap(null)
            }
        }
    }, [marker])

    useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);

    return null
}

const MapComponent: FunctionComponent<Props> = (props) => {
    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map>()

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new google.maps.Map(ref.current, {
                center: props.center,
                zoom: 18,
            }))
        }
    }, [])

    useEffect(() => {
        if (map) {
            map.setCenter(props.center)
        }
    }, [props.center])

    return (
        <React.Fragment>
            <div ref={ref} style={{
                height: 500,
                width: 750
            }}/>
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, {map});
                }
            })}
        </React.Fragment>
    )
}

export const GoogleMap: FunctionComponent<Props> = (props) => {

    return (
        <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
                 render={(status: Status) => (
                     <h3>{status}</h3>
                 )}>
            <MapComponent center={props.center}>
                <Marker position={props.center}/>
            </MapComponent>
        </Wrapper>
    )
}
