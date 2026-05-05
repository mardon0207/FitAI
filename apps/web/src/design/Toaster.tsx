import { motion, AnimatePresence } from 'framer-motion';
import { useUI, ToastType } from '@/stores/ui';
import { FIT } from '@/design/tokens';
import { Icon } from '@/design/primitives';

export function Toaster() {
  const toasts = useUI((s) => s.toasts);

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: 20,
      right: 20,
      zIndex: 20000,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      alignItems: 'center',
    }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ message, type }: { message: string, type: ToastType }) {
  const color = type === 'success' ? FIT.cyan : type === 'error' ? FIT.danger : type === 'warning' ? '#f59e0b' : '#fff';
  const icon = type === 'success' ? 'check' : type === 'error' ? 'alert' : type === 'warning' ? 'alert' : 'info';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${color}33`,
        padding: '12px 20px',
        borderRadius: 16,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 10px ${color}22`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 400,
        width: '100%',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ 
        width: 32, height: 32, borderRadius: 16, background: `${color}15`, 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        <Icon name={icon as any} size={18} color={color} />
      </div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
        {message}
      </div>
    </motion.div>
  );
}
