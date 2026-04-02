interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export function Button({ children, variant = 'primary', onClick, className = '' }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg transition-all duration-200 font-medium';
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-[#0e7490] shadow-sm',
    secondary: 'bg-white text-foreground border border-border hover:bg-muted'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
