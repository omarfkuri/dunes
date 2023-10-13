
export function $<E extends HTMLElement>(
	selector: string, 
	parent: Document | HTMLElement = document
)
: E | null 
{
	return parent.querySelector(selector);
}
export function $i<E extends HTMLElement>(
  selector: string, 
  parent: Document = document
)
: E | null 
{
  return parent.getElementById(selector) as E;
}

export function $a<E extends HTMLElement>(
	selector: string, 
	parent: Document | HTMLElement = document
)
: E[] 
{
	return [...parent.querySelectorAll(selector)] as E[];
}