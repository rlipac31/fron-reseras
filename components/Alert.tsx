interface AlertProps {
  message: string;
  onClose: () => void;
}

export const ErrorAlert = ({ message, onClose }: AlertProps) => (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="bg-red-100 border-l-4 border-red-700 border-brand-accent p-4 shadow-2xl flex items-center gap-3 min-w-[300px] rounded-r-lg">
      <div className="bg-brand-accent/20 p-2 rounded-full">
        <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">Error al Iniciar Session</p>
        <p className="text-sm text-red-600 text-[12px] font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="text-red-800 hover:text-red-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  </div>
);