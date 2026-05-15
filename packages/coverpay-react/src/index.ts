// CoverPay React SDK
// BNPL Widget for React applications

export { CoverPayProvider, useCoverPayConfig } from './CoverPayProvider';
export type { CoverPayProviderProps, CoverPayConfig } from './CoverPayProvider';

export { useCoverPay } from './useCoverPay';
export type {
  Customer,
  PaymentPlan,
  Provider,
  Session,
  EligibilityResult,
  CheckoutResult,
  CoverPayCheckoutOptions,
  CoverPayStatus,
  UseCoverPayReturn,
} from './useCoverPay';

export { CoverPayButton } from './CoverPayButton';
export type { CoverPayButtonProps } from './CoverPayButton';
