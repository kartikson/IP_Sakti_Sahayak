import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from '../context/RouterContext';
import { useConsultation } from '../context/ConsultationContext';
import {
  Container,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelContent,
  Button,
  Badge,
  Input,
  Notice,
  LoadingIndicator,
  ArrowRightIcon,
  RefreshIcon,
  AlertCircleIcon,
} from '../components/common';
import {
  CANDIDATE_CATEGORIES,
  DEMO_PRESETS,
  classifyFormulation,
} from '../classification/classificationService';

export function ClassificationPage() {
  const navigate = useNavigate();
  const { searchParams } = useLocation();
  const hasDemoParam = searchParams.get('demo') === '1';
  const [showDemoControls, setShowDemoControls] = useState(hasDemoParam);

  const {
    formulationContext,
    setFormulationContext,
    setFormulationType,
    setCurrentStep,
  } = useConsultation();

  // Workflow state: 'intake' | 'result'
  const [viewState, setViewState] = useState('intake');
  const [formulationName, setFormulationName] = useState(() => formulationContext?.title || '');
  const [intendedUse, setIntendedUse] = useState('therapeutic');
  const [ingredientNature, setIngredientNature] = useState('classical_treatise');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle Demonstration Presets
  const handleApplyPreset = useCallback((preset) => {
    setSelectedPresetId(preset.id);
    setFormulationName(preset.formulationName);
    setIntendedUse(preset.intendedUse);
    setIngredientNature(preset.ingredientNature);
    setValidationError('');

    // Instant demonstration evaluation
    setIsLoading(true);
    setTimeout(() => {
      const evaluated = classifyFormulation({
        intendedUse: preset.intendedUse,
        ingredientNature: preset.ingredientNature,
        formulationName: preset.formulationName,
      });
      setResult(evaluated);
      setIsLoading(false);
      setViewState('result');
    }, 280);
  }, []);

  // Handle Manual Form Submission
  const handleEvaluate = useCallback((e) => {
    if (e) e.preventDefault();

    const trimmedName = formulationName.trim();
    if (!trimmedName) {
      setValidationError('Please enter a formulation trade or working title.');
      return;
    }

    setValidationError('');
    setIsLoading(true);

    setTimeout(() => {
      const evaluated = classifyFormulation({
        intendedUse,
        ingredientNature,
        formulationName: trimmedName,
      });
      setResult(evaluated);
      setIsLoading(false);
      setViewState('result');
    }, 320);
  }, [formulationName, intendedUse, ingredientNature]);

  // Handle Edit / Reclassify
  const handleEdit = useCallback(() => {
    setViewState('intake');
    setValidationError('');
  }, []);

  // Handle Reset to Initial Intake
  const handleReset = useCallback(() => {
    setViewState('intake');
    setFormulationName('');
    setIntendedUse('therapeutic');
    setIngredientNature('classical_treatise');
    setSelectedPresetId(null);
    setValidationError('');
    setResult(null);
  }, []);

  // Handle Continue to Consultation Workspace Question Step
  const handleContinueToQuestion = useCallback(() => {
    if (!result) return;

    // Map candidate category to workspace formulation type
    let mappedType = 'proprietary_asu';
    if (result.categoryId === 'classical_generic') {
      mappedType = 'classical';
    } else if (result.categoryId === 'patent_proprietary') {
      mappedType = 'proprietary_asu';
    } else if (result.categoryId === 'phytopharmaceutical' || result.categoryId === 'new_non_classical') {
      mappedType = 'botanical_extract';
    } else if (result.categoryId === 'cosmetic') {
      mappedType = 'cosmeceutical_asu';
    } else if (result.categoryId === 'ayurveda_aahar') {
      mappedType = 'proprietary_asu';
    }

    setFormulationType(mappedType);
    setFormulationContext((prev) => ({
      ...prev,
      title: result.formulationName,
      method: `Statutory Category: ${result.category} (${result.statutoryRef})`,
    }));

    // Transition to Step 2: "Ask" and route to assistant
    setCurrentStep(2);
    navigate('/assistant');
  }, [result, setFormulationType, setFormulationContext, setCurrentStep, navigate]);

  return (
    <div className="classification-page">
      <Container size="xl">
        {/* Main Section Header */}
        <header className="classification-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '850px' }}>
            <h1 className="classification-header__title">
              Formulation &amp; Product Regulatory Classification
            </h1>
            <p className="classification-header__desc">
              Identify the statutory categorization of your botanical, Ayurvedic, or phytopharmaceutical
              invention under the Drugs &amp; Cosmetics Act 1940, NDCT Rules 2019, FSSAI regulations, or Cosmetics Rules 2020.
              This guided assessment establishes the legal framework before formulating intellectual property queries.
            </p>
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDemoControls((prev) => !prev)}
            >
              {showDemoControls ? 'Hide Demo Controls' : 'Demo Controls'}
            </Button>
          </div>
        </header>

        {/* Demonstration Presets Toolbar: Grouped under visibly labeled "Demo controls" */}
        {showDemoControls && (
          <section
            className="classification-presets-panel"
            aria-label="Demo controls"
            style={{ marginBottom: '24px' }}
          >
            <div style={{ marginBottom: '8px' }}>
              <h2 style={{ fontSize: '13px', margin: 0, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Demo controls
              </h2>
            </div>
            <div className="classification-presets-grid" role="group">
              {DEMO_PRESETS.map((preset, idx) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    id={`preset-btn-${preset.categoryId}`}
                    onClick={() => handleApplyPreset(preset)}
                    className={`classification-preset-btn ${isSelected ? 'classification-preset-btn--active' : ''}`}
                    title={`Demonstrate ${preset.name}`}
                    aria-pressed={isSelected}
                  >
                    <span className="classification-preset-btn__number" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Loading State Overlay / Spinner */}
        {isLoading && (
          <Panel style={{ padding: '48px 24px', textAlign: 'center', marginBottom: '32px' }}>
            <LoadingIndicator
              size="lg"
              text="Evaluating statutory criteria against D&C Act, NDCT Rules, FSSAI, and Cosmetics Rules..."
            />
          </Panel>
        )}

        {/* Guided Intake Questions View */}
        {!isLoading && viewState === 'intake' && (
          <form onSubmit={handleEvaluate} noValidate>
            {/* Validation Error Notice if any */}
            {validationError && (
              <Notice
                variant="error"
                title="Input Required"
                icon={<AlertCircleIcon size={16} />}
                className="mb-4"
              >
                {validationError}
              </Notice>
            )}

            {/* Product / Formulation Context Input */}
            <Panel className="mb-4">
              <PanelHeader bordered>
                <PanelTitle>Formulation Context</PanelTitle>
                <PanelDescription>
                  Enter the trade name, experimental working title, or composition identifier of the product.
                </PanelDescription>
              </PanelHeader>
              <PanelContent>
                <Input
                  label="Formulation Trade or Working Title"
                  id="formulation-name-input"
                  name="formulationName"
                  placeholder="e.g., Chyawanprash Awaleha, Curcumin Bioactive Capsule WS-04"
                  value={formulationName}
                  onChange={(e) => {
                    setFormulationName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  required={true}
                  requiredText="(required)"
                  error={validationError && !formulationName.trim() ? validationError : undefined}
                  helperText="Provide the commercial brand name or research formulation title."
                />
              </PanelContent>
            </Panel>

            {/* Question 1: Primary Intended Purpose / Regulatory Scope */}
            <Panel className="mb-4">
              <PanelHeader bordered>
                <PanelTitle>1. Primary Intended Purpose &amp; Regulatory Scope</PanelTitle>
                <PanelDescription>
                  Select the primary intended use and regulatory domain for the formulation (required).
                </PanelDescription>
              </PanelHeader>
              <PanelContent>
                <fieldset className="classification-options-stack" style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend className="sr-only">Primary Intended Purpose</legend>

                  {/* Option A: Therapeutic / Medicinal */}
                  <label
                    htmlFor="use-therapeutic"
                    className={`classification-option-card ${intendedUse === 'therapeutic' ? 'classification-option-card--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      id="use-therapeutic"
                      name="intendedUse"
                      value="therapeutic"
                      checked={intendedUse === 'therapeutic'}
                      onChange={() => setIntendedUse('therapeutic')}
                      className="classification-option-radio"
                    />
                    <div className="classification-option-content">
                      <div className="classification-option-header">
                        <span className="classification-option-title">
                          Therapeutic / Medicinal Treatment
                        </span>
                        <Badge variant="primary" size="sm">
                          Drugs &amp; Cosmetics Act
                        </Badge>
                      </div>
                      <p className="classification-option-desc">
                        Intended for diagnosis, treatment, mitigation, or prevention of human disease, physiological disorder, or clinical pathology.
                      </p>
                      <span className="classification-option-statutory">
                        Scope: Classical ASU Drugs, ASU Proprietary Medicines, Phytopharmaceuticals, New Drugs.
                      </span>
                    </div>
                  </label>

                  {/* Option B: Dietary / Food Wellness */}
                  <label
                    htmlFor="use-food"
                    className={`classification-option-card ${intendedUse === 'dietary_food' ? 'classification-option-card--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      id="use-food"
                      name="intendedUse"
                      value="dietary_food"
                      checked={intendedUse === 'dietary_food'}
                      onChange={() => setIntendedUse('dietary_food')}
                      className="classification-option-radio"
                    />
                    <div className="classification-option-content">
                      <div className="classification-option-header">
                        <span className="classification-option-title">
                          Dietary / Nutritional Wellness (Food)
                        </span>
                        <Badge variant="success" size="sm">
                          Ayurveda Aahar (FSSAI)
                        </Badge>
                      </div>
                      <p className="classification-option-desc">
                        Intended exclusively as daily nutritional food, dietary supplement, functional beverage, or herbal health nourishment without disease-curing claims.
                      </p>
                      <span className="classification-option-statutory">
                        Direct Classification: Ayurveda-Aahar / nutraceutical
                      </span>
                    </div>
                  </label>

                  {/* Option C: Topical Cleansing / Cosmetic */}
                  <label
                    htmlFor="use-cosmetic"
                    className={`classification-option-card ${intendedUse === 'cosmetic_topical' ? 'classification-option-card--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      id="use-cosmetic"
                      name="intendedUse"
                      value="cosmetic_topical"
                      checked={intendedUse === 'cosmetic_topical'}
                      onChange={() => setIntendedUse('cosmetic_topical')}
                      className="classification-option-radio"
                    />
                    <div className="classification-option-content">
                      <div className="classification-option-header">
                        <span className="classification-option-title">
                          Topical Cleansing / Beautifying (Cosmetic)
                        </span>
                        <Badge variant="neutral" size="sm">
                          Cosmetics Rules, 2020
                        </Badge>
                      </div>
                      <p className="classification-option-desc">
                        Intended exclusively for external topical application to skin, hair, teeth, or nails for cleansing, moisturizing, perfuming, or altering appearance.
                      </p>
                      <span className="classification-option-statutory">
                        Direct Classification: Cosmetic
                      </span>
                    </div>
                  </label>
                </fieldset>
              </PanelContent>
            </Panel>

            {/* Question 2: Nature of Active Ingredients and Processing (Only if Therapeutic) */}
            {intendedUse === 'therapeutic' && (
              <Panel className="mb-4">
                <PanelHeader bordered>
                  <PanelTitle>2. Nature of Active Ingredients &amp; Processing Method</PanelTitle>
                  <PanelDescription>
                    Specify how the formulation ingredients and extraction techniques are derived (required).
                  </PanelDescription>
                </PanelHeader>
                <PanelContent>
                  <fieldset className="classification-options-stack" style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend className="sr-only">Nature of Active Ingredients</legend>

                    {/* Option 2.1: Classical Treatise Recipe */}
                    <label
                      htmlFor="nature-classical"
                      className={`classification-option-card ${ingredientNature === 'classical_treatise' ? 'classification-option-card--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        id="nature-classical"
                        name="ingredientNature"
                        value="classical_treatise"
                        checked={ingredientNature === 'classical_treatise'}
                        onChange={() => setIngredientNature('classical_treatise')}
                        className="classification-option-radio"
                      />
                      <div className="classification-option-content">
                        <div className="classification-option-header">
                          <span className="classification-option-title">
                            Classical Treatise Recipe (Shastriya)
                          </span>
                          <Badge variant="primary" size="sm">
                            Sec 3(a)
                          </Badge>
                        </div>
                        <p className="classification-option-desc">
                          Strictly adheres to recipes and methods in authoritative First Schedule texts (e.g., Charaka Samhita, Sushruta Samhita, AFI) with traditional classical processing.
                        </p>
                        <span className="classification-option-statutory">
                          Target Category: Classical / generic medicine
                        </span>
                      </div>
                    </label>

                    {/* Option 2.2: Proprietary Modified Ratio */}
                    <label
                      htmlFor="nature-proprietary"
                      className={`classification-option-card ${ingredientNature === 'proprietary_modified' ? 'classification-option-card--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        id="nature-proprietary"
                        name="ingredientNature"
                        value="proprietary_modified"
                        checked={ingredientNature === 'proprietary_modified'}
                        onChange={() => setIngredientNature('proprietary_modified')}
                        className="classification-option-radio"
                      />
                      <div className="classification-option-content">
                        <div className="classification-option-header">
                          <span className="classification-option-title">
                            Proprietary Ratio / Modified Recipe (Anubhuta)
                          </span>
                          <Badge variant="gold" size="sm">
                            Sec 3(h)
                          </Badge>
                        </div>
                        <p className="classification-option-desc">
                          Contains ingredients recognized in First Schedule treatises, but formulated in novel combination ratios, modern dosage forms (tablets, capsules, syrups), or proprietary mixtures.
                        </p>
                        <span className="classification-option-statutory">
                          Target Category: Patent / proprietary medicine
                        </span>
                      </div>
                    </label>

                    {/* Option 2.3: Phytopharmaceutical Fraction */}
                    <label
                      htmlFor="nature-phytopharm"
                      className={`classification-option-card ${ingredientNature === 'phytopharmaceutical_fraction' ? 'classification-option-card--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        id="nature-phytopharm"
                        name="ingredientNature"
                        value="phytopharmaceutical_fraction"
                        checked={ingredientNature === 'phytopharmaceutical_fraction'}
                        onChange={() => setIngredientNature('phytopharmaceutical_fraction')}
                        className="classification-option-radio"
                      />
                      <div className="classification-option-content">
                        <div className="classification-option-header">
                          <span className="classification-option-title">
                            Purified Botanical Fraction (Standardized to ≥4 Bioactive Markers)
                          </span>
                          <Badge variant="neutral" size="sm">
                            G.S.R. 918(E)
                          </Badge>
                        </div>
                        <p className="classification-option-desc">
                          Purified and enriched extract fraction of medicinal plant origin standardized to a minimum of 4 verified bioactive or analytical markers via chromatography.
                        </p>
                        <span className="classification-option-statutory">
                          Target Category: Phytopharmaceutical
                        </span>
                      </div>
                    </label>

                    {/* Option 2.4: Novel / Synthetic Derivative */}
                    <label
                      htmlFor="nature-novel"
                      className={`classification-option-card ${ingredientNature === 'novel_chemical' ? 'classification-option-card--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        id="nature-novel"
                        name="ingredientNature"
                        value="novel_chemical"
                        checked={ingredientNature === 'novel_chemical'}
                        onChange={() => setIngredientNature('novel_chemical')}
                        className="classification-option-radio"
                      />
                      <div className="classification-option-content">
                        <div className="classification-option-header">
                          <span className="classification-option-title">
                            Novel / Modified Chemical Entity or Synthetic Analog
                          </span>
                          <Badge variant="warning" size="sm">
                            NDCT Rules 2019
                          </Badge>
                        </div>
                        <p className="classification-option-desc">
                          Active entity involves a chemically modified botanical compound, synthetic derivative, or novel entity not documented in ASU pharmacopoeias.
                        </p>
                        <span className="classification-option-statutory">
                          Target Category: New / non-classical drug
                        </span>
                      </div>
                    </label>
                  </fieldset>
                </PanelContent>
              </Panel>
            )}

            {/* Form Actions */}
            <div className="classification-actions-bar">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                iconLeft={<RefreshIcon size={14} />}
              >
                Clear Inputs
              </Button>
              <Button
                type="submit"
                variant="primary"
                id="btn-evaluate-classification"
                iconRight={<ArrowRightIcon size={16} />}
              >
                Classify Formulation
              </Button>
            </div>
          </form>
        )}

        {/* Classification Result View */}
        {!isLoading && viewState === 'result' && result && (
          <div className="classification-result-view" aria-label="Classification Result">
            {/* Required Prominent Non-Absolute Guidance Disclaimer */}
            <Notice
              variant="gold"
              title="Preliminary classification for guidance"
              className="mb-4"
            >
              This classification assessment is provided for preliminary intake guidance only and does not
              constitute an absolute or legally binding determination. Statutory categorization remains subject
              to review and formal approval by the appropriate licensing authority (State Licensing Authority,
              Central Drugs Standard Control Organization, or Food Safety and Standards Authority of India).
            </Notice>

            {/* Prominently Displayed Classification */}
            <section className="classification-result-banner" aria-label="Classified Category">
              <div className="classification-result-badge-row">
                <Badge variant={result.badgeVariant} size="sm">
                  Candidate Category
                </Badge>
                <Badge variant="neutral" size="sm">
                  {result.statutoryRef}
                </Badge>
              </div>

              <h2 className="classification-result-name" id="classification-result-title">
                Category: {result.category}
              </h2>

              <div className="classification-result-statute">
                Product Title: <strong>{result.formulationName}</strong>
              </div>

              <p className="classification-result-summary">
                {result.shortSummary}
              </p>
            </section>

            {/* Why this classification? Section */}
            <Panel className="mb-4">
              <PanelHeader bordered>
                <PanelTitle>Why this classification?</PanelTitle>
                <PanelDescription>
                  Statutory and compositional rationale supporting this regulatory categorization.
                </PanelDescription>
              </PanelHeader>
              <PanelContent>
                <ol className="classification-reasons-list">
                  {result.whyThisClassification.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ol>
              </PanelContent>
            </Panel>

            {/* Relevant next-step considerations Section */}
            <Panel className="mb-4">
              <PanelHeader bordered>
                <PanelTitle>Relevant next-step considerations</PanelTitle>
                <PanelDescription>
                  Key statutory, evidentiary, and patentability considerations for this category.
                </PanelDescription>
              </PanelHeader>
              <PanelContent>
                <dl className="classification-def-list">
                  <dt>1. Statutory Licensing Pathway</dt>
                  <dd id="next-step-licensing">
                    {result.nextStepConsiderations.licensingPathway}
                  </dd>

                  <dt>2. Safety &amp; Clinical Trial Evidence</dt>
                  <dd id="next-step-safety">
                    {result.nextStepConsiderations.safetyEvidence}
                  </dd>

                  <dt>3. Intellectual Property &amp; Patent Eligibility</dt>
                  <dd id="next-step-ip">
                    {result.nextStepConsiderations.ipImplication}
                  </dd>
                </dl>
              </PanelContent>
            </Panel>

            {/* Candidate Categories Reference Table (demonstrating all 6 categories clearly) */}
            <Panel className="mb-4">
              <PanelHeader bordered>
                <PanelTitle>Candidate Statutory Categories Reference</PanelTitle>
                <PanelDescription>
                  Comparative overview of all six recognized regulatory classes.
                </PanelDescription>
              </PanelHeader>
              <PanelContent style={{ padding: 0 }}>
                <div className="ui-table-container">
                  <table className="ui-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '40px' }}>#</th>
                        <th scope="col">Candidate Category</th>
                        <th scope="col">Statutory Authority</th>
                        <th scope="col">Primary Scope</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CANDIDATE_CATEGORIES.map((cat, idx) => {
                        const isMatch = cat.name === result.category;
                        return (
                          <tr
                            key={cat.id}
                            style={isMatch ? { backgroundColor: 'var(--color-primary-light)' } : undefined}
                          >
                            <td style={{ fontWeight: isMatch ? 700 : 400 }}>
                              {idx + 1}
                            </td>
                            <td style={{ fontWeight: isMatch ? 700 : 500, color: isMatch ? 'var(--color-primary)' : undefined }}>
                              {cat.name}
                              {isMatch && (
                                <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                                  (Current Match)
                                </span>
                              )}
                            </td>
                            <td style={{ fontSize: '13px' }}>{cat.statutoryRef}</td>
                            <td style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{cat.shortSummary}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </PanelContent>
            </Panel>

            {/* Navigation Actions: Back, Edit, Continue */}
            <div className="classification-actions-bar">
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  id="btn-edit-classification"
                  onClick={handleEdit}
                >
                  Edit Parameters
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  id="btn-back-intake"
                  onClick={handleReset}
                  iconLeft={<RefreshIcon size={14} />}
                >
                  New Intake
                </Button>
              </div>

              <Button
                type="button"
                variant="primary"
                id="btn-continue-to-question"
                onClick={handleContinueToQuestion}
                iconRight={<ArrowRightIcon size={16} />}
              >
                Continue to Consultation Question
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
