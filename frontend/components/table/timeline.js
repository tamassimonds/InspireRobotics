import * as React from 'react';
import Table from '@mui/joy/Table';

export default function BasicTable({ data }) {
  // Function to set the cell color based on the value
  const setColorStyle = (value) => {
    switch (value) {
      case 2:
        return { backgroundColor: 'yellow' };
      case 1:
        return { backgroundColor: 'green' };
      case 0:
        return { backgroundColor: 'red' };
      default:
        return {};
    }
  };

  // Function to generate table headers for hours from 6 AM to 6 PM
  const generateTableHeaders = () => {
    const headers = [];
    for (let hour = 6; hour <= 18; hour++) {
      // No need to slice the hour to its first digit, use the full hour number
      const displayTime = hour <= 12 ? hour : hour - 12; 
      const suffix = hour < 12 ? 'AM' : 'PM';
      
      for (let segment = 0; segment < 6; segment++) {
        const key = `${hour}-${segment}`;
        if (segment === 0) {
          headers.push(<th key={key} colSpan="6">{`${displayTime} ${suffix}`}</th>); // Merge 6 columns for the first segment of the hour
        }
      }
    }
    return headers;
  };

  return (
    <Table aria-label="basic table">
      <thead>
        <tr>
          <th style={{ width: '15%' }}>Name</th> {/* Increased width */}
          {generateTableHeaders()}
        </tr>
      </thead>
      <tbody>
        {data && Object.entries(data).map(([employeeID, info]) => (
          <tr key={employeeID}>
            <td style={{ width: '20%' }}>{info.name}</td> {/* Increased width */}
            {info.array.map((value, index) => (
              <td key={index} style={setColorStyle(value)}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}