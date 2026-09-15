import { useState } from "react";
import { extractGradientStops, buildGradient } from "./colorPalette";
import "./CustomGradientBuilder.css";

export default function CustomGradientBuilder({ value, onApply }) {
  const initial = extractGradientStops(value);
  const [cor1, setCor1] = useState(initial?.cor1 || "#C4B5FD");
  const [cor2, setCor2] = useState(initial?.cor2 || "#F9A8D4");

  const preview = buildGradient(cor1, cor2);

  return (
    <div className="gradient-builder">
      <div className="gradient-builder-preview" style={{ background: preview }} />
      <div className="gradient-builder-inputs">
        <div className="gradient-builder-field">
          <label>Cor 1</label>
          <input
            type="color"
            value={cor1}
            onChange={(e) => {
              setCor1(e.target.value);
              onApply(buildGradient(e.target.value, cor2));
            }}
          />
        </div>
        <div className="gradient-builder-field">
          <label>Cor 2</label>
          <input
            type="color"
            value={cor2}
            onChange={(e) => {
              setCor2(e.target.value);
              onApply(buildGradient(cor1, e.target.value));
            }}
          />
        </div>
      </div>
      <span className="gradient-builder-hint">Ajuste as duas cores do degradê</span>
    </div>
  );
}