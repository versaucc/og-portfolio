'use client';

import { useState, useEffect } from 'react';
import Graph from './Graph';
import { 
  TrackedSeries, 
  SeriesDataPoint, 
  TimeFrameOption,
  getTimeFrameOptions,
  fetchSeriesData 
} from '../utils/supabase';
import '../styles/graphcard.css';

interface GraphCardProps {
  series: TrackedSeries;
}

export default function GraphCard({ series }: GraphCardProps) {
  const [data, setData] = useState<SeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrameOptions] = useState<TimeFrameOption[]>(
    getTimeFrameOptions(series.frequency)
  );
  const [activeTimeFrame, setActiveTimeFrame] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const timeFrameMonths = timeFrameOptions[activeTimeFrame]?.months || 12;
        const seriesData = await fetchSeriesData(series.id, timeFrameMonths);
        setData(seriesData);
      } catch (error) {
        console.error(`Error loading data for ${series.id}:`, error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [series.id, activeTimeFrame, timeFrameOptions]);

  const handleTimeFrameChange = (index: number) => {
    if (index !== activeTimeFrame) {
      setActiveTimeFrame(index);
    }
  };

  return (
    <div className="col graph-card-column">
      <div className="card shadow-sm graph-card">
        <div className="graph-thumbnail-container">
          {loading ? (
            <div className="graph-loading-placeholder">
              <div className="loading-spinner"></div>
              <span>Loading {series.id}...</span>
            </div>
          ) : (
            <Graph
              data={data}
              title={series.title}
              units={series.units}
              className="card-graph"
            />
          )}
        </div>
        
        <div className="card-body graph-card-body">
          <div className="graph-card-header">
            <p className="card-text graph-card-title">
              {series.title}
            </p>
            <span className="graph-card-units">
              {series.units}
            </span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group time-frame-toggles">
              {timeFrameOptions.map((option, index) => (
                <button
                  key={option.label}
                  type="button"
                  className={`btn btn-sm ${
                    index === activeTimeFrame ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={() => handleTimeFrameChange(index)}
                  disabled={loading}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <small className="series-frequency">
              {series.frequency}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}