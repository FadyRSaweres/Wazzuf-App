import React, { useEffect, useRef } from "react";
import "./style.css";
interface IAutoProps<T> {
  show: boolean;
  options: T[];
  value?: T;
  onClick: (value: T) => void;
  itemClassName?: string;
  getOpLable: (op: T) => string;
  setShow: (st: boolean) => void;
  absoluteDivRef: React.RefObject<HTMLDivElement>
}

export default function AutocompleteMenue<T>({
  onClick,
  options,
  show,
  value,
  itemClassName,
  getOpLable,
  setShow,
  absoluteDivRef,
}: IAutoProps<T>) {

  return (
    <div
      ref={absoluteDivRef}
      className="auto-complete"
      style={show ? { visibility: "visible" } : { visibility: "hidden" }}
      onBlur={() => {
        setShow(false);
        console.log("dfnd");
      }}
    >
      {options.map((option, index) => (
        <button
          key={`${index + 1}`}
          className={itemClassName}
          onClick={() => onClick(option)}
        >
          {getOpLable(option)}
        </button>
      ))}
    </div>
  );
}
