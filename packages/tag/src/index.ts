import { Comp, Elem } from "./class/Base";
import { Content } from "./class/Content";

export { Component } from "./api/Component";

export {Comp, Elem}
export * from "./types";

declare global {

	type TagName = keyof JSX.IntrinsicElements;


	type Child = JSX.Element | Content

	namespace JSX {
		type Element = Comp | Elem;
		type ElementClass = Comp;

		interface IntrinsicAttributes {
			i?: number
			desc?: unknown
		}

    interface ElementAttributesProperty { props: {} }
    interface ElementChildrenAttribute { desc: {} }

    interface LibraryManagedAttributes {}
    interface IntrinsicClassAttributes {}

		interface IntrinsicElements {
			a: Elements.Anchor
			abbr: Elements.Other
			/** @deprecated*/
			acronym: Elements.Dep
			address: Elements.Other
			applet: Elements.Other
			area: Elements.Area
			article: Elements.Other
			aside: Elements.Other
			audio: Elements.Audio
			b: Elements.Other
			base: Elements.Base
			/** @deprecated*/
			basefont: Elements.Dep
			bdi: Elements.Other
			bdo: Elements.Other
			/** @deprecated*/
			big: Elements.Dep
			/** @deprecated*/
			blockquote: Elements.Other
			body: Elements.Body
			br: Elements.Br
			button: Elements.Button
			canvas: Elements.Canvas
			caption: Elements.Other
			/** @deprecated*/
			center: Elements.Dep
			cite: Elements.Other
			code: Elements.Other
			col: Elements.Other
			colgroup: Elements.Other
			data: Elements.Data
			datalist: Elements.DataList
			dd: Elements.Other
			del: Elements.Other
			details: Elements.Details
			dfn: Elements.Other
			dialog: Elements.Dialog
			/**@deprecated*/ 
			dir: Elements.Dep
			div: Elements.Div
			dl: Elements.DList
			dt: Elements.Other
			em: Elements.Other
			embed: Elements.Embed
			fieldset: Elements.FieldSet
			figcaption: Elements.Other
			figure: Elements.Other
			font: Elements.Dep
			footer: Elements.Other
			form: Elements.Form
			frame: Elements.Dep
			frameset: Elements.Dep
			h1: Elements.Heading
			h2: Elements.Heading
			h3: Elements.Heading
			h4: Elements.Heading
			h5: Elements.Heading
			h6: Elements.Heading
			head: Elements.Head
			header: Elements.Other
			hr: Elements.Hr
			html: Elements.Html
			i: Elements.Other
			iframe: Elements.IFrame
			img: Elements.Image
			input: Elements.Input
			ins: Elements.Other
			kbd: Elements.Other
			label: Elements.Label
			legend: Elements.Legend
			li: Elements.LI
			link: Elements.Link
			main: Elements.Other
			map: Elements.Map
			mark: Elements.Other
			meta: Elements.Meta
			meter: Elements.Meter
			menu: Elements.Menu
			mod: Elements.Mod
			nav: Elements.Other
			noframes: Elements.Dep
			noscript: Elements.Other
			object: Elements.Object
			ol: Elements.OList
			optgroup: Elements.OptGroup
			option: Elements.Option
			output: Elements.Output
			p: Elements.Paragraph
			param: Elements.Param
			picture: Elements.Picture
			pre: Elements.Pre
			progress: Elements.Progress
			q: Elements.Quote
			rp: Elements.Other
			rt: Elements.Other
			ruby: Elements.Other
			s: Elements.Other
			samp: Elements.Other
			script: Elements.Script
			section: Elements.Other
			select: Elements.Select
			small: Elements.Other
			slot: Elements.Slot
			source: Elements.Source
			span: Elements.Span
			strike: Elements.Dep
			strong: Elements.Other
			style: Elements.Style
			sub: Elements.Other
			summary: Elements.Other
			sup: Elements.Other
			table: Elements.Table
			tbody: Elements.Other
			td: Elements.TableCell
			template: Elements.Template
			textarea: Elements.TextArea
			tfoot: Elements.Other
			th: Elements.Other
			thead: Elements.Other
			time: Elements.Time
			title: Elements.Title
			tr: Elements.Other
			track: Elements.Track
			/**@deprecated*/
			tt: Elements.Dep
			u: Elements.Other
			ul: Elements.UList
			"var": Elements.Other
			video: Elements.Video
			wbr: Elements.Other

			svg: Elements.SVG

			animate: Elements.SVG
			animateMotion: Elements.SVG
			animateTransform: Elements.SVG
			circle: Elements.SVGCircle
			clipPath: Elements.SVGClipPath
			defs: Elements.SVGDefs
			desc: Elements.SVGDesc
			ellipse: Elements.SVGEllipse
			feBlend: Elements.SVGFEBlend
			feColorMatrix: Elements.SVGFEColorMatrix
			feComponentTransfer: Elements.SVGFEComponentTransfer
			feComposite: Elements.SVGFEComposite
			feConvolveMatrix: Elements.SVGFEConvolveMatrix
			feDiffuseLighting: Elements.SVGFEDiffuseLighting
			feDisplacementMap: Elements.SVGFEDisplacementMap
			feDistantLight: Elements.SVGFEDistantLight
			feDropShadow: Elements.SVGFEDropShadow
			feFlood: Elements.SVGFEFlood
			feFuncA: Elements.SVGFEFunc
			feFuncB: Elements.SVGFEFunc
			feFuncG: Elements.SVGFEFunc
			feFuncR: Elements.SVGFEFunc
			feGaussianBlur: Elements.SVGFEGaussianBlur
			feImage: Elements.SVGFEImage
			feMerge: Elements.SVGFEMerge
			feMergeNode: Elements.SVGFEMergeNode
			feMorphology: Elements.SVGFEMorphology
			feOffset: Elements.SVGFEOffset
			fePointLight: Elements.SVGFEPointLight
			feSpecularLighting: Elements.SVGFESpecularLighting
			feSpotLight: Elements.SVGFESpotLight
			feTile: Elements.SVGFETile
			feTurbulence: Elements.SVGFETurbulence
			filter: Elements.SVGFilter
			foreignObject: Elements.SVGForeignObject
			g: Elements.SVGG
			image: Elements.SVGImage
			line: Elements.SVGLine
			linearGradient: Elements.SVGLinearGradient
			marker: Elements.SVGMarker
			mask: Elements.SVGMask
			metadata: Elements.SVGMetadata
			mpath: Elements.SVG
			path: Elements.SVGPath
			pattern: Elements.SVGPattern
			polygon: Elements.SVGPolygon
			polyline: Elements.SVGPolyline
			radialGradient: Elements.SVGRadialGradient
			rect: Elements.SVGRect
			stop: Elements.SVGStop
			switch: Elements.SVGSwitch
			symbol: Elements.SVGSymbol
			text: Elements.SVGText
			textPath: Elements.SVGTextPath
			tspan: Elements.SVGTSpan
			use: Elements.SVGUse
			view: Elements.SVGView
		}
	}
}
