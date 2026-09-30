import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from '../context/RouterContext';
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
  DataTable,
  Notice,
  EmptyState,
  SearchIcon,
  SourceDetailPanel,
  ArrowRightIcon,
} from '../components/common';
import { CONTROLLED_SOURCES, getSourceById } from '../data/sourcesRegistry';

/**
 * SourcesPage Component
 * Authoritative Statutory, Regulatory & Treaties Repository.
 * 
 * Strict compliance with government-portal design system:
 * - Tabular and definition list layout (no icon card grids, no pills, no drop shadows).
 * - Full support for verified source metadata: title, provision, authority, jurisdiction, version/date, excerpt, URL when provided.
 * - Deep-linkable via ?id=... query parameter with full browser back-button support.
 * - Seamless integration with Consultation Answer screen via ?from=assistant.
 */
export function SourcesPage() {
  const { searchParams } = useLocation();
  const navigate = useNavigate();

  const activeSourceId = searchParams.get('id');
  const fromAssistant = searchParams.get('from') === 'assistant';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('ALL');

  // Currently viewed source (from URL or state)
  const activeSource = useMemo(() => {
    if (!activeSourceId) return null;
    return getSourceById(activeSourceId) || null;
  }, [activeSourceId]);

  // Categories list for filter
  const categories = [
    { key: 'ALL', label: 'All Categories' },
    { key: 'PATENTS', label: 'Patents Act & Guidelines' },
    { key: 'TKDL', label: 'TKDL Repository' },
    { key: 'REGULATORY', label: 'Drugs & Cosmetics Rules' },
    { key: 'PHARMACOPOEIA', label: 'Pharmacopoeial Standards' },
    { key: 'INTERNATIONAL', label: 'International Treaties & PCT' },
  ];

  // Filtered source records
  const filteredSources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return CONTROLLED_SOURCES.filter((s) => {
      const matchCategory = selectedCategory === 'ALL' || s.categoryKey === selectedCategory;
      const matchJurisdiction =
        selectedJurisdiction === 'ALL' ||
        (selectedJurisdiction === 'India' && s.jurisdiction.includes('India')) ||
        (selectedJurisdiction === 'International' && s.jurisdiction.includes('International'));

      if (!matchCategory || !matchJurisdiction) return false;

      if (!q) return true;

      return (
        s.title.toLowerCase().includes(q) ||
        s.provision.toLowerCase().includes(q) ||
        s.authority.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        (s.excerpt && s.excerpt.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedCategory, selectedJurisdiction]);

  // Navigation handlers
  const handleSelectSource = (source) => {
    const query = new URLSearchParams();
    if (source) {
      query.set('id', source.id);
    }
    if (fromAssistant) {
      query.set('from', 'assistant');
    }
    navigate(`/sources?${query.toString()}`);
  };

  const handleBackToList = () => {
    if (fromAssistant) {
      navigate('/sources?from=assistant');
    } else {
      navigate('/sources');
    }
  };

  const handleReturnToConsultation = () => {
    navigate('/assistant');
  };

  // Table Column Definitions
  const tableHeaders = [
    { label: 'Reference Code', key: 'code' },
    { label: 'Statutory Act / Source Title', key: 'title' },
    { label: 'Provision', key: 'provision' },
    { label: 'Enacting Authority / Database', key: 'authority' },
    { label: 'Jurisdiction', key: 'jurisdiction' },
    { label: 'Action', key: 'action' },
  ];

  // Table Row Formatting
  const tableRows = filteredSources.map((source) => ({
    code: <code style={{ fontSize: '12px', fontFamily: 'var(--font-family-mono)' }}>{source.code}</code>,
    title: (
      <div>
        <button
          type="button"
          className="gov-citation-link-btn"
          onClick={() => handleSelectSource(source)}
          id={`view-source-link-${source.id}`}
        >
          {source.title}
        </button>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          {source.category}
        </div>
      </div>
    ),
    provision: <strong>{source.provision}</strong>,
    authority: source.authority,
    jurisdiction: (
      <Badge variant={source.jurisdiction.includes('International') ? 'info' : 'primary'} size="sm">
        {source.jurisdiction}
      </Badge>
    ),
    action: (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleSelectSource(source)}
        id={`btn-open-source-${source.id}`}
        iconRight={<ArrowRightIcon size={12} />}
      >
        View Detail
      </Button>
    ),
  }));

  return (
    <div style={{ padding: '24px 0 40px' }}>
      <Container size="xl">
        {/* Banner when navigated from consultation */}
        {fromAssistant && (
          <div style={{ marginBottom: '20px' }}>
            <Notice
              variant="primary"
              title="Consultation Reference View"
              className="mb-0"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span>
                  You are viewing official statutory citations referenced in your consultation assessment.
                </span>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleReturnToConsultation}
                  id="btn-return-to-assistant"
                >
                  &larr; Return to Consultation Assessment
                </Button>
              </div>
            </Notice>
          </div>
        )}

        {/* Page Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', margin: '0 0 8px', color: 'var(--color-primary)' }}>
            Statutory, Regulatory &amp; Prior Art Sources Library
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, maxWidth: '900px' }}>
            Authoritative legal library indexing statutory acts, administrative rules, traditional knowledge treatise databases,
            and international treaties that ground IP-SAKTI Sahayak consultations. All source metadata strictly corresponds to
            real, officially published legal gazettes and treatise registries.
          </p>
        </header>

        {/* VIEW 1: DEDICATED SOURCE DETAIL VIEW (When a source is selected via ?id=...) */}
        {activeSource ? (
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleBackToList}
                id="btn-back-to-sources-table"
              >
                &larr; Back to All Sources Table
              </Button>

              {fromAssistant && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleReturnToConsultation}
                >
                  &larr; Return to Consultation Assessment
                </Button>
              )}
            </div>

            <Panel>
              <PanelHeader bordered>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <PanelTitle>Official Source Record: {activeSource.title}</PanelTitle>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Badge variant="neutral" size="sm">
                      {activeSource.category}
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {activeSource.jurisdiction}
                    </Badge>
                  </div>
                </div>
                <PanelDescription>
                  Reference Code: <code>{activeSource.code}</code> • Verified Statutory Metadata
                </PanelDescription>
              </PanelHeader>

              <PanelContent style={{ padding: 0 }}>
                <SourceDetailPanel
                  source={activeSource}
                  mode="embedded"
                  allSources={CONTROLLED_SOURCES}
                  onSelectSource={handleSelectSource}
                />
              </PanelContent>
            </Panel>
          </div>
        ) : (
          /* VIEW 2: SEARCHABLE DATATABLE VIEW (Default) */
          <div>
            {/* Search and Filters Panel */}
            <Panel style={{ marginBottom: '20px' }}>
              <PanelContent>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
                  {/* Search Query */}
                  <div>
                    <Input
                      id="source-search-input"
                      label="Search Statutory Provisions, Treaties & Keywords"
                      placeholder="e.g., Section 3(p), TKDL, Rule 158B, Article 33..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      iconLeft={<SearchIcon size={16} />}
                      helperText="Filter by section number, enactment title, or legal keyword."
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="ui-form-group">
                    <label htmlFor="source-category-select" className="ui-label">
                      Statutory Category Filter
                    </label>
                    <select
                      id="source-category-select"
                      className="ui-input"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Jurisdiction Filter */}
                  <div className="ui-form-group">
                    <label htmlFor="source-jurisdiction-select" className="ui-label">
                      Jurisdiction
                    </label>
                    <select
                      id="source-jurisdiction-select"
                      className="ui-input"
                      value={selectedJurisdiction}
                      onChange={(e) => setSelectedJurisdiction(e.target.value)}
                    >
                      <option value="ALL">All Jurisdictions (India &amp; International)</option>
                      <option value="India">India (IPO / AYUSH / NBA / CDSCO)</option>
                      <option value="International">International (PCT / WIPO / EPO)</option>
                    </select>
                  </div>
                </div>

                {(searchTerm || selectedCategory !== 'ALL' || selectedJurisdiction !== 'ALL') && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      Showing {filteredSources.length} of {CONTROLLED_SOURCES.length} sources
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('ALL');
                        setSelectedJurisdiction('ALL');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </PanelContent>
            </Panel>

            {/* Statutory Sources DataTable */}
            {filteredSources.length > 0 ? (
              <Panel>
                <PanelHeader bordered>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PanelTitle>Cataloged Statutory &amp; Regulatory Authorities</PanelTitle>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      Total Sources: {filteredSources.length}
                    </span>
                  </div>
                  <PanelDescription>
                    Official provisions screening Ayurvedic intellectual property and regulatory compliance pathways
                  </PanelDescription>
                </PanelHeader>

                <PanelContent style={{ padding: 0 }}>
                  <DataTable
                    headers={tableHeaders}
                    rows={tableRows}
                    caption="Authoritative statutory acts and treaty monographs"
                  />
                </PanelContent>
              </Panel>
            ) : (
              <EmptyState
                icon={<SearchIcon size={24} />}
                title="No statutory authorities match your query"
                description={`No results found for "${searchTerm}". Try searching by statutory section number (e.g. "3(p)", "Rule 158B") or repository name.`}
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('ALL');
                      setSelectedJurisdiction('ALL');
                    }}
                  >
                    Reset Filter Parameters
                  </Button>
                }
              />
            )}

            {/* Institutional Compliance Notice */}
            <div style={{ marginTop: '24px' }}>
              <Notice
                variant="gold"
                title="Statutory Evidence Standard"
              >
                All sources cataloged in this repository represent published, binding statutory provisions or recognized
                multilateral treaties. IP-SAKTI Sahayak citations strictly reflect real legal authorities. No synthetic
                URLs or unverified provisions are presented.
              </Notice>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
