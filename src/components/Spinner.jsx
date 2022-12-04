import React from 'react'

function Spinner() {
  return (
    <div className="hero min-h-screen" role="status">
      <div
        className="
      spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
        text-purple-500
      "
        role="status"
      >
        <span className="n"></span>
      </div>
    </div>
  );
}

export default Spinner