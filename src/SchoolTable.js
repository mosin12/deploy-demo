import React, { useEffect, useRef } from "react";
import ApexCharts from 'apexcharts';

const SchoolTable = ({ schoolCounts }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) {
    
      chartRef.current = new ApexCharts(document.querySelector("#chart"), getChartOptions());
      chartRef.current.render();
    } else {
      
      chartRef.current.updateOptions({
        series: [{
      
          data: [
            { x: 'Govt', y: schoolCounts.totalpmshriSschool, color: '#FE5233' },
            { x: 'KVS', y: schoolCounts.totalKVSschool, color: '#78356C' },
            { x: 'NVS', y: schoolCounts.totalnvsschool, color: '#392a96' }
          ],
          name:'school'
        }],
      });
    }
  }, [schoolCounts]);

  const getChartOptions = () => {
    return {
      chart: {
        type: 'bar',
        height: '260', 
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
      },
      series: [{
        data: [
          { x: 'Govt', y: schoolCounts.totalpmshriSschool, color: '#FE5233' },
          { x: 'KVS', y: schoolCounts.totalKVSschool, color: '#78356C' },
          { x: 'NVS', y: schoolCounts.totalnvsschool, color: '#392a96' }
        ]
      }],
      xaxis: {
        type: 'category',
      }
    };
  };
}

export default SchoolTable;
