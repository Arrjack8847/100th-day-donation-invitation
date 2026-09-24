"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";

type LayoutItem = {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  visible?: boolean;
};

type LayoutState = Record<string, LayoutItem>;

type HingeState = {
  left: number;
  right: number;
};

const STORAGE_KEY = "opening-layout-editor-v1";
const HINGE_STORAGE_KEY = "opening-hinge-editor-v1";
const DEFAULT_HINGES: HingeState = {
  left: 1.1,
  right: 72.6,
};

const DEFAULT_LAYOUT: LayoutState = {
  tray: {
    x: 3.40008544921875,
    y: 40.2000732421875,
    scale: 0.900711171738388,
    rotate: 0,
    visible: true,
  },
  card: { x: 0, y: 0, scale: 1, rotate: 0, visible: true },
  leftFlap: {
    x: 51.00022888183594,
    y: 37.800018310546875,
    scale: 0.895499233814601,
    rotate: 0,
    visible: true,
  },
  rightFlap: {
    x: 129.79998779296875,
    y: 26.60015869140625,
    scale: 0.9383710960391091,
    rotate: 0,
    visible: true,
  },
  button: {
    x: -0.79998779296875,
    y: 35.20001220703125,
    scale: 1,
    rotate: 0,
    visible: true,
  },
};

const LOCKED_POSITION_KEYS = new Set(["tray", "leftFlap", "rightFlap", "button"]);

const labels: Record<string, string> = {
  tray: "16 Inner Tray",
  card: "Invitation Card Group",
  leftFlap: "14 Left Flap",
  rightFlap: "15 Right Flap",
  button: "Open Button",
};

const keys = Object.keys(labels);

const normalise = (item?: LayoutItem, key?: string): Required<LayoutItem> => {
  const fallback = key ? DEFAULT_LAYOUT[key] : undefined;
  return {
    x: item?.x ?? fallback?.x ?? 0,
    y: item?.y ?? fallback?.y ?? 0,
    scale: item?.scale ?? fallback?.scale ?? 1,
    rotate: item?.rotate ?? fallback?.rotate ?? 0,
    visible: item?.visible ?? fallback?.visible ?? true,
  };
};

