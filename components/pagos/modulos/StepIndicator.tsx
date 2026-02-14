type Step = 'BOOKING' | 'PAYMENT' | 'SUCCESS';

export const StepIndicator = ({ step }: { step: Step }) => (
  <div className="flex items-center space-x-4 mb-8">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step === 'BOOKING' ? 'bg-brand-gold text-brand-black' : 'bg-brand-black text-brand-gold'}`}>1</div>
    <div className="h-px w-12 bg-brand-gray"></div>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step === 'PAYMENT' ? 'bg-brand-gold text-brand-black' : (step === 'SUCCESS' ? 'bg-brand-black text-brand-gold' : 'bg-brand-gray text-gray-400')}`}>2</div>
  </div>
);