import { GSCAuditResult, SearchData } from "../types";

export const auditGSCProperties = async (): Promise<GSCAuditResult> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    properties: [
      {
        siteUrl: "https://flood.doctor/",
        permissionLevel: "owner",
        verified: true,
        type: "url_prefix",
        sitemaps: [{ path: "/sitemap.xml", lastSubmitted: "2024-12-01", status: "success", urlsSubmitted: 45, urlsIndexed: 42 }],
        coverageIssues: [{ type: "Excluded by noindex", count: 3, examples: ["/thank-you/", "/staging/"] }]
      },
      {
        siteUrl: "sc-domain:flood.doctor",
        permissionLevel: "owner",
        verified: true,
        type: "domain",
        sitemaps: [],
        coverageIssues: []
      },
      {
        siteUrl: "https://mclean.flood.doctor/",
        permissionLevel: "full",
        verified: true,
        type: "url_prefix",
        sitemaps: [{ path: "/sitemap.xml", lastSubmitted: "2024-11-15", status: "has_errors", urlsSubmitted: 23, urlsIndexed: 18 }],
        coverageIssues: [{ type: "Crawled - currently not indexed", count: 5, examples: [] }]
      },
      {
        siteUrl: "https://arlington.flood.doctor/",
        permissionLevel: "none",
        verified: false,
        type: "url_prefix",
        sitemaps: [],
        coverageIssues: []
      }
    ],
    linkingStatus: [
      { gaProperty: "Flood Doctor - Production", gscProperty: "https://flood.doctor/", linked: false },
      { gaProperty: "flood.doctor", gscProperty: "sc-domain:flood.doctor", linked: true }
    ],
    sitemapIssues: ["arlington.flood.doctor missing sitemap", "mclean.flood.doctor sitemap has errors"],
    totalCoverageIssues: 31
  };
};

export const getSearchPerformance = async (dateRange: string = '28d'): Promise<SearchData> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        summary: {
            impressions: 34567,
            clicks: 1823,
            ctr: 5.3,
            avgPosition: 12.8
        },
        topQueries: [
            { query: "water damage restoration arlington", impressions: 234, clicks: 45, position: 4.2 },
            { query: "flood cleanup northern virginia", impressions: 189, clicks: 23, position: 7.8 },
            { query: "mold remediation fairfax", impressions: 156, clicks: 18, position: 8.3 },
            { query: "emergency plumber near me", impressions: 540, clicks: 12, position: 15.2 },
            { query: "basement waterproofing cost", impressions: 120, clicks: 5, position: 9.1 }
        ],
        positionDist: [
            { range: "1-3", count: 12 },
            { range: "4-10", count: 28 },
            { range: "11-20", count: 24 },
            { range: "21+", count: 16 }
        ]
    };
}