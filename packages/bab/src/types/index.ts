import "@dunes/tools"

export interface BabelOptions {
	jsx?: JSXOptions
	id: string
	ts?: {[key: string]: any}
	keeps: Set<string>
}

export interface JSXOptions {
	useBuiltIns?: boolean
	useSpread?: boolean
	pragma?: string
	pragmaFrag?: string
	runtime?: "classic" | (string & ({}))
}