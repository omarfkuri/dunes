
type Ret = (
	((text: string) => void)
	&
	{text(text: string): string}
)

function Colorizer(c1: number, c2: number): Ret {
	const ret = (text => console.log(
		"\x1B[" + String(c1) + "m" + text + "\x1B[" + String(c2) + "m"
	)) as Ret;
	ret.text = (text => 
		"\x1B[" + String(c1) + "m" + text + "\x1B[" + String(c2) + "m"
	)
	return ret;
}

export const line = new class Line {
	readonly reset = Colorizer(0, 0);
	readonly bold = Colorizer(1, 22);
	readonly dim = Colorizer(2, 22);
	readonly italic = Colorizer(3, 23);
	readonly underline = Colorizer(4, 24);
	readonly inverse = Colorizer(7, 27);
	readonly hidden = Colorizer(8, 28);
	readonly strikethrough = Colorizer(9, 29);

	readonly black = Colorizer(30, 39);
	readonly red = Colorizer(31, 39);
	readonly green = Colorizer(32, 39);
	readonly yellow = Colorizer(33, 39);
	readonly blue = Colorizer(34, 39);
	readonly magenta = Colorizer(35, 39);
	readonly cyan = Colorizer(36, 39);
	readonly white = Colorizer(37, 39);
	readonly gray = Colorizer(90, 39);

	readonly blackBg = Colorizer(40, 49);
	readonly redBg = Colorizer(41, 49);
	readonly greenBg = Colorizer(42, 49);
	readonly yellowBg = Colorizer(43, 49);
	readonly blueBg = Colorizer(44, 49);
	readonly magentaBg = Colorizer(45, 49);
	readonly cyanBg = Colorizer(46, 49);
	readonly whiteBg = Colorizer(47, 49);
	readonly grayBg = Colorizer(100, 49);

	readonly blackLi = Colorizer(90, 39);
	readonly redLi = Colorizer(91, 39);
	readonly greenLi = Colorizer(92, 39);
	readonly yellowLi = Colorizer(93, 39);
	readonly blueLi = Colorizer(94, 39);
	readonly magentaLi = Colorizer(95, 39);
	readonly cyanLi = Colorizer(96, 39);
	readonly whiteLi = Colorizer(97, 39);

	readonly blackLiBg = Colorizer(100, 49);
	readonly redLiBg = Colorizer(101, 49);
	readonly greenLiBg = Colorizer(102, 49);
	readonly yellowLiBg = Colorizer(103, 49);
	readonly blueLiBg = Colorizer(104, 49);
	readonly magentaLiBg = Colorizer(105, 49);
	readonly cyanLiBg = Colorizer(106, 49);
	readonly whiteLiBg = Colorizer(107, 49);
}