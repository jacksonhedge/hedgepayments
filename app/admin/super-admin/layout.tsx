import React from 'react';

// Custom layout for super-admin to bypass the admin sidebar
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
