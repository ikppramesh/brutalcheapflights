/**
 * Visa requirements for Indian passport holders (as of September 2026)
 *
 * Sources:
 *   - Henley Passport Index 2026
 *   - Ministry of External Affairs, India
 *   - Individual country immigration portals
 *   - Wego, Atlys, HappyFares, Gulf News, BTW Visas, VisaBro travel guides
 *
 * DISCLAIMER: Visa policies change frequently. Always verify with the
 * official embassy or immigration authority before booking travel.
 *
 * visa_type values:
 *   "visa_free"          - No visa needed; walk through immigration
 *   "visa_on_arrival"    - Visa issued at the port of entry (may have a fee)
 *   "e_visa"             - Electronic visa; must be approved BEFORE travel
 *   "visa_required"      - Traditional embassy / consulate visa application
 *   "transit_visa_free"  - No visa needed for airside transit (specific conditions)
 *   "free_eta"           - Free Electronic Travel Authorisation (no fee)
 */

const VISA_DATA = {

  // ──────────────────────────────────────────────
  //  SOUTH & SOUTH-EAST ASIA
  // ──────────────────────────────────────────────

  nepal: {
    country: "Nepal",
    visa_type: "visa_free",
    max_stay: "unlimited",
    fee: "free",
    apply_url: null,
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "No visa required. Indians can enter with passport or even a voter ID card. " +
      "Open border policy between India and Nepal.",
  },

  sri_lanka: {
    country: "Sri Lanka",
    visa_type: "free_eta",
    max_stay: "30 days",
    fee: "free",
    apply_url: "https://eta.gov.lk",
    apply_label: "Apply Free ETA",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Free Electronic Travel Authorisation (ETA) since 25 May 2026. Apply at eta.gov.lk before travel. " +
      "Double-entry permitted within the 30-day window. Walk-in visa on arrival also available at " +
      "Bandaranaike International Airport. Extendable on payment of applicable fee.",
  },

  maldives: {
    country: "Maldives",
    visa_type: "visa_free",
    max_stay: "30 days",
    fee: "free",
    apply_url: null,
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Free tourist visa issued on arrival at Male airport. Requires passport valid 6 months, " +
      "confirmed return ticket, and proof of hotel/accommodation booking.",
  },

  thailand: {
    country: "Thailand",
    visa_type: "visa_free",
    max_stay: "30 days",
    fee: "free",
    apply_url: "https://tdac.immigration.go.th",
    apply_label: "Fill Thailand Digital Arrival Card",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Visa-exempt entry for Indian passport holders. Reduced from 60 days to 30 days effective " +
      "15 September 2026 (Thai Cabinet decision 14 July 2026). Must complete the free Thailand " +
      "Digital Arrival Card within 3 days before landing. Carry return ticket, hotel booking, and " +
      "passport valid 6+ months.",
  },

  malaysia: {
    country: "Malaysia",
    visa_type: "visa_free",
    max_stay: "30 days",
    fee: "free",
    apply_url: "https://imigresen-online.imi.gov.my/mdac/main",
    apply_label: "Fill Malaysia Digital Arrival Card",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Visa-free entry for tourism until 31 December 2026 (Visit Malaysia 2026 initiative). " +
      "Must complete Malaysia Digital Arrival Card (MDAC) within 3 days before arrival. " +
      "Carry proof of return travel, accommodation, and sufficient funds. " +
      "Not valid for work or long-term study.",
  },

  singapore: {
    country: "Singapore",
    visa_type: "e_visa",
    max_stay: "30 days",
    fee: "SGD 30 + agent service charge",
    apply_url: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
    apply_label: "Singapore Visa Info (ICA)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Indian passport holders cannot apply directly on the ICA portal. Must apply via an " +
      "Authorised Visa Agent through the SAVE (Submission of Application for Visa Electronically) " +
      "system. Processing takes 3-5 working days. Passport must be valid 6+ months beyond entry date.",
  },

  indonesia: {
    country: "Indonesia (Bali)",
    visa_type: "visa_on_arrival",
    max_stay: "30 days",
    fee: "IDR 500,000 (~INR 2,700)",
    apply_url: "https://molina.imigrasi.go.id",
    apply_label: "Apply Indonesia e-VoA",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Paid Visa on Arrival (VoA) or e-VoA available. NOT free for Indians. Extendable once for " +
      "another 30 days. Bali additionally charges a mandatory tourist levy of IDR 150,000 (~INR 810). " +
      "Budget ~INR 3,500-4,000 total per person. Applying for e-VoA online before departure is recommended.",
  },

  vietnam: {
    country: "Vietnam",
    visa_type: "e_visa",
    max_stay: "90 days",
    fee: "USD 25 (single) / USD 50 (multiple entry)",
    apply_url: "https://evisa.xuatnhapcanh.gov.vn",
    apply_label: "Apply Vietnam e-Visa",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "E-visa available since August 2023 for all nationalities. Single or multiple entry. " +
      "Valid for tourism, business, conferences. Processing ~3 working days. " +
      "Indians are NOT eligible for any visa exemption.",
  },

  philippines: {
    country: "Philippines",
    visa_type: "visa_free",
    max_stay: "14 days (general) / 30 days (with qualifying visa)",
    fee: "free",
    apply_url: null,
    us_visa_benefit: true,
    us_visa_detail:
      "With a valid US visa (or UK, Canada, Australia, Japan, Singapore, Schengen visa/PR), " +
      "Indians get 30 days visa-free instead of the standard 14 days.",
    notes:
      "Two-tier visa-free policy since 19 May 2025. All Indians get 14-day non-extendable visa-free. " +
      "Those with qualifying visas from US/UK/Canada/Australia/Japan/Singapore/Schengen get 30 days. " +
      "Neither tier is extendable or convertible to other visa types.",
  },

  hong_kong: {
    country: "Hong Kong",
    visa_type: "visa_free",
    max_stay: "14 days",
    fee: "free",
    apply_url: "https://www.immd.gov.hk/eng/services/visas/pre-arrival_registration.html",
    apply_label: "Pre-Arrival Registration (PAR)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Visa-free for 14 days but MUST complete free Pre-Arrival Registration (PAR) online before travel. " +
      "PAR valid for 6 months, multiple entries allowed. Instant approval. " +
      "For stays over 14 days, apply to HK Immigration Department directly. " +
      "Note: This is Hong Kong SAR only, NOT mainland China.",
  },

  // ──────────────────────────────────────────────
  //  EAST ASIA
  // ──────────────────────────────────────────────

  japan: {
    country: "Japan",
    visa_type: "e_visa",
    max_stay: "15-90 days (depends on visa type)",
    fee: "varies",
    apply_url: "https://www.evisa.mofa.go.jp",
    apply_label: "Apply Japan e-Visa",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Japan eVISA available for Indian citizens travelling by air or sea. Single-entry e-visa for " +
      "tourism. Indians residing in select countries (US, UK, UAE, Singapore, etc.) can also apply " +
      "for single-entry e-visa online. Standard route is embassy/consulate application for " +
      "multiple-entry or longer stays.",
  },

  south_korea: {
    country: "South Korea",
    visa_type: "visa_required",
    max_stay: "per visa type (usually 90 days for C-3-9)",
    fee: "varies",
    apply_url: "https://www.visa.go.kr/openPage.do?MENU_ID=10101",
    apply_label: "Apply Korea Visa",
    us_visa_benefit: true,
    us_visa_detail:
      "Transit benefit: Indians transiting through South Korea EN ROUTE TO the US with a valid " +
      "US visa can stay up to 30 days without a Korean visa (B-2 transfer-passenger exemption). " +
      "Must have confirmed onward ticket to the US. Does NOT apply for general tourism visits.",
    notes:
      "Regular tourist visa (C-3-9) must be applied at Korea Visa Application Centre or consulate. " +
      "Processing 5-10 working days. K-ETA is NOT available for Indian passport holders. " +
      "No visa-on-arrival or general e-visa option.",
  },

  china: {
    country: "China (Mainland)",
    visa_type: "visa_required",
    max_stay: "30 days (single-entry L visa)",
    fee: "INR 2,900 + INR 2,107 service fee (reduced rate until 31 Dec 2026)",
    apply_url: "https://www.visaforchina.cn",
    apply_label: "Apply China Visa (CVASC)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Must apply in advance at Chinese Visa Application Service Centre (CVASC) in New Delhi, Mumbai, or Kolkata. " +
      "No e-visa or visa-on-arrival for Indians. Reduced fees and biometrics waived for short-stay visas until " +
      "31 December 2026. Complete COVA form online, visit CVASC once. Standard processing ~4 working days.",
  },

  // ──────────────────────────────────────────────
  //  MIDDLE EAST / GULF
  // ──────────────────────────────────────────────

  uae: {
    country: "UAE (Dubai / Abu Dhabi)",
    visa_type: "visa_required",
    max_stay: "14 days (VoA with qualifying visa) / 60 days (e-visa)",
    fee: "~INR 2,715 (VoA) / varies (e-visa)",
    apply_url: "https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileVisa",
    apply_label: "Apply UAE e-Visa (ICP)",
    us_visa_benefit: true,
    us_visa_detail:
      "Indians holding a valid US visa or residence permit (also UK, EU, Australia, Canada, Japan, " +
      "New Zealand, Singapore, South Korea) can obtain a 14-day visa on arrival, extendable once " +
      "to 28 days. Expanded in June 2026 to allow 14 or 60 day stays depending on category.",
    notes:
      "No general visa-on-arrival for Indians without a qualifying visa. Standard route is e-visa " +
      "through airlines, travel agents, or UAE ICA/GDRFA portals. Passport must be valid 6+ months.",
  },

  qatar: {
    country: "Qatar (Doha)",
    visa_type: "visa_on_arrival",
    max_stay: "30 days",
    fee: "free",
    apply_url: null,
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Free visa on arrival at Hamad International Airport. No pre-arrangement needed. " +
      "Requires passport valid 6+ months, confirmed return ticket, hotel booking, and sufficient funds. " +
      "Available ONLY at Hamad International Airport (not land/sea borders).",
  },

  oman: {
    country: "Oman",
    visa_type: "visa_on_arrival",
    max_stay: "14 days",
    fee: "varies",
    apply_url: "https://evisa.rop.gov.om",
    apply_label: "Apply Oman e-Visa",
    us_visa_benefit: true,
    us_visa_detail:
      "Indians with a valid visa from US, UK, Australia, Canada, Japan, or a Schengen state " +
      "can obtain a 14-day visa on arrival. Without a qualifying visa, Indians need an e-visa.",
    notes:
      "Oman introduced a new free 14-day tourist visa (Aug 2026) but the eligible country list has " +
      "NOT yet officially confirmed India. Indians should continue using the existing VoA (with qualifying " +
      "visa) or e-visa route until official confirmation.",
  },

  bahrain: {
    country: "Bahrain",
    visa_type: "e_visa",
    max_stay: "14 days (single entry)",
    fee: "BHD 10 (~INR 2,336) e-visa / BHD 5 (~INR 1,168) VoA",
    apply_url: "https://www.evisa.gov.bh",
    apply_label: "Apply Bahrain e-Visa",
    us_visa_benefit: true,
    us_visa_detail:
      "Indians with a valid US visa (also UK/Schengen) or GCC residence can get a cheaper " +
      "visa on arrival (BHD 5) at Bahrain International Airport instead of the standard e-visa.",
    notes:
      "E-visa applied at evisa.gov.bh, processed in 3-5 working days. VoA at airport only for " +
      "those with qualifying visas/GCC residence. Passport valid 6+ months, return ticket, " +
      "hotel booking, bank statement required.",
  },

  saudi_arabia: {
    country: "Saudi Arabia",
    visa_type: "e_visa",
    max_stay: "90 days per entry (1-year multiple entry)",
    fee: "SAR 535 (~INR 11,770) including insurance & VAT",
    apply_url: "https://visa.visitsaudi.com",
    apply_label: "Apply Saudi e-Visa",
    us_visa_benefit: true,
    us_visa_detail:
      "Indians can get Saudi tourist e-visa if they hold a valid US, UK, or Schengen tourist/business " +
      "visa (must have been used at least once) OR a valid US/UK/Schengen residence permit OR a " +
      "GCC residence visa with 3+ months validity.",
    notes:
      "E-visa issued in as little as 1 minute via the official Saudi portal (launched Nov 2025). " +
      "No embassy visit required. Valid for 1 year, multiple entries, up to 90 days per entry. " +
      "Also available: airline-issued stopover visa for transit passengers.",
  },

  turkey: {
    country: "Turkey",
    visa_type: "e_visa",
    max_stay: "30 days (single entry)",
    fee: "varies",
    apply_url: "https://www.evisa.gov.tr",
    apply_label: "Apply Turkey e-Visa",
    us_visa_benefit: true,
    us_visa_detail:
      "Indians with a valid US visa (also UK, Ireland, or Schengen visa/residence permit) " +
      "can apply for a Turkey e-Visa online. Without one of these qualifying visas, Indians " +
      "cannot get the e-visa and must apply through traditional embassy channels.",
    notes:
      "The Turkey e-visa is ONLY available to Indians who hold a qualifying visa from " +
      "US/UK/Ireland/Schengen. The supporting visa must be valid at entry. " +
      "Limited to tourism or short business visits. Passport valid 6+ months required.",
  },

  // ──────────────────────────────────────────────
  //  AFRICA
  // ──────────────────────────────────────────────

  kenya: {
    country: "Kenya",
    visa_type: "visa_free",
    max_stay: "90 days",
    fee: "free",
    apply_url: "https://www.etakenya.go.ke",
    apply_label: "Kenya eTA (optional)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Kenya added India to its visa-free list in mid-2025. Previously required an e-visa ($51). " +
      "Electronic Travel Authorisation (eTA) may still be used but is no longer mandatory for " +
      "standard tourist visits. Valid for 90 days.",
  },

  egypt: {
    country: "Egypt",
    visa_type: "e_visa",
    max_stay: "30 days (single entry)",
    fee: "USD 30",
    apply_url: "https://visa2egypt.gov.eg",
    apply_label: "Apply Egypt e-Visa",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "E-visa available since April 2023 for solo Indian travellers. Apply on the official Egypt " +
      "e-Visa portal. IMPORTANT: A Letter of Guarantee from an authorised Egyptian travel agent " +
      "is NOW MANDATORY for Indian nationals applying for any visa type. Without it, boarding may " +
      "be denied and deportation possible. Passport valid 6+ months with 2 blank pages.",
  },

  south_africa: {
    country: "South Africa",
    visa_type: "e_visa",
    max_stay: "90 days",
    fee: "varies",
    apply_url: "https://eta.dha.gov.za",
    apply_label: "Apply South Africa ETA",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "New Electronic Travel Authorisation (ETA) launched for Indians. Apply online at eta.dha.gov.za. " +
      "Decision within 24-48 hours. Multiple entries allowed during validity. Works only at " +
      "Johannesburg, Cape Town, and Lanseria international airports. Passport must have 19+ months validity. " +
      "Cannot be used for employment.",
  },

  // ──────────────────────────────────────────────
  //  EUROPE - SCHENGEN ZONE
  //  (All require Schengen Type C visa)
  // ──────────────────────────────────────────────

  germany: {
    country: "Germany",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/germany/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global / embassy. " +
      "Covers access to all 29 Schengen member states.",
  },

  france: {
    country: "France",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://france-visas.gouv.fr",
    apply_label: "Apply France Visa",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global / TLScontact. " +
      "Covers access to all 29 Schengen member states.",
  },

  netherlands: {
    country: "Netherlands",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/netherlands/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  italy: {
    country: "Italy",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/italy/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  spain: {
    country: "Spain",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.blsindiavisa.com/spain",
    apply_label: "Apply Schengen Visa (BLS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through BLS International. " +
      "Covers access to all 29 Schengen member states.",
  },

  switzerland: {
    country: "Switzerland",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/switzerland/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  greece: {
    country: "Greece",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/greece/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  belgium: {
    country: "Belgium",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/belgium/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  denmark: {
    country: "Denmark",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/denmark/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  sweden: {
    country: "Sweden",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/sweden/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  finland: {
    country: "Finland",
    visa_type: "visa_required",
    max_stay: "90 days in 180 days (Schengen)",
    fee: "EUR 90 (adults) / EUR 45 (children 6-12)",
    apply_url: "https://www.vfsglobal.com/finland/india",
    apply_label: "Apply Schengen Visa (VFS)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes: "Schengen visa required. Apply through VFS Global. " +
      "Covers access to all 29 Schengen member states.",
  },

  // ──────────────────────────────────────────────
  //  EUROPE - NON-SCHENGEN
  // ──────────────────────────────────────────────

  uk: {
    country: "United Kingdom",
    visa_type: "visa_required",
    max_stay: "up to 6 months (Standard Visitor)",
    fee: "GBP 135 (Standard Visitor, from 8 Apr 2026) + VFS service charges",
    apply_url: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa",
    apply_label: "Apply UK Visa (gov.uk)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Full UK visa required. UK switched to digital eVisa system on 25 Feb 2026 (no more passport " +
      "stickers). Apply online at gov.uk, biometrics at VFS Global. Standard processing 15 working days. " +
      "BIVS (British-Irish Visa Scheme): Indians with a short-stay UK BIVS-endorsed visa can travel to " +
      "Ireland without a separate Irish visa.",
  },

  ireland: {
    country: "Ireland",
    visa_type: "visa_required",
    max_stay: "per visa granted",
    fee: "varies",
    apply_url: "https://www.irishimmigration.ie/coming-to-visit-ireland/applying-for-a-short-stay-visa/",
    apply_label: "Apply Ireland Visa",
    us_visa_benefit: false,
    us_visa_detail:
      "No direct US visa benefit, BUT the British-Irish Visa Scheme (BIVS) allows Indians with " +
      "a BIVS-endorsed UK short-stay visa to also visit Ireland without a separate Irish visa. " +
      "Additionally, Ireland's Short-Stay Visa Waiver Programme allows Indians who entered the UK " +
      "on certain UK short-stay visas to travel to Ireland using remaining UK leave.",
    notes:
      "BIVS only available to Indian and Chinese nationals applying from their home countries. " +
      "Only for short-stay visas (tourism, business, family). Long-stay UK visas (student, work) " +
      "do NOT qualify for BIVS. Without BIVS, a separate Irish visa is required.",
  },

  // ──────────────────────────────────────────────
  //  AMERICAS
  // ──────────────────────────────────────────────

  usa: {
    country: "United States of America",
    visa_type: "visa_required",
    max_stay: "up to 6 months (B1/B2)",
    fee: "USD 185 (B1/B2 non-immigrant visa, 2026)",
    apply_url: "https://www.ustraveldocs.com/in",
    apply_label: "Apply US Visa (B1/B2)",
    us_visa_benefit: false,
    us_visa_detail: "N/A - this IS the US visa.",
    notes:
      "Must apply at US Embassy/Consulate. In-person interview required. B1/B2 tourist/business visa " +
      "is the standard route. Processing times vary. A valid US visa unlocks visa-free or simplified " +
      "entry to 28+ other countries for Indian passport holders.",
  },

  canada: {
    country: "Canada",
    visa_type: "visa_required",
    max_stay: "up to 6 months",
    fee: "CAD 100 + CAD 85 biometrics",
    apply_url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    apply_label: "Apply Canada Visa",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Temporary Resident Visa (TRV) required. Processing takes a few weeks to 3 months depending " +
      "on season. ETA is NOT available for Indian citizens. Apply online or through VAC.",
  },

  australia: {
    country: "Australia",
    visa_type: "visa_required",
    max_stay: "up to 12 months (Subclass 600)",
    fee: "AUD 190 (Subclass 600 Tourist stream)",
    apply_url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    apply_label: "Apply Australia Visa (Subclass 600)",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Visitor visa Subclass 600 required. ETA (Subclass 601) and eVisitor are NOT available to Indians. " +
      "Apply online. Processing 16-36 days in 2026.",
  },

  // ──────────────────────────────────────────────
  //  SOUTH ASIA (remaining)
  // ──────────────────────────────────────────────

  bangladesh: {
    country: "Bangladesh",
    visa_type: "visa_required",
    max_stay: "30 days",
    fee: "free (govt fee waived) + ~INR 825 service charge",
    apply_url: "https://www.bdhcdelhi.org/visa-information",
    apply_label: "Bangladesh Visa Info",
    us_visa_benefit: false,
    us_visa_detail: null,
    notes:
      "Visa must be obtained before travel. No visa-on-arrival for Indians. Government fee waived " +
      "under India-Bangladesh bilateral agreement. Processing 5-7 working days. Photo size is " +
      "45mm x 35mm (non-standard). Apply at Bangladesh Visa Application Centre.",
  },
};

// ──────────────────────────────────────────────
//  HELPER: Quick-reference lookup tables
// ──────────────────────────────────────────────

/**
 * Countries that are VISA-FREE, VISA-ON-ARRIVAL, or FREE-ETA
 * (i.e. you can travel without a traditional embassy visa application)
 */
const EASY_ENTRY_COUNTRIES = Object.entries(VISA_DATA)
  .filter(([, v]) =>
    ["visa_free", "visa_on_arrival", "free_eta"].includes(v.visa_type)
  )
  .map(([key, v]) => ({
    key,
    country: v.country,
    type: v.visa_type,
    max_stay: v.max_stay,
    fee: v.fee,
  }));

/**
 * Countries where an e-visa is available
 * (must be approved before travel, but no embassy visit needed)
 */
const E_VISA_COUNTRIES = Object.entries(VISA_DATA)
  .filter(([, v]) => v.visa_type === "e_visa")
  .map(([key, v]) => ({
    key,
    country: v.country,
    max_stay: v.max_stay,
    fee: v.fee,
  }));

/**
 * Countries where having a valid US visa provides a benefit
 */
const US_VISA_BENEFIT_COUNTRIES = Object.entries(VISA_DATA)
  .filter(([, v]) => v.us_visa_benefit === true)
  .map(([key, v]) => ({
    key,
    country: v.country,
    benefit: v.us_visa_detail,
  }));

// ──────────────────────────────────────────────
//  EXPORTS
// ──────────────────────────────────────────────

module.exports = {
  VISA_DATA,
  EASY_ENTRY_COUNTRIES,
  E_VISA_COUNTRIES,
  US_VISA_BENEFIT_COUNTRIES,
};
