#!/usr/bin/env node

/**
 * Creates Hedge Payments Product Roadmap in Notion
 * Run: node scripts/create-notion-roadmap.js
 */

const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN || 'ntn_kP36443001250ZD4POrY2x87yql2zwGWY4Zmpihsf3I2nw'
});

// Parent page ID - set this to your Hedge workspace page
const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

// Roadmap data structured for Notion
const roadmapTracks = [
  {
    name: 'Checkout Products',
    emoji: '💳',
    description: 'Core payment acceptance methods powered by Coinflow',
    milestones: [
      {
        name: 'Card Checkout',
        status: 'Active',
        priority: 'P0',
        items: [
          { task: 'Visa/Mastercard/Amex/Discover acceptance', status: 'Done', priority: 'P0' },
          { task: 'Apple Pay integration', status: 'Done', priority: 'P0' },
          { task: 'Google Pay integration', status: 'Done', priority: 'P0' },
          { task: '3D Secure authentication', status: 'Done', priority: 'P1' },
          { task: 'Card tokenization & vaulting', status: 'Done', priority: 'P0' },
        ]
      },
      {
        name: 'ACH Payments',
        status: 'Active',
        priority: 'P0',
        items: [
          { task: 'Plaid bank linking integration', status: 'Done', priority: 'P0' },
          { task: 'Instant bank verification', status: 'Done', priority: 'P1' },
          { task: 'ACH debit (pull)', status: 'Done', priority: 'P0' },
          { task: 'ACH credit (push/payouts)', status: 'In Progress', priority: 'P1' },
          { task: 'Same-day ACH', status: 'Planned', priority: 'P2' },
        ]
      },
      {
        name: 'Crypto Payments',
        status: 'Planned',
        priority: 'P1',
        items: [
          { task: 'USDC on Solana', status: 'Planned', priority: 'P1' },
          { task: 'SOL payments', status: 'Planned', priority: 'P1' },
          { task: 'ETH payments (bridged)', status: 'Planned', priority: 'P2' },
          { task: 'Crypto-to-fiat settlement', status: 'Planned', priority: 'P1' },
          { task: 'Wallet connection (Phantom, etc.)', status: 'Planned', priority: 'P1' },
        ]
      },
      {
        name: 'Subscriptions',
        status: 'Planned',
        priority: 'P1',
        items: [
          { task: 'Subscription plan management', status: 'Planned', priority: 'P1' },
          { task: 'Recurring billing engine', status: 'Planned', priority: 'P1' },
          { task: 'Dunning management', status: 'Planned', priority: 'P2' },
          { task: 'Proration handling', status: 'Planned', priority: 'P2' },
          { task: 'Usage-based billing', status: 'Planned', priority: 'P3' },
        ]
      },
    ]
  },
  {
    name: 'Security & Compliance',
    emoji: '🔒',
    description: 'PCI DSS Level 1 compliance and zero-trust architecture',
    milestones: [
      {
        name: 'Core Security (Months 1-2)',
        status: 'In Progress',
        priority: 'P0',
        items: [
          { task: 'Zero-trust network implementation', status: 'Planned', priority: 'P1' },
          { task: 'HSM integration for cryptographic operations', status: 'Planned', priority: 'P1' },
          { task: 'AES-256 encryption at rest', status: 'Done', priority: 'P0' },
          { task: 'TLS 1.3 encryption in transit', status: 'Done', priority: 'P0' },
          { task: 'Tokenization system for payment data', status: 'Done', priority: 'P0' },
        ]
      },
      {
        name: 'Compliance Framework (Months 3-4)',
        status: 'Planned',
        priority: 'P0',
        items: [
          { task: 'PCI DSS gap analysis', status: 'Planned', priority: 'P0' },
          { task: 'KYC/AML system (Persona/Jumio)', status: 'Planned', priority: 'P1' },
          { task: 'OFAC sanctions screening', status: 'Planned', priority: 'P0' },
          { task: 'State MTL applications', status: 'Planned', priority: 'P1' },
          { task: 'Audit trail immutable ledger', status: 'Planned', priority: 'P1' },
        ]
      },
      {
        name: 'Threat Detection (Months 5-6)',
        status: 'Planned',
        priority: 'P1',
        items: [
          { task: 'Real-time fraud detection ML', status: 'Planned', priority: 'P0' },
          { task: 'Sentinel security agent', status: 'Planned', priority: 'P1' },
          { task: '24/7 monitoring dashboard', status: 'Planned', priority: 'P1' },
          { task: 'Incident response playbooks', status: 'Planned', priority: 'P2' },
        ]
      },
    ]
  },
  {
    name: 'AI Intelligence',
    emoji: '🤖',
    description: 'Autonomous payment optimization and security',
    milestones: [
      {
        name: 'Core Agents (Months 7-8)',
        status: 'Planned',
        priority: 'P1',
        items: [
          { task: 'Sentinel Agent - security monitoring', status: 'Planned', priority: 'P0' },
          { task: 'SmartRouter Agent - payment routing', status: 'Planned', priority: 'P0' },
          { task: 'Compliance Agent - KYC/AML automation', status: 'Planned', priority: 'P1' },
          { task: 'Analytics Genius - predictive insights', status: 'Planned', priority: 'P1' },
        ]
      },
      {
        name: 'Optimization (Months 9-10)',
        status: 'Planned',
        priority: 'P1',
        items: [
          { task: 'Multi-armed bandit routing', status: 'Planned', priority: 'P1' },
          { task: 'Cost optimization (15-20% savings)', status: 'Planned', priority: 'P0' },
          { task: 'Predictive fraud models (99.5%)', status: 'Planned', priority: 'P0' },
        ]
      },
      {
        name: 'User-Facing AI (Months 11-12)',
        status: 'Planned',
        priority: 'P2',
        items: [
          { task: 'Natural language payments', status: 'Planned', priority: 'P1' },
          { task: 'Integration assistant', status: 'Planned', priority: 'P1' },
          { task: 'MCP tools for Claude/ChatGPT', status: 'Planned', priority: 'P1' },
        ]
      },
    ]
  },
  {
    name: 'Developer Experience',
    emoji: '👨‍💻',
    description: 'Best-in-class API and documentation',
    milestones: [
      {
        name: 'Core APIs (Months 1-2)',
        status: 'In Progress',
        priority: 'P0',
        items: [
          { task: 'RESTful API design', status: 'Done', priority: 'P0' },
          { task: 'OpenAPI specification', status: 'Done', priority: 'P0' },
          { task: 'Webhook system', status: 'Done', priority: 'P0' },
          { task: 'Rate limiting', status: 'Done', priority: 'P1' },
        ]
      },
      {
        name: 'SDKs & Tools (Months 3-4)',
        status: 'In Progress',
        priority: 'P0',
        items: [
          { task: 'React SDK (@hedgepayments/react)', status: 'Done', priority: 'P0' },
          { task: 'JavaScript SDK', status: 'Done', priority: 'P0' },
          { task: 'Python SDK', status: 'Planned', priority: 'P1' },
          { task: 'Low-code checkout widget', status: 'In Progress', priority: 'P1' },
        ]
      },
      {
        name: 'Documentation (Months 5-6)',
        status: 'In Progress',
        priority: 'P1',
        items: [
          { task: 'Interactive API docs', status: 'Done', priority: 'P0' },
          { task: 'Integration guides', status: 'Done', priority: 'P1' },
          { task: 'Test cards & sandbox docs', status: 'Done', priority: 'P1' },
          { task: 'Video tutorials', status: 'Planned', priority: 'P2' },
        ]
      },
    ]
  },
  {
    name: 'Platform Operations',
    emoji: '⚙️',
    description: '99.99% uptime with auto-scaling',
    milestones: [
      {
        name: 'Infrastructure (Months 1-2)',
        status: 'In Progress',
        priority: 'P0',
        items: [
          { task: 'Supabase PostgreSQL', status: 'Done', priority: 'P0' },
          { task: 'Vercel edge deployment', status: 'Done', priority: 'P0' },
          { task: 'Multi-region setup', status: 'Planned', priority: 'P1' },
        ]
      },
      {
        name: 'Monitoring (Months 3-4)',
        status: 'Planned',
        priority: 'P1',
        items: [
          { task: 'Custom metrics dashboard', status: 'In Progress', priority: 'P1' },
          { task: 'Alert system (<5min response)', status: 'Planned', priority: 'P0' },
          { task: 'Log aggregation', status: 'Planned', priority: 'P1' },
        ]
      },
    ]
  },
];

