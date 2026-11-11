// Realistic demo data for every section; dates are relative to today and all relations use real seed ids.
import { isoDay } from '@/lib/format'
import { defaultValue, isEditable, requireSection, type FieldValue, type Row } from '@/lib/schema'

type SeedRecord = { id: string; title: string } & Record<string, FieldValue>

// Stable, valid v4-shaped uuids so relations can reference each other: section number + item number.
const uid = (section: number, item: number) =>
  `00000000-0000-4000-8${String(section).padStart(3, '0')}-${String(item).padStart(12, '0')}`

const C = (i: number) => uid(1, i) // campaigns
const P = (i: number) => uid(2, i) // pillars & ICPs
const H = (i: number) => uid(3, i) // hooks
const I = (i: number) => uid(4, i) // ideas
const L = (i: number) => uid(5, i) // linkedin posts
const B = (i: number) => uid(6, i) // blogs
const W = (i: number) => uid(7, i) // website content
const LP = (i: number) => uid(8, i) // landing pages
const CS = (i: number) => uid(9, i) // case studies
const A = (i: number) => uid(10, i) // assets
const PR = (i: number) => uid(11, i) // prompts
const E = (i: number) => uid(12, i) // experiments
const M = (i: number) => uid(13, i) // metrics log
const R = (i: number) => uid(14, i) // research
const X = (i: number) => uid(15, i) // prospects

// Local date (YYYY-MM-DD) offset from today; negative = past.
const day = (offset: number) => isoDay(offset)

