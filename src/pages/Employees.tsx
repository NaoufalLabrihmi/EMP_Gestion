import React from 'react';
import EmployeeTable from '../components/EmployeeTable';

export default function Employees() {
  return (
    <div className="flex flex-col flex-1 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Employee Management</h1>
      <EmployeeTable />
    </div>
  );
} 