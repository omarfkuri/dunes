import type { Styled } from "../index.js"

declare const Elem: typeof import("@dunes/tag").Elem

export type FormInput = {
	title: string
	input: JSX.Element
}

export type FormProps = Elements.Form & {
	titleText?: string
	submitText: string
	inputs: FormInput[]
}

export type FormStyles = {
	form_wrapper: string
	form_title: string
	input_wrapper: string
	input_container: string
	input_title: string
	submit_container: string
}

export const Form: Styled<FormProps, FormStyles> = (
	({css, titleText, submitText, inputs, ...props}) => (
		<form {...props} cl={css.form_wrapper}>
			{titleText && <div cl={css.form_title}>{titleText}</div>}
			{
				inputs.map(({title, input}) => (
					<div cl={css.input_wrapper}>
						<span cl={css.input_title}>{title}</span>
						<div cl={css.input_container}>
							{input}
						</div>
					</div>
				))
			}
			<div cl={css.submit_container}>
				<button>{submitText}</button>
			</div>
		</form>
	)
)