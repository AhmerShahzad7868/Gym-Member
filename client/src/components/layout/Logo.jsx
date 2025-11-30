import React from 'react';
// 1. Import the image file from your assets folder
// Adjust the path '../assets/gym-logo.png' to match exactly where your file is
import logoImage from "../../assets/logo.png";

function Logo() {
  return (
    // 2. Return the image tag
    <img 
      src={logoImage} 
      alt="Gym Logo" 
      className="w-8 h-8 mr-3 " 
    />
  );
}

export default Logo;