const ICONS = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  info: "fa-circle-info",
};

export default function ToastHost({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-item--${toast.type}`}
          role="status"
        >
          <i
            className={`fa-solid ${ICONS[toast.type] || ICONS.info}`}
            aria-hidden="true"
          />
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast-item__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
