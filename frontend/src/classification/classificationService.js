/**
 * IP-SAKTI Sahayak — Formulation Classification Service
 * 
 * Provides isolated mock classification logic to establish the statutory category
 * of an Ayurvedic or botanical product under Indian and international regulatory frameworks.
 * 
 * Candidate Categories (strictly adhering to statutory specifications):
 * 1. Classical / generic medicine
 * 2. Patent / proprietary medicine
 * 3. New / non-classical drug
 * 4. Phytopharmaceutical
 * 5. Ayurveda-Aahar / nutraceutical
 * 6. Cosmetic
 */

export const CANDIDATE_CATEGORIES = [
  {
    id: 'classical_generic',
    name: 'Classical / generic medicine',
    badgeVariant: 'primary',
    statutoryRef: 'Drugs & Cosmetics Act, 1940 — Section 3(a)',
    shortSummary: 'Manufactured strictly in accordance with recipes in authoritative treatises listed in the First Schedule.',
    whyThisClassification: [
      'The formulation ingredients and preparation method are strictly sourced from First Schedule authoritative Ayurvedic texts (e.g. Charaka Samhita, Sushruta Samhita, Ayurvedic Formulary of India).',
      'No non-classical botanical additives, synthetic excipients, or novel solvent fractionations altering the active chemical profile are introduced.',
      'The formulation is manufactured per traditional classical processes (e.g., Kwatha, Asava-Arishta, Churna, Vati, Bhasma, Taila).',
    ],
    nextStepConsiderations: {
      licensingPathway:
        'Rule 158B(a) of Drugs & Cosmetics Rules, 1945 — Eligible for manufacturing license without fresh clinical efficacy or safety trial data, subject to Schedule T Good Manufacturing Practice (GMP) compliance.',
      safetyEvidence:
        'Proof of safety relies on classical treatise citations. Heavy metal, microbial, and pesticide residue testing mandated per Ayurvedic Pharmacopoeia of India (API) standards.',
      ipImplication:
        'Non-patentable per se under Section 3(p) of the Patents Act, 1970, as it constitutes pre-existing traditional knowledge publicly documented in TKDL. Process claims are viable only if a genuinely novel, non-obvious apparatus or manufacturing technology is developed.',
    },
  },
  {
    id: 'patent_proprietary',
    name: 'Patent / proprietary medicine',
    badgeVariant: 'gold',
    statutoryRef: 'Drugs & Cosmetics Act, 1940 — Section 3(h)',
    shortSummary: 'Contains ingredients mentioned in First Schedule texts, but prepared in novel ratios, combinations, or non-classical dosage forms.',
    whyThisClassification: [
      'The formulation comprises ingredients referenced in First Schedule authoritative Ayurvedic texts, but uses a non-classical combination ratio, modern dosage form (e.g., tablet, capsule, syrup), or modified composition.',
      'It is marketed under a proprietary brand name rather than a classical generic treatise name.',
      'The formulation is intended for therapeutic indications supported by modern or published literature rather than verbatim classical textual citations.',
    ],
    nextStepConsiderations: {
      licensingPathway:
        'Rule 158B(b) of Drugs & Cosmetics Rules, 1945 — Requires submission of published safety literature, rational combination justification, and pilot clinical trial proof before the State Licensing Authority (SLA).',
      safetyEvidence:
        'Must provide acute/sub-acute toxicity data if containing novel extract concentrations exceeding classical dose thresholds, along with batch standardization data.',
      ipImplication:
        'Patentable only if unexpected synergistic technical effect (exceeding mere aggregation under Section 3(e)) is experimentally documented to overcome Section 3(p) traditional knowledge anticipation.',
    },
  },
  {
    id: 'new_non_classical',
    name: 'New / non-classical drug',
    badgeVariant: 'warning',
    statutoryRef: 'New Drugs and Clinical Trials Rules, 2019 (CDSCO)',
    shortSummary: 'Novel modified chemical derivative, synthetic analog, or unapproved botanical combination intended for pharmaceutical use.',
    whyThisClassification: [
      'The active entity involves a structurally modified natural compound, synthetic derivative, or a novel chemical fraction not documented in traditional ASU pharmacopoeias.',
      'The route of administration, indication, or modified mechanism of action represents a first-in-human or unapproved pharmaceutical profile.',
      'It falls outside the statutory definition of Ayurvedic, Siddha, or Unani drugs under Section 3(a)/3(h).',
    ],
    nextStepConsiderations: {
      licensingPathway:
        'Central Drugs Standard Control Organization (CDSCO) approval mandatory. Requires Investigational New Drug (IND) filing under New Drugs and Clinical Trials Rules, 2019.',
      safetyEvidence:
        'Comprehensive non-clinical safety pharmacology, reproductive toxicology, genotoxicity, and structured Phase I–III randomized controlled clinical trials.',
      ipImplication:
        'Broad patent eligibility for novel chemical entities (NCE), composition of matter, and pharmaceutical formulations, subject to standard novelty and inventive step criteria.',
    },
  },
  {
    id: 'phytopharmaceutical',
    name: 'Phytopharmaceutical',
    badgeVariant: 'neutral',
    statutoryRef: 'Drugs & Cosmetics Rules, 1945 (Gazette G.S.R. 918(E)) & NDCT Rules 2019',
    shortSummary: 'Purified and standardized fraction of medicinal plant extract with defined minimum 4 bioactive markers.',
    whyThisClassification: [
      'The product is an enriched, purified botanical fraction obtained through advanced solvent extraction, chromatography, or selective isolation.',
      'It is qualitatively and quantitatively standardized to contain a minimum of four verified bioactive or analytical biomarker compounds.',
      'It is evaluated under modern scientific pharmacology rather than holistic Ayurvedic organoleptic principles.',
    ],
    nextStepConsiderations: {
      licensingPathway:
        'Regulated centrally by the Drugs Controller General of India (DCGI/CDSCO) as a Phytopharmaceutical Drug under New Drugs and Clinical Trials Rules, 2019.',
      safetyEvidence:
        'Detailed chemical fingerprinting (HPLC/LC-MS), stability profiles, animal toxicology, and Phase I–III clinical trials protocol approved by Subject Expert Committee (SEC).',
      ipImplication:
        'High patentability for proprietary extraction processes, enriched active biomarker ratios, synergistic bio-fractions, and specific therapeutic indications.',
    },
  },
  {
    id: 'ayurveda_aahar',
    name: 'Ayurveda-Aahar / nutraceutical',
    badgeVariant: 'success',
    statutoryRef: 'Food Safety and Standards (Ayurveda Aahar) Regulations, 2022 (FSSAI)',
    shortSummary: 'Food or dietary supplement prepared per Ayurvedic recipes for physiological well-being, without drug claims.',
    whyThisClassification: [
      'The formulation is intended as a nutritional dietary supplement, herbal tea, functional beverage, or health food rather than a prescription therapeutic medicine.',
      'It contains botanicals and spices documented in authoritative Ayurvedic texts used traditionally for dietary support (Ahara).',
      'The product label does not claim to treat, cure, or mitigate specific human diseases or clinical pathologies.',
    ],
    nextStepConsiderations: {
      licensingPathway:
        'Regulated under Food Safety and Standards (Ayurveda Aahar) Regulations, 2022 by FSSAI. Mandatory display of the official Ayurveda Aahar logo on packaging. No drug license under SLA required.',
      safetyEvidence:
        'Must comply with FSSAI contaminants, pesticide residue limits, and nutritional declaration norms. Heavy metals must conform to FSSAI food grade safety standards.',
      ipImplication:
        'Generally non-patentable as medicinal therapy. Process or dietary composition claims require demonstrating non-obvious food processing technology or verified synergistic functional properties.',
    },
  },
  {
    id: 'cosmetic',
    name: 'Cosmetic',
    badgeVariant: 'neutral',
    statutoryRef: 'Drugs & Cosmetics Act, 1940 — Section 3(aaa) & Cosmetics Rules, 2020',
    shortSummary: 'Herbal article intended to be applied to human body for cleansing, beautifying, or altering appearance.',
    whyThisClassification: [
      'The product is intended exclusively for topical external application (skin, hair, nails, teeth) for cleansing, moisturizing, beautifying, or enhancing appearance.',
      'It incorporates Ayurvedic botanical extracts (e.g. Kumkumadi, Chandan, Haridra, Bhringraj) in a cosmetic cream, lotion, oil, or cleanser base.',
      'It does not claim therapeutic disease modification (e.g., treating clinical psoriasis, eczema, or alopecia areata), which would reclassify it as a drug.',
    ],
    nextStepConsiderations: {
      licensingPathway:
        'Licensed under the Cosmetics Rules, 2020 by the State Licensing Authority (Form COS-8). No clinical trials required, but raw ingredient safety must comply with IS 4707 standards.',
      safetyEvidence:
        'Skin irritation, dermal sensitization testing, microbiological purity, and heavy metal compliance (lead < 20 ppm, arsenic < 2 ppm).',
      ipImplication:
        'Formulation and topical delivery base patents viable for novel cosmetic emulsification, stability preservation, or dermal penetration systems.',
    },
  },
];

