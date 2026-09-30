import { Link } from '../context/RouterContext';
import {
  Container,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  Button,
  DataTable,
  Notice,
} from '../components/common';

export function LandingPage() {
  const whoCanUseHeaders = ['User', 'What the assistant helps with'];
  const whoCanUseRows = [
    {
      User: 'Manufacturers and licensees',
      'What the assistant helps with':
        'Understanding regulatory pathways and documentation considerations for Ayurvedic preparations.',
    },
    {
      User: 'Researchers and innovators',
      'What the assistant helps with':
        'Screening formulation ideas against existing knowledge and evaluating novelty considerations.',
    },
    {
      User: 'Patent and IP professionals',
      'What the assistant helps with':
        'Preliminary prior art reference checking and preliminary assessment of traditional knowledge considerations.',
    },
  ];

  const howItWorksHeaders = ['Step', 'Phase', 'Description'];
  const howItWorksRows = [
    {
      Step: 'Step 1',
      Phase: 'Classify',
      Description: 'Identify the type and nature of the Ayurvedic formulation.',
    },
    {
      Step: 'Step 2',
      Phase: 'Ask',
      Description: 'Enter questions regarding patentability, prior art, or regulatory requirements.',
    },
    {
      Step: 'Step 3',
      Phase: 'Analyze',
      Description: 'The assistant cross-references source materials according to the selected jurisdiction.',
    },
    {
      Step: 'Step 4',
      Phase: 'Answer',
      Description: 'Receive structured guidance along with citations and a confidence rating.',
    },
  ];

  return (
    <div className="landing-page">
      {/* ====================================================================
          1. INTRO BAND (Full-width #F4F5F2, 2-column layout inside container)
          ==================================================================== */}
      <section className="portal-intro-band">
        <Container size="xl">
          <div className="portal-intro-grid">
            {/* Left Column (~60%) */}
            <div className="portal-intro-left">
              <h1>
                Source-Cited Guidance on Intellectual Property and Regulation in Ayurveda
              </h1>
              <p>
                This prototype helps users understand patent and regulatory considerations for Ayurvedic
                formulations, with each answer showing its sources and a confidence level. Users may explore
                guidance for domestic or international frameworks before seeking formal counsel.
              </p>
              <div className="portal-intro-actions">
                <Link to="/login">
                  <Button variant="primary" size="md">
                    Start Consultation
                  </Button>
                </Link>
                <Link to="/sources">
                  <Button variant="secondary" size="md">
                    View Sources
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column (~40%): Bordered Panel "At a glance" */}
            <div className="portal-intro-right">
              <Panel>
                <PanelHeader>
                  <PanelTitle>At a glance</PanelTitle>
                </PanelHeader>
                <PanelContent>
                  <dl className="portal-glance-list">
                    <div className="portal-glance-row">
                      <dt>Jurisdictions:</dt>
                      <dd>India, International</dd>
                    </div>
                    <div className="portal-glance-row">
                      <dt>Workflow:</dt>
                      <dd>Classify, Ask, Analyze, Answer</dd>
                    </div>
                    <div className="portal-glance-row">
                      <dt>Output:</dt>
                      <dd>Guidance, confidence level, citations</dd>
                    </div>
                    <div className="portal-glance-row">
                      <dt>Status:</dt>
                      <dd>Prototype, SIH 2026</dd>
                    </div>
                  </dl>
                </PanelContent>
              </Panel>
            </div>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          2. WHO CAN USE THIS SECTION
          ==================================================================== */}
      <section className="portal-section">
        <Container size="xl">
          <h2>Who can use this</h2>
          <p className="lead">
            The assistant provides preliminary decision support for individuals and organizations working with Ayurvedic formulations.
          </p>
          <DataTable
            headers={whoCanUseHeaders}
            rows={whoCanUseRows}
            caption="Overview of user groups and how the assistant supports them"
          />
        </Container>
      </section>

      {/* ====================================================================
          3. WHAT THE ASSISTANT PROVIDES SECTION
          ==================================================================== */}
      <section className="portal-section">
        <Container size="xl">
          <h2>What the assistant provides</h2>
          <ol className="portal-numbered-list">
            <li>
              <strong>Formulation classification:</strong> Preliminary identification of the regulatory category to help determine relevant rules.
            </li>
            <li>
              <strong>Jurisdiction awareness:</strong> Analysis aligned with Indian statutory requirements or relevant international frameworks.
            </li>
            <li>
              <strong>Source citations:</strong> Each response references the source materials used to formulate the guidance.
            </li>
            <li>
              <strong>Confidence and escalation:</strong> Indication of confidence (High, Medium, Low) for each answer, with an option to request expert review.
            </li>
          </ol>
        </Container>
      </section>

      {/* ====================================================================
          4. HOW IT WORKS SECTION
          ==================================================================== */}
      <section className="portal-section">
        <Container size="xl">
          <h2>How it works</h2>
          <DataTable
            headers={howItWorksHeaders}
            rows={howItWorksRows}
            caption="Step-by-step workflow of the consultation process"
          />
        </Container>
      </section>

      {/* ====================================================================
          5. NOTICE COMPONENT (Gold Left Border #B08D57)
          ==================================================================== */}
      <section style={{ padding: '16px 0' }}>
        <Container size="xl">
          <Notice variant="gold">
            This information is not legal advice. This is a prototype developed for Smart India Hackathon 2026
            and is not an official government service. Consult a registered patent agent or qualified professional
            before acting.
          </Notice>
        </Container>
      </section>

      {/* ====================================================================
          6. CLOSING BAND
          ==================================================================== */}
      <section style={{ padding: '8px 0 24px' }}>
        <Container size="xl">
          <div className="portal-closing-band">
            <span className="portal-closing-band__text">
              Begin a consultation
            </span>
            <div className="portal-closing-band__actions">
              <Link to="/login">
                <Button variant="primary" size="md">
                  Start Consultation
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="md">
                  Try as Guest
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