// Status to Notion color mapping
const statusColors = {
  'Done': 'green',
  'In Progress': 'blue',
  'Planned': 'gray',
  'Blocked': 'red',
};

const priorityColors = {
  'P0': 'red',
  'P1': 'orange',
  'P2': 'yellow',
  'P3': 'gray',
};

async function createRoadmapDatabase(parentPageId) {
  console.log('Creating Hedge Payments Roadmap database...');

  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Hedge Payments Roadmap' } }],
    icon: { type: 'emoji', emoji: '🚀' },
    properties: {
      'Task': { title: {} },
      'Track': {
        select: {
          options: roadmapTracks.map(t => ({ name: t.name, color: 'default' }))
        }
      },
      'Milestone': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'Done', color: 'green' },
            { name: 'In Progress', color: 'blue' },
            { name: 'Planned', color: 'gray' },
            { name: 'Blocked', color: 'red' },
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'P0', color: 'red' },
            { name: 'P1', color: 'orange' },
            { name: 'P2', color: 'yellow' },
            { name: 'P3', color: 'gray' },
          ]
        }
      },
      'Due Date': { date: {} },
      'Assignee': { people: {} },
    }
  });

  console.log(`✅ Created database: ${database.id}`);
  return database.id;
}

async function populateRoadmap(databaseId) {
  console.log('Populating roadmap items...');

  let itemCount = 0;

  for (const track of roadmapTracks) {
    for (const milestone of track.milestones) {
      for (const item of milestone.items) {
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            'Task': { title: [{ text: { content: item.task } }] },
            'Track': { select: { name: track.name } },
            'Milestone': { rich_text: [{ text: { content: milestone.name } }] },
            'Status': { select: { name: item.status } },
            'Priority': { select: { name: item.priority } },
          }
        });

        itemCount++;
        process.stdout.write(`\r  Added ${itemCount} items...`);

        // Rate limit: 3 requests per second max
        await new Promise(r => setTimeout(r, 350));
      }
    }
  }

  console.log(`\n✅ Added ${itemCount} roadmap items`);
}

