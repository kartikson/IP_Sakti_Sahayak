import { Fragment } from 'react';
import { useConsultation } from '../../context/ConsultationContext';
import { useNavigate, useLocation } from '../../context/RouterContext';

export function WorkspaceChrome() {
  const {
    jurisdiction,
    setJurisdiction,
    currentStep,
    setCurrentStep,
    answerState,
  } = useConsultation();

  // Workflow steps: Classify → Ask → Analyze → Answer
  const steps = [
    { number: 1, label: 'Classify' },
    { number: 2, label: 'Ask' },
    { number: 3, label: 'Analyze' },
    { number: 4, label: 'Answer' },
  ];

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  const effectiveStep = normalizedPath === '/classification' ? 1 : currentStep;

  const handleStepClick = (stepNumber) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
      if (normalizedPath !== '/classification') {
        navigate('/classification');
      }
    } else if (stepNumber === 2) {
      setCurrentStep(2);
      if (normalizedPath !== '/assistant' && normalizedPath !== '/workspace') {
        navigate('/assistant');
      }
    } else if (stepNumber === 4 && answerState?.status === 'success') {
      setCurrentStep(4);
      if (normalizedPath !== '/assistant' && normalizedPath !== '/workspace') {
        navigate('/assistant');
      }
    }
  };

  return (
    <aside className="workspace-chrome" aria-label="Consultation Workspace Context and Jurisdiction">
      <div className="ui-container ui-container--xl">
        <div className="workspace-chrome__inner">
          {/* Left: Step Indicators (Classify → Ask → Analyze → Answer) */}
          <div className="workspace-chrome__left">
            <nav className="workspace-chrome__step-track" aria-label="Workflow Steps">
              {steps.map((step, idx) => {
                const isActive = step.number === effectiveStep;
                const isDone = step.number < effectiveStep || (step.number === 3 && effectiveStep === 4);
                const isClickable = step.number <= 2 || (step.number === 4 && answerState?.status === 'success');

                const stateClass = isActive
                  ? 'workspace-chrome__step--active'
                  : isDone
                  ? 'workspace-chrome__step--done'
                  : '';

                return (
                  <Fragment key={step.number}>
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.number)}
                      disabled={!isClickable && !isActive}
                      className={`workspace-chrome__step ${stateClass}`.trim()}
                      aria-current={isActive ? 'step' : undefined}
                      title={`Step ${step.number}: ${step.label}`}
                    >
                      <span className="workspace-chrome__step-number">
                        {isDone ? '✓' : step.number}
                      </span>
                      <span className="workspace-chrome__step-label">{step.label}</span>
                    </button>
                    {idx < steps.length - 1 && (
                      <span className="workspace-chrome__step-arrow" aria-hidden="true">
                        &gt;
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right: Persistent Jurisdiction Selector Chip & Session Reference */}
          <div className="workspace-chrome__right">
            <div
              className="gov-jurisdiction-group"
              role="group"
              aria-label="Select Legal Jurisdiction"
            >
              <span className="gov-jurisdiction-label">Jurisdiction:</span>
              <div className="gov-jurisdiction-chips">
                <button
                  type="button"
                  id="jurisdiction-chip-india"
                  className={`gov-jurisdiction-chip ${jurisdiction === 'India' ? 'gov-jurisdiction-chip--active' : ''}`}
                  onClick={() => setJurisdiction('India')}
                  aria-pressed={jurisdiction === 'India'}
                >
                  India
                </button>
                <button
                  type="button"
                  id="jurisdiction-chip-international"
                  className={`gov-jurisdiction-chip ${jurisdiction === 'International' ? 'gov-jurisdiction-chip--active' : ''}`}
                  onClick={() => setJurisdiction('International')}
                  aria-pressed={jurisdiction === 'International'}
                >
                  International
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </aside>
  );
}
