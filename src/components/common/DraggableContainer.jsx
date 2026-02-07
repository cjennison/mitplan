import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DraggableContainer.module.css';

const DraggableContainer = ({
  storageKeyPosition,
  storageKeySize,
  defaultPosition = { x: 10, y: 10 },
  defaultSize = { width: 200, height: 100 },
  label = 'Drag',
  isLocked = false,
  tutorialHighlight = false,
  children,
}) => {
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch {
      // Storage unavailable or corrupted
    }
    return defaultValue;
  };

  const [position, setPosition] = useState(() =>
    loadFromStorage(storageKeyPosition, defaultPosition)
  );
  const [size, setSize] = useState(() => loadFromStorage(storageKeySize, defaultSize));

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  const savePosition = useCallback(
    (pos) => {
      try {
        localStorage.setItem(storageKeyPosition, JSON.stringify(pos));
      } catch {
        // Storage unavailable
      }
    },
    [storageKeyPosition]
  );

  const saveSize = useCallback(
    (sz) => {
      try {
        localStorage.setItem(storageKeySize, JSON.stringify(sz));
      } catch {
        // Storage unavailable
      }
    },
    [storageKeySize]
  );

  const handleDragStart = (e) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...position };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { ...size };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e) => {
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    if (isDragging.current) {
      setPosition({
        x: Math.max(0, initialPos.current.x + deltaX),
        y: Math.max(0, initialPos.current.y + deltaY),
      });
    } else if (isResizing.current) {
      setSize({
        width: Math.max(100, initialSize.current.width + deltaX),
        height: Math.max(40, initialSize.current.height + deltaY),
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      setPosition((pos) => {
        savePosition(pos);
        return pos;
      });
    }
    if (isResizing.current) {
      isResizing.current = false;
      setSize((sz) => {
        saveSize(sz);
        return sz;
      });
    }
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, savePosition, saveSize]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleContainerMouseDown = (e) => {
    if (!isLocked) e.stopPropagation();
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isLocked ? styles.locked : ''} ${tutorialHighlight ? styles.tutorialHighlight : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={handleContainerMouseDown}
    >
      <div
        className={`${styles.dragHandle} ${isLocked ? styles.handleHidden : ''}`}
        onMouseDown={handleDragStart}
        aria-hidden={isLocked}
      >
        <span className={styles.dragIcon}>⋮⋮</span>
        <span className={styles.dragLabel}>{label}</span>
      </div>

      <div className={styles.content}>{children}</div>

      <div
        className={`${styles.resizeHandle} ${isLocked ? styles.handleHidden : ''}`}
        onMouseDown={handleResizeStart}
        aria-hidden={isLocked}
      >
        <span className={styles.resizeIcon}>⌟</span>
      </div>
    </div>
  );
};

export default DraggableContainer;
