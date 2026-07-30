import { useMemo, useState } from "react";

import Card from "../../../components/Common/Card";
import InfoTooltip from "../../../components/Common/InfoTooltip";
import "./MachineCategorySankey.css";

const NODE_WIDTH = 14;
const CHART_HEIGHT = 360;
const CHART_WIDTH = 720;

const PALETTE = ["#f5b400", "#12BE83", "#8bc34a", "#cddc39", "#66bb6a", "#a5d6a7", "#7cb342", "#d4e157"];

/**
 * @param {object} props
 * @param {{ fromNodes: string[], toNodes: string[], links: Array<{from, to, value}> }} props.data - dashboard.charts.sankey
 */
export default function MachineCategorySankey({ data }) {
  const [hovered, setHovered] = useState(null);
  const chartTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.2,
  };

  const layout = useMemo(() => {
    if (!data || data.fromNodes.length === 0 || data.toNodes.length === 0) return null;
    const { fromNodes, toNodes, links } = data;

    const fromTotals = Object.fromEntries(fromNodes.map((n) => [n, 0]));
    const toTotals = Object.fromEntries(toNodes.map((n) => [n, 0]));
    links.forEach((l) => {
      fromTotals[l.from] = (fromTotals[l.from] ?? 0) + l.value;
      toTotals[l.to] = (toTotals[l.to] ?? 0) + l.value;
    });

    const grandTotal = Object.values(fromTotals).reduce((a, b) => a + b, 0) || 1;
    const gapPx = 6;

    function placeNodes(names, totals) {
      const usableHeight = CHART_HEIGHT - gapPx * (names.length - 1);
      let y = 0;
      const positions = {};
      names.forEach((name) => {
        const h = Math.max((totals[name] / grandTotal) * usableHeight, 2);
        positions[name] = { y, height: h, total: totals[name] };
        y += h + gapPx;
      });
      return positions;
    }

    const fromPositions = placeNodes(fromNodes, fromTotals);
    const toPositions = placeNodes(toNodes, toTotals);

    const fromCursor = Object.fromEntries(fromNodes.map((n) => [n, fromPositions[n].y]));
    const toCursor = Object.fromEntries(toNodes.map((n) => [n, toPositions[n].y]));

    const drawnLinks = links.map((link, i) => {
      const fromTotal = fromTotals[link.from] || 1;
      const toTotal = toTotals[link.to] || 1;
      const fromHeight = (link.value / fromTotal) * fromPositions[link.from].height;
      const toHeight = (link.value / toTotal) * toPositions[link.to].height;

      const y0 = fromCursor[link.from];
      const y1 = toCursor[link.to];
      fromCursor[link.from] += fromHeight;
      toCursor[link.to] += toHeight;

      return {
        key: `${link.from}-${link.to}-${i}`,
        from: link.from,
        to: link.to,
        value: link.value,
        y0,
        y1,
        thickness0: fromHeight,
        thickness1: toHeight,
        color: PALETTE[fromNodes.indexOf(link.from) % PALETTE.length],
      };
    });

    return { fromPositions, toPositions, drawnLinks, fromNodes, toNodes };
  }, [data]);

  if (!layout) return null;

  const { fromPositions, toPositions, drawnLinks, fromNodes, toNodes } = layout;

  return (
    <Card
      title={
        <div style={chartTitleStyle}>
          <span style={chartTitleStyle}>Machine Type → Component Category</span>
          <InfoTooltip
            position="bottom"
            content='Machine-type name variants (e.g. "CAT 336D" / "cat 336d") are merged into one node before rendering'
          >
            <span className="infoIcon">i</span>
          </InfoTooltip>
        </div>
      }
      tag="Flow"
      height="clamp(340px, 36vw, 430px)"
    >
      <div className="sankeyCardBody">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 20}`} width="100%" height="100%">
          <g transform="translate(0,10)">
            {drawnLinks.map((l) => {
              const x0 = NODE_WIDTH;
              const x1 = CHART_WIDTH - NODE_WIDTH;
              const midX = (x0 + x1) / 2;
              const isHovered = hovered && hovered.from === l.from && hovered.to === l.to;
              const isDimmed = hovered && !isHovered;
              const path = `
                M ${x0} ${l.y0}
                C ${midX} ${l.y0}, ${midX} ${l.y1}, ${x1} ${l.y1}
                L ${x1} ${l.y1 + l.thickness1}
                C ${midX} ${l.y1 + l.thickness1}, ${midX} ${l.y0 + l.thickness0}, ${x0} ${l.y0 + l.thickness0}
                Z
              `;
              return (
                <path
                  key={l.key}
                  d={path}
                  fill={l.color}
                  opacity={isDimmed ? 0.08 : isHovered ? 0.85 : 0.35}
                  onMouseEnter={() => setHovered({ from: l.from, to: l.to })}
                  onMouseLeave={() => setHovered(null)}
                >
                  <title>{`${l.from} → ${l.to}: ${l.value.toLocaleString()}`}</title>
                </path>
              );
            })}

            {fromNodes.map((name, i) => {
              const pos = fromPositions[name];
              return (
                <g key={name}>
                  <rect x={0} y={pos.y} width={NODE_WIDTH} height={pos.height} fill={PALETTE[i % PALETTE.length]} rx={2} />
                  <text x={NODE_WIDTH + 8} y={pos.y + pos.height / 2} dominantBaseline="middle" className="sankeyLabel">
                    {name} ({pos.total.toLocaleString()})
                  </text>
                </g>
              );
            })}

            {toNodes.map((name) => {
              const pos = toPositions[name];
              return (
                <g key={name}>
                  <rect x={CHART_WIDTH - NODE_WIDTH} y={pos.y} width={NODE_WIDTH} height={pos.height} fill="#64748b" rx={2} />
                  <text
                    x={CHART_WIDTH - NODE_WIDTH - 8}
                    y={pos.y + pos.height / 2}
                    dominantBaseline="middle"
                    textAnchor="end"
                    className="sankeyLabel"
                  >
                    {name} ({pos.total.toLocaleString()})
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </Card>
  );
}
