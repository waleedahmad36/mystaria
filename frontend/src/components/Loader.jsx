import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="loading">
      <svg width="64px" height="48px">
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="back"
        ></polyline>
        <polyline
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
          id="front"
        ></polyline>
      </svg>
    </div>
    <style jsx>{`
      .loading {
        position: relative;
        width: 64px;
        height: 48px;
      }

      .loading svg {
        overflow: visible;
      }

      .loading svg polyline {
        fill: none;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .loading svg polyline#back {
        fill: none;
        stroke: #ff4d5033;
      }

      .loading svg polyline#front {
        fill: none;
        stroke: #0077b5; /* LinkedIn blue */
        stroke-dasharray: 48, 144;
        stroke-dashoffset: 192;
        animation: dash_682 1.4s linear infinite;
      }

      @keyframes dash_682 {
        0% {
          stroke-dashoffset: 192;
        }
        25% {
          stroke-dashoffset: 144;
        }
        50% {
          stroke-dashoffset: 96;
        }
        75% {
          stroke-dashoffset: 48;
        }
        100% {
          stroke-dashoffset: 0;
          opacity: 0; /* Makes the stroke disappear at the end of the animation */
        }
      }
    `}</style>
  </div>
);

export default Loader;
