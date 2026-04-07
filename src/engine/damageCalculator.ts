// GURPS Basic Set damage table (B16)
const BASIC_SET_TABLE: { thrust: string; swing: string }[] = [
  // ST 1
  { thrust: '1d-6', swing: '1d-5' },
  // ST 2
  { thrust: '1d-6', swing: '1d-5' },
  // ST 3
  { thrust: '1d-5', swing: '1d-4' },
  // ST 4
  { thrust: '1d-5', swing: '1d-4' },
  // ST 5
  { thrust: '1d-4', swing: '1d-3' },
  // ST 6
  { thrust: '1d-4', swing: '1d-3' },
  // ST 7
  { thrust: '1d-3', swing: '1d-2' },
  // ST 8
  { thrust: '1d-3', swing: '1d-2' },
  // ST 9
  { thrust: '1d-2', swing: '1d-1' },
  // ST 10
  { thrust: '1d-2', swing: '1d' },
  // ST 11
  { thrust: '1d-1', swing: '1d+1' },
  // ST 12
  { thrust: '1d-1', swing: '1d+2' },
  // ST 13
  { thrust: '1d', swing: '2d-1' },
  // ST 14
  { thrust: '1d', swing: '2d' },
  // ST 15
  { thrust: '1d+1', swing: '2d+1' },
  // ST 16
  { thrust: '1d+1', swing: '2d+2' },
  // ST 17
  { thrust: '1d+2', swing: '3d-1' },
  // ST 18
  { thrust: '1d+2', swing: '3d' },
  // ST 19
  { thrust: '2d-1', swing: '3d+1' },
  // ST 20
  { thrust: '2d-1', swing: '3d+2' },
]

// Knowing Your Own Strength (Pyramid #3/83) table
const KYOS_TABLE: { thrust: string; swing: string }[] = [
  { thrust: '1d-6', swing: '1d-5' }, // ST 1
  { thrust: '1d-6', swing: '1d-5' }, // ST 2
  { thrust: '1d-5', swing: '1d-4' }, // ST 3
  { thrust: '1d-5', swing: '1d-4' }, // ST 4
  { thrust: '1d-4', swing: '1d-3' }, // ST 5
  { thrust: '1d-4', swing: '1d-3' }, // ST 6
  { thrust: '1d-3', swing: '1d-2' }, // ST 7
  { thrust: '1d-3', swing: '1d-2' }, // ST 8
  { thrust: '1d-2', swing: '1d-1' }, // ST 9
  { thrust: '1d-2', swing: '1d' },   // ST 10
  { thrust: '1d-1', swing: '1d+1' }, // ST 11
  { thrust: '1d-1', swing: '1d+2' }, // ST 12
  { thrust: '1d', swing: '2d-1' },   // ST 13
  { thrust: '1d', swing: '2d' },     // ST 14
  { thrust: '1d+2', swing: '2d+2' }, // ST 15
  { thrust: '2d-1', swing: '3d-1' }, // ST 16
  { thrust: '2d', swing: '3d' },     // ST 17
  { thrust: '2d+2', swing: '3d+2' }, // ST 18
  { thrust: '3d-1', swing: '4d-1' }, // ST 19
  { thrust: '3d', swing: '4d' },     // ST 20
]

export function getDamageForST(
  st: number,
  progression: 'basic_set' | 'knowing_your_own_strength' = 'basic_set'
): { thrust: string; swing: string } {
  const clampedSt = Math.max(1, Math.min(st, 20))
  const idx = clampedSt - 1
  const table = progression === 'knowing_your_own_strength' ? KYOS_TABLE : BASIC_SET_TABLE
  return table[idx] ?? { thrust: '1d-6', swing: '1d-5' }
}