export default function LayoutEditor() {
  const [layout, setLayout] = useState<LayoutState>(DEFAULT_LAYOUT);
  const [ready, setReady] = useState(false);
  const layoutRef = useRef(layout);
  const [selected, setSelected] = useState("leftFlap");
  const [preview, setPreview] = useState<"closed" | "open">("closed");
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [copied, setCopied] = useState(false);
  const [hinges, setHinges] = useState<HingeState>(DEFAULT_HINGES);
  const [hingeGuide, setHingeGuide] = useState<DOMRect | null>(null);

  const current = useMemo(
    () => normalise(layout[selected], selected),
    [layout, selected]
  );
  const selectedPositionLocked = LOCKED_POSITION_KEYS.has(selected);
  const selectedHinge =
    selected === "leftFlap"
      ? hinges.left
      : selected === "rightFlap"
        ? hinges.right
        : null;

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const getElement = (key: string) =>
    document.querySelector<HTMLElement>(`[data-edit-key="${key}"]`);

  const refreshRect = () => {
    const el = getElement(selected);
    setRect(el?.getBoundingClientRect() ?? null);

    if (selected === "leftFlap" || selected === "rightFlap") {
      const image = el?.querySelector<HTMLElement>(".box-door-art");
      setHingeGuide(image?.getBoundingClientRect() ?? null);
    } else {
      setHingeGuide(null);
    }
  };

  const applyHinges = (next: HingeState) => {
    const stage = document.querySelector<HTMLElement>(".box-stage");
    if (!stage) return;
    stage.style.setProperty("--left-flap-hinge-x", `${next.left}%`);
    stage.style.setProperty("--right-flap-hinge-x", `${next.right}%`);
  };

  const applyPreview = (mode: "closed" | "open") => {
    const card = getElement("card");
    const baby = document.querySelector<HTMLElement>(".baby-mask");
    const frame = document.querySelector<HTMLElement>(".photo-frame");
    const typography = document.querySelector<HTMLElement>(".invitation-type");
    const left = document.querySelector<HTMLElement>(".box-left-flap .box-door-art");
    const right = document.querySelector<HTMLElement>(".box-right-flap .box-door-art");
    const button = getElement("button");

    if (mode === "closed") {
      if (card) {
        card.style.opacity = "0";
        card.style.visibility = "hidden";
      }
      for (const el of [baby, frame, typography]) {
        if (el) {
          el.style.opacity = "0";
          el.style.visibility = "hidden";
        }
      }
      if (left) left.style.transform = "rotateY(0deg)";
      if (right) right.style.transform = "rotateY(0deg)";
    } else {
      if (card) {
        card.style.opacity = "1";
        card.style.visibility = "visible";
      }
      for (const el of [baby, frame, typography]) {
        if (el) {
          el.style.opacity = "1";
          el.style.visibility = "visible";
        }
      }
      if (left) left.style.transform = "rotateY(-90deg)";
      if (right) right.style.transform = "rotateY(90deg)";
    }

    if (button) {
      button.style.opacity = "1";
      button.style.visibility = "visible";
    }

    requestAnimationFrame(refreshRect);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as LayoutState;
        setLayout({
          ...DEFAULT_LAYOUT,
          card: { ...DEFAULT_LAYOUT.card, ...parsed.card },
        });
      } else {
        setLayout(DEFAULT_LAYOUT);
      }

      const savedHinges = localStorage.getItem(HINGE_STORAGE_KEY);
      if (savedHinges) {
        const parsed = JSON.parse(savedHinges) as Partial<HingeState>;
        const next = {
          left: Number.isFinite(parsed.left) ? Number(parsed.left) : DEFAULT_HINGES.left,
          right: Number.isFinite(parsed.right) ? Number(parsed.right) : DEFAULT_HINGES.right,
        };
        setHinges(next);
        requestAnimationFrame(() => applyHinges(next));
      } else {
        requestAnimationFrame(() => applyHinges(DEFAULT_HINGES));
      }
    } catch {
      requestAnimationFrame(() => applyHinges(DEFAULT_HINGES));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      localStorage.setItem(HINGE_STORAGE_KEY, JSON.stringify(hinges));
    } catch {
      // localStorage may be unavailable in a locked-down browser.
    }

    applyHinges(hinges);

    for (const key of keys) {
      const el = getElement(key);
      if (!el) continue;

      const item = normalise(layout[key], key);
      el.style.setProperty("translate", `${item.x}px ${item.y}px`);
      el.style.setProperty("scale", String(item.scale));
      el.style.setProperty("rotate", `${item.rotate}deg`);

      if (!item.visible) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      } else if (
        preview === "open" ||
        key !== "card"
      ) {
        el.style.opacity = "1";
        el.style.visibility = "visible";
      }
    }

    applyPreview(preview);
  }, [layout, hinges, preview, ready]);

  useEffect(() => {
    refreshRect();

    const onResize = () => refreshRect();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selected]);

  useEffect(() => {
    const scene = document.querySelector<HTMLElement>(".opening-scene");
    if (!scene) return;

    const onPointerDown = (event: PointerEvent) => {
      const rawTarget = event.target as HTMLElement;
      if (rawTarget.closest(".layout-editor-panel") || rawTarget.closest(".layout-editor-selection")) {
        return;
      }

      const target = rawTarget.closest<HTMLElement>("[data-edit-key]");
      const key = target?.dataset.editKey;
      if (!target || !key) return;

      event.preventDefault();
      event.stopPropagation();
      setSelected(key);

      if (LOCKED_POSITION_KEYS.has(key)) return;

      const start = normalise(layoutRef.current[key], key);
      const startX = event.clientX;
      const startY = event.clientY;

      const onMove = (moveEvent: PointerEvent) => {
        setLayout((previous) => ({
          ...previous,
          [key]: {
            ...normalise(previous[key]),
            x: start.x + moveEvent.clientX - startX,
            y: start.y + moveEvent.clientY - startY,
          },
        }));
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    scene.addEventListener("pointerdown", onPointerDown, true);
    return () => scene.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;

      event.preventDefault();
      if (LOCKED_POSITION_KEYS.has(selected)) return;

      const amount = event.shiftKey ? 10 : 1;

      setLayout((previous) => {
        const item = normalise(previous[selected], selected);
        if (event.key === "ArrowLeft") item.x -= amount;
        if (event.key === "ArrowRight") item.x += amount;
        if (event.key === "ArrowUp") item.y -= amount;
        if (event.key === "ArrowDown") item.y += amount;
        return { ...previous, [selected]: item };
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  useEffect(() => {
    requestAnimationFrame(refreshRect);
  }, [layout, hinges, preview, selected]);

  const patch = (values: Partial<LayoutItem>) => {
    setLayout((previous) => {
      const nextValues =
        LOCKED_POSITION_KEYS.has(selected)
          ? { visible: values.visible }
          : values;

      return {
        ...previous,
        [selected]: {
          ...normalise(previous[selected], selected),
          ...nextValues,
        },
      };
    });
  };

  const resetSelected = () => {
    const el = getElement(selected);
    if (el) {
      el.style.removeProperty("translate");
      el.style.removeProperty("scale");
      el.style.removeProperty("rotate");
      el.style.removeProperty("opacity");
      el.style.removeProperty("visibility");
    }

    setLayout((previous) => ({
      ...previous,
      [selected]: { ...normalise(DEFAULT_LAYOUT[selected], selected) },
    }));

    requestAnimationFrame(() => applyPreview(preview));
  };

  const resetAll = () => {
    for (const key of keys) {
      const el = getElement(key);
      if (!el) continue;
      for (const prop of ["translate", "scale", "rotate", "opacity", "visibility"]) {
        el.style.removeProperty(prop);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HINGE_STORAGE_KEY);
    setLayout(DEFAULT_LAYOUT);
    setHinges(DEFAULT_HINGES);
    requestAnimationFrame(() => {
      applyHinges(DEFAULT_HINGES);
      applyPreview(preview);
    });
  };

  const copyLayout = async () => {
    const output = keys.reduce<Record<string, Required<LayoutItem>>>((acc, key) => {
      acc[key] = normalise(layout[key], key);
      return acc;
    }, {});

    const payload = {
      ...output,
      hinges: {
        left: hinges.left,
        right: hinges.right,
      },
    };

    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const startScale = current.scale;
    const startX = event.clientX;
    const baseWidth = Math.max(rect?.width ?? 200, 80);

    const onMove = (moveEvent: PointerEvent) => {
      const factor = 1 + (moveEvent.clientX - startX) / baseWidth;
      patch({ scale: Math.max(0.15, Math.min(4, startScale * factor)) });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      {preview === "closed" &&
        hingeGuide &&
        selectedHinge !== null && (
          <div
            className="layout-editor-hinge-guide"
            style={{
              left: hingeGuide.left + (hingeGuide.width * selectedHinge) / 100,
              top: hingeGuide.top,
              height: hingeGuide.height,
            }}
          >
            <span>{selected === "leftFlap" ? "Left hinge" : "Right hinge"}</span>
          </div>
        )}

      {rect && current.visible && (
        <div
          className="layout-editor-selection"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }}
        >
          <span>{labels[selected]}</span>
          {!selectedPositionLocked && (
            <button
              className="layout-editor-resize-handle"
              type="button"
              aria-label="Resize selected layer"
              onPointerDown={startResize}
            />
          )}
        </div>
      )}

      <aside className="layout-editor-panel" aria-label="Opening layout editor">
        <div className="layout-editor-title">
          <strong>Edit Mode</strong>
          <small>Drag layers directly</small>
        </div>

        <div className="layout-editor-preview">
          <button
            type="button"
            className={preview === "closed" ? "active" : ""}
            onClick={() => setPreview("closed")}
          >
            Closed
          </button>
          <button
            type="button"
            className={preview === "open" ? "active" : ""}
            onClick={() => setPreview("open")}
          >
            Open
          </button>
        </div>

        <label>
          Layer
          <select value={selected} onChange={(event) => setSelected(event.target.value)}>
            {keys.map((key) => (
              <option key={key} value={key}>
                {labels[key]}
              </option>
            ))}
          </select>
        </label>

        <div className="layout-editor-grid">
          <label>
            X
            <input
              type="number"
              value={Math.round(current.x)}
              disabled={selectedPositionLocked}
              onChange={(event) => patch({ x: Number(event.target.value) })}
            />
          </label>
          <label>
            Y
            <input
              type="number"
              value={Math.round(current.y)}
              disabled={selectedPositionLocked}
              onChange={(event) => patch({ y: Number(event.target.value) })}
            />
          </label>
          <label>
            Scale
            <input
              type="number"
              min="0.15"
              max="4"
              step="0.01"
              value={Number(current.scale.toFixed(2))}
              disabled={selectedPositionLocked}
              onChange={(event) => patch({ scale: Number(event.target.value) })}
            />
          </label>
          <label>
            Rotate
            <input
              type="number"
              step="1"
              value={Math.round(current.rotate)}
              disabled={selectedPositionLocked}
              onChange={(event) => patch({ rotate: Number(event.target.value) })}
            />
          </label>
        </div>

        <label className="layout-editor-range">
          Scale
          <input
            type="range"
            min="0.15"
            max="3"
            step="0.01"
            value={current.scale}
            onChange={(event) => patch({ scale: Number(event.target.value) })}
          />
        </label>

        {(selected === "leftFlap" || selected === "rightFlap") && (
          <div className="layout-editor-hinge-controls">
            <label>
              {selected === "leftFlap" ? "Left Hinge X (%)" : "Right Hinge X (%)"}
              <input
                type="number"
                min="-100"
                max="200"
                step="0.1"
                value={Number((selectedHinge ?? 0).toFixed(1))}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setHinges((previous) =>
                    selected === "leftFlap"
                      ? { ...previous, left: value }
                      : { ...previous, right: value }
                  );
                }}
              />
            </label>

            <label className="layout-editor-range">
              Hinge X
              <input
                type="range"
                min="-100"
                max="200"
                step="0.1"
                value={selectedHinge ?? 0}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setHinges((previous) =>
                    selected === "leftFlap"
                      ? { ...previous, left: value }
                      : { ...previous, right: value }
                  );
                }}
              />
            </label>

            <p className="layout-editor-hinge-hint">
              Move only the hinge line. Flap X, Y and scale stay exactly where you positioned them.
            </p>
          </div>
        )}

        {selectedPositionLocked && (
          <p className="layout-editor-hinge-hint">
            Position locked to the approved layout. X, Y, scale and rotation cannot be changed here.
          </p>
        )}

        <label className="layout-editor-visible">
          <input
            type="checkbox"
            checked={current.visible}
            onChange={(event) => patch({ visible: event.target.checked })}
          />
          Visible
        </label>

        <p className="layout-editor-hint">
          Drag to move · corner handle to resize · arrows = 1px · Shift + arrows = 10px
        </p>

        <div className="layout-editor-actions">
          <button type="button" onClick={resetSelected}>Reset layer</button>
          <button type="button" onClick={resetAll}>Reset all</button>
          <button type="button" className="primary" onClick={copyLayout}>
            {copied ? "Copied!" : "Copy Layout"}
          </button>
        </div>
      </aside>
    </>
  );
}
