import {createInterface} from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

/**
 * Ask user for input
 * */
export async function prompt(msg: string): Promise<string | null> {
  return await new Promise<string | null>(
    res => rl.question(msg, answer => res(answer))
  )
}

/**
 * Put options up to user to choose
 * */
export async function promptOptions<T extends string> (
	question: string, 
	options: T[], 
): Promise<T | null> 
export async function promptOptions<T extends string> (
	question: string, 
	options: T[], 
	def: T
): Promise<T> 
export async function promptOptions<T extends string> (
	question: string, 
	options: T[], 
	def?: T
): Promise<T | null> 
{
	const answer = await prompt(
		question + (
			def? ` (${def})`: ""
		) + 
		"\n'" + options.join("' | '") + "'\n"
	)

	if (!answer) {
		if (def) {
			return def
		}
		return null
	}

	else return answer as T
}