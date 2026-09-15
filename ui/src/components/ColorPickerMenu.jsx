import { useState } from "react";
import { Palette, Rainbow, Check } from "lucide-react";
import {
  COLOR_PALETTE,
  isGradient,
  gradientSwatchBackground,
} from "./colorPalette";
import CustomGradientBuilder from "./CustomGradientBuilder";
import "./ColorPickerMenu.css";

function isCustomValue(value) {
  return value != null && value !== "" && !COLOR_PALETTE.some((c) => c.value === value);
}

export default function ColorPickerMenu({ value, onChange, title = "Mudar cor" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const custom = isCustomValue(value);

  const openMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = 248;
    const left = Math.min(
      Math.max(8, rect.left),
      window.innerWidth - width - 8
    );
    setPos({ top: rect.bottom + 8, left });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setPos(null);
  };

  const apply = (v) => {
    onChange(v);
  };

  return (
    <>
      <button
        type="button"
        className="cp-trigger"
        onClick={openMenu}
        title={title}
        style={{ background: gradientSwatchBackground(value) || (value && !isGradient(value) ? value : undefined) }}
        aria-label={title}
      >
        <Palette size={13} />
      </button>

      {open && (
        <>
          <div className="cp-backdrop" onClick={close} />
          <div className="cp-popover" style={{ top: pos?.top, left: pos?.left }}>
            <div className="cp-header">
              <Rainbow size={14} />
              <span>Cor da tarefa</span>
            </div>

            <div className="cp-swatches">
              {COLOR_PALETTE.map((c) => {
                const active = value === c.value;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`cp-swatch ${active ? "cp-swatch--active" : ""}`}
                    style={{ background: c.value }}
                    onClick={() => apply(c.value)}
                    title={c.label}
                  >
                    {active && <Check size={12} />}
                  </button>
                );
              })}
            </div>

            <div className={`cp-custom ${custom ? "cp-custom--active" : ""}`}>
              <button
                type="button"
                className="cp-custom-toggle"
                onClick={() => {
                  if (!custom) {
                    apply("#C4B5FD");
                  }
                }}
              >
                <span className="cp-custom-chip">
                  <span className="cp-custom-chip-a" />
                  <span className="cp-custom-chip-b" />
                </span>
                Personalizado
              </button>

              {custom && (
                <div className="cp-custom-body">
                  <CustomGradientBuilder value={value} onApply={apply} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}