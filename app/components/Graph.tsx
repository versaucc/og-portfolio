'use client';

import { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { SeriesDataPoint, formatDate, formatValue } from '../utils/supabase';
import '../styles/graph.css';

interface GraphProps {
  data: SeriesDataPoint[];
  title: string;
  units?: string;
  className?: string;
}

interface ChartDataPoint {
  date: string;
  value: number | null;
  units?: string;
  formattedDate: string;
}

interface TooltipPayload {
  value: number;
  payload: {
    units?: string;
  };
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="graph-tooltip">
        <p className="tooltip-date">{formatDate(label || '')}</p>
        <p className="tooltip-value">
          <span className="tooltip-label">Value: </span>
          <span className="tooltip-number">{formatValue(data.value, data.payload.units)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Graph({ data, units, className = '' }: GraphProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Transform data for Recharts
    const transformedData = data.map(point => ({
      date: point.date,
      value: point.value,
      units: units,
      formattedDate: formatDate(point.date),
    }));
    setChartData(transformedData);
  }, [data, units]);

  if (!chartData.length) {
    return (
      <div className={`graph-container graph-loading ${className}`}>
        <div className="graph-loading-text">Loading chart data...</div>
      </div>
    );
  }

  // Find min and max values for better Y-axis scaling
  const values = chartData.map(d => d.value).filter(v => v !== null);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1;
  const yAxisDomain = [
    Math.max(0, minValue - padding),
    maxValue + padding
  ];

  return (
    <div className={`graph-container ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#008080" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#008080" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="100%" stopColor="#008080" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888888', fontSize: 10 }}
            tickFormatter={(value, index) => {
              // Only show start, middle, and end dates
              const dataLength = chartData.length;
              if (index === 0) {
                // Start date
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              } else if (index === Math.floor(dataLength / 2)) {
                // Middle date
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              } else if (index === dataLength - 1) {
                // End date
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
              }
              return ''; // Hide all other dates
            }}
            interval={0}
            ticks={chartData.length > 0 ? [
              chartData[0]?.date, 
              chartData[Math.floor(chartData.length / 2)]?.date, 
              chartData[chartData.length - 1]?.date
            ].filter(Boolean) : []}
          />
          
          <YAxis
            domain={yAxisDomain}
            axisLine={false}
            tickLine={false}
            tick={false}
            label={{
              value: units || '',
              angle: -90,
              position: 'insideLeft',
              style: { 
                textAnchor: 'middle',
                fill: '#e4e4e4ff',
                fontSize: '10px',
                fontFamily: 'var(--font-ibm-plex-mono), monospace'
              }
            }}
            width={60}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            fill="url(#areaGradient)"
            dot={false}
            activeDot={{
              r: 4,
              fill: '#ffffff',
              stroke: '#008080',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}