import type { SVGProps } from 'react';

export const PropoCraftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M11.5 16.5a2.5 2.5 0 0 1-3 0" />
    <path d="M14.5 16.5a2.5 2.5 0 0 1-3 0" />
    <path d="M13 13.5h.01" />
    <path d="M16 13.5h.01" />
    <path d="M10 13.5h.01" />
  </svg>
);
