import { GAAuditResult, TrafficData } from "../types";

// Mock Data Service for GA4
// In a real app, this would call the Google Analytics Admin and Data APIs.

export const auditAllProperties = async (): Promise<GAAuditResult> => {
  // Simulating API latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    properties: [
      {
        propertyId: "123456789",
        displayName: "Flood Doctor - Production",
        createTime: "2022-01-15T10:00:00Z",
        dataStreams: [
          { streamId: "s1", streamName: "Web Stream", type: "web", webStreamData: { measurementId: "G-ABC12345", defaultUri: "flood.doctor" }, status: "active" },
          { streamId: "s2", streamName: "Old Stream", type: "web", webStreamData: { measurementId: "G-XYZ98765", defaultUri: "flooddoctorva.com" }, status: "orphaned" }
        ],
        healthScore: 72,
        status: "active",
        issues: ["Orphaned data stream detected", "GSC not linked"]
      },
      {
        propertyId: "987654321",
        displayName: "Flood Doctor (old)",
        createTime: "2020-03-10T10:00:00Z",
        dataStreams: [
          { streamId: "s3", streamName: "Legacy Web", type: "web", status: "active" }
        ],
        healthScore: 40,
        status: "duplicate",
        issues: ["Duplicate property"]
      },
      {
        propertyId: "444555666",
        displayName: "flood.doctor",
        createTime: "2024-08-01T10:00:00Z",
        dataStreams: [
          { streamId: "s4", streamName: "Main", type: "web", status: "active" }
        ],
        healthScore: 90,
        status: "active",
        issues: []
      }
    ],
    duplicates: [
      {
        name: "Flood Doctor variants",
        properties: [
            { propertyId: "123456789", displayName: "Flood Doctor - Production", createTime: "", dataStreams: [], healthScore: 0, status: 'active', issues: [] },
            { propertyId: "987654321", displayName: "Flood Doctor (old)", createTime: "", dataStreams: [], healthScore: 0, status: 'duplicate', issues: [] },
            { propertyId: "444555666", displayName: "flood.doctor", createTime: "", dataStreams: [], healthScore: 0, status: 'active', issues: [] }
        ],
        reason: "Similar names and overlapping data streams pointing to the same domain."
      }
    ],
    trackingIssues: [
      { domain: "flood.doctor", hasTag: true, tagId: "G-ABC12345", correctProperty: true, issues: [] },
      { domain: "mclean.flood.doctor", hasTag: true, tagId: "G-OLDTAG99", correctProperty: false, issues: ["Wrong property ID"] },
      { domain: "arlington.flood.doctor", hasTag: false, correctProperty: false, issues: ["Missing tracking code"] }
    ],
    conversionIssues: [
      { name: "Phone Call Click", event: "click_to_call", lastTriggered: "2024-12-12T10:30:00Z", status: "working" },
      { name: "Form Submission", event: "form_submit", lastTriggered: "2024-12-10T14:20:00Z", status: "working" },
      { name: "Contact Page View", event: "page_view", lastTriggered: "", status: "misconfigured", issueDetails: "Never triggered. Check page_path filter." }
    ],
    overallHealthScore: 72
  };
};

export const getTrafficData = async (dateRange: string = '28d'): Promise<TrafficData> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate mock trend data
    const trend = [];
    const days = dateRange === '7d' ? 7 : 28;
    const now = new Date();
    for(let i=days; i>=0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        trend.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sessions: Math.floor(Math.random() * 50) + 30
        });
    }

    return {
        summary: {
            sessions: 1247,
            users: 1089,
            pageViews: 3456,
            avgDuration: "2:31",
            bounceRate: 46
        },
        trend: trend,
        topPages: [
            { path: "/water-damage-arlington/", sessions: 89, conversions: 4, convRate: 4.5 },
            { path: "/", sessions: 67, conversions: 2, convRate: 3.0 },
            { path: "/mold-remediation/", sessions: 45, conversions: 1, convRate: 2.2 },
            { path: "/emergency-service/", sessions: 38, conversions: 3, convRate: 7.9 },
            { path: "/blog/prevent-mold/", sessions: 32, conversions: 0, convRate: 0 }
        ]
    };
}