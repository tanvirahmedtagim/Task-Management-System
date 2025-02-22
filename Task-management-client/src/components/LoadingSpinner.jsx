import React from "react";
import { BounceLoader } from "react-spinners";

const LoadingSpinner = ({ smallHeight }) => {
  return (
    <div
      className={` ${smallHeight ? "h-[250px]" : "h-[70vh]"}
      flex 
      flex-col 
      justify-center 
      items-center `}
    >
      <BounceLoader size={100} color="#0b7f68" />
    </div>
  );
};

export default LoadingSpinner;
