"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h2 className="counter-title">Counter Example</h2>
      <div className="counter-controls">
        <button onClick={() => setCount(count - 1)} className="counter-button counter-button-minus">
          -
        </button>
        <span className="counter-value">{count}</span>
        <button onClick={() => setCount(count + 1)} className="counter-button counter-button-plus">
          +
        </button>
      </div>
      <button onClick={() => setCount(0)} className="counter-reset">
        Reset
      </button>
      <style jsx>{`
        .counter {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 20rem;
          margin: 0 auto;
        }

        .counter-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          text-align: center;
        }

        .counter-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .counter-button {
          padding: 0.5rem 1rem;
          color: white;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 1.125rem;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        .counter-button-minus {
          background-color: #ef4444;
        }

        .counter-button-minus:hover {
          background-color: #dc2626;
        }

        .counter-button-plus {
          background-color: #10b981;
        }

        .counter-button-plus:hover {
          background-color: #059669;
        }

        .counter-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          min-width: 3rem;
          text-align: center;
        }

        .counter-reset {
          padding: 0.5rem 1rem;
          background-color: #6b7280;
          color: white;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s;
        }

        .counter-reset:hover {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
}
