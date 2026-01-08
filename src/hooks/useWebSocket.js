import { useState, useEffect, useCallback, useRef } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [signals, setSignals] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [lastSummary, setLastSummary] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        
        // Subscribe to all channels
        wsRef.current.send(JSON.stringify({ type: 'subscribe', channel: 'signals' }));
        wsRef.current.send(JSON.stringify({ type: 'subscribe', channel: 'tweets' }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.channel === 'signals') {
            if (data.type === 'signal') {
              setSignals(prev => [data.data, ...prev].slice(0, 100));
            } else if (data.type === 'summary') {
              setLastSummary(data.data);
            }
          }
          
          if (data.channel === 'tweets') {
            setTweets(prev => [data.data, ...prev].slice(0, 50));
          }

          // Handle real tweets update from scheduler
          if (data.type === 'tweets_update' && data.tweets) {
            setTweets(data.tweets);
            console.log('🐦 Real tweets updated:', data.tweets.length);
          }
        } catch (e) {
          console.error('WebSocket message parse error:', e);
        }
      };

      wsRef.current.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        
        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    signals,
    tweets,
    lastSummary,
    setSignals,
    setTweets
  };
}

export default useWebSocket;
