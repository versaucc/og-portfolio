'use client';

import { useState } from 'react';

export default function ViewToggle() {
  const [activeView, setActiveView] = useState<'graph' | 'terminal'>('graph');

  const handleViewChange = (view: 'graph' | 'terminal') => {
    setActiveView(view);
    
    // Hide all view content
    const graphView = document.getElementById('graph-view');
    const terminalView = document.getElementById('terminal-view');
    
    if (graphView && terminalView) {
      graphView.classList.remove('active');
      terminalView.classList.remove('active');
      
      // Show selected view
      if (view === 'graph') {
        graphView.classList.add('active');
      } else {
        terminalView.classList.add('active');
      }
    }
  };

  return (
    <div className="view-toggle-container">
      <button
        className={`btn ${activeView === 'graph' ? 'btn-primary' : 'btn-secondary'} my-2`}
        onClick={() => handleViewChange('graph')}
      >
        Graph View
      </button>
      <button
        className={`btn ${activeView === 'terminal' ? 'btn-primary' : 'btn-secondary'} my-2 ms-2`}
        onClick={() => handleViewChange('terminal')}
      >
        Terminal View
      </button>
    </div>
  );
}