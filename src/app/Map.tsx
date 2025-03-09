"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define the Overpass API query for golf courses in North Carolina
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Bounding box for North Carolina
const BOUNDS = [33.8, -83.6, 36.6, -75.3]; // (min_lat, min_lon, max_lat, max_lon)

// Overpass query to fetch golf courses in North Carolina
const overpassQuery = `
[out:json];
node["leisure"="golf_course"](${BOUNDS.join(",")});
out body;
`;

const Map = () => {
  const [golfCourses, setGolfCourses] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from Overpass API
    const fetchGolfCourses = async () => {
      try {
        const response = await fetch(OVERPASS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data from Overpass API");
        }

        const data = await response.json();

        // Parse and extract relevant information
        const courses = data.elements.map((node: any) => ({
          id: node.id,
          name: node.tags.name || "Unnamed Golf Course",
          lat: node.lat,
          lng: node.lon,
        }));

        setGolfCourses(courses); // Set the golf courses state
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };

    fetchGolfCourses(); // Call the fetch function
  }, []);

  // Custom marker icon (optional)
  const golfIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={[35.5, -79.5]} // Center of North Carolina
      zoom={8} // Adjust zoom level for North Carolina
      style={{ height: "80vh", width: "150vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Add Golf Course Markers */}
      {golfCourses.map((course) => (
        <Marker key={course.id} position={[course.lat, course.lng]} icon={golfIcon}>
          <Popup>{course.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
