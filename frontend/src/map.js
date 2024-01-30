import L from 'leaflet';
import {
    Map, TileLayer, Marker, Popup, MapContainer
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './style.css';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React, {useEffect, useState} from "react";
import axios from "axios";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


function getSearchLocation(setSearchResults) {

}


function getCurrentLocation(setCurrentLoc) {

}

const baseURL = "http://193.163.200.14:10000/location/"

function GpsMap() {

    const [current, setCurrent] = useState(null)
    const [searchLoc, setSearchLoc] = useState(null)


    const [position, setPosition] = useState([51.505, 37])


    useEffect(() => {
        axios.get(baseURL, {
            headers: {
                "Access-Control-Allow-Origin": true
            }
        }).then((response) => {
            console.log(response)
            setCurrent(response.data)
        })
    }, []);

    return (
        <div>
            {current ? (<MapContainer style={{height: '100vh', width: '100wh'}} center={position} zoom={13}
                                      scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={current}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>) : null}
        </div>
    )
}

export default GpsMap
