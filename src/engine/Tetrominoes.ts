export const TETROMINOES: Record<string, number[][]> = {
    I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    J: [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    L: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

export const COLORS: Record<string, string> = {
    I: 'cyan',
    O: 'yellow',
    T: 'purple',
    S: 'green',
    Z: 'red',
    J: 'blue',
    L: 'orange'
};
