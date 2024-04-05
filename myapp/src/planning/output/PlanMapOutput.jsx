import React, { useState,useEffect } from 'react';

const PlanMapOutput = ({ locations, path }) => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        async function initMap() {
            const google = window.google;
            const { Map } = await google.maps.importLibrary("maps");  
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            setMap(new Map(document.getElementById("map"), {
                center: { lat: 39.9526, lng: -75.1652 },
                zoom: 14,
                mapId: "90bf2933115d5c1f",
            }));
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: 39.9526, lng: -75.1652 },
            });
        }
      initMap();
    }, []);

    useEffect(() => {
        async function initMap() {
            const google = window.google; 
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: 39.9526, lng: -75.1652 },
            });
        }
      initMap();
    }, [locations]);


    return (
        <div className='output-padding'>
            <div id="map"></div>
        </div>
    )
};

export default PlanMapOutput;