"use client";

import Image from "next/image";

const DEFAULT_AVATAR = "/assets/Images/personal-info-profile.png";

interface ProfileAvatarProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function getProfileAvatarSrc(profilePicture?: string) {
  return profilePicture || DEFAULT_AVATAR;
}

export default function ProfileAvatar({
  src,
  alt,
  width,
  height,
  className,
}: ProfileAvatarProps) {
  const avatarSrc = getProfileAvatarSrc(src);

  if (avatarSrc.startsWith("data:")) {
    return (
      <img
        src={avatarSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={avatarSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
    />
  );
}

export { DEFAULT_AVATAR };
