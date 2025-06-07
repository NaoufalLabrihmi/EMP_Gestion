import React from 'react';
import EmployeeTable from '../components/EmployeeTable';
import { Routes, Route } from 'react-router-dom';
import EmployeeEdit from '../components/EmployeeEdit';

export default function Employees() {
  return (
    <Routes>
      <Route index element={
        <div className="flex flex-col flex-1 p-4 md:p-8">
          <EmployeeTable />
        </div>
      } />
      <Route path=":id/edit" element={<EmployeeEdit />} />
    </Routes>
  );
} 