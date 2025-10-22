'use client';

import { useState, useEffect } from 'react';
import GraphCard from './GraphCard';
import { TrackedSeries, fetchTrackedSeries } from '../utils/supabase';
import '../styles/graphgrid.css';

interface GraphGridProps {
  category: string;
}

export default function GraphGrid({ category }: GraphGridProps) {
  const [series, setSeries] = useState<TrackedSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchTrackedSeries(category);
        setSeries(data);
        
        if (data.length === 0) {
          setError(`No series found for category: ${category}`);
        }
      } catch (err) {
        console.error('Error loading series:', err);
        setError('Failed to load economic data');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadSeries();
    }
  }, [category]);

  if (loading) {
    return (
      <div className="graph-grid-loading">
        <div className="container">
          <div className="loading-message">
            <div className="loading-spinner-large"></div>
            <h3>Loading {category.toUpperCase()} Data...</h3>
            <p>Fetching latest economic indicators from FRED database</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="graph-grid-error">
        <div className="container">
          <div className="error-message">
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="album py-5 graph-grid-container">
      <div className="container">
        <div className="grid grid-cols-2 grid-cols-md-2 grid-cols-sm-2 g-4 graph-grid">
          {series.map((seriesItem) => (
            <GraphCard
              key={seriesItem.id}
              series={seriesItem}
            />
          ))}
        </div>
        
        {series.length === 0 && (
          <div className="no-data-message">
            <h4>No Data Available</h4>
            <p>No economic series found for the {category} category.</p>
          </div>
        )}
      </div>
    </div>
  );
}