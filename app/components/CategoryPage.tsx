import { Suspense } from 'react';
import GraphGrid from './GraphGrid';
import '../styles/graphpage.css';

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
}

export default function CategoryPage({ category, title, description }: CategoryPageProps) {
  return (
    <div className="graph-page-container">
      {/* Header Section */}
      <header className="graph-header" data-bs-theme="dark">
        <div className="navbar navbar-dark shadow-sm">
          <div className="container">
            <a href="/data" className="navbar-brand d-flex align-items-center">
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
              <strong>Dashboard</strong>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">{title}</h1>
            <p className="hero-desc">{description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="graph-main">
        <Suspense fallback={<div className="loading-spinner">Loading economic data...</div>}>
          <div id="graph-view" className="view-content active">
            <GraphGrid category={category} />
          </div>
        </Suspense>
      </main>
    </div>
  );
}