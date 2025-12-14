// Base types
export interface AnalysisState {
  isLoading: boolean;
  data: string | null;
  groundingMetadata: any | null;
  error: string | null;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SeoFormData {
  url: string;
  keywords: string;
  businessType: string;
  location: string;
}

export interface CompetitorMetric {
  name: string;
  domain_authority: number;
  backlink_strength: number;
  estimated_traffic: number;
  gbp_review_count?: number;
  gbp_rating?: number;
  local_pages_count?: number;
}

// Service Area
export interface LocationPagePlan {
  city: string;
  state: string;
  urlSlug: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
  h2Sections: string[];
  localKeywords: string[];
  internalLinks: string[];
  schema: any;
  wordCountTarget: number;
  localProofPoints: string[];
  nearbyAreas: string[];
}

// Content Brief
export interface ContentBrief {
  keyword: string;
  searchIntent: string;
  difficultyScore: number;
  recommendedWordCount: number;
  estimatedWriteTime: string;
  serpAnalysis: {
    rank: number;
    url: string;
    title: string;
    wordCount: number;
    h2Count: number;
    hasFaq: boolean;
    hasSchema: boolean;
  }[];
  requiredH2s: string[];
  recommendedH2s: string[];
  questionsToAnswer: string[];
  keywordsToInclude: {
    keyword: string;
    whereToUse: string;
    priority: string;
  }[];
  contentRequirements: string[];
  competitorGaps: string[];
  suggestedOutline: {
    tag: string;
    text: string;
    notes?: string;
    bulletPoints?: string[];
  }[];
}

// Schema
export interface BusinessProfile {
  businessName: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  email: string;
  hours247: boolean;
  serviceArea: string;
  priceRange: string;
  yearEstablished: string;
  description: string;
  logoUrl: string;
  imageUrl: string;
  services: ServiceItem[];
  faqs: FaqItem[];
  latitude?: number;
  longitude?: number;
  reviewCount?: number;
  rating?: number;
}

export interface ServiceItem {
  name: string;
  description: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SchemaOutput {
  localBusiness: any;
  services: any[];
  faq: any;
  organization: any;
  combined: string;
  warnings: string[];
  errors: string[];
}

// Rank Tracker
export interface RankingResult {
  keyword: string;
  currentRank: number | null;
  previousRank: number | null;
  change: number | null;
  topCompetitor: {
    domain: string;
    url: string;
    title: string;
  } | null;
  serp: SerpResult[];
  checkedAt: string;
}

export interface SerpResult {
  position: number;
  url: string;
  domain: string;
  title: string;
  isYou: boolean;
}

export interface StoredRankData {
  domain: string;
  location: string;
  keywords: string[];
  history: {
    [keyword: string]: {
      date: string;
      position: number | null;
    }[];
  };
  lastChecked: string;
}

// GBP Audit
export interface GBPAuditResult {
  mapPackSnapshot: {
    rank: number;
    businessName: string;
    rating: number;
    reviewCount: number;
    responseRate: number;
    primaryCategory: string;
    isYou: boolean;
  }[];
  yourPosition: number | null;
  categoryComparison: {
    you: { primary: string; secondary: string[] };
    competitors: { primary: string; secondary: string[] }[];
    recommended: string[];
  };
  profileCompleteness: ProfileMetric[];
  reviewAnalysis: {
    totalReviews: { you: number; avg: number; gap: number };
    avgRating: { you: number; avg: number; gap: number };
    velocity: { you: number; avg: number; gap: number };
    responseRate: { you: number; avg: number; gap: number };
  };
  reviewHistory: { month: string; you: number; competitorAvg: number }[];
  keywordPresence: {
    keyword: string;
    inName: boolean;
    inDescription: boolean;
    inServices: boolean;
    inPosts: boolean;
  }[];
  actionItems: {
    priority: string;
    action: string;
    reason: string;
    impact: string;
  }[];
  quickWins: string[];
}

export interface ProfileMetric {
  metric: string;
  you: number;
  competitorAvg: number;
  leader: number;
  max: number;
  unit: string;
}

// Review Analyzer
export interface ReviewAnalysis {
  overview: {
    totalReviews: number;
    averageRating: number;
    fiveStarPercent: number;
    oneStarPercent: number;
    velocity: number;
  };
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  positiveThemes: Theme[];
  negativeThemes: ThemeWithOpportunity[];
  serviceMentions: {
    service: string;
    positive: number;
    negative: number;
    netSentiment: number;
  }[];
  customerKeywords: {
    term: string;
    frequency: number;
    context: string;
  }[];
  marketingAmmo: string[];
  responseAnalysis: {
    responseRate: number;
    avgResponseTime: string;
    quality: string;
  };
}

export interface Theme {
  theme: string;
  frequency: number;
  exampleQuote: string;
}

export interface ThemeWithOpportunity extends Theme {
  yourOpportunity: string;
}

// Backlink Gap
export interface BacklinkGapResult {
  overview: {
    domain: string;
    referringDomains: number;
    totalBacklinks: number;
    domainAuthority: number;
    isYou: boolean;
  }[];
  gapOpportunities: LinkOpportunity[];
  linkTypeBreakdown: {
    domain: string;
    directory: number;
    editorial: number;
    resource: number;
    partnership: number;
    forum: number;
    other: number;
  }[];
  quickWins: LinkOpportunity[];
  highValueTargets: LinkOpportunity[];
  commonSources: {
    domain: string;
    domainAuthority: number;
    competitorCount: number;
    youHave: boolean;
    priority: string;
  }[];
}

export interface LinkOpportunity {
  linkingDomain: string;
  domainAuthority: number;
  linksTo: string[];
  linkType: string;
  acquisitionDifficulty: string;
  linkUrl: string;
  anchorTextUsed: string;
}

// Content Gap Matrix
export interface ContentGapResult {
  matrix: MatrixCell[][];
  summary: {
    totalPossible: number;
    yourCoverage: number;
    yourPercent: number;
    competitorAvgCoverage: number;
    gaps: number;
    opportunities: number;
  };
  priorityGaps: GapOpportunity[];
  opportunities: GapOpportunity[];
  yourStrengths: {
    city: string;
    service: string;
    competitorsMissing: string[];
    action: string;
  }[];
  competitorCoverage: any[];
}

export interface MatrixCell {
  city: string;
  service: string;
  youHave: boolean;
  yourUrl?: string;
  competitorsCovering: { domain: string; url: string }[];
  status: 'own' | 'competitive' | 'gap' | 'opportunity';
  priorityScore: number;
}

export interface GapOpportunity {
  city: string;
  service: string;
  competitorsCovering: string[];
  searchVolumeEstimate: string;
  priorityScore: number;
  recommendedAction: string;
}

// Competitor Alerts
export interface AlertCheckResult {
  domain: string;
  checkedAt: string;
  alerts: Alert[];
  currentSnapshot: CompetitorSnapshot;
}

export interface StoredAlertData {
  competitors: {
    domain: string;
    active: boolean;
    snapshots: CompetitorSnapshot[];
  }[];
  alerts: Alert[];
  preferences: {
    monitorNewPages: boolean;
    monitorTitles: boolean;
    monitorMeta: boolean;
    monitorBacklinks: boolean;
    monitorReviews: boolean;
    monitorGBP: boolean;
    monitorSchema: boolean;
  };
  lastFullCheck: string;
}

export interface CompetitorSnapshot {
  domain: string;
  takenAt: string;
  pages: {
    url: string;
    title: string;
    metaDescription: string;
    h1: string;
    schemaTypes: string[];
  }[];
  gbpData: {
    reviewCount: number;
    rating: number;
    lastPostDate: string;
  };
  estimatedBacklinks: number;
}

export interface Alert {
  id: string;
  type: 'new_page' | 'title_change' | 'meta_change' | 'review_change' | 'rating_change' | 'gbp_post' | 'new_backlink' | 'schema_change' | 'baseline';
  severity: 'high' | 'medium' | 'low';
  competitor: string;
  details: {
    url?: string;
    newValue?: string | number;
    oldValue?: string | number;
    change?: number;
  };
  detectedAt: string;
  recommendedResponse: string;
  addressed: boolean;
}

// Internal Link Optimizer
export interface InternalLinkAnalysis {
  overview: {
    totalPages: number;
    orphanPages: number;
    thinLinkPages: number;
    wellLinkedPages: number;
    avgLinksPerPage: number;
    maxDepth: number;
  };
  pages: PageLinkData[];
  orphans: OrphanPage[];
  opportunities: LinkOpp[];
  anchorAnalysis: {
    targetUrl: string;
    internalLinkCount: number;
    anchors: { text: string; count: number }[];
    issues: string[];
    recommendation: string;
  }[];
  depthDistribution: {
    depth: number;
    pageCount: number;
    pages: string[];
  }[];
  siloHealth: SiloAnalysis[];
  actionPlan: {
    priority: number;
    type: string;
    action: string;
    sourceUrl: string;
    targetUrl: string;
    anchor: string;
  }[];
}

export interface PageLinkData {
  url: string;
  title: string;
  internalLinksIn: number;
  internalLinksOut: number;
  depth: number;
  pageType: string;
}

export interface SiloAnalysis {
  siloName: string;
  hubPage: string;
  spokePages: string[];
  crossLinkCount: number;
  health: string;
  recommendations: string[];
}

export interface OrphanPage {
  url: string;
  title: string;
  pageType: string;
  suggestedLinkSources: {
    sourceUrl: string;
    reason: string;
    suggestedAnchor: string;
  }[];
}

export interface LinkOpp {
  sourceUrl: string;
  sourceTitle: string;
  targetUrl: string;
  targetTitle: string;
  suggestedAnchor: string;
  reason: string;
  priority: string;
}

// Local Keyword Intel
export interface LocalKeywordIntel {
  cityOverview: {
    city: string;
    state: string;
    population: number;
    avgHomeValue: number;
    primarySearchPattern: string;
    opportunityScore: number;
    demographicNotes: string;
  }[];
  keywordVariationMatrix: KeywordVariation[];
  intentByCity: CityIntentBreakdown[];
  cityKeywords: {
    city: string;
    keywords: {
      keyword: string;
      volumeEstimate: string;
      competition: string;
      opportunity: string;
    }[];
    uniqueModifiers: string[];
    contentAngle: string;
  }[];
  propertyTypeDistribution: PropertyTypes[];
  seasonalTrends: SeasonalData[];
  emergingKeywords: {
    keyword: string;
    cities: string[];
    trend: string;
    growthPercent: number;
    recommendedAction: string;
  }[];
  competitorGapsByCity: {
    city: string;
    keywordGap: string;
    competitorRankingElsewhere: string;
    opportunity: string;
  }[];
  contentStrategy: CityContentStrategy[];
}

export interface KeywordVariation {
  baseKeyword: string;
  variations: {
    city: string;
    variation: string;
    volume: string;
  }[];
}

export interface CityIntentBreakdown {
  city: string;
  emergency: number;
  research: number;
  costPrice: number;
  brand: number;
}

export interface PropertyTypes {
  city: string;
  singleFamily: number;
  townhouse: number;
  condo: number;
  commercial: number;
}

export interface SeasonalData {
  city: string;
  monthlyTrend: { month: string; interest: number }[];
  peakMonth: string;
  insight: string;
}

export interface CityContentStrategy {
  city: string;
  positioningAngle: string;
  modifiersToUse: string[];
  propertyFocus: string;
  pricingLanguage: string;
  emergencyEmphasis: string;
  uniqueSellingPoints: string[];
  recommendedPageTitle: string;
  recommendedH1: string;
}

// Weather Trigger
export interface WeatherCheckResult {
  currentConditions: {
    city: string;
    state: string;
    temperature: number;
    feelsLike: number;
    conditions: string;
    humidity: number;
    windSpeed: number;
    riskLevel: string;
    activeTriggers: string[];
  }[];
  forecast: CityForecast[];
  activeAlerts: WeatherAlert[];
  upcomingRisks: any[];
}

export interface CityForecast {
  city: string;
  daily: {
    date: string;
    high: number;
    low: number;
    conditions: string;
    precipChance: number;
    precipAmount: number;
    riskLevel: string;
    riskType: string;
  }[];
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  affectedCities: string[];
  startTime: string;
  endTime: string;
  description: string;
  recommendedActions: string[];
  campaignTemplates: {
    googleAds: { headlines: string[]; descriptions: string[] };
    email: { subjectLines: string[]; bodyHtml: string };
    gbpPost: string;
    socialPosts: { platform: string; text: string }[];
    homepageBanner: string;
    smsTemplate: string;
  };
  acknowledged: boolean;
}

export interface TriggerConfig {
  id: string;
  type: string;
  condition: string;
  riskLevel: 'critical' | 'high' | 'medium';
  enabled: boolean;
}

// Google Ads Spy
export interface AdsSpyResult {
  overview: {
    totalAds: number;
    uniqueAdvertisers: number;
    avgPosition: number;
    lsaPresent: boolean;
    lsaCount: number;
  };
  ads: CompetitorAd[];
  headlines: SwipeFileItem[];
  descriptions: SwipeFileItem[];
  themes: {
    theme: string;
    frequency: number;
    totalAds: number;
    yourOpportunity: string;
  }[];
  missingAngles: {
    angle: string;
    whyItMatters: string;
  }[];
  landingPages: {
    competitor: string;
    url: string;
    pageSpeed: string;
    mobileExperience: string;
    ctaVisibility: string;
    formFields: number;
    trustSignalCount: number;
    trustSignals: string[];
  }[];
  generatedAds: GeneratedAdCopy;
  lsaAnalysis: {
    businessName: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    badges: string[];
  }[];
}

export interface CompetitorAd {
  advertiser: string;
  domain: string;
  position: number;
  adType: string;
  headlines: string[];
  descriptions: string[];
  displayUrl: string;
  landingPage: string;
  extensions: {
    call: boolean;
    location: boolean;
    sitelinks: number;
    callouts: boolean;
    structuredSnippets: boolean;
  };
  estimatedMonthlySpend: string;
}

export interface SwipeFileItem {
  text: string;
  usedBy: string[];
  characterCount: number;
}

export interface GeneratedAdCopy {
  headlines: { text: string; chars: number; note?: string }[];
  descriptions: { text: string; chars: number }[];
  differentiationStrategy: string[];
}

// SERP Feature Tracker
export interface SerpFeatureAnalysis {
  overview: SerpOverviewItem[];
  keywordAnalysis: {
    keyword: string;
    featuresPresent: string[];
    featuredSnippet?: {
      owner: string;
      type: string;
      content: string;
    };
    paaQuestions: string[];
    imagePackPresent: boolean;
    videoCarouselPresent: boolean;
    localPack?: {
      businesses: { position: number; name: string; rating: number; reviews: number }[];
      youAppear: boolean;
    };
  }[];
  featuredSnippetOpportunities: SnippetOpportunity[];
  paaQuestions: PAAQuestion[];
  localPackAnalysis: any[]; // Defined within usage or refine if needed
  imageOpportunities: {
    keyword: string;
    topSources: string[];
    yourImagesIndexed: boolean;
    recommendation: string;
  }[];
  videoOpportunities: {
    keyword: string;
    topChannels: string[];
    localCompetitorPresent: boolean;
    recommendation: string;
  }[];
  captureStrategy: {
    featuredSnippets: any[];
    paa: string[];
    localPack: string[];
    images: string[];
    videos: string[];
  };
}

export interface SerpOverviewItem {
  feature: string;
  keywordsWithFeature: number;
  totalKeywords: number;
  youOwn: number;
  competitorsOwn: number;
  opportunity: string;
}

export interface SnippetOpportunity {
  keyword: string;
  currentOwner: string;
  snippetType: string;
  contentNeeded: string;
  priority: string;
  targetPage: string;
}

export interface PAAQuestion {
  question: string;
  frequency: number;
  currentSource: string;
  targetPage: string;
}

// Content Writer
export interface ContentRequest {
  keyword: string;
  contentType: 'service' | 'location' | 'blog' | 'faq';
  location?: string;
  wordCount: number;
  tone: string;
  businessName: string;
  phoneNumber: string;
  briefData?: any;
}

export interface GeneratedContent {
  id: string;
  createdAt: string;
  title: string;
  content: string;
  sections: ContentSection[];
  analysis: {
    wordCount: number;
    primaryKeywordCount: number;
    secondaryKeywordCount: number;
    h2Count: number;
    h3Count: number;
    internalLinkOpportunities: string[];
    faqCount: number;
    readingLevel: number;
    localMentions: number;
  };
  seoChecklist: {
    item: string;
    passed: boolean;
  }[];
  metaData: {
    titleTag: string;
    titleLength: number;
    metaDescription: string;
    metaLength: number;
    urlSlug: string;
  };
  schema: any;
}

export interface ContentSection {
  id: string;
  name: string;
  content: string;
}

export interface SavedContent {
  id: string;
  title: string;
  keyword: string;
  type: string;
  location: string;
  createdAt: string;
  wordCount: number;
  status: string;
  data: GeneratedContent;
}

// Citation Manager
export interface BusinessNAP {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
}

export interface CitationAuditResult {
  healthScore: number;
  accuracy: number;
  coverage: number;
  consistency: number;
  summary: {
    verified: number;
    hasIssues: number;
    missing: number;
  };
  citations: CitationStatus[];
  issues: CitationIssue[];
  missingCitations: MissingCitation[];
  variations: any;
}

export interface CitationStatus {
  source: string;
  sourceUrl: string;
  category: string;
  domainAuthority: number;
  status: string; // verified, has_issues, missing
  nameMatch: boolean;
  addressMatch: boolean;
  phoneMatch: boolean;
  websiteMatch: boolean;
  foundName: string;
  foundAddress: string;
  foundPhone: string;
  foundWebsite: string;
  listingUrl: string;
  lastChecked: string;
}

export interface CitationIssue {
  source: string;
  field: string;
  current: string;
  shouldBe: string;
  impact: string;
  fixUrl: string;
}

export interface MissingCitation {
  source: string;
  domainAuthority: number;
  priority: string;
  category: string;
  buildUrl: string;
  estimatedTime: string;
}

// Lead Tracker
export interface Lead {
  id: string;
  createdAt: string;
  updatedAt: string;
  dateTime: string;
  leadType: 'phone' | 'form' | 'chat' | 'email';
  contactName: string;
  phoneNumber?: string;
  serviceNeeded?: string;
  city?: string;
  source?: string;
  landingPage?: string;
  keyword?: string;
  leadValue: number;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  notes?: string;
}

export interface LeadStats {
  summary: {
    totalLeads: number;
    wonLeads: number;
    pendingLeads: number;
    lostLeads: number;
    totalRevenue: number;
    avgLeadValue: number;
    winRate: number;
  };
  bySource: { source: string; leads: number; won: number; revenue: number; percentage: number }[];
  byPage: { page: string; leads: number; won: number; revenue: number; conversionRate: number }[];
  byKeyword: { keyword: string; leads: number; won: number; revenue: number }[];
  byService: { service: string; leads: number; avgValue: number; totalRevenue: number }[];
  byCity: { city: string; leads: number; won: number; revenue: number }[];
  monthlyTrend: { month: string; totalLeads: number; wonLeads: number; revenue: number }[];
}

export interface LeadSettings {
  defaultLeadValue: number;
  services: string[];
  cities: string[];
  sources: string[];
}

// Rich Result Analyzer
export interface SerpAnalysisResult {
  overview: FeatureOverview[];
  competitorResults: CompetitorRichResult[];
  quickWins: {
    yourPage: string;
    keyword: string;
    yourPosition: number;
    missingFeature: string;
    competitorWithFeature: { domain: string; position: number };
    priorityScore: number;
  }[];
  yourPagesEligibility: PageEligibility[];
  priorityActions: {
    priority: number;
    page: string;
    action: string;
    position: number;
    volume: number;
    ease: string;
    score: number;
  }[];
}

export interface FeatureOverview {
  featureType: string;
  competitorsWithFeature: number;
  youHaveCount: number;
  gap: number;
  quickWinCount: number;
}

export interface CompetitorRichResult {
  domain: string;
  url: string;
  keyword: string;
  city: string;
  position: number;
  richResults: { type: string; details: string }[];
  schemaFound: { type: string; code: any; isValid: boolean }[];
  analysisNotes: string[];
}

export interface PageEligibility {
  page: string;
  currentSchema: string[];
  eligibility: {
    featureType: string;
    eligible: boolean;
    reason: string;
    requirements: string[];
    fix: string;
  }[];
  issues: string[];
}

export interface SchemaGenerationInput {
  page: string;
  city?: string;
  schemaTypes: string[];
  businessInfo?: any;
}

export interface GeneratedSchema {
  page: string;
  combinedScript: string;
  validationStatus: string; // valid, warning, error
}

export interface RichResultHistoryEntry {
  id: string;
  date: string;
  domain: string;
  changeType: 'gained' | 'lost';
  keyword: string;
  city: string;
  featureType: string;
  details: string;
}

export interface RichResultAlert {
  id: string;
  type: string;
  date: string;
  read: boolean;
  message: string;
  details: any;
}

export interface SchemaPattern {
  id: string;
  name: string;
  schema: any;
}

// Google Integration
export interface GoogleAuthState {
  analytics: boolean;
  searchConsole: boolean;
  accountEmail?: string;
  lastSync?: string;
}

export interface GAAuditResult {
  properties: {
    propertyId: string;
    displayName: string;
    createTime: string;
    dataStreams: any[];
    healthScore: number;
    status: 'active' | 'duplicate' | 'archived';
    issues: string[];
  }[];
  duplicates: any[];
  trackingIssues: {
    domain: string;
    hasTag: boolean;
    tagId?: string;
    correctProperty: boolean;
    issues: string[];
  }[];
  conversionIssues: {
    name: string;
    event: string;
    lastTriggered: string;
    status: string;
    issueDetails?: string;
  }[];
  overallHealthScore: number;
}

export interface TrafficData {
  summary: {
    sessions: number;
    users: number;
    pageViews: number;
    avgDuration: string;
    bounceRate: number;
  };
  trend: { date: string; sessions: number }[];
  topPages: any[];
}

export interface GSCAuditResult {
  properties: {
    siteUrl: string;
    permissionLevel: string;
    verified: boolean;
    type: string;
    sitemaps: any[];
    coverageIssues: any[];
  }[];
  linkingStatus: {
    gaProperty: string;
    gscProperty: string;
    linked: boolean;
  }[];
  sitemapIssues: string[];
  totalCoverageIssues: number;
}

export interface SearchData {
  summary: {
    impressions: number;
    clicks: number;
    ctr: number;
    avgPosition: number;
  };
  topQueries: any[];
  positionDist: { range: string; count: number }[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'verified' | 'blocked';
  verificationType: string;
  verificationParams?: any;
  instructions: string;
  verifiedAt?: string;
}

export interface VerificationResult {
  passed: boolean;
  details: string[];
  diagnosis?: string;
  recommendedFix?: string;
}

// Ahrefs Integration
export interface AhrefsConfig {
  apiToken: string;
  primaryDomain: string;
  competitors: string[];
}

export interface AhrefsConnectionStatus {
  valid: boolean;
  plan: string;
  creditsUsed: number;
  creditsLimit: number;
  lastVerified: string;
}

export interface AhrefsDomainOverview {
  domain: string;
  domainRating: number;
  ahrefsRank: number;
  referringDomains: number;
  backlinks: number;
  organicKeywords: number;
  organicTraffic: number;
  trafficValue: number;
  lastUpdated: string;
}

export interface AhrefsDRHistory {
  date: string;
  dr: number;
}

export interface AhrefsBacklink {
  urlFrom: string;
  urlTo: string;
  domainRating: number;
  anchor: string;
  isDofollow: boolean;
  firstSeen: string;
  lastSeen: string;
}

export interface AhrefsAnchorText {
  anchor: string;
  backlinks: number;
  referringDomains: number;
  percentage: number;
}

export interface AhrefsKeywordRanking {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
  difficulty: number;
  cpc: number;
  change: number;
  history?: { date: string; position: number }[];
}

export interface AhrefsBacklinkGap {
  domain: string;
  domainRating: number;
  linksToCompetitors: { competitor: string; count: number }[];
  linksToYou: boolean;
}

export interface AhrefsKeywordGap {
  keyword: string;
  volume: number;
  difficulty: number;
  competitorRankings: { competitor: string; position: number }[];
  yourPosition: number | null;
}

// Keyword Opportunity Radar
export interface CitySubdomain {
  city: string;
  state: string;
  subdomain: string;
}

export interface CityPerformance {
  city: string;
  subdomain: string;
  totalKeywords: number;
  ranking: number;
  notRanking: number;
  avgPosition: number;
  totalVolume: number;
  capturedVolume: number;
  missedVolume: number;
  topOpportunity: string;
  score: number;
}

export interface TrackedKeyword {
  keyword: string;
  city: string;
  monthlyVolume: number;
  volumeTrend: "rising" | "stable" | "declining";
  trendPercent: number;
  difficulty: "low" | "medium" | "high";
  yourRank: number | null;
  topCompetitor: string;
  competitorRank: number;
  hasPage: boolean;
  recommendedUrl: string;
  priority: "critical" | "high" | "medium" | "low";
  seasonality: string;
  lastUpdated: string;
}

export interface PageRecommendation {
  keyword: string;
  city: string;
  suggestedTitle: string;
  suggestedUrl: string;
  estimatedVolume: number;
  difficulty: "low" | "medium" | "high";
  reason: string;
  competitorUrls: string[];
  priority: "critical" | "high" | "medium" | "low";
  projectedTraffic: number;
}

export interface KeywordCluster {
  name: string;
  keywords: string[];
  totalVolume: number;
  avgDifficulty: string;
  coverage: number;
}

export interface KeywordRadarResult {
  scanDate: string;
  cities: CityPerformance[];
  allKeywords: TrackedKeyword[];
  pageRecommendations: PageRecommendation[];
  clusters: KeywordCluster[];
  summary: {
    totalCities: number;
    totalKeywordsTracked: number;
    totalMonthlyVolume: number;
    capturedVolume: number;
    missedOpportunityVolume: number;
    pagesNeeded: number;
    topRisingKeywords: string[];
    seasonalAlerts: string[];
  };
  quickWins: {
    keyword: string;
    city: string;
    currentRank: number;
    volume: number;
    action: string;
  }[];
}

// Broken Link Finder
export interface BrokenLink {
  url: string;
  sourceUrl: string;
  anchorText: string;
  statusCode: number;
  type: "internal" | "external";
  severity: "critical" | "high" | "medium" | "low";
  lastWorking: string;
  suggestedFix: string;
}

export interface RedirectChain {
  originalUrl: string;
  hops: string[];
  finalUrl: string;
  totalHops: number;
  issue: string;
  fix: string;
}

export interface LinkBuildingOpportunity {
  competitorUrl: string;
  brokenUrl: string;
  originalTopic: string;
  linkingPages: number;
  domainAuthority: number;
  yourReplacementUrl: string | null;
  suggestedContent: string;
  outreachTemplate: string;
  priority: "high" | "medium" | "low";
}

export interface BrokenLinkCitationIssue {
  platform: string;
  profileUrl: string;
  issue: string;
  currentValue: string;
  expectedValue: string;
  impact: "high" | "medium" | "low";
  howToFix: string;
}

export interface BrokenLinkAuditResult {
  scanDate: string;
  domain: string;
  summary: {
    totalLinksChecked: number;
    brokenInternalLinks: number;
    brokenExternalLinks: number;
    redirectChains: number;
    orphanPages: number;
    linkBuildingOpportunities: number;
    citationIssues: number;
    healthScore: number;
  };
  brokenLinks: BrokenLink[];
  redirectChains: RedirectChain[];
  orphanPages: {
    url: string;
    title: string;
    hasContent: boolean;
    lastCrawled: string;
    recommendation: string;
  }[];
  linkBuildingOpportunities: LinkBuildingOpportunity[];
  citationIssues: BrokenLinkCitationIssue[];
  priorityActions: {
    immediate: string[];
    thisWeek: string[];
    thisMonth: string[];
  };
}

// Competitor Intelligence
export interface TrackedCompetitor {
  domain: string;
  name: string;
  overallScore: number;
  keywordsTracked: number;
  avgPosition: number;
  totalTraffic: number;
  recentChanges: number;
  trend: "improving" | "stable" | "declining";
}

export interface CompetitorChange {
  competitor: string;
  changeType: string;
  description: string;
  url: string;
  detectedDate: string;
  impact: "high" | "medium" | "low";
  relatedKeyword?: string;
  rankingEffect?: string;
  yourAction: string;
}

export interface KeywordBattle {
  keyword: string;
  monthlyVolume: number;
  yourRank: number | null;
  competitors: {
    domain: string;
    rank: number;
    change: number;
    url: string;
  }[];
  leader: string;
  gap: number;
  opportunity: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ContentComparison {
  keyword: string;
  yourUrl: string;
  topCompetitorUrl: string;
  metrics: {
    metric: string;
    yours: number;
    theirs: number;
    winner: "you" | "them" | "tie";
    importance: "critical" | "high" | "medium" | "low";
  }[];
  structureAnalysis: {
    element: string;
    yourCount: number;
    theirCount: number;
    recommendation: string;
  }[];
  missingTopics: string[];
  missingSchema: string[];
}

export interface ActionItem {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  category: "content" | "schema" | "backlinks" | "technical" | "local" | "speed";
  title: string;
  description: string;
  basedOn: string;
  expectedImpact: string;
  effort: "quick" | "moderate" | "significant";
  deadline: string;
  steps: string[];
  completed: boolean;
}

export interface CompetitorIntelligenceResult {
  scanDate: string;
  yourDomain: string;
  competitors: TrackedCompetitor[];
  recentChanges: CompetitorChange[];
  keywordBattles: KeywordBattle[];
  contentComparisons: ContentComparison[];
  backlinkIntelligence: any[]; 
  actionItems: ActionItem[];
  weeklyDigest: {
    biggestThreats: string[];
    quickWins: string[];
    competitorWins: string[];
    yourWins: string[];
    trendingSummary: string;
  };
  correlationInsights: {
    insight: string;
    evidence: string;
    recommendation: string;
  }[];
}

// Content Structure Analyzer
export interface PageContentAnalysis {
  url: string;
  rank: number;
  title: string;
  metaDescription: string;
  wordCount: number;
  readingTime: string;
  headings: {
    tag: string;
    text: string;
    wordCount: number;
    position: number;
    hasKeyword: boolean;
  }[];
  sections: {
    heading: string;
    headingTag: string;
    wordCount: number;
    hasImages: boolean;
    hasVideo: boolean;
    hasList: boolean;
    hasTable: boolean;
    hasSchema: boolean;
    keyTopics: string[];
  }[];
  media: {
    totalImages: number;
    imagesWithAlt: number;
    videos: number;
    infographics: number;
    tables: number;
    lists: number;
    codeBlocks: number;
  };
  schema: { type: string; present: boolean; completeness: string }[];
  internalLinks: number;
  externalLinks: number;
  keywordDensity: number;
  uniqueTopicsCovered: string[];
  contentScore: number;
  isYours?: boolean;
}

export interface ContentGap {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  competitorExample: string;
  recommendation: string;
  estimatedImpact: string;
}

export interface TopicCoverage {
  topic: string;
  yourCoverage: "full" | "partial" | "missing";
  competitorsCovering: number;
  importance: "essential" | "recommended" | "optional";
  suggestedWordCount: number;
}

export interface ContentTemplate {
  suggestedTitle: string;
  suggestedMetaDescription: string;
  recommendedWordCount: number;
  outlineHeadings: {
    tag: string;
    text: string;
    suggestedWordCount: number;
    keyPoints: string[];
  }[];
  requiredMedia: string[];
  requiredSchema: string[];
  internalLinkTargets: string[];
}

export interface ContentStructureResult {
  keyword: string;
  analyzedAt: string;
  yourPage: PageContentAnalysis | null;
  competitors: PageContentAnalysis[];
  gaps: ContentGap[];
  topicCoverage: TopicCoverage[];
  avgCompetitorWordCount: number;
  avgCompetitorSections: number;
  avgCompetitorImages: number;
  contentTemplate: ContentTemplate;
  quickWins: {
    action: string;
    effort: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
  }[];
  summary: {
    yourScore: number;
    avgCompetitorScore: number;
    biggestGap: string;
    topPriority: string;
  };
}

// Types needed for types.ts exports to fix errors
export interface CompetitorLinkProfile {
  domain: string;
  totalBacklinks: number;
  referringDomains: number;
  avgDomainAuthority: number;
  dofollowRatio: number;
  topAnchors: { text: string; percentage: number; count: number }[];
  linkVelocity: number;
  newLinksLast30Days: number;
  lostLinksLast30Days: number;
  topLinkingDomains: any[];
}

export interface LinkGap {
  domain: string;
  domainAuthority: number;
  linksToCompetitors: { competitor: string; count: number }[];
  linksToYou: number;
  opportunity: "high" | "medium" | "low";
  suggestedApproach: string;
  contactInfo: {
    email: string | null;
    contactPage: string | null;
  };
}

export interface OutreachTarget {
  priority: number;
  domain: string;
  domainAuthority: number;
  contactEmail: string | null;
  contactPage: string | null;
  linkingToCompetitors: string[];
  suggestedAngle: string;
  outreachTemplate: string;
  estimatedSuccessRate: number;
  potentialValue: "high" | "medium" | "low";
}

export interface LinkBuildingStrategy {
  strategyType: 'guest-post' | 'resource-page' | 'broken-link' | 'skyscraper' | 'digital-pr' | 'local-citation' | 'partnership';
  description: string;
  targets: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  estimatedImpact: 'low' | 'medium' | 'high';
  timeframe: string;
  steps: string[];
}

export interface AuthorityLinkResult {
  analyzedAt: string;
  yourDomain: string;
  yourProfile: {
    totalBacklinks: number;
    referringDomains: number;
    domainAuthority: number;
    dofollowRatio: number;
    avgLinkAuthority: number;
    topAnchors: { text: string; count: number }[];
  };
  competitors: CompetitorLinkProfile[];
  linkGaps: LinkGap[];
  outreachTargets: OutreachTarget[];
  strategies: LinkBuildingStrategy[];
  quickStats: {
    totalGapDomains: number;
    highValueOpportunities: number;
    avgCompetitorDA: number;
    yourDAGap: number;
    estimatedLinksNeeded: number;
  };
  summary: {
    biggestOpportunity: string;
    topPriority: string;
    competitorAdvantage: string;
    recommendedFocus: string;
  };
}

// Link Attribute Auditor Types
export interface LinkAttribute {
  rel: string[];
  isDofollow: boolean;
  isNofollow: boolean;
  isUGC: boolean;
  isSponsored: boolean;
}

export interface AuditedBacklink {
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  anchorType: 'exact-match' | 'partial-match' | 'branded' | 'naked-url' | 'generic' | 'image' | 'empty';
  attributes: LinkAttribute;
  placement: 'in-content' | 'sidebar' | 'footer' | 'header' | 'comment' | 'author-bio' | 'directory' | 'forum-signature';
  contextSnippet: string;
  domainAuthority: number;
  pageAuthority: number;
  spamScore: number;
  topicalRelevance: 'high' | 'medium' | 'low' | 'none';
  linkAge: string;
  isLive: boolean;
  trafficEstimate: number;
  qualityScore: number;
  issues: string[];
  recommendation: 'keep' | 'monitor' | 'disavow' | 'fix';
}

export interface AnchorTextAnalysis {
  distribution: {
    type: string;
    count: number;
    percentage: number;
    examples: string[];
    status: 'healthy' | 'warning' | 'danger';
  }[];
  overOptimized: boolean;
  brandedRatio: number;
  exactMatchRatio: number;
  recommendations: string[];
}

export interface LinkPlacementAnalysis {
  distribution: {
    placement: string;
    count: number;
    percentage: number;
    avgQuality: number;
  }[];
  inContentRatio: number;
  recommendations: string[];
}

export interface ToxicLinkReport {
  totalToxicLinks: number;
  toxicDomains: {
    domain: string;
    linkCount: number;
    spamScore: number;
    toxicSignals: string[];
    recommendation: string;
  }[];
  disavowFileContent: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface LinkVelocityData {
  month: string;
  newLinks: number;
  lostLinks: number;
  netGain: number;
}

export interface LinkHealthScore {
  overall: number;
  components: {
    name: string;
    score: number;
    weight: number;
    status: 'good' | 'warning' | 'critical';
    description: string;
  }[];
}

export interface LinkAttributeAuditResult {
  auditedAt: string;
  domain: string;
  totalBacklinks: number;
  totalReferringDomains: number;
  backlinks: AuditedBacklink[];
  anchorAnalysis: AnchorTextAnalysis;
  placementAnalysis: LinkPlacementAnalysis;
  toxicReport: ToxicLinkReport;
  linkVelocity: LinkVelocityData[];
  healthScore: LinkHealthScore;
  attributeBreakdown: {
    dofollow: number;
    nofollow: number;
    ugc: number;
    sponsored: number;
  };
  domainAuthorityDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  topIssues: {
    issue: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    affectedLinks: number;
    recommendation: string;
  }[];
  actionItems: {
    priority: number;
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    linksAffected: number;
  }[];
  summary: {
    healthStatus: 'healthy' | 'needs-attention' | 'at-risk' | 'critical';
    biggestIssue: string;
    topPriority: string;
    quickWin: string;
  };
}

// Automated SEO Health Monitor Types
export interface SEOAlert {
  id: string;
  timestamp: string;
  type: 'ranking_drop' | 'ranking_gain' | 'new_competitor' | 'lost_backlink' | 'new_backlink' | 'content_change' | 'technical_issue' | 'traffic_anomaly' | 'competitor_action' | 'opportunity';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  metric: string;
  previousValue: string | number;
  currentValue: string | number;
  change: string;
  affectedKeywords?: string[];
  affectedPages?: string[];
  recommendedAction: string;
  actionUrl?: string;
  isRead: boolean;
  isActioned: boolean;
}

export interface RankingSnapshot {
  keyword: string;
  currentRank: number | null;
  previousRank: number | null;
  change: number;
  trend: 'up' | 'down' | 'stable' | 'new' | 'lost';
  url: string;
  searchVolume: number;
  competitors: {
    domain: string;
    rank: number;
    change: number;
  }[];
}

export interface TrafficMetrics {
  period: string;
  organicSessions: number;
  previousPeriod: number;
  change: number;
  changePercent: number;
  topPages: {
    url: string;
    sessions: number;
    change: number;
  }[];
  topKeywords: {
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
}

export interface BacklinkHealth {
  totalBacklinks: number;
  newLast7Days: number;
  lostLast7Days: number;
  toxicLinks: number;
  avgDomainAuthority: number;
  topNewLinks: {
    domain: string;
    da: number;
    anchor: string;
    date: string;
  }[];
  recentlyLost: {
    domain: string;
    da: number;
    reason: string;
    date: string;
  }[];
}

export interface TechnicalHealth {
  overallScore: number;
  issues: {
    category: string;
    severity: 'critical' | 'warning' | 'info';
    count: number;
    description: string;
  }[];
  coreWebVitals: {
    lcp: { value: number; status: 'good' | 'needs-improvement' | 'poor' };
    fid: { value: number; status: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; status: 'good' | 'needs-improvement' | 'poor' };
  };
  indexationStatus: {
    indexed: number;
    notIndexed: number;
    pending: number;
  };
  crawlErrors: number;
}

export interface CompetitorMovement {
  domain: string;
  changes: {
    type: 'new_content' | 'ranking_change' | 'new_backlinks' | 'technical_update';
    description: string;
    impact: 'high' | 'medium' | 'low';
    date: string;
  }[];
  threatLevel: 'high' | 'medium' | 'low';
  keywordsGained: string[];
  keywordsLost: string[];
}

export interface ActionChecklist {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'technical' | 'content' | 'links' | 'local' | 'competitor-response';
  title: string;
  description: string;
  estimatedImpact: string;
  estimatedEffort: string;
  dueDate: string;
  relatedAlerts: string[];
  steps: string[];
  isCompleted: boolean;
  completedDate?: string;
}

export interface WeeklyDigest {
  weekOf: string;
  overallHealthChange: number;
  highlights: string[];
  concerns: string[];
  opportunities: string[];
  rankingsSummary: {
    improved: number;
    declined: number;
    stable: number;
    newRankings: number;
    lostRankings: number;
  };
  trafficSummary: {
    totalSessions: number;
    change: number;
    topGrowthPage: string;
    topDeclinePage: string;
  };
  backlinkSummary: {
    gained: number;
    lost: number;
    netChange: number;
  };
  competitorSummary: string;
  topActions: ActionChecklist[];
}

export interface SEOHealthMonitorResult {
  monitoredAt: string;
  domain: string;
  overallHealthScore: number;
  healthTrend: 'improving' | 'stable' | 'declining';
  alerts: SEOAlert[];
  rankings: RankingSnapshot[];
  traffic: TrafficMetrics;
  backlinks: BacklinkHealth;
  technical: TechnicalHealth;
  competitors: CompetitorMovement[];
  actionChecklist: ActionChecklist[];
  weeklyDigest: WeeklyDigest;
  quickStats: {
    rankingsUp: number;
    rankingsDown: number;
    newAlerts: number;
    criticalIssues: number;
    pendingActions: number;
    competitorThreats: number;
  };
}