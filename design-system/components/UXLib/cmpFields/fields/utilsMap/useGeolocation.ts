import { useState, useCallback } from "react";

/**
 * Custom hook to get the user's current geolocation.
 * Provides the current position and a function to update it.
 * Moved to UXLib to keep the main hooks folder clean.
 */
export const useGeolocation = () => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);

    const getCurrentPosition = useCallback((options?: PositionOptions) => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setError(null);
            },
            (err) => {
                setError(err.message);
            },
            options
        );
    }, []);

    return { position, error, getCurrentPosition };
};
