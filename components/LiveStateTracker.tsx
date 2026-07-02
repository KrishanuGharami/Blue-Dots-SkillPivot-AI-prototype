'use client';

import React, { useEffect, useState } from 'react';
import { StructuredState } from '../lib/stateMachine';
import { Database, Copy, Check } from 'lucide-react';

interface LiveStateTrackerProps {
  structuredState: StructuredState;
}

export default function LiveStateTracker({ structuredState }: LiveStateTrackerProps) {
  const [copied, setCopied] = useState(false);
  const [glow, setGlow] = useState(false);

  // Trigger a glow effect when the state changes
  useEffect(() => {
    setGlow(true);
    const timer = setTimeout(() => setGlow(false), 800);
    return () => clearTimeout(timer);
  }, [structuredState]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredState, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic custom syntax highlighter for JSON
  const renderHighlightedJson = (obj: any) => {
    const jsonStr = JSON.stringify(obj, null, 2);
    
    // Split into lines to render as structured elements
    const lines = jsonStr.split('\n');

    return (
      <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
        {lines.map((line, i) => {
          // Identify keys, strings, booleans, nulls
          let renderedLine = line;
          
          // Regex matchers
          const keyRegex = /"([^"]+)"\s*:/;
          const stringRegex = /:\s*"([^"]+)"/;
          const numRegex = /:\s*(-?\d+\.?\d*)/;
          const boolRegex = /:\s*(true|false)/;
          const nullRegex = /:\s*(null)/;

          const keyMatch = line.match(keyRegex);
          const stringMatch = line.match(stringRegex);
          const numMatch = line.match(numRegex);
          const boolMatch = line.match(boolRegex);
          const nullMatch = line.match(nullRegex);

          // We build the line parts
          return (
            <div key={i} className="hover:bg-slate-800/40 px-1 rounded transition-colors">
              {(() => {
                let parts: React.ReactNode[] = [];
                let cursor = 0;

                if (keyMatch && keyMatch.index !== undefined) {
                  // Key highlighting
                  const keyText = `"${keyMatch[1]}":`;
                  const leadingSpaces = line.substring(0, keyMatch.index);
                  parts.push(<span key="lead">{leadingSpaces}</span>);
                  parts.push(
                    <span key="key" className="text-pink-400 font-semibold">
                      {`"${keyMatch[1]}"`}
                    </span>
                  );
                  parts.push(<span key="colon">:</span>);
                  cursor = keyMatch.index + keyText.length;
                }

                const remainder = line.substring(cursor);

                if (stringMatch) {
                  parts.push(
                    <span key="str" className="text-cyan-300 font-medium">
                      {remainder}
                    </span>
                  );
                } else if (numMatch) {
                  parts.push(
                    <span key="num" className="text-amber-400">
                      {remainder}
                    </span>
                  );
                } else if (boolMatch) {
                  parts.push(
                    <span key="bool" className="text-emerald-400 font-semibold">
                      {remainder}
                    </span>
                  );
                } else if (nullMatch) {
                  parts.push(
                    <span key="null" className="text-slate-500 italic">
                      {remainder}
                    </span>
                  );
                } else {
                  parts.push(<span key="rest">{remainder}</span>);
                }

                return parts;
              })()}
            </div>
          );
        })}
      </pre>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center space-x-3">
          <Database size={18} className="text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-none">Live State Tracker</h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Copy JSON Payload"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Code body */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-950/70 custom-scrollbar relative">
        {/* Glow Notification overlay when state updates */}
        <div
          className={`absolute inset-0 bg-cyan-500/5 border border-cyan-500/20 pointer-events-none transition-opacity duration-700 rounded-2xl ${
            glow ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {renderHighlightedJson(structuredState)}
      </div>
    </div>
  );
}
