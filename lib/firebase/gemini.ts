import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the Gemini Pro model for text generation
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Get the Gemini Pro Vision model for image analysis
export const geminiProVision = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

/**
 * Analyze spending patterns and provide insights
 */
export async function analyzeSpendingPatterns(transactions: any[]) {
  const prompt = `
    Analyze these financial transactions and provide insights:
    ${JSON.stringify(transactions)}
    
    Provide:
    1. Spending patterns and trends
    2. Categories where user spends most
    3. Potential savings opportunities
    4. Smart recommendations for round-ups
    
    Format the response as JSON.
  `;

  try {
    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing spending patterns:', error);
    throw error;
  }
}

/**
 * Generate smart betting recommendations based on user behavior
 */
export async function generateBettingRecommendations(
  userProfile: any,
  roundupHistory: any[],
  sportPreferences: string[]
) {
  const prompt = `
    Based on this user's profile and round-up history, suggest smart betting strategies:
    
    User Profile: ${JSON.stringify(userProfile)}
    Round-up History: ${JSON.stringify(roundupHistory)}
    Sport Preferences: ${sportPreferences.join(', ')}
    
    Provide:
    1. Recommended bet types (safe vs aggressive)
    2. Optimal round-up amounts
    3. Best times to place bets
    4. Risk management strategies
    5. Bankroll management tips
    
    Keep recommendations responsible and emphasize entertainment value.
    Format as JSON.
  `;

  try {
    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating betting recommendations:', error);
    throw error;
  }
}

/**
 * Categorize transactions automatically using AI
 */
export async function categorizeTransaction(transaction: {
  amount: number;
  description: string;
  merchantName?: string;
  date: string;
}) {
  const prompt = `
    Categorize this financial transaction:
    
    Amount: $${transaction.amount}
    Description: ${transaction.description}
    Merchant: ${transaction.merchantName || 'Unknown'}
    Date: ${transaction.date}
    
    Return a JSON object with:
    {
      "category": "main category",
      "subcategory": "specific subcategory",
      "isEligibleForRoundup": boolean,
      "confidence": number (0-1),
      "tags": ["relevant", "tags"]
    }
    
    Categories can include: Food & Dining, Shopping, Entertainment, Transportation, Bills & Utilities, etc.
  `;

  try {
    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error categorizing transaction:', error);
    return {
      category: 'Uncategorized',
      subcategory: 'Other',
      isEligibleForRoundup: true,
      confidence: 0,
      tags: []
    };
  }
}

/**
 * Generate personalized financial insights
 */
export async function generateFinancialInsights(
  monthlyData: any,
  goals: string[]
) {
  const prompt = `
    Generate personalized financial insights based on:
    
    Monthly Financial Data: ${JSON.stringify(monthlyData)}
    User Goals: ${goals.join(', ')}
    
    Provide:
    1. Key insights about spending habits
    2. Progress toward goals
    3. Areas for improvement
    4. Actionable recommendations
    5. Motivational message
    
    Make it personal, actionable, and encouraging.
    Format as JSON with sections for each insight type.
  `;

  try {
    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw error;
  }
}

/**
 * Natural language query for financial data
 */
export async function queryFinancialData(
  query: string,
  userData: any
) {
  const prompt = `
    User is asking about their financial data:
    Query: "${query}"
    
    Available Data: ${JSON.stringify(userData)}
    
    Provide a helpful, conversational response that:
    1. Directly answers their question
    2. Includes relevant numbers/data
    3. Offers additional helpful context
    4. Suggests related information they might find useful
    
    Keep the tone friendly and helpful.
  `;

  try {
    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error processing financial query:', error);
    throw error;
  }
}