import { cn } from '@/lib/utils';

export default function Panel({ children, className = '', as: Tag = 'section' }) {
  return (
    <Tag className={cn('rounded-md border border-border/80 bg-card p-6 md:p-8', className)}>
      {children}
    </Tag>
  );
}