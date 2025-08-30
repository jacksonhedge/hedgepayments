/**
 * Validation utilities
 */
import { HedgeValidationError } from '../errors';

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new HedgeValidationError('Invalid email address');
  }
}

export function validateAmount(amount: number): void {
  if (typeof amount !== 'number' || amount <= 0) {
    throw new HedgeValidationError('Amount must be a positive number');
  }
  if (!Number.isFinite(amount)) {
    throw new HedgeValidationError('Amount must be a finite number');
  }
}

export function validateCurrency(currency: string): void {
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  if (!supportedCurrencies.includes(currency.toUpperCase())) {
    throw new HedgeValidationError(`Unsupported currency: ${currency}`);
  }
}

export function validateRequired<T>(value: T, fieldName: string): T {
  if (value === null || value === undefined || value === '') {
    throw new HedgeValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateUUID(value: string, fieldName: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    throw new HedgeValidationError(`${fieldName} must be a valid UUID`);
  }
}

export function validateMinLength(value: string, minLength: number, fieldName: string): void {
  if (value.length < minLength) {
    throw new HedgeValidationError(`${fieldName} must be at least ${minLength} characters long`);
  }
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): void {
  if (value.length > maxLength) {
    throw new HedgeValidationError(`${fieldName} must be no more than ${maxLength} characters long`);
  }
}