/**
 * 6 Realistic Demonstration Presets covering each candidate category.
 */
export const DEMO_PRESETS = [
  {
    id: 'preset_classical',
    categoryId: 'classical_generic',
    name: 'Chyawanprash Awaleha (Charaka Samhita)',
    intendedUse: 'therapeutic',
    ingredientNature: 'classical_treatise',
    formulationName: 'Chyawanprash Awaleha (Traditional AFI Specification)',
    description: 'Classical polyherbal confection prepared with Amalaki, Dashamoola, and herbs strictly per Charaka Samhita.',
  },
  {
    id: 'preset_proprietary',
    categoryId: 'patent_proprietary',
    name: 'Curcumin-Piperine Synergistic Lipid Capsule',
    intendedUse: 'therapeutic',
    ingredientNature: 'proprietary_modified',
    formulationName: 'Bio-enhanced Curcumin-Piperine Synergy Capsule',
    description: 'Herbs from First Schedule texts in a proprietary synergistic ratio with bio-enhancing lipid matrix.',
  },
  {
    id: 'preset_new_drug',
    categoryId: 'new_non_classical',
    name: 'Synthetic Withanolide Ester Derivative',
    intendedUse: 'therapeutic',
    ingredientNature: 'novel_chemical',
    formulationName: 'Semi-synthetic Withanolide Glycoside Derivative',
    description: 'Chemically modified natural phytoconstituent with synthetic alkyl chain intended for clinical oncology trials.',
  },
  {
    id: 'preset_phytopharm',
    categoryId: 'phytopharmaceutical',
    name: 'Purified Withania somnifera Fraction (4 Markers)',
    intendedUse: 'therapeutic',
    ingredientNature: 'phytopharmaceutical_fraction',
    formulationName: 'Standardized Withania Bioactive Fraction WS-04',
    description: 'Chromatographically purified root fraction standardized to Withaferin A, Withanolide A, B, and Withanoside IV.',
  },
  {
    id: 'preset_aahar',
    categoryId: 'ayurveda_aahar',
    name: 'Brahmi-Shankhpushpi Herbal Memory Granules',
    intendedUse: 'dietary_food',
    ingredientNature: 'classical_treatise',
    formulationName: 'Medhya Herbal Nutritional Beverage Mix',
    description: 'Ayurvedic health food mix with classical herbs intended for cognitive wellness under FSSAI regulations.',
  },
  {
    id: 'preset_cosmetic',
    categoryId: 'cosmetic',
    name: 'Kumkumadi & Haridra Skin Radiance Oil',
    intendedUse: 'cosmetic_topical',
    ingredientNature: 'classical_treatise',
    formulationName: 'Ayurvedic Botanical Complexion Oil',
    description: 'Topical facial oil combining saffron, sandalwood, and turmeric for skin radiance without disease treatment claims.',
  },
];

