import { ChecklistItem, GAAuditResult, GSCAuditResult, VerificationResult } from "../types";

export const generateChecklist = (gaAudit: GAAuditResult, gscAudit: GSCAuditResult): ChecklistItem[] => {
  const checklist: ChecklistItem[] = [];

  // 1. Critical: Tracking
  gaAudit.trackingIssues.forEach(issue => {
      if (!issue.hasTag) {
          checklist.push({
              id: `track-${issue.domain}`,
              title: `Install GA4 tracking on ${issue.domain}`,
              description: "You are not collecting any analytics data for this subdomain.",
              priority: "critical",
              status: "not_started",
              verificationType: "tracking",
              verificationParams: { domain: issue.domain },
              instructions: "Add the GA4 configuration tag to the <head> section of all pages on this subdomain."
          });
      }
  });

  // 2. Critical: Linking
  const primaryLink = gscAudit.linkingStatus.find(l => l.gaProperty === "Flood Doctor - Production");
  if (primaryLink && !primaryLink.linked) {
      checklist.push({
          id: "link-ga-gsc",
          title: "Link GA4 to Search Console",
          description: "Primary GA property not linked to Search Console. You are missing organic search query data in GA.",
          priority: "critical",
          status: "not_started",
          verificationType: "manual",
          instructions: "Go to GA4 Admin > Product Links > Search Console Links and connect your property."
      });
  }

  // 3. High: Conversions
  gaAudit.conversionIssues.forEach(issue => {
      if (issue.status === 'misconfigured') {
          checklist.push({
              id: `conv-${issue.name}`,
              title: `Fix broken "${issue.name}" conversion`,
              description: issue.issueDetails || "Conversion not triggering.",
              priority: "high",
              status: "in_progress",
              verificationType: "conversion",
              verificationParams: { event: issue.event },
              instructions: "Check your event parameters and page path filters in GA4 Admin > Events > Conversions."
          });
      }
  });

  // 4. High: GSC Verification
  gscAudit.properties.forEach(prop => {
      if (!prop.verified) {
          checklist.push({
              id: `verify-${prop.siteUrl}`,
              title: `Verify ${prop.siteUrl} in Search Console`,
              description: "Property added but not verified. No data accessible.",
              priority: "high",
              status: "not_started",
              verificationType: "gsc_verification",
              verificationParams: { url: prop.siteUrl },
              instructions: "Download the HTML verification file and upload it to your root directory, or add the DNS TXT record."
          });
      }
  });

  // 5. Medium: Duplicates
  gaAudit.duplicates.forEach(group => {
      checklist.push({
          id: `dup-${group.name}`,
          title: `Resolve duplicate "${group.name}" properties`,
          description: "Multiple properties found for same business entity.",
          priority: "medium",
          status: "not_started",
          verificationType: "manual",
          instructions: "Decide on a single primary property and move others to trash or rename them as 'Archived'."
      });
  });

  return checklist;
};

export const verifyChecklistItem = async (item: ChecklistItem): Promise<VerificationResult> => {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (item.verificationType === 'tracking') {
        // Mock successful verification
        return {
            passed: true,
            details: [
                "GA4 tag detected: Yes",
                "Tag type: gtag.js",
                "Measurement ID: G-ABC123XYZ",
                "Data receiving: Yes (3 events in last hour)"
            ]
        };
    }

    if (item.verificationType === 'conversion') {
        // Mock failed verification for demo purposes
        return {
            passed: false,
            details: [
                "Conversion configured: Yes",
                "Event name: page_view",
                "Page path filter: /contact-us",
                "Events matching filter in last 7 days: 0"
            ],
            diagnosis: "Your contact page URL appears to be '/contact/' not '/contact-us'.",
            recommendedFix: "Update conversion page_path filter from '/contact-us' to '/contact/'."
        };
    }

    return {
        passed: true,
        details: ["Manual verification confirmed.", "Settings updated successfully."]
    };
};