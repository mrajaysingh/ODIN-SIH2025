"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import styles from "../login/login.module.css";
import BackgroundSlider from "../components/BackgroundSlider";

type CoastalStateKey =
  | "andhra"
  | "tamilnadu"
  | "kerala"
  | "karnataka"
  | "goa"
  | "maharashtra"
  | "gujarat"
  | "odisha"
  | "westbengal";

const coastalStateToCities: Record<CoastalStateKey, string[]> = {
  andhra: ["Visakhapatnam", "Vijayawada", "Nellore"],
  tamilnadu: ["Chennai", "Cuddalore", "Thoothukudi"],
  kerala: ["Kochi", "Kollam", "Alappuzha"],
  karnataka: ["Mangalore", "Karwar", "Udupi"],
  goa: ["Panaji", "Vasco da Gama", "Margao"],
  maharashtra: ["Mumbai", "Ratnagiri", "Alibaug"],
  gujarat: ["Porbandar", "Veraval", "Dwarka"],
  odisha: ["Paradip", "Gopalpur", "Puri"],
  westbengal: ["Kolkata", "Haldia", "Digha"],
};

export default function RegisterPage(): React.ReactElement {
  const [selectedState, setSelectedState] = useState<"" | CoastalStateKey>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{lat: string, lng: string} | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const cities = useMemo(() => {
    if (!selectedState) return [] as string[];
    return coastalStateToCities[selectedState];
  }, [selectedState]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
        setIsFetchingLocation(false);
      },
      (error) => {
        alert('Error fetching location: ' + error.message);
        setIsFetchingLocation(false);
      }
    );
  };

  const backgroundImages = [
    '/incident/ocean-flood.jpg',
    '/incident/kerala-flood.jpg', 
    '/incident/punjab-flood.jpg',
    '/incident/urban-flood-and-relief.jpg',
    '/incident/tsunami-coastal-area.jpg'
  ];

  return (
    <div className={styles.background}>
      <BackgroundSlider images={backgroundImages} interval={5000} />
      <div className={styles.container}>
        <div className={styles.formBox}>
          <form className={`${styles.form} ${styles.active}`} onSubmit={(e) => e.preventDefault()}>
            <h1>Register</h1>
            <div className={styles.row}>
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <div className={styles.row}>
              <input type="tel" placeholder="Mobile Number" pattern="[0-9]{10}" required />
              <select disabled>
                <option>India</option>
              </select>
            </div>
            <div className={styles.row}>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value as CoastalStateKey | "");
                  setSelectedCity("");
                }}
                required
              >
                <option value="">Select Coastal State</option>
                <option value="andhra">Andhra Pradesh</option>
                <option value="tamilnadu">Tamil Nadu</option>
                <option value="kerala">Kerala</option>
                <option value="karnataka">Karnataka</option>
                <option value="goa">Goa</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="gujarat">Gujarat</option>
                <option value="odisha">Odisha</option>
                <option value="westbengal">West Bengal</option>
              </select>
              <select required value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city.toLowerCase()}> {city} </option>
                ))}
              </select>
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="PIN (8 digits)" pattern="\\d{8}" required />
              <input type="text" placeholder="Referred By (Optional)" />
            </div>

            {/* Location Section */}
            <div className={styles.locationSection}>
              <button 
                type="button" 
                onClick={fetchLocation}
                disabled={isFetchingLocation}
                className={styles.fetchLocationBtn}
              >
                {isFetchingLocation ? 'Fetching...' : 'Fetch Coordinates'}
              </button>
              
              {coordinates && (
                <div className={styles.coordinatesDisplay}>
                  <div className={styles.row}>
                    <input 
                      type="text" 
                      value={coordinates.lat} 
                      placeholder="Latitude" 
                      readOnly 
                      className={styles.readOnlyInput}
                      required
                    />
                    <input 
                      type="text" 
                      value={coordinates.lng} 
                      placeholder="Longitude" 
                      readOnly 
                      className={styles.readOnlyInput}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <button type="submit">Register</button>
            <div className={styles.link}>
              <Link href="/login">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


