import React from 'react';
import './SavedRoutes.css';

const LocationCard = ({ name, address }) => {
  return (
    <div className="location-card">
      <h3>{name}</h3>
      <p>{address}</p>
    </div>
  );
};

const LocationGroup = ({ locations, routeNumber }) => {
  console.log(locations);
  return (
    <div className="location-group">
      <h2>Route {routeNumber}</h2>
      {locations.map((location, index) => (
        <div key={index} className="location-item">
          <span className="location-number">{`${index + 1}.`}</span> {/* Display the sequential number */}
          <LocationCard name={location[0]} address={location[1]} />
        </div>
      ))}
    </div>
  );
};

const LocationGroups = ({ data }) => {
  console.log("data in location");
  console.log(data);
  return (
    <div className="location-groups" >
      {data.map((group, index) => (
        <LocationGroup key={index} locations={group} routeNumber={index + 1} />
      ))}
    </div>
  );
};

export default LocationGroups;