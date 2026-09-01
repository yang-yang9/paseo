import Svg, { Circle, Path } from "react-native-svg";

interface QoderIconProps {
  size?: number;
  color?: string;
}

export function QoderIcon({ size = 16, color = "currentColor" }: QoderIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer hexagon shape */}
      <Path
        d="M12 2L3 7v10l9 5 9-5V7L12 2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner Q letter */}
      <Path
        d="M10 8h3.5a2.5 2.5 0 0 1 0 5H10V8z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tail of Q */}
      <Path
        d="M13 13l3 3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Dot accent */}
      <Circle cx="12" cy="18" r="1" fill={color} />
    </Svg>
  );
}