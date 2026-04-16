import { useCallback, useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";

/* =========================
   TYPES
========================= */

interface KPI {
  value: number;
  change: number;
}

export interface DashboardData {
  contacts: KPI;
  messages: KPI;
  responseRate: KPI;
}

export interface Activity {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  initials?: string;
}

export interface MessagePoint {
  date: string;
  value: number;
}

interface UseDashboardReturn {
  dashboard: DashboardData | null;
  activities: Activity[];
  messages: MessagePoint[];
  loading: boolean;
  refetch: () => Promise<void>;
}

interface MessageApi {
  date: string;
  count: number;
}

export function useDashboard(days: number): UseDashboardReturn {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<MessagePoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const [dashboardData, activitiesData, messagesData] =
        await Promise.all([
          analyticsService.getDashboard(days),
          analyticsService.getRecentActivity(),
          analyticsService.getMessagesOverTime(days),
        ]);

      setDashboard(dashboardData as DashboardData);
      setActivities(activitiesData as Activity[]);
      setMessages(
        (messagesData as MessageApi[]).map((m) => ({
          date: m.date,
          value: Number(m.count),
        }))
      );
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    dashboard,
    activities,
    messages,
    loading,
    refetch: fetchAll,
  };
}