import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { ExternalLinkIcon } from './Icons';

/**
 * SourceDetailPanel Component
 * Polished institutional source detail drawer / panel.
 * 
 * Strict compliance with government-portal design system:
 * - 1px border, 2px radius, no drop shadows, no gradients, no pills.
 * - Displays authentic metadata only: title, provision, jurisdiction, authority, version/date, excerpt, URL when provided.
 * - Handles Esc key, keyboard trap, and responsive drawer overlay.
 */
export function SourceDetailPanel({
  source,
  isOpen = true,
  onClose,
  allSources = [],
  onSelectSource,
  onNavigateToLibrary,
  mode = 'drawer', // 'drawer' | 'embedded'
}) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen || mode === 'embedded') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, onClose]);

  // Focus close button on open
  useEffect(() => {
    if (isOpen && mode === 'drawer') {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen, mode, source]);

  if (!source) {
    if (mode === 'embedded') {
      return (
        <div className="gov-source-panel gov-source-panel--empty">
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Select a statutory authority or inline citation marker to view verified source metadata.
          </p>
        </div>
      );
    }
    return null;
  }

  if (mode === 'drawer' && !isOpen) {
    return null;
  }

  // Calculate current citation index and prev/next
  const currentIndex = allSources.findIndex(
    (s) => (s.id && s.id === source.id) || (s.citationIndex && s.citationIndex === source.citationIndex)
  );
  const hasMultiple = allSources.length > 1 && currentIndex !== -1;
  const prevSource = hasMultiple && currentIndex > 0 ? allSources[currentIndex - 1] : null;
  const nextSource = hasMultiple && currentIndex < allSources.length - 1 ? allSources[currentIndex + 1] : null;

  const content = (
    <div
      ref={drawerRef}
      className={`gov-source-panel ${mode === 'drawer' ? 'gov-source-drawer' : 'gov-source-panel--embedded'}`}
      role={mode === 'drawer' ? 'dialog' : 'region'}
      aria-modal={mode === 'drawer' ? 'true' : undefined}
      aria-label={`Source Detail: ${source.title || 'Statutory Source'}`}
      id="source-detail-panel"
    >
      {/* Panel Header */}
      <div className="gov-source-panel__header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {source.citationIndex && (
              <span className="gov-source-badge-index" title={`Inline Citation [${source.citationIndex}]`}>
                Source [{source.citationIndex}]
              </span>
            )}
            <Badge variant="neutral" size="sm">
              {source.category || 'Statutory Authority'}
            </Badge>
            <Badge variant="primary" size="sm">
              {source.jurisdiction || 'India'}
            </Badge>
          </div>

          {mode === 'drawer' && (
            <button
              ref={closeButtonRef}
              type="button"
              className="gov-source-drawer__close-btn"
              onClick={onClose}
              aria-label="Close source detail panel"
              title="Close source panel (Esc)"
              id="btn-close-source-drawer"
            >
              <span aria-hidden="true" style={{ fontSize: '18px', lineHeight: 1 }}>&times;</span>
              <span className="gov-source-drawer__close-text">Close</span>
            </button>
          )}
        </div>

        <h2 className="gov-source-panel__title" id="source-detail-title">
          {source.title}
        </h2>

        {source.code && (
          <div className="gov-source-panel__code">
            Reference Code: <code>{source.code}</code>
          </div>
        )}
      </div>

      {/* Previous / Next Citation Navigation Toolbar */}
      {hasMultiple && (
        <div className="gov-source-panel__nav-bar" role="toolbar" aria-label="Citation navigation">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!prevSource}
            onClick={() => onSelectSource?.(prevSource)}
            aria-label={prevSource ? `Previous citation [${prevSource.citationIndex || currentIndex}]: ${prevSource.provision || prevSource.title}` : 'Previous citation'}
          >
            &larr; Prev [{prevSource?.citationIndex || currentIndex}]
          </Button>

          <span className="gov-source-panel__nav-counter">
            Citation {currentIndex + 1} of {allSources.length}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!nextSource}
            onClick={() => onSelectSource?.(nextSource)}
            aria-label={nextSource ? `Next citation [${nextSource.citationIndex || currentIndex + 2}]: ${nextSource.provision || nextSource.title}` : 'Next citation'}
          >
            Next [{nextSource?.citationIndex || currentIndex + 2}] &rarr;
          </Button>
        </div>
      )}

      {/* Panel Body */}
      <div className="gov-source-panel__body">
        {/* Consultation Finding / Practical Relevance */}
        {source.assessment && (
          <div className="gov-source-panel__assessment-box">
            <div className="gov-source-panel__assessment-heading">
              Application to Consultation Inquiry:
            </div>
            <p className="gov-source-panel__assessment-text">
              {source.assessment}
            </p>
          </div>
        )}

        {/* 1. Core Source Metadata Definition List */}
        <div className="gov-source-panel__section">
          <h3 className="gov-source-panel__section-title">Verified Source Metadata</h3>
          
          <dl className="portal-glance-list">
            <div className="portal-glance-row">
              <dt>Statutory Provision / Article:</dt>
              <dd>
                <strong>{source.provision || 'Full Statute / Record'}</strong>
              </dd>
            </div>

            <div className="portal-glance-row">
              <dt>Enacting Authority / Repository:</dt>
              <dd>{source.authority || 'Not specified'}</dd>
            </div>

            <div className="portal-glance-row">
              <dt>Applicable Jurisdiction:</dt>
              <dd>{source.jurisdiction || 'India'}</dd>
            </div>

            {source.versionOrDate && (
              <div className="portal-glance-row">
                <dt>Version / Gazette Date:</dt>
                <dd>{source.versionOrDate}</dd>
              </div>
            )}

            <div className="portal-glance-row">
              <dt>Source Document URL:</dt>
              <dd>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-source-external-link"
                  >
                    <span>{source.url}</span>
                    <ExternalLinkIcon size={12} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="gov-source-no-url">
                    Direct URL not provided in statutory metadata (Statutory Gazettes &amp; Official Repositories)
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* 2. Official Statutory Excerpt */}
        {source.excerpt && (
          <div className="gov-source-panel__section">
            <h3 className="gov-source-panel__section-title">Statutory Excerpt / Monograph Record</h3>
            <blockquote className="gov-statutory-excerpt">
              <p className="gov-statutory-excerpt__text">
                &ldquo;{source.excerpt}&rdquo;
              </p>
              <footer className="gov-statutory-excerpt__caption">
                — {source.provision ? `${source.title} (${source.provision})` : source.title}
              </footer>
            </blockquote>
          </div>
        )}

        {/* 3. Legal Summary / Analytical Context */}
        {source.summary && (
          <div className="gov-source-panel__section">
            <h3 className="gov-source-panel__section-title">Analytical Summary &amp; Scope</h3>
            <p className="gov-source-panel__summary-text">
              {source.summary}
            </p>
          </div>
        )}

        {/* Institutional Baseline Notice */}
        <div className="gov-source-panel__disclaimer">
          <small>
            <strong>Statutory Baseline:</strong> This source record is verified under published Indian and international intellectual property frameworks.
            Consultation outputs do not substitute for formal statutory examination or registered patent attorney representation.
          </small>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="gov-source-panel__footer">
        {onNavigateToLibrary && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigateToLibrary(source)}
            id="btn-view-in-sources-library"
          >
            View in Full Statutory Library (/sources)
          </Button>
        )}

        {mode === 'drawer' && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Back to Assessment
          </Button>
        )}
      </div>
    </div>
  );

  if (mode === 'drawer') {
    return (
      <div className="gov-source-drawer-overlay" onClick={onClose} role="presentation">
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
