const API_URL = `${import.meta.env.VITE_API_URL}/analytics`;

export const analyticsService = {
  async getDashboard(range: number) {
    const res = await fetch(`${API_URL}/dashboard?range=${range}`);
    const json = await res.json();
    return json.data;
  },

  async getRecentActivity() {
    const res = await fetch(`${API_URL}/recent-activity`);
    const json = await res.json();
    return json.data;
  },

  async getMessagesOverTime(range: number) {
    const res = await fetch(`${API_URL}/messages-over-time?range=${range}`);
    const json = await res.json();
    return json.data;
  },
};