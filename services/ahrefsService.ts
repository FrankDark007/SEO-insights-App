import { 
  AhrefsConfig, 
  AhrefsConnectionStatus, 
  AhrefsDomainOverview, 
  AhrefsDRHistory,
  AhrefsBacklink,
  AhrefsAnchorText,
  AhrefsKeywordRanking,
  AhrefsBacklinkGap,
  AhrefsKeywordGap
} from "../types";

const AHREFS_STORAGE_KEY = "seo_insight_ahrefs_config";

export const getAhrefsConfig = (): AhrefsConfig => {
  const data = localStorage.getItem(AHREFS_STORAGE_KEY);
  return data ? JSON.parse(data) : { apiToken: '', primaryDomain: '', competitors: [] };
};

export const saveAhrefsConfig = (config: AhrefsConfig) => {
  localStorage.setItem(AHREFS_STORAGE_KEY, JSON.stringify(config));
};

export const testConnection = async (token: string): Promise<AhrefsConnectionStatus> => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (token.length < 10) {
      throw new Error("Invalid API Token");
  }

  return {
      valid: true,
      plan: "Standard",
      creditsUsed: 2450,
      creditsLimit: 500000,
      lastVerified: new Date().toISOString()
  };
};

export const getDomainOverview = async (domain: string): Promise<AhrefsDomainOverview> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate data based on domain name to make it feel dynamic
    const isCompetitor = !domain.includes('flood.doctor');
    const baseDR = isCompetitor ? 60 : 42;
    
    return {
        domain,
        domainRating: baseDR + Math.floor(Math.random() * 5),
        ahrefsRank: isCompetitor ? 1200000 : 4500000,
        referringDomains: isCompetitor ? 450 : 156,
        backlinks: isCompetitor ? 12500 : 2847,
        organicKeywords: isCompetitor ? 2300 : 892,
        organicTraffic: isCompetitor ? 5600 : 1240,
        trafficValue: isCompetitor ? 24000 : 4836,
        lastUpdated: new Date().toISOString()
    };
};

export const getDRHistory = async (domain: string): Promise<AhrefsDRHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const history = [];
    const now = new Date();
    let dr = 30; // Start baseline
    
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dr += Math.random() * 2; // Slowly increasing trend
        history.push({
            date: d.toLocaleDateString('en-US', { month: 'short' }),
            dr: Math.floor(dr)
        });
    }
    return history;
};

export const getBacklinks = async (domain: string): Promise<AhrefsBacklink[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { urlFrom: "https://www.yelp.com/biz/flood-doctor", urlTo: `https://${domain}/`, domainRating: 93, anchor: "Visit Website", isDofollow: true, firstSeen: "2023-03-15", lastSeen: "2024-12-10" },
        { urlFrom: "https://www.bbb.org/us/va/arlington/profile/..." , urlTo: `https://${domain}/`, domainRating: 91, anchor: "Flood Doctor", isDofollow: true, firstSeen: "2024-01-10", lastSeen: "2024-12-11" },
        { urlFrom: "https://patch.com/virginia/arlington/best-restoration", urlTo: `https://${domain}/water-damage-arlington`, domainRating: 78, anchor: "water damage services", isDofollow: false, firstSeen: "2024-11-05", lastSeen: "2024-12-05" },
        { urlFrom: "https://arlingtonchamber.org/members", urlTo: `https://${domain}/`, domainRating: 52, anchor: "Flood Doctor", isDofollow: true, firstSeen: "2024-08-20", lastSeen: "2024-12-09" },
        { urlFrom: "https://homeadvisor.com/rated.FloodDoctor...", urlTo: `https://${domain}/services`, domainRating: 85, anchor: "flood cleanup", isDofollow: true, firstSeen: "2023-06-12", lastSeen: "2024-12-01" },
    ];
};

export const getAnchorTexts = async (domain: string): Promise<AhrefsAnchorText[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
        { anchor: "flood doctor", backlinks: 423, referringDomains: 45, percentage: 15 },
        { anchor: "water damage restoration", backlinks: 312, referringDomains: 30, percentage: 11 },
        { anchor: domain, backlinks: 567, referringDomains: 50, percentage: 20 },
        { anchor: "click here", backlinks: 234, referringDomains: 15, percentage: 8 },
        { anchor: "water damage arlington", backlinks: 89, referringDomains: 10, percentage: 3 },
    ];
};

