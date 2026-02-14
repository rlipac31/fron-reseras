// components/ui/BookingInput.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const BookingInput = ({ label, error, ...props }: InputProps) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-brand-white text-sm font-medium">{label}</label>
    <input
      {...props}
      className="bg-brand-black border border-brand-gray/20 text-brand-white p-3 rounded-lg 
                 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none 
                 transition-all placeholder:text-brand-gray/40"
    />
    {error && <span className="text-danger text-xs italic">{error}</span>}
  </div>
);

// components/ui/BookingButton.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const BookingButton = ({ children, isLoading, ...props }: ButtonProps) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className="w-full bg-brand-gold text-brand-black font-bold py-4 rounded-xl 
               hover:bg-brand-white transition-colors disabled:opacity-50 
               disabled:cursor-not-allowed uppercase tracking-wider"
  >
    {isLoading ? "Procesando Reserva..." : children}
  </button>
);