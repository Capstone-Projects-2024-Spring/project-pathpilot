import React, { useState, useEffect } from 'react';
import { FetchSavedRoutes } from './FetchSavedRoutes.js';

const SavedRoutesCards = () => {
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routes = await FetchSavedRoutes();
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
            {Array.isArray(savedRoutes) && savedRoutes.length > 0 ? (
                savedRoutes.map(route => (
                    <div key={route.id}>
                        {/* Render each saved route */}
                    </div>
                ))
            ) : (
                <p>No saved routes found.</p>
            )}
        </div>
    );
};

export default SavedRoutesCards;
