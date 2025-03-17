
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface ConversionAnimationProps {
  isActive: boolean;
  className?: string;
}

const ConversionAnimation: FC<ConversionAnimationProps> = ({ 
  isActive, 
  className 
}) => {
  if (!isActive) return null;
  
  return (
    <div 
      className={cn(
        "absolute inset-0 z-10 rainbow-gradient animate-rainbow-flow rounded-lg pointer-events-none",
        "backdrop-blur-xs animate-pulse-soft opacity-70",
        className
      )}
    />
  );
};

export default ConversionAnimation;
