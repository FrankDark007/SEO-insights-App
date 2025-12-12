import { Lead, LeadStats, LeadSettings } from "../types";

const LEADS_STORAGE_KEY = "seo_insight_leads";
const SETTINGS_STORAGE_KEY = "seo_insight_lead_settings";

const DEFAULT_SETTINGS: LeadSettings = {
  defaultLeadValue: 3500,
  services: ["Water Damage", "Mold Remediation", "Sewage Cleanup", "Flood Cleanup", "Fire Damage"],
  cities: ["Arlington", "Alexandria", "Fairfax", "McLean", "Bethesda", "Washington DC"],
  sources: ["Google Search", "Google Maps", "Referral", "Repeat Customer", "Facebook", "Yelp", "LSA"]
};

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(LEADS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLeads = (leads: Lead[]) => {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
};

export const getSettings = (): LeadSettings => {
  const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: LeadSettings) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const addLead = (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead => {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  leads.unshift(newLead); // Add to top
  saveLeads(leads);
  return newLead;
};

export const updateLead = (id: string, updates: Partial<Lead>): Lead | null => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;

  const updatedLead = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
  leads[index] = updatedLead;
  saveLeads(leads);
  return updatedLead;
};

export const deleteLead = (id: string) => {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  saveLeads(filtered);
};

export const calculateStats = (leads: Lead[]): LeadStats => {
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const pendingLeads = leads.filter(l => ['new', 'contacted', 'quoted'].includes(l.status)).length;
  const lostLeads = leads.filter(l => l.status === 'lost').length;
  const totalRevenue = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + (l.leadValue || 0), 0);
  
  // By Source
  const sourceMap = new Map<string, { leads: number, won: number, revenue: number }>();
  leads.forEach(l => {
      const src = l.source || 'Unknown';
      const curr = sourceMap.get(src) || { leads: 0, won: 0, revenue: 0 };
      curr.leads++;
      if (l.status === 'won') {
          curr.won++;
          curr.revenue += (l.leadValue || 0);
      }
      sourceMap.set(src, curr);
  });
  
  const bySource = Array.from(sourceMap.entries()).map(([source, stats]) => ({
      source,
      ...stats,
      percentage: Math.round((stats.leads / totalLeads) * 100) || 0
  })).sort((a, b) => b.leads - a.leads);

  // By Page
  const pageMap = new Map<string, { leads: number, won: number, revenue: number }>();
  leads.forEach(l => {
      if (!l.landingPage) return;
      const page = l.landingPage;
      const curr = pageMap.get(page) || { leads: 0, won: 0, revenue: 0 };
      curr.leads++;
      if (l.status === 'won') {
          curr.won++;
          curr.revenue += (l.leadValue || 0);
      }
      pageMap.set(page, curr);
  });

  const byPage = Array.from(pageMap.entries()).map(([page, stats]) => ({
      page,
      ...stats,
      conversionRate: Math.round((stats.won / stats.leads) * 100) || 0
  })).sort((a, b) => b.leads - a.leads).slice(0, 10);

  // By Keyword
  const keywordMap = new Map<string, { leads: number, won: number, revenue: number }>();
  leads.forEach(l => {
      if (!l.keyword) return;
      const kw = l.keyword;
      const curr = keywordMap.get(kw) || { leads: 0, won: 0, revenue: 0 };
      curr.leads++;
      if (l.status === 'won') {
          curr.won++;
          curr.revenue += (l.leadValue || 0);
      }
      keywordMap.set(kw, curr);
  });

  const byKeyword = Array.from(keywordMap.entries()).map(([keyword, stats]) => ({
      keyword,
      ...stats
  })).sort((a, b) => b.leads - a.leads).slice(0, 10);

  // By Service
  const serviceMap = new Map<string, { leads: number, totalValue: number, totalRevenue: number }>();
  leads.forEach(l => {
      const svc = l.serviceNeeded || 'Unknown';
      const curr = serviceMap.get(svc) || { leads: 0, totalValue: 0, totalRevenue: 0 };
      curr.leads++;
      curr.totalValue += (l.leadValue || 0); // using lead value as potential
      if (l.status === 'won') curr.totalRevenue += (l.leadValue || 0);
      serviceMap.set(svc, curr);
  });

  const byService = Array.from(serviceMap.entries()).map(([service, stats]) => ({
      service,
      leads: stats.leads,
      avgValue: Math.round(stats.totalValue / stats.leads) || 0,
      totalRevenue: stats.totalRevenue
  })).sort((a, b) => b.leads - a.leads);

  // By City
  const cityMap = new Map<string, { leads: number, won: number, revenue: number }>();
  leads.forEach(l => {
      const city = l.city || 'Unknown';
      const curr = cityMap.get(city) || { leads: 0, won: 0, revenue: 0 };
      curr.leads++;
      if (l.status === 'won') {
          curr.won++;
          curr.revenue += (l.leadValue || 0);
      }
      cityMap.set(city, curr);
  });

  const byCity = Array.from(cityMap.entries()).map(([city, stats]) => ({
      city,
      ...stats
  })).sort((a, b) => b.leads - a.leads);

  // Monthly Trend (Last 6 months)
  const monthMap = new Map<string, { totalLeads: number, wonLeads: number, revenue: number }>();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthMap.set(key, { totalLeads: 0, wonLeads: 0, revenue: 0 });
  }

  leads.forEach(l => {
      const date = new Date(l.dateTime);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (monthMap.has(key)) {
          const curr = monthMap.get(key)!;
          curr.totalLeads++;
          if (l.status === 'won') {
              curr.wonLeads++;
              curr.revenue += (l.leadValue || 0);
          }
      }
  });

  const monthlyTrend = Array.from(monthMap.entries()).map(([month, stats]) => ({
      month,
      ...stats
  }));

  return {
      summary: {
          totalLeads,
          wonLeads,
          pendingLeads,
          lostLeads,
          totalRevenue,
          avgLeadValue: totalLeads > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.leadValue || 0), 0) / totalLeads) : 0,
          winRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0
      },
      bySource,
      byPage,
      byKeyword,
      byService,
      byCity,
      monthlyTrend
  };
};
