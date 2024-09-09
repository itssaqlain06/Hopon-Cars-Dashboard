// GoogleMapsLoader.tsx
import React, { useEffect, useState } from 'react';

interface GoogleMapsLoaderProps {
    children: React.ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (window.google && window.google.maps) {
            setLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBEpezNDENEaLW4Hog5yW5D-YIa5mbBCMA&libraries=places`;
        script.async = true;
        script.onload = () => setLoaded(true);
        script.onerror = (error) => console.error('Google Maps script failed to load', error);
        document.body.appendChild(script);

        return () => {
            // Cleanup: Remove the script if component unmounts
            document.body.removeChild(script);
        };
    }, []);

    return loaded ? <>{children}</> : <div>Loading Google Maps...</div>;
};

export default GoogleMapsLoader;
