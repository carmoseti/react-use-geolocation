import React, {FunctionComponent} from 'react'
import {useGeoLocation} from "./lib"
import "./index.css"

interface OwnProps {
}

type Props = OwnProps

const App: FunctionComponent<Props> = (props) => {
    const {
        getCurrentPosition,
        isAvailable,
        isWatchingPosition,
        position,
        positionError,
        stopWatchingPosition,
        startWatchingPosition
    } = useGeoLocation()

    return (
        <div>
            <p>Is GeoLocation supported ? {isAvailable ?
                <span className={'positive'}>YES</span> :
                <span className={'negative'}>NO</span>
            }</p>
            <p>
                <button onClick={() => {
                    getCurrentPosition()
                }}>
                    Get current position
                </button>
                <button onClick={() => {
                    if (isWatchingPosition) {
                        stopWatchingPosition()
                    } else {
                        startWatchingPosition()
                    }
                }}>
                    {isWatchingPosition ? "Stop watching " : "Start watching "}position
                </button>
            </p>

            {position &&
                <>
                    <h3>Position Info</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Accuracy</td>
                            <td>{position.coords.accuracy}</td>
                        </tr>
                        <tr>
                            <td>Altitude</td>
                            <td>{position.coords.altitude}</td>
                        </tr>
                        <tr>
                            <td>Altitude Accuracy</td>
                            <td>{position.coords.altitudeAccuracy}</td>
                        </tr>
                        <tr>
                            <td>Heading</td>
                            <td>{position.coords.heading}</td>
                        </tr>
                        <tr>
                            <td>Latitude</td>
                            <td>{position.coords.latitude}</td>
                        </tr>
                        <tr>
                            <td>Longitude</td>
                            <td>{position.coords.longitude}</td>
                        </tr>
                        <tr>
                            <td>Speed</td>
                            <td>{position.coords.speed}</td>
                        </tr>
                        <tr>
                            <td>Timestamp</td>
                            <td>{position.timestamp}</td>
                        </tr>
                        <tr>
                            <td>Date Time</td>
                            <td>{new Date(position.timestamp).toLocaleString()}</td>
                        </tr>
                        </tbody>
                    </table>
                </>
            }

            {positionError &&
                <>
                    <h3>Position Error</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Error Code</td>
                            <td>{positionError.code}</td>
                        </tr>
                        <tr>
                            <td>Error Type</td>
                            <td>
                                {positionError.code === positionError.PERMISSION_DENIED && 'PERMISSION_DENIED'}
                                {positionError.code === positionError.POSITION_UNAVAILABLE && 'POSITION_UNAVAILABLE'}
                                {positionError.code === positionError.TIMEOUT && 'TIMEOUT'}
                            </td>
                        </tr>
                        <tr>
                            <td>Error Message</td>
                            <td className={"negative"}>{positionError.message}</td>
                        </tr>
                        </tbody>
                    </table>
                </>
            }
        </div>
    )
}

export default App
