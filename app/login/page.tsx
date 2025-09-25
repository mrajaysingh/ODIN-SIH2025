"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiShuffle } from "react-icons/fi";
import styles from "./login.module.css";
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

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState<"login" | "register" | "forgot">(
    "login"
  );

  // Form data states
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    pin: "",
    referredBy: ""
  });
  const [forgotData, setForgotData] = useState({
    email: ""
  });

  // UI states
  const [selectedState, setSelectedState] = useState<"" | CoastalStateKey>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{lat: string, lng: string} | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [isFetchingIp, setIsFetchingIp] = useState<boolean>(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const generateRandomUsername = (): string => {
    const adjectives = [
      'brave','calm','eager','frosty','gentle','happy','jolly','kind','lucky','mighty',
      'nifty','quick','royal','sunny','witty','zesty','bright','clever','delta','ember'
    ];
    const nouns = [
      'ocean','wave','coral','seashell','harbor','mariner','compass','anchor','tide',
      'seagull','dolphin','lighthouse','reef','current','storm','sailor','voyager','beacon'
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${adj}${noun}${num}`;
  };
  
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

  const backgroundVideos = [
    '/login-bg/2.mp4',
    '/login-bg/3.mp4',
    '/login-bg/4.mp4',
    '/login-bg/5.mp4',
    '/login-bg/6.mp4',
    '/login-bg/7.mp4'
  ];

  useEffect(() => {
    let cancelled = false;
    const fetchIp = async () => {
      try {
        setIsFetchingIp(true);
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        if (!cancelled) setIpAddress(data?.ip || "");
      } catch {
        if (!cancelled) setIpAddress("");
      } finally {
        if (!cancelled) setIsFetchingIp(false);
      }
    };
    fetchIp();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const handler = setTimeout(async () => {
      const trimmed = registerData.username.trim();
      if (!trimmed) {
        setIsUsernameAvailable(null);
        return;
      }
      try {
        setIsCheckingUsername(true);
        const res = await fetch(`/api/username-available?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (!cancelled) setIsUsernameAvailable(Boolean(data?.available));
      } catch {
        if (!cancelled) setIsUsernameAvailable(null);
      } finally {
        if (!cancelled) setIsCheckingUsername(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(handler); };
  }, [registerData.username]);

  // Simplified authentication functions (bypass real auth for demo)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Demo login logic - bypass real authentication
    if (loginData.email === "user" && loginData.password === "user") {
      setSuccess("Login successful! Redirecting to User Dashboard...");
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 1000);
    } else if (loginData.email === "authority" && loginData.password === "authority") {
      setSuccess("Login successful! Redirecting to Authorities Dashboard...");
      setTimeout(() => {
        router.push('/dashboard/authorities');
      }, 1000);
    } else {
      setError("Invalid credentials. Use 'user/user' or 'authority/authority' for demo.");
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Demo registration - just show success and redirect to login
    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => {
      setActiveForm("login");
      setLoginData({ email: registerData.email, password: "" });
    }, 1500);
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Demo password reset - just show success message
    setSuccess("Password reset successful! Use 'user/user' or 'authority/authority' for demo login.");
    
    setIsLoading(false);
  };

  // Clear messages when switching forms
  const switchForm = (form: "login" | "register" | "forgot") => {
    setActiveForm(form);
    setError("");
    setSuccess("");
  };

  return (
    <div className={styles.background}>
      <BackgroundSlider videos={backgroundVideos} interval={12000} fadeMs={2000} muted loop />
      <div className={styles.container}>
        <div className={styles.formBox}>
          {/* Error and Success Messages */}
          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ 
              background: '#dcfce7', 
              color: '#16a34a', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {success}
            </div>
          )}

          {activeForm === "login" && (
            <form className={`${styles.form} ${styles.active}`} onSubmit={handleLogin}>
              <h1>Login</h1>
              <div style={{ 
                background: '#f0f9ff', 
                border: '1px solid #0ea5e9', 
                borderRadius: '8px', 
                padding: '12px', 
                marginBottom: '16px',
                fontSize: '14px',
                color: 'black'
              }}>
                <strong>Demo Credentials:</strong><br/>
                • User Dashboard: <code>user</code> / <code>user</code><br/>
                • Authorities Dashboard: <code>authority</code> / <code>authority</code>
              </div>
              <input 
                type="text" 
                placeholder="Username (use 'user' or 'authority')" 
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required 
              />
              <input 
                type="password" 
                placeholder="Password (use 'user' or 'authority')" 
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required 
              />
              <input
                type="text"
                placeholder={isFetchingIp ? "Fetching IP..." : "IP Address"}
                value={ipAddress}
                readOnly
                className={styles.readOnlyInput}
              />
              
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

              <div className={styles.row}>
                <button 
                  type="submit" 
                  className={styles.btnLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" className={styles.googleBtn} onClick={() => {}}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" />
                  <span>Google</span>
                </button>
              </div>
              <div className={styles.link}>
                <a href="#" onClick={(e) => { e.preventDefault(); switchForm("register"); }}>Register</a>
                {" "}|{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); switchForm("forgot"); }}>Forgot Password ?</a>
              </div>
            </form>
          )}

          {activeForm === "register" && (
            <form className={`${styles.form} ${styles.active}`} onSubmit={handleRegister}>
              <h1>Register</h1>
              <div className={styles.row}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    required
                    style={{ width: '100%', paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const u = generateRandomUsername();
                      setRegisterData({...registerData, username: u});
                      setIsUsernameAvailable(null);
                    }}
                    aria-label="Generate username"
                    title="Generate username"
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 28,
                      height: 28,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <FiShuffle size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                  {isCheckingUsername && <span style={{ fontSize: 12 }}>Checking...</span>}
                  {!isCheckingUsername && isUsernameAvailable === true && (
                    <span aria-label="available" title="Available" style={{ color: 'green' }}>✓</span>
                  )}
                  {!isCheckingUsername && isUsernameAvailable === false && (
                    <span aria-label="unavailable" title="Unavailable" style={{ color: 'red' }}>✕</span>
                  )}
                </div>
              </div>
              <div className={styles.row}>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                  required 
                />
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required 
              />
              <input
                type="text"
                placeholder={isFetchingIp ? "Fetching IP..." : "IP Address"}
                value={ipAddress}
                readOnly
                className={styles.readOnlyInput}
              />
              <div className={styles.row}>
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  pattern="[0-9]{10}" 
                  value={registerData.mobile}
                  onChange={(e) => setRegisterData({...registerData, mobile: e.target.value})}
                  required 
                />
                <select disabled>
                  <option>India</option>
                </select>
              </div>
              <div className={styles.row}>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as CoastalStateKey | "")}
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
                <select
                  required
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city.toLowerCase()}> {city} </option>
                  ))}
                </select>
              </div>
              <div className={styles.row}>
                <input 
                  type="text" 
                  placeholder="PIN (8 digits)" 
                  pattern="\\d{8}" 
                  value={registerData.pin}
                  onChange={(e) => setRegisterData({...registerData, pin: e.target.value})}
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Referred By (Optional)" 
                  value={registerData.referredBy}
                  onChange={(e) => setRegisterData({...registerData, referredBy: e.target.value})}
                />
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

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
              <div className={styles.link}>
                <a href="#" onClick={(e) => { e.preventDefault(); switchForm("login"); }}>Already have an account?</a>
              </div>
            </form>
          )}

          {activeForm === "forgot" && (
            <form className={`${styles.form} ${styles.active}`} onSubmit={handleForgotPassword}>
              <h1>Forgot Password</h1>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={forgotData.email}
                onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                required 
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              <div className={styles.link}>
                <a href="#" onClick={(e) => { e.preventDefault(); switchForm("login"); }}>Back to Login</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


