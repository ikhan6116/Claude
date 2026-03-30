import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  debtAmount: string;
  debtType: string;
  state: string;
  message?: string;
}

interface LeadFormProps {
  variant?: 'full' | 'compact' | 'inline';
  source?: string;
  heading?: string;
  subheading?: string;
  className?: string;
}

const DEBT_RANGES = [
  'Less than $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'More than $100,000',
];

const DEBT_TYPES = [
  'Credit Card Debt',
  'Medical Debt',
  'Personal Loans',
  'Student Loans',
  'Tax Debt',
  'Multiple Types',
  'Other',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

export default function LeadForm({
  variant = 'full',
  source = 'website',
  heading = 'Get Your Free Debt Consultation',
  subheading = 'Fill out the form below and a debt specialist will contact you within 24 hours.',
  className = '',
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>();

  const onSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source, submittedAt: new Date().toISOString() }),
      });

      if (!response.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`bg-accent-500 text-white rounded-xl p-8 text-center ${className}`}>
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-lg">
          A debt relief specialist will contact you within 24 hours.
          Check your email and phone for next steps.
        </p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-primary-50 border border-primary-200 rounded-xl p-6 my-8 ${className}`}>
        <h3 className="text-lg font-bold text-primary-800 mb-2">
          Ready to Take the First Step?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Get a free, no-obligation debt analysis from a certified specialist.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            {...register('firstName', { required: true })}
            placeholder="First Name"
            className="input-field text-sm"
          />
          <input
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
            placeholder="Email Address"
            className="input-field text-sm"
            type="email"
          />
          <input
            {...register('phone', { required: true })}
            placeholder="Phone Number"
            className="input-field text-sm"
            type="tel"
          />
          <select {...register('debtAmount', { required: true })} className="input-field text-sm">
            <option value="">Debt Amount</option>
            {DEBT_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="sm:col-span-2">
            <button type="submit" disabled={submitting} className="btn-accent w-full text-sm">
              {submitting ? 'Submitting...' : 'Get My Free Quote'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm sm:col-span-2">{error}</p>}
        </form>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{heading}</h3>
        <p className="text-sm text-gray-500 mb-4">{subheading}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input {...register('firstName', { required: true })} placeholder="First Name" className="input-field text-sm" />
            <input {...register('lastName', { required: true })} placeholder="Last Name" className="input-field text-sm" />
          </div>
          <input {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} placeholder="Email" className="input-field text-sm" type="email" />
          <input {...register('phone', { required: true })} placeholder="Phone" className="input-field text-sm" type="tel" />
          <select {...register('debtAmount', { required: true })} className="input-field text-sm">
            <option value="">How much do you owe?</option>
            {DEBT_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Get Free Consultation'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {Object.keys(errors).length > 0 && (
            <p className="text-red-600 text-sm">Please fill in all required fields.</p>
          )}
        </form>
        <p className="text-xs text-gray-400 mt-3 text-center">
          No credit check required. 100% free & confidential.
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white rounded-xl shadow-xl p-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{heading}</h2>
      <p className="text-gray-500 mb-6">{subheading}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input {...register('firstName', { required: true })} className="input-field" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input {...register('lastName', { required: true })} className="input-field" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">Required</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
            type="email"
            className="input-field"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            {...register('phone', { required: true })}
            type="tel"
            className="input-field"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Debt Amount *</label>
            <select {...register('debtAmount', { required: true })} className="input-field">
              <option value="">Select amount</option>
              {DEBT_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.debtAmount && <p className="text-red-500 text-xs mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Debt *</label>
            <select {...register('debtType', { required: true })} className="input-field">
              <option value="">Select type</option>
              {DEBT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.debtType && <p className="text-red-500 text-xs mt-1">Required</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <select {...register('state', { required: true })} className="input-field">
            <option value="">Select state</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
          <textarea
            {...register('message')}
            rows={3}
            className="input-field"
            placeholder="Tell us about your situation..."
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full text-lg">
          {submitting ? 'Submitting Your Information...' : 'Get My Free Debt Analysis'}
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Your information is secure and encrypted. No credit check required.
        We will never sell your personal information.
      </p>
    </div>
  );
}
