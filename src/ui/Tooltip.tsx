import { Html } from '@react-three/drei';
import type { Vector3Tuple } from 'three';

interface Props {
  name: string;
  visible: boolean;
  position: Vector3Tuple;
}

export function Tooltip({ name, visible, position }: Props) {
  if (!visible) return null;

  return (
    <Html center distanceFactor={10} position={position} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          background: '#000000cc',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 12,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {name}
      </div>
    </Html>
  );
}
