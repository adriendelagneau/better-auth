"use client";

import millify from "millify";
import React from "react";

interface NumberOfViewsProps {
  numberOfViews: number;
  onVideoPlay: () => void;
};

const NumberOfViews = ({numberOfViews}: NumberOfViewsProps) => {




  return (
    <span className="font-medium">{millify(numberOfViews)} views</span>
  );
};

export default NumberOfViews;
