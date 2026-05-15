/**
 * CoverPay BNPL Widget
 * Embeddable widget for BNPL checkout orchestration
 *
 * Usage:
 * <script src="https://js.hedgepayments.com/coverpay/v1.js"></script>
 * <div id="coverpay-checkout"></div>
 * <script>
 *   CoverPay.init({
 *     publishableKey: 'pk_test_xxx',
 *     amount: 249.99,
 *     orderId: 'order_123',
 *     customer: { email: 'customer@example.com' },
 *     onSuccess: (result) => console.log('Approved!', result),
 *     onDeclined: (reason) => console.log('Declined', reason),
 *     onError: (error) => console.log('Error', error)
 *   });
 *   CoverPay.mount('#coverpay-checkout');
 * </script>
 */

(function(window) {
  'use strict';

  const API_BASE = 'https://api.hedgepayments.com';
  // const API_BASE = 'http://localhost:3000/api'; // For local development

  // Widget styles
  const WIDGET_STYLES = `
    .coverpay-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 500px;
      margin: 0 auto;
    }
    .coverpay-widget * {
      box-sizing: border-box;
    }
    .coverpay-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .coverpay-header {
      background: linear-gradient(135deg, #3EB489 0%, #2E8B6D 100%);
      color: white;
      padding: 24px;
      text-align: center;
    }
    .coverpay-logo {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }
    .coverpay-amount {
      font-size: 32px;
      font-weight: 700;
      margin: 8px 0;
    }
    .coverpay-body {
      padding: 24px;
    }
    .coverpay-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      text-align: center;
    }
    .coverpay-providers {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .coverpay-provider {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }
    .coverpay-provider:hover {
      border-color: #3EB489;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(62, 180, 137, 0.15);
    }
    .coverpay-provider.selected {
      border-color: #3EB489;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }
    .coverpay-provider.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .coverpay-provider-logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .coverpay-provider-info {
      flex: 1;
    }
    .coverpay-provider-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 15px;
    }
    .coverpay-provider-plan {
      font-size: 13px;
      color: #6b7280;
      margin-top: 2px;
    }
    .coverpay-provider-radio {
      width: 22px;
      height: 22px;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .coverpay-provider.selected .coverpay-provider-radio {
      border-color: #3EB489;
      background: #3EB489;
    }
    .coverpay-provider.selected .coverpay-provider-radio::after {
      content: '';
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
    }
    .coverpay-plans {
      margin-top: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      display: none;
    }
    .coverpay-provider.selected .coverpay-plans {
      display: block;
    }
    .coverpay-plan {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      margin: 4px 0;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .coverpay-plan:hover {
      background: #e5e7eb;
    }
    .coverpay-plan.selected {
      background: #dcfce7;
    }
    .coverpay-plan-radio {
      width: 16px;
      height: 16px;
      border: 2px solid #9ca3af;
      border-radius: 50%;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .coverpay-plan.selected .coverpay-plan-radio {
      border-color: #3EB489;
      background: #3EB489;
      box-shadow: inset 0 0 0 3px white;
    }
    .coverpay-plan-name {
      font-size: 14px;
      color: #374151;
      flex: 1;
    }
    .coverpay-plan-amount {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
    .coverpay-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #3EB489 0%, #2E8B6D 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 20px;
    }
    .coverpay-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(62, 180, 137, 0.35);
    }
    .coverpay-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .coverpay-spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: coverpay-spin 0.8s linear infinite;
      margin-right: 10px;
      vertical-align: middle;
    }
    @keyframes coverpay-spin {
      to { transform: rotate(360deg); }
    }
    .coverpay-footer {
      text-align: center;
      padding: 16px 24px;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #f3f4f6;
    }
    .coverpay-footer a {
      color: #3EB489;
      text-decoration: none;
      font-weight: 500;
    }
    .coverpay-loading {
      text-align: center;
      padding: 60px 24px;
    }
    .coverpay-loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-radius: 50%;
      border-top-color: #3EB489;
      animation: coverpay-spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    .coverpay-loading-text {
      color: #6b7280;
      font-size: 14px;
    }
    .coverpay-error {
      text-align: center;
      padding: 40px 24px;
      color: #ef4444;
    }
    .coverpay-error-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .coverpay-error-text {
      font-size: 14px;
    }
    .coverpay-success {
      text-align: center;
      padding: 40px 24px;
    }
    .coverpay-success-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    .coverpay-success-title {
      font-size: 20px;
      font-weight: 600;
      color: #059669;
      margin-bottom: 8px;
    }
    .coverpay-success-text {
      color: #6b7280;
      font-size: 14px;
    }
    .coverpay-no-providers {
      text-align: center;
      padding: 40px 24px;
      color: #6b7280;
    }
  `;

  // Provider colors
  const PROVIDER_COLORS = {
    klarna: '#FFB3C7',
    affirm: '#0FA0EA',
    afterpay: '#B2FCE4',
    sezzle: '#382757',
    zip: '#AA8FFF',
    paypal: '#003087',
  };

  // Main CoverPay class
  class CoverPayWidget {
    constructor(options) {
      this.options = {
        publishableKey: options.publishableKey || '',
        amount: options.amount || 0,
        currency: options.currency || 'USD',
        orderId: options.orderId || null,
        customer: options.customer || {},
        successUrl: options.successUrl || window.location.href,
        cancelUrl: options.cancelUrl || window.location.href,
        metadata: options.metadata || {},
        onSuccess: options.onSuccess || (() => {}),
        onDeclined: options.onDeclined || (() => {}),
        onError: options.onError || (() => {}),
        onCancel: options.onCancel || (() => {}),
        theme: options.theme || 'light',
      };

      this.session = null;
      this.eligibility = null;
      this.selectedProvider = null;
      this.selectedPlan = null;
      this.container = null;
      this.state = 'initial'; // initial, loading, ready, processing, success, error

      this.injectStyles();
    }

    injectStyles() {
      if (!document.getElementById('coverpay-widget-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'coverpay-widget-styles';
        styleSheet.innerHTML = WIDGET_STYLES;
        document.head.appendChild(styleSheet);
      }
    }

    mount(selector) {
      const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

      if (!element) {
        console.error('CoverPay: Mount element not found');
        return this;
      }

      this.container = element;
      this.render();
      this.initialize();
      return this;
    }

    async initialize() {
      this.state = 'loading';
      this.render();

      try {
        // Create session
        const sessionResponse = await this.createSession();
        if (!sessionResponse.success) {
          throw new Error(sessionResponse.error || 'Failed to create session');
        }
        this.session = sessionResponse.session;

        // Check eligibility
        const eligibilityResponse = await this.checkEligibility();
        if (!eligibilityResponse.success) {
          throw new Error(eligibilityResponse.error || 'Failed to check eligibility');
        }
        this.eligibility = eligibilityResponse.eligibility;

        if (this.eligibility.providers.length === 0) {
          this.state = 'no_providers';
        } else {
          this.state = 'ready';
          // Auto-select first provider and first plan
          this.selectedProvider = this.eligibility.providers[0];
          if (this.selectedProvider.plans.length > 0) {
            this.selectedPlan = this.selectedProvider.plans[0];
          }
        }
      } catch (error) {
        this.state = 'error';
        this.errorMessage = error.message;
        this.options.onError(error);
      }

      this.render();
    }

    async createSession() {
      const response = await fetch(`${API_BASE}/coverpay/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishableKey: this.options.publishableKey,
          amount: this.options.amount,
          currency: this.options.currency,
          orderId: this.options.orderId,
          customer: this.options.customer,
          successUrl: this.options.successUrl,
          cancelUrl: this.options.cancelUrl,
          metadata: this.options.metadata,
        }),
      });
      return response.json();
    }

    async checkEligibility() {
      const response = await fetch(`${API_BASE}/coverpay/sessions/${this.session.token}/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    }

    async selectProvider() {
      const response = await fetch(`${API_BASE}/coverpay/sessions/${this.session.token}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: this.selectedProvider.id,
          planId: this.selectedPlan?.id,
        }),
      });
      return response.json();
    }

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.options.currency,
      }).format(amount);
    }

    render() {
      if (!this.container) return;

      switch (this.state) {
        case 'loading':
          this.renderLoading();
          break;
        case 'ready':
          this.renderProviders();
          break;
        case 'processing':
          this.renderProcessing();
          break;
        case 'success':
          this.renderSuccess();
          break;
        case 'no_providers':
          this.renderNoProviders();
          break;
        case 'error':
          this.renderError();
          break;
        default:
          this.renderLoading();
      }
    }

    renderLoading() {
      this.container.innerHTML = `
        <div class="coverpay-widget">
          <div class="coverpay-card">
            <div class="coverpay-header">
              <div class="coverpay-logo">CoverPay</div>
              <div class="coverpay-amount">${this.formatCurrency(this.options.amount)}</div>
            </div>
            <div class="coverpay-loading">
              <div class="coverpay-loading-spinner"></div>
              <div class="coverpay-loading-text">Finding payment options...</div>
            </div>
            <div class="coverpay-footer">
              Powered by <a href="https://hedgepayments.com" target="_blank">Hedge Payments</a>
            </div>
          </div>
        </div>
      `;
    }

    renderProviders() {
      const providers = this.eligibility.providers;

      this.container.innerHTML = `
        <div class="coverpay-widget">
          <div class="coverpay-card">
            <div class="coverpay-header">
              <div class="coverpay-logo">CoverPay</div>
              <div class="coverpay-amount">${this.formatCurrency(this.options.amount)}</div>
            </div>
            <div class="coverpay-body">
              <div class="coverpay-title">Choose how to pay</div>
              <div class="coverpay-providers">
                ${providers.map(provider => this.renderProvider(provider)).join('')}
              </div>
              <button class="coverpay-btn" id="coverpay-continue-btn">
                Continue with ${this.selectedProvider?.name || 'Pay Later'}
              </button>
            </div>
            <div class="coverpay-footer">
              Powered by <a href="https://hedgepayments.com" target="_blank">Hedge Payments</a>
            </div>
          </div>
        </div>
      `;

      this.attachEventListeners();
    }

    renderProvider(provider) {
      const isSelected = this.selectedProvider?.id === provider.id;
      const color = PROVIDER_COLORS[provider.id] || '#6b7280';

      return `
        <div class="coverpay-provider ${isSelected ? 'selected' : ''}" data-provider-id="${provider.id}">
          <div class="coverpay-provider-logo" style="background: ${color}30; color: ${color};">
            ${provider.name.charAt(0)}
          </div>
          <div class="coverpay-provider-info">
            <div class="coverpay-provider-name">${provider.name}</div>
            <div class="coverpay-provider-plan">
              ${provider.plans.length > 0
                ? `${provider.plans[0].installments} payments of ${this.formatCurrency(provider.plans[0].amount)}`
                : 'Pay later'
              }
            </div>
          </div>
          <div class="coverpay-provider-radio"></div>
          ${provider.plans.length > 1 ? this.renderPlans(provider) : ''}
        </div>
      `;
    }

    renderPlans(provider) {
      const isSelected = this.selectedProvider?.id === provider.id;

      return `
        <div class="coverpay-plans" style="${isSelected ? 'display: block;' : ''}">
          ${provider.plans.map(plan => {
            const isPlanSelected = this.selectedPlan?.id === plan.id;
            return `
              <div class="coverpay-plan ${isPlanSelected ? 'selected' : ''}" data-plan-id="${plan.id}">
                <div class="coverpay-plan-radio"></div>
                <div class="coverpay-plan-name">${plan.name}</div>
                <div class="coverpay-plan-amount">${this.formatCurrency(plan.amount)}/mo${plan.apr > 0 ? ` (${plan.apr}% APR)` : ''}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    renderProcessing() {
      this.container.innerHTML = `
        <div class="coverpay-widget">
          <div class="coverpay-card">
            <div class="coverpay-header">
              <div class="coverpay-logo">CoverPay</div>
              <div class="coverpay-amount">${this.formatCurrency(this.options.amount)}</div>
            </div>
            <div class="coverpay-loading">
              <div class="coverpay-loading-spinner"></div>
              <div class="coverpay-loading-text">Connecting to ${this.selectedProvider?.name}...</div>
            </div>
            <div class="coverpay-footer">
              Powered by <a href="https://hedgepayments.com" target="_blank">Hedge Payments</a>
            </div>
          </div>
        </div>
      `;
    }

    renderSuccess() {
      this.container.innerHTML = `
        <div class="coverpay-widget">
          <div class="coverpay-card">
            <div class="coverpay-success">
              <div class="coverpay-success-icon">✅</div>
              <div class="coverpay-success-title">Payment Approved!</div>
              <div class="coverpay-success-text">
                Your order has been approved by ${this.selectedProvider?.name}.
              </div>
            </div>
            <div class="coverpay-footer">
              Powered by <a href="https://hedgepayments.com" target="_blank">Hedge Payments</a>
            </div>
          </div>
        </div>
      `;
    }

    renderNoProviders() {
      this.container.innerHTML = `
        <div class="coverpay-widget">
          <div class="coverpay-card">
            <div class="coverpay-header">
              <div class="coverpay-logo">CoverPay</div>
              <div class="coverpay-amount">${this.formatCurrency(this.options.amount)}</div>
            </div>
            <div class="coverpay-no-providers">
              <p>Sorry, no pay-later options are available for this order.</p>
              <p style="margin-top: 8px; font-size: 13px;">
                ${this.eligibility?.declined?.length > 0
                  ? `Reason: ${this.eligibility.declined[0].reason}`
                  : 'Please try a different payment method.'
                }
              </p>
            </div>
            <div class="coverpay-footer">
              Powered by <a href="https://hedgepayments.com" target="_blank">Hedge Payments</a>
            </div>
          </div>
        </div>
      `;

      this.options.onDeclined(this.eligibility?.declined || []);
    }

    renderError() {
      this.container.innerHTML = `
        <div class="coverpay-widget">
          <div class="coverpay-card">
            <div class="coverpay-error">
              <div class="coverpay-error-icon">⚠️</div>
              <div class="coverpay-error-text">${this.errorMessage || 'An error occurred. Please try again.'}</div>
            </div>
            <div class="coverpay-footer">
              Powered by <a href="https://hedgepayments.com" target="_blank">Hedge Payments</a>
            </div>
          </div>
        </div>
      `;
    }

    attachEventListeners() {
      // Provider selection
      this.container.querySelectorAll('.coverpay-provider').forEach(el => {
        el.addEventListener('click', (e) => {
          const providerId = e.currentTarget.dataset.providerId;
          const provider = this.eligibility.providers.find(p => p.id === providerId);
          if (provider) {
            this.selectedProvider = provider;
            if (provider.plans.length > 0) {
              this.selectedPlan = provider.plans[0];
            }
            this.render();
          }
        });
      });

      // Plan selection
      this.container.querySelectorAll('.coverpay-plan').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const planId = e.currentTarget.dataset.planId;
          const plan = this.selectedProvider?.plans.find(p => p.id === planId);
          if (plan) {
            this.selectedPlan = plan;
            this.render();
          }
        });
      });

      // Continue button
      const continueBtn = this.container.querySelector('#coverpay-continue-btn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => this.handleContinue());
      }
    }

    async handleContinue() {
      if (!this.selectedProvider) return;

      this.state = 'processing';
      this.render();

      try {
        const response = await this.selectProvider();

        if (response.success && response.checkout?.checkoutUrl) {
          // Redirect to provider checkout
          window.location.href = response.checkout.checkoutUrl;
        } else if (response.tryNext) {
          // Try next provider in waterfall
          const currentIndex = this.eligibility.providers.findIndex(p => p.id === this.selectedProvider.id);
          const nextProvider = this.eligibility.providers[currentIndex + 1];

          if (nextProvider) {
            this.selectedProvider = nextProvider;
            if (nextProvider.plans.length > 0) {
              this.selectedPlan = nextProvider.plans[0];
            }
            this.state = 'ready';
            this.render();
            // Automatically try next provider
            setTimeout(() => this.handleContinue(), 500);
          } else {
            // All providers exhausted
            this.state = 'no_providers';
            this.render();
            this.options.onDeclined([{ id: this.selectedProvider.id, reason: response.error }]);
          }
        } else {
          throw new Error(response.error || 'Failed to create checkout');
        }
      } catch (error) {
        this.state = 'error';
        this.errorMessage = error.message;
        this.render();
        this.options.onError(error);
      }
    }

    // Called when user returns from provider
    handleReturn(status, data = {}) {
      if (status === 'success') {
        this.state = 'success';
        this.render();
        this.options.onSuccess({
          provider: this.selectedProvider?.id,
          providerName: this.selectedProvider?.name,
          transactionId: data.transactionId,
          orderId: this.session?.orderId,
        });
      } else if (status === 'cancelled') {
        this.state = 'ready';
        this.render();
        this.options.onCancel();
      } else {
        this.state = 'error';
        this.errorMessage = data.error || 'Payment failed';
        this.render();
        this.options.onError(new Error(this.errorMessage));
      }
    }
  }

  // Static initialization method
  CoverPayWidget.init = function(options) {
    return new CoverPayWidget(options);
  };

  // Expose to global scope
  window.CoverPay = CoverPayWidget;
  window.CoverPayWidget = CoverPayWidget;

})(window);
