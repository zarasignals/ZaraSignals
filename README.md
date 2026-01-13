# 📚 POLYNIKI AI - Complete Documentation

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Chat Terminal with POLYNIKI AI](#chat-terminal-with-POLYNIKI AI)
4. [Telegram Bot](#telegram-bot)
5. [Automated Twitter](#automated-twitter)
6. [Channel Monitor (GemTools)](#channel-monitor-gemtools)
7. [Multiplier Alerts](#multiplier-alerts)
8. [Polymarket Tracking](#polymarket-tracking)
9. [Real-Time WebSocket](#real-time-websocket)
10. [Frontend - Web Interface](#frontend---web-interface)
11. [Scheduler (Task Scheduler)](#scheduler-task-scheduler)
12. [Environment Variables Configuration](#environment-variables-configuration)
13. [File Structure](#file-structure)

---

## Introduction

**POLYNIKI AI AI** is a trading intelligence agent that monitors prediction markets (Polymarket) and Solana tokens. It automates signal publishing on Telegram and Twitter, and provides a web interface with interactive chat.

### Main Features

- 🤖 Interactive AI chat (Claude/GPT)
- 📊 Real-time Polymarket monitoring
- 📱 Telegram bot with automatic signals
- 🐦 Automated tweets with images
- 🔄 Signal copying from other channels (GemTools)
- 🚀 Multiplier alerts (x2, x5, x10...)
- ⚡ WebSocket for live updates
- 🎨 Modern web interface with visual effects

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (React + Vite + TailwindCSS)                               │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Terminal │ │ Signals  │ │ Tweets   │ │ Market   │       │
│  │  Chat    │ │  Feed    │ │  Feed    │ │ Overview │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│       └────────────┴─────┬──────┴────────────┘              │
│                          │                                   │
│                    WebSocket + REST API                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                        BACKEND                               │
│  (Node.js + Express)                                         │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  POLYNIKI AI AI    │ │  Telegram   │ │  Twitter    │            │
│  │  (Claude)   │ │    Bot      │ │   Client    │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Polymarket  │ │  Channel    │ │  Scheduler  │            │
│  │  Service    │ │  Monitor    │ │  (Cron)     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  ┌─────────────────────────────────────────────┐            │
│  │              WebSocket Server               │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ Polymarket│ │ Telegram  │ │  Twitter  │ │ Anthropic │   │
│  │    API    │ │    API    │ │    API    │ │    API    │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Chat Terminal with POLYNIKI AI

### Description
Interactive terminal where users can chat with POLYNIKI AI AI to get market analysis, token information, and trading insights.

### File
`backend/src/services/POLYNIKI AI-ai.js`

### Functions

| Function | Description |
|----------|-------------|
| `chat(sessionId, message, marketData)` | Processes user message and generates response |
| `chatWithAnthropic(history, marketData)` | Uses Claude to generate responses |
| `chatWithOpenAI(history, marketData)` | Uses GPT as alternative |
| `getFallbackResponse(message, marketData)` | Pre-programmed responses if no API available |
| `clearSession(sessionId)` | Clears conversation history |

### System Prompt
POLYNIKI AI has a defined personality:
- Professional and direct
- No emojis
- Data-focused
- Always reminds: "NFA" and "DYOR"

### Chat Flow

```
User writes message
        │
        ▼
┌───────────────────┐
│ POST /api/chat    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Get current       │
│ Polymarket data   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Send to Claude    │
│ with context      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Return response   │
│ to frontend       │
└───────────────────┘
```

### Usage Example
```javascript
// Frontend
const response = await api.chat("What's happening with Bitcoin on Polymarket?", sessionId);
```

---

## Telegram Bot

### Description
Bot that publishes automatic signals to a Telegram channel. Sends market movement alerts, periodic summaries, and signals copied from other channels.

### File
`backend/src/services/telegram.js`

### Functions

| Function | Description |
|----------|-------------|
| `initialize(token, channelId)` | Initializes bot with credentials |
| `sendSignal(signal)` | Sends a signal to the channel |
| `sendWithImage(imagePath, message, label)` | Sends message with attached image |
| `formatSignal(signal)` | Formats signal based on its type |
| `storeMessage(signal)` | Stores message in local history |
| `getRecentMessages(limit)` | Gets recent messages |

### Supported Signal Types

#### 1. Polymarket Signal
```
🎯 POLYMARKET SIGNAL

📈 PUMP

📊 Market: Will Bitcoin reach $100K?

💰 Price: 45.2% → 52.1%
📊 Change: +15.26%
📈 24h Volume: $1.5M

🔗 View Market

⏰ 15:30 UTC | @POLYNIKI AISignals
```

#### 2. GemTools Token Call
```
🤖 POLYNIKI AI SIGNAL | New Token Alert

🪙 The Hottest Actress - $SCARLETT
📊 GTscore: 🌑🌑🌑🌑🌑

📋 Contract:
Efs9Ktsi9CCNqVcuT6pdpe9R33B7tjmQPxvVuZVpump

💰 Market Cap: $144K | ⏱️ Age: 0m

👥 Holders: 13
├ Top10: 58.15%
└ Top20: 58.17%

🔍 Analysis:
├ 🐁 Insiders: 29.52%
├ 🎯 Snipers: 1
├ 🫧 Fresh: 10%
└ 💰 Smart Wallets: 0

👨‍💻 Dev Info:
├ Sold: 🔴 | DEX Paid: 🔴
├ Previous Launches: N/A
└ Bonded: N/A

🔗 PumpFun | DexScreener | Solscan

⚡️ Powered by POLYNIKI AI AI
```

#### 3. Multiplier Alert
```
🚀🚀🚀 POLYNIKI AI MULTIPLIER ALERT 🚀🚀🚀

💎 $SCARLETT just did x11!

💵 MC: $144K → $1M5

⚡️ Powered by POLYNIKI AI AI
```

#### 4. Polymarket Summary (every 15 min)
```
🔮 POLYNIKI AI POLYMARKET UPDATE
━━━━━━━━━━━━━━━━━━━━━

📊 Market Overview
├ Active Markets: 100
├ 24h Volume: $15.5M
└ Liquidity: $45.2M

⚡ Biggest Movers (15m)
📈 Will Trump win 2024?...
   45.2% → 52.1% (+15.3%)

🚀 Volume Spikes
• Bitcoin $100K by 2025... +45%

🔥 Hot Markets
1. Will Bitcoin reach $100K?...
   YES: 52.1% | Vol: $1.5M
   📈 Trade

💎 Crypto Price Bets
1. ETH above $5000 by June?...
   YES: 35.2% | Trade

🐋 Whale Moves
🟢 Bitcoin $100K by 2025...
   Betting YES (78%) | $500K
   View Market

⏰ Closing Soon
• Trump wins Iowa... 2d left | YES: 85.2%

━━━━━━━━━━━━━━━━━━━━━
⏰ 15:30 UTC | Update #42
🤖 Powered by POLYNIKI AI AI
```

### Automatic Images

The bot sends images based on signal type:

| Type | Image | Usage |
|------|-------|-------|
| PUMP | `assets/pump.png` | Bullish signals |
| DUMP | `assets/dump.png` | Bearish signals |
| 15-MIN | `assets/15.png` | Every 15-minute summary |

---

## Automated Twitter

### Description
Twitter client that automatically posts tweets about market movements, with attached images.

### File
`backend/src/services/twitter.js`

### Functions

| Function | Description |
|----------|-------------|
| `initialize(credentials)` | Initializes client with API keys |
| `postTweet(content)` | Posts text tweet |
| `postTweetWithImage(content, imagePath)` | Posts tweet with image |
| `postSignalTweet(signal)` | Posts PUMP/DUMP signal |
| `postHourlySummary(polymarketData)` | Posts hourly summary |
| `fetchRealTweets(username, limit)` | Fetches real tweets from an account |
| `storeTweet(content, tweetId)` | Stores tweet in history |

### Tweet Types

#### 1. Signal Tweet (PUMP/DUMP)
```
📈 POLYMARKET PUMP

Will Bitcoin reach $100K by 2025?

45.2% → 52.1% (+15.3%)

Vol: $1.5M

🔗 polymarket.com/event/bitcoin-100k
```
**Attached image:** `pump.png` or `dump.png`

#### 2. Hourly Summary
```
🔮 POLYMARKET HOURLY | 15:00 UTC

📊 Vol: $15.5M
📈 Markets: 100

⚡ Top Mover:
"Will Trump win 2024?..."
45.2% → 52.1% (+15.3%)

🐋 Whale: 🟢 YES on
"Bitcoin $100K by 2025..."

💎 Crypto: "ETH above $5000?..."
YES: 35.2%

@SignalsPOLYNIKI AI
```
**Attached image:** `15.png`

### Publishing Flow

```
Scheduler (every hour)
        │
        ▼
┌───────────────────┐
│ Get Polymarket    │
│ data              │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Format tweet      │
│ (max 280 chars)   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Upload image      │
│ (15.png)          │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Publish tweet     │
│ with media_id     │
└───────────────────┘
```

---

## Channel Monitor (GemTools)

### Description
Service that monitors the Telegram channel `@gem_tools_calls` and copies token signals to POLYNIKI AI's channel, reformatting them with its own style.

### File
`backend/src/services/channelMonitor.js`

### Functions

| Function | Description |
|----------|-------------|
| `initialize(apiId, apiHash, botService)` | Connects with Telegram User API |
| `startMonitoring()` | Starts message listening |
| `startPolling()` | Polling every 30s as backup |
| `checkNewMessages(isInitial)` | Checks for new messages |
| `handleNewMessage(event)` | Handles message event |
| `processMessage(message)` | Processes and classifies message |
| `isTokenCallMessage(text)` | Detects if it's a token call |
| `isMultiplierMessage(text)` | Detects if it's a multiplier alert |
| `reformatMessage(text)` | Reformats call to POLYNIKI AI style |
| `reformatMultiplierMessage(text)` | Reformats multiplier |

### Token Call Detection

A message is considered a "token call" if it has:
1. ✅ Solana contract address (32-44 base58 characters)
2. ✅ At least one of:
   - Market Cap mention
   - Token indicators ($SYMBOL, holders, snipers, GTscore)
   - Price pattern ($100K, 50%, etc.)

### Multiplier Detection

A message is considered a "multiplier" if it has:
1. ✅ Pattern `$SYMBOL xN` (e.g.: `$SCARLETT x11`)
2. ✅ MC change: `MC: $144K -> $1M5`

### Processing Flow

```
Message in @gem_tools_calls
            │
            ▼
    ┌───────────────┐
    │ Event Handler │◄──── Polling (backup every 30s)
    │  or Polling   │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Is it a       │
    │ multiplier?   │
    └───────┬───────┘
            │
      ┌─────┴─────┐
      │           │
     YES          NO
      │           │
      ▼           ▼
┌───────────┐ ┌───────────┐
│ Reformat  │ │ Is it a   │
│ as x11    │ │ token call│
└─────┬─────┘ └─────┬─────┘
      │             │
      │       ┌─────┴─────┐
      │       │           │
      │      YES          NO
      │       │           │
      │       ▼           ▼
      │ ┌───────────┐ ┌───────────┐
      │ │ Reformat  │ │  Ignore   │
      │ │ as call   │ │           │
      │ └─────┬─────┘ └───────────┘
      │       │
      └───┬───┘
          │
          ▼
    ┌───────────────┐
    │ Send to POLYNIKI AI  │
    │   Telegram    │
    └───────┬───────┘
          │
          ▼
    ┌───────────────┐
    │ Broadcast via │
    │   WebSocket   │
    └───────────────┘
```

### Required Configuration

To use the Channel Monitor you need:

1. **Telegram API credentials** from https://my.telegram.org:
   - `TELEGRAM_API_ID`
   - `TELEGRAM_API_HASH`

2. **Your Telegram account** must be a member of the `@gem_tools_calls` channel

3. **First run**: It will ask for:
   - Phone number
   - Verification code
   - 2FA password (if enabled)

---

## Multiplier Alerts

### Description
System that detects when a token does a multiplier (x2, x5, x11, etc.) from the original call and publishes it.

### Flow

```
GemTools publishes:
🚀 $SCARLETT x11 🚀
💵 MC: $144K -> $1M5
         │
         ▼
┌───────────────────┐
│ isMultiplierMessage│
│ detects pattern   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ reformatMultiplier│
│ Message           │
└────────┬──────────┘
         │
         ▼
POLYNIKI AI publishes to Telegram:
🚀🚀🚀 POLYNIKI AI MULTIPLIER ALERT 🚀🚀🚀
💎 $SCARLETT just did x11!
💵 MC: $144K → $1M5
⚡️ Powered by POLYNIKI AI AI
         │
         ▼
┌───────────────────┐
│ WebSocket broadcast│
│ to frontend       │
└────────┬──────────┘
         │
         ▼
Frontend shows in LIVE SIGNALS:
🚀 $SCARLETT just did x11!
   MC: $144K → $1M5     15:42
```

### Data Parsing

```javascript
// Extract symbol and multiplier
const match = text.match(/\$([A-Z]+)\s*x(\d+)/i);
// $SCARLETT x11 → symbol: "SCARLETT", multiplier: "11"

// Extract MC change
const mcMatch = text.match(/MC:\s*\$([\d.]+[KMB]?)\s*[-→>]+\s*\$([\d.]+[KMB]?)/i);
// MC: $144K -> $1M5 → mcFrom: "$144K", mcTo: "$1M5"
```

---

## Polymarket Tracking

### Description
Service that monitors prediction markets on Polymarket, detects significant movements, whale activity, and generates summaries.

### File
`backend/src/services/polymarket.js`

### Functions

| Function | Description |
|----------|-------------|
| `getTrendingMarkets()` | Gets top 100 markets by volume |
| `getHotMarkets()` | Top 10 most active markets |
| `getCryptoMarkets()` | Crypto-related markets |
| `getWhaleActivity()` | Detects whale activity |
| `getBiggestMovers()` | Largest price changes (15m) |
| `getClosingSoon()` | Markets closing in 7 days |
| `getVolumeSpikes()` | Detects volume spikes |
| `getSignificantChanges()` | Price changes >5% |
| `getSummary()` | Complete summary of everything |

### Whale Detection

```javascript
// A whale is detected when:
// 1. 24h Volume > $10,000
// 2. Volume/liquidity ratio > 15%

const volumeToLiquidityRatio = volume24h / liquidity;
if (volume24h > 10000 && volumeToLiquidityRatio > 0.15) {
  // It's whale activity
  const side = yesPrice > 0.5 ? 'YES' : 'NO';
  const confidence = Math.max(yesPrice, 1 - yesPrice) * 100;
}
```

### Movement Detection

```javascript
// A significant movement is >5% change
const change = ((currentPrice - previousPrice) / previousPrice) * 100;
if (Math.abs(change) >= 5) {
  // Generate PUMP or DUMP signal
}
```

### Summary Data Structure

```javascript
{
  totalMarketsTracked: 100,
  total24hVolume: "$15.5M",
  totalLiquidity: "$45.2M",
  significantMoves: 3,
  
  hotMarkets: [
    { question, slug, yesPrice, volume24h, link }
  ],
  
  topCrypto: [
    { question, slug, yesPrice, volume24h, link }
  ],
  
  whaleActivity: [
    { market, slug, side, confidence, volume24h, priceImpact, link }
  ],
  
  biggestMovers: [
    { market, slug, previousPrice, currentPrice, change, direction, link }
  ],
  
  closingSoon: [
    { market, slug, yesPrice, daysLeft, volume, link }
  ],
  
  volumeSpikes: [
    { market, slug, volumeChange, currentVolume, link }
  ],
  
  signals: [
    { type, category, market, slug, currentPrice, previousPrice, change, ... }
  ]
}
```

---

## Real-Time WebSocket

### Description
WebSocket server that enables real-time communication between the backend and frontend clients.

### File
`backend/src/services/websocket.js`

### Functions

| Function | Description |
|----------|-------------|
| `initialize(server)` | Starts WebSocket server |
| `handleMessage(clientId, message)` | Processes client messages |
| `sendToClient(clientId, data)` | Sends to specific client |
| `broadcast(channel, data)` | Broadcasts to all in a channel |
| `broadcastSignal(signal)` | Sends signal to 'signals' channel |
| `broadcastTweet(tweet)` | Sends tweet to 'tweets' channel |
| `broadcastSummary(summary)` | Sends summary to 'signals' channel |
| `getClientCount()` | Number of connected clients |

### Available Channels

| Channel | Content |
|---------|---------|
| `signals` | Trading signals, multipliers, summaries |
| `tweets` | Published tweets and updates |
| `chat` | Chat messages (future use) |

### Message Protocol

**Client → Server:**
```javascript
// Subscribe to channel
{ type: 'subscribe', channel: 'signals' }

// Unsubscribe
{ type: 'unsubscribe', channel: 'signals' }

// Ping
{ type: 'ping' }
```

**Server → Client:**
```javascript
// Successful connection
{ type: 'connected', clientId: 'uuid', message: '...' }

// New signal
{ channel: 'signals', type: 'signal', data: {...}, timestamp: '...' }

// New tweet
{ channel: 'tweets', type: 'tweet', data: {...}, timestamp: '...' }

// Summary
{ channel: 'signals', type: 'summary', data: {...}, timestamp: '...' }

// Real tweets update
{ type: 'tweets_update', tweets: [...] }
```

### Frontend Hook

```javascript
// frontend/src/hooks/useWebSocket.js

const { 
  isConnected,  // Boolean: connection status
  signals,      // Array: received signals
  tweets,       // Array: received tweets
  lastSummary,  // Object: last summary
  setSignals,   // Function: update signals
  setTweets     // Function: update tweets
} = useWebSocket();
```

---

## Frontend - Web Interface

### Description
React application with modern interface, visual effects, and interactive components.

### Technologies
- React 18
- Vite
- TailwindCSS
- Three.js (3D effects)
- Framer Motion (animations)
- Lucide React (icons)

### Main Components

#### 1. SplashScreen
Startup screen with text scramble animation and animated background.
- Text effect that changes letters
- Click to enter
- Exit animation

#### 2. Header
Top bar with:
- Falling letters background (RainingLetters)
- Rotating scrambled text
- Connection status (LIVE/OFFLINE)
- Social links (Twitter, Telegram, GitHub)
- "LIVE SIGNALS" badge with matrix effect

#### 3. ChatTerminal
Chat terminal with POLYNIKI AI AI:
- Text input with blinking cursor
- Message history
- "SEND" button with HoverSlatButton effect
- "POLYNIKI AI TERMINAL" title with MatrixText effect
- Loading indicator "Analyzing markets..."

#### 4. SignalsFeed
Real-time signals feed:
- Only shows multiplier alerts
- Compact format: `$SCARLETT just did x11!`
- Rocket icon
- Green left border
- "LIVE SIGNALS" title with MatrixText
- GlowingEffect on border

#### 5. TweetsFeed
Stacked tweets feed:
- Stacked cards with hover effect
- POLYNIKI AI avatar
- Verified badge
- Likes and retweets
- Links to Twitter

#### 6. MarketOverview
Market summary:
- Polymarket Vol
- Markets Tracked
- Significant Moves
- HOT MARKETS
- GlowingEffect on each card

### Effect Components

| Component | Description |
|-----------|-------------|
| `GlowingEffect` | Glowing border that follows mouse |
| `HoverSlatButton` | Button with letters that change on hover |
| `MatrixText` | Matrix-style text (0/1 → letters) |
| `MainBackground` | Animated background with SVG filters |
| `DotBackground` | Dot background that reacts to mouse |
| `ShadowOverlay` | Overlay with animated shadows |

---

## Scheduler (Task Scheduler)

### Description
Service that runs periodic tasks using cron jobs.

### File
`backend/src/services/scheduler.js`

### Scheduled Tasks

| Task | Interval | Description |
|------|----------|-------------|
| Market Update | `*/15 * * * *` | Every 15 minutes |
| Hourly Summary | `0 * * * *` | Every hour on the hour |
| Real Tweets Refresh | `*/5 * * * *` | Every 5 minutes |

### Market Update Flow (every 15 min)

```
1. Get Polymarket data
2. Detect significant signals (changes >5%)
3. Send individual signals to Telegram (max 3)
4. Tweet PUMP/DUMP signals with image
5. Send formatted summary to Telegram
6. Broadcast to WebSocket
7. Log statistics
```

### Hourly Summary Flow (every hour)

```
1. Get fresh Polymarket data
2. Format summary for Twitter (max 280 chars)
3. Publish tweet with 15.png image
```

### Functions

| Function | Description |
|----------|-------------|
| `initialize(schedule)` | Starts cron jobs |
| `runUpdate()` | Executes market update |
| `runHourlySummary()` | Executes hourly Twitter summary |
| `refreshRealTweets()` | Updates real tweets |
| `sendPolymarketSummary(data)` | Sends summary to Telegram |
| `runManualUpdate()` | Manual trigger |
| `getStatus()` | Scheduler status |
| `stop()` | Stops all cron jobs |

---

## Environment Variables Configuration

### `.env` File

```env
# ===========================================
# SERVER
# ===========================================
PORT=3001
FRONTEND_URL=http://localhost:3000

# ===========================================
# TELEGRAM BOT
# ===========================================
# Get from @BotFather
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@YourChannel

# ===========================================
# TELEGRAM USER API (for Channel Monitor)
# ===========================================
# Get from https://my.telegram.org
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=your_api_hash

# ===========================================
# TWITTER API
# ===========================================
# Get from https://developer.twitter.com
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# ===========================================
# AI APIs
# ===========================================
# Option 1: Anthropic Claude (recommended)
ANTHROPIC_API_KEY=sk-ant-...

# Option 2: OpenAI (alternative)
OPENAI_API_KEY=sk-...

# ===========================================
# SCHEDULER
# ===========================================
# Cron schedule for updates (default: every 15 min)
CRON_SCHEDULE=*/15 * * * *
```

---

## File Structure

```
POLYNIKI AI-signals/
│
├── backend/
│   ├── src/
│   │   ├── index.js              # Entry point
│   │   │
│   │   ├── routes/
│   │   │   └── api.js            # REST API endpoints
│   │   │
│   │   └── services/
│   │       ├── channelMonitor.js # GemTools Monitor
│   │       ├── polymarket.js     # Polymarket API
│   │       ├── scheduler.js      # Cron jobs
│   │       ├── telegram.js       # Telegram bot
│   │       ├── twitter.js        # Twitter client
│   │       ├── websocket.js      # WebSocket server
│   │       └── POLYNIKI AI-ai.js        # AI chat service
│   │
│   ├── assets/
│   │   ├── pump.png              # Image for PUMP
│   │   ├── dump.png              # Image for DUMP
│   │   └── 15.png                # Image for 15-min update
│   │
│   ├── .env                      # Environment variables
│   ├── .telegram_session         # Telegram session (auto-generated)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main component
│   │   ├── main.jsx              # Entry point
│   │   ├── index.css             # Global styles
│   │   │
│   │   ├── components/
│   │   │   ├── ChatTerminal.jsx  # Chat terminal
│   │   │   ├── GlowingEffect.jsx # Glow effect
│   │   │   ├── Header.jsx        # Header with effects
│   │   │   ├── HoverSlatButton.jsx # Animated button
│   │   │   ├── MainBackground.jsx  # Animated background
│   │   │   ├── MarketOverview.jsx  # Market summary
│   │   │   ├── MatrixText.jsx    # Matrix-style text
│   │   │   ├── SignalsFeed.jsx   # Signals feed
│   │   │   ├── SplashScreen.jsx  # Startup screen
│   │   │   └── TweetsFeed.jsx    # Tweets feed
│   │   │
│   │   ├── hooks/
│   │   │   └── useWebSocket.js   # WebSocket hook
│   │   │
│   │   └── utils/
│   │       └── api.js            # REST API client
│   │
│   ├── public/
│   │   ├── POLYNIKI AI.png              # POLYNIKI AI logo
│   │   └── perfil2.png           # Avatar for tweets
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/status` | Services status |
| GET | `/api/market/summary` | Polymarket summary |
| GET | `/api/market/polymarket` | Full Polymarket data |
| GET | `/api/market/polymarket/hot` | Top 10 markets |
| GET | `/api/signals` | Recent signals |
| GET | `/api/tweets` | Recent tweets |
| POST | `/api/chat` | Chat with POLYNIKI AI AI |
| DELETE | `/api/chat/:sessionId` | Clear chat session |
| POST | `/api/admin/trigger-update` | Manual update trigger |

---

## Commands

### Backend

```bash
cd backend

# Development
npm run dev

# Production
npm start
```

### Frontend

```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

---

## Troubleshooting

### "Channel monitor disabled"
- Check `TELEGRAM_API_ID` and `TELEGRAM_API_HASH` in `.env`
- Get credentials from https://my.telegram.org

### "Cannot find any entity"
- Verify that your Telegram account is a member of the channel
- The channel username must be correct (without @)

### "Twitter credentials not provided"
- Check all 4 Twitter credentials in `.env`
- The Twitter app must have Read and Write permissions

### "No AI API key provided"
- Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `.env`
- Without API key, chat uses pre-programmed responses

### WebSocket not connecting
- Verify that the backend is running on the correct port
- Check `VITE_WS_URL` in the frontend

---

*Documentation generated for POLYNIKI AI AI v1.0.0*
*Last updated: January 2026*
