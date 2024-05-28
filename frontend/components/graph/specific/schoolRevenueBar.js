import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { getSchoolRevenueByTermAndYear } from 'lib/firebase/adminDashboard';

export default function SimpleBarChart() {
  // Initialize chartData with empty arrays for labels and data
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  const fetchAdminData = async () => {
    const schoolProgramRevenueData = await getSchoolRevenueByTermAndYear();
    const sortedLabelsData = Object.entries(schoolProgramRevenueData)
      // First, convert each label into a [term, year] pair for sorting
      .map(([label, revenue]) => {
        const [term, year] = label.match(/Term (\d) (\d{4})/).slice(1, 3);
        return { label, revenue, term: parseInt(term, 10), year: parseInt(year, 10) };
      })
      // Then, sort by year, then by term
      .sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.term - b.term;
      });
  
    // Extract the sorted labels and data
    const labels = sortedLabelsData.map(item => item.label);
    const data = sortedLabelsData.map(item => item.revenue);
  
    setChartData({ labels, data });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Render BarChart only if there is data
  return chartData.data.length > 0 ? (
    <BarChart
      width={500}
      height={300}
      series={[{ data: chartData.data, label: 'School Revenue', id: 'revenueId' }]}
      xAxis={[{ data: chartData.labels, scaleType: 'band' }]}
    />
  ) : (
    <div>Loading...</div>  // Or any other placeholder content
  );
}