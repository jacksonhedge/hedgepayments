import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './client';
import { categorizeTransaction, analyzeSpendingPatterns } from './gemini';

export interface RoundupSettings {
  userId: string;
  isEnabled: boolean;
  roundupRule: 'nearest_dollar' | 'nearest_five' | 'nearest_ten' | 'custom';
  customAmount?: number;
  minimumPurchase?: number;
  maximumRoundup?: number;
  excludedCategories?: string[];
  excludedMerchants?: string[];
  transferFrequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  destinationAccountId?: string;
  destinationType?: 'savings' | 'investment' | 'betting';
  sportsbookPreference?: 'draftkings' | 'fanduel' | 'betmgm' | 'caesars';
  createdAt?: any;
  updatedAt?: any;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  category?: string;
  subcategory?: string;
  merchantName?: string;
  transactionType: 'purchase' | 'payment' | 'transfer' | 'fee';
  date: Timestamp;
  roundupAmount?: number;
  isRoundupEligible: boolean;
  aiCategorization?: {
    category: string;
    subcategory: string;
    confidence: number;
    tags: string[];
  };
  metadata?: Record<string, any>;
  createdAt?: any;
}

export interface Roundup {
  id: string;
  userId: string;
  accountId: string;
  transactionId: string;
  originalAmount: number;
  roundupAmount: number;
  currency: string;
  status: 'pending' | 'processed' | 'failed' | 'cancelled';
  processedAt?: Timestamp;
  transferId?: string;
  destinationType?: 'savings' | 'investment' | 'betting';
  sportsbookTransferId?: string;
  metadata?: Record<string, any>;
  createdAt?: any;
}

/**
 * Create or update roundup settings
 */
export async function saveRoundupSettings(
  userId: string,
  settings: Partial<RoundupSettings>
): Promise<RoundupSettings> {
  try {
    const docRef = doc(db, 'roundupSettings', userId);
    const data = {
      ...settings,
      userId,
      updatedAt: serverTimestamp()
    };
    
    const existingDoc = await getDoc(docRef);
    if (!existingDoc.exists()) {
      data.createdAt = serverTimestamp();
    }
    
    await setDoc(docRef, data, { merge: true });
    
    return {
      ...data,
      userId
    } as RoundupSettings;
  } catch (error) {
    console.error('Error saving roundup settings:', error);
    throw error;
  }
}

/**
 * Get roundup settings for a user
 */
