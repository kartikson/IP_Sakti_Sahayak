/**
 * IP-SAKTI Sahayak — Controlled Statutory & Regulatory Source Database
 * 
 * ARCHITECTURE NOTE:
 * This module defines the controlled, demo-safe baseline source dataset for IP-SAKTI Sahayak.
 * In a production deployment, this dataset can be fetched from backend REST API endpoints:
 *   GET /api/v1/sources
 *   GET /api/v1/sources/:id
 * 
 * STRICT COMPLIANCE POLICY:
 * - Real, authentic statutory acts, treaties, and pharmacopoeial monographs only.
 * - Never invent section numbers, treaty articles, or authorities.
 * - Never invent fake or placeholder URLs. When a direct link is not supplied, url is null.
 * - Demo/mock data is clearly separated from production backends via metadata flags.
 */

export const CONTROLLED_SOURCES = [
  {
    id: 'patents-act-1970-s3p',
    code: 'ACT-PAT-1970-S3P',
    title: 'The Patents Act, 1970 — Section 3(p)',
    provision: 'Section 3(p)',
    jurisdiction: 'India',
    authority: 'Indian Patent Office (CGPDTM), Ministry of Commerce and Industry',
    category: 'Statutory Law',
    categoryKey: 'PATENTS',
    versionOrDate: 'Act No. 39 of 1970, as amended by Patents (Amendment) Act, 2002',
    excerpt: 'An invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components is not an invention within the meaning of this Act.',
    summary: 'Statutory exclusion barring patent grants on traditional knowledge per se and mere aggregations of known properties of traditionally known botanical ingredients.',
    url: 'https://ipindia.gov.in',
    isControlledMock: true,
    assessmentGuidance: 'Precludes patenting of traditional Ayurvedic preparations unless an unexpected, non-obvious synergistic technical effect is experimentally substantiated.',
  },
  {
    id: 'patents-act-1970-s3e',
    code: 'ACT-PAT-1970-S3E',
    title: 'The Patents Act, 1970 — Section 3(e)',
    provision: 'Section 3(e)',
    jurisdiction: 'India',
    authority: 'Indian Patent Office (CGPDTM), Ministry of Commerce and Industry',
    category: 'Statutory Law',
    categoryKey: 'PATENTS',
    versionOrDate: 'Act No. 39 of 1970, Section 3(e)',
    excerpt: 'A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof or a process for producing such substance is not patentable.',
    summary: 'Excludes physical admixtures of known botanical substances unless biological synergism or unexpected technical interaction is documented through comparative assays.',
    url: 'https://ipindia.gov.in',
    isControlledMock: true,
    assessmentGuidance: 'Requires comparative in-vitro or in-vivo biological assay evidence (e.g. Combination Index CI < 1) comparing the combination against individual constituents.',
  },
  {
    id: 'tkdl-prior-art-repository',
    code: 'DB-TKDL-CSIR-AYUSH',
    title: 'Traditional Knowledge Digital Library (TKDL)',
    provision: 'Prior Art Repository & Access Treaties',
    jurisdiction: 'India / International Search Authorities',
    authority: 'Council of Scientific and Industrial Research (CSIR) & Ministry of Ayush',
    category: 'Prior Art Repository',
    categoryKey: 'TKDL',
    versionOrDate: 'Established 2001, Access agreements with EPO, USPTO, JPO, IPO',
    excerpt: 'Digitized collection of over 250,000 formulations from classical treatises of Ayurveda, Unani, and Siddha translated into 5 international languages to prevent wrongful patenting.',
    summary: 'Defensive digital prior art library searchable by international patent examiners to prevent misappropriation of documented ASU knowledge.',
    url: null, // URL omitted as direct public deeplink to database records requires institutional clearance
    isControlledMock: true,
    assessmentGuidance: 'Classical Ayurvedic actives listed in treatises are indexed in TKDL; patent claims must isolate the novel extraction solvent, specific carrier matrix, or synergistic pharmacokinetic enhancement.',
  },
  {
    id: 'drugs-cosmetics-rules-1945-r158b',
    code: 'REG-DCR-1945-R158B',
    title: 'Drugs & Cosmetics Rules, 1945 — Rule 158B',
    provision: 'Rule 158B',
    jurisdiction: 'India',
    authority: 'Ministry of Ayush / Central Drugs Standard Control Organisation (CDSCO)',
    category: 'Regulatory Rules',
    categoryKey: 'REGULATORY',
    versionOrDate: 'Gazette Notification GSR 560(E), dated 10 August 2010',
    excerpt: 'Prescribes guidelines and regulatory prerequisites for issue of license with respect to Ayurveda, Siddha, or Unani patent or proprietary medicines.',
    summary: 'Mandates safety and effectiveness documentation (published literature or pilot clinical trial protocols) required for ASU proprietary drug licensing by State Licensing Authorities.',
    url: null,
    isControlledMock: true,
    assessmentGuidance: 'Novel combination requires submission of published literature on safety or pilot clinical study protocols before State Licensing Authority (SLA).',
  },
  {
    id: 'biological-diversity-act-2002-s6',
    code: 'ACT-BDA-2002-S6',
    title: 'Biological Diversity Act, 2002 — Section 6',
    provision: 'Section 6(1)',
    jurisdiction: 'India',
    authority: 'National Biodiversity Authority (NBA)',
    category: 'Statutory Law',
    categoryKey: 'PATENTS',
    versionOrDate: 'Act No. 18 of 2003, effective 1 October 2003',
    excerpt: 'No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority.',
    summary: 'Mandates prior statutory approval (Form III) from the National Biodiversity Authority before filing patent applications utilizing Indian biological resources.',
    url: null,
    isControlledMock: true,
    assessmentGuidance: 'Mandatory approval from NBA required prior to patent grant for biological resources sourced in India under Biological Diversity Rules, 2004.',
  },
  {
    id: 'patents-act-1970-s10-4',
    code: 'ACT-PAT-1970-S10-4',
    title: 'The Patents Act, 1970 — Section 10(4)(d)(ii)',
    provision: 'Section 10(4)(d)(ii)',
    jurisdiction: 'India',
    authority: 'Indian Patent Office (CGPDTM), Ministry of Commerce and Industry',
    category: 'Statutory Law',
    categoryKey: 'PATENTS',
    versionOrDate: 'Inserted by Patents (Amendment) Act, 2002',
    excerpt: 'If the applicant mentions a biological material in the specification which may not be available to the public or if the biological material is not available to the public, the specification shall disclose the source and geographical origin of the biological material.',
    summary: 'Statutory disclosure requirement mandating specification of botanical species (binomial taxonomy) and geographical origin for all biological materials in patent claims.',
    url: 'https://ipindia.gov.in',
    isControlledMock: true,
    assessmentGuidance: 'Mandates complete and sufficient description; patent applications lacking verifiable botanical taxonomy face immediate Section 10 sufficiency rejections.',
  },
  {
    id: 'pct-article-33',
    code: 'INT-WIPO-PCT-A33',
    title: 'Patent Cooperation Treaty (PCT) — Article 33',
    provision: 'Article 33(1)-(3) & Rule 33.1',
    jurisdiction: 'International',
    authority: 'World Intellectual Property Organization (WIPO)',
    category: 'International Treaty',
    categoryKey: 'INTERNATIONAL',
    versionOrDate: 'Done at Washington on June 19, 1970; amended September 28, 1979',
    excerpt: 'The objective of the international preliminary examination is to formulate a preliminary and non-binding opinion on the questions whether the claimed invention appears to be novel, to involve an inventive step (to be non-obvious), and to be industrially applicable.',
    summary: 'International framework for novelty and inventive step screening evaluated by International Searching Authorities (ISA) against global prior art.',
    url: 'https://www.wipo.int',
    isControlledMock: true,
    assessmentGuidance: 'Screened against International Search Authorities (ISA). Documented traditional uses serve as prior art under PCT Rule 33.1.',
  },
  {
    id: 'epc-article-52-54',
    code: 'INT-EPO-EPC-A52-54',
    title: 'European Patent Convention (EPC) — Articles 52 & 54',
    provision: 'Articles 52(2) & 54',
    jurisdiction: 'European Patent Organisation',
    authority: 'European Patent Office (EPO)',
    category: 'International Treaty',
    categoryKey: 'INTERNATIONAL',
    versionOrDate: 'European Patent Convention 16th edition, June 2016',
    excerpt: 'European patents shall be granted for any inventions, in all fields of technology, provided that they are new, involve an inventive step and are susceptible of industrial application.',
    summary: 'Defines patentability criteria for technical formulations and delivery complexes in European member states; excludes products of nature as such.',
    url: null,
    isControlledMock: true,
    assessmentGuidance: 'Plant extracts are patentable if specific active fractions, novel phospholipid complexes, or non-obvious synergistic combinations are claimed with repeatable technical effect.',
  },
  {
    id: 'api-monographs-pcimh',
    code: 'STD-PCIMH-API-V1-10',
    title: 'Ayurvedic Pharmacopoeia of India (API)',
    provision: 'Part I & Part II Monographs',
    jurisdiction: 'India',
    authority: 'Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)',
    category: 'Pharmacopoeial Standard',
    categoryKey: 'PHARMACOPOEIA',
    versionOrDate: 'Second Schedule, Drugs & Cosmetics Act, 1940',
    excerpt: 'Legal standards of purity, quality, and therapeutic identity for Ayurvedic single drugs and compound formulations under the Second Schedule of the Drugs & Cosmetics Act.',
    summary: 'Authoritative statutory standards establishing botanical identity, foreign matter limits, heavy metal thresholds, and assay markers for ASU medicines.',
    url: null,
    isControlledMock: true,
    assessmentGuidance: 'Proof of safety relies on classical treatise citations; botanical identity and assay purity must comply with API pharmacopoeial monographs.',
  },
  {
    id: 'wipo-treaty-grtk-2024',
    code: 'INT-WIPO-GRTK-2024',
    title: 'WIPO Treaty on Intellectual Property, Genetic Resources and Associated Traditional Knowledge',
    provision: 'Diplomatic Conference Treaty Document',
    jurisdiction: 'International',
    authority: 'World Intellectual Property Organization (WIPO)',
    category: 'International Treaty',
    categoryKey: 'INTERNATIONAL',
    versionOrDate: 'Adopted May 24, 2024 (Geneva)',
    excerpt: 'Where the claimed invention in a patent application is based on genetic resources, each Contracting Party shall require applicants to disclose the country of origin of the genetic resources.',
    summary: 'Mandates international patent applicants to disclose country of origin and traditional knowledge source in all contracting jurisdictions.',
    url: 'https://www.wipo.int',
    isControlledMock: true,
    assessmentGuidance: 'Requires mandatory compliance with genetic resource disclosure and Access and Benefit-Sharing (ABS) protocols in PCT national phase entries.',
  },
  {
    id: 'cgpdtm-tk-guidelines-2019',
    code: 'GUIDE-CGPDTM-TK-2019',
    title: 'Guidelines for Processing Patent Applications Relating to Traditional Knowledge and Biological Material',
    provision: 'Manual of Patent Practice — Traditional Knowledge Chapter',
    jurisdiction: 'India',
    authority: 'Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)',
    category: 'Examination Guidelines',
    categoryKey: 'PATENTS',
    versionOrDate: 'Revised Edition 2019',
    excerpt: 'Guiding principles for patent examiners evaluating Section 3(p) and Section 3(e) objections, non-obviousness tests for synergistic herbal combinations, and biological material disclosures under Section 10.',
    summary: 'Official administrative guidelines instructing patent examiners on screening ASU patent claims against TKDL and evaluating biological synergy assays.',
    url: 'https://ipindia.gov.in',
    isControlledMock: true,
    assessmentGuidance: 'Provides examination framework for Section 3(p) objections and guidelines on evaluating synergy data over classical references.',
  },
  {
    id: 'drugs-cosmetics-act-1940-s33e',
    code: 'ACT-DCA-1940-S33E',
    title: 'Drugs & Cosmetics Act, 1940 — Section 33E',
    provision: 'Section 33E & Chapter IV-A',
    jurisdiction: 'India',
    authority: 'Central Drugs Standard Control Organisation (CDSCO)',
    category: 'Statutory Law',
    categoryKey: 'REGULATORY',
    versionOrDate: 'Act No. 23 of 1940, as amended',
    excerpt: 'Defines misbranded Ayurvedic, Siddha or Unani drugs, including preparations that claim to contain ingredients not disclosed or which make unsubstantiated therapeutic claims.',
    summary: 'Statutory prohibition against misbranding, deceptive labeling, or unapproved therapeutic claims for topical or cosmetic preparations.',
    url: null,
    isControlledMock: true,
    assessmentGuidance: 'Topical preparations containing synthetic peptides are governed under Cosmetics Rules; making therapeutic ASU claims risks misbranding action.',
  },
  {
    id: 'drugs-cosmetics-act-1940-s3a',
    code: 'ACT-DCA-1940-S3A',
    title: 'Drugs & Cosmetics Act, 1940 — Section 3(a)',
    provision: 'Section 3(a)',
    jurisdiction: 'India',
    authority: 'Ministry of Ayush / CDSCO',
    category: 'Statutory Law',
    categoryKey: 'REGULATORY',
    versionOrDate: 'Act No. 23 of 1940, Section 3(a)',
    excerpt: 'Ayurvedic, Siddha or Unani drug includes all medicines intended for internal or external use for or in the diagnosis, treatment, mitigation or prevention of disease or disorder in human beings or animals, and manufactured exclusively in accordance with the formulae described in the authoritative books of Ayurvedic, Siddha and Unani systems of medicine, specified in the First Schedule.',
    summary: 'Defines statutory criteria for classical ASU medicines; all ingredients must be documented in First Schedule authoritative treatises.',
    url: null,
    isControlledMock: true,
    assessmentGuidance: 'Manufacture and commercialization of secret or undisclosed formulas is prohibited; all ASU formulations must disclose ingredients referenced in First Schedule treatises.',
  },
];