// Builds the seed records; a function so relative dates are computed at seed time.
function records(): Record<string, SeedRecord[]> {
  return {
    campaigns: [
      {
        id: C(1),
        title: 'Q4 Legacy Modernization Push',
        status: 'Active',
        goal: 'Lead generation',
        primary_channels: ['LinkedIn', 'Landing page', 'LinkedIn Ads'],
        start_date: day(-40),
        end_date: day(50),
        owner: 'Priya Nair',
        target_audience: 'CTOs at mid-market logistics and fintech companies',
        offer_cta: 'Free 2-week modernization audit',
        budget: 12000,
        target_leads: 40,
        brief:
          'Position Botai as the safe pair of hands for modernizing legacy systems without a big-bang rewrite. Lead with proof (Northwind, Paylane) and drive to the audit landing page.',
      },
      {
        id: C(2),
        title: 'AI Readiness Thought Leadership',
        status: 'Active',
        goal: 'Brand awareness',
        primary_channels: ['LinkedIn', 'Website'],
        start_date: day(-60),
        end_date: day(30),
        owner: 'Marcus Chen',
        target_audience: 'VP Engineering at Series B+ SaaS and healthcare companies',
        offer_cta: 'Read the AI pilot scoping guide',
        budget: 3000,
        target_leads: 15,
        brief: 'Practical, skeptical takes on shipping AI. Build authority before the 2027 budget cycle.',
      },
      {
        id: C(3),
        title: 'Healthcare Interop Webinar',
        status: 'Planning',
        goal: 'Event/webinar',
        primary_channels: ['Email', 'Landing page', 'LinkedIn'],
        start_date: day(14),
        end_date: day(45),
        owner: 'Priya Nair',
        target_audience: 'Healthcare IT leaders dealing with claims and EHR integration',
        offer_cta: 'Register for the live session',
        budget: 5000,
        target_leads: 60,
        brief: 'Co-host with MedLedger. Topic: shipping LLM features under HIPAA.',
      },
    ],

    pillars: [
      {
        id: P(1),
        title: 'Modernize without the big-bang rewrite',
        status: 'Active',
        type: 'Content pillar',
        industry: ['Logistics', 'Fintech', 'Manufacturing'],
        description: 'Incremental, strangler-fig modernization that keeps the business running.',
        pain_points: 'Fear of failed rewrites, downtime, losing institutional knowledge buried in old code.',
        key_message: 'We modernize the system you have, one slice at a time, with zero-downtime cutovers.',
      },
      {
        id: P(2),
        title: 'CTO, mid-market logistics',
        status: 'Active',
        type: 'ICP',
        industry: ['Logistics'],
        description: '200–2,000 employees, homegrown TMS or dispatch system 10+ years old.',
        pain_points: 'Dispatch outages, slow feature delivery, can’t hire for the old stack.',
        key_message: 'Your dispatch platform can be modern in months, not years.',
      },
      {
        id: P(3),
        title: 'Practical AI that ships',
        status: 'Active',
        type: 'Content pillar',
        industry: ['SaaS', 'Healthcare', 'Fintech'],
        description: 'Skeptical, specific advice on getting AI features into production.',
        pain_points: 'Pilots that never reach production, unclear ROI, compliance worries.',
        key_message: 'Scope small, measure honestly, ship in weeks.',
      },
      {
        id: P(4),
        title: 'VP Engineering, Series B SaaS',
        status: 'Draft',
        type: 'Persona',
        industry: ['SaaS'],
        description: 'Owns delivery, under pressure from the board to “do AI”.',
        pain_points: 'Team stretched thin, roadmap full, needs senior help fast.',
        key_message: 'Senior engineers who slot into your team and ship.',
      },
    ],

    hooks: [
      { id: H(1), title: 'Your rewrite will fail. Here’s why we never do one.', status: 'Proven', hook_type: 'Contrarian', funnel_stage: 'Awareness', channel_fit: ['LinkedIn', 'Ads'], times_used: 6, times_won: 4, pillars: [P(1)], example_post: 'Your rewrite will fail.\n\nNot because your team is bad — because big-bang rewrites stop the business for 18 months.' },
      { id: H(2), title: 'We migrated a 20-year-old COBOL ledger in 11 weeks.', status: 'Proven', hook_type: 'Stat/Proof', funnel_stage: 'Consideration', channel_fit: ['LinkedIn', 'Landing page', 'Ads'], times_used: 4, times_won: 3, pillars: [P(1), P(2)] },
      { id: H(3), title: 'The day our client’s dispatch system went down at 3am…', status: 'Testing', hook_type: 'Story', funnel_stage: 'Awareness', channel_fit: ['LinkedIn'], times_used: 2, times_won: 1, pillars: [P(2)] },
      { id: H(4), title: 'What would you do with 40% less cloud spend?', status: 'Testing', hook_type: 'Question', funnel_stage: 'Consideration', channel_fit: ['LinkedIn', 'Email'], times_used: 1, times_won: 0, pillars: [] },
      { id: H(5), title: 'How to scope an AI pilot in 5 days', status: 'Proven', hook_type: 'How-to', funnel_stage: 'Consideration', channel_fit: ['LinkedIn', 'Website'], times_used: 5, times_won: 3, pillars: [P(3)] },
      { id: H(6), title: 'The $400k mistake we made on our first LLM project', status: 'Testing', hook_type: 'Mistake/Lesson', funnel_stage: 'Awareness', channel_fit: ['LinkedIn'], times_used: 1, times_won: 1, pillars: [P(3)] },
      { id: H(7), title: 'Inside our 2-week modernization audit', status: 'Idea', hook_type: 'Behind the scenes', funnel_stage: 'Decision', channel_fit: ['LinkedIn', 'Landing page'], times_used: 0, times_won: 0, pillars: [P(1)] },
      { id: H(8), title: 'Most AI pilots die in procurement, not in code.', status: 'Idea', hook_type: 'Contrarian', funnel_stage: 'Awareness', channel_fit: ['LinkedIn'], times_used: 0, times_won: 0, pillars: [P(3)] },
      { id: H(9), title: '3 signs your legacy system is costing you deals', status: 'Testing', hook_type: 'How-to', funnel_stage: 'Consideration', channel_fit: ['LinkedIn', 'Landing page'], times_used: 2, times_won: 0, pillars: [P(1)] },
      { id: H(10), title: 'Our client cut claim review from 3 days to 4 hours.', status: 'Proven', hook_type: 'Stat/Proof', funnel_stage: 'Decision', channel_fit: ['LinkedIn', 'Website', 'Email'], times_used: 3, times_won: 2, pillars: [P(3)] },
      { id: H(11), title: 'Is your data actually ready for AI?', status: 'Retired', hook_type: 'Question', funnel_stage: 'Awareness', channel_fit: ['LinkedIn'], times_used: 4, times_won: 0, pillars: [P(3)] },
      { id: H(12), title: 'Why we turned down a $1M project', status: 'Idea', hook_type: 'Story', funnel_stage: 'Awareness', channel_fit: ['LinkedIn'], times_used: 0, times_won: 0, pillars: [] },
    ],

    ideas: [
      { id: I(1), title: 'Fixed-price modernization audit', status: 'Shipped', idea_type: 'Offer / package', priority: 'High', impact: 'High', effort: 'M', source: 'Client call', owner: 'Priya Nair', one_line: 'A 2-week, fixed-price audit that ends with a phased modernization plan.', why_it_could_work: 'Lowers the risk of the first step; three prospects asked for exactly this in Q3.', related_service: 'Legacy modernization', campaign_id: C(1), icps: [P(2)] },
      { id: I(2), title: 'AI pilot in a box (5-day sprint)', status: 'Validating', idea_type: 'Service idea', priority: 'High', impact: 'High', effort: 'M', source: 'Team brainstorm', owner: 'Marcus Chen', one_line: 'Five days from use case to working prototype with an ROI estimate.', related_service: 'AI / LLM solutions', icps: [P(3), P(4)] },
      { id: I(3), title: '“Rewrite regrets” LinkedIn series', status: 'Approved', idea_type: 'Content series', priority: 'Medium', impact: 'Medium', effort: 'S', source: 'AI brainstorm', owner: 'Sam Okafor', one_line: 'Weekly post on a famous rewrite that went wrong and what to do instead.', draft_hook: 'Why we turned down a $1M project', hook_id: H(12), icps: [P(2)] },
      { id: I(4), title: 'Modernization for regulated industries', status: 'Inbox', idea_type: 'Positioning angle', priority: 'Medium', impact: 'High', effort: 'L', source: 'Competitor watch', owner: 'Priya Nair', one_line: 'Own “compliance-safe modernization” before competitors do.' },
      { id: I(5), title: 'Webinar with the Northwind CTO', status: 'Inbox', idea_type: 'Campaign concept', priority: 'Low', impact: 'Medium', effort: 'M', source: 'Event / conversation', owner: 'Marcus Chen', one_line: 'Live teardown of the dispatch rebuild with the client’s CTO.' },
      { id: I(6), title: 'Monthly legacy horror stories newsletter', status: 'Parked', idea_type: 'Content series', priority: 'Low', impact: 'Low', effort: 'S', source: 'Team brainstorm', owner: 'Sam Okafor', one_line: 'Reader-submitted legacy war stories with our commentary.' },
    ],

    'linkedin-posts': [
      { id: L(1), title: 'Why we never do big-bang rewrites', status: 'Measuring', variant: 'A', post_type: 'Thought leadership', format: 'Text', publish_date: day(-28), author: 'Priya Nair', hook_first_lines: 'Your rewrite will fail. Here’s why we never do one.', body: "Not because your team is bad. Because big-bang rewrites freeze your roadmap for 18 months while the business keeps moving.\n\nHere’s what we do instead:\n\n→ Put a routing layer in front of the old system\n→ Move one capability at a time\n→ Ship to production every few weeks\n→ Turn the old system off when nothing is left\n\nNorthwind Freight went live slice by slice and cut dispatch time 62%. No cutover weekend.\n\n#LegacyModernization #SoftwareEngineering #CTO", cta: 'Comment “audit” and I’ll send our checklist.', post_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7300000000000000001', ai_assisted: true, impressions: 18400, reactions: 412, comments: 63, reposts: 21, link_clicks: 140, leads: 6, campaign_id: C(1), experiment_id: E(1), hook_id: H(1), pillars: [P(1)] },
      { id: L(2), title: 'The 3am dispatch outage', status: 'Done', variant: 'B', post_type: 'Behind the scenes', format: 'Image', publish_date: day(-27), author: 'Priya Nair', hook_first_lines: 'The day our client’s dispatch system went down at 3am…', body: 'At 3:04am the pager went off. 400 trucks, no routes.', cta: 'Link to the Northwind case study in comments.', post_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7300000000000000002', ai_assisted: false, impressions: 15100, reactions: 236, comments: 31, reposts: 9, link_clicks: 88, leads: 3, campaign_id: C(1), experiment_id: E(1), hook_id: H(3), case_study_id: CS(1), pillars: [P(2)], assets: [A(1)] },
      { id: L(3), title: 'COBOL to cloud in 11 weeks', body: "Paylane’s ledger was written before most of their engineers were born.\n\nWe moved it to an event-sourced core one account type at a time. Dual writes, nightly reconciliation, and a kill switch for every slice.\n\nZero downtime. Zero lost transactions.\n\nSwipe for the 6-step cutover plan.\n\n#Fintech #COBOL #Modernization", status: 'Published', post_type: 'Case study', format: 'Carousel', publish_date: day(-10), author: 'Marcus Chen', hook_first_lines: 'We migrated a 20-year-old COBOL ledger in 11 weeks.', cta: 'DM me for the cutover runbook.', ai_assisted: true, impressions: 9800, reactions: 198, comments: 22, reposts: 14, link_clicks: 71, leads: 4, campaign_id: C(1), hook_id: H(2), case_study_id: CS(3), pillars: [P(1)], assets: [A(3)] },
      { id: L(4), title: 'How to scope an AI pilot in 5 days', body: "Most AI pilots never reach production. Not because of the model, but because nobody agreed what “success” meant.\n\nOur 5-day scoping template:\n\nDay 1: one painful, measurable task\nDay 2–3: thinnest working slice on real data\nDay 4: measure against the human baseline\nDay 5: one-page business case, including the risks you haven’t solved\n\nTemplate in the PDF 👇\n\n#AI #LLM #ProductManagement", status: 'Published', post_type: 'Thought leadership', format: 'Document', publish_date: day(-6), author: 'Marcus Chen', hook_first_lines: 'How to scope an AI pilot in 5 days (template inside).', ai_assisted: true, impressions: 7200, reactions: 165, comments: 40, reposts: 18, link_clicks: 95, leads: 5, campaign_id: C(2), hook_id: H(5), pillars: [P(3)], assets: [A(6)] },
      { id: L(5), title: 'The $400k LLM mistake', status: 'Scheduled', post_type: 'Thought leadership', format: 'Text', publish_date: day(3), author: 'Marcus Chen', hook_first_lines: 'The $400k mistake we made on our first LLM project.', ai_assisted: true, campaign_id: C(2), hook_id: H(6), pillars: [P(3)] },
      { id: L(6), title: '3 signs your legacy system is costing you deals', status: 'AI Review', post_type: 'Thought leadership', format: 'Carousel', author: 'Priya Nair', hook_first_lines: '3 signs your legacy system is costing you deals', ai_assisted: true, campaign_id: C(1), hook_id: H(9), pillars: [P(1)] },
      { id: L(7), title: 'Inside the modernization audit', status: 'Drafting', post_type: 'Product/service', format: 'Video', author: 'Sam Okafor', campaign_id: C(1), hook_id: H(7), assets: [A(2)] },
      { id: L(8), title: 'We’re hiring a staff engineer', status: 'Idea', post_type: 'Hiring/culture', format: 'Text', author: 'Sam Okafor' },
    ],

    blogs: [
      { id: B(1), title: 'Strangler fig vs big-bang rewrite: a CTO’s guide', body: "Every CTO with a 15-year-old core system eventually hears the same pitch: **rewrite it from scratch**. Clean architecture, modern stack, no more legacy pain.\n\nMost of those rewrites overrun. Many are cancelled. Here is how we decide between a rewrite and the *strangler fig* pattern, and why we almost always pick the second.\n\n## What the strangler fig pattern actually is\n\nYou put a routing layer in front of the old system, then move one capability at a time to new code. The old system keeps running until there is nothing left for it to do.\n\n- Customers never see a cutover weekend\n- Every slice ships to production in weeks, not years\n- You can stop at any point and still have something better than you started with\n\n## When a rewrite *does* make sense\n\n1. The system is small enough to rebuild in under three months\n2. The business rules are fully documented (they rarely are)\n3. You can freeze new features while you rebuild\n\n> If you can’t say yes to all three, you are not choosing a rewrite. You are choosing an 18-month feature freeze.\n\n## How we ran it at Paylane\n\nWe moved a COBOL ledger to an event-sourced core in **11 weeks**, one account type at a time, with zero downtime. Read the [Paylane case study](https://botai.example/work/paylane) for the cutover runbook.\n\n---\n\nWant a second opinion on your system? Our fixed-price **2-week modernization audit** ends with a phased plan you can run with or without us.", status: 'Published', blog_type: 'Comparison / Guide', funnel_stage: 'Consideration', search_intent: 'Commercial', target_keyword: 'legacy modernization strategy', meta_description: 'When to rewrite, when to strangle, and how to decide.', publish_date: day(-35), author: 'Priya Nair', blog_url: 'https://botai.example/blog/strangler-fig-vs-rewrite', ai_assisted: true, word_count: 2400, page_views: 3100, leads: 9, campaign_id: C(1), hook_id: H(1), case_study_id: CS(3), pillars: [P(1)] },
      { id: B(2), title: 'How to scope an AI pilot that survives procurement', body: "Most AI pilots don’t die in the model. They die in **procurement, security review and a fuzzy success metric**.\n\n## Day 1: pick one painful, measurable task\n\nGood candidates share three traits:\n\n- High volume and repetitive\n- A human already checks the output\n- A clear before/after number (minutes per claim, tickets per hour)\n\n## Day 2–3: build the thinnest working slice\n\nWire the real data in, even if only a sample. A demo on fake data proves nothing to a security team.\n\n## Day 4: measure honestly\n\nCompare against the human baseline, including the time spent correcting the AI.\n\n## Day 5: write the one-page business case\n\nCost per task today, cost per task with AI, and the risks you have **not** solved yet. Procurement trusts the pilot that lists its own gaps.", status: 'Measuring', blog_type: 'How-to / Tutorial', funnel_stage: 'Consideration', search_intent: 'Informational', target_keyword: 'ai pilot scoping', publish_date: day(-14), author: 'Marcus Chen', blog_url: 'https://botai.example/blog/scope-ai-pilot', ai_assisted: true, word_count: 1800, page_views: 1250, leads: 4, campaign_id: C(2), experiment_id: E(3), hook_id: H(5), pillars: [P(3)] },
      { id: B(3), title: 'What HIPAA means for LLM features', body: "## Draft outline\n\n- What counts as PHI in a prompt\n- BAAs with model providers\n- Logging without leaking: redaction before storage\n- Human sign-off on AI-assisted decisions\n\n*TODO: add MedLedger architecture diagram.*", status: 'Drafting', blog_type: 'Technical deep-dive', funnel_stage: 'Awareness', search_intent: 'Informational', target_keyword: 'hipaa llm', author: 'Marcus Chen', ai_assisted: false, campaign_id: C(3), case_study_id: CS(2), pillars: [P(3)] },
      { id: B(4), title: 'Logistics software trends for 2027', status: 'Brief', blog_type: 'Industry trend', funnel_stage: 'Awareness', search_intent: 'Informational', target_keyword: 'logistics software trends', author: 'Sam Okafor', pillars: [P(2)] },
    ],

    'website-content': [
      { id: W(1), title: 'Legacy Modernization Services', body: "# Modernize the system you have, without stopping the business\n\nYour core platform works, but every change takes months and the people who understand it are retiring. We modernize it **one slice at a time**, with zero-downtime cutovers.\n\n## What we do\n\n- **Modernization audit:** a fixed-price, 2-week assessment with a phased plan\n- **Incremental migration:** strangler-fig delivery, live in production every few weeks\n- **Data migration:** dual-write and reconciliation until the old store can be retired\n\n## Proof\n\n- Northwind Freight: **62% faster dispatch** after a 5-month rebuild\n- Paylane: COBOL ledger migrated in **11 weeks**, zero downtime\n\n[Book a modernization audit](https://botai.example/lp/audit-a)", status: 'Needs refresh', content_type: 'Service page', variant: 'Control', search_intent: 'Commercial', target_keyword: 'legacy modernization services', url_slug: '/services/legacy-modernization', meta_title: 'Legacy Modernization Services | Botai', live_url: 'https://botai.example/services/legacy-modernization', owner: 'Priya Nair', publish_date: day(-200), last_refreshed: day(-95), next_review: day(-2), monthly_visits: 1840, conversions: 22, avg_search_position: 7.4, campaign_id: C(1), case_study_id: CS(1), pillars: [P(1)] },
      { id: W(2), title: 'AI & LLM Solutions', body: "# Practical AI that ships\n\nWe build LLM features that reach production and pay for themselves: scoped in days, measured honestly, and built to pass security review.\n\n## Where we help\n\n- Document and claims review assistants\n- Internal search over your own knowledge base\n- Support triage and drafting\n\n> “Claim review went from three days to four hours, and our compliance team signed off first time.” MedLedger Health", status: 'Measuring', content_type: 'Service page', variant: 'A', search_intent: 'Commercial', target_keyword: 'llm development company', url_slug: '/services/ai', live_url: 'https://botai.example/services/ai', owner: 'Marcus Chen', ai_assisted: true, publish_date: day(-40), last_refreshed: day(-40), next_review: day(50), monthly_visits: 960, conversions: 9, avg_search_position: 14.2, campaign_id: C(2), case_study_id: CS(2), pillars: [P(3)] },
      { id: W(3), title: 'Logistics Software Development', status: 'Done', content_type: 'Industry page', variant: 'Control', search_intent: 'Commercial', target_keyword: 'logistics software development', url_slug: '/industries/logistics', live_url: 'https://botai.example/industries/logistics', owner: 'Sam Okafor', publish_date: day(-150), last_refreshed: day(-30), next_review: day(60), monthly_visits: 610, conversions: 5, avg_search_position: 9.1, case_study_id: CS(1), pillars: [P(2)] },
      { id: W(4), title: 'AI Readiness FAQ', status: 'Drafting', content_type: 'FAQ', search_intent: 'Informational', target_keyword: 'ai readiness checklist', url_slug: '/resources/ai-readiness-faq', owner: 'Marcus Chen', ai_assisted: true, campaign_id: C(2), pillars: [P(3)] },
    ],

    'landing-pages': [
      { id: LP(1), title: 'Modernization Audit: outcome headline', status: 'Published', variant: 'A', platform: 'Webflow', traffic_sources: ['LinkedIn Ads', 'Google Ads'], headline: 'Ship modern software without stopping the business', subheadline: 'A fixed-price, 2-week audit with a phased plan.', offer: 'Free 2-week modernization audit', cta_text: 'Book my audit', live_url: 'https://botai.example/lp/audit-a', owner: 'Priya Nair', publish_date: day(-12), ai_assisted: true, visits: 1420, conversions: 41, spend: 3200, campaign_id: C(1), experiment_id: E(2), hook_id: H(2), case_studies: [CS(1), CS(3)], pillars: [P(1)], assets: [A(2)] },
      { id: LP(2), title: 'Modernization Audit: risk headline', status: 'Published', variant: 'B', platform: 'Webflow', traffic_sources: ['LinkedIn Ads', 'Google Ads'], headline: 'Your legacy system is costing you deals', subheadline: 'Find out where in 2 weeks.', offer: 'Free 2-week modernization audit', cta_text: 'Get the audit', live_url: 'https://botai.example/lp/audit-b', owner: 'Priya Nair', publish_date: day(-12), ai_assisted: true, visits: 1385, conversions: 29, spend: 3150, campaign_id: C(1), experiment_id: E(2), hook_id: H(9), case_studies: [CS(1)], pillars: [P(1)], assets: [A(2)] },
    ],

    'case-studies': [
      { id: CS(1), title: 'Northwind Freight: dispatch platform rebuild', status: 'Published', client: 'Northwind Freight', industry: 'Logistics', service_types: ['Legacy modernization', 'Custom software'], one_line_summary: 'Replaced a 15-year-old dispatch system slice by slice, with zero downtime.', key_stat: '62% faster dispatch', duration: '5 months', tech_stack: 'Go, Postgres, React', linkedin_angle: 'The 3am outage that started it all.', original_page: 'https://botai.example/work/northwind', testimonial_status: 'Received', client_approval: 'Approved to publish', campaigns: [C(1)], pillars: [P(1), P(2)], assets: [A(1)] },
      { id: CS(2), title: 'MedLedger: HIPAA-safe claims assistant', status: 'In review', client: 'MedLedger Health', industry: 'Healthcare', service_types: ['AI / LLM solutions'], one_line_summary: 'An LLM assistant that pre-reviews claims inside a HIPAA boundary.', key_stat: 'Claim review from 3 days to 4 hours', duration: '10 weeks', tech_stack: 'Python, Claude, AWS', testimonial_status: 'Requested', client_approval: 'Pending', campaigns: [C(2), C(3)], pillars: [P(3)], assets: [A(4)] },
      { id: CS(3), title: 'Paylane: core ledger off COBOL', status: 'Published', client: 'Paylane', industry: 'Fintech', service_types: ['Legacy modernization'], one_line_summary: 'Migrated a COBOL ledger to a modern event-sourced core.', key_stat: '11-week cutover, zero downtime', duration: '4 months', tech_stack: 'Kotlin, Kafka, Postgres', original_page: 'https://botai.example/work/paylane', testimonial_status: 'Received', client_approval: 'Approved to publish', campaigns: [C(1)], pillars: [P(1)], assets: [] },
      { id: CS(4), title: 'Forgeworks: internal developer portal', status: 'Draft', client: 'Forgeworks', industry: 'Developer tools', service_types: ['Developer tooling', 'Web / 3D'], key_stat: 'Onboarding from 2 weeks to 2 days', duration: '3 months', tech_stack: 'TypeScript, Backstage', testimonial_status: 'Missing', client_approval: 'Not requested', campaigns: [], pillars: [P(4)], assets: [] },
    ],

    assets: [
      { id: A(1), title: 'Northwind dispatch dashboard screenshot', status: 'Approved', asset_type: 'Screenshot', source: 'Original', tags: ['Case study', 'LinkedIn'], usage_rights: 'Public OK', link: 'https://drive.botai.example/assets/northwind-dashboard.png' },
      { id: A(2), title: 'Modernization audit one-pager', status: 'Approved', asset_type: 'Deck/PDF', source: 'Original', tags: ['Landing page', 'Ad creative'], usage_rights: 'Public OK', link: 'https://drive.botai.example/assets/audit-one-pager.pdf' },
      { id: A(3), title: 'Legacy maze hero illustration', status: 'Approved', asset_type: 'Image', source: 'AI-generated', ai_tool: 'Midjourney', tags: ['LinkedIn', 'Ad creative'], usage_rights: 'Public OK', link: 'https://drive.botai.example/assets/legacy-maze.png', ai_prompt: 'isometric maze of old server racks turning into clean glass cubes, soft studio light --ar 4:5' },
      { id: A(4), title: 'MedLedger testimonial clip', status: 'Draft', asset_type: 'Video', source: 'Client-provided', tags: ['Case study'], usage_rights: 'Needs client approval', link: 'https://drive.botai.example/assets/medledger-testimonial.mp4' },
      { id: A(5), title: 'Brand logo pack', status: 'Approved', asset_type: 'Logo/Brand', source: 'Original', tags: ['Brand'], usage_rights: 'Internal only', link: 'https://drive.botai.example/assets/brand-pack.zip' },
      { id: A(6), title: 'AI pilot scoping carousel template', status: 'Draft', asset_type: 'Template', source: 'Original', tags: ['LinkedIn'], usage_rights: 'Public OK', link: 'https://drive.botai.example/assets/ai-pilot-carousel.fig' },
    ],

    prompts: [
      { id: PR(1), title: 'LinkedIn post from case study', status: 'Approved', use_case: 'LinkedIn post', tool_model: 'Claude', version: 3, quality_rating: 5, owner: 'Priya Nair', prompt: 'You are Botai’s LinkedIn writer. Using the case study below, write a 180-word post.\n- Line 1: the hook, max 12 words\n- One concrete number\n- End with a soft CTA\n\nCase study:\n{{case_study}}', inputs_needed: 'Case study one-liner, key stat, client approval status' },
      { id: PR(2), title: '10 hook variants', status: 'Approved', use_case: 'Hook variants', tool_model: 'Claude', version: 2, quality_rating: 4, owner: 'Sam Okafor', prompt: 'Write 10 opening lines for a LinkedIn post about {{topic}}. Mix: 3 contrarian, 3 stat/proof, 2 question, 2 story. Max 14 words each. No emojis.', inputs_needed: 'Topic, pillar, one proof point' },
      { id: PR(3), title: 'Landing page copy (PAS)', status: 'Testing', use_case: 'Landing page copy', tool_model: 'ChatGPT', version: 1, quality_rating: 3, owner: 'Priya Nair', prompt: 'Write landing page copy using Problem-Agitate-Solve for {{offer}} aimed at {{icp}}. Return headline, subheadline, 3 bullets, CTA.', notes: 'Headlines come out generic; try adding a proof point to the inputs.' },
      { id: PR(4), title: 'Brand voice system prompt', status: 'Approved', use_case: 'Brand voice / system', tool_model: 'Claude', version: 4, quality_rating: 5, owner: 'Marcus Chen', prompt: 'Voice: senior engineer talking to a peer. Plain words, specific numbers, no hype, no exclamation marks. Prefer “we shipped” over “we help”.' },
      { id: PR(5), title: 'Hero image: isometric legacy maze', status: 'Draft', use_case: 'Image generation', tool_model: 'Midjourney', version: 1, quality_rating: 4, owner: 'Sam Okafor', prompt: 'isometric maze of old server racks turning into clean glass cubes, soft studio light, muted palette --ar 4:5 --style raw' },
    ],

    experiments: [
      { id: E(1), title: 'LinkedIn hook: contrarian vs story', status: 'Concluded', channel: 'LinkedIn', variable_tested: 'Hook', primary_metric: 'Engagement rate', start_date: day(-30), end_date: day(-16), hypothesis: 'A contrarian opener will out-engage a story opener with CTOs.', learning: 'Contrarian won on engagement and leads. Story got more saves. Contrarian hook promoted to Proven.', winner: 'Variant A (contrarian)', lift_pct: 38, campaign_id: C(1), hooks: [H(1), H(3)] },
      { id: E(2), title: 'Audit landing page: outcome vs risk headline', status: 'Running', channel: 'Landing page', variable_tested: 'Headline', primary_metric: 'Conversion rate', start_date: day(-12), end_date: day(9), hypothesis: 'An outcome headline converts better than a fear-of-loss headline.', campaign_id: C(1), hooks: [H(2), H(9)] },
      { id: E(3), title: 'AI pilot blog: CTA placement', status: 'Planned', channel: 'Website', variable_tested: 'CTA', primary_metric: 'Leads', start_date: day(5), hypothesis: 'An inline CTA after the template section beats a footer CTA.', campaign_id: C(2), hooks: [] },
    ],

    metrics: metrics(),

    research: [
      { id: R(1), title: 'Report: 70% of large rewrites overrun budget', status: 'Used in content', category: 'Trend / report', relevance: 'High', industries: ['Software services'], source_name: 'Industry analyst report', source_url: 'https://research.example/legacy-rewrites-2026', date_found: day(-38), summary: 'Most large rewrites overrun by 50%+; incremental approaches fare far better.', content_angle: 'Use as proof in the “never rewrite” post.', pillars: [P(1)], linkedin_posts: [L(1)] },
      { id: R(2), title: 'Competitor launches “AI modernization” package', status: 'New', category: 'Competitor', relevance: 'High', industries: ['Software services', 'AI / LLM'], source_name: 'Competitor blog', source_url: 'https://thoughtbyte.example/news/ai-modernization', date_found: day(-3), competitor: 'Thoughtbyte', summary: 'Bundles LLM code translation with migration services.', content_angle: 'Counter-position: AI helps, but cutover planning is where projects fail.' },
      { id: R(3), title: 'Harbor Line raises Series C to replace TMS', status: 'Reviewed', category: 'Company news', relevance: 'Medium', industries: ['Logistics'], source_name: 'Trade press', source_url: 'https://freightnews.example/harbor-line-series-c', date_found: day(-9), summary: 'Plans to replace its transport management system within 18 months.', pillars: [P(2)] },
      { id: R(4), title: 'Proposed rule on AI use in claims review', status: 'Reviewed', category: 'Industry news', relevance: 'High', industries: ['Healthcare', 'AI / LLM'], source_name: 'Regulator bulletin', source_url: 'https://regulator.example/ai-claims-rule', date_found: day(-15), summary: 'Requires human sign-off and audit logs for AI-assisted claim decisions.', content_angle: 'MedLedger already does this; great webinar topic.', pillars: [P(3)], website_pages: [W(2)] },
      { id: R(5), title: 'Keyword: “mainframe migration cost” (2.4k/mo)', status: 'New', category: 'Keyword / topic idea', relevance: 'Medium', industries: ['Software services'], source_name: 'Keyword tool', date_found: day(-5), content_angle: 'Cost-breakdown blog with a calculator.' },
      { id: R(6), title: 'Customer insight: CTOs fear lock-in more than cost', status: 'Used in content', category: 'Customer insight', relevance: 'High', industries: ['Logistics', 'Fintech'], source_name: 'Sales calls (5)', date_found: day(-20), summary: 'Lock-in came up unprompted in 4 of 5 discovery calls.', linkedin_posts: [L(6)], pillars: [P(2)] },
    ],

    prospects: [
      { id: X(1), title: 'Harbor Line Logistics', pipeline_stage: '6 Researched', industry: 'Logistics', company_size: '500–1,000', website: 'https://harborline.example', location: 'Rotterdam, NL', contact_name: 'Dana Ortiz', job_title: 'CTO', contact_linkedin: 'https://www.linkedin.com/in/dana-ortiz-example', email: 'dana.ortiz@harborline.example', email_status: 'Verified', source_tools: ['Apollo', 'Anymailfinder'], owner: 'Priya Nair', last_enriched: day(-4), research_notes: 'Raised Series C to replace TMS (see Research). Strong fit for audit offer.', campaign_id: C(1), icps: [P(2)] },
      { id: X(2), title: 'ClearPath Health', pipeline_stage: '4 Email found', industry: 'Healthcare', company_size: '200–500', website: 'https://clearpath.example', location: 'Austin, TX', contact_name: 'Ravi Menon', job_title: 'VP Engineering', email: 'ravi@clearpath.example', email_status: 'Risky', source_tools: ['LinkedIn Sales Navigator', 'Anymailfinder'], owner: 'Marcus Chen', last_enriched: day(-8), campaign_id: C(3), icps: [P(3)] },
      { id: X(3), title: 'Ledgerly', pipeline_stage: '7 Ready for outreach', industry: 'Fintech', company_size: '100–200', website: 'https://ledgerly.example', location: 'London, UK', contact_name: 'Hannah Brooks', job_title: 'Head of Platform', email: 'hannah@ledgerly.example', email_status: 'Verified', source_tools: ['Apollo'], owner: 'Priya Nair', last_enriched: day(-2), research_notes: 'Still on a 2009 ledger core. Mention the Paylane case study.', campaign_id: C(1), icps: [P(2)] },
      { id: X(4), title: 'CargoBridge', pipeline_stage: '2 Company enriched', industry: 'Logistics', company_size: '1,000–2,000', website: 'https://cargobridge.example', location: 'Chicago, IL', email_status: 'Not checked', source_tools: ['Tavily'], owner: 'Sam Okafor', last_enriched: day(-11), icps: [P(2)] },
      { id: X(5), title: 'Meridian Manufacturing', pipeline_stage: '1 Discovered', industry: 'Manufacturing', website: 'https://meridian-mfg.example', email_status: 'Not checked', source_tools: ['Manual'], owner: 'Sam Okafor' },
      { id: X(6), title: 'Tallyfast', pipeline_stage: 'Excluded', industry: 'SaaS', company_size: '10–50', website: 'https://tallyfast.example', contact_name: 'Leo Park', job_title: 'Founder', email: 'leo@tallyfast.example', email_status: 'Invalid', source_tools: ['Apollo'], owner: 'Marcus Chen', last_enriched: day(-30), research_notes: 'Too small for current offers.' },
    ],
  }
}

// 15 metrics-log entries over the last ~45 days, linked to the campaigns, experiments and pages they measure.
function metrics(): SeedRecord[] {
  type Spec = [string, string, number, number, number, number, number, number, Partial<SeedRecord>?]
  // [channel, source, startDaysAgo, impressions, clicks, leads, mqls, spend, links]
  const specs: Spec[] = [
    ['LinkedIn organic', 'LinkedIn Analytics', 44, 12800, 150, 2, 1, 0, { campaign_id: C(1) }],
    ['Website / SEO', 'GA4', 42, 28400, 1210, 11, 4, 0, { website_page_id: W(1) }],
    ['LinkedIn Ads', 'LinkedIn Campaign Manager', 38, 41000, 520, 7, 3, 2100, { campaign_id: C(1) }],
    ['Email', 'CRM', 35, 3200, 260, 4, 2, 0, { campaign_id: C(2) }],
    ['LinkedIn organic', 'LinkedIn Analytics', 28, 18400, 140, 6, 3, 0, { campaign_id: C(1), experiment_id: E(1), linkedin_post_id: L(1) }],
    ['LinkedIn organic', 'LinkedIn Analytics', 27, 15100, 88, 3, 1, 0, { campaign_id: C(1), experiment_id: E(1), linkedin_post_id: L(2) }],
    ['Google Ads', 'Google Ads', 25, 22600, 640, 9, 4, 1850, { campaign_id: C(1) }],
    ['Website / SEO', 'GA4', 21, 30100, 1340, 13, 5, 0, { website_page_id: W(2) }],
    ['LinkedIn Ads', 'LinkedIn Campaign Manager', 18, 39500, 610, 10, 4, 2350, { campaign_id: C(1) }],
    ['Landing page', 'GA4', 12, 1420, 1420, 22, 9, 1700, { campaign_id: C(1), experiment_id: E(2), landing_page_id: LP(1) }],
    ['Landing page', 'GA4', 12, 1385, 1385, 15, 5, 1650, { campaign_id: C(1), experiment_id: E(2), landing_page_id: LP(2) }],
    ['LinkedIn organic', 'LinkedIn Analytics', 10, 9800, 71, 4, 2, 0, { campaign_id: C(1), linkedin_post_id: L(3) }],
    ['LinkedIn organic', 'LinkedIn Analytics', 6, 7200, 95, 5, 2, 0, { campaign_id: C(2), linkedin_post_id: L(4) }],
    ['Google Ads', 'Google Ads', 5, 19800, 580, 8, 3, 1600, { campaign_id: C(1) }],
    ['Email', 'Manual', 2, 2900, 0, 0, 0, 0, { campaign_id: C(3), notes: 'Webinar teaser sent; click tracking was broken, re-check next week.' }],
  ]
  return specs.map(([channel, source, ago, impressions, clicks, leads, mqls, spend, links], i) => ({
    id: M(i + 1),
    title: `${channel}: ${day(-ago)}`,
    channel,
    source,
    period_start: day(-ago),
    period_end: day(Math.min(0, -ago + 6)),
    impressions,
    clicks,
    leads,
    mqls,
    spend,
    ...links,
  }))
}

// Fills defaults and timestamps so seed rows look exactly like rows created through the repository.
export function buildSeed(): Record<string, Row[]> {
  const out: Record<string, Row[]> = {}
  for (const [sectionKey, list] of Object.entries(records())) {
    const fields = requireSection(sectionKey).fields.filter(isEditable)
    out[sectionKey] = list.map((record, i) => {
      const created = new Date(Date.now() - (i * 2 + 1) * 86_400_000).toISOString()
      const defaults = Object.fromEntries(fields.map((f) => [f.name, defaultValue(f)]))
      return { ...defaults, ...record, created_at: created, updated_at: created }
    })
  }
  return out
}