async function createOverviewPage(parentPageId) {
  console.log('Creating roadmap overview page...');

  const blocks = [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ type: 'text', text: { content: '🚀 Hedge Payments Product Roadmap' } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: 'Payment infrastructure powered by Coinflow white-label. Building the next generation of payment acceptance.' } }]
      }
    },
    {
      object: 'block',
      type: 'divider',
      divider: {}
    },
  ];

  // Add track summaries
  for (const track of roadmapTracks) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: `${track.emoji} ${track.name}` } }]
      }
    });
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: track.description } }]
      }
    });

    // Add milestones as toggles
    for (const milestone of track.milestones) {
      const statusEmoji = milestone.status === 'Done' ? '✅' : milestone.status === 'In Progress' ? '🔄' : '📋';
      blocks.push({
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: `${statusEmoji} ${milestone.name}` } }],
          children: milestone.items.map(item => ({
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: [{ type: 'text', text: { content: `[${item.priority}] ${item.task}` } }],
              checked: item.status === 'Done'
            }
          }))
        }
      });
    }

    blocks.push({ object: 'block', type: 'divider', divider: {} });
  }

  const page = await notion.pages.create({
    parent: { page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🗺️' },
    properties: {
      title: [{ type: 'text', text: { content: 'Hedge Payments Roadmap Overview' } }]
    },
    children: blocks.slice(0, 100) // Notion limit
  });

  console.log(`✅ Created overview page: ${page.id}`);
  return page.id;
}

async function main() {
  if (!PARENT_PAGE_ID) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Hedge Payments Notion Roadmap Setup                           ║
╚════════════════════════════════════════════════════════════════╝

To create the roadmap in Notion, you need to:

1. Get the parent page ID where you want the roadmap
   - Open Notion and go to your Hedge workspace
   - Click on the page where you want the roadmap
   - Copy the page ID from the URL (32 character string after the page name)

2. Run this script with the page ID:

   NOTION_PARENT_PAGE_ID=your_page_id node scripts/create-notion-roadmap.js

Or set it in your .env file:

   NOTION_PARENT_PAGE_ID=your_page_id

The script will create:
  📊 A Roadmap database with all tasks
  📋 An overview page with track summaries
`);
    return;
  }

  try {
    console.log('\n🚀 Creating Hedge Payments Roadmap in Notion...\n');

    // Create overview page first
    const overviewPageId = await createOverviewPage(PARENT_PAGE_ID);

    // Create and populate database
    const databaseId = await createRoadmapDatabase(PARENT_PAGE_ID);
    await populateRoadmap(databaseId);

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ Hedge Payments Roadmap Created Successfully!               ║
╚════════════════════════════════════════════════════════════════╝

📋 Overview Page: https://notion.so/${overviewPageId.replace(/-/g, '')}
📊 Database: https://notion.so/${databaseId.replace(/-/g, '')}

The roadmap includes:
  💳 Checkout Products (Card, ACH, Crypto, Subscriptions)
  🔒 Security & Compliance
  🤖 AI Intelligence
  👨‍💻 Developer Experience
  ⚙️ Platform Operations
`);

  } catch (error) {
    console.error('Error creating roadmap:', error.message);
    if (error.code === 'unauthorized') {
      console.log('\n⚠️  Make sure your Notion token has access to the workspace.');
    }
  }
}

main();
