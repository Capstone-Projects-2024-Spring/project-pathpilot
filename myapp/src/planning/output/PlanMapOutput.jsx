import React, { useState,useEffect } from 'react';

const PlanMapOutput = ({ locations, path }) => {
    const [map, setMap] = useState(null);
    const [markersArray, setMarkersArray] = useState([]);

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
            var count = 1;
            locations?.map((place) => 
                setMarkersArray(markersArray => [...markersArray, new AdvancedMarkerElement({
                    map,
                    content: buildContent(place, count++), //<CustomMarker place={place} />,
                    position: { lat: place[3], lng: place[4] },
                })])
            );
            /*if(markersArray.length > 0) {
                console.log(markersArray[0]);
                markersArray[0].map = null;
            }*/

            locations?.map((place) => 
            console.log(place[3] + "," + place[4])
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

    useEffect(() => {
        async function removeMarkers() {
            if(!Array.isArray(locations) && markersArray.length > 0) {
                markersArray.map((marker) => 
                    marker.map = null
                );
            }

                /*const latitude = 39.9526;
                const longitude = -75.1652;
                const pos = {lat : latitude, lng: longitude};
            const marker = new AdvancedMarkerElement({
                map,
                position: pos,
            }); */
        }
      removeMarkers();
    }, [locations]);

    function buildContent(place, count) {
        const content = document.createElement("div");
      
        content.classList.add("place-marker");
        content.innerHTML = `
          <div class="place">
              <span >${count}</span>
          </div>
          `;
        return content;
      }


    return (
        <div className='output-padding'>
            <div id="map"></div>
        </div>
    )
};

export default PlanMapOutput;