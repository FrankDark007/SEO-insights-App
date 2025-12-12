// Common
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisState {
  isLoading: boolean;
  data: string | null;
  groundingMetadata: { groundingChunks: GroundingChunk[] } | null;
  error: string | null;
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
  nearbyAreas?: string[];
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
export interface ServiceItem {
  name: string;
  description: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

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
  yearEstablished?: string;
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

export interface SchemaOutput {
  localBusiness: any;
  services: any[];
  faq?: any;
  organization: any;
  combined: string;
  warnings: string[];
  errors: string[];
}

// Rank Tracker
export interface SerpResult {
  position: number;
  url: string;
  domain: string;
  title: string;
  isYou: boolean;
}

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

export interface StoredRankData {
  domain: string;
  location: string;
  keywords: string[];
  history: {
    [keyword: string]: { date: string; position: number | null }[];
  };
  lastChecked: string;
}

// GBP Audit
export interface ProfileMetric {
  metric: string;
  you: number;
  competitorAvg: number;
  leader: number;
  max: number;
  unit: string;
}

export interface GBPAuditResult {
  mapPackSnapshot: {
    rank: number;
    businessName: string;
    rating: number;
    reviewCount: number;
    responseRate: number | null;
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

// Review Analyzer
export interface Theme {
  theme: string;
  frequency: number;
  exampleQuote: string;
}

export interface ThemeWithOpportunity extends Theme {
  yourOpportunity: string;
}

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

// Backlink Gap
export interface LinkOpportunity {
  linkingDomain: string;
  domainAuthority: number;
  linksTo: string[];
  linkType: string;
  acquisitionDifficulty: string;
  linkUrl?: string;
  anchorTextUsed?: string;
}

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

// Content Gap Matrix
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
  competitorCoverage: {
    domain: string;
    coverage: { city: string; service: string; url: string }[];
  }[];
}

// Competitor Alerts
export interface Alert {
  id: string;
  type: 'new_page' | 'title_change' | 'meta_change' | 'review_change' | 'rating_change' | 'gbp_post' | 'new_backlink' | 'baseline' | 'schema_change';
  severity: 'high' | 'medium' | 'low';
  competitor: string;
  details: {
    url?: string;
    newValue?: string | number;
    oldValue?: string | number;
    change?: number;
  };
  detectedAt: string;
  recommendedResponse?: string;
  addressed: boolean;
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
    lastPostDate?: string;
  };
  estimatedBacklinks: number;
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

export interface AlertCheckResult {
  domain: string;
  checkedAt: string;
  alerts: Alert[];
  currentSnapshot: CompetitorSnapshot;
}

// Internal Link Optimizer
export interface PageLinkData {
  url: string;
  title: string;
  internalLinksIn: number;
  internalLinksOut: number;
  depth: number;
  pageType: string;
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
  priority: 'high' | 'medium' | 'low';
}

export interface SiloAnalysis {
  siloName: string;
  hubPage: string;
  spokePages: string[];
  crossLinkCount: number;
  health: string;
  recommendations: string[];
}

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
  depthDistribution: { depth: number; pageCount: number; pages: string[] }[];
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

// Local Keyword Intel
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

export interface KeywordVariation {
  baseKeyword: string;
  variations: {
    city: string;
    variation: string;
    volume: string;
  }[];
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
    keywords: { keyword: string; volumeEstimate: string; competition: string; opportunity: string }[];
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

// Weather Triggers
export interface TriggerConfig {
  id: string;
  type: string;
  condition: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
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

export interface CityForecast {
  city: string;
  daily: {
    date: string;
    high: number;
    low: number;
    conditions: string;
    precipChance: number;
    precipAmount: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskType: string;
  }[];
}

export interface WeatherCheckResult {
  currentConditions: {
    city: string;
    state: string;
    temperature: number;
    feelsLike: number;
    conditions: string;
    humidity: number;
    windSpeed: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    activeTriggers: string[];
  }[];
  forecast: CityForecast[];
  activeAlerts: WeatherAlert[];
  upcomingRisks: {
    date: string;
    cities: string[];
    riskType: string;
    riskLevel: string;
    description: string;
  }[];
}

// Google Ads Spy
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

// SERP Features
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
  priority: 'high' | 'medium' | 'low';
  targetPage: string;
}

export interface PAAQuestion {
  question: string;
  frequency: number;
  currentSource: string;
  targetPage: string;
}

export interface SerpFeatureAnalysis {
  overview: SerpOverviewItem[];
  keywordAnalysis: {
    keyword: string;
    featuresPresent: string[];
    featuredSnippet?: { owner: string; type: string; content: string };
    paaQuestions: string[];
    localPack?: {
      businesses: { position: number; name: string; rating: number; reviews: number }[];
      youAppear: boolean;
    };
    imagePackPresent: boolean;
    videoCarouselPresent: boolean;
  }[];
  featuredSnippetOpportunities: SnippetOpportunity[];
  paaQuestions: PAAQuestion[];
  localPackAnalysis: {
    keyword: string;
    businesses: { position: number; name: string; rating: number; reviews: number }[];
    youAppear: boolean;
  }[];
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
    featuredSnippets: {
      keyword: string;
      type: string;
      formatNeeded: string;
      pageToOptimize: string;
      contentTemplate: string;
    }[];
    paa: string[];
    localPack: string[];
    images: string[];
    videos: string[];
  };
}

// Content Writer
export interface ContentRequest {
  keyword: string;
  contentType: string;
  location?: string;
  wordCount: number;
  tone: string;
  businessName: string;
  phoneNumber: string;
  briefData?: any;
}

export interface ContentSection {
  id: string;
  name: string;
  content: string;
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
  seoChecklist: { item: string; passed: boolean }[];
  metaData: {
    titleTag: string;
    titleLength: number;
    metaDescription: string;
    metaLength: number;
    urlSlug: string;
  };
  schema: {
    localBusiness: any;
    service: any;
    faq: any;
    breadcrumb: any;
  };
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

export interface CitationStatus {
  source: string;
  sourceUrl: string;
  category: string;
  domainAuthority: number;
  status: 'verified' | 'has_issues' | 'missing';
  nameMatch: boolean;
  addressMatch: boolean;
  phoneMatch: boolean;
  websiteMatch: boolean;
  foundName: string;
  foundAddress: string;
  foundPhone: string;
  foundWebsite: string;
  listingUrl?: string;
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
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  buildUrl: string;
  estimatedTime: string;
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
  variations: {
    names: { value: string; count: number; isPreferred: boolean }[];
    addresses: { value: string; count: number; isPreferred: boolean }[];
    phones: { value: string; count: number; isPreferred: boolean }[];
  };
}

// Rich Results & Schema
export interface SchemaPattern {
  name: string;
  type: string;
  code: any;
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

export interface SchemaGenerationInput {
  page: string;
  city: string;
  schemaTypes: string[];
  businessInfo: {
    name: string;
    phone: string;
    address: string;
    rating?: number;
    reviewCount?: number;
  };
}

export interface GeneratedSchema {
  page: string;
  combinedScript: string;
  validationStatus: 'valid' | 'warning' | 'error';
  warnings: string[];
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

export interface QuickWin {
  yourPage: string;
  keyword: string;
  yourPosition: number;
  missingFeature: string;
  competitorWithFeature: { domain: string; position: number };
  priorityScore: number;
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

export interface SerpAnalysisResult {
  overview: FeatureOverview[];
  competitorResults: CompetitorRichResult[];
  quickWins: QuickWin[];
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

// Google Integrations
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
    dataStreams: { streamId: string; streamName: string; type: string; webStreamData?: { measurementId: string; defaultUri: string }; status: string }[];
    healthScore: number;
    status: 'active' | 'duplicate' | 'orphaned';
    issues: string[];
  }[];
  duplicates: {
    name: string;
    properties: any[];
    reason: string;
  }[];
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
    status: 'working' | 'misconfigured';
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
  topPages: { path: string; sessions: number; conversions: number; convRate: number }[];
}

export interface GSCAuditResult {
  properties: {
    siteUrl: string;
    permissionLevel: string;
    verified: boolean;
    type: string;
    sitemaps: { path: string; lastSubmitted: string; status: string; urlsSubmitted: number; urlsIndexed: number }[];
    coverageIssues: { type: string; count: number; examples: string[] }[];
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
  topQueries: { query: string; impressions: number; clicks: number; position: number }[];
  positionDist: { range: string; count: number }[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'verified' | 'completed' | 'blocked';
  verificationType: 'tracking' | 'conversion' | 'gsc_verification' | 'manual';
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

// Leads
export interface LeadSettings {
    defaultLeadValue: number;
    services: string[];
    cities: string[];
    sources: string[];
}

export interface Lead {
    id: string;
    dateTime: string;
    leadType: 'phone' | 'form' | 'chat' | 'email';
    contactName: string;
    phoneNumber: string;
    serviceNeeded: string;
    city: string;
    source: string;
    landingPage?: string;
    keyword?: string;
    leadValue: number;
    status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
    notes?: string;
    createdAt: string;
    updatedAt: string;
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
    bySource: {
        source: string;
        leads: number;
        won: number;
        revenue: number;
        percentage: number;
    }[];
    byPage: {
        page: string;
        leads: number;
        won: number;
        revenue: number;
        conversionRate: number;
    }[];
    byKeyword: {
        keyword: string;
        leads: number;
        won: number;
        revenue: number;
    }[];
    byService: {
        service: string;
        leads: number;
        avgValue: number;
        totalRevenue: number;
    }[];
    byCity: {
        city: string;
        leads: number;
        won: number;
        revenue: number;
    }[];
    monthlyTrend: {
        month: string;
        totalLeads: number;
        wonLeads: number;
        revenue: number;
    }[];
}

// Ahrefs
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

export interface AhrefsReferringDomain {
    domain: string;
    domainRating: number;
    backlinks: number;
}
