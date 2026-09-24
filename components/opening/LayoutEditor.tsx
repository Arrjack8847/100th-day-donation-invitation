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

const STORAGE_KEY = "opening-layout-editor-v1";

const labels: Record<string, string> = {
  back: "13 Box Back",
  tray: "16 Inner Tray",
  card: "Invitation Card",
  baby: "Baby Mask",
  frame: "Photo Frame",
  typography: "Typography",
  leftFlap: "14 Left Flap",
  rightFlap: "15 Right Flap",
  button: "Open Button",
};

const keys = Object.keys(labels);

const normalise = (item?: LayoutItem): Required<LayoutItem> => ({
  x: item?.x ?? 0,
  y: item?.y ?? 0,
  scale: item?.scale ?? 1,
  rotate: item?.rotate ?? 0,
  visible: item?.visible ?? true,
});

export default function LayoutEditor() {
  const [layout, setLayout] = useState<LayoutState>({});
  const [ready, setReady] = useState(false);
  const layoutRef = useRef(layout);
  const [selected, setSelected] = useState("leftFlap");
  const [preview, setPreview] = useState<"closed" | "open">("closed");
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [copied, setCopied] = useState(false);

  const current = useMemo(() => normalise(layout[selected]), [layout, selected]);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const getElement = (key: string) =>
    document.querySelector<HTMLElement>(`[data-edit-key="${key}"]`);

  const refreshRect = () => {
    const el = getElement(selected);
    setRect(el?.getBoundingClientRect() ?? null);
  };

  const applyPreview = (mode: "closed" | "open") => {
    const card = getElement("card");
    const baby = getElement("baby");
    const frame = getElement("frame");
    const typography = getElement("typography");
    const left = getElement("leftFlap");
    const right = getElement("rightFlap");
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
      if (saved) setLayout(JSON.parse(saved));
    } catch {
      // Ignore malformed local editor data.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // localStorage may be unavailable in a locked-down browser.
    }

    for (const key of keys) {
      const el = getElement(key);
      if (!el) continue;

      const item = normalise(layout[key]);
      el.style.setProperty("translate", `${item.x}px ${item.y}px`);
      el.style.setProperty("scale", String(item.scale));
      el.style.setProperty("rotate", `${item.rotate}deg`);

      if (!item.visible) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      } else if (
        preview === "open" ||
        !["card", "baby", "frame", "typography"].includes(key)
      ) {
        el.style.opacity = "1";
        el.style.visibility = "visible";
      }
    }

    applyPreview(preview);
  }, [layout, preview, ready]);

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

      const start = normalise(layoutRef.current[key]);
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
      const amount = event.shiftKey ? 10 : 1;

      setLayout((previous) => {
        const item = normalise(previous[selected]);
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
  }, [layout, preview]);

  const patch = (values: Partial<LayoutItem>) => {
    setLayout((previous) => ({
      ...previous,
      [selected]: { ...normalise(previous[selected]), ...values },
    }));
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

    setLayout((previous) => {
      const next = { ...previous };
      delete next[selected];
      return next;
    });

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
    setLayout({});
    requestAnimationFrame(() => applyPreview(preview));
  };

  const copyLayout = async () => {
    const output = keys.reduce<Record<string, Required<LayoutItem>>>((acc, key) => {
      acc[key] = normalise(layout[key]);
      return acc;
    }, {});

    await navigator.clipboard.writeText(JSON.stringify(output, null, 2));
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
          <button
            className="layout-editor-resize-handle"
            type="button"
            aria-label="Resize selected layer"
            onPointerDown={startResize}
          />
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
              onChange={(event) => patch({ x: Number(event.target.value) })}
            />
          </label>
          <label>
            Y
            <input
              type="number"
              value={Math.round(current.y)}
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
              onChange={(event) => patch({ scale: Number(event.target.value) })}
            />
          </label>
          <label>
            Rotate
            <input
              type="number"
              step="1"
              value={Math.round(current.rotate)}
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
