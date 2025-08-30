# Hedge SDK API Reference

## Table of Contents

- [Core SDK](#core-sdk)
  - [HedgeSDK](#hedgesdk)
  - [Users API](#users-api)
  - [Accounts API](#accounts-api)
  - [Roundups API](#roundups-api)
  - [Transfers API](#transfers-api)
- [React SDK](#react-sdk)
  - [Hooks](#hooks)
  - [Components](#components)
- [Types](#types)
- [Errors](#errors)

## Core SDK

### HedgeSDK

The main SDK class that provides access to all API methods.

```typescript
class HedgeSDK extends EventEmitter {
  constructor(config: HedgeSDKConfig)
  
  // API instances
  readonly users: UsersApi
  readonly accounts: AccountsApi
  readonly roundups: RoundupsApi
  readonly transfers: TransfersApi
  
  // Connection methods
  connectWebSocket(): void
  disconnectWebSocket(): void
  subscribeToEvents(eventTypes: string[]): void
  unsubscribeFromEvents(eventTypes: string[]): void
  getWebSocketState(): string
  
  // Interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): number
  addResponseInterceptor(interceptor: ResponseInterceptor): number
  removeRequestInterceptor(id: number): void
  removeResponseInterceptor(id: number): void
  
  // Configuration
  updateConfig(config: Partial<HedgeSDKConfig>): void
  getConfig(): HedgeConfig
  
  // Utilities
  ping(): Promise<{ success: boolean; timestamp: string; latency: number }>
  getHealth(): Promise<{ status: string; timestamp: string; services: Record<string, string> }>
  destroy(): void
}
```

### Users API

Manage user accounts and information.

#### `users.create(request: CreateUserRequest): Promise<User>`

Create a new user account.

```typescript
const user = await sdk.users.create({
  email: 'user@example.com',
  partnerId: 'your-partner-id',
  metadata: {
    customerId: '12345',
    source: 'mobile-app'
  }
});
```

#### `users.get(userId: string): Promise<User>`

Get user by ID.

```typescript
const user = await sdk.users.get('user-id');
```

#### `users.getCurrent(): Promise<User>`

Get current user (from API key context).

```typescript
const user = await sdk.users.getCurrent();
```

#### `users.update(userId: string, request: UpdateUserRequest): Promise<User>`

Update user information.

```typescript
const user = await sdk.users.update('user-id', {
  metadata: { lastLogin: new Date().toISOString() }
});
```

#### `users.delete(userId: string): Promise<void>`

Delete a user account.

```typescript
await sdk.users.delete('user-id');
```

#### `users.list(params?: PaginationParams): Promise<{ users: User[]; meta: PaginationMeta }>`

List users with pagination (partner admin only).

```typescript
const { users, meta } = await sdk.users.list({ page: 1, limit: 20 });
```

#### `users.search(email: string): Promise<User[]>`

Search users by email.

```typescript
const users = await sdk.users.search('user@example.com');
```

#### `users.getStats(userId: string): Promise<UserStats>`

Get user statistics.

```typescript
const stats = await sdk.users.getStats('user-id');
console.log('Total roundups:', stats.totalRoundups);
console.log('Total saved:', stats.totalRoundupAmount);
```

### Accounts API

Manage bank account connections and settings.

#### `accounts.getLinkToken(userId: string): Promise<LinkToken>`

Get a link token for the account connection flow.

```typescript
const { linkToken, expiration } = await sdk.accounts.getLinkToken('user-id');
// Use linkToken with Plaid Link or similar OAuth flow
```

#### `accounts.connect(request: ConnectAccountRequest): Promise<BankAccount[]>`

Connect a new bank account after OAuth completion.

```typescript
const accounts = await sdk.accounts.connect({
  userId: 'user-id',
  institutionId: 'ins_1',
  publicToken: 'public-token-from-oauth'
});
```

#### `accounts.get(accountId: string): Promise<BankAccount>`

Get account details by ID.

```typescript
const account = await sdk.accounts.get('account-id');
console.log('Balance:', account.balance);
console.log('Institution:', account.institutionName);
```

#### `accounts.list(userId: string, params?: PaginationParams): Promise<{ accounts: BankAccount[]; meta: PaginationMeta }>`

List accounts for a user.

```typescript
const { accounts, meta } = await sdk.accounts.list('user-id');
```

#### `accounts.update(accountId: string, request: UpdateAccountRequest): Promise<BankAccount>`

Update account settings.

```typescript
const account = await sdk.accounts.update('account-id', {
  accountName: 'My Checking Account',
  isRoundupsEnabled: true
});
```

#### `accounts.disconnect(accountId: string): Promise<void>`

Disconnect/remove an account.

```typescript
await sdk.accounts.disconnect('account-id');
```

#### `accounts.refresh(accountId: string): Promise<BankAccount>`

Refresh account balance and information.

```typescript
const account = await sdk.accounts.refresh('account-id');
```

#### `accounts.enableRoundups(accountId: string): Promise<BankAccount>`

Enable roundups for an account.

```typescript
const account = await sdk.accounts.enableRoundups('account-id');
```

#### `accounts.disableRoundups(accountId: string): Promise<BankAccount>`

Disable roundups for an account.

```typescript
const account = await sdk.accounts.disableRoundups('account-id');
```

#### `accounts.getTransactions(accountId: string, params?: TransactionParams): Promise<TransactionResponse>`

Get account transactions with filtering.

```typescript
const { transactions, meta } = await sdk.accounts.getTransactions('account-id', {
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  category: 'food_and_drink'
});
```

### Roundups API

Manage roundup settings and processing.

#### `roundups.getSettings(userId: string): Promise<RoundupSettings>`

Get roundup settings for a user.

```typescript
const settings = await sdk.roundups.getSettings('user-id');
```

#### `roundups.createSettings(request: CreateRoundupSettingsRequest): Promise<RoundupSettings>`

Create initial roundup settings.

```typescript
const settings = await sdk.roundups.createSettings({
  userId: 'user-id',
  isEnabled: true,
  roundupRule: 'nearest_dollar',
  minimumPurchase: 1.00,
  maximumRoundup: 5.00,
  transferFrequency: 'weekly'
});
```

#### `roundups.updateSettings(userId: string, request: UpdateRoundupSettingsRequest): Promise<RoundupSettings>`

Update roundup settings.

```typescript
const settings = await sdk.roundups.updateSettings('user-id', {
  roundupRule: 'custom',
  customAmount: 0.50,
  excludedCategories: ['gas_stations']
});
```

#### `roundups.enable(userId: string): Promise<RoundupSettings>`

Enable roundups for a user.

```typescript
const settings = await sdk.roundups.enable('user-id');
```

#### `roundups.disable(userId: string): Promise<RoundupSettings>`

Disable roundups for a user.

```typescript
const settings = await sdk.roundups.disable('user-id');
```

#### `roundups.get(roundupId: string): Promise<Roundup>`

Get a specific roundup by ID.

```typescript
const roundup = await sdk.roundups.get('roundup-id');
```

#### `roundups.list(userId: string, params?: RoundupListParams): Promise<RoundupListResponse>`

List roundups for a user with filtering.

```typescript
const { roundups, meta } = await sdk.roundups.list('user-id', {
  status: 'pending',
  startDate: '2023-01-01',
  endDate: '2023-12-31'
});
```

#### `roundups.processPending(userId: string): Promise<ProcessingResult>`

Process all pending roundups for a user.

```typescript
const result = await sdk.roundups.processPending('user-id');
console.log('Processed:', result.processedCount);
console.log('Total amount:', result.totalAmount);
```

#### `roundups.getStats(userId: string, params?: StatsParams): Promise<RoundupStats>`

Get roundup statistics.

```typescript
const stats = await sdk.roundups.getStats('user-id', {
  startDate: '2023-01-01',
  endDate: '2023-12-31'
});
```

#### `roundups.simulate(userId: string, transactions: SimulatedTransaction[]): Promise<SimulationResult>`

Simulate roundups for hypothetical transactions.

```typescript
const simulation = await sdk.roundups.simulate('user-id', [
  { amount: 4.35, description: 'Coffee' },
  { amount: 12.67, description: 'Lunch' }
]);
console.log('Total roundups:', simulation.totalRoundupAmount);
```

### Transfers API

Manage roundup transfers and payments.

#### `transfers.create(request: CreateTransferRequest): Promise<Transfer>`

Create a new transfer.

```typescript
const transfer = await sdk.transfers.create({
  userId: 'user-id',
  sourceAccountId: 'account-id',
  amount: 25.00,
  type: 'roundup',
  description: 'Weekly roundup transfer'
});
```

#### `transfers.get(transferId: string): Promise<Transfer>`

Get transfer details by ID.

```typescript
const transfer = await sdk.transfers.get('transfer-id');
console.log('Status:', transfer.status);
console.log('Amount:', transfer.amount);
```

#### `transfers.list(userId: string, params?: TransferListParams): Promise<TransferListResponse>`

List transfers for a user.

```typescript
const { transfers, meta } = await sdk.transfers.list('user-id', {
  status: 'completed',
  type: 'roundup'
});
```

#### `transfers.cancel(transferId: string): Promise<Transfer>`

Cancel a pending transfer.

```typescript
const transfer = await sdk.transfers.cancel('transfer-id');
```

#### `transfers.retry(transferId: string): Promise<Transfer>`

Retry a failed transfer.

```typescript
const transfer = await sdk.transfers.retry('transfer-id');
```

#### `transfers.getStatus(transferId: string): Promise<{ transfer: Transfer; statusHistory: StatusHistory[] }>`

Get detailed transfer status with history.

```typescript
const { transfer, statusHistory } = await sdk.transfers.getStatus('transfer-id');
```

#### `transfers.getSummary(userId: string, params?: SummaryParams): Promise<TransferSummary>`

Get transfer summary for reporting.

```typescript
const summary = await sdk.transfers.getSummary('user-id', {
  startDate: '2023-01-01',
  endDate: '2023-12-31'
});
```

#### `transfers.getStats(userId: string, params?: StatsParams): Promise<TransferStats>`

Get detailed transfer statistics.

```typescript
const stats = await sdk.transfers.getStats('user-id');
console.log('Success rate:', stats.successRate);
```

#### `transfers.estimate(request: EstimateRequest): Promise<TransferEstimate>`

Estimate transfer fees and timing.

```typescript
const estimate = await sdk.transfers.estimate({
  sourceAccountId: 'account-id',
  amount: 10.00
});
console.log('Processing time:', estimate.estimatedProcessingTime);
console.log('Fees:', estimate.fees);
```

## React SDK

### Hooks

#### `useHedge()`

Get access to the main SDK instance and connection state.

```typescript
function useHedge(): {
  sdk: HedgeSDK | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  webSocketState: string;
  connect: () => void;
  disconnect: () => void;
}
```

#### `useUser(userId?: string)`

Manage user data and operations.

```typescript
function useUser(userId?: string): {
  user: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: (id?: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  createUser: (request: CreateUserRequest) => Promise<User>;
  updateUser: (id: string, request: UpdateUserRequest) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getStats: (id: string) => Promise<UserStats>;
  refresh: () => Promise<void>;
}
```

#### `useCurrentUser()`

Get the current authenticated user.

```typescript
function useCurrentUser(): {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
```

#### `useAccounts(userId: string)`

Manage user's bank accounts.

```typescript
function useAccounts(userId: string): {
  accounts: BankAccount[];
  loading: boolean;
  error: Error | null;
  meta: PaginationMeta | null;
  fetchAccounts: (page?: number, limit?: number) => Promise<void>;
  getLinkToken: () => Promise<LinkToken>;
  connectAccount: (request: ConnectAccountRequest) => Promise<BankAccount[]>;
  updateAccount: (accountId: string, request: UpdateAccountRequest) => Promise<BankAccount>;
  disconnectAccount: (accountId: string) => Promise<void>;
  refreshAccount: (accountId: string) => Promise<BankAccount>;
  enableRoundups: (accountId: string) => Promise<BankAccount>;
  disableRoundups: (accountId: string) => Promise<BankAccount>;
  refresh: () => Promise<void>;
}
```

#### `useRoundups(userId: string)`

Manage user's roundups.

```typescript
function useRoundups(userId: string): {
  roundups: Roundup[];
  loading: boolean;
  error: Error | null;
  meta: PaginationMeta | null;
  fetchRoundups: (params?: RoundupListParams) => Promise<void>;
  processPending: () => Promise<ProcessingResult>;
  getStats: (params?: StatsParams) => Promise<RoundupStats>;
  simulate: (transactions: SimulatedTransaction[]) => Promise<SimulationResult>;
  refresh: () => Promise<void>;
}
```

#### `useRoundupSettings(userId: string)`

Manage roundup settings.

```typescript
function useRoundupSettings(userId: string): {
  settings: RoundupSettings | null;
  loading: boolean;
  error: Error | null;
  fetchSettings: () => Promise<void>;
  createSettings: (request: CreateRoundupSettingsRequest) => Promise<RoundupSettings>;
  updateSettings: (request: UpdateRoundupSettingsRequest) => Promise<RoundupSettings>;
  enable: () => Promise<RoundupSettings>;
  disable: () => Promise<RoundupSettings>;
  refresh: () => Promise<void>;
}
```

#### `useTransfers(userId: string)`

Manage user's transfers.

```typescript
function useTransfers(userId: string): {
  transfers: Transfer[];
  loading: boolean;
  error: Error | null;
  meta: PaginationMeta | null;
  fetchTransfers: (params?: TransferListParams) => Promise<void>;
  createTransfer: (request: CreateTransferRequest) => Promise<Transfer>;
  cancelTransfer: (transferId: string) => Promise<Transfer>;
  retryTransfer: (transferId: string) => Promise<Transfer>;
  getSummary: (params?: SummaryParams) => Promise<TransferSummary>;
  getStats: (params?: StatsParams) => Promise<TransferStats>;
  estimate: (request: EstimateRequest) => Promise<TransferEstimate>;
  refresh: () => Promise<void>;
}
```

#### `useEvents(eventTypes?: string[])`

Listen for real-time events.

```typescript
function useEvents(eventTypes?: string[]): {
  events: HedgeEvent[];
  lastEvent: HedgeEvent | null;
  isSubscribed: boolean;
  subscribeToEvents: (types: string[]) => void;
  unsubscribeFromEvents: (types: string[]) => void;
  clearEvents: () => void;
}
```

### Components

#### `<HedgeProvider>`

Context provider for the SDK.

```typescript
interface HedgeProviderProps extends HedgeSDKConfig {
  children: ReactNode;
  enableAutoConnect?: boolean;
  onEvent?: (event: HedgeEvent) => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}
```

#### `<ConnectionStatus>`

Display WebSocket connection status.

```typescript
interface ConnectionStatusProps {
  showDetails?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
```

#### `<RoundupSettings>`

Complete roundup settings interface.

```typescript
interface RoundupSettingsProps {
  userId: string;
  onSettingsChange?: (settings: RoundupSettings) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark' | 'auto';
}
```

#### `<AccountList>`

Display and manage connected accounts.

```typescript
interface AccountListProps {
  userId: string;
  onAccountSelect?: (account: BankAccount) => void;
  onAccountUpdate?: (account: BankAccount) => void;
  onError?: (error: Error) => void;
  showBalance?: boolean;
  showActions?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark' | 'auto';
}
```

## Types

See the shared package for complete type definitions:

- `User` - User account information
- `BankAccount` - Bank account details
- `Roundup` - Individual roundup record
- `RoundupSettings` - User's roundup configuration
- `Transfer` - Transfer/payment record
- `HedgeEvent` - Real-time event data
- `ApiResponse<T>` - Standard API response wrapper
- `PaginationParams` - Pagination parameters
- `ErrorResponse` - Error response format

## Errors

### Error Classes

- `HedgeError` - Base error class
- `HedgeApiError` - API-related errors
- `HedgeValidationError` - Validation failures
- `HedgeAuthenticationError` - Authentication failures
- `HedgeAuthorizationError` - Permission errors
- `HedgeNotFoundError` - Resource not found
- `HedgeRateLimitError` - Rate limit exceeded
- `HedgeNetworkError` - Network connectivity issues
- `HedgeTimeoutError` - Request timeouts

### Error Properties

```typescript
class HedgeError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: Record<string, any>;
  public readonly requestId?: string;
}
```

### Error Handling

```typescript
try {
  await sdk.users.create(userData);
} catch (error) {
  if (error instanceof HedgeValidationError) {
    // Handle validation errors
    console.log('Validation failed:', error.details);
  } else if (error instanceof HedgeRateLimitError) {
    // Handle rate limiting
    console.log('Retry after:', error.retryAfter);
  } else {
    // Handle other errors
    console.log('Error:', error.code, error.message);
  }
}
```