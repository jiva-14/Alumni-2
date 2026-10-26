import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/ui';

/** Lightweight toast notifications:  const toast = useToast();  toast.success('Saved') */
const ToastContext = createContext({ success: () => {}, error: () => {}, info: () => {} });

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = useCallback((type, message) => {
    const id = ++seq.current;
    setItems((l) => [...l.slice(-3), { id, type, message }]);
    setTimeout(() => dismiss(id), type === 'error' ? 6000 : 3800);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (m) => push('success', m), error: (m) => push('error', m), info: (m) => push('info', m),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" role="region" aria-label="Notifications">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role={t.type === 'error' ? 'alert' : 'status'}>
            <span className="toast__icon"><Icon name={t.type === 'error' ? 'close' : t.type === 'info' ? 'sparkle' : 'check'} size={16} /></span>
            <span className="toast__msg">{t.message}</span>
            <button className="toast__x" onClick={() => dismiss(t.id)} aria-label="Dismiss notification"><Icon name="close" size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