/**
 * Minimal guided classification engine.
 * Maps minimal purposeful answers to one of the 6 statutory categories.
 * 
 * @param {object} params
 * @param {string} params.intendedUse - 'therapeutic' | 'dietary_food' | 'cosmetic_topical'
 * @param {string} params.ingredientNature - 'classical_treatise' | 'proprietary_modified' | 'phytopharmaceutical_fraction' | 'novel_chemical'
 * @param {string} params.formulationName
 * @returns {object} Classification result object
 */
export function classifyFormulation({ intendedUse, ingredientNature, formulationName = '' }) {
  let matchedCategory;

  if (intendedUse === 'dietary_food') {
    matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'ayurveda_aahar');
  } else if (intendedUse === 'cosmetic_topical') {
    matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'cosmetic');
  } else {
    // Intended use is Therapeutic / Medicinal
    switch (ingredientNature) {
      case 'classical_treatise':
        matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'classical_generic');
        break;
      case 'proprietary_modified':
        matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'patent_proprietary');
        break;
      case 'phytopharmaceutical_fraction':
        matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'phytopharmaceutical');
        break;
      case 'novel_chemical':
        matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'new_non_classical');
        break;
      default:
        matchedCategory = CANDIDATE_CATEGORIES.find((c) => c.id === 'classical_generic');
    }
  }

  return {
    category: matchedCategory.name,
    categoryId: matchedCategory.id,
    badgeVariant: matchedCategory.badgeVariant,
    statutoryRef: matchedCategory.statutoryRef,
    shortSummary: matchedCategory.shortSummary,
    formulationName: formulationName.trim() || 'Specified Botanical Preparation',
    disclaimer: 'Preliminary classification for guidance purposes. Not an absolute legal determination.',
    whyThisClassification: matchedCategory.whyThisClassification,
    nextStepConsiderations: matchedCategory.nextStepConsiderations,
    timestamp: new Date().toISOString(),
  };
}
