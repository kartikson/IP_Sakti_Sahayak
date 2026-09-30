import { getSourceById } from '../data/sourcesRegistry.js';

/**
 * Builds a structured statutory citation object merged with controlled database metadata.
 * @param {string} sourceId
 * @param {number} citationIndex
 * @param {string} customAssessment
 * @returns {object}
 */
function buildCitation(sourceId, citationIndex, customAssessment) {
  const master = getSourceById(sourceId);
  if (!master) {
    return {
      id: sourceId,
      citationIndex,
      authority: 'Statutory Authority',
      section: `Provision [${citationIndex}]`,
      provision: `Provision [${citationIndex}]`,
      jurisdiction: 'India',
      category: 'Statutory Law',
      versionOrDate: 'Statutory Archive',
      excerpt: null,
      summary: '',
      url: null,
      assessment: customAssessment || '',
    };
  }

  return {
    ...master,
    citationIndex,
    section: master.provision,
    assessment: customAssessment || master.assessmentGuidance || master.summary,
  };
}

export const FORMULATION_TYPES = [
  { id: 'classical', label: 'Classical Ayurvedic Formulation (Shastriya) — Authoritative Treatise' },
  { id: 'proprietary_asu', label: 'Ayurvedic Proprietary Medicine (Anubhuta) — Novel Composition' },
  { id: 'botanical_extract', label: 'Standardized Botanical Extract / Bioactive Phytochemical Fraction' },
  { id: 'novel_delivery', label: 'Advanced Delivery System (Phytosome / Nanoparticle / Liposomal Kwatha)' },
  { id: 'cosmeceutical_asu', label: 'Ayurvedic Cosmeceutical / Topical Therapeutic Preparation' },
];

/**
 * 4 Demonstration Scenarios covering High, Medium, Low confidence, and Abstention.
 */
export const CONSULTATION_SCENARIOS = [
  {
    id: 'scenario_high',
    scenarioType: 'high',
    badgeVariant: 'primary',
    label: 'High Confidence Answer',
    tag: 'Definitive Statutory Match',
    formulationType: 'proprietary_asu',
    title: 'Curcumin-Piperine Synergistic Formulation',
    botanicals: 'Haridra (Curcuma longa rhizome extract 95%) + Maricha (Piper nigrum fruit alkaloid 98%)',
    method: 'Supercritical CO2 extraction followed by micro-encapsulation in lipid matrix yielding 4.2x greater bioavailability than standard aqueous decoction.',
    question: 'Is a standardized Curcuma longa and Piper nigrum formulation patentable under Section 3(p) and 3(e) of the Indian Patents Act, 1970?',
  },
  {
    id: 'scenario_medium',
    scenarioType: 'medium',
    badgeVariant: 'gold',
    label: 'Medium Confidence Answer',
    tag: 'Conditional Novel Delivery',
    formulationType: 'novel_delivery',
    title: 'Phytosomal Delivery Complex of Withania somnifera (Ashwagandha)',
    botanicals: 'Ashwagandha (Withania somnifera root extract standardized to withanolides 5%) complexed with phosphatidylcholine',
    method: 'Specific molar ratio complexation in anhydrous organic solvent under controlled sonication preventing degradation of withanolide aglycones.',
    question: 'Can an improved extraction and complexation process for Ashwagandha be protected under the Patent Cooperation Treaty (PCT) and European Patent Office (EPO)?',
  },
  {
    id: 'scenario_low',
    scenarioType: 'low',
    badgeVariant: 'warning',
    label: 'Low Confidence Answer',
    tag: 'Uncertain ASU / Cosmetic Boundary',
    formulationType: 'cosmeceutical_asu',
    title: 'Hybrid Complexion Emulsion with Synthetic Oligopeptides',
    botanicals: 'Kumkumadi Taila (Saffron, Sandalwood, Turmeric) + Synthetic Hexapeptide-9 (100 ppm)',
    method: 'Dual-phase cold emulsification blending classical botanical oil with synthetic anti-wrinkle cosmetic oligopeptides.',
    question: 'Can a topical complexion emulsion blending classical Kumkumadi Taila with synthetic anti-wrinkle peptides be licensed as an Ayurvedic Proprietary Medicine?',
  },
  {
    id: 'scenario_abstention',
    scenarioType: 'abstention',
    badgeVariant: 'neutral',
    label: 'Abstention Case',
    tag: 'Insufficient Botanical Sources',
    formulationType: 'classical',
    title: 'Undisclosed Polyherbal Blend "Secret Forest Decoction"',
    botanicals: 'Proprietary undisclosed forest roots and sacred leaves (no botanical taxa disclosed)',
    method: 'Ancestral water decoction prepared per private family tradition without chemical fractionation or disclosure.',
    question: 'Can an undisclosed proprietary herbal decoction obtain patent protection in India without disclosing its botanical species and geographic source?',
  },
  {
    id: 'scenario_nosources',
    scenarioType: 'nosources',
    badgeVariant: 'neutral',
    label: 'No Sources Case',
    tag: 'Non-ASU Synthetic Entity',
    formulationType: 'novel_delivery',
    title: 'Synthetic Silicone Hydrogel Ophthalmic Matrix',
    botanicals: 'Polydimethylsiloxane (PDMS) + Synthetic Polyethylene Glycol (no botanical actives)',
    method: 'High-pressure solvent casting of non-botanical silicone elastomer polymer.',
    question: 'Can a purely synthetic silicone hydrogel polymer be licensed as an Ayurvedic Proprietary Medicine or screened against TKDL prior art?',
  },
];

