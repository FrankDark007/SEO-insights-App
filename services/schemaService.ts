import { BusinessProfile, SchemaOutput, ServiceItem, FaqItem } from "../types";

export const generateSchemas = (profile: BusinessProfile): SchemaOutput => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Validation
  if (!profile.businessName) errors.push("Business Name is required.");
  if (!profile.address) errors.push("Street Address is required.");
  if (!profile.services || profile.services.length === 0) warnings.push("Adding services helps Google understand your offerings.");
  if (!profile.logoUrl) warnings.push("A logo URL is recommended for brand recognition.");
  if (!profile.latitude || !profile.longitude) warnings.push("Geo-coordinates are highly recommended for local ranking.");

  const cleanPhone = profile.phone; // Assuming basic cleaning or pass through

  // 1. LocalBusiness Schema
  const localBusiness: any = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", profile.type.replace(/\s+/g, '')], // Try to match schema type or fallback
    "name": profile.businessName,
    "image": profile.imageUrl,
    "logo": profile.logoUrl,
    "@id": `${profile.website}#localbusiness`,
    "url": profile.website,
    "telephone": cleanPhone,
    "email": profile.email,
    "priceRange": profile.priceRange,
    "description": profile.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": profile.address,
      "addressLocality": profile.city,
      "addressRegion": profile.state,
      "postalCode": profile.zip,
      "addressCountry": "US"
    },
    "openingHoursSpecification": profile.hours247 ? [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ] : [], // Simplified for this demo
  };

  if (profile.latitude && profile.longitude) {
    localBusiness.geo = {
      "@type": "GeoCoordinates",
      "latitude": profile.latitude,
      "longitude": profile.longitude
    };
  }

  if (profile.serviceArea) {
    const areas = profile.serviceArea.split(',').map(s => s.trim());
    localBusiness.areaServed = areas.map(city => ({
        "@type": "City",
        "name": city
    }));
  }

  if (profile.rating && profile.reviewCount) {
    localBusiness.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": profile.rating,
        "reviewCount": profile.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
    };
  }

  // 2. Service Schema
  const servicesSchema = profile.services.map(service => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
        "@id": `${profile.website}#localbusiness`
    },
    "serviceType": service.name,
    "areaServed": localBusiness.areaServed,
    "url": service.url
  }));

  // 3. FAQ Schema
  let faqSchema = undefined;
  if (profile.faqs && profile.faqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": profile.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // 4. Organization Schema (Brand)
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": profile.businessName,
    "url": profile.website,
    "logo": profile.logoUrl,
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": cleanPhone,
        "contactType": "customer service"
    }
  };

  // Combine Scripts
  const allSchemas = [localBusiness, ...servicesSchema, organization];
  if (faqSchema) allSchemas.push(faqSchema);
  
  const combined = `<script type="application/ld+json">\n${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": allSchemas
  }, null, 2)}\n</script>`;

  return {
    localBusiness,
    services: servicesSchema,
    faq: faqSchema,
    organization,
    combined,
    warnings,
    errors
  };
};