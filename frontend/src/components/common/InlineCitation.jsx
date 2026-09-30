/**
 * InlineCitation Component
 * Institutional clickable citation marker [1], [2], etc.
 * Adheres to government-portal design system: 1px border, 2px radius, no pills, no shadows.
 */
export function InlineCitation({
  index,
  source,
  onClick,
  className = '',
}) {
  const displayTitle = source?.title || source?.provision || `Statutory Reference ${index}`;
  const label = `Citation [${index}]: ${displayTitle}`;

  return (
    <button
      type="button"
      className={`gov-citation-marker ${className}`.trim()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(source, index);
      }}
      aria-label={label}
      title={label}
      id={`citation-marker-${index}`}
      data-citation-index={index}
    >
      <span className="gov-citation-marker__bracket">[</span>
      <span className="gov-citation-marker__number">{index}</span>
      <span className="gov-citation-marker__bracket">]</span>
    </button>
  );
}

/**
 * CitationText Component
 * Parses text containing [1], [2], [3] markers and renders them as interactive InlineCitation buttons.
 */
export function CitationText({
  text = '',
  citations = [],
  onSelectCitation,
  className = '',
}) {
  if (!text) return null;

  const parts = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const markerIndex = parseInt(match[1], 10);
    const beforeText = text.substring(lastIndex, match.index);
    if (beforeText) {
      parts.push(beforeText);
    }

    // Match with citations array by citationIndex, index, or array offset
    const matchedSource =
      citations.find(
        (c) =>
          c.citationIndex === markerIndex ||
          c.index === markerIndex ||
          c.marker === markerIndex
      ) || citations[markerIndex - 1];

    parts.push(
      <InlineCitation
        key={`cite-marker-${match.index}-${markerIndex}`}
        index={markerIndex}
        source={matchedSource}
        onClick={() => onSelectCitation?.(matchedSource || { citationIndex: markerIndex, index: markerIndex }, markerIndex)}
      />
    );

    lastIndex = regex.lastIndex;
  }

  const remaining = text.substring(lastIndex);
  if (remaining) {
    parts.push(remaining);
  }

  return <span className={className}>{parts}</span>;
}