export const EXAMPLE_QUESTIONS = [
  {
    id: 'ex-1',
    category: 'Section 3(p) & Patentability',
    label: 'Curcumin-Piperine Synergistic Formulation',
    formulationType: 'proprietary_asu',
    title: 'Bio-enhanced Curcumin-Piperine Synergistic Formulation for Anti-inflammatory Application',
    botanicals: 'Haridra (Curcuma longa rhizome extract 95%) + Maricha (Piper nigrum fruit alkaloid 98%)',
    method: 'Supercritical CO2 extraction followed by micro-encapsulation in lipid matrix yielding 4.2x greater bioavailability than standard aqueous decoction.',
    question: 'Is a standardized Curcuma longa and Piper nigrum formulation patentable under Section 3(p) and 3(e) of the Indian Patents Act, 1970?',
  },
  {
    id: 'ex-2',
    category: 'Traditional Knowledge & TKDL',
    label: 'TKDL Prior Art Overcoming',
    formulationType: 'classical',
    title: 'Standardized Polyherbal Decoction based on Classical Triphala Formulation',
    botanicals: 'Amalaki (Phyllanthus emblica) + Haritaki (Terminalia chebula) + Bibhitaki (Terminalia bellirica)',
    method: 'Classical kwatha preparation converted into solid lipid nanoparticles (SLN) to enhance targeted intestinal absorption.',
    question: 'How can traditional knowledge documented in TKDL monographs be distinguished from an inventive synergistic formulation?',
  },
  {
    id: 'ex-3',
    category: 'Regulatory Licensing (Rule 158B)',
    label: 'ASU Proprietary Medicine Dossier',
    formulationType: 'proprietary_asu',
    title: 'Multi-herbal Glycemic Regulator with Gudmar and Jambu Seed Extract',
    botanicals: 'Meshashringi / Gudmar (Gymnema sylvestre leaf) + Jambu (Syzygium cumini seed) + Methi (Trigonella foenum-graecum)',
    method: 'Aqueous-ethanolic dual extraction standardized to gymnemic acids (>25%) and jamboline fractions.',
    question: 'What safety and efficacy documentation is required under Rule 158B of Drugs & Cosmetics Rules for an ASU proprietary medicine license?',
  },
  {
    id: 'ex-4',
    category: 'International IP Protection',
    label: 'PCT / International Process Claims',
    formulationType: 'novel_delivery',
    title: 'Phytosomal Delivery Complex of Withania somnifera (Ashwagandha)',
    botanicals: 'Ashwagandha (Withania somnifera root extract standardized to withanolides 5%) complexed with phosphatidylcholine',
    method: 'Specific molar ratio complexation in anhydrous organic solvent under controlled sonication preventing degradation of withanolide aglycones.',
    question: 'Can an improved extraction and complexation process for Ashwagandha be protected under the Patent Cooperation Treaty (PCT) and European Patent Office (EPO)?',
  },
  {
    id: 'ex-5',
    category: 'Biodiversity Act & NBA Approval',
    label: 'Biological Diversity Act Compliance',
    formulationType: 'botanical_extract',
    title: 'Standardized Boswellic Acid Fraction for Osteoarthritis Management',
    botanicals: 'Shallaki (Boswellia serrata gum resin extract standardized to 30% AKBA)',
    method: 'Selective fractional crystallization removing non-active volatile terpenes while concentrating 3-O-acetyl-11-keto-beta-boswellic acid (AKBA).',
    question: 'What are the mandatory approval procedures under Section 6 of the Biological Diversity Act, 2002 prior to applying for an IP patent in India?',
  },
];

/**
 * Validates consultation question.
 * @param {string} question 
 * @returns {string} Error message or empty string.
 */
export function validateQuestion(question) {
  const trimmed = (question || '').trim();
  if (!trimmed) {
    return 'Please enter your consultation question.';
  }
  if (trimmed.length < 10) {
    return 'Please enter a detailed consultation question (minimum 10 characters).';
  }
  return '';
}

/**
 * Validates formulation title and botanicals.
 * @param {object} formulationContext 
 * @returns {string} Error message or empty string.
 */
export function validateFormulation(formulationContext) {
  if (!formulationContext?.title?.trim()) {
    return 'Please provide a formulation title or invention description.';
  }
  if (!formulationContext?.botanicals?.trim()) {
    return 'Please specify the botanical entities, plant parts, or active constituents.';
  }
  return '';
}

/**
 * Controlled Demo Fallback Response.
 * Strictly isolated for SIH demonstration resilience if live services fail.
 * Explicitly marked as demo behavior, not live legal determinations.
 */