export async function getRoundupSettings(userId: string): Promise<RoundupSettings | null> {
  try {
    const docRef = doc(db, 'roundupSettings', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return docSnap.data() as RoundupSettings;
  } catch (error) {
    console.error('Error fetching roundup settings:', error);
    throw error;
  }
}

/**
 * Process a transaction and create roundup if eligible
 */
export async function processTransaction(transaction: Omit<Transaction, 'id'>): Promise<{
  transaction: Transaction;
  roundup?: Roundup;
}> {
  try {
    const batch = writeBatch(db);
    
    // Use AI to categorize the transaction
    const aiCategorization = await categorizeTransaction({
      amount: transaction.amount,
      description: transaction.description,
      merchantName: transaction.merchantName,
      date: transaction.date.toDate().toISOString()
    });
    
    // Create transaction with AI categorization
    const transactionId = doc(collection(db, 'transactions')).id;
    const transactionData: Transaction = {
      ...transaction,
      id: transactionId,
      category: aiCategorization.category,
      subcategory: aiCategorization.subcategory,
      aiCategorization,
      isRoundupEligible: aiCategorization.isEligibleForRoundup,
      createdAt: serverTimestamp()
    };
    
    batch.set(doc(db, 'transactions', transactionId), transactionData);
    
    // Check if roundup should be created
    const settings = await getRoundupSettings(transaction.userId);
    
    if (settings?.isEnabled && aiCategorization.isEligibleForRoundup) {
      const roundupAmount = calculateRoundup(transaction.amount, settings);
      
      if (roundupAmount > 0) {
        const roundupId = doc(collection(db, 'roundups')).id;
        const roundupData: Roundup = {
          id: roundupId,
          userId: transaction.userId,
          accountId: transaction.accountId,
          transactionId,
          originalAmount: transaction.amount,
          roundupAmount,
          currency: transaction.currency,
          status: 'pending',
          destinationType: settings.destinationType,
          createdAt: serverTimestamp()
        };
        
        batch.set(doc(db, 'roundups', roundupId), roundupData);
        
        // Update user stats
        batch.update(doc(db, 'userStats', transaction.userId), {
          totalRoundups: increment(1),
          pendingRoundups: increment(1),
          totalRoundupAmount: increment(roundupAmount),
          lastActivity: serverTimestamp()
        });
        
        await batch.commit();
        
        return { transaction: transactionData, roundup: roundupData };
      }
    }
    
    await batch.commit();
    return { transaction: transactionData };
  } catch (error) {
    console.error('Error processing transaction:', error);
    throw error;
  }
}

/**
 * Calculate roundup amount based on settings
 */
function calculateRoundup(amount: number, settings: RoundupSettings): number {
  // Check minimum purchase requirement
  if (settings.minimumPurchase && amount < settings.minimumPurchase) {
    return 0;
  }
  
  let roundupAmount = 0;
  
  switch (settings.roundupRule) {
    case 'nearest_dollar':
      roundupAmount = Math.ceil(amount) - amount;
      break;
    case 'nearest_five':
      roundupAmount = (Math.ceil(amount / 5) * 5) - amount;
      break;
    case 'nearest_ten':
      roundupAmount = (Math.ceil(amount / 10) * 10) - amount;
      break;
    case 'custom':
      roundupAmount = settings.customAmount || 0;
      break;
  }
  
  // Apply maximum roundup limit
  if (settings.maximumRoundup && roundupAmount > settings.maximumRoundup) {
    roundupAmount = settings.maximumRoundup;
  }
  
  return Math.round(roundupAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Get pending roundups for processing
 */
export async function getPendingRoundups(
  userId: string,
  limitCount: number = 100
): Promise<Roundup[]> {
  try {
    const q = query(
      collection(db, 'roundups'),
      where('userId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Roundup));
  } catch (error) {
    console.error('Error fetching pending roundups:', error);
    throw error;
  }
}

/**
 * Process pending roundups (transfer to destination)
 */
export async function processPendingRoundups(userId: string): Promise<{
  processedCount: number;
  totalAmount: number;
  transferIds: string[];
}> {
  try {
    const pendingRoundups = await getPendingRoundups(userId);
    
    if (pendingRoundups.length === 0) {
      return { processedCount: 0, totalAmount: 0, transferIds: [] };
    }
    
    const batch = writeBatch(db);
    const transferIds: string[] = [];
    let totalAmount = 0;
    
    // Group by destination type
    const groupedRoundups = pendingRoundups.reduce((acc, roundup) => {
      const dest = roundup.destinationType || 'savings';
      if (!acc[dest]) acc[dest] = [];
      acc[dest].push(roundup);
      return acc;
    }, {} as Record<string, Roundup[]>);
    
    // Process each group
    for (const [destType, roundups] of Object.entries(groupedRoundups)) {
      const groupTotal = roundups.reduce((sum, r) => sum + r.roundupAmount, 0);
      totalAmount += groupTotal;
      
      // Create transfer record
      const transferId = doc(collection(db, 'transfers')).id;
      transferIds.push(transferId);
      
      batch.set(doc(db, 'transfers', transferId), {
        id: transferId,
        userId,
        amount: groupTotal,
        destinationType: destType,
        roundupIds: roundups.map(r => r.id),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Update roundup statuses
      for (const roundup of roundups) {
        batch.update(doc(db, 'roundups', roundup.id), {
          status: 'processed',
          processedAt: serverTimestamp(),
          transferId
        });
      }
    }
    
    // Update user stats
    batch.update(doc(db, 'userStats', userId), {
      pendingRoundups: increment(-pendingRoundups.length),
      processedRoundups: increment(pendingRoundups.length),
      totalProcessedAmount: increment(totalAmount),
      lastProcessed: serverTimestamp()
    });
    
    await batch.commit();
    
    return {
      processedCount: pendingRoundups.length,
      totalAmount,
      transferIds
    };
  } catch (error) {
    console.error('Error processing pending roundups:', error);
    throw error;
  }
}

/**
 * Get user's roundup statistics with AI insights
 */
export async function getRoundupStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<any> {
  try {
    // Fetch user stats
    const statsDoc = await getDoc(doc(db, 'userStats', userId));
    const baseStats = statsDoc.exists() ? statsDoc.data() : {};
    
    // Fetch recent transactions for AI analysis
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(100)
    );
    
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => doc.data());
    
    // Get AI insights
    const aiInsights = await analyzeSpendingPatterns(transactions);
    
    return {
      ...baseStats,
      aiInsights,
      recommendations: {
        optimalRoundupRule: aiInsights.recommendedRoundupRule,
        savingsPotential: aiInsights.savingsPotential,
        topCategories: aiInsights.topCategories
      }
    };
  } catch (error) {
    console.error('Error fetching roundup stats:', error);
    throw error;
  }
}