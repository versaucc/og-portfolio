export default function TerminalView({ category }: { category: string }) {
  return (
    <div className="terminal-view-container">
      <div className="terminal-placeholder">
        <h3>Terminal View - Coming Soon</h3>
        <p>Terminal interface for {category} data will be implemented here.</p>
        <div className="terminal-mockup">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="btn-close"></span>
              <span className="btn-minimize"></span>
              <span className="btn-maximize"></span>
            </div>
            <span className="terminal-title">FRED Terminal - {category.toUpperCase()}</span>
          </div>
          <div className="terminal-body">
            <p>$ fred --category {category} --fetch latest</p>
            <p className="terminal-output">Initializing terminal interface...</p>
            <p className="terminal-cursor">█</p>
          </div>
        </div>
      </div>
    </div>
  );
}