import React, { useEffect } from 'react';

const PlanOutput = ({ locations, path }) => {
    let map;

    useEffect(() => {
        async function initMap() {
            const google = window.google;
            const { Map } = await google.maps.importLibrary("maps");
        
            map = new Map(document.getElementById("map"), {
                center: { lat: 39.9526, lng: -75.1652 },
                zoom: 14,
            });
        }
      initMap();
    }, []);
    

    return (
        <div className='output-padding'>
            <div id="map"></div>
        </div>
    )
};

export default PlanOutput;