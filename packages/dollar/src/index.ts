
export function $<E extends HTMLElement>(
	selector: string, 
	parent: Document | HTMLElement = document
)
: E | null 
{
	return parent.querySelector(selector);
}

export function $$<E extends HTMLElement>(
	selector: string, 
	parent: Document | HTMLElement = document
)
: E[] 
{
	return [...parent.querySelectorAll(selector)] as E[];
}