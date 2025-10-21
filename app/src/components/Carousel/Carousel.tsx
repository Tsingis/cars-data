import React, { useEffect, useRef, useState } from "react";
import styles from "./Carousel.module.css";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  infinite?: boolean;
  dots?: boolean;
  arrows?: boolean;
  speed?: number;
  adaptiveHeight?: boolean;
  swipeToSlide?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  className = "",
  infinite = true,
  dots = true,
  arrows = false,
  speed = 500,
  adaptiveHeight = true,
  swipeToSlide = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideHeight] = useState<number | undefined>();
  const [dragging, setDragging] = useState(false);
  const [dragAmount, setDragAmount] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);
  const animationFrameId = useRef<number>(0);
  const windowPointerMoveRef = useRef<((e: PointerEvent) => void) | null>(null);
  const windowPointerUpRef = useRef<(() => void) | null>(null);
  const totalSlides = children.length;

  const childKeys =
    React.Children.map(children, (child, index) => {
      if (React.isValidElement(child) && child.key != null) {
        return String(child.key);
      }
      return `child-${index}`;
    }) || [];

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const isLast = prev === totalSlides - 1;
      if (isLast) {
        if (infinite) {
          return 0;
        }
        return prev;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const isFirst = prev === 0;
      if (isFirst) {
        if (infinite) {
          return totalSlides - 1;
        }
        return prev;
      }
      return prev - 1;
    });
  };

  const updateDragPosition = () => {
    if (
      !dragging ||
      dragCurrentX.current === null ||
      dragStartX.current === null
    )
      return;

    const deltaX = dragCurrentX.current - dragStartX.current;
    const containerWidth = carouselRef.current?.offsetWidth || 0;
    const normalizedDelta = (deltaX / containerWidth) * 100;

    setDragAmount(normalizedDelta);

    if (dragging) {
      animationFrameId.current =
        globalThis.requestAnimationFrame(updateDragPosition);
    }
  };

  const handleDragStart = (clientX: number) => {
    if (!swipeToSlide) return;
    setDragging(true);
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    setDragAmount(0);

    animationFrameId.current =
      globalThis.requestAnimationFrame(updateDragPosition);

    windowPointerMoveRef.current = (e: PointerEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }

      handleDragMove(e.clientX);
    };
    windowPointerUpRef.current = () => {
      handleDragEnd();
    };
    if (windowPointerMoveRef.current) {
      globalThis.addEventListener("pointermove", windowPointerMoveRef.current, {
        passive: false,
      });
    }
    if (windowPointerUpRef.current) {
      globalThis.addEventListener("pointerup", windowPointerUpRef.current);
    }
  };

  const handleDragEnd = () => {
    if (!swipeToSlide || !dragging) return;
    setDragging(false);
    if (animationFrameId.current) {
      globalThis.cancelAnimationFrame(animationFrameId.current);
    }
    const startX = dragStartX.current ?? 0;
    const endX = dragCurrentX.current ?? startX;
    const deltaX = endX - startX;
    const containerWidth = carouselRef.current?.offsetWidth || 1;
    const ratio = deltaX / containerWidth;
    const RATIO_THRESHOLD = 0.05;
    if (ratio > RATIO_THRESHOLD) {
      setCurrentIndex((prev) => {
        const isFirst = prev === 0;
        if (isFirst) {
          if (infinite) {
            return totalSlides - 1;
          }
          return prev;
        }
        return prev - 1;
      });
    } else if (ratio < -RATIO_THRESHOLD) {
      setCurrentIndex((prev) => {
        const isLast = prev === totalSlides - 1;
        if (isLast) {
          if (infinite) {
            return 0;
          }
          return prev;
        }
        return prev + 1;
      });
    }
    dragStartX.current = null;
    dragCurrentX.current = null;
    setDragAmount(0);
    if (windowPointerMoveRef.current) {
      globalThis.removeEventListener(
        "pointermove",
        windowPointerMoveRef.current
      );
      windowPointerMoveRef.current = null;
    }
    if (windowPointerUpRef.current) {
      globalThis.removeEventListener("pointerup", windowPointerUpRef.current);
      windowPointerUpRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        globalThis.cancelAnimationFrame(animationFrameId.current);
      }

      if (windowPointerMoveRef.current) {
        globalThis.removeEventListener(
          "pointermove",
          windowPointerMoveRef.current
        );
        windowPointerMoveRef.current = null;
      }
      if (windowPointerUpRef.current) {
        globalThis.removeEventListener("pointerup", windowPointerUpRef.current);
        windowPointerUpRef.current = null;
      }
    };
  }, []);

  const handleDragMove = (clientX: number) => {
    if (!swipeToSlide || !dragging) return;
    dragCurrentX.current = clientX;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    carouselRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
      return;
    }
    if (key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  return (
    <div
      data-testid="carousel"
      ref={carouselRef}
      className={`${styles.carousel} ${className} ${dragging ? styles.dragging : ""}`}
      tabIndex={0}
      aria-label="Carousel"
      onKeyDown={handleKeyDown}
      style={{
        height: adaptiveHeight && slideHeight ? `${slideHeight}px` : "auto",
      }}
      onPointerDown={handlePointerDown}
    >
      <div
        className={styles.track}
        style={{
          width: `${totalSlides * 100}%`,
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragAmount}%))`,
          transition: dragging ? "none" : `transform ${speed}ms ease-in-out`,
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            data-testid={`slide-${index}`}
            key={childKeys[index]}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}
            style={{ width: `${100 / totalSlides}%` }}
          >
            <div className={styles.slideInner}>{child}</div>
          </div>
        ))}
      </div>

      {arrows && (
        <>
          <button className={styles.prev} onClick={prevSlide}>
            ‹
          </button>
          <button className={styles.next} onClick={nextSlide}>
            ›
          </button>
        </>
      )}

      {dots && (
        <div data-testid="dots" className={styles.dots}>
          {children.map((_, index) => (
            <button
              data-testid="dot"
              key={childKeys[index]}
              onClick={() => {
                setCurrentIndex(index);
                setDragAmount(0);
                dragStartX.current = null;
                dragCurrentX.current = null;
                if (animationFrameId.current) {
                  globalThis.cancelAnimationFrame(animationFrameId.current);
                  animationFrameId.current = 0;
                }
              }}
              className={`${styles.dot} ${
                index === currentIndex ? styles.active : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
