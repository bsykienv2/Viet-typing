import React from 'react';

interface AvatarProps {
  avatar: string;
  className?: string;
  imgClassName?: string;
  fallback?: string;
}

export default function Avatar({ avatar, className = "", imgClassName = "", fallback = "👤" }: AvatarProps) {
  const isUrl = avatar?.startsWith('http') || avatar?.startsWith('/') || avatar?.includes('googleusercontent.com');
  if (isUrl) {
    return (
      <img
        src={avatar}
        alt="Avatar"
        className={`rounded-full object-cover shrink-0 ${imgClassName}`}
        referrerPolicy="no-referrer"
      />
    );
  }
  return <span className={`shrink-0 select-none ${className}`}>{avatar || fallback}</span>;
}