// Helper to generate history
const generateHistory = (currentPos: number) => {
    const history = [];
    const now = new Date();
    let pos = currentPos;
    for(let i=0; i<30; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        history.unshift({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            position: Math.max(1, Math.min(100, pos + Math.floor(Math.random() * 5) - 2))
        });
        pos = history[0].position; // walk backwards roughly
    }
    // Ensure last point matches current
    history[history.length-1].position = currentPos;
    return history;
};

export const getOrganicKeywords = async (domain: string): Promise<AhrefsKeywordRanking[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const keywords = [
        { keyword: "flood doctor virginia", position: 1, volume: 90, traffic: 42, url: "/", difficulty: 10, cpc: 2.50, change: 0 },
        { keyword: "water damage restoration arlington va", position: 4, volume: 320, traffic: 34, url: "/water-damage-arlington", difficulty: 45, cpc: 35.00, change: 2 },
        { keyword: "mold remediation fairfax", position: 7, volume: 210, traffic: 18, url: "/mold-remediation-fairfax", difficulty: 38, cpc: 28.00, change: -1 },
        { keyword: "emergency water damage dc", position: 9, volume: 480, traffic: 28, url: "/emergency-water-damage", difficulty: 55, cpc: 45.00, change: 3 },
        { keyword: "basement flooding alexandria", position: 12, volume: 170, traffic: 8, url: "/basement-flooding-alexandria", difficulty: 28, cpc: 22.00, change: 0 },
        { keyword: "sewage cleanup vienna", position: 18, volume: 90, traffic: 5, url: "/sewage-cleanup", difficulty: 25, cpc: 18.00, change: -6 },
        { keyword: "flood cleanup fairfax", position: 19, volume: 140, traffic: 4, url: "/flood-cleanup-fairfax", difficulty: 30, cpc: 20.00, change: 6 },
        { keyword: "water damage great falls", position: 23, volume: 110, traffic: 2, url: "/water-damage-great-falls", difficulty: 35, cpc: 40.00, change: 0 },
        { keyword: "flood restoration reston", position: 34, volume: 90, traffic: 1, url: "/flood-restoration-reston", difficulty: 20, cpc: 15.00, change: 0 },
    ];

    return keywords.map(kw => ({
        ...kw,
        history: generateHistory(kw.position)
    }));
};

export const getBacklinkGap = async (yourDomain: string, competitors: string[]): Promise<AhrefsBacklinkGap[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        { domain: "washingtonian.com", domainRating: 78, linksToCompetitors: [{ competitor: competitors[0], count: 2 }, { competitor: competitors[1], count: 1 }], linksToYou: false },
        { domain: "dcist.com", domainRating: 72, linksToCompetitors: [{ competitor: competitors[0], count: 1 }], linksToYou: false },
        { domain: "arlingtonmagazine.com", domainRating: 54, linksToCompetitors: [{ competitor: competitors[0], count: 3 }, { competitor: competitors[1], count: 2 }], linksToYou: false },
        { domain: "fairfaxcounty.gov", domainRating: 68, linksToCompetitors: [{ competitor: competitors[1], count: 1 }], linksToYou: false },
    ];
};

export const getKeywordGap = async (yourDomain: string, competitors: string[]): Promise<AhrefsKeywordGap[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        { keyword: "water damage restoration cost", volume: 1900, difficulty: 60, competitorRankings: [{ competitor: competitors[0], position: 8 }, { competitor: competitors[1], position: 3 }], yourPosition: null },
        { keyword: "how long does water damage restoration take", volume: 720, difficulty: 25, competitorRankings: [{ competitor: competitors[0], position: 5 }, { competitor: competitors[1], position: 7 }], yourPosition: null },
        { keyword: "water damage vs flood damage", volume: 480, difficulty: 15, competitorRankings: [{ competitor: competitors[0], position: 12 }, { competitor: competitors[1], position: 4 }], yourPosition: null },
    ];
};