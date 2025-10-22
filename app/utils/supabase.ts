import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our data
export interface TrackedSeries {
  id: string;
  last_updated: string;
  title: string;
  frequency: string;
  units: string;
  popularity: number;
  index_rank: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface SeriesDataPoint {
  id: number;
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: number | null;
  created_at: string;
}

export interface TimeFrameOption {
  label: string;
  months: number;
}

// Get time frame options based on frequency
export function getTimeFrameOptions(frequency: string): TimeFrameOption[] {
  const freq = frequency.toLowerCase();
  
  if (freq.includes('7-day')) {
    return [
      { label: '6M', months: 6 },
      { label: '2Y', months: 24 }
    ];
  } else if (freq.includes('weekly')) {
    return [
      { label: '6M', months: 6 },
      { label: '2Y', months: 24 }
    ];
  } else if (freq.includes('quarterly')) {
    return [
      { label: '2Y', months: 24 },
      { label: '10Y', months: 120 }
    ];
  } else if (freq.includes('daily')) {
    return [
      { label: '2M', months: 2 },
      { label: '1Y', months: 12 }
    ];
  } else {
    // Monthly or other
    return [
      { label: '2Y', months: 24 },
      { label: '5Y', months: 60 }
    ];
  }
}

// Fetch tracked series by category
export async function fetchTrackedSeries(category: string): Promise<TrackedSeries[]> {
  try {
    const { data, error } = await supabase
      .from('tracked_series')
      .select('*')
      .ilike('category', `%${category}%`)
      .order('popularity', { ascending: false });

    if (error) {
      console.error('Error fetching tracked series:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching tracked series:', error);
    return [];
  }
}

// Fetch series data points
export async function fetchSeriesData(
  seriesId: string, 
  timeFrameMonths: number = 120
): Promise<SeriesDataPoint[]> {
  try {
    const tableName = `series_${seriesId.toLowerCase()}`;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - timeFrameMonths);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .gte('date', cutoffDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error(`Error fetching series data for ${seriesId}:`, error);
      return [];
    }

    // Filter out null values and ensure proper data types
    return (data || [])
      .filter(point => point.value !== null && point.value !== undefined)
      .map(point => ({
        ...point,
        value: parseFloat(point.value)
      }));
  } catch (error) {
    console.error(`Error fetching series data for ${seriesId}:`, error);
    return [];
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format value for display
export function formatValue(value: number, units?: string): string {
  if (units?.toLowerCase().includes('percent')) {
    return `${value.toFixed(2)}%`;
  } else if (units?.toLowerCase().includes('dollar') || units?.toLowerCase().includes('billion')) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  } else {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }
}