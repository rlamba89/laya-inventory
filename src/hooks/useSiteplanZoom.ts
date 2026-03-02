"use client";

import { useState, useCallback, WheelEvent, useRef, MouseEvent, TouchEvent } from "react";

interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export function useSiteplanZoom() {
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const lastTouch = useRef<{ dist: number; x: number; y: number } | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => {
      const newScale = Math.min(4, Math.max(1, prev.scale - e.deltaY * 0.002));
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (zoom.scale <= 1) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX - zoom.x, y: e.clientY - zoom.y };
  }, [zoom.x, zoom.y, zoom.scale]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning.current) return;
    setZoom((prev) => ({
      ...prev,
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouch.current = {
        dist: Math.hypot(dx, dy),
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    } else if (e.touches.length === 1 && zoom.scale > 1) {
      isPanning.current = true;
      panStart.current = {
        x: e.touches[0].clientX - zoom.x,
        y: e.touches[0].clientY - zoom.y,
      };
    }
  }, [zoom.x, zoom.y, zoom.scale]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && lastTouch.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scaleDelta = dist / lastTouch.current.dist;
      setZoom((prev) => ({
        ...prev,
        scale: Math.min(4, Math.max(1, prev.scale * scaleDelta)),
      }));
      lastTouch.current.dist = dist;
    } else if (e.touches.length === 1 && isPanning.current) {
      setZoom((prev) => ({
        ...prev,
        x: e.touches[0].clientX - panStart.current.x,
        y: e.touches[0].clientY - panStart.current.y,
      }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isPanning.current = false;
    lastTouch.current = null;
  }, []);

  const reset = useCallback(() => {
    setZoom({ scale: 1, x: 0, y: 0 });
  }, []);

  return {
    zoom,
    reset,
    handlers: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    style: {
      transform: `scale(${zoom.scale}) translate(${zoom.x / zoom.scale}px, ${zoom.y / zoom.scale}px)`,
      cursor: zoom.scale > 1 ? "grab" : "default",
    },
  };
}