export function getControlledDemoFallback(context = {}) {
  const baseDisclaimer =
    'This information is not legal advice. The guidance provided by IP-SAKTI Sahayak is for informational research and preliminary screening purposes only, derived from published statutory acts, administrative rules, and pharmacopoeial monographs. It does not constitute formal legal counsel and cannot substitute for representation by a registered patent agent or advocate.';

  const fallbackCitations = [
    buildCitation(
      'patents-act-1970-s3p',
      1,
      'Precludes patenting of traditional herbal preparations unless an unexpected, non-obvious synergistic technical effect is experimentally substantiated.'
    ),
    buildCitation(
      'patents-act-1970-s3e',
      2,
      'Requires comparative in-vitro / in-vivo biological assay evidence comparing the combination against individual active constituents (Combination Index CI < 1).'
    ),
    buildCitation(
      'tkdl-prior-art-repository',
      3,
      'Active ingredients listed for therapeutic indications in Charaka Samhita and Bhavaprakasha Nighantu. Novelty resides solely in the extraction technology or quantitative pharmacokinetic synergy.'
    ),
    buildCitation(
      'drugs-cosmetics-rules-1945-r158b',
      4,
      'Novel combination requires submission of published literature on safety, or pilot clinical study protocols before State Licensing Authority (SLA).'
    ),
  ];

  const fallbackChecklist = [
    {
      step: '1',
      title: 'Synergism Assay Dossier (CI < 1)',
      desc: 'Conduct isobologram or combination index assay to document unexpected synergism over individual herbal constituents.',
    },
    {
      step: '2',
      title: 'Form III NBA Approval',
      desc: 'Submit Form III application to the National Biodiversity Authority under Section 6 of Biological Diversity Act, 2002.',
    },
    {
      step: '3',
      title: 'Monograph Cross-Mapping',
      desc: 'Document non-anticipation against First Schedule recognized Ayurvedic pharmacopoeial standards.',
    },
    {
      step: '4',
      title: 'Claim Scope Structuring',
      desc: 'Focus claims on the specific standardized ratio and pharmacokinetic delivery matrix rather than plant parts per se.',
    },
  ];

  return {
    jurisdiction: context.jurisdiction || 'India (IPO / TKDL / AYUSH)',
    formulationType: context.formulationType || 'Ayurvedic Proprietary Medicine (ASU)',
    timestamp: new Date().toISOString(),
    evaluationScore: 'Controlled Demo Fallback Determination',
    confidence: 'High',
    confidenceExplanation:
      'High confidence (Demo Fallback Mode): Loaded from the pre-verified offline demonstration cache for the Bio-enhanced Curcumin-Piperine Synergistic Formulation. This response ensures presentation continuity while maintaining isolated, transparent demo provenance.',
    isAbstention: false,
    isDemoFallback: true,
    dataSource: 'CONTROLLED_DEMO_FALLBACK',
    fallbackNotice: {
      badge: 'Controlled Demo Fallback (Offline Mode)',
      title: 'Controlled Demo Fallback Active',
      message:
        'This consultation result was retrieved from the local controlled demo cache because the live analysis pipeline was offline or simulated a test failure. It provides pre-verified demonstration data with authentic statutory citations while explicitly marking the output as demo behavior.',
    },
    userQuestion:
      context.question ||
      'Is a standardized Curcuma longa and Piper nigrum formulation patentable under Section 3(p) and 3(e) of the Indian Patents Act, 1970?',
    formulationContext: {
      title:
        context.title ||
        'Bio-enhanced Curcumin-Piperine Synergistic Formulation (Controlled Demo Sample)',
      category: 'Ayurvedic Proprietary Medicine (ASU)',
      botanicals:
        context.botanicals ||
        'Haridra (Curcuma longa rhizome extract 95%) + Maricha (Piper nigrum fruit alkaloid 98%)',
      method:
        context.method ||
        'Supercritical CO2 extraction followed by micro-encapsulation in lipid matrix yielding 4.2x greater bioavailability than standard aqueous decoction.',
    },
    guidance: {
      headline: 'Section 3(p) Anticipation Screened; Synergistic Evidence Required (Controlled Demo)',
      findingText:
        'Controlled Demo Output: Analysis of the bio-enhanced Curcumin-Piperine formulation indicates that the botanical ingredients (Curcuma longa and Piper nigrum) have established textual recognition in classical Ayurvedic treatises indexed in the Traditional Knowledge Digital Library (TKDL) [3]. Under Section 3(p) of the Patents Act, 1970 [1], traditional knowledge per se is statutorily excluded from patentability. To overcome this exclusion and substantiate an inventive step, experimental biological assay data demonstrating synergy exceeding mere aggregation under Section 3(e) [2] must be submitted. Commercial licensing of this formulation as an Ayurvedic Proprietary Medicine must fulfill the evidence of effectiveness and safety requirements under Rule 158B of the Drugs & Cosmetics Rules, 1945 [4].',
      recommendedAction:
        'Draft claims focused on the specific synergistic ratio and modified bioavailability profile. File Form III with National Biodiversity Authority clearance under Section 6 of Biological Diversity Act, 2002.',
      actionChecklist: fallbackChecklist,
    },
    summary: {
      headline: 'Section 3(p) Anticipation Screened; Synergistic Evidence Required (Controlled Demo)',
      findingText:
        'Curcuma longa and Piper nigrum have established textual standing in TKDL. Claims must substantiate non-obvious synergy under Section 3(e).',
      recommendedAction:
        'Focus claims on synergistic ratio and bio-enhancement mechanisms.',
    },
    statutoryCitations: fallbackCitations,
    actionChecklist: fallbackChecklist,
    disclaimer: baseDisclaimer,
  };
}