/**
 * Find source by ID.
 * @param {string} id 
 * @returns {object|undefined}
 */
export function getSourceById(id) {
  if (!id) return undefined;
  return CONTROLLED_SOURCES.find((s) => s.id === id || s.code === id);
}

/**
 * Filter controlled sources by search query and category.
 * @param {object} params
 * @param {string} params.query
 * @param {string} params.categoryKey
 * @param {string} params.jurisdiction
 * @returns {Array}
 */
export function filterSources({ query = '', categoryKey = 'ALL', jurisdiction = 'ALL' } = {}) {
  const q = query.trim().toLowerCase();
  return CONTROLLED_SOURCES.filter((source) => {
    const matchesCategory = categoryKey === 'ALL' || source.categoryKey === categoryKey;
    const matchesJurisdiction =
      jurisdiction === 'ALL' ||
      (jurisdiction === 'India' && source.jurisdiction.includes('India')) ||
      (jurisdiction === 'International' && source.jurisdiction.includes('International'));

    if (!matchesCategory || !matchesJurisdiction) return false;

    if (!q) return true;

    return (
      source.title.toLowerCase().includes(q) ||
      source.provision.toLowerCase().includes(q) ||
      source.authority.toLowerCase().includes(q) ||
      source.code.toLowerCase().includes(q) ||
      source.summary.toLowerCase().includes(q) ||
      (source.excerpt && source.excerpt.toLowerCase().includes(q))
    );
  });
}
