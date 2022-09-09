import {useCallback, useEffect, useState} from "react"

export type UseGeoLocation = {
    getCurrentPosition: (successCallback ?: PositionCallback, errorCallback ?: PositionErrorCallback, options ?: PositionOptions) => void
    isAvailable: boolean
    isWatchingPosition: boolean
    position?: GeolocationPosition
    positionError?: GeolocationPositionError
    startWatchingPosition: (successCallback ?: PositionCallback, errorCallback ?: PositionErrorCallback, options ?: PositionOptions) => void
    stopWatchingPosition: () => void
}

export const useGeoLocation = (): UseGeoLocation => {
    const [geoLocation, setGeoLocation] = useState<Geolocation>()
    const [isAvailable, setIsAvailable] = useState<boolean>()
    const [position, setPosition] = useState<GeolocationPosition>()
    const [positionError, setPositionError] = useState<GeolocationPositionError>()
    const [watchId, setWatchId] = useState<number>()

    const getCurrentPosition = useCallback((successCallback ?: PositionCallback, errorCallback ?: PositionErrorCallback, options ?: PositionOptions) => {
        if (geoLocation) {
            geoLocation.getCurrentPosition((...args) => {
                if (successCallback)
                    successCallback(args[0])
                setPosition(args[0])
            }, (...args) => {
                if (errorCallback)
                    errorCallback(args[0])
                setPositionError(args[0])
            }, {
                maximumAge: 0,
                timeout: Infinity,
                enableHighAccuracy: true,
                ...(options ?? {})
            })
        } else {
            console.error(`useGeoLocation.getCurrentPosition() is not available in this browser`)
        }
    }, [geoLocation])

    const startWatchingPosition = useCallback((successCallback ?: PositionCallback, errorCallback ?: PositionErrorCallback, options ?: PositionOptions) => {
        if (geoLocation) {
            setWatchId(
                geoLocation.watchPosition((...args) => {
                    if (successCallback)
                        successCallback(args[0])
                    setPosition(args[0])
                }, (...args) => {
                    if (errorCallback)
                        errorCallback(args[0])
                    setPositionError(args[0])
                }, {
                    maximumAge: 0,
                    timeout: Infinity,
                    enableHighAccuracy: true,
                    ...(options ?? {})
                })
            )
        } else {
            console.error(`useGeoLocation.startWatchingPosition() is not available in this browser`)
        }
    }, [geoLocation])

    const stopWatchingPosition = useCallback(() => {
        if (geoLocation) {
            setWatchId(undefined)
        } else {
            console.error(`useGeoLocation.stopWatchingPosition() is not available in this browser`)
        }
    }, [geoLocation])

    useEffect(() => {
        if ('geolocation' in navigator) {
            setIsAvailable(true)
        } else {
            setIsAvailable(false)
        }
    }, [])

    useEffect(() => {
        if (isAvailable) {
            setGeoLocation(navigator.geolocation)
        } else {
            setGeoLocation(undefined)
        }
    }, [isAvailable])

    useEffect(() => {
        return () => {
            if (watchId && geoLocation) {
                console.log(`useGeoLocation.clearWatch(${watchId})`)
                geoLocation.clearWatch(watchId)
            }
        }
    }, [watchId, geoLocation])

    return {
        getCurrentPosition,
        isAvailable: !!isAvailable,
        isWatchingPosition: !!watchId,
        position,
        positionError,
        stopWatchingPosition,
        startWatchingPosition,
    }
}