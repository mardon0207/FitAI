import React from 'react';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { Button } from '@/design/primitives';

interface ErrorStateProps {
  icon?: string;
  title?: string;
  message: string;
  onRetry?: () => void;
  dark?: boolean;
}

export function ErrorState({ icon = 'warning', title = 'Xato yuz berdi', message, onRetry, dark }: ErrorStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
      color: dark ? '#fff' : FIT.text,
      flex: 1,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 32,
        background: dark ? `${FIT.danger}33` : `${FIT.danger}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20
      }}>
        <Icon name={icon as any} size={32} color={FIT.danger} />
      </div>
      
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: FIT.textMuted, maxWidth: 280, marginBottom: 24, lineHeight: 1.4 }}>
        {message}
      </div>
      
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry} style={{ minWidth: 140 }}>
          Qayta urinish
        </Button>
      )}
    </div>
  );
}
