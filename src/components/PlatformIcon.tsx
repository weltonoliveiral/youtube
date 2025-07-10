interface PlatformIconProps {
  platform: "tiktok" | "youtube" | "kwai" | "facebook";
  size?: "sm" | "md" | "lg";
}

export function PlatformIcon({ platform, size = "md" }: PlatformIconProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const platformConfig = {
    tiktok: {
      color: "text-black",
      bgColor: "bg-black",
      name: "TikTok",
    },
    youtube: {
      color: "text-red-600",
      bgColor: "bg-red-600",
      name: "YouTube",
    },
    kwai: {
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      name: "Kwai",
    },
    facebook: {
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      name: "Facebook",
    },
  };

  const config = platformConfig[platform];

  return (
    <div className={`${config.bgColor} ${sizeClasses[size]} rounded-lg flex items-center justify-center text-white font-bold text-xs`}>
      {platform === "tiktok" && (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )}
      {platform === "youtube" && (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )}
      {platform === "kwai" && (
        <div className="font-bold text-xs">K</div>
      )}
      {platform === "facebook" && (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )}
    </div>
  );
}
