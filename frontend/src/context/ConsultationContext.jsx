import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  analyzeConsultation,
  getControlledDemoFallback,
  validateQuestion,
  validateFormulation,
  FORMULATION_TYPES,
  EXAMPLE_QUESTIONS,
} from '../consultation/consultationService';

const JURISDICTION_STORAGE_KEY = 'ipsakti_consultation_jurisdiction';
const CONSULTATION_STORAGE_KEY = 'ipsakti_consultation_state';

const ConsultationContext = createContext(null);

function getInitialConsultation() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem(CONSULTATION_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

export function ConsultationProvider({ children }) {
  const initial = useMemo(() => getInitialConsultation(), []);

  // 1. Jurisdiction state (persists across pages and reloads in sessionStorage)
  const [jurisdiction, setJurisdictionState] = useState(() => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const saved = sessionStorage.getItem(JURISDICTION_STORAGE_KEY);
        if (saved === 'India' || saved === 'International') {
          return saved;
        }
      }
    } catch {
      // Ignore
    }
    return 'India';
  });

  // 2. Consultation workflow state initialized from stored session if present
  const [currentStep, setCurrentStep] = useState(() => (initial?.answerState?.data ? 4 : 2));
  const [formulationType, setFormulationType] = useState(() => initial?.formulationType || 'proprietary_asu');
  const [formulationContext, setFormulationContext] = useState(
    () => initial?.formulationContext || { title: '', botanicals: '', method: '' }
  );
  const [currentQuestion, setCurrentQuestion] = useState(() => initial?.currentQuestion || '');
  const [answerState, setAnswerState] = useState(
    () => (initial?.answerState?.data ? initial.answerState : { status: 'idle', error: null, data: null })
  );

  // Save consultation state to sessionStorage on updates
  useEffect(() => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(
          CONSULTATION_STORAGE_KEY,
          JSON.stringify({
            formulationType,
            formulationContext,
            currentQuestion,
            answerState: answerState.status === 'success' ? answerState : { status: 'idle', error: null, data: null },
          })
        );
      }
    } catch {
      // Ignore
    }
  }, [formulationType, formulationContext, currentQuestion, answerState]);

  // Persist jurisdiction changes
  const setJurisdiction = useCallback((newJurisdiction) => {
    if (newJurisdiction === 'India' || newJurisdiction === 'International') {
      setJurisdictionState(newJurisdiction);
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(JURISDICTION_STORAGE_KEY, newJurisdiction);
        }
      } catch {
        // Ignore
      }
    }
  }, []);

  // Set formulation context field
  const updateFormulationField = useCallback((field, value) => {
    setFormulationContext((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Pre-load an example question and formulation context
  const loadExample = useCallback((example) => {
    setFormulationType(example.formulationType || 'proprietary_asu');
    setFormulationContext({
      title: example.title || '',
      botanicals: example.botanicals || '',
      method: example.method || '',
    });
    setCurrentQuestion(example.question || '');
    setAnswerState({ status: 'idle', error: null, data: null });
    setCurrentStep(2); // Ask step
  }, []);

  // Reset entire consultation workspace
  const resetConsultation = useCallback(() => {
    setFormulationContext({
      title: '',
      botanicals: '',
      method: '',
    });
    setCurrentQuestion('');
    setAnswerState({ status: 'idle', error: null, data: null });
    setCurrentStep(2);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(CONSULTATION_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Execute Analysis
  const executeAnalysis = useCallback(
    async ({ triggerError = false, scenarioType = null, overrideParams = null, useFallback = false } = {}) => {
      const activeContext = overrideParams?.formulationContext || formulationContext;
      const activeQuestion = overrideParams?.currentQuestion || currentQuestion;
      const activeType = overrideParams?.formulationType || formulationType;

      // Validate inputs
      const formErr = validateFormulation(activeContext);
      if (formErr) {
        return { ok: false, error: formErr, field: 'formulation' };
      }

      const qErr = validateQuestion(activeQuestion);
      if (qErr) {
        return { ok: false, error: qErr, field: 'question' };
      }

      // Step 3: Analyze
      setCurrentStep(3);
      setAnswerState({ status: 'loading', error: null, data: null });

      try {
        const result = await analyzeConsultation({
          jurisdiction,
          formulationType: activeType,
          title: activeContext.title,
          botanicals: activeContext.botanicals,
          method: activeContext.method,
          question: activeQuestion,
          scenarioType,
          triggerError,
          useFallback,
        });

        // Step 4: Answer
        setAnswerState({ status: 'success', error: null, data: result });
        setCurrentStep(4);
        return { ok: true, data: result };
      } catch (err) {
        setAnswerState({
          status: 'error',
          error: err.message || 'An unexpected analysis error occurred. Please try again.',
          data: null,
        });
        setCurrentStep(2); // Return to Ask step with error displayed
        return { ok: false, error: err.message };
      }
    },
    [jurisdiction, formulationType, formulationContext, currentQuestion]
  );

  // Load Controlled Demo Fallback Response (Fail-safe for presentations)
  const loadDemoFallback = useCallback(
    (customContext = {}) => {
      const fallbackData = getControlledDemoFallback({
        jurisdiction,
        formulationType,
        title: customContext.title || formulationContext.title,
        botanicals: customContext.botanicals || formulationContext.botanicals,
        method: customContext.method || formulationContext.method,
        question: customContext.question || currentQuestion,
      });

      // If inputs were empty, pre-fill them from the fallback context for clarity
      if (!formulationContext.title) {
        setFormulationContext({
          title: fallbackData.formulationContext.title,
          botanicals: fallbackData.formulationContext.botanicals,
          method: fallbackData.formulationContext.method,
        });
      }
      if (!currentQuestion) {
        setCurrentQuestion(fallbackData.userQuestion);
      }

      setAnswerState({ status: 'success', error: null, data: fallbackData });
      setCurrentStep(4);
      return fallbackData;
    },
    [jurisdiction, formulationType, formulationContext, currentQuestion]
  );

  const value = useMemo(
    () => ({
      jurisdiction,
      setJurisdiction,
      currentStep,
      setCurrentStep,
      formulationType,
      setFormulationType,
      formulationContext,
      setFormulationContext,
      updateFormulationField,
      currentQuestion,
      setCurrentQuestion,
      answerState,
      setAnswerState,
      executeAnalysis,
      loadDemoFallback,
      resetConsultation,
      loadExample,
      formulationTypes: FORMULATION_TYPES,
      exampleQuestions: EXAMPLE_QUESTIONS,
    }),
    [
      jurisdiction,
      setJurisdiction,
      currentStep,
      formulationType,
      formulationContext,
      updateFormulationField,
      currentQuestion,
      answerState,
      executeAnalysis,
      loadDemoFallback,
      resetConsultation,
      loadExample,
    ]
  );

  return <ConsultationContext.Provider value={value}>{children}</ConsultationContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
}
