import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from '../context/RouterContext';
import { useConsultation } from '../context/ConsultationContext';
import {
  Container,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelContent,
  PanelFooter,
  Button,
  Input,
  Textarea,
  DataTable,
  LoadingIndicator,
  Notice,
  Modal,
  ShieldIcon,
  ScalesIcon,
  RefreshIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  ArrowRightIcon,
  CitationText,
  InlineCitation,
  SourceDetailPanel,
} from '../components/common';
import {
  CONSULTATION_SCENARIOS,
} from '../consultation/consultationService';

/**
 * Helper to construct the 7 structured guidance table rows:
 * 1. Formulation — product name and classification
 * 2. Ingredients — botanical components and extraction percentages
 * 3. Prior art status — TKDL documentation finding (left accent: red)
 * 4. Patentability barrier — specific blocking provision (left accent: red)
 * 5. Possible exception — evidence to overcome barrier (left accent: amber)
 * 6. Commercial licensing requirement — safety/effectiveness proof needed (left accent: amber)
 * 7. Biodiversity clearance — statutory clearance required (left accent: green)
 */
function getStructuredFindings(resultData) {
  if (!resultData) return [];

  const ctx = resultData.formulationContext || {};
  const citations = resultData.statutoryCitations || [];

  const findCite = (predicate, fallbackIndex) => {
    return (
      citations.find(predicate) ||
      citations.find((c) => c.citationIndex === fallbackIndex || c.index === fallbackIndex) ||
      (fallbackIndex && fallbackIndex <= citations.length ? citations[fallbackIndex - 1] : null)
    );
  };

  const s3pCite = findCite(
    (c) => c.id?.includes('s3p') || c.section?.includes('3(p)') || c.id?.includes('pct') || c.id?.includes('epc'),
    1
  );
  const s3eCite = findCite(
    (c) => c.id?.includes('s3e') || c.section?.includes('3(e)') || c.id?.includes('epc'),
    2
  );
  const tkdlCite = findCite(
    (c) => c.id?.includes('tkdl') || c.authority?.toLowerCase().includes('traditional knowledge'),
    3
  );
  const licensingCite = findCite(
    (c) => c.id?.includes('r158b') || c.id?.includes('drugs') || c.id?.includes('cosmetic'),
    4
  );
  const nbaCite = findCite(
    (c) => c.id?.includes('biological-diversity') || c.id?.includes('biodiversity') || c.id?.includes('wipo'),
    5
  );

  const isInternational =
    resultData.jurisdiction?.includes('International') ||
    resultData.formulationType?.includes('novel_delivery');
  const isLowCosmetic =
    resultData.confidence === 'Low' && ctx.botanicals?.toLowerCase().includes('peptide');

  // Row 1: Formulation — product name and classification
  const productTitle = ctx.title || 'Curcumin-Piperine Synergistic Formulation';
  const productCategory = ctx.category || resultData.formulationType || 'Ayurvedic Proprietary Medicine (ASU)';

  // Row 2: Ingredients — botanical components and extraction percentages
  const ingredientsText = ctx.botanicals || 'Haridra (Curcuma longa rhizome extract 95%) + Maricha (Piper nigrum fruit alkaloid 98%)';

  // Row 3: Prior art status — TKDL documentation finding
  let priorArtText = 'Active botanical ingredients (Curcuma longa and Piper nigrum) have established textual recognition in classical Ayurvedic treatises indexed in the Traditional Knowledge Digital Library (TKDL).';
  if (isInternational) {
    priorArtText = 'International Searching Authority (ISA) preliminary novelty search routinely screens claims against Traditional Knowledge Digital Library (TKDL) monographs under PCT Rule 33.1.';
  } else if (isLowCosmetic) {
    priorArtText = 'Classical botanical active (Kumkumadi Taila) has established prior art standing in the Traditional Knowledge Digital Library (TKDL), barring standalone novelty.';
  } else if (tkdlCite?.assessment) {
    priorArtText = tkdlCite.assessment;
  }

  // Row 4: Patentability barrier — the specific blocking provision
  let barrierText = 'Section 3(p) of the Patents Act, 1970 statutorily excludes traditional knowledge and aggregations of known components from patentability per se.';
  if (isInternational) {
    barrierText = 'European Patent Convention (EPC) Articles 52 and 54 exclude botanical products as found in nature without reproducible technical effect or modification.';
  } else if (isLowCosmetic) {
    barrierText = 'Section 3(e) of the Patents Act, 1970 excludes combinations of known Ayurvedic extracts with synthetic cosmetic agents as mere unpatentable admixtures.';
  } else if (s3pCite?.assessment) {
    barrierText = s3pCite.assessment;
  }

  // Row 5: Possible exception — what evidence could overcome the barrier
  let exceptionText = 'Experimental biological assay data demonstrating unexpected synergy exceeding mere aggregation under Section 3(e) (e.g., Combination Index CI < 1 or enhanced bioavailability).';
  if (isInternational) {
    exceptionText = 'Patentable inventive step substantiated via novel phospholipid complexation ratios, defined solvent kinetics, and enhanced bioavailability over classical decoctions.';
  } else if (isLowCosmetic) {
    exceptionText = 'Comparative biological synergy assays (CI < 1) or dermal penetration kinetics demonstrating synergistic enhancement between botanical oil and synthetic peptide.';
  } else if (s3eCite?.assessment) {
    exceptionText = s3eCite.assessment;
  }

  // Row 6: Commercial licensing requirement — safety/effectiveness proof needed
  let licensingText = 'Fulfillment of safety and effectiveness documentation under Rule 158B of Drugs & Cosmetics Rules, 1945 for State Licensing Authority (SLA) approval as an Ayurvedic Proprietary Medicine.';
  if (isInternational) {
    licensingText = 'Nagoya Protocol Access and Benefit-Sharing (ABS) compliance documentation and commercial export licensing for international markets.';
  } else if (isLowCosmetic) {
    licensingText = 'Regulatory boundary conflict: Rule 158B requires all active constituents to originate from First Schedule treatises; synthetic peptides trigger CDSCO Cosmetics Rules 2020.';
  } else if (licensingCite?.assessment) {
    licensingText = licensingCite.assessment;
  }

  // Row 7: Biodiversity clearance — statutory clearance required
  let biodiversityText = 'Mandatory statutory clearance from National Biodiversity Authority (NBA) via Form III application under Section 6 of the Biological Diversity Act, 2002 prior to patent grant.';
  if (isInternational) {
    biodiversityText = 'Mandatory declaration of genetic resource origin and traditional knowledge provenance under the WIPO Treaty on IP, Genetic Resources and Associated Traditional Knowledge.';
  } else if (isLowCosmetic) {
    biodiversityText = 'Dual compliance required: Section 6 Biological Diversity Act clearance for botanical fractions and Section 33E misbranding risk mitigation for cosmetic claims.';
  } else if (nbaCite?.assessment) {
    biodiversityText = nbaCite.assessment;
  }

  return [
    {
      id: 'row-formulation',
      aspect: 'Formulation',
      finding: `${productTitle} — ${productCategory}`,
      source: null,
      accent: null,
    },
    {
      id: 'row-ingredients',
      aspect: 'Ingredients',
      finding: ingredientsText,
      source: null,
      accent: null,
    },
    {
      id: 'row-prior-art',
      aspect: 'Prior art status',
      finding: priorArtText,
      source: tkdlCite ? { index: tkdlCite.citationIndex || 3, source: tkdlCite } : null,
      accent: 'red',
    },
    {
      id: 'row-barrier',
      aspect: 'Patentability barrier',
      finding: barrierText,
      source: s3pCite ? { index: s3pCite.citationIndex || 1, source: s3pCite } : null,
      accent: 'red',
    },
    {
      id: 'row-exception',
      aspect: 'Possible exception',
      finding: exceptionText,
      source: s3eCite ? { index: s3eCite.citationIndex || 2, source: s3eCite } : null,
      accent: 'amber',
    },
    {
      id: 'row-licensing',
      aspect: 'Commercial licensing requirement',
      finding: licensingText,
      source: licensingCite ? { index: licensingCite.citationIndex || 4, source: licensingCite } : null,
      accent: 'amber',
    },
    {
      id: 'row-biodiversity',
      aspect: 'Biodiversity clearance',
      finding: biodiversityText,
      source: nbaCite ? { index: nbaCite.citationIndex || 5, source: nbaCite } : null,
      accent: 'green',
    },
  ];
}

