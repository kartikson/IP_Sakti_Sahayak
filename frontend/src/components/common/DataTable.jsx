export function DataTable({
  headers = [],
  rows = [],
  caption = '',
  className = '',
  ...props
}) {
  return (
    <div className={`ui-table-container ${className}`.trim()}>
      <table className="ui-table" {...props}>
        {caption && <caption className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col">
                {typeof h === 'object' ? h.label : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {Array.isArray(row)
                  ? row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)
                  : headers.map((h, cIdx) => {
                      const key = typeof h === 'object' ? h.key : h;
                      return <td key={cIdx}>{row[key]}</td>;
                    })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length || 1} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '16px' }}>
                No records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
