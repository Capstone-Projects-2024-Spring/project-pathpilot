import React, { useState,useEffect } from 'react';

const PlanMapOutput = ({ locations, path }) => {
    const [map, setMap] = useState(null);
    var markersArray = [];

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
            /*const marker = new AdvancedMarkerElement({
                map,
                position: { lat: 39.9526, lng: -75.1652 },
            });*/
        }
      initMap();
    }, []);

    useEffect(() => {
        async function placeMarkers() {
            const google = window.google; 
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            locations?.map((place) => 
                markersArray.push(new AdvancedMarkerElement({
                    map,
                    position: { lat: place.lat, lng: place.lng },
                }))
            );
            /*if(markersArray.length > 0) {
                console.log(markersArray[0]);
                markersArray[0].map = null;
            }*/
            
            locations?.map((place) => 
            console.log(place.lat + "," + place.lng)
            );
                /*const latitude = 39.9526;
                const longitude = -75.1652;
                const pos = {lat : latitude, lng: longitude};
            const marker = new AdvancedMarkerElement({
                map,
                position: pos,
            }); */
        }
      placeMarkers();
    }, [locations]);


    return (
        <div className='output-padding'>
            <div id="map"></div>
        </div>
    )
};

export default PlanMapOutput;