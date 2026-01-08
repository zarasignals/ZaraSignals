import React from 'react';
import { Bell, TrendingUp, TrendingDown, Award, ExternalLink, Activity, Rocket } from 'lucide-react';
import MatrixText from './MatrixText';
import GlowingEffect from './GlowingEffect';

function SignalsFeed({ signals = [] }) {
  const getSignalIcon = (signal) => {
    if (!signal) return <Activity className="w-4 h-4" />;
    
    // Multiplier signals get rocket icon
    if (signal.type === 'gem_tools_multiplier') {
      return <Rocket className="w-4 h-4" />;
    }
    
    if (!signal.category) return <Activity className="w-4 h-4" />;
    
    const cat = signal.category || '';
    if (cat.includes('PUMP') || cat.includes('📈') || cat.includes('💵') || cat.includes('HOT')) {
      return <TrendingUp className="w-4 h-4" />;
    }
    if (cat.includes('DUMP') || cat.includes('📉') || cat.includes('COLD')) {
      return <TrendingDown className="w-4 h-4" />;
    }
    if (cat.includes('GRADUATED') || cat.includes('🎓')) {
      return <Award className="w-4 h-4" />;
    }
    return <Activity className="w-4 h-4" />;
  };

  const getSignalColor = (signal) => {
    const defaultColor = {
      bg: 'bg-gray-800/50',
      border: 'border-gray-700',
      text: 'text-gray-400',
      badge: 'bg-gray-700 text-white'
    };
    
    if (!signal) return defaultColor;
    
    // Multiplier signals get special green styling
    if (signal.type === 'gem_tools_multiplier') {
      return {
        bg: 'bg-green-900/30',
        border: 'border-green-700',
        text: 'text-green-400',
        badge: 'bg-green-600 text-white'
      };
    }
    
    if (!signal.category) return defaultColor;
    
    const cat = signal.category || '';
    if (cat.includes('PUMP') || cat.includes('📈') || cat.includes('🚀') || cat.includes('HOT')) {
      return {
        bg: 'bg-gray-800/50',
        border: 'border-gray-600',
        text: 'text-white',
        badge: 'bg-gray-600 text-white'
      };
    }
    if (cat.includes('DUMP') || cat.includes('📉') || cat.includes('COLD')) {
      return {
        bg: 'bg-gray-900/50',
        border: 'border-gray-700',
        text: 'text-gray-400',
        badge: 'bg-gray-700 text-white'
      };
    }
    if (cat.includes('GRADUATED') || cat.includes('🎓')) {
      return {
        bg: 'bg-gray-800/50',
        border: 'border-gray-600',
        text: 'text-gray-300',
        badge: 'bg-gray-500 text-white'
      };
    }
    return defaultColor;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Just now';
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      return 'Just now';
    }
  };

  // Parse multiplier data from original or formatted text
  const parseMultiplierData = (signal) => {
    const text = signal.original || signal.formatted || '';
    
    // Extract symbol and multiplier: $SCARLETT x11
    const multiplierMatch = text.match(/\$([A-Z]+)\s*x(\d+)/i);
    const symbol = multiplierMatch ? multiplierMatch[1] : '???';
    const multiplier = multiplierMatch ? multiplierMatch[2] : '?';

    // Extract MC change: MC: $144K -> $1M5 or $144K → $1M5
    const mcMatch = text.match(/MC:\s*\$([\d.]+[KMB]?)\s*[-→>]+\s*\$([\d.]+[KMB]?)/i);
    const mcFrom = mcMatch ? '$' + mcMatch[1] : '';
    const mcTo = mcMatch ? '$' + mcMatch[2] : '';

    return { symbol, multiplier, mcFrom, mcTo };
  };

  // Filter out any undefined or null signals
  const validSignals = Array.isArray(signals) 
    ? signals.filter(s => s && typeof s === 'object') 
    : [];

  return (
    <div className="relative glass-card rounded-xl overflow-hidden">
      {/* Glowing Effect */}
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/50">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-400" />
          <MatrixText 
            text="LIVE SIGNALS" 
            className="font-display text-sm font-bold tracking-wider text-gray-300"
            initialDelay={800}
            letterAnimationDuration={300}
            letterInterval={50}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs text-gray-500">{validSignals.length} alerts</span>
        </div>
      </div>

      {/* Signals List */}
      <div className="relative z-10 max-h-[400px] overflow-y-auto custom-scroll">
        {validSignals.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for signals...</p>
            <p className="text-xs mt-1">Multiplier alerts in real-time</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {validSignals.slice(0, 20).map((signal, index) => {
              if (!signal) return null;
              
              const colors = getSignalColor(signal);
              
              // Handle multiplier signals with compact display
              if (signal.type === 'gem_tools_multiplier') {
                const { symbol, multiplier, mcFrom, mcTo } = parseMultiplierData(signal);
                
                return (
                  <div
                    key={`multiplier-${index}-${signal.timestamp}`}
                    className={`p-3 hover:bg-gray-900/50 transition-colors ${colors.bg} border-l-2 border-green-500`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rocket Icon */}
                      <div className={`p-2 rounded-lg bg-green-900/50 text-green-400`}>
                        <Rocket className="w-4 h-4" />
                      </div>
                      
                      {/* Compact Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-mono">
                          <span className="text-green-400 font-bold">${symbol}</span>
                          <span className="text-gray-300"> just did </span>
                          <span className="text-green-400 font-bold">x{multiplier}</span>
                          <span className="text-gray-500">!</span>
                        </p>
                        {mcFrom && mcTo && (
                          <p className="text-xs text-gray-500 mt-1">
                            MC: {mcFrom} → {mcTo}
                          </p>
                        )}
                      </div>
                      
                      {/* Time */}
                      <span className="text-xs text-gray-600 flex-shrink-0">
                        {formatTime(signal.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              }
              
              // Regular signals (non-multiplier) - hide them or show minimal
              // For now, we'll skip non-multiplier signals to keep it clean
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SignalsFeed;
