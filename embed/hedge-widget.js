/**
 * HedgePayments Low-Code Widget
 * Embeddable payment widget for easy integration
 *
 * Usage:
 * <script src="https://js.hedgepayments.com/v1/hedge-widget.js"></script>
 * <div id="hedge-checkout"></div>
 * <script>
 *   HedgeWidget.createCheckout({
 *     apiKey: 'YOUR_API_KEY',
 *     amount: 50.00,
 *     onSuccess: (payment) => console.log('Payment:', payment)
 *   }).mount('#hedge-checkout');
 * </script>
 */

(function(window) {
  'use strict';

  // Widget styles
  const WIDGET_STYLES = `
    .hedge-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 450px;
      margin: 0 auto;
    }
    .hedge-widget * {
      box-sizing: border-box;
    }
    .hedge-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .hedge-header {
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .hedge-logo {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .hedge-amount {
      font-size: 28px;
      font-weight: bold;
      margin: 8px 0;
    }
    .hedge-body {
      padding: 24px;
    }
    .hedge-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .hedge-method {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }
    .hedge-method:hover {
      border-color: #10b981;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .hedge-method.selected {
      border-color: #10b981;
      background: #f0fdf4;
    }
    .hedge-method-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }
    .hedge-method-label {
      font-size: 12px;
      color: #6b7280;
    }
    .hedge-form-group {
      margin-bottom: 20px;
    }
    .hedge-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
    }
    .hedge-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    .hedge-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    .hedge-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .hedge-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .hedge-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .hedge-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid white;
      border-radius: 50%;
      border-top-color: transparent;
      animation: hedge-spin 0.6s linear infinite;
      margin-right: 8px;
    }
    @keyframes hedge-spin {
      to { transform: rotate(360deg); }
    }
    .hedge-success {
      text-align: center;
      padding: 40px 20px;
    }
    .hedge-success-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    .hedge-success-message {
      font-size: 20px;
      font-weight: 600;
      color: #059669;
      margin-bottom: 8px;
    }
    .hedge-powered {
      text-align: center;
      padding: 16px;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #f3f4f6;
    }
    .hedge-powered a {
      color: #10b981;
      text-decoration: none;
      font-weight: 500;
    }
    .hedge-qr-code {
      text-align: center;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .hedge-qr-placeholder {
      width: 200px;
      height: 200px;
      background: #e5e7eb;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
    }
  `;

  // Payment methods configuration
  const PAYMENT_METHODS = {
    card: { icon: '💳', label: 'Card' },
    bank: { icon: '🏦', label: 'Bank' },
    paypal: { icon: '🅿️', label: 'PayPal' },
    venmo: { icon: '📱', label: 'Venmo' },
    cashapp: { icon: '💵', label: 'Cash App' },
    crypto: { icon: '₿', label: 'Crypto' },
    apple_pay: { icon: '🍎', label: 'Apple Pay' },
    google_pay: { icon: '🔵', label: 'Google Pay' }
  };

  // Main widget class
  class HedgeWidget {
    constructor(options) {
      this.options = {
        apiKey: options.apiKey || '',
        amount: options.amount || 0,
        currency: options.currency || 'USD',
        methods: options.methods || ['card', 'bank', 'paypal'],
        recipientId: options.recipientId || null,
        description: options.description || '',
        metadata: options.metadata || {},
        onSuccess: options.onSuccess || (() => {}),
        onError: options.onError || (() => {}),
        onClose: options.onClose || (() => {}),
        theme: options.theme || 'light',
        sandbox: options.sandbox !== false
      };

      this.selectedMethod = null;
      this.container = null;
      this.state = 'initial';

      this.injectStyles();
    }

    injectStyles() {
      if (!document.getElementById('hedge-widget-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'hedge-widget-styles';
        styleSheet.innerHTML = WIDGET_STYLES;
        document.head.appendChild(styleSheet);
      }
    }

    mount(selector) {
      const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

      if (!element) {
        console.error('HedgeWidget: Mount element not found');
        return this;
      }

      this.container = element;
      this.render();
      return this;
    }

    render() {
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.options.currency
      }).format(this.options.amount);

      if (this.state === 'success') {
        this.container.innerHTML = `
          <div class="hedge-widget">
            <div class="hedge-card">
              <div class="hedge-success">
                <div class="hedge-success-icon">✅</div>
                <div class="hedge-success-message">Payment Successful!</div>
                <div style="color: #6b7280;">Transaction ID: ${this.transactionId}</div>
              </div>
              <div class="hedge-powered">
                Powered by <a href="https://hedgepayments.com" target="_blank">HedgePayments</a> 🦔
              </div>
            </div>
          </div>
        `;
        return;
      }

      this.container.innerHTML = `
        <div class="hedge-widget">
          <div class="hedge-card">
            <div class="hedge-header">
              <div class="hedge-logo">🦔</div>
              <div style="font-size: 14px; opacity: 0.9;">${this.options.description || 'Payment'}</div>
              <div class="hedge-amount">${formattedAmount}</div>
            </div>
            <div class="hedge-body">
              <div class="hedge-form-group">
                <label class="hedge-label">Select Payment Method</label>
                <div class="hedge-methods">
                  ${this.options.methods.map(method => `
                    <div class="hedge-method" data-method="${method}">
                      <div class="hedge-method-icon">${PAYMENT_METHODS[method]?.icon || '💰'}</div>
                      <div class="hedge-method-label">${PAYMENT_METHODS[method]?.label || method}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div id="hedge-payment-form"></div>

              <button class="hedge-btn" id="hedge-pay-btn" disabled>
                Select Payment Method
              </button>
            </div>
            <div class="hedge-powered">
              Secured by <a href="https://hedgepayments.com" target="_blank">HedgePayments</a> 🦔
            </div>
          </div>
        </div>
      `;

      this.attachEventListeners();
    }

    attachEventListeners() {
      // Method selection
      this.container.querySelectorAll('.hedge-method').forEach(el => {
        el.addEventListener('click', (e) => {
          this.selectMethod(e.currentTarget.dataset.method);
        });
      });

      // Pay button
      const payBtn = this.container.querySelector('#hedge-pay-btn');
      if (payBtn) {
        payBtn.addEventListener('click', () => this.processPayment());
      }
    }

    selectMethod(method) {
      // Update UI
      this.container.querySelectorAll('.hedge-method').forEach(el => {
        el.classList.remove('selected');
      });
      this.container.querySelector(`[data-method="${method}"]`).classList.add('selected');

      this.selectedMethod = method;
      this.renderPaymentForm(method);

      // Enable pay button
      const payBtn = this.container.querySelector('#hedge-pay-btn');
      payBtn.disabled = false;
      payBtn.textContent = `Pay with ${PAYMENT_METHODS[method]?.label || method}`;
    }

    renderPaymentForm(method) {
      const formContainer = this.container.querySelector('#hedge-payment-form');

      switch(method) {
        case 'card':
          formContainer.innerHTML = `
            <div class="hedge-form-group">
              <label class="hedge-label">Card Number</label>
              <input type="text" class="hedge-input" placeholder="4242 4242 4242 4242" id="hedge-card-number">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="hedge-form-group">
                <label class="hedge-label">Expiry</label>
                <input type="text" class="hedge-input" placeholder="MM/YY" id="hedge-card-expiry">
              </div>
              <div class="hedge-form-group">
                <label class="hedge-label">CVC</label>
                <input type="text" class="hedge-input" placeholder="123" id="hedge-card-cvc">
              </div>
            </div>
          `;
          break;

        case 'bank':
          formContainer.innerHTML = `
            <div class="hedge-form-group">
              <label class="hedge-label">Account Number</label>
              <input type="text" class="hedge-input" placeholder="Enter account number" id="hedge-account">
            </div>
            <div class="hedge-form-group">
              <label class="hedge-label">Routing Number</label>
              <input type="text" class="hedge-input" placeholder="Enter routing number" id="hedge-routing">
            </div>
          `;
          break;

        case 'paypal':
        case 'venmo':
        case 'cashapp':
          formContainer.innerHTML = `
            <div class="hedge-form-group">
              <label class="hedge-label">Email or Username</label>
              <input type="text" class="hedge-input" placeholder="Enter your ${PAYMENT_METHODS[method].label} account" id="hedge-wallet-account">
            </div>
          `;
          break;

        case 'crypto':
          formContainer.innerHTML = `
            <div class="hedge-form-group">
              <label class="hedge-label">Select Cryptocurrency</label>
              <select class="hedge-input" id="hedge-crypto-type">
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="usdc">USD Coin (USDC)</option>
                <option value="usdt">Tether (USDT)</option>
              </select>
            </div>
            <div class="hedge-qr-code">
              <div class="hedge-qr-placeholder">QR Code</div>
              <div style="color: #6b7280; font-size: 14px;">Scan to pay with crypto</div>
            </div>
          `;
          break;

        case 'apple_pay':
        case 'google_pay':
          formContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <div style="font-size: 48px; margin-bottom: 16px;">
                ${PAYMENT_METHODS[method].icon}
              </div>
              <p style="color: #6b7280;">Click pay to launch ${PAYMENT_METHODS[method].label}</p>
            </div>
          `;
          break;

        default:
          formContainer.innerHTML = '';
      }
    }

    async processPayment() {
      const payBtn = this.container.querySelector('#hedge-pay-btn');
      const originalText = payBtn.textContent;

      // Show loading state
      payBtn.disabled = true;
      payBtn.innerHTML = '<span class="hedge-spinner"></span>Processing...';

      try {
        // Simulate API call (replace with actual API integration)
        const response = await this.mockPaymentAPI({
          amount: this.options.amount,
          currency: this.options.currency,
          method: this.selectedMethod,
          apiKey: this.options.apiKey,
          metadata: this.options.metadata
        });

        // Success
        this.transactionId = response.transactionId;
        this.state = 'success';
        this.render();
        this.options.onSuccess(response);

      } catch (error) {
        // Error
        payBtn.disabled = false;
        payBtn.textContent = originalText;
        this.options.onError(error);
        alert('Payment failed. Please try again.');
      }
    }

    // Mock API call (replace with actual API integration)
    mockPaymentAPI(params) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve({
              transactionId: 'tx_' + Math.random().toString(36).substr(2, 9),
              amount: params.amount,
              currency: params.currency,
              status: 'completed'
            });
          } else {
            reject(new Error('Payment failed'));
          }
        }, 2000);
      });
    }
  }

  // Static methods for quick integration
  HedgeWidget.createCheckout = function(options) {
    return new HedgeWidget(options);
  };

  HedgeWidget.createPaymentLink = function(options) {
    const params = new URLSearchParams({
      amount: options.amount,
      currency: options.currency || 'USD',
      description: options.description || '',
      recipientId: options.recipientId || ''
    });
    return `https://pay.hedgepayments.com/?${params.toString()}`;
  };

  // Expose to global scope
  window.HedgeWidget = HedgeWidget;
  window.HedgePayments = window.HedgePayments || {};
  window.HedgePayments.Widget = HedgeWidget;

})(window);