
export function clear(n = 1) {
	return new Promise<void>(res => {
		process?.stdout?.moveCursor?.(0, -n)
  	process?.stdout?.clearLine?.(1, res)
	})
}