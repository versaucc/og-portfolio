'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../../styles/terminal.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SeriesData {
  id: string;
  title: string;
  units: string;
  category: string;
  lastValue: number;
  lastDate: string;
  previousValue?: number;
  twoStepsBackValue?: number;
}

interface TrackedSeries {
  id: string;
  title: string;
  units: string;
  category: string;
}

export default function TerminalPage() {
  const [seriesData, setSeriesData] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{
    type: 'title' | 'units';
    content: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetchTerminalData();
  }, []);

  const fetchTerminalData = async () => {
    try {
      // Validate environment variables at runtime
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Supabase environment variables not found');
        setLoading(false);
        return;
      }

      // Get all tracked series with category distribution
      const { data: trackedSeries, error } = await supabase
        .from('tracked_series')
        .select('id, title, units, category')
        .order('popularity', { ascending: false });

      if (error) throw error;

      // Group by categories and take evenly distributed series (48 total)
      const categories = [...new Set(trackedSeries.map(s => s.category))];
      const seriesPerCategory = Math.floor(48 / categories.length);
      const selectedSeries: TrackedSeries[] = [];

      categories.forEach(category => {
        const categorySeries = trackedSeries
          .filter(s => s.category === category)
          .slice(0, seriesPerCategory);
        selectedSeries.push(...categorySeries);
      });

      // Pad to 48 if needed
      while (selectedSeries.length < 48) {
        const remaining = trackedSeries.filter(s => !selectedSeries.some(sel => sel.id === s.id));
        if (remaining.length === 0) break;
        selectedSeries.push(remaining[0]);
      }

      // Get latest data for each series
      const seriesWithData = await Promise.all(
        selectedSeries.slice(0, 48).map(async (series) => {
          try {
            const tableName = `series_${series.id.toLowerCase()}`;
            const { data: latestData, error: dataError } = await supabase
              .from(tableName)
              .select('date, value')
              .order('date', { ascending: false })
              .limit(3);

            if (dataError || !latestData || latestData.length === 0) {
              return {
                id: series.id,
                title: series.title,
                units: series.units,
                category: series.category,
                lastValue: 0,
                lastDate: 'N/A',
              };
            }

            return {
              id: series.id,
              title: series.title,
              units: series.units,
              category: series.category,
              lastValue: parseFloat(latestData[0].value) || 0,
              lastDate: latestData[0].date,
              previousValue: latestData[1] ? parseFloat(latestData[1].value) || 0 : undefined,
              twoStepsBackValue: latestData[2] ? parseFloat(latestData[2].value) || 0 : undefined,
            };
          } catch (err) {
            console.error(`Error fetching data for ${series.id}:`, err);
            return {
              id: series.id,
              title: series.title,
              units: series.units,
              category: series.category,
              lastValue: 0,
              lastDate: 'N/A',
            };
          }
        })
      );

      setSeriesData(seriesWithData);
    } catch (error) {
      console.error('Error fetching terminal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getValueColorClass = (series: SeriesData) => {
    if (!series.previousValue || !series.twoStepsBackValue) return '';
    
    const currentChange = series.lastValue - series.previousValue;
    const twoStepChange = series.lastValue - series.twoStepsBackValue;
    
    const isPositive = currentChange >= 0;
    const changeAmount = Math.abs(twoStepChange);
    
    // Determine opacity based on magnitude of change
    let opacityClass = '';
    if (changeAmount > Math.abs(series.lastValue) * 0.1) {
      opacityClass = 'high-opacity';
    } else if (changeAmount > Math.abs(series.lastValue) * 0.05) {
      opacityClass = 'medium-opacity';
    }
    
    return `${isPositive ? 'positive' : 'negative'} ${opacityClass}`.trim();
  };

  const handleCellHover = (
    e: React.MouseEvent,
    type: 'title' | 'units',
    content: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      type,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  const renderGrid = (startIndex: number) => {
    const gridData = seriesData.slice(startIndex, startIndex + 16);
    
    return (
      <div className="terminal-grid">
        {/* Header Row */}
        <div className="grid-row header">
          <div className="grid-cell">SERIES ID</div>
          <div className="grid-cell">DATE</div>
          <div className="grid-cell">VALUE</div>
        </div>
        
        {/* Data Rows */}
        {Array.from({ length: 16 }, (_, index) => {
          const series = gridData[index];
          
          if (!series) {
            return (
              <div key={`empty-${index}`} className="grid-row">
                <div className="grid-cell empty"></div>
                <div className="grid-cell empty"></div>
                <div className="grid-cell empty"></div>
              </div>
            );
          }
          
          return (
            <div key={series.id} className="grid-row">
              <div
                className="grid-cell series-id"
                onMouseEnter={(e) => handleCellHover(e, 'title', series.title)}
                onMouseLeave={handleCellLeave}
              >
                {series.id}
              </div>
              <div className="grid-cell date">
                {new Date(series.lastDate).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: '2-digit'
                })}
              </div>
              <div
                className={`grid-cell value ${getValueColorClass(series)}`}
                onMouseEnter={(e) => handleCellHover(e, 'units', series.units)}
                onMouseLeave={handleCellLeave}
              >
                {series.lastValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-title">FRED TERMINAL - LOADING...</div>
        </div>
        <div className="loading-grid">
          <div>Initializing terminal interface...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-container">
      {/* Navigation Header */}
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

      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-title">FRED ECONOMIC TERMINAL</div>
      </div>

      {/* Main Grids */}
      <div className="terminal-grids-container">
        {renderGrid(0)}
        {renderGrid(16)}
        {renderGrid(32)}
      </div>

      {/* Hover Tooltip */}
      {hoveredCell && (
        <div
          className="hover-tooltip visible"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 40,
            transform: 'translateX(-50%)'
          }}
        >
          {hoveredCell.content}
        </div>
      )}

      {/* Status Bar */}
      <div className="terminal-status">
        <div className="status-left">
          <span>FRED TERMINAL v2.0</span>
          <span>CONNECTED</span>
          <span>{seriesData.length} SERIES LOADED</span>
        </div>
        <div className="status-right">
          <span>LAST UPDATE: {new Date().toLocaleTimeString()}</span>
          <span>USD</span>
        </div>
      </div>
    </div>
  );
}