import React, { useEffect, useState } from "react";
import "./style.css";
interface SnackbarProps {
  message: string;
  show: boolean;
  duration?: number;
}
export default function SnakBar({ message, show, duration }: SnackbarProps) {
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);
  return (
    <div className={`snackbar ${isVisible ? "show" : "hide"}`}>{message}</div>
  );
}