/**
 * Generates source-grounded legal intelligence based on jurisdiction, formulation context, and scenario.
 * Simulated latency: ~850ms.
 */
export function analyzeConsultation({
  jurisdiction = 'India',
  formulationType = 'proprietary_asu',
  title = '',
  botanicals = '',
  method = '',
  question = '',
  scenarioType = null,
  triggerError = false,
  useFallback = false,
}) {
  return new Promise((resolve, reject) => {
    // Immediate controlled demo fallback option
    if (useFallback) {
      setTimeout(() => {
        resolve(
          getControlledDemoFallback({
            jurisdiction,
            formulationType,
            title,
            botanicals,
            method,
            question,
          })
        );
      }, 400);
      return;
    }

    // Check for simulated error testing
    if (triggerError || question.trim() === 'TRIGGER_ERROR_TEST') {
      setTimeout(() => {
        reject(
          new Error(
            'Statutory analysis service temporarily unavailable while indexing TKDL cross-references. Please try again.'
          )
        );
      }, 700);
      return;
    }

    setTimeout(() => {
      const isIndia = jurisdiction === 'India';
      const typeLabel =
        FORMULATION_TYPES.find((f) => f.id === formulationType)?.label || formulationType;
      const lowerQ = question.toLowerCase();
      const lowerBot = botanicals.toLowerCase();

      // Determine answer mode: nosources, abstention, low, medium, or high
      let mode = scenarioType;
      if (!mode) {
        if (
          lowerBot.includes('silicone') ||
          lowerBot.includes('pdms') ||
          lowerBot.includes('no botanical') ||
          lowerQ.includes('silicone') ||
          lowerQ.includes('purely synthetic')
        ) {
          mode = 'nosources';
        } else if (
          lowerQ.includes('secret') ||
          lowerQ.includes('undisclosed') ||
          lowerBot.includes('undisclosed') ||
          lowerBot.includes('secret') ||
          lowerBot.includes('unknown')
        ) {
          mode = 'abstention';
        } else if (
          lowerQ.includes('peptide') ||
          lowerQ.includes('synthetic') ||
          lowerBot.includes('peptide') ||
          lowerQ.includes('cosmetic') && lowerQ.includes('medicine')
        ) {
          mode = 'low';
        } else if (
          !isIndia ||
          lowerQ.includes('pct') ||
          lowerQ.includes('epo') ||
          formulationType === 'novel_delivery'
        ) {
          mode = 'medium';
        } else {
          mode = 'high';
        }
      }

      const baseDisclaimer =
        'This information is not legal advice. The guidance provided by IP-SAKTI Sahayak is for informational research and preliminary screening purposes only, derived from published statutory acts, administrative rules, and pharmacopoeial monographs. It does not constitute formal legal counsel and cannot substitute for representation by a registered patent agent or advocate.';

      // Case 0: No Sources Retrieved (Zero Citations Case — Never fabricate citations)
      if (mode === 'nosources') {
        const checklist = [
          {
            step: '1',
            title: 'Verify Biological Resource Absence',
            desc: 'Confirm that formulation does not incorporate plants, fungi, algae, or micro-organisms obtained from India.',
          },
          {
            step: '2',
            title: 'Redirect to CDSCO Medical Device / Chemical IP Framework',
            desc: 'Screen under CDSCO Medical Device Rules 2017 (for polymers/hydrogels) or conventional patent examination guidelines under Section 2(1)(j).',
          },
          {
            step: '3',
            title: 'Consult Synthetic Polymer IP Attorney',
            desc: 'Consult a patent attorney specializing in synthetic macromolecular materials and chemical patents rather than AYUSH/ASU regulatory frameworks.',
          },
        ];

        resolve({
          jurisdiction: isIndia ? 'India (IPO / CDSCO / Non-ASU)' : 'International (PCT / WIPO / USPTO)',
          formulationType: typeLabel,
          timestamp: new Date().toISOString(),
          evaluationScore: 'No Supporting Sources Retrieved',
          confidence: 'Low',
          confidenceExplanation:
            'Low confidence: Supporting statutory sources were not retrieved from the active knowledge registry. The queried entity comprises non-botanical synthetic polymers (PDMS, Polyethylene Glycol) with zero presence in classical ASU First Schedule treatises or Traditional Knowledge Digital Library (TKDL) monographs.',
          isAbstention: false,
          hasNoSources: true,
          userQuestion: question,
          formulationContext: {
            title: title || 'Synthetic Non-Botanical Preparation',
            category: typeLabel,
            botanicals: botanicals || 'Non-botanical synthetic polymers',
            method: method || 'Standard polymer casting method',
          },
          noSourcesDetails: {
            reason:
              'No supporting statutory provisions, classical monographs, or TKDL references were retrieved for this non-botanical entity.',
            retrievalScope: [
              'Ayurvedic Pharmacopoeia of India (API)',
              'Traditional Knowledge Digital Library (TKDL)',
              'First Schedule authoritative Ayurvedic texts (Charaka, Sushruta, AFI)',
              'Biological Diversity Act Section 6 biological resource registries',
            ],
            guidanceExplanation:
              'The statutory retrieval engine screened all indexed ASU legal provisions and traditional knowledge monographs and returned zero matches. The queried substances are non-biological synthetic polymers outside the scope of ASU governance. To preserve statutory citation integrity, no citations have been fabricated.',
          },
          guidance: {
            headline: 'Zero Statutory ASU Sources Retrieved for Non-Botanical Synthetic Entity',
            findingText:
              'A search across indexed statutory repositories, First Schedule pharmacopoeial texts, and Traditional Knowledge Digital Library (TKDL) monographs yielded zero supporting sources for this inquiry. Purely synthetic polymers such as polydimethylsiloxane (PDMS) and polyethylene glycol are entirely non-biological and do not qualify as Ayurvedic, Siddha, or Unani (ASU) drugs under Section 3(a) of the Drugs & Cosmetics Act, 1940. Furthermore, because no Indian biological resources or traditional knowledge are implicated, Section 3(p) patent exclusions and Biological Diversity Act clearances do not apply. In accordance with strict citation integrity standards, zero statutory citations have been generated.',
            recommendedAction:
              'Redirect inquiry from AYUSH/ASU statutory screening to conventional chemical/polymer patent assessment under Section 2(1)(j) of the Patents Act, 1970 or CDSCO Medical Device Rules, 2017.',
            actionChecklist: checklist,
          },
          summary: {
            headline: 'Zero Statutory ASU Sources Retrieved for Non-Botanical Synthetic Entity',
            findingText:
              'A search across statutory repositories and TKDL monographs yielded zero supporting sources for this non-biological synthetic formulation. Zero citations generated.',
            recommendedAction:
              'Redirect to CDSCO Medical Device Rules or conventional chemical patent examination guidelines.',
          },
          statutoryCitations: [], // Strictly empty! Never fabricate citations!
          actionChecklist: checklist,
          disclaimer: baseDisclaimer,
        });
        return;
      }

      // Case 1: Abstention
      if (mode === 'abstention') {
        const abstentionCitations = [
          buildCitation(
            'patents-act-1970-s10-4',
            1,
            'Mandates complete and sufficient description of the invention. Patent applications for biological materials must disclose exact botanical taxonomy (genus and species) and source of origin.'
          ),
          buildCitation(
            'patents-act-1970-s3p',
            2,
            'Without disclosure of active botanical constituents, prior art anticipation against the Traditional Knowledge Digital Library (TKDL) cannot be screened or cleared.'
          ),
          buildCitation(
            'biological-diversity-act-2002-s6',
            3,
            'Requires mandatory disclosure of Indian biological resources to the National Biodiversity Authority (NBA) prior to applying for IP protection.'
          ),
          buildCitation(
            'drugs-cosmetics-act-1940-s3a',
            4,
            'Manufacture and commercialization of undisclosed or secret formulas is prohibited; all ASU formulations must disclose ingredients referenced in First Schedule treatises.'
          ),
        ];

        const checklist = [
          {
            step: '1',
            title: 'Disclose Botanical Species',
            desc: 'Identify botanical species with Latin binomial taxonomy, specific plant parts used, and geographic collection origin.',
          },
          {
            step: '2',
            title: 'Verify Against Treatises',
            desc: 'Cross-reference identified botanicals with First Schedule authorized Ayurvedic treatises (Charaka, Sushruta, AFI).',
          },
          {
            step: '3',
            title: 'Seek Expert Review',
            desc: 'Escalate to an empanelled patent agent or IP specialist under non-disclosure confidentiality to audit patentability.',
          },
        ];

        resolve({
          jurisdiction: isIndia ? 'India (IPO / TKDL / AYUSH)' : 'International (PCT / WIPO / EPO / USPTO)',
          formulationType: typeLabel,
          timestamp: new Date().toISOString(),
          evaluationScore: 'Statutory Sources Insufficient',
          confidence: 'Low',
          confidenceExplanation:
            'Low confidence / Abstention: Supporting statutory sources are insufficient to evaluate this inquiry safely. The formulation lacks verifiable botanical binomials, extraction solvent parameters, and recognized pharmacopoeial monograph references.',
          isAbstention: true,
          userQuestion: question,
          formulationContext: {
            title: title || 'Undisclosed Botanical Formulation',
            category: typeLabel,
            botanicals: botanicals || 'Not disclosed',
            method: method || 'Private undisclosed preparation',
          },
          abstentionDetails: {
            reason:
              'Supporting sources are insufficient to safely evaluate patentability or regulatory licensing. Automated guidance cannot be generated without verified botanical taxa.',
            missingElements: [
              'Botanical species identification (Latin binomial nomenclature missing)',
              'Extraction solvent, ratio, and standardization parameters undisclosed',
              'No verifiable cross-reference to First Schedule treatises or TKDL monographs',
              'Mandatory source disclosure under Section 10(4) of Patents Act not met',
            ],
          },
          guidance: {
            headline: 'Statutory Sources Insufficient for Safe Determination',
            findingText:
              'The system cannot safely provide statutory patentability or licensing guidance for this query because the formulation parameters lack verified botanical identifiers, recognized pharmacopoeial monographs, or disclosed preparation parameters. Under Section 10(4)(d)(ii) of the Patents Act, 1970 [1], patent specifications must completely disclose botanical taxonomy and geographical origin. Generating guidance without verified baseline data creates legal risk under Section 3(p) [2]. Furthermore, mandatory approval is required under Section 6 of the Biological Diversity Act, 2002 [3], and commercial licensing of undisclosed preparations is prohibited under Section 3(a) of the Drugs & Cosmetics Act, 1940 [4].',
            recommendedAction:
              'Disclose botanical species (binomial Latin nomenclature), specific plant parts, and standardized processing methods, or escalate to expert review for confidential assessment.',
            actionChecklist: checklist,
          },
          summary: {
            headline: 'Statutory Sources Insufficient for Safe Determination',
            findingText:
              'The system cannot safely provide statutory patentability guidance because verifiable botanical taxonomy and pharmacopoeial monographs are absent.',
            recommendedAction:
              'Disclose botanical species (binomial Latin nomenclature) or escalate to expert review.',
          },
          statutoryCitations: abstentionCitations,
          actionChecklist: checklist,
          disclaimer: baseDisclaimer,
        });
        return;
      }

      // Case 2: Low Confidence (Borderline / Conflicting Regulatory Scope)
      if (mode === 'low') {
        const lowCitations = [
          buildCitation(
            'patents-act-1970-s3e',
            1,
            'Combinations of traditional Ayurvedic extracts with synthetic cosmetic agents are routinely rejected as mere admixtures unless unexpected biological synergy is substantiated by comparative assays.'
          ),
          buildCitation(
            'drugs-cosmetics-act-1940-s33e',
            2,
            'Topical preparations containing synthetic peptides are governed under Cosmetics Rules, 2020. Making medicinal or anti-aging therapeutic claims creates risk of misbranding under Section 33E.'
          ),
          buildCitation(
            'drugs-cosmetics-rules-1945-r158b',
            3,
            'ASU proprietary medicine licenses under Rule 158B require all active constituents to originate from First Schedule authoritative texts. Synthetic cosmetic peptides fall outside this statutory schedule.'
          ),
          buildCitation(
            'tkdl-prior-art-repository',
            4,
            'Classical botanical component has prior art standing in TKDL; patent claims must strictly isolate the technical synthesis or pharmacokinetic delivery matrix of the combination.'
          ),
        ];

        const checklist = [
          {
            step: '1',
            title: 'Resolve Regulatory Classification',
            desc: 'Clarify product classification with the State Licensing Authority: Determine whether the formulation qualifies as a Cosmetic (Form COS-8) or an ASU Proprietary Drug.',
          },
          {
            step: '2',
            title: 'Conduct Synergy Assays',
            desc: 'Perform combination index (CI < 1) or dermal penetration assays comparing the botanical-peptide blend against individual components to address Section 3(e).',
          },
          {
            step: '3',
            title: 'Seek Legal Opinion on Claim Scope',
            desc: 'Escalate to a registered patent attorney to structure claims around stable emulsion matrices rather than therapeutic cosmetic treatments.',
          },
        ];

        resolve({
          jurisdiction: isIndia ? 'India (IPO / TKDL / AYUSH)' : 'International (PCT / WIPO / EPO / USPTO)',
          formulationType: typeLabel,
          timestamp: new Date().toISOString(),
          evaluationScore: 'Regulatory Boundary Ambiguity',
          confidence: 'Low',
          confidenceExplanation:
            'Low confidence: Competing regulatory interpretations between Drugs & Cosmetics Act Section 3(aaa) (Cosmetics) and Section 3(h) (Proprietary ASU Drugs). Incorporating synthetic cosmetic peptides creates dual-jurisdiction ambiguity under CDSCO and AYUSH licensing frameworks.',
          isAbstention: false,
          userQuestion: question,
          formulationContext: {
            title: title || 'Hybrid Botanical Formulation',
            category: typeLabel,
            botanicals: botanicals || 'Not specified',
            method: method || 'Standard emulsion method',
          },
          uncertaintyDetails: {
            headline: 'Key Legal & Regulatory Uncertainties',
            points: [
              'Classification conflict: CDSCO regulates synthetic peptides under Cosmetics Rules 2020, while ASU licensing requires First Schedule textual basis.',
              'Section 3(e) vulnerability: The Indian Patent Office frequently treats botanical-synthetic cosmetic mixtures as unpatentable mere admixtures without rigorous synergism assays.',
              'Labeling compliance: Therapeutic claims on cosmetic topical formulations risk misbranding enforcement under Section 33E of Drugs & Cosmetics Act.',
            ],
          },
          guidance: {
            headline: 'Dual-Jurisdiction Classification Conflict & Mere Admixture Rejection Risk',
            findingText:
              `Preliminary analysis of "${title || 'the formulation'}" (${typeLabel}) indicates significant regulatory friction across Ayurvedic and cosmetic legal frameworks. While traditional botanical actives (${botanicals || 'disclosed actives'}) have established Ayurvedic pharmacopoeial standing in the Traditional Knowledge Digital Library (TKDL) [4], incorporating synthetic cosmetic peptides falls outside the First Schedule authoritative texts required for ASU licensing under Rule 158B [3]. Under Section 3(e) of the Patents Act, 1970 [1], combinations of traditional botanicals with synthetic cosmetic agents face rigorous objections as mere admixtures without comparative synergy assays. Furthermore, therapeutic claims on topical formulations governed by cosmetics standards risk misbranding action under Section 33E of the Drugs & Cosmetics Act, 1940 [2].`,
            recommendedAction:
              'Clarify regulatory classification: Either file as a modern cosmetic under Cosmetics Rules 2020 or conduct comparative in-vitro synergy assays (CI < 1) to support ASU proprietary status. Escalate to expert review for formal opinion.',
            actionChecklist: checklist,
          },
          summary: {
            headline: 'Dual-Jurisdiction Classification Conflict & Mere Admixture Rejection Risk',
            findingText:
              'Significant regulatory friction between Cosmetic and ASU Drug standards. Section 3(e) mere admixture objections anticipated.',
            recommendedAction:
              'Clarify regulatory classification or conduct comparative synergy assays before filing.',
          },
          statutoryCitations: lowCitations,
          actionChecklist: checklist,
          disclaimer: baseDisclaimer,
        });
        return;
      }

      // Case 3: Medium Confidence (International / Novel Delivery / Conditional)
      if (mode === 'medium') {
        const medCitations = [
          buildCitation(
            'pct-article-33',
            1,
            'Screened against International Search Authorities (ISA). Documented traditional uses serve as prior art under PCT Rule 33.1. Novel complexation processes satisfy novelty if reproducible technical effects are proven.'
          ),
          buildCitation(
            'epc-article-52-54',
            2,
            'Plant extracts are patentable if specific active fractions, novel phospholipid complexes, or non-obvious synergistic combinations are claimed with repeatable technical effect.'
          ),
          buildCitation(
            'tkdl-prior-art-repository',
            3,
            'International search authorities routinely screen PCT claims against TKDL monographs to identify traditional formulations.'
          ),
          buildCitation(
            'wipo-treaty-grtk-2024',
            4,
            'Mandatory declaration of origin for genetic resources and associated traditional knowledge in PCT contracting states.'
          ),
        ];

        const checklist = [
          {
            step: '1',
            title: 'PCT International Search',
            desc: 'Request International Searching Authority (ISA) preliminary novelty report.',
          },
          {
            step: '2',
            title: 'Nagoya Protocol Compliance',
            desc: 'Verify Access and Benefit-Sharing (ABS) documentation for biological resource export.',
          },
          {
            step: '3',
            title: 'Process Claim Primacy',
            desc: 'Draft independent claims around temperature, solvent ratios, and assay purity thresholds.',
          },
          {
            step: '4',
            title: 'National Phase Transition',
            desc: 'Prepare for national phase entries (USPTO, EPO, JPO) at month 30 from priority date.',
          },
        ];

        resolve({
          jurisdiction: isIndia ? 'India (IPO / TKDL / AYUSH)' : 'International (PCT / WIPO / EPO / USPTO)',
          formulationType: typeLabel,
          timestamp: new Date().toISOString(),
          evaluationScore: 'Conditional International Patentability',
          confidence: 'Medium',
          confidenceExplanation:
            'Medium confidence: Based on published PCT search authority precedents and EPO natural product examination standards (EPC Art 52/54). Confidence is tempered by pending experimental dissolution and bio-equivalence comparison against classical decoction.',
          isAbstention: false,
          userQuestion: question,
          formulationContext: {
            title: title || 'Botanical Delivery Complex',
            category: typeLabel,
            botanicals: botanicals || 'Not specified',
            method: method || 'Advanced complexation method',
          },
          guidance: {
            headline: 'Defensive TKDL Disclosure Alert; Technical Delivery & Process Claims Recommended',
            findingText:
              `International preliminary examination under Patent Cooperation Treaty (PCT) Article 33 [1] assesses novelty and inventive step against international prior art, which routinely searches Traditional Knowledge Digital Library (TKDL) monographs [3]. Under European Patent Convention Articles 52 and 54 [2], botanical extracts as found in nature are excluded, but novel phospholipid complexation processes and reproducible pharmacokinetic delivery matrices are patentable. In addition, international filings across designated PCT member states must adhere to genetic resource disclosure standards established under the WIPO Treaty on IP, Genetic Resources and Associated Traditional Knowledge [4].`,
            recommendedAction:
              'File an international PCT application designating target member states within the 12-month Paris Convention priority window. Focus independent claims on the technical extraction process and pharmacokinetic parameters.',
            actionChecklist: checklist,
          },
          summary: {
            headline: 'Defensive TKDL Disclosure Alert; Process & Composition Ratio Claims Recommended',
            findingText:
              `International examination under PCT Rule 33 and EPO Guidelines screens against TKDL. Process claims regarding novel extraction solvents or carrier complexes are viable.`,
            recommendedAction:
              'File an international PCT application within the 12-month priority window. Focus claims on extraction process and pharmacokinetic parameters.',
          },
          statutoryCitations: medCitations,
          actionChecklist: checklist,
          disclaimer: baseDisclaimer,
        });
        return;
      }

      // Case 4: High Confidence (Standard Domestic ASU Query / Clear Statutory Match)
      const highCitations = [
        buildCitation(
          'patents-act-1970-s3p',
          1,
          'Precludes patenting of traditional herbal preparations unless an unexpected, non-obvious synergistic technical effect is experimentally substantiated.'
        ),
        buildCitation(
          'patents-act-1970-s3e',
          2,
          'Requires comparative in-vitro / in-vivo biological assay evidence comparing the combination against individual active constituents (Combination Index CI < 1).'
        ),
        buildCitation(
          'tkdl-prior-art-repository',
          3,
          'Active ingredients listed for therapeutic indications in Charaka Samhita and Bhavaprakasha Nighantu. Novelty resides solely in the extraction technology or quantitative pharmacokinetic synergy.'
        ),
        buildCitation(
          'drugs-cosmetics-rules-1945-r158b',
          4,
          'Novel combination requires submission of published literature on safety, or pilot clinical study protocols before State Licensing Authority (SLA).'
        ),
        buildCitation(
          'biological-diversity-act-2002-s6',
          5,
          'Mandatory approval from National Biodiversity Authority (NBA) required prior to grant of patent for biological resources obtained from India.'
        ),
      ];

      const highChecklist = [
        {
          step: '1',
          title: 'Synergism Dossier',
          desc: 'Conduct isobologram or combination index (CI < 1) assay to document synergy over individual components.',
        },
        {
          step: '2',
          title: 'NBA Application',
          desc: 'Submit Form III to National Biodiversity Authority under Biological Diversity Rules, 2004.',
        },
        {
          step: '3',
          title: 'Treatise Cross-Mapping',
          desc: 'Document non-anticipation against First Schedule recognized Ayurvedic pharmacopoeial standards.',
        },
        {
          step: '4',
          title: 'Claim Drafting Focus',
          desc: 'Structure claims toward the composition ratio, carrier matrix, and specific dissolution profile rather than plant parts alone.',
        },
      ];

      resolve({
        jurisdiction: 'India (IPO / TKDL / AYUSH)',
        formulationType: typeLabel,
        timestamp: new Date().toISOString(),
        evaluationScore: 'High Statutory Relevance',
        confidence: 'High',
        confidenceExplanation:
          'High confidence: Based on matching statutory provisions across the Patents Act, 1970 (Sections 3(p) and 3(e)) and authoritative First Schedule Ayurvedic treatises cited in the Traditional Knowledge Digital Library (TKDL).',
        isAbstention: false,
        userQuestion: question,
        formulationContext: {
          title: title || 'Specified Botanical Preparation',
          category: typeLabel,
          botanicals: botanicals || 'Not specified',
          method: method || 'Standard pharmacopoeial method',
        },
        guidance: {
          headline: 'Section 3(p) Anticipation Screened; Synergistic Evidence Required',
          findingText:
            `Preliminary analysis of "${title || 'the formulation'}" (${typeLabel}) indicates that the botanical ingredients (${botanicals || 'specified actives'}) have established textual recognition in classical Ayurvedic treatises indexed in the Traditional Knowledge Digital Library (TKDL) [3]. Under Section 3(p) of the Patents Act, 1970 [1], traditional knowledge per se is statutorily excluded from patentability. To overcome this exclusion and substantiate an inventive step, experimental biological assay data demonstrating synergy exceeding mere aggregation under Section 3(e) [2] must be submitted. Commercial licensing of this formulation as an Ayurvedic Proprietary Medicine must fulfill the evidence of effectiveness and safety requirements under Rule 158B of the Drugs & Cosmetics Rules, 1945 [4]. Furthermore, mandatory statutory clearance from the National Biodiversity Authority under Section 6 of the Biological Diversity Act, 2002 [5] is required prior to the grant of any patent.`,
          recommendedAction:
            'Draft claims focused on the specific synergistic ratio and modified bioavailability profile. File Form 1 with National Biodiversity Authority (NBA) clearance under Section 6 of Biological Diversity Act, 2002.',
          actionChecklist: highChecklist,
        },
        summary: {
          headline: 'Section 3(p) Anticipation Screened; Synergistic Evidence Required',
          findingText:
            `Preliminary analysis of "${title || 'the formulation'}" (${typeLabel}) indicates that the botanical ingredients (${botanicals || 'specified actives'}) have established textual recognition in classical Ayurvedic treatises indexed in the Traditional Knowledge Digital Library (TKDL) [3]. Under Section 3(p) of the Patents Act, 1970 [1], traditional knowledge per se is statutorily excluded from patentability. To overcome this exclusion and substantiate an inventive step, experimental biological assay data demonstrating synergy exceeding mere aggregation under Section 3(e) [2] must be submitted. Commercial licensing of this formulation as an Ayurvedic Proprietary Medicine must fulfill the evidence of effectiveness and safety requirements under Rule 158B of the Drugs & Cosmetics Rules, 1945 [4]. Furthermore, mandatory statutory clearance from the National Biodiversity Authority under Section 6 of the Biological Diversity Act, 2002 [5] is required prior to the grant of any patent.`,
          recommendedAction:
            'Draft claims focused on the specific synergistic ratio and modified bioavailability profile. File Form 1 with National Biodiversity Authority (NBA) clearance under Section 6 of Biological Diversity Act, 2002.',
        },
        statutoryCitations: highCitations,
        actionChecklist: highChecklist,
        disclaimer: baseDisclaimer,
      });
    }, 850);
  });
}

