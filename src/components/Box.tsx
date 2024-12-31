import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Box({ className, ...props }: BoxProps) {
  return (
    <div
      className={cn(
        "relative w-6 h-6 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/90 before:to-white/40 before:rounded-lg before:transform before:rotate-3 before:transition-transform before:duration-300 before:hover:rotate-6",
        "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/90 after:to-white/40 after:rounded-lg after:transform after:-rotate-3 after:transition-transform after:duration-300 after:hover:-rotate-6",
        className
      )}
      {...props}
    />
  );
}

