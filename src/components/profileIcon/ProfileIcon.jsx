import React from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { getImageUrl } from '../share/imageUrl';

const ProfileIcon = ({ 
  image, 
  size = 40, 
  className = '',
  showBorder = false,
  borderColor = 'border-gray-200',
  hoverEffect = false
}) => {
  // Default styles
  const containerClasses = `${className} ${showBorder ? `border-2 ${borderColor}` : ''} ${hoverEffect ? 'group-hover:border-blue-400 transition-colors duration-200' : ''}`;
  
  // If image exists, display it
  if (image) {
    return (
      <Image
        src={getImageUrl(image)}
        height={size}
        width={size}
        alt="Profile"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`rounded-full object-cover ${containerClasses}`}
      />
    );
  }
  
  // If no image, display the default icon
  return (
    <FaUserCircle
      size={size}
      className={`text-gray-600 ${hoverEffect ? 'group-hover:text-blue-600 transition-colors duration-200' : ''}`}
    />
  );
};

export default ProfileIcon;