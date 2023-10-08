
export interface Position {
	line: number,
	column: number
}


export type TType<T extends string> = T | "EOF"