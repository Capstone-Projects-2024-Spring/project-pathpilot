import React, { useState, useEffect } from 'react';
import { FetchSavedRoutes } from './FetchSavedRoutes';
import LocationGroups from './LocationGroups';

const SavedRoutesCards = () => {
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const { routes } = await FetchSavedRoutes();
                setSavedRoutes(routes);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            {localStorage.getItem("id") === null ? (
                <p>You must create an account to save and view your saved routes.</p>
            ) : (
                 <>
                    {Array.isArray(savedRoutes) && savedRoutes.length > 0 ? (
                        <LocationGroups data={savedRoutes} />
                    ) : (
                        <p>No saved routes found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default SavedRoutesCards;



