# Singapore Badminton SEO Audit Report

Date: 2026-08-25

## Executive Summary

Elever Badminton has a strong foundation for Singapore badminton search demand: dedicated pages for classes, camps, events, coaches, a Singapore badminton hub, and contact conversion. The main SEO gaps were missing canonical URLs, incomplete social metadata, thin structured data, JavaScript-rendered high-value content, sample/placeholder content, and incomplete local business proof signals.

This audit covers the static website codebase. It does not include live keyword rankings, Google Business Profile performance, citation consistency, backlink toxicity, or Core Web Vitals field data because those require access to external platforms such as Google Search Console, Google Business Profile, Google Analytics, PageSpeed Insights field data, Ahrefs/Semrush/Moz, and citation tools.

## Target Audience

- Singapore-based badminton players looking for coaching, courts, training groups, and events.
- Parents looking for junior badminton classes, holiday camps, and competitive development pathways.
- Schools, companies, condominiums, and community groups looking for badminton clinics, carnivals, and tournaments.
- Recreational players searching for badminton courts for rent in Singapore and family-friendly places to play.

## Priority Keyword Strategy

### High-Intent Commercial Keywords
- badminton coaching Singapore
- badminton classes Singapore
- junior badminton training Singapore
- kids badminton classes Singapore
- private badminton coaches Singapore
- private badminton coaching Singapore
- badminton academy Singapore
- beginner badminton lessons Singapore
- badminton training for kids Singapore
- competitive badminton training Singapore

### Camps And Events Keywords
- holiday badminton camp Singapore
- kids badminton camp Singapore
- school holiday badminton camp Singapore
- corporate badminton event Singapore
- school badminton clinic Singapore
- badminton carnival Singapore
- badminton tournament organiser Singapore
- upcoming badminton tournaments Singapore

### Court And Local Discovery Keywords
- badminton courts for rent in Singapore
- badminton court booking Singapore
- family badminton courts Singapore
- family badminton courts in central Singapore
- badminton courts near MRT Singapore
- badminton courts in Central Singapore
- badminton courts in East Singapore
- badminton courts in West Singapore
- badminton courts in North Singapore
- badminton courts in North-East Singapore

### Location Long-Tail Keywords
- badminton classes near Newton
- badminton training near Woodleigh
- badminton classes Jurong East
- badminton classes Sengkang
- badminton training near Aljunied
- badminton courts near Expo
- badminton coaching near Dakota

## Prioritized Audit Findings

### Critical
- Sample and placeholder content is still visible on several pages and can harm trust if indexed.
- Real business NAP data is incomplete: phone, verified WhatsApp number, official address, and Google Maps profile are not fully present.
- Google Business Profile status cannot be verified from the repository.
- Current keyword rankings, impressions, CTR, and cannibalization cannot be verified without Search Console access.

### High
- Key content is still partly JavaScript-rendered, including schedule, coaches, hub venues, events, camps, and articles. Google can render JavaScript, but static HTML is still safer for crawl discovery and snippets.
- News article cards have slugs in data but no dedicated indexable article URLs.
- Event/camp data is not yet complete enough for real `Event` schema with verified dates, ticket pricing, locations, and registration URLs.
- Local citation health and Google Maps/local pack performance cannot be validated without external listing tools and GBP access.
- Contact conversion depends on placeholder WhatsApp details until the real number is provided.

### Medium
- Some page H1s are brand-led and should continue to include nearby keyword-specific copy.
- Coach profile descriptions were previously truncated mechanically; this has been improved in the generator, but custom `seoDescription` fields would be better.
- Internal links are still injected by JavaScript. Search engines can render them, but static navigation would be stronger for conservative crawlability.
- Backlink profile quality is unknown without a link index export.

### Low
- `robots.txt` is valid but minimal.
- Social metadata previously lacked page URLs/images; this has been fixed.
- Sitemap previously lacked `lastmod`; this has been fixed.

## Implemented Fixes

### Metadata
- Added canonical URLs to root pages and coach pages.
- Added `og:url`, `og:image`, `twitter:title`, `twitter:description`, and `twitter:image`.
- Updated coach page generator so future generated coach pages preserve canonical and social metadata.

### Structured Data
- Expanded homepage JSON-LD to describe Elever as a Singapore sports/local business with service areas and offer catalog.
- Added `Course` schema to Classes.
- Added `Service` schema to Camps.
- Added `Service` schema to Events.
- Added `FAQPage` schema to Contact using only answers that are not marked as unfinished.
- Improved coach `Person` schema with canonical URL and absolute image URL.

### Crawlability And Indexation
- Added Contact to the primary navigation.
- Added `lastmod` values to sitemap URLs.
- Removed the unfinished Privacy page from the sitemap and added `noindex,follow`.
- Added static local keyword copy to Classes and Hub so critical Singapore/local intent is visible before JavaScript rendering.

### Mobile And Conversion SEO
- Previous mobile pass improved 16px base font sizing, 48px tap targets, field-level validation, no horizontal overflow safeguards, and mobile-native form input types.

## Page-Level Recommendations

### Homepage
- Primary target: `badminton coaching Singapore`.
- Add one concise static section explaining who the academy serves: juniors, adults, parents, schools, companies.
- Replace sample testimonials with real named/initialed testimonials and add Review schema only when real and permissioned.

