import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ModuleWrapperProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  children: ReactNode;
}

export function ModuleWrapper({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  children,
}: ModuleWrapperProps) {
  return (
    <div className="p-6 lg:p-8">
      {/* Module header */}
      <div className="flex items-center gap-4 mb-7">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-xl text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Tool content */}
      {children}
    </div>
  );
}
