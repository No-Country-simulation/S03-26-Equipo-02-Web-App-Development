import React, { useState } from 'react';

const MessagesChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(2); // Default 19 Mar

  const data = [
    { day: '17 Mar', value: 42 },
    { day: '18 Mar', value: 38 },
    { day: '19 Mar', value: 55 },
    { day: '20 Mar', value: 48 },
    { day: '21 Mar', value: 62 },
    { day: '22 Mar', value: 72 },
    { day: '23 Mar', value: 58 },
  ];

  const width = 600;
  const height = 280;
  const padding = 40;

  const xScale = (index: number) => padding + (index * (width - 2 * padding)) / (data.length - 1);
  const yScale = (value: number) => height - padding - (value * (height - 2 * padding)) / 80;

  const curvePath = data.reduce((path, d, i) => {
    if (i === 0) return `M ${xScale(i)},${yScale(d.value)}`;
    const prev = data[i - 1];
    const dx = (xScale(i) - xScale(i - 1)) * 0.4;
    return `${path} C ${xScale(i - 1) + dx},${yScale(prev.value)} ${xScale(i) - dx},${yScale(d.value)} ${xScale(i)},${yScale(d.value)}`;
  }, "");

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;

    let closestIndex = 0;
    let minDistance = Infinity;

    data.forEach((_, i) => {
      const distance = Math.abs(x - xScale(i));
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    setHoveredIndex(closestIndex);
  };

  return (
    <div className="bg-white/85 backdrop-blur-[16px] border border-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.12)] rounded-2xl p-8 relative min-h-[440px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[1.2rem] font-semibold text-gray-900">Mensajes en el Tiempo</h2>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-[0.85rem] text-gray-500">Mensajes</span>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div className="relative h-[300px] mt-6 pl-10 pb-[30px]">
        {/* Y-Axis */}
        <div className="absolute left-0 top-0 bottom-[30px] w-10 flex flex-col justify-between pointer-events-none">
          {[80, 60, 40, 20, 0].map(v => (
            <div
              key={v}
              className="absolute right-2.5 text-[0.75rem] text-gray-400 -translate-y-1/2"
              style={{ top: `${(yScale(v) / height) * 100}%` }}
            >
              {v}
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute left-10 right-0 top-0 bottom-[30px] pointer-events-none">
          {[80, 60, 40, 20, 0].map(v => (
            <div
              key={v}
              className="absolute left-0 right-0 h-px bg-black/[0.04] border-t border-dashed border-black/[0.02]"
              style={{ top: `${(yScale(v) / height) * 100}%` }}
            ></div>
          ))}
        </div>

        {/* SVG + Points + Tooltip */}
        <div className="relative w-full h-full">
          <svg
            width="100%" height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(2)}
            style={{ cursor: 'crosshair', pointerEvents: 'all' }}
          >
            {hoveredIndex !== null && (
              <line
                x1={xScale(hoveredIndex)} y1={0}
                x2={xScale(hoveredIndex)} y2={height}
                stroke="var(--accent)" strokeWidth="1" strokeDasharray="4"
                opacity="0.3"
              />
            )}
            <path
              d={curvePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Points */}
          {data.map((d, i) => (
            <div
              key={i}
              className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[5] transition-all duration-200 ${
                i === hoveredIndex
                  ? 'w-3.5 h-3.5 bg-white border-[3px] border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'w-2 h-2 bg-emerald-500'
              }`}
              style={{
                left: `${(xScale(i) / width) * 100}%`,
                top: `${(yScale(d.value) / height) * 100}%`,
              }}
            ></div>
          ))}

          {/* Tooltip */}
          {hoveredIndex !== null && (
            <div
              className="absolute bg-white rounded-lg px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/[0.05] -translate-x-1/2 -translate-y-[120%] pointer-events-none z-10"
              style={{
                left: `${(xScale(hoveredIndex) / width) * 100}%`,
                top: `${(yScale(data[hoveredIndex].value) / height) * 100}%`,
                transition: 'all 0.1s ease-out'
              }}
            >
              <div className="text-[0.85rem] font-semibold text-gray-900 mb-0.5">{data[hoveredIndex].day}</div>
              <div className="text-[0.8rem] text-emerald-500 font-medium">messages : {data[hoveredIndex].value}</div>
            </div>
          )}
        </div>

        {/* X-Axis */}
        <div className="absolute left-10 right-0 bottom-0 h-[30px] pointer-events-none">
          {data.map((d, i) => (
            <div
              key={i}
              className={`absolute top-2.5 text-[0.75rem] -translate-x-1/2 transition-all duration-200 ${
                i === hoveredIndex ? 'text-emerald-500 font-semibold' : 'text-gray-400'
              }`}
              style={{ left: `${(xScale(i) / width) * 100}%` }}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesChart;
