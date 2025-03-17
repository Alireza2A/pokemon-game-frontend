'use client';

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function BattleLog({ messages }) {
  const logRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold mb-3">Battle Log</h3>
      <div 
        ref={logRef}
        className="h-[200px] overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2"
      >
        {messages.map((message, index) => (
          <div 
            key={index}
            className="text-sm text-gray-700 animate-fade-in"
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

BattleLog.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired
}; 