export function AssistantPage() {
  const {
    jurisdiction,
    setCurrentStep,
    formulationType,
    setFormulationType,
    formulationContext,
    setFormulationContext,
    updateFormulationField,
    currentQuestion,
    setCurrentQuestion,
    answerState,
    executeAnalysis,
    loadDemoFallback,
    resetConsultation,
    loadExample,
    formulationTypes,
    exampleQuestions,
  } = useConsultation();

  // Local form validation errors
  const [errors, setErrors] = useState({});

  // URL Query & Demo Controls State (?demo=1 or toggled)
  const { searchParams } = useLocation();
  const hasDemoParam = searchParams.get('demo') === '1';
  const [showDemoControls, setShowDemoControls] = useState(hasDemoParam);

  // Escalation Modal State
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateSubmitted, setEscalateSubmitted] = useState(false);
  const [escalateForm, setEscalateForm] = useState({
    name: '',
    contact: '',
    focusArea: 'Section 3(p) Traditional Knowledge Defense',
    notes: '',
  });

  // Selected scenario ID for demonstration
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  const navigate = useNavigate();

  // Source Detail Drawer State
  const [selectedSource, setSelectedSource] = useState(null);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  const handleOpenSourceDetail = useCallback((source, markerIndex) => {
    if (!source && markerIndex && answerState.data?.statutoryCitations) {
      const found =
        answerState.data.statutoryCitations.find(
          (c) => c.citationIndex === markerIndex || c.index === markerIndex
        ) || answerState.data.statutoryCitations[markerIndex - 1];
      if (found) {
        setSelectedSource(found);
        setIsSourceDrawerOpen(true);
        return;
      }
    }
    if (source) {
      setSelectedSource(source);
      setIsSourceDrawerOpen(true);
    }
  }, [answerState.data]);

  const handleCloseSourceDrawer = useCallback(() => {
    setIsSourceDrawerOpen(false);
  }, []);

  const handleOpenAllSources = useCallback(() => {
    if (answerState.data?.statutoryCitations?.length) {
      setSelectedSource(answerState.data.statutoryCitations[0]);
      setIsSourceDrawerOpen(true);
    }
  }, [answerState.data]);

  const handleNavigateToLibrary = useCallback((source) => {
    setIsSourceDrawerOpen(false);
    if (source?.id) {
      navigate(`/sources?id=${source.id}&from=assistant`);
    } else {
      navigate('/sources?from=assistant');
    }
  }, [navigate]);

  // Input element refs for accessibility focus management
  const titleInputRef = useRef(null);
  const botanicalsInputRef = useRef(null);
  const questionInputRef = useRef(null);

  // Handle Form Analysis Submission
  const handleAnalyze = useCallback(
    async (e, { isErrorTest = false, scenario = null } = {}) => {
      if (e && e.preventDefault) e.preventDefault();

      const newErrors = {};
      const titleVal = scenario ? scenario.title : formulationContext.title;
      const botVal = scenario ? scenario.botanicals : formulationContext.botanicals;
      const qVal = scenario ? scenario.question : currentQuestion;

      if (!titleVal.trim()) {
        newErrors.title = 'Please enter a formulation title or invention designation.';
      }
      if (!botVal.trim()) {
        newErrors.botanicals = 'Please enter the botanical entities or active ingredients.';
      }
      if (!qVal.trim()) {
        newErrors.question = 'Please enter your consultation question.';
      } else if (qVal.trim().length < 10) {
        newErrors.question = 'Please enter a detailed consultation question (minimum 10 characters).';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        if (newErrors.title) {
          titleInputRef.current?.focus();
        } else if (newErrors.botanicals) {
          botanicalsInputRef.current?.focus();
        } else if (newErrors.question) {
          questionInputRef.current?.focus();
        }
        return;
      }

      setErrors({});

      if (scenario) {
        setActiveScenarioId(scenario.id);
        setFormulationType(scenario.formulationType);
        setFormulationContext({
          title: scenario.title,
          botanicals: scenario.botanicals,
          method: scenario.method,
        });
        setCurrentQuestion(scenario.question);

        await executeAnalysis({
          triggerError: false,
          scenarioType: scenario.scenarioType,
          overrideParams: {
            formulationType: scenario.formulationType,
            formulationContext: {
              title: scenario.title,
              botanicals: scenario.botanicals,
              method: scenario.method,
            },
            currentQuestion: scenario.question,
          },
        });
      } else {
        await executeAnalysis({ triggerError: isErrorTest });
      }
    },
    [formulationContext, currentQuestion, setFormulationType, setFormulationContext, setCurrentQuestion, executeAnalysis]
  );

  // Handle Scenario Quick Test
  const handleSelectScenario = useCallback(
    (scenario) => {
      handleAnalyze(null, { scenario });
    },
    [handleAnalyze]
  );

  // Handle Load Controlled Demo Fallback (SIH Presentation Resilience)
  const handleLoadDemoFallback = useCallback(() => {
    setActiveScenarioId('demo_fallback');
    setErrors({});
    loadDemoFallback();
  }, [loadDemoFallback]);

  // Handle Follow-up Question
  const handleAskFollowup = useCallback(() => {
    setCurrentStep(2); // Step: Ask
    setCurrentQuestion('');
    setErrors({});
    setTimeout(() => {
      questionInputRef.current?.focus();
    }, 100);
  }, [setCurrentStep, setCurrentQuestion]);

  // Handle Clarify Question (for Low Confidence or Abstention)
  const handleClarifyQuestion = useCallback(() => {
    setCurrentStep(2);
    setErrors({});
    setTimeout(() => {
      questionInputRef.current?.focus();
    }, 100);
  }, [setCurrentStep]);

  // Handle Escalation Modal Open / Submit
  const handleOpenEscalation = useCallback(() => {
    setEscalateSubmitted(false);
    setIsEscalateModalOpen(true);
  }, []);

  const handleCloseEscalation = useCallback(() => {
    setIsEscalateModalOpen(false);
    setEscalateSubmitted(false);
  }, []);

  const handleEscalationSubmit = (e) => {
    e.preventDefault();
    if (!escalateForm.name.trim() || !escalateForm.contact.trim()) {
      return;
    }
    setEscalateSubmitted(true);
  };

  const isAnalyzing = answerState.status === 'loading';
  const hasResult = answerState.status === 'success' && answerState.data;
  const isError = answerState.status === 'error';
  const resultData = answerState.data;

  // Toggle state for full explanation narrative (collapsed by default)
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  // Reset full explanation state whenever answer result changes
  useEffect(() => {
    setShowFullExplanation(false);
  }, [resultData]);

  // Structured findings calculation for the 7-row table
  const structuredRows = useMemo(() => {
    if (!resultData) return [];
    return getStructuredFindings(resultData);
  }, [resultData]);

  // Format DataTable headers and rows for Statutory Citations
  const citationHeaders = [
    { label: 'Ref', key: 'ref' },
    { label: 'Statutory Authority', key: 'authority' },
    { label: 'Provision', key: 'section' },
    { label: 'Legal Assessment & Prior Art Finding', key: 'assessment' },
    { label: 'Action', key: 'action' },
  ];

  const citationRows = hasResult && resultData.statutoryCitations
    ? resultData.statutoryCitations.map((c, idx) => {
        const marker = c.citationIndex || idx + 1;
        return {
          ref: (
            <button
              type="button"
              className="gov-citation-marker"
              onClick={() => handleOpenSourceDetail(c, marker)}
              aria-label={`View Citation [${marker}]: ${c.title || c.authority}`}
              id={`table-citation-${marker}`}
            >
              [{marker}]
            </button>
          ),
          authority: (
            <div>
              <button
                type="button"
                className="gov-citation-link-btn"
                onClick={() => handleOpenSourceDetail(c, marker)}
                id={`table-authority-link-${marker}`}
              >
                {c.authority}
              </button>
              {c.category && (
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {c.category}
                </div>
              )}
            </div>
          ),
          section: (
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {c.section || c.provision}
            </span>
          ),
          assessment: c.assessment,
          action: (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenSourceDetail(c, marker)}
              id={`table-btn-view-${marker}`}
            >
              View Detail &rarr;
            </Button>
          ),
        };
      })
    : [];

  return (
    <div className="workspace-page">
      <Container size="xl">
        {/* Workspace Orientation Header */}
        <header className="workspace-header">
          <div>
            <h1 className="workspace-header__title">
              Ayurvedic IP &amp; Regulatory Consultation Assistant
            </h1>
            <p className="workspace-header__subtitle">
              Formulate patent claims, evaluate traditional knowledge disclosures (TKDL), assess Section 3(p)
              anticipation, and determine ASU regulatory compliance pathways with cited statutory authorities.
            </p>
          </div>

          <div className="workspace-header__actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDemoControls((prev) => !prev)}
            >
              {showDemoControls ? 'Hide Demo Controls' : 'Demo Controls'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetConsultation}
              disabled={isAnalyzing}
              iconLeft={<RefreshIcon size={14} />}
            >
              Reset Workspace
            </Button>
          </div>
        </header>

        {/* Evaluator Demonstration Scenarios & Controls Bar: Grouped under visibly labeled "Demo controls" */}
        {showDemoControls && (
          <section className="gov-scenario-panel" aria-label="Demo controls">
            <div className="gov-scenario-header">
              <h2 className="gov-scenario-title" style={{ fontSize: '13px', margin: 0, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Demo controls
              </h2>
            </div>
            <div className="gov-scenario-buttons" role="group">
              {CONSULTATION_SCENARIOS.map((scen, idx) => {
                const isSelected = activeScenarioId === scen.id && !resultData?.isDemoFallback;
                return (
                  <button
                    key={scen.id}
                    type="button"
                    id={`scenario-btn-${scen.scenarioType}`}
                    className={`gov-scenario-btn ${isSelected ? 'gov-scenario-btn--active' : ''}`}
                    onClick={() => handleSelectScenario(scen)}
                    disabled={isAnalyzing}
                    title={scen.label}
                  >
                    <span className="gov-scenario-btn__label">
                      {idx + 1}. {scen.label}
                    </span>
                    <span className="gov-scenario-btn__tag">
                      {scen.tag}
                    </span>
                  </button>
                );
              })}

              {/* 6. Controlled Demo Fallback Quick Button */}
              <button
                type="button"
                id="scenario-btn-fallback"
                className={`gov-scenario-btn ${resultData?.isDemoFallback ? 'gov-scenario-btn--active' : ''}`}
                onClick={handleLoadDemoFallback}
                disabled={isAnalyzing}
                title="Loads the pre-verified offline controlled demo response"
              >
                <span className="gov-scenario-btn__label">
                  6. Demo Fallback
                </span>
                <span className="gov-scenario-btn__tag">
                  Offline Fail-Safe
                </span>
              </button>

              {/* 7. Fault Recovery: Simulate Error */}
              <button
                type="button"
                id="scenario-btn-simulate-error"
                className="gov-scenario-btn"
                onClick={(e) => handleAnalyze(e, { isErrorTest: true })}
                disabled={isAnalyzing}
                title="Demonstrates error handling state and recovery"
              >
                <span className="gov-scenario-btn__label">
                  7. Simulate Error
                </span>
                <span className="gov-scenario-btn__tag">
                  Fault Recovery
                </span>
              </button>
            </div>
          </section>
        )}

        {/* Dual-Column Research Layout */}
        <div className="workspace-grid">
          {/* ================================================================
              COLUMN 1: FORMULATION CONTEXT, QUERY & EXAMPLES
              ================================================================ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Formulation Specification Panel */}
            <Panel>
              <PanelHeader bordered>
                <PanelTitle>1. Formulation Context</PanelTitle>
                <PanelDescription>
                  Define botanical entities, formulation taxonomy, and extraction parameters
                </PanelDescription>
              </PanelHeader>

              <PanelContent>
                {/* Statutory Category Dropdown */}
                <div className="ui-form-group">
                  <label htmlFor="formulation-category" className="ui-label">
                    <span>Statutory Formulation Category</span>
                    <span className="ui-label__required" style={{ fontWeight: 'normal', fontSize: '13px', marginLeft: '4px' }}>
                      (required)
                    </span>
                  </label>
                  <select
                    id="formulation-category"
                    value={formulationType}
                    onChange={(e) => setFormulationType(e.target.value)}
                    className="ui-input"
                    disabled={isAnalyzing}
                  >
                    {formulationTypes.map((ft) => (
                      <option key={ft.id} value={ft.id}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Formulation Title */}
                <Input
                  ref={titleInputRef}
                  label="Formulation / Invention Title"
                  id="formulation-title"
                  name="title"
                  placeholder="e.g., Bio-enhanced Curcumin-Piperine Synergistic Formulation"
                  value={formulationContext.title}
                  onChange={(e) => {
                    updateFormulationField('title', e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  error={errors.title}
                  helperText="State the technical or proprietary designation of the preparation."
                  required
                  requiredText="(required)"
                  disabled={isAnalyzing}
                />

                {/* Botanical Actives */}
                <Input
                  ref={botanicalsInputRef}
                  label="Botanical &amp; Chemical Actives (Sanskrit / Binomial)"
                  id="botanicals-input"
                  name="botanicals"
                  placeholder="e.g., Haridra (Curcuma longa rhizome extract 95%) + Maricha (Piper nigrum fruit alkaloid 98%)"
                  value={formulationContext.botanicals}
                  onChange={(e) => {
                    updateFormulationField('botanicals', e.target.value);
                    if (errors.botanicals) setErrors((prev) => ({ ...prev, botanicals: '' }));
                  }}
                  error={errors.botanicals}
                  helperText="Specify plant parts (Rhizome, Fruit, Bark) and standardized assay fractions."
                  required
                  requiredText="(required)"
                  disabled={isAnalyzing}
                />

                {/* Method of Preparation */}
                <Textarea
                  label="Method of Preparation &amp; Novel Technical Feature"
                  id="formulation-method"
                  name="method"
                  rows={3}
                  placeholder="Detail extraction solvent, isolation ratios, synergistic mechanisms, or pharmacokinetic enhancements..."
                  value={formulationContext.method}
                  onChange={(e) => updateFormulationField('method', e.target.value)}
                  helperText="Highlight technical variations from classical treatises (Charaka, Sushruta Samhita)."
                  disabled={isAnalyzing}
                />
              </PanelContent>
            </Panel>

            {/* 2. Consultation Query & Example Questions Panel */}
            <Panel>
              <PanelHeader bordered>
                <PanelTitle>2. Consultation Query</PanelTitle>
                <PanelDescription>
                  Enter specific questions on Section 3(p), novelty, TKDL prior art, or licensing
                </PanelDescription>
              </PanelHeader>

              <PanelContent>
                <form onSubmit={handleAnalyze} noValidate>
                  {/* Query Textarea */}
                  <Textarea
                    ref={questionInputRef}
                    label="Consultation Query"
                    id="consultation-question"
                    name="question"
                    rows={3}
                    placeholder="e.g., Is a standardized Curcuma longa and Piper nigrum formulation patentable under Section 3(p) and 3(e) of the Indian Patents Act, 1970?"
                    value={currentQuestion}
                    onChange={(e) => {
                      setCurrentQuestion(e.target.value);
                      if (errors.question) setErrors((prev) => ({ ...prev, question: '' }));
                    }}
                    error={errors.question}
                    helperText="Formulate your statutory question. Minimum 10 characters."
                    required
                    requiredText="(required)"
                    disabled={isAnalyzing}
                  />

                  {/* Invalid Input State: Form-level alert explaining exactly what is missing */}
                  {Object.keys(errors).length > 0 && (
                    <div style={{ marginTop: '16px' }} id="validation-summary-container">
                      <Notice
                        variant="error"
                        title="Incomplete Formulation Submission"
                        id="validation-summary-notice"
                        icon={<AlertCircleIcon size={18} />}
                      >
                        <div style={{ fontSize: '13px' }}>
                          <strong>Please provide the following required parameters before statutory screening:</strong>
                          <ul style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
                            {errors.title && <li id="error-summary-title">{errors.title}</li>}
                            {errors.botanicals && <li id="error-summary-botanicals">{errors.botanicals}</li>}
                            {errors.question && <li id="error-summary-question">{errors.question}</li>}
                          </ul>
                        </div>
                      </Notice>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div style={{ marginTop: '16px' }}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      id="btn-analyze-guidance"
                      isLoading={isAnalyzing}
                      disabled={isAnalyzing}
                      iconLeft={<ScalesIcon size={16} />}
                      style={{ width: '100%' }}
                    >
                      {isAnalyzing ? 'Analyzing Authorities...' : 'Analyze Statutory Guidance'}
                    </Button>
                  </div>
                </form>

                {/* Example Questions Section */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                    Example Consultation Questions (select to pre-fill context):
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {exampleQuestions.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        className="workspace-example-btn"
                        onClick={() => {
                          loadExample(ex);
                          setActiveScenarioId(null);
                          setErrors({});
                        }}
                        disabled={isAnalyzing}
                      >
                        <span className="workspace-example-btn__category">{ex.category}</span>
                        <span className="workspace-example-btn__question">{ex.question}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </PanelContent>
            </Panel>
          </div>

          {/* ================================================================
              COLUMN 2: DYNAMIC STATUTORY DOSSIER OUTPUT
              ================================================================ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* STATE 1: LOADING / ANALYSIS STATE */}
            {isAnalyzing && (
              <Panel>
                <PanelHeader bordered>
                  <PanelTitle>Analyzing Statutory &amp; Prior Art Authorities...</PanelTitle>
                  <PanelDescription>
                    Screening legal databases under {jurisdiction} framework
                  </PanelDescription>
                </PanelHeader>

                <PanelContent style={{ padding: '36px 24px', textAlign: 'center' }}>
                  <LoadingIndicator
                    size="lg"
                    label="Evaluating statutory criteria against D&C Act, Patents Act 1970, and related authorities..."
                  />

                  {/* Stepped progress indicators */}
                  <div className="gov-analysis-stepper">
                    <div className="gov-analysis-step-item">
                      <span className="gov-analysis-step-bullet gov-analysis-step-bullet--done" aria-hidden="true">1</span>
                      <span>Reviewing formulation context &amp; botanical parameters</span>
                    </div>
                    <div className="gov-analysis-step-item">
                      <span className="gov-analysis-step-bullet gov-analysis-step-bullet--active" aria-hidden="true">2</span>
                      <span>Screening First Schedule treatises, TKDL indices, &amp; statutory provisions</span>
                    </div>
                    <div className="gov-analysis-step-item">
                      <span className="gov-analysis-step-bullet gov-analysis-step-bullet--pending" aria-hidden="true">3</span>
                      <span>Synthesizing source-grounded response &amp; confidence level</span>
                    </div>
                  </div>

                  <div className="gov-analysis-disclaimer-note">
                    Simulated advisory analysis in progress. Screening against authoritative legal frameworks.
                  </div>
                </PanelContent>
              </Panel>
            )}

            {/* STATE 2: ERROR STATE WITH RECOVERY */}
            {!isAnalyzing && isError && (
              <Panel variant="error">
                <PanelHeader bordered>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircleIcon size={18} style={{ color: 'var(--color-status-error)' }} />
                    <PanelTitle style={{ color: 'var(--color-status-error)' }}>
                      Analysis Generation Interrupted
                    </PanelTitle>
                  </div>
                </PanelHeader>

                <PanelContent>
                  <Notice variant="error" icon={<AlertCircleIcon size={18} />} id="error-state-notice">
                    <div>
                      <strong>Consultation Error:</strong> {answerState.error}
                    </div>
                  </Notice>

                  <p style={{ fontSize: '14px', margin: '16px 0', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    Your entered formulation context and question are preserved. You can re-attempt the statutory
                    screening or modify your query parameters. If live services are unavailable during presentation,
                    you may load the pre-verified controlled demo fallback response.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      id="btn-retry-analysis"
                      onClick={() => handleAnalyze()}
                      iconLeft={<RefreshIcon size={14} />}
                    >
                      Retry Analysis
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      id="btn-load-demo-fallback"
                      onClick={handleLoadDemoFallback}
                    >
                      Load Controlled Demo Fallback
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      id="btn-edit-question-from-error"
                      onClick={() => questionInputRef.current?.focus()}
                    >
                      Edit Question
                    </Button>
                  </div>
                </PanelContent>
              </Panel>
            )}

            {/* STATE 3A: ABSTENTION STATE */}
            {!isAnalyzing && hasResult && resultData.isAbstention && (
              <Panel className="gov-abstention-panel">
                <PanelHeader bordered>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircleIcon size={18} style={{ color: 'var(--color-text-muted)' }} />
                      <PanelTitle>Statutory Sources Insufficient for Safe Determination</PanelTitle>
                    </div>
                    <span className="gov-confidence-badge gov-confidence-badge--low" id="abstention-confidence-badge">
                      <AlertCircleIcon size={14} aria-hidden="true" />
                      Low confidence
                    </span>
                  </div>
                  <PanelDescription>
                    Jurisdiction: {resultData.jurisdiction}
                  </PanelDescription>
                </PanelHeader>

                <PanelContent>
                  {/* Mandatory Legal Advice Disclaimer */}
                  <Notice
                    variant="gold"
                    title="Legal Disclaimer"
                    className="mb-4"
                  >
                    <strong>This information is not legal advice.</strong> The system cannot safely provide
                    conclusive statutory guidance for this inquiry because the supporting baseline sources
                    are insufficient.
                  </Notice>

                  {/* 1. User Question */}
                  <div className="gov-answer-user-question">
                    <div className="gov-answer-question-label">Consultation Question</div>
                    <p className="gov-answer-question-text">"{resultData.userQuestion}"</p>
                  </div>

                  {/* 2. Jurisdiction & 3. Formulation Context */}
                  <dl className="portal-glance-list" style={{ marginBottom: '16px' }}>
                    <div className="portal-glance-row">
                      <dt>Target Jurisdiction:</dt>
                      <dd><strong>{resultData.jurisdiction}</strong></dd>
                    </div>
                    <div className="portal-glance-row">
                      <dt>Formulation Title:</dt>
                      <dd>{resultData.formulationContext.title}</dd>
                    </div>
                    <div className="portal-glance-row">
                      <dt>Botanical Species Disclosed:</dt>
                      <dd><em>{resultData.formulationContext.botanicals}</em></dd>
                    </div>
                  </dl>

                  {/* Abstention Explanation */}
                  <div className="gov-abstention-box">
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                      Why the system is abstaining:
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, margin: 0 }} id="abstention-finding-text">
                      <CitationText
                        text={resultData.guidance.findingText}
                        citations={resultData.statutoryCitations}
                        onSelectCitation={handleOpenSourceDetail}
                      />
                    </p>

                    <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '12px', color: 'var(--color-primary)' }}>
                      Missing Source Information:
                    </div>
                    <ul className="gov-abstention-missing-list">
                      {resultData.abstentionDetails.missingElements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 5. Expandable Confidence Explanation */}
                  <div className="gov-confidence-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="gov-confidence-badge gov-confidence-badge--low">
                        <AlertCircleIcon size={14} aria-hidden="true" />
                        Low confidence (Abstention)
                      </span>
                    </div>
                    <details className="gov-confidence-details">
                      <summary className="gov-confidence-summary">
                        Why this confidence rating? (Click to expand)
                      </summary>
                      <div className="gov-confidence-explanation-text">
                        {resultData.confidenceExplanation}
                      </div>
                    </details>
                  </div>

                  {/* 6. Citations */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                      Relevant Statutory Requirements Regarding Disclosure:
                    </div>
                    <DataTable
                      headers={citationHeaders}
                      rows={citationRows}
                      caption="Statutory disclosure requirements"
                    />
                  </div>
                </PanelContent>

                {/* 8. Follow-up & 9. Escalation Actions */}
                <PanelFooter bordered style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    id="btn-clarify-question"
                    onClick={handleClarifyQuestion}
                  >
                    Clarify Question &amp; Disclose Botanicals
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    id="btn-escalate-expert-abstention"
                    onClick={handleOpenEscalation}
                    iconRight={<ArrowRightIcon size={14} />}
                  >
                    Escalate to Expert
                  </Button>
                </PanelFooter>
              </Panel>
            )}

            {/* STATE 3B: SUCCESS / DEFINITIVE ANSWER STATE (High, Medium, or Low Confidence) */}
            {!isAnalyzing && hasResult && !resultData.isAbstention && (
              <>
                {/* Preliminary Statutory Assessment Card */}
                <Panel className={resultData.confidence === 'Low' ? 'gov-low-confidence-panel' : ''}>
                  <PanelHeader bordered>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          id="btn-view-sources"
                          onClick={handleOpenAllSources}
                        >
                          View Sources ({resultData.statutoryCitations?.length || 0})
                        </Button>
                      </div>

                      {/* 5. Confidence Badge (High, Medium, Low) & Demo Fallback badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {resultData.isDemoFallback && (
                          <span className="gov-demo-fallback-badge" id="demo-fallback-badge">
                            Demo Fallback (Offline Mode)
                          </span>
                        )}
                        <span
                          id="answer-confidence-badge"
                          className={`gov-confidence-badge gov-confidence-badge--${resultData.confidence.toLowerCase()}`}
                        >
                          {resultData.confidence === 'High' && <CheckCircleIcon size={14} aria-hidden="true" />}
                          {resultData.confidence === 'Medium' && <InfoIcon size={14} aria-hidden="true" />}
                          {resultData.confidence === 'Low' && <AlertCircleIcon size={14} aria-hidden="true" />}
                          {resultData.confidence} confidence
                        </span>
                      </div>
                    </div>

                    <PanelTitle style={{ marginTop: '8px' }}>
                      Preliminary Patentability &amp; Statutory Guidance
                    </PanelTitle>
                    <PanelDescription>
                      Jurisdiction: {resultData.jurisdiction}
                    </PanelDescription>
                  </PanelHeader>

                  <PanelContent>
                    {/* Controlled Demo Fallback Notice if active */}
                    {resultData.isDemoFallback && (
                      <Notice
                        variant="gold"
                        title="Controlled Demo Fallback Active — Fail-Safe Demonstration Mode"
                        className="mb-4"
                        id="demo-fallback-notice"
                        icon={<InfoIcon size={18} />}
                      >
                        <div>
                          <strong>Pre-verified Demonstration Result:</strong> {resultData.fallbackNotice?.message || 'This consultation result was retrieved from the local controlled demo cache because the live analysis pipeline was offline or simulated a test failure. It provides pre-verified demonstration data with authentic statutory citations while explicitly marking the output as demo behavior.'}
                        </div>
                      </Notice>
                    )}

                    {/* 7. Mandatory Legal Advice Disclaimer */}
                    <Notice
                      variant="gold"
                      title="Legal Disclaimer"
                      className="mb-4"
                    >
                      <strong>This information is not legal advice.</strong> The statutory assessment below is generated
                      for preliminary intake and screening guidance only. It does not substitute for formal counsel by a
                      registered patent agent or advocate.
                    </Notice>

                    {/* Low Confidence Alert Banner if Low */}
                    {resultData.confidence === 'Low' && (
                      <Notice
                        variant="gold"
                        title="Low Confidence Assessment — Caution Advised"
                        className="mb-4"
                        icon={<AlertCircleIcon size={16} />}
                      >
                        This guidance carries low confidence due to unresolved statutory boundaries and competing regulatory
                        interpretations. Do not rely on this assessment for statutory filing without professional patent counsel review.
                      </Notice>
                    )}

                    {/* 1. User Question */}
                    <div className="gov-answer-user-question">
                      <div className="gov-answer-question-label">Consultation Question</div>
                      <p className="gov-answer-question-text" id="answer-user-question-text">
                        "{resultData.userQuestion}"
                      </p>
                    </div>

                    {/* Backward-compatible hidden identifiers if targeted by automation */}
                    <span id="answer-jurisdiction-val" style={{ display: 'none' }}>{resultData.jurisdiction}</span>
                    <span id="answer-title-val" style={{ display: 'none' }}>{resultData.formulationContext.title}</span>

                    {/* TABLE STRUCTURE: Bold subheading matching panel title style (one-line verdict) */}
                    <h3 className="gov-structured-verdict-title" id="guidance-headline">
                      {resultData.guidance?.headline || 'Section 3(p) Anticipation Screened; Synergistic Evidence Required'}
                    </h3>

                    {/* Structured Table: Aspect (25%), Finding (60%), Source (15%) */}
                    <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
                      <table className="gov-structured-table" aria-label="Preliminary Patentability & Statutory Guidance Findings">
                        <thead>
                          <tr>
                            <th style={{ width: '25%' }}>Aspect</th>
                            <th style={{ width: '60%' }}>Finding</th>
                            <th className="gov-structured-table__col-source" style={{ width: '15%' }}>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {structuredRows.map((row, idx) => {
                            const isEven = (idx + 1) % 2 === 0;
                            const rowBg = isEven ? '#F4F7F2' : '#FFFFFF';
                            const accentBorder =
                              row.accent === 'red'
                                ? '4px solid #C62828'
                                : row.accent === 'amber'
                                ? '4px solid #C9A227'
                                : row.accent === 'green'
                                ? '4px solid #1B5E20'
                                : undefined;

                            return (
                              <tr
                                key={row.id}
                                className={row.accent ? `gov-row-accent--${row.accent}` : ''}
                                style={{ backgroundColor: rowBg }}
                              >
                                <td
                                  style={{
                                    width: '25%',
                                    fontWeight: 600,
                                    color: 'var(--color-primary, #1F3D2B)',
                                    borderLeft: accentBorder,
                                    backgroundColor: rowBg,
                                  }}
                                >
                                  {row.aspect}
                                </td>
                                <td style={{ width: '60%', backgroundColor: rowBg }}>
                                  {row.finding}
                                </td>
                                <td
                                  style={{
                                    width: '15%',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: rowBg,
                                  }}
                                >
                                  {row.source ? (
                                    <InlineCitation
                                      index={row.source.index}
                                      source={row.source.source}
                                      onClick={handleOpenSourceDetail}
                                    />
                                  ) : (
                                    <span style={{ color: 'var(--color-text-muted, #595959)', fontSize: '13px' }}>—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Small Toggle Link for Full Explanation (plain text, chevron icon, not a button, collapsed by default) */}
                    <div style={{ margin: '6px 0 14px 0' }}>
                      <button
                        type="button"
                        id="btn-toggle-full-explanation"
                        className="gov-explanation-toggle"
                        onClick={() => setShowFullExplanation((prev) => !prev)}
                        aria-expanded={showFullExplanation}
                      >
                        <span>{showFullExplanation ? 'Hide full explanation' : 'Read full explanation'}</span>
                        <span
                          className={`gov-explanation-toggle__chevron ${showFullExplanation ? 'gov-explanation-toggle__chevron--expanded' : ''}`}
                          aria-hidden="true"
                        >
                          ⌄
                        </span>
                      </button>

                      {showFullExplanation && (
                        <div className="gov-full-narrative-box" id="guidance-full-explanation-wrapper">
                          <div id="guidance-finding-text">
                            <CitationText
                              text={resultData.guidance?.findingText}
                              citations={resultData.statutoryCitations}
                              onSelectCitation={handleOpenSourceDetail}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommended Strategy Callout (same gold/amber bordered box style already used for Legal Disclaimer) */}
                    <Notice
                      variant="gold"
                      className="mb-4"
                      id="guidance-recommended-strategy"
                    >
                      <strong>Recommended Strategy:</strong> {resultData.guidance?.recommendedAction}
                    </Notice>

                    {/* Uncertainty Explanation (Only if Low Confidence) */}
                    {resultData.confidence === 'Low' && resultData.uncertaintyDetails && (
                      <div className="gov-uncertainty-box" style={{ marginBottom: '16px' }}>
                        <div className="gov-uncertainty-title">
                          {resultData.uncertaintyDetails.headline}
                        </div>
                        <ul className="gov-uncertainty-list">
                          {resultData.uncertaintyDetails.points.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Expandable Confidence Explanation */}
                    <details className="gov-confidence-details" style={{ marginBottom: '8px' }}>
                      <summary className="gov-confidence-summary">
                        Why this confidence rating? (Click to expand)
                      </summary>
                      <div className="gov-confidence-explanation-text" id="confidence-explanation-text">
                        {resultData.confidenceExplanation}
                      </div>
                    </details>
                  </PanelContent>
                </Panel>

                {/* 6. Statutory Citations & Authority Table */}
                <Panel id="statutory-citations-panel">
                  <PanelHeader bordered>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <PanelTitle>Statutory Citations &amp; Prior Art References</PanelTitle>
                        <PanelDescription>
                          {resultData.hasNoSources || !resultData.statutoryCitations?.length
                            ? 'No supporting statutory authorities retrieved for this non-botanical entity'
                            : 'Primary statutory authorities and treatise monographs cited for this formulation'}
                        </PanelDescription>
                      </div>
                      {resultData.statutoryCitations?.length > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          id="btn-table-view-all-sources"
                          onClick={handleOpenAllSources}
                        >
                          Browse Source Details Drawer &rarr;
                        </Button>
                      )}
                    </div>
                  </PanelHeader>

                  <PanelContent style={{ padding: resultData.hasNoSources || !resultData.statutoryCitations?.length ? 'var(--spacing-5)' : 0 }}>
                    {resultData.hasNoSources || !resultData.statutoryCitations?.length ? (
                      <div id="nosources-alert-container">
                        <Notice
                          variant="gold"
                          title="Zero Statutory Sources Retrieved — Citation Integrity Preserved"
                          className="mb-4"
                          id="nosources-citation-notice"
                          icon={<InfoIcon size={18} />}
                        >
                          <div>
                            <strong>No Supporting Statutory Sources Retrieved:</strong> The statutory legal database screened all indexed authorities and retrieved zero matching provisions or traditional knowledge monographs. The queried entity comprises purely synthetic, non-biological materials with no textual basis in First Schedule Ayurvedic treatises, API, or TKDL repositories. <strong>In accordance with strict legal integrity, zero citations have been fabricated.</strong>
                          </div>
                        </Notice>

                        <div className="gov-nosources-box">
                          <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                            Screened Repositories (0 Matches):
                          </div>
                          <ul className="gov-nosources-scope-list">
                            <li>The Patents Act, 1970 — Traditional Knowledge Section 3(p) / Section 3(e)</li>
                            <li>Traditional Knowledge Digital Library (TKDL) Monograph Index</li>
                            <li>Drugs &amp; Cosmetics Act, 1940 — First Schedule Authoritative Treatises</li>
                            <li>Biological Diversity Act, 2002 — National Biodiversity Authority (NBA) Biological Resource Registries</li>
                          </ul>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                            <strong>Statutory Redirection:</strong> For non-botanical synthetic polymers (such as silicone hydrogels or PDMS elastomers), evaluate patentability under Section 2(1)(j) of the Patents Act, 1970 (standard novelty and inventive step) and regulatory compliance under the Medical Device Rules, 2017 (CDSCO).
                          </p>
                        </div>
                      </div>
                    ) : (
                      <DataTable
                        headers={citationHeaders}
                        rows={citationRows}
                        caption="Statutory citations and prior art references"
                      />
                    )}
                  </PanelContent>
                </Panel>

                {/* Recommended Next Action Checklist */}
                <Panel>
                  <PanelHeader bordered>
                    <PanelTitle>Statutory Next Steps &amp; Compliance Checklist</PanelTitle>
                    <PanelDescription>
                      Action items for IP counsel and research teams prior to statutory filing
                    </PanelDescription>
                  </PanelHeader>

                  <PanelContent>
                    <ol className="workspace-step-list">
                      {resultData.actionChecklist.map((act) => (
                        <li key={act.step}>
                          <strong>{act.title}:</strong> {act.desc}
                        </li>
                      ))}
                    </ol>
                  </PanelContent>

                  {/* 8. Follow-up & 9. Escalation Actions */}
                  <PanelFooter bordered style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        id="btn-ask-followup"
                        onClick={handleAskFollowup}
                      >
                        Ask Follow-up Question
                      </Button>
                      {resultData.confidence === 'Low' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          id="btn-clarify-low-confidence"
                          onClick={handleClarifyQuestion}
                        >
                          Clarify Question
                        </Button>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      id="btn-escalate-expert"
                      onClick={handleOpenEscalation}
                      iconRight={<ArrowRightIcon size={14} />}
                    >
                      Escalate to Expert
                    </Button>
                  </PanelFooter>
                </Panel>
              </>
            )}

            {/* STATE 4: INITIAL OR EMPTY STATE */}
            {!isAnalyzing && !hasResult && !isError && (
              <Panel id="consultation-initial-panel">
                <PanelHeader bordered>
                  <PanelTitle>
                    {!formulationContext.title?.trim() && !formulationContext.botanicals?.trim() && !currentQuestion?.trim()
                      ? 'Consultation Workspace — Ready for Inquiry'
                      : 'Consultation Dossier & Advisory Research Center'}
                  </PanelTitle>
                  <PanelDescription>
                    Framework: {jurisdiction === 'India' ? 'Indian Patent Act 1970 & AYUSH Regulatory Framework' : 'International Patent Framework (PCT / WIPO / EPO)'}
                  </PanelDescription>
                </PanelHeader>

                <PanelContent>
                  {!formulationContext.title?.trim() && !formulationContext.botanicals?.trim() && !currentQuestion?.trim() ? (
                    /* EMPTY STATE: Helpful guidance and 1-click sample loaders */
                    <div id="consultation-empty-guidance">
                      <Notice variant="primary" icon={<ShieldIcon size={18} />}>
                        <div>
                          <strong>Workspace Ready:</strong> No active formulation query is currently loaded. Enter your botanical details and question on the left, or select one of the pre-configured statutory consultation templates below to immediately populate the workspace.
                        </div>
                      </Notice>

                      <div style={{ marginTop: '20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                          Quick-Start Consultation Templates (1-Click Load):
                        </div>
                        <div className="gov-quick-samples-list">
                          <div className="gov-quick-sample-item">
                            <div className="gov-quick-sample-text">
                              <div className="gov-quick-sample-title">1. Curcumin-Piperine Synergistic Formulation</div>
                              <div className="gov-quick-sample-desc">
                                Proprietary ASU Medicine • Section 3(p) TKDL Defense &amp; Section 3(e) Synergism Assay Requirements
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              id="empty-load-sample-1"
                              onClick={() => {
                                loadExample(exampleQuestions[0]);
                                setErrors({});
                              }}
                            >
                              Load Formulation
                            </Button>
                          </div>

                          <div className="gov-quick-sample-item">
                            <div className="gov-quick-sample-text">
                              <div className="gov-quick-sample-title">2. Triphala Solid Lipid Nanoparticles (SLN)</div>
                              <div className="gov-quick-sample-desc">
                                Classical Ayurvedic kwatha preparation with novel bioavailability-enhancing carrier matrix
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              id="empty-load-sample-2"
                              onClick={() => {
                                loadExample(exampleQuestions[1]);
                                setErrors({});
                              }}
                            >
                              Load Formulation
                            </Button>
                          </div>

                          <div className="gov-quick-sample-item">
                            <div className="gov-quick-sample-text">
                              <div className="gov-quick-sample-title">3. Kumkumadi Taila &amp; Synthetic Peptide Emulsion</div>
                              <div className="gov-quick-sample-desc">
                                Regulatory boundary inquiry: CDSCO Cosmetics Rules vs ASU Proprietary Medicine licensing
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              id="empty-load-sample-3"
                              onClick={() => {
                                if (CONSULTATION_SCENARIOS[2]) {
                                  handleSelectScenario(CONSULTATION_SCENARIOS[2]);
                                }
                              }}
                            >
                              Load Scenario
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* INITIAL STATE: Explains what the user can do and what the system does */
                    <div id="consultation-initial-guidance">
                      <Notice variant="primary" icon={<ShieldIcon size={18} />}>
                        <div>
                          <strong>Formulation Context Configured:</strong> Review your parameters below and click <strong>"Analyze Statutory Guidance"</strong> on the left to initiate statutory screening and prior art analysis.
                        </div>
                      </Notice>

                      <div style={{ marginTop: '20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                          Formulation Parameters:
                        </div>
                        <dl className="portal-glance-list">
                          <div className="portal-glance-row">
                            <dt>Selected Jurisdiction:</dt>
                            <dd><strong>{jurisdiction}</strong></dd>
                          </div>
                          <div className="portal-glance-row">
                            <dt>Formulation Title:</dt>
                            <dd>{formulationContext.title || 'Draft formulation'}</dd>
                          </div>
                          <div className="portal-glance-row">
                            <dt>Disclosed Actives:</dt>
                            <dd>{formulationContext.botanicals || 'Not specified'}</dd>
                          </div>
                          <div className="portal-glance-row">
                            <dt>Workflow Stage:</dt>
                            <dd>Ready for Automated Statutory Screening</dd>
                          </div>
                        </dl>
                      </div>

                      <div style={{ marginTop: '20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                          What the Assistant Will Analyze:
                        </div>
                        <ol className="workspace-step-list">
                          <li>
                            <strong>Botanical Screening:</strong> Cross-reference disclosed plant species against authoritative First Schedule texts and TKDL monographs.
                          </li>
                          <li>
                            <strong>Section 3(p) &amp; 3(e) Evaluation:</strong> Determine whether active claims encounter traditional knowledge exclusions or require comparative synergism assays.
                          </li>
                          <li>
                            <strong>Regulatory Licensing Pathway:</strong> Verify compliance standards under Rule 158B of Drugs &amp; Cosmetics Rules or Biological Diversity Act clearances.
                          </li>
                          <li>
                            <strong>Source-Grounded Citation:</strong> Provide statutory citations with authentic legal provisions from the indexed repository.
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}
                </PanelContent>
              </Panel>
            )}
          </div>
        </div>
      </Container>

      {/* 9. ESCALATE TO EXPERT MODAL */}
      <Modal
        isOpen={isEscalateModalOpen}
        onClose={handleCloseEscalation}
        title="Escalate Consultation for Expert Review"
        description="Request specialized legal and regulatory examination by an empanelled AYUSH IP practitioner or registered patent attorney."
        size="md"
        footer={
          escalateSubmitted ? (
            <Button
              type="button"
              variant="primary"
              id="btn-close-escalation-modal"
              onClick={handleCloseEscalation}
            >
              Close
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseEscalation}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="form-escalate-expert"
                variant="primary"
                id="btn-submit-escalation"
              >
                Submit for Expert Review
              </Button>
            </div>
          )
        }
      >
        {escalateSubmitted ? (
          <div>
            <Notice
              variant="primary"
              title="Consultation Escalated Successfully"
              className="mb-4"
              icon={<CheckCircleIcon size={18} />}
            >
              <div>
                <strong>Your question has been noted for expert review.</strong> An AYUSH IP specialist will
                examine your formulation parameters and statutory citations.
              </div>
            </Notice>

            <dl className="portal-glance-list">
              <div className="portal-glance-row">
                <dt>Escalation Status:</dt>
                <dd><strong>Received for Practitioner Review</strong></dd>
              </div>
              <div className="portal-glance-row">
                <dt>Contact Person:</dt>
                <dd>{escalateForm.name} ({escalateForm.contact})</dd>
              </div>
              <div className="portal-glance-row">
                <dt>Specialization Focus:</dt>
                <dd>{escalateForm.focusArea}</dd>
              </div>
              <div className="portal-glance-row">
                <dt>Estimated Review Window:</dt>
                <dd>Within 2 working days</dd>
              </div>
            </dl>
          </div>
        ) : (
          <form id="form-escalate-expert" onSubmit={handleEscalationSubmit}>
            <div className="gov-answer-user-question" style={{ marginBottom: '16px' }}>
              <div className="gov-answer-question-label">Inquiry Under Review</div>
              <p className="gov-answer-question-text" style={{ fontSize: '13px' }}>
                "{currentQuestion || formulationContext.title || 'Formulation Assessment'}"
              </p>
            </div>

            <div className="gov-escalate-form-group">
              <Input
                label="Full Name &amp; Designation"
                id="escalate-name"
                name="name"
                placeholder="e.g., Dr. Rajesh Sharma, Head of R&D"
                value={escalateForm.name}
                onChange={(e) => setEscalateForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                requiredText="(required)"
              />
            </div>

            <div className="gov-escalate-form-group">
              <Input
                label="Email Address or Phone Number"
                id="escalate-contact"
                name="contact"
                placeholder="e.g., r.sharma@research-lab.org or +91 9876543210"
                value={escalateForm.contact}
                onChange={(e) => setEscalateForm((prev) => ({ ...prev, contact: e.target.value }))}
                required
                requiredText="(required)"
              />
            </div>

            <div className="ui-form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="escalate-focus" className="ui-label">
                <span>Specialization Focus Area</span>
                <span className="ui-label__required" style={{ fontWeight: 'normal', fontSize: '13px', marginLeft: '4px' }}>
                  (required)
                </span>
              </label>
              <select
                id="escalate-focus"
                className="ui-input"
                value={escalateForm.focusArea}
                onChange={(e) => setEscalateForm((prev) => ({ ...prev, focusArea: e.target.value }))}
              >
                <option value="Section 3(p) Traditional Knowledge Defense">
                  Section 3(p) Traditional Knowledge Defense &amp; Synergism
                </option>
                <option value="Rule 158B SLA Regulatory Licensing Dossier">
                  Rule 158B SLA Regulatory Licensing Dossier
                </option>
                <option value="PCT International Phase & EPO Examination">
                  PCT International Phase &amp; EPO Examination
                </option>
                <option value="Biological Diversity Act (NBA) Form III Clearance">
                  Biological Diversity Act (NBA) Form III Clearance
                </option>
                <option value="General Patent Drafting & Prior Art Freedom to Operate">
                  General Patent Drafting &amp; Prior Art Freedom to Operate
                </option>
              </select>
            </div>

            <div className="ui-form-group">
              <Textarea
                label="Additional Technical Notes for Expert"
                id="escalate-notes"
                name="notes"
                rows={2}
                placeholder="Specify any confidential assay parameters, pending SLA objections, or priority deadlines..."
                value={escalateForm.notes}
                onChange={(e) => setEscalateForm((prev) => ({ ...prev, notes: e.target.value }))}
                helperText="Do not include proprietary trade secrets before signing NDA."
              />
            </div>
          </form>
        )}
      </Modal>

      {/* 10. POLISHED INSTITUTIONAL SOURCE DETAIL DRAWER */}
      <SourceDetailPanel
        source={selectedSource}
        isOpen={isSourceDrawerOpen}
        onClose={handleCloseSourceDrawer}
        allSources={resultData?.statutoryCitations || []}
        onSelectSource={setSelectedSource}
        onNavigateToLibrary={handleNavigateToLibrary}
        mode="drawer"
      />
    </div>
  );
}
