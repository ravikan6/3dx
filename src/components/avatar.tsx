interface AvatarProps {
  name: string;
}

export function Avatar({ name }: AvatarProps) {
  // Ensure name is not empty
  if (!name) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium">
        ?
      </div>
    );
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // Extract the first two initials

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
      {initials}
    </div>
  );
}
