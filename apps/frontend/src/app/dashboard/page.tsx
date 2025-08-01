"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { LogoutButton } from "@/components/ui/logout-button";

interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  webhookUrl?: string;
  createdAt: string;
  action: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}

export default function DashboardPage() {
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/api/v1/zap`);
      setZaps(res.data.data || []);
    } catch (error) {
      console.error("Error fetching zaps:", error);
      setError("Failed to load zaps. Please try again later.");
      setZaps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZaps();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center">
                <span className="font-semibold text-white">Z</span>
              </div>
              <span className="text-lg font-medium text-white">Zapier</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-white hover:text-white/80 font-medium"
              >
                Dashboard
              </Link>
              <LogoutButton variant="ghost" className="px-4 py-1.5 rounded-md border border-white/20 text-white/90 hover:bg-white/10 transition-colors" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            My Zaps
          </h1>
          <Link
            href="/zap/create"
            className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-md text-white font-medium transition-all hover:opacity-90 hover:scale-[1.02]"
          >
            Create
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : zaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No zaps found</p>
            <Link
              href="/zap/create"
              className="text-teal-500 hover:text-teal-400 underline"
            >
              Create your first zap
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70">Trigger and Actions</TableHead>
                  <TableHead className="text-white/70">Zap Id</TableHead>
                  <TableHead className="text-white/70">Webhook Url</TableHead>
                  <TableHead className="text-white/70">Created At</TableHead>
                  <TableHead className="text-white/70 w-[50px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zaps.map((zap) => (
                  <TableRow 
                    key={zap.id} 
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Trigger */}
                        <div className="flex items-center">
                          {zap.trigger?.type?.image && (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 p-2 flex items-center justify-center">
                              <img
                                src={zap.trigger.type.image}
                                alt={zap.trigger.type.name || 'Trigger'}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                        {/* action */}
                        {(zap.action || []).map((action, index) => (
                          <div key={action.id} className="flex items-center">
                            <div className="mx-2 text-white/40">→</div>
                            {action.type?.image && (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 p-2 flex items-center justify-center">
                                <img
                                  src={action.type.image}
                                  alt={action.type.name || 'Action'}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-white/70">
                      {zap.id}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate text-sm text-white/70 font-mono">
                        {zap.webhookUrl || `http://localhost:3002/hooks/catch/a8d5197a-d152-45b6-8b9a-6dc7219bf679/${zap.id}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {formatDate(zap.createdAt || new Date().toISOString())}
                    </TableCell>
                    <TableCell>
                      <button className="p-2 hover:bg-white/10 rounded-md transition-colors group">
                        <span className="block w-4 text-center text-white/70 group-hover:text-white">⋯</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
