// React props for the HueRangePicker component
export interface HueRangePickerProps {
  hueRange: [number, number];
  satRange: [number, number];
  lumRange: [number, number];
  onHueChange: React.Dispatch<React.SetStateAction<[number, number]>>;
  onSatChange: React.Dispatch<React.SetStateAction<[number, number]>>;
  onLumChange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

export function HueRangePicker({
  hueRange,
  satRange,
  lumRange,
  onHueChange,
  onSatChange,
  onLumChange,
}: HueRangePickerProps) {
  const size = 180;
  const thickness = 25;
  const radius = (size - thickness) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const handleHueMouseDown = (
    e: React.MouseEvent<SVGCircleElement, MouseEvent>,
    isStart: boolean
  ) => {
    e.preventDefault();
    const svg = e.currentTarget?.closest("svg");
    if (svg == null) throw new Error("svg element not found");

    const rect = svg.getBoundingClientRect();

    const handleMouseMove = (moveEvent: {
      clientX: number;
      clientY: number;
    }) => {
      const x = moveEvent.clientX - rect.left - centerX;
      const y = moveEvent.clientY - rect.top - centerY;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = (angle + 90 + 360) % 360;

      if (isStart) {
        onHueChange([angle, hueRange[1]]);
      } else {
        onHueChange([hueRange[0], angle]);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    handleMouseMove(e);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getCoords = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  const start = getCoords(hueRange[0]);
  const end = getCoords(hueRange[1]);

  // Calculate average color
  let avgHue = (hueRange[0] + hueRange[1]) / 2;
  if (Math.abs(hueRange[1] - hueRange[0]) > 180) {
    avgHue = (avgHue + 180) % 360;
  }
  const avgSat = (satRange[0] + satRange[1]) / 2;
  const avgLum = (lumRange[0] + lumRange[1]) / 2;
  const avgColor = `hsl(${avgHue}, ${avgSat}%, ${avgLum}%)`;

  return (
    <div className="flex items-center gap-3">
      {/* Saturation Slider */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-stone-400">S</div>
        <div className="relative h-32 flex items-center gap-1">
          {/* Range indicator box */}
          <div
            className="absolute border border-amber-500 pointer-events-none"
            style={{
              left: "-4px",
              right: "-4px",
              top: `${(1 - satRange[1] / 100) * 100}%`,
              bottom: `${satRange[0]}%`,
            }}
          ></div>

          {/* Left handle for min value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: "absolute",
              left: "-4px",
              top: `${(1 - satRange[0] / 100) * 100}%`,
              transform: "translateY(-50%)",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              if (container == null) throw new Error("parentElement is null");

              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent: {
                clientX: number;
                clientY: number;
              }) => {
                const y = Math.max(
                  0,
                  Math.min(rect.height, moveEvent.clientY - rect.top)
                );
                const value = Math.round((1 - y / rect.height) * 100);
                onSatChange([Math.min(value, satRange[1]), satRange[1]]);
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              handleMove(e);
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          ></div>

          {/* Slider track */}
          <div className="relative w-6 h-full rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-500 to-white"></div>
          </div>

          {/* Right handle for max value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: "absolute",
              right: "-4px",
              top: `${(1 - satRange[1] / 100) * 100}%`,
              transform: "translateY(-50%)",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              if (container == null) throw new Error("parentElement is null");

              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent: {
                clientX: number;
                clientY: number;
              }) => {
                const y = Math.max(
                  0,
                  Math.min(rect.height, moveEvent.clientY - rect.top)
                );
                const value = Math.round((1 - y / rect.height) * 100);
                onSatChange([satRange[0], Math.max(value, satRange[0])]);
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              handleMove(e);
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          ></div>
        </div>
        <div className="text-xs text-stone-400 w-12 text-center">
          {satRange[0]}-{satRange[1]}
        </div>
      </div>

      {/* Hue Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Draw hue wheel as segments */}
          {Array.from({ length: 36 }).map((_, i) => {
            const startAngle = (i * 10 - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * 10 - 90) * (Math.PI / 180);
            const hue = i * 10;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={`hsl(${hue + 5}, 100%, 50%)`}
                strokeWidth={thickness}
              />
            );
          })}

          {/* Range arc between markers */}
          {(() => {
            const innerRadius = radius - thickness / 2 - 2;

            // Check if entire range is selected (0-360 or very close to it)
            const isFullRange =
              (hueRange[0] === 0 && hueRange[1] === 360) ||
              Math.abs(hueRange[1] - hueRange[0]) >= 359;

            if (isFullRange) {
              // Draw a complete circle when full range is selected
              return (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={innerRadius}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
              );
            } else {
              // Draw arc between the two markers
              const startAngle = (hueRange[0] - 90) * (Math.PI / 180);
              const endAngle = (hueRange[1] - 90) * (Math.PI / 180);

              const x1 = centerX + innerRadius * Math.cos(startAngle);
              const y1 = centerY + innerRadius * Math.sin(startAngle);
              const x2 = centerX + innerRadius * Math.cos(endAngle);
              const y2 = centerY + innerRadius * Math.sin(endAngle);

              const arcLength = (hueRange[1] - hueRange[0] + 360) % 360;
              const largeArc = arcLength > 180 ? 1 : 0;

              return (
                <path
                  d={`M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            }
          })()}

          {/* Start marker */}
          <circle
            cx={start.x}
            cy={start.y}
            r="6"
            fill="#fbbf24"
            stroke="#000"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseDown={(e) => handleHueMouseDown(e, true)}
          />

          {/* End marker */}
          <circle
            cx={end.x}
            cy={end.y}
            r="6"
            fill="#fbbf24"
            stroke="#000"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseDown={(e) => handleHueMouseDown(e, false)}
          />
        </svg>

        {/* Center circle showing average color */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-stone-700"
          style={{ backgroundColor: avgColor }}
        ></div>
      </div>

      {/* Luminosity Slider */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-stone-400">L</div>
        <div className="relative h-32 flex items-center gap-1">
          {/* Range indicator box */}
          <div
            className="absolute border border-amber-500 pointer-events-none"
            style={{
              left: "-4px",
              right: "-4px",
              top: `${(1 - lumRange[1] / 100) * 100}%`,
              bottom: `${lumRange[0]}%`,
            }}
          ></div>

          {/* Left handle for min value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: "absolute",
              left: "-4px",
              top: `${(1 - lumRange[0] / 100) * 100}%`,
              transform: "translateY(-50%)",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              if (container == null) throw new Error("parentElement is null");

              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent: {
                clientX: number;
                clientY: number;
              }) => {
                const y = Math.max(
                  0,
                  Math.min(rect.height, moveEvent.clientY - rect.top)
                );
                const value = Math.round((1 - y / rect.height) * 100);
                onLumChange([Math.min(value, lumRange[1]), lumRange[1]]);
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              handleMove(e);
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          ></div>

          {/* Slider track */}
          <div className="relative w-6 h-full rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-500 to-black"></div>
          </div>

          {/* Right handle for max value */}
          <div
            className="w-3 h-3 bg-amber-500 rounded-full cursor-ns-resize z-20 hover:bg-amber-400 transition-colors border-2 border-black"
            style={{
              position: "absolute",
              right: "-4px",
              top: `${(1 - lumRange[1] / 100) * 100}%`,
              transform: "translateY(-50%)",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const container = e.currentTarget.parentElement;
              if (container == null) throw new Error("parentElement is null");

              const rect = container.getBoundingClientRect();
              const handleMove = (moveEvent: {
                clientX: number;
                clientY: number;
              }) => {
                const y = Math.max(
                  0,
                  Math.min(rect.height, moveEvent.clientY - rect.top)
                );
                const value = Math.round((1 - y / rect.height) * 100);
                onLumChange([lumRange[0], Math.max(value, lumRange[0])]);
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              handleMove(e);
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          ></div>
        </div>
        <div className="text-xs text-stone-400 w-12 text-center">
          {lumRange[0]}-{lumRange[1]}
        </div>
      </div>
    </div>
  );
}
