// components/Spinner.js
import React from "react";
import PropTypes from "prop-types";

const Spinner = ({ size = 50 }) => {
  return (
    <div className="p-8 w-full">
      <div className="flex items-center w-full space-x-4">
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-center">
            <div
              className="border-4 border-t-yellow-500 border-transparent rounded-full animate-spin"
              style={{ width: size, height: size }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.number,
};

export default Spinner;
