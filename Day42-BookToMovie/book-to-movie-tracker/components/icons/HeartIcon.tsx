
import React from 'react';

interface HeartIconProps extends React.SVGProps<SVGSVGElement> {}

const HeartIcon: React.FC<HeartIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-2.963-2.27c-.838-.836-1.623-1.748-2.323-2.654C4.225 14.12 3.65 12.863 3.65 11.48c0-1.87.53-3.483 1.42-4.789a6.706 6.706 0 014.28-2.43A6.707 6.707 0 0112 4.073a6.707 6.707 0 014.65-2.223 6.706 6.706 0 014.28 2.43 6.702 6.702 0 011.42 4.789c0 1.383-.575 2.64-1.325 3.79a15.18 15.18 0 01-2.963 2.27c-.473.43-.96.84-1.344.688l-.022.012-.007.003-.001.001a.752.752 0 01-.704 0l-.001-.001z" />
  </svg>
);

export default HeartIcon;
