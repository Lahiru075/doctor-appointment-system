import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Calendar,
  User,
  Activity,
  KeyRound,
  FileText,
  Star,
  UserCheck
} from 'lucide-react';
import { getAllAuditLogs } from '../services/auditlog';
import type { AuditLog } from '../types/types';

const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAllAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Client-side Instant Filter
  const filteredLogs = logs.filter((log) => {
    const matchesType = selectedType === 'ALL' || log.activityType === selectedType;
    const matchesQuery =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const getTypeBadge = (type: AuditLog['activityType']) => {
    switch (type) {
      case 'SECURITY':
        return {
          icon: KeyRound,
          bg: 'bg-rose-950/40 text-rose-400 border-rose-900/40',
        };
      case 'BOOKING':
        return {
          icon: Calendar,
          bg: 'bg-blue-950/40 text-blue-400 border-blue-900/40',
        };
      case 'PRESCRIPTION':
        return {
          icon: FileText,
          bg: 'bg-purple-950/40 text-purple-400 border-purple-900/40',
        };
      case 'REVIEW':
        return {
          icon: Star,
          bg: 'bg-amber-950/40 text-amber-400 border-amber-900/40',
        };
      case 'PROFILE':
        return {
          icon: UserCheck,
          bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
        };
      default:
        return {
          icon: Activity,
          bg: 'bg-slate-900 text-slate-400 border-slate-700',
        };
    }
  };

  return (
    <div className="p-8 space-y-6 text-white min-h-screen bg-[#041521] font-sans">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#06222f] p-6 rounded-2xl border border-[#0f3341] shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 rounded-xl shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              System Audit <span className="text-emerald-400">Logs</span>
            </h1>
            <p className="text-xs text-[#85abc0] mt-0.5 font-medium">
              Real-time audit trail and event telemetry for platform compliance
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#082e3e] hover:bg-[#0a4d3c]/30 text-emerald-400 border border-emerald-900/30 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#06222f] p-4 rounded-2xl border border-[#0f3341] flex flex-col lg:flex-row items-center justify-between gap-4">

        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by action, email, actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#041a25] border border-[#0f3341] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 transition"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {['ALL', 'SECURITY', 'BOOKING', 'PRESCRIPTION', 'REVIEW', 'PROFILE'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 border ${
                selectedType === type
                  ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400 shadow-xs'
                  : 'bg-[#041a25] border-transparent text-slate-400 hover:text-slate-200 hover:border-[#0f3341]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#06222f] rounded-2xl border border-[#0f3341] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#041a25] text-slate-400 uppercase text-[10px] font-black border-b border-[#0f3341] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Event Type</th>
                <th className="py-3.5 px-6">Action & Details</th>
                <th className="py-3.5 px-6">Actor / Target User</th>
                <th className="py-3.5 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f3341]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center space-x-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                      <span>Loading telemetry logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                    No audit logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getTypeBadge(log.activityType);
                  const Icon = badge.icon;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-[#082e3e]/30 transition group"
                    >
                      {/* Type Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${badge.bg}`}>
                          <Icon className="w-3 h-3" />
                          <span>{log.activityType}</span>
                        </span>
                      </td>

                      {/* Action Description */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-200 group-hover:text-emerald-300 transition">
                          {log.action}
                        </p>
                      </td>

                      {/* Actor Info */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 flex items-center space-x-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{log.actorName || 'System'}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {log.userEmail || `User ID: #${log.userId || 'N/A'}`}
                          </span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-6 text-right whitespace-nowrap text-slate-400 font-medium text-[11px]">
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsView;