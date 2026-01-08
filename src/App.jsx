import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatTerminal from './components/ChatTerminal';
import SignalsFeed from './components/SignalsFeed';
import TweetsFeed from './components/TweetsFeed';
import MarketOverview from './components/MarketOverview';
import SplashScreen from './components/SplashScreen';
import MainBackground from './components/MainBackground';
import useWebSocket from './hooks/useWebSocket';
import api from './utils/api';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { isConnected, signals, tweets, lastSummary, setSignals, setTweets } = useWebSocket();
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch data with proper error handling
        let signalsData = [];
        let tweetsData = [];
        let market = null;

        try {
          const signalsResponse = await api.getSignals(50);
          signalsData = Array.isArray(signalsResponse) ? signalsResponse : [];
        } catch (e) {
          console.log('Could not load signals:', e.message);
        }

        try {
          const tweetsResponse = await api.getTweets(20);
          tweetsData = Array.isArray(tweetsResponse) ? tweetsResponse : [];
        } catch (e) {
          console.log('Could not load tweets:', e.message);
        }

        try {
          market = await api.getMarketSummary();
        } catch (e) {
          console.log('Could not load market data:', e.message);
        }
        
        setSignals(signalsData);
        setTweets(tweetsData);
        setMarketData(market);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setSignals, setTweets]);

  // Update market data periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const market = await api.getMarketSummary();
        if (market) {
          setMarketData(market);
        }
      } catch (error) {
        console.log('Failed to update market data:', error.message);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Use last summary from WebSocket if available
  useEffect(() => {
    if (lastSummary) {
      setMarketData(lastSummary);
    }
  }, [lastSummary]);

  // Ensure signals and tweets are always arrays
  const safeSignals = Array.isArray(signals) ? signals : [];
  const safeTweets = Array.isArray(tweets) ? tweets : [];

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onEnter={() => setShowSplash(false)} />
      )}
      
      {/* Main Background */}
      {!showSplash && <MainBackground />}
      
      <div className={`min-h-screen transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="relative z-10">
        <Header isConnected={isConnected} />
        
        <main className="container mx-auto px-4 py-6">
          {/* Market Overview */}
          <MarketOverview data={marketData} loading={loading} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Chat Terminal - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <ChatTerminal marketData={marketData} />
            </div>
            
            {/* Right Sidebar - Signals & Tweets */}
            <div className="space-y-6">
              <SignalsFeed signals={safeSignals} />
              <TweetsFeed tweets={safeTweets} />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>Powered by Zara AI • Not Financial Advice • DYOR</p>
          <p className="mt-1 text-xs">
            Polymarket • PumpFun • Solana
          </p>
        </footer>
      </div>
      </div>
    </>
  );
}

export default App;
