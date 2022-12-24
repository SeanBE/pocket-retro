import React, { useRef, useState, useEffect } from "react";

interface FormProps {
  submitValue: (val: string) => void;
}

export const Form = ({ submitValue }: FormProps) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [caretPosition, setCaretPosition]: [number, Function] = useState(0);
  const [value, setValue]: [string, Function] = useState("");
  const [visibility, setVisibility]: [string, Function] = useState("visible");

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
    const interval = setInterval(() => {
      setVisibility((v: string) => (v === "visible" ? "hidden" : "visible"));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyUp = (event: any) => {
    setCaretPosition(
      inputEl.current?.selectionStart ? inputEl.current.selectionStart : 0
    );
    event.key === "Enter" ? submitValue(value) : setValue(event.target.value);
  };

  const handleClick = () => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  };

  return (
    <React.Fragment>
      <div
        onClick={handleClick}
        style={{
          overflow: "hidden",
          padding: "5px",
          color: "orange",
          background: "black",
          width: "100%",
          height: "100%",
        }}
      >
        <div>
          I see this is your first visit. Type your Pocket consumer key and
          press Enter.
        </div>
        <div style={{ paddingLeft: "3px", whiteSpace: "pre", float: "left" }}>
          {value
            .slice(0, caretPosition)
            .split("")
            .map((v, i) => (
              <span style={{ float: "left" }} key={i}>
                {v}
              </span>
            ))}
          <span
            style={{
              float: "left",
              background: "orange",
              width: "5px",
              height: "1rem",
              visibility: visibility as any,
            }}
          />
          {value
            .slice(caretPosition)
            .split("")
            .map((v, i) => (
              <span style={{ float: "left" }} key={i}>
                {v}
              </span>
            ))}
        </div>
      </div>
      <input
        ref={inputEl}
        type="text"
        style={{ width: 0, height: 0, opacity: 0 }}
        onKeyUp={handleKeyUp}
      />
    </React.Fragment>
  );
};
