"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../login/login.module.css";
import BackgroundSlider from "../components/BackgroundSlider";

export default function ForgotPasswordPage(): React.ReactElement {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const backgroundImages = [
    '/incident/ocean-flood.jpg',
    '/incident/kerala-flood.jpg', 
    '/incident/punjab-flood.jpg',
    '/incident/urban-flood-and-relief.jpg',
    '/incident/tsunami-coastal-area.jpg'
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setError('');
    setMessage('');
    setIsLoading(true);
    
    // Simulate email validation (bypass as requested)
    setTimeout(() => {
      setIsLoading(false);
      setStep('password');
      setMessage('Email verified. Please set your new password.');
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Password updated successfully! You can now login with your new password.');
        setNewPassword('');
        setConfirmPassword('');
        // Optionally redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <BackgroundSlider images={backgroundImages} interval={5000} />
      <div className={styles.container}>
        <div className={styles.formBox}>
          {step === 'email' ? (
            <form className={`${styles.form} ${styles.active}`} onSubmit={handleEmailSubmit}>
              <h1>Forgot Password</h1>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Reset Password'}
              </button>
              <div className={styles.link}>
                <Link href="/login">Back to Login</Link>
              </div>
            </form>
          ) : (
            <form className={`${styles.form} ${styles.active}`} onSubmit={handlePasswordSubmit}>
              <h1>Set New Password</h1>
              <input 
                type="email" 
                value={email}
                disabled
                style={{ opacity: 0.6 }}
              />
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
              <div className={styles.link}>
                <button 
                  type="button" 
                  onClick={() => setStep('email')}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                >
                  Back to Email
                </button>
              </div>
            </form>
          )}
          
          {message && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#d1fae5', 
              color: '#065f46', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}
          
          {error && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


