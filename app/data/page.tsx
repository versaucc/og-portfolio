import Link from 'next/link';
import '../styles/datapage.css';

export default function DataPage() {
  const categories = [
    { name: 'GDP', route: '/data/gdp', description: 'Gross Domestic Product Indicators' },
    { name: 'EMPLOYMENT', route: '/data/employment', description: 'Employment & Labor Statistics' },
    { name: 'DEBT', route: '/data/debt', description: 'Debt & Credit Metrics' },
    { name: 'WAGES', route: '/data/income', description: 'Wages and Income of Individuals and Organizations' },
    { name: 'ENERGY', route: '/data/energy', description: 'Energy and Fuel metrics' },
    { name: 'INDEXES', route: '/data/indexes', description: 'Economic Indexes and Derived Indicators' },
    { name: 'LIQUIDITY', route: '/data/liquidity', description: 'Money Supply & Liquidity Metrics' },
    { name: 'FED', route: '/data/fed', description: 'Federal Reserve Rates & Policy' },
    { name: 'SEC', route: '/data/securities', description: 'Securities & Bond Market Data' },
    { name: 'EXCHANGES', route: '/data/exchanges', description: 'Exchange Rates & Currency' },
    { name: 'PRODUCTION', route: '/data/production', description: 'Manufacturing and Production of Goods' },
    { name: 'HOUSING', route: '/data/realestate', description: 'Residential Real Estate and Housing' },
  ];

  return (
    <div className="data-page-container">
      {/* Navigation Header */}
      <header className="graph-header" data-bs-theme="dark">
        <div className="navbar navbar-dark shadow-sm">
          <div className="container">
            <Link href="/" className="navbar-brand d-flex align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                aria-hidden="true"
                className="me-2"
                viewBox="0 0 24 24"
              >
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8L12 2L5.3 8"></path>
                <path d="M12 2v20"></path>
              </svg>
              <strong>Home</strong>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="data-content">
        <header className="data-header">
          <h1 className="data-title" style={{ fontWeight: 'bold' }}>Economic Datasets</h1>
          <p className="data-subtitle">Access real-time FRED economic indicators</p>
          
          {/* Terminal Navigation Section */}
          <div className="terminal-nav-section">
            <Link href="/data/terminal" className="terminal-link">
              view terminal
            </Link>
            <span className="nav-separator"> or explore graphs below</span>
          </div>
        </header>
        
        <main className="categories-grid">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={category.route}
              className="category-card"
            >
              <div className="category-card-content">
                <h2 className="category-name">{category.name}</h2>
                <p className="category-description">{category.description}</p>
                <div className="category-arrow">→</div>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}