### Classes
- Primary targets: `badminton classes Singapore`, `junior badminton training Singapore`, `private badminton coaches Singapore`.
- Pre-render the full class schedule in static HTML.
- Add separate landing sections for Central, East, West, North, and North-East classes.
- Add price/availability content once verified.

### Camps
- Primary targets: `holiday badminton camp Singapore`, `kids badminton camp Singapore`.
- Replace sample camp blocks with real dates, venues, prices, and booking links.
- Add `Event` schema only after dates, locations, price, and registration URLs are verified.

### Events
- Primary targets: `corporate badminton event Singapore`, `school badminton clinic Singapore`, `badminton tournament organiser Singapore`.
- Add case studies with photos, outcomes, headcount, and client type.
- Add event package pricing or enquiry tiers once approved.

### Hub
- Primary targets: `badminton courts for rent in Singapore`, `badminton court booking Singapore`.
- Generate static venue pages or static venue sections for each region.
- Add internal links from court guide content to classes near the same area.

### Contact
- Primary target: conversion from class/camp/event searches.
- Add real phone and WhatsApp details.
- Add map/profile links after Google Business Profile is confirmed.
- Remove unfinished policy notes before public launch.

### News
- Create dedicated article pages for each article slug.
- Add Article schema and include article URLs in the sitemap.
- Build topical clusters for parents, beginners, court booking, tournaments, and equipment.

### Coach Pages
- Add coach-specific achievements, certifications, specialties, testimonials, and relevant training level links.
- Add custom `seoDescription` fields instead of generic descriptions.

## Local SEO Action Plan

### Google Business Profile
- Verify business name, category, service areas, website URL, phone, email, hours, photos, and booking/contact links.
- Recommended categories: Badminton club, Sports school, Sports activity location, Coaching center where applicable.
- Add services: badminton coaching, junior badminton classes, private badminton coaching, holiday badminton camps, corporate badminton events.
- Publish weekly posts for camps, class availability, and events.

### NAP And Citations
- Confirm one canonical NAP format before submitting to directories.
- Audit and update Singapore directories, sports portals, school/community directories, and event platforms.
- Track citation URL, status, NAP match, login owner, and update date in a shared spreadsheet.

### Maps And Local Pack
- Track target terms weekly in target areas: Central, East, West, North, North-East.
- Track both branded and non-branded queries.
- Collect parent/player reviews that mention location and service naturally, without scripting or incentives that violate platform policies.

## Content Roadmap

### Month 1
- Parent guide: `How to choose badminton classes for kids in Singapore`.
- Beginner guide: `Beginner badminton lessons in Singapore: what to expect`.
- Court guide: `Best badminton courts for rent in Singapore by region`.
- Class page static schedule expansion.

### Month 2
- Location guides for Central, East, West, North, and North-East Singapore.
- Private coaching guide: `Private badminton coaching in Singapore: when it helps`.
- Holiday camp guide with real dates and booking details.

### Month 3
- Event guide: `How to run a corporate badminton carnival in Singapore`.
- Tournament guide: `Upcoming badminton tournaments in Singapore`.
- Coach profile expansions with achievements and real testimonials.
- News/article static page generation.

## Off-Page SEO Plan

### Link Targets
- Singapore sports associations and badminton clubs.
- Schools, CCAs, parent groups, and community centres.
- Corporate wellness partners.
- Condo and community event platforms.
- Parenting blogs and local activity directories.
- Event listing sites for camps, clinics, and tournaments.

### Toxic Link Review
- Export backlinks from Ahrefs, Semrush, Moz, or Google Search Console.
- Flag links from spam networks, irrelevant foreign directories, adult/gambling domains, and duplicated scraped pages.
- Disavow only when a clear harmful pattern exists; do not disavow normal low-authority local mentions.

## 90-Day Validation Plan

### Week 1
- Submit updated sitemap in Google Search Console.
- Run URL Inspection for homepage, classes, camps, events, hub, contact, and representative coach pages.
- Validate schema with Google Rich Results Test and Schema.org Validator.
- Run Lighthouse mobile tests on deployed pages.

### Weeks 2-4
- Track impressions, clicks, CTR, average position, indexed pages, and crawl errors.
- Monitor conversions from organic traffic: class enquiry, trial booking, WhatsApp click, email click, event proposal request.
- Fix any mobile usability or Core Web Vitals warnings.

### Weeks 5-8
- Publish first parent, beginner, court, and camp guides.
- Add real GBP posts and collect new reviews.
- Start citation cleanup and partner outreach.

### Weeks 9-12
- Compare rankings for the priority keywords listed above.
- Compare organic conversion rate and assisted conversions.
- Review top exit pages and low-CTR queries for title/meta rewrites.
- Decide which content cluster to expand next based on impressions and conversions.

## Success Metrics

- 100% of indexable pages have canonical URLs, unique titles, meta descriptions, and social metadata.
- 100% of commercial pages include relevant Singapore-specific target phrases naturally in static HTML.
- Google Search Console reports no sitemap errors and no unexpected noindex conflicts.
- Local business data is consistent across GBP, website, and citations.
- Organic clicks and qualified enquiries from Singapore badminton terms increase within 90 days.
- Core mobile pages pass Lighthouse performance and accessibility targets after deployment.
