interface AvatarProps {
    name: string;
  }
  
  export function Avatar({ name }: AvatarProps) {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
        {initials}
      </div>
    );
  }
  
  