'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Award, FileText, AlertCircle } from 'lucide-react';
import { ComplianceAudit, FORBIDDEN_WORDS } from '../lib/stateMachine';

interface ComplianceMonitorProps {
  audit: ComplianceAudit | null;
}

export default function ComplianceMonitor({ audit }: ComplianceMonitorProps) {
  const isAuditAvailable = audit !== null;
  const passed = isAuditAvailable && audit.allOk;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Background glow decorator */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-3xl opacity-20 pointer-events-none ${
        passed ? 'bg-emerald-400' : isAuditAvailable ? 'bg-rose-400' : 'bg-cyan-400'
      }`} />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <Award size={18} className="text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-none">Compliance Monitor</h3>
          </div>
          {isAuditAvailable ? (
            passed ? (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck size={12} />
                <span>Passed</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldAlert size={12} />
                <span>Failed</span>
              </span>
            )
          ) : (
            <span className="text-[10px] bg-slate-800 border border-slate-750 text-slate-400 px-2 py-1 rounded-full font-mono uppercase">
              Standby
            </span>
          )}
        </div>

        {/* Audits */}
        <div className="space-y-3.5">
          {/* Sentence check */}
          <div className="flex justify-between items-center bg-slate-950/40 p-3 border border-slate-800 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium block">Sentence Count Constraint</span>
              <span className="text-xs text-slate-300 font-semibold font-mono">
                {isAuditAvailable ? `${audit.sentenceCount} / 2 sentences` : '0 / 2 sentences'}
              </span>
            </div>
            <div className={`w-3.5 h-3.5 rounded-full border shadow-sm ${
              !isAuditAvailable
                ? 'bg-slate-800 border-slate-700'
                : audit.isSentenceOk
                ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500/20'
                : 'bg-rose-500 border-rose-400 shadow-rose-500/20'
            }`} />
          </div>

          {/* Forbidden words check */}
          <div className="flex justify-between items-center bg-slate-950/40 p-3 border border-slate-800 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium block">Forbidden Terms Audit</span>
              <span className="text-xs text-slate-300 font-semibold font-mono">
                {isAuditAvailable ? (audit.hasForbidden ? 'Words Detected' : 'Clean') : 'No check run'}
              </span>
            </div>
            <div className={`w-3.5 h-3.5 rounded-full border shadow-sm ${
              !isAuditAvailable
                ? 'bg-slate-800 border-slate-700'
                : audit.isVocabularyOk
                ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500/20'
                : 'bg-rose-500 border-rose-400 shadow-rose-500/20'
            }`} />
          </div>
        </div>
      </div>

      {/* Constraints guidelines preview */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-300 text-xs">
          <FileText size={13} className="text-cyan-400" />
          <span>Active Rules Matrix:</span>
        </div>
        <ul className="list-disc pl-4 space-y-1">
          <li>Voice Responses must be strictly ≤ 2 sentences.</li>
          <li>Blacklisted vocabulary words: <span className="text-rose-400 font-mono font-semibold">{FORBIDDEN_WORDS.join(', ')}</span>.</li>
          <li>Recommends Labs or Programs dynamically matching interests.</li>
        </ul>
      </div>
    </div>
  );
}
