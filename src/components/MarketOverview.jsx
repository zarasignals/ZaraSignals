import React from 'react';
import { Activity, Zap, BarChart3 } from 'lucide-react';
import GlowingEffect from './GlowingEffect';

function MarketOverview({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-800 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Polymarket Vol',
      value: data?.polymarket?.total24hVolume || '$0',
      icon: BarChart3,
      color: 'text-gray-300',
      bgColor: 'bg-gray-800'
    },
    {
      label: 'Markets Tracked',
      value: data?.polymarket?.totalMarketsTracked || 0,
      icon: Activity,
      color: 'text-white',
      bgColor: 'bg-gray-800'
    },
    {
      label: 'Significant Moves',
      value: data?.polymarket?.significantMoves || 0,
      icon: Zap,
      color: 'text-gray-300',
      bgColor: 'bg-gray-800'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="relative glass-card rounded-xl p-4 hover:border-gray-600 transition-all duration-300 group"
          >
            {/* Glowing Effect */}
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <p className={`text-lg font-bold ${stat.color} font-mono`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hot Polymarket Markets */}
      {data?.polymarket?.topMarkets?.length > 0 && (
        <div className="relative glass-card rounded-xl p-4 mt-4">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              HOT MARKETS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.polymarket.topMarkets.slice(0, 3).map((market, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400 truncate flex-1 mr-2">
                    {market.question?.substring(0, 45)}...
                  </span>
                  <span className="text-white font-mono text-xs">
                    {market.volume}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketOverview;
