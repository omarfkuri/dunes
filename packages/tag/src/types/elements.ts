


export type CSSProperties = 
{[k in keyof CSSStyleDeclaration]: CSSStyleDeclaration[k]}

export type num = number | `${number}`;

export type bool = boolean | `${boolean}`

export type OnEvent<H extends Element, E extends Event = Event> = {
  (this: H, e: TagEvent<H, E>): any | null
}


export type TagEvent<H extends Element, E extends Event = Event> = (
  E & {
    target: H
    jsx: JSX.Element
  }
)

export type InputType = (
	| "button"
	| "checkbox"
	| "color"
	| "date"
	| "datetime-local"
	| "email"
	| "file"
	| "hidden"
	| "image"
	| "month"
	| "number"
	| "password"
	| "radio"
	| "range"
	| "reset"
	| "search"
	| "submit"
	| "tel"
	| "text"  
	| "time"
	| "url"
	| "week"
)

export type AriaRole = (
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | (string & {})
)

type color = string


interface ElementDef extends JSX.IntrinsicAttributes {
  cl?: string
  style?: CSSProperties | string;
}

interface element<E extends Element = Element> extends ElementDef {

  id?: string
  // class: string
  animate?: string
  attributes?: string
  localname?: string
  namespaceURI?: string
  onbeforeload?: OnEvent<E>
  onfocusin?: OnEvent<E, FocusEvent>
  onfocusout?: OnEvent<E, FocusEvent>
  onwebkitcurrentplaybacktargetiswirelesschanged?: OnEvent<E>
  onwebkitfullscreenchange?: OnEvent<E>
  onwebkitfullscreenerror?: OnEvent<E>
  onwebkitneedkey?: OnEvent<E>
  onwebkitplaybacktargetavailabilitychanged?: OnEvent<E>
  onwebkitpresentationmodechanged?: OnEvent<E>
  part?: string
  prefix?: string
  role?: AriaRole
  shadowroot?: unknown
  slot?: string

  ariaatomic?: string
  ariaautocomplete?: string
  ariabusy?: string
  ariachecked?: boolean
  ariacolcount?: string
  ariacolindex?: string
  ariacolspan?: string
  ariacurrent?: string
  ariadisabled?: boolean
  ariaexpanded?: boolean
  ariahaspopup?: string
  ariahidden?: string
  ariainvalid?: string
  ariakeyshortcuts?: string
  arialabel?: string
  arialevel?: string
  arialive?: string
  ariamodal?: string
  ariamultiline?: string
  ariamultiselectable?: string
  ariaorientation?: string
  ariaplaceholder?: string
  ariaposinset?: string
  ariapressed?: boolean
  ariareadonly?: string
  ariarelevant?: string
  ariarequired?: boolean
  ariaroledescription?: string
  ariarowcount?: string
  ariarowindex?: string
  ariarowspan?: string
  ariaselected?: boolean
  ariasetsize?: string
  ariasort?: string
  ariavaluemax?: num
  ariavaluemin?: num
  ariavaluenow?: string
  ariavaluetext?: string
}

interface Generic<H extends HTMLElement> extends element<H> {
  accesskey?: string
  accesskeylabel?: string
  autocorrect?: string
  autofocus?: string
  contenteditable?: boolean
  dataset?: Record<string, string>
  dir?: string
  draggable?: boolean
  enterkeyhint?: string
  hidden?: boolean
  inputmode?: string
  lang?: string
  nonce?: string
  onabort?: OnEvent<H, UIEvent>
  onanimationcancel?: OnEvent<H, AnimationEvent>
  onanimationend?: OnEvent<H, AnimationEvent>
  onanimationiteration?: OnEvent<H, AnimationEvent>
  onanimationstart?: OnEvent<H, AnimationEvent>
  onauxclick?: OnEvent<H, MouseEvent>
  onbeforecopy?: OnEvent<H>,
  onbeforecut?: OnEvent<H>,
  onbeforeinput?: OnEvent<H, InputEvent>
  onbeforepaste?: OnEvent<H>,
  onblur?: OnEvent<H, FocusEvent>
  oncancel?: OnEvent<H>,
  oncanplay?: OnEvent<H>,
  oncanplaythrough?: OnEvent<H>,
  onchange?: OnEvent<H>,
  onclick?: OnEvent<H, MouseEvent>
  onclose?: OnEvent<H>,
  oncompositionend?: OnEvent<H, CompositionEvent>
  oncompositionstart?: OnEvent<H, CompositionEvent>
  oncompositionupdate?: OnEvent<H, CompositionEvent>
  oncontextmenu?: OnEvent<H, MouseEvent>
  oncopy?: OnEvent<H>,
  oncuechange?: OnEvent<H>,
  oncut?: OnEvent<H>,
  ondblclick?: OnEvent<H, MouseEvent>
  ondrag?: OnEvent<H, DragEvent>
  ondragend?: OnEvent<H, DragEvent>
  ondragenter?: OnEvent<H, DragEvent>
  ondragleave?: OnEvent<H, DragEvent>
  ondragover?: OnEvent<H, DragEvent>
  ondragstart?: OnEvent<H, DragEvent>
  ondrop?: OnEvent<H, DragEvent>
  ondurationchange?: OnEvent<H>,
  onemptied?: OnEvent<H>,
  onended?: OnEvent<H>,
  onerror?: OnEvent<H, ErrorEvent>
  onfocus?: OnEvent<H, FocusEvent>
  // onfocusin?: OnFunction<H, FocusEvent>
  // onfocusout?: OnFunction<H, FocusEvent>
  onformdata?: OnEvent<H, FormDataEvent>
  ongotpointercapture?: OnEvent<H, PointerEvent>
  oninput?: OnEvent<H, InputEvent>,
  oninvalid?: OnEvent<H>,
  onkeydown?: OnEvent<H, KeyboardEvent>
  onkeypress?: OnEvent<H, KeyboardEvent>
  onkeyup?: OnEvent<H, KeyboardEvent>
  onload?: OnEvent<H>,
  onloadeddata?: OnEvent<H>,
  onloadedmetadata?: OnEvent<H>,
  onloadstart?: OnEvent<H>,
  onlostpointercapture?: OnEvent<H, PointerEvent>
  onmousedown?: OnEvent<H, MouseEvent>
  onmouseenter?: OnEvent<H, MouseEvent>
  onmouseleave?: OnEvent<H, MouseEvent>
  onmousemove?: OnEvent<H, MouseEvent>
  onmouseout?: OnEvent<H, MouseEvent>
  onmouseover?: OnEvent<H, MouseEvent>
  onmouseup?: OnEvent<H, MouseEvent>
  onmousewheel?: OnEvent<H>,
  onpaste?: OnEvent<H>,
  onpause?: OnEvent<H>,
  onplay?: OnEvent<H>,
  onplaying?: OnEvent<H>,
  onpointercancel?: OnEvent<H, PointerEvent>
  onpointerdown?: OnEvent<H, PointerEvent>
  onpointerenter?: OnEvent<H, PointerEvent>
  onpointerleave?: OnEvent<H, PointerEvent>
  onpointermove?: OnEvent<H, PointerEvent>
  onpointerout?: OnEvent<H, PointerEvent>
  onpointerover?: OnEvent<H, PointerEvent>
  onpointerup?: OnEvent<H, PointerEvent>
  onprogress?: OnEvent<H, ProgressEvent>
  onratechange?: OnEvent<H>,
  onreset?: OnEvent<H>,
  onresize?: OnEvent<H, UIEvent>
  onscroll?: OnEvent<H>,
  onsearch?: OnEvent<H>,
  onsecuritypolicyviolation?: OnEvent<H, SecurityPolicyViolationEvent>
  onseeked?: OnEvent<H>,
  onseeking?: OnEvent<H>,
  onselect?: OnEvent<H>,
  onselectionchange?: OnEvent<H>,
  onselectstart?: OnEvent<H>,
  onslotchange?: OnEvent<H>,
  onstalled?: OnEvent<H>,
  onsubmit?: OnEvent<H, SubmitEvent>
  onsuspend?: OnEvent<H>,
  ontimeupdate?: OnEvent<H>,
  ontoggle?: OnEvent<H>,
  ontouchcancel?: OnEvent<H, TouchEvent>
  ontouchend?: OnEvent<H, TouchEvent>
  ontouchmove?: OnEvent<H, TouchEvent>
  ontouchstart?: OnEvent<H, TouchEvent>
  ontransitioncancel?: OnEvent<H, TransitionEvent>
  ontransitionend?: OnEvent<H, TransitionEvent>
  ontransitionrun?: OnEvent<H, TransitionEvent>
  ontransitionstart?: OnEvent<H, TransitionEvent>
  onvolumechange?: OnEvent<H>,
  onwaiting?: OnEvent<H>,
  onwebkitanimationend?: OnEvent<H>,
  onwebkitanimationiteration?: OnEvent<H>,
  onwebkitanimationstart?: OnEvent<H>,
  onwebkitmouseforcechanged?: OnEvent<H>,
  onwebkitmouseforcedown?: OnEvent<H>,
  onwebkitmouseforceup?: OnEvent<H>,
  onwebkitmouseforcewillbegin?: OnEvent<H>,
  onwebkittransitionend?: OnEvent<H>,
  onwheel?: OnEvent<H, WheelEvent>
  spellCheck?: string
  tabIndex?: string
  title?: string
  translate?: string
}

interface GenericMedia<H extends HTMLMediaElement> extends Generic<H>{
  error?: string
  src?: string
  srcObject?: string
  currentSrc?: string
  crossOrigin?: string
  networkState?: string
  preload?: string
  buffered?: boolean
  readyState?: string
  seeking?: string
  currentTime?: string
  duration?: string
  paused?: boolean
  defaultPlaybackRate?: string
  playbackRate?: string
  played?: boolean
  seekable?: string
  ended?: boolean
  autoplay?: string
  loop?: string
  controls?: string
  volume?: string
  muted?: boolean
  defaultMuted?: boolean
  webkitPreservesPitch?: string
  webkitHasClosedCaptions?: string
  webkitClosedCaptionsVisible?: string
  webkitKeys?: string
  mediaKeys?: string
  onencrypted?: OnEvent<H>,
  onwaitingforkey?: OnEvent<H>,
  audioTracks?: string
  textTracks?: string
  videoTracks?: string
  mediaGroup?: string
  controller?: string
  webkitCurrentPlaybackTargetIsWireless?: string
  remote?: string
  disableRemotePlayback?: string
  load?: string
  canPlayType?: string
  getStartDate?: string
  play?: string
  pause?: string
  fastSeek?: string
  webkitSetMediaKeys?: string
  setMediaKeys?: string
  addTextTrack?: string
  getVideoPlaybackQuality?: string
  webkitShowPlaybackTargetPicker?: string
}

declare global {
  
  namespace Elements {

    interface Other extends Generic<HTMLElement> {}
    interface Anchor extends Generic<HTMLAnchorElement> {
      attributionSourceId?: string
      attributionDestination?: string
      attributionSourceNonce?: string
      charset?: string
      coords?: string
      download?: string
      hrefLang?: string
      name?: string
      ping?: string
      rel?: string
      rev?: string
      shape?: string
      target?: string
      type?: string
      text?: string
      relList?: string
      referrerPolicy?: string
      href?: string
      origin?: string
      protocol?: string
      username?: string
      password?: string
      host?: string
      hostname?: string
      port?: string
      pathname?: string
      search?: string
      hash?: string
      // toString?: string
    }
    interface Area extends Generic<HTMLAreaElement> {
      alt?: string
      coords?: string
      noHref?: string
      ping?: string
      rel?: string
      shape?: string
      target?: string
      download?: string
      referrerPolicy?: string
      relList?: string
      href?: string
      origin?: string
      protocol?: string
      username?: string
      password?: string
      host?: string
      hostname?: string
      port?: string
      pathname?: string
      search?: string
      hash?: string
      // toString?: string
    }
    interface Audio extends GenericMedia<HTMLAudioElement> {}
    interface Br extends Generic<HTMLBRElement> {
      clear?: string
    }
    interface Base extends Generic<HTMLBaseElement> {
      href?: string
      target?: string
    }
    interface Body extends Generic<HTMLBodyElement> {
      aLink?: string
      background?: string
      bgColor?: color
      link?: string
      text?: string
      vLink?: string
      onblur?: OnEvent<HTMLBodyElement>,
      onerror?: OnEvent<HTMLBodyElement>,
      onfocus?: OnEvent<HTMLBodyElement>,
      onfocusin?: OnEvent<HTMLBodyElement>,
      onfocusout?: OnEvent<HTMLBodyElement>,
      onload?: OnEvent<HTMLBodyElement>,
      onresize?: OnEvent<HTMLBodyElement>,
      onscroll?: OnEvent<HTMLBodyElement>,
      onwebkitmouseforcechanged?: OnEvent<HTMLBodyElement>,
      onwebkitmouseforcedown?: OnEvent<HTMLBodyElement>,
      onwebkitmouseforcewillbegin?: OnEvent<HTMLBodyElement>,
      onwebkitmouseforceup?: OnEvent<HTMLBodyElement>,
      onafterprint?: OnEvent<HTMLBodyElement>,
      onbeforeprint?: OnEvent<HTMLBodyElement>,
      onbeforeunload?: OnEvent<HTMLBodyElement>,
      onhashchange?: OnEvent<HTMLBodyElement>,
      onlanguagechange?: OnEvent<HTMLBodyElement>,
      onmessage?: OnEvent<HTMLBodyElement>,
      onoffline?: OnEvent<HTMLBodyElement>,
      ononline?: OnEvent<HTMLBodyElement>,
      onpagehide?: OnEvent<HTMLBodyElement>,
      onpageshow?: OnEvent<HTMLBodyElement>,
      onpopstate?: OnEvent<HTMLBodyElement>,
      onrejectionhandled?: OnEvent<HTMLBodyElement>,
      onstorage?: OnEvent<HTMLBodyElement>,
      onunhandledrejection?: OnEvent<HTMLBodyElement>,
      onunload?: OnEvent<HTMLBodyElement>
    }
    interface Button extends Generic<HTMLButtonElement> {
      disabled?: boolean
      form?: string
      formAction?: string
      formEnctype?: string
      formMethod?: string
      type?: string
      formNoValidate?: string
      formTarget?: string
      name?: string
      value?: string
      willValidate?: string
      validity?: string
      validationMessage?: string
      labels?: string
      checkValidity?: string
      reportValidity?: string
      setCustomValidity?: string
    }
    interface Canvas extends Generic<HTMLCanvasElement> {
      width?: num
      height?: num
      captureStream?: string
    }
    interface DList extends Generic<HTMLDListElement> {
      compact?: string
    }
    interface Data extends Generic<HTMLDataElement> {
      value?: string
    }
    interface DataList extends Generic<HTMLDataListElement> {
      options?: string
    }
    interface Dialog extends Generic<HTMLDialogElement> {
      open?: string
      returnValue?: string
      show?: string
      showModal?: string
      close?: string
    }
    interface Details extends Generic<HTMLDetailsElement> {
      open?: bool
    }
    interface Directory extends Generic<HTMLDirectoryElement> {
      compact?: string
    }
    interface Div extends Generic<HTMLDivElement> {
      align?: string
    }
    interface Embed extends Generic<HTMLEmbedElement> {
      align?: string
      height?: num
      name?: string
      src?: string
      type?: string
      width?: num
    }
    interface FieldSet extends Generic<HTMLFieldSetElement> {
      disabled?: boolean
      form?: string
      name?: string
      type?: string
      elements?: string
      willValidate?: string
      validity?: string
      validationMessage?: string
      checkValidity?: string
      reportValidity?: string
    }
    interface Font extends Generic<HTMLFontElement> {
      color?: string
      face?: string
      size?: string
    }
    interface Form extends Generic<HTMLFormElement> {
      acceptCharset?: string
      action?: string
      autocomplete?: string
      enctype?: string
      encoding?: string
      method?: string
      name?: string
      noValidate?: string
      target?: string
      rel?: string
      relList?: string
      elements?: string
      length?: string
      submit?: string
      reset?: string
      checkValidity?: string
      reportValidity?: string
    }
    interface Frame extends Generic<HTMLFrameElement> {

      name?: string
      scrolling?: string
      src?: string
      frameBorder?: string
      longDesc?: string
      noResize?: string
      contentDocument?: string
      contentWindow?: string
      marginHeight?: string
      marginWidth?: string
      width?: num
      height?: num
      location?: string
      getSVGDocument?: string
    }
    interface FrameSet extends Generic<HTMLFrameSetElement> {
      cols?: string
      rows?: string
      onblur?: OnEvent<HTMLFrameSetElement>,
      onerror?: OnEvent<HTMLFrameSetElement>,
      onfocus?: OnEvent<HTMLFrameSetElement>,
      onfocusin?: OnEvent<HTMLFrameSetElement>,
      onfocusout?: OnEvent<HTMLFrameSetElement>,
      onload?: OnEvent<HTMLFrameSetElement>,
      onresize?: OnEvent<HTMLFrameSetElement>,
      onscroll?: OnEvent<HTMLFrameSetElement>,
      onafterprint?: OnEvent<HTMLFrameSetElement>,
      onbeforeprint?: OnEvent<HTMLFrameSetElement>,
      onbeforeunload?: OnEvent<HTMLFrameSetElement>,
      onhashchange?: OnEvent<HTMLFrameSetElement>,
      onlanguagechange?: OnEvent<HTMLFrameSetElement>,
      onmessage?: OnEvent<HTMLFrameSetElement>,
      onoffline?: OnEvent<HTMLFrameSetElement>,
      ononline?: OnEvent<HTMLFrameSetElement>,
      onpagehide?: OnEvent<HTMLFrameSetElement>,
      onpageshow?: OnEvent<HTMLFrameSetElement>,
      onpopstate?: OnEvent<HTMLFrameSetElement>,
      onrejectionhandled?: OnEvent<HTMLFrameSetElement>,
      onstorage?: OnEvent<HTMLFrameSetElement>,
      onunhandledrejection?: OnEvent<HTMLFrameSetElement>,
      onunload?: OnEvent<HTMLFrameSetElement>
    }
    interface Hr extends Generic<HTMLHRElement> {
      align?: string
      color?: string
      noShade?: string
      size?: string
      width?: num
    }
    interface Head extends Generic<HTMLHeadElement> {
      profile?: string
    }
    interface Heading extends Generic<HTMLHeadingElement> {
      align?: string
    }
    interface Html extends Generic<HTMLHtmlElement> {
      version?: string
      manifest?: string
    }
    interface IFrame extends Generic<HTMLIFrameElement> {
      align?: string
      frameBorder?: string
      height?: num
      longDesc?: string
      marginHeight?: string
      marginWidth?: string
      name?: string
      sandbox?: string
      allowFullscreen?: string
      allow?: string
      scrolling?: string
      src?: string
      srcdoc?: string
      width?: num
      contentDocument?: string
      contentWindow?: string
      referrerPolicy?: string
      getSVGDocument?: string
    }
    interface Image extends Generic<HTMLImageElement> {
      alt?: string
      src?: string
      srcset?: string
      sizes?: string
      crossOrigin?: string
      useMap?: string
      isMap?: string
      width?: num
      height?: num
      naturalHeight?: string
      naturalWidth?: string
      complete?: string
      currentSrc?: string
      referrerPolicy?: string
      decoding?: string
      loading?: string
      name?: string
      lowsrc?: string
      align?: string
      hspace?: string
      vspace?: string
      longDesc?: string
      border?: string
      x?: string
      y?: string
      decode?: string
    }
    interface Input extends Generic<HTMLInputElement> {
      accept?: string
      alt?: string
      autocomplete?: string
      defaultChecked?: boolean
      checked?: boolean
      dirName?: string
      disabled?: boolean
      form?: string
      files?: string
      formAction?: string
      formEnctype?: string
      formMethod?: string
      formNoValidate?: string
      formTarget?: string
      height?: num
      indeterminate?: string
      list?: string
      max?: num
      minLength?: num
      maxLength?: num
      min?: num
      multiple?: bool
      name?: string
      pattern?: string
      placeholder?: string
      readOnly?: string
      required?: boolean
      size?: string
      src?: string
      step?: string
      type?: InputType
      defaultValue?: string
      value?: string
      valueAsDate?: string
      valueAsNumber?: string
      width?: num
      willValidate?: string
      validity?: string
      validationMessage?: string
      labels?: string
      selectionStart?: string
      selectionEnd?: string
      selectionDirection?: string
      align?: string
      useMap?: string
      incremental?: string
      webkitdirectory?: string
      webkitEntries?: string
      stepUp?: string
      stepDown?: string
      checkValidity?: string
      reportValidity?: string
      setCustomValidity?: string
      select?: string
      setRangeText?: string
      setSelectionRange?: string
    }
    interface LI extends Generic<HTMLLIElement> {
      type?: string
      value?: string
    }
    interface Label extends Generic<HTMLLabelElement> {
      form?: string
      htmlFor?: string
      control?: string
    }
    interface Legend extends Generic<HTMLLegendElement> {
      form?: string
      align?: string
    }
    interface Link extends Generic<HTMLLinkElement> {
      disabled?: boolean
      charset?: string
      href?: string
      hrefLang?: string
      media?: string
      rel?: string
      rev?: string
      sizes?: string
      target?: string
      type?: string
      "as"?: string
      crossOrigin?: string
      referrerPolicy?: string
      sheet?: string
      relList?: string
      nonce?: string
      integrity?: string
    }
    interface Map extends Generic<HTMLMapElement> {
      areas?: string
      name?: string
    }
    interface Marquee extends Generic<HTMLMarqueeElement> {
      behavior?: string
      bgColor?: color
      direction?: string
      height?: num
      hspace?: string
      loop?: string
      scrollAmount?: string
      scrollDelay?: string
      trueSpeed?: boolean
      vspace?: string
      width?: num
      start?: string
      stop?: string
    }
    interface Menu extends Generic<HTMLMenuElement> {
      compact?: string
    }
    interface Meta extends Generic<HTMLMetaElement> {
      content?: string
      httpEquiv?: string
      media?: string
      name?: string
      scheme?: string
      charset?: string
    }
    interface Meter extends Generic<HTMLMeterElement> {
      value?: string
      min?: num
      max?: num
      low?: string
      high?: string
      optimum?: string
      labels?: string
    }
    interface Mod extends Generic<HTMLModElement> {
      cite?: string
      dateTime?: string
    }
    interface OList extends Generic<HTMLOListElement> {
      compact?: string
      start?: string
      reversed?: boolean
      type?: string
    }
    interface Object extends Generic<HTMLObjectElement> {
      form?: string
      code?: string
      align?: string
      archive?: string
      border?: string
      codeBase?: string
      codeType?: string
      data?: string
      declare?: string
      height?: num
      hspace?: string
      name?: string
      standby?: string
      type?: string
      useMap?: string
      vspace?: string
      width?: num
      willValidate?: string
      validity?: string
      validationMessage?: string
      contentDocument?: string
      contentWindow?: string
      checkValidity?: string
      reportValidity?: string
      setCustomValidity?: string
      getSVGDocument?: string
    }
    interface OptGroup extends Generic<HTMLOptGroupElement> {
      disabled?: boolean
      label?: string
    }
    interface Option extends Generic<HTMLOptionElement> {
      disabled?: boolean
      form?: string
      label?: string
      defaultSelected?: boolean
      selected?: boolean
      value?: string
      text?: string
      index?: string
    }
    interface Output extends Generic<HTMLOutputElement> {
      htmlFor?: string
      form?: string
      name?: string
      type?: string
      defaultValue?: string
      value?: string
      willValidate?: string
      validity?: string
      validationMessage?: string
      labels?: string
      checkValidity?: string
      reportValidity?: string
      setCustomValidity?: string
    }
    interface Paragraph extends Generic<HTMLParagraphElement> {
      align?: string
    }
    interface Param extends Generic<HTMLParamElement> {
      name?: string
      type?: string
      value?: string
      valueType?: string
    }
    interface Picture extends Generic<HTMLPictureElement> {}
    interface Pre extends Generic<HTMLPreElement> {
      width?: num
      wrap?: string
    }
    interface Progress extends Generic<HTMLProgressElement> {
      value?: string
      max?: num
      position?: string
      labels?: string
    }
    interface Quote extends Generic<HTMLQuoteElement> {
      cite?: string
    }
    interface Script extends Generic<HTMLScriptElement> {
      text?: string
      htmlFor?: string
      event?: string
      charset?: string
      async?: string
      defer?: boolean
      src?: string
      type?: string
      crossOrigin?: string
      noModule?: string
      integrity?: string
      referrerPolicy?: string
    }
    interface Select extends Generic<HTMLSelectElement> {
      add?: string
      autocomplete?: string
      checkValidity?: string
      disabled?: boolean
      form?: string
      item?: string
      labels?: string
      length?: string
      multiple?: bool
      name?: string
      namedItem?: string
      options?: string
      remove?: string
      reportValidity?: string
      required?: boolean
      selectedIndex?: string
      selectedOptions?: string
      setCustomValidity?: string
      size?: string
      type?: string
      validationMessage?: string
      validity?: string
      value?: string
      willValidate?: string
    }
    interface Slot extends Generic<HTMLSlotElement> {
      assignedElements?: string
      assignedNodes?: string
      name?: string
    }
    interface Source extends Generic<HTMLSourceElement> {
      height?: num
      media?: string
      sizes?: string
      src?: string
      srcset?: string
      type?: string
      width?: num
    }
    interface Span extends Generic<HTMLSpanElement> {}
    interface Style extends Generic<HTMLStyleElement> {
      disabled?: boolean
      media?: string
      type?: string
      sheet?: string
      nonce?: string
    }
    interface TableCaption extends Generic<HTMLTableCaptionElement> {
      align?: string
    }
    interface TableCell extends Generic<HTMLTableCellElement> {
      cellIndex?: string
      align?: string
      axis?: string
      bgColor?: color
      ch?: string
      chOff?: string
      colSpan?: string
      rowSpan?: string
      headers?: string
      height?: num
      noWrap?: string
      vAlign?: string
      width?: num
      abbr?: string
      scope?: string
    }
    interface TableCol extends Generic<HTMLTableColElement> {
      align?: string
      ch?: string
      chOff?: string
      span?: string
      vAlign?: string
      width?: num
    }
    interface Table extends Generic<HTMLTableElement> {
      caption?: string
      tHead?: string
      tFoot?: string
      rows?: string
      tBodies?: string
      align?: string
      bgColor?: color
      border?: string
      cellPadding?: string
      cellSpacing?: string
      frame?: string
      rules?: string
      summary?: string
      width?: num
      createTHead?: string
      deleteTHead?: string
      createTFoot?: string
      deleteTFoot?: string
      createTBody?: string
      createCaption?: string
      deleteCaption?: string
      insertRow?: string
      deleteRow?: string
    }
    interface TableRow extends Generic<HTMLTableRowElement> {
      rowIndex?: string
      sectionRowIndex?: string
      cells?: string
      align?: string
      bgColor?: color
      ch?: string
      chOff?: string
      vAlign?: string
      insertCell?: string
      deleteCell?: string
    }
    interface TableSection extends Generic<HTMLTableSectionElement> {
      align?: string
      ch?: string
      chOff?: string
      vAlign?: string
      rows?: string
      insertRow?: string
      deleteRow?: string
    }
    interface Template extends Generic<HTMLTemplateElement> {
      content?: string
    }
    interface TextArea extends Generic<HTMLTextAreaElement> {
      dirName?: string
      disabled?: boolean
      form?: string
      minLength?: string
      maxLength?: string
      name?: string
      placeholder?: string
      readOnly?: string
      required?: boolean
      rows?: string
      cols?: string
      wrap?: string
      type?: string
      defaultValue?: string
      value?: string
      textLength?: string
      willValidate?: string
      validity?: string
      validationMessage?: string
      labels?: string
      selectionStart?: string
      selectionEnd?: string
      selectionDirection?: string
      autocomplete?: string
      checkValidity?: string
      reportValidity?: string
      setCustomValidity?: string
      select?: string
      setRangeText?: string
      setSelectionRange?: string
    }
    interface Time extends Generic<HTMLTimeElement> {
      dateTime?: string
    }
    interface Title extends Generic<HTMLTitleElement> {
      text?: string
    }
    interface Track extends Generic<HTMLTrackElement> {
      kind?: string
      src?: string
      srclang?: string
      label?: string
      default?: string
      readyState?: string
      track?: string
      NONE?: string
      LOADING?: string
      LOADED?: string
      ERROR?: string
    }
    interface UList extends Generic<HTMLUListElement> {
      compact?: string
      type?: string
    }
    interface Dep extends Generic<HTMLElement> {}
    interface Unknown extends Generic<HTMLUnknownElement> {}
    interface Video extends GenericMedia<HTMLVideoElement> {
      width?: num
      height?: num
      videoWidth?: string
      videoHeight?: string
      poster?: string
      playsInline?: string
      webkitSupportsFullscreen?: string
      webkitDisplayingFullscreen?: string
      webkitWirelessVideoPlaybackDisabled?: boolean
      webkitPresentationMode?: string
      onenterpictureinpicture?: OnEvent<HTMLVideoElement>,
      onleavepictureinpicture?: OnEvent<HTMLVideoElement>,
      autoPictureInPicture?: string
      disablePictureInPicture?: string
      webkitEnterFullscreen?: string
      webkitExitFullscreen?: string
      webkitEnterFullScreen?: string
      webkitExitFullScreen?: string
      webkitSupportsPresentationMode?: string
      webkitSetPresentationMode?: string
      requestPictureInPicture?: string
      requestVideoFrameCallback?: string
      cancelVideoFrameCallback?: string
    }





    interface svgElement<H extends SVGElement> extends Generic<HTMLUnknownElement> {
      color?: string;
      height?: num;

      lang?: string;
      max?: num;
      media?: string;
      method?: string;
      min?: num;
      name?: string;
      target?: string;
      type?: string;
      width?: num;
      style?: CSSProperties | string;

      crossOrigin?: "anonymous" | "use-credentials" | "";

      // SVG Specific attributes
      accentHeight?: num;
      accumulate?: "none" | "sum";
      additive?: "replace" | "sum";
      alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
      "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
      allowReorder?: "no" | "yes";
      alphabetic?: num;
      amplitude?: num;
      arabicForm?: "initial" | "medial" | "terminal" | "isolated";
      ascent?: num;
      attributeName?: string;
      attributeType?: string;
      autoReverse?: bool;
      azimuth?: num;
      baseFrequency?: num;
      baselineShift?: num;
      baseProfile?: num;
      bbox?: num;
      begin?: num;
      bias?: num;
      by?: num;
      calcMode?: num;
      capHeight?: num;
      clip?: num;
      clipPath?: string;
      clipPathUnits?: num;
      clipRule?: num;
      colorInterpolation?: num;
      colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
      colorProfile?: num;
      colorRendering?: num;
      contentScriptType?: num;
      contentStyleType?: num;
      cursor?: num;
      cx?: num;
      cy?: num;
      d?: string;
      decelerate?: num;
      descent?: num;
      diffuseConstant?: num;
      direction?: num;
      display?: num;
      divisor?: num;
      dominantBaseline?: num;
      dur?: num;
      dx?: num;
      dy?: num;
      edgeMode?: num;
      elevation?: num;
      enableBackground?: num;
      end?: num;
      exponent?: num;
      externalResourcesRequired?: bool;
      fill?: string;
      fillOpacity?: num;
      fillRule?: "nonzero" | "evenodd" | "inherit";
      filter?: string;
      filterRes?: num;
      filterUnits?: num;
      floodColor?: num;
      floodOpacity?: num;
      focusable?: bool | "auto";
      fontFamily?: string;
      fontSize?: num;
      fontSizeAdjust?: num;
      fontStretch?: num;
      fontStyle?: num;
      fontVariant?: num;
      fontWeight?: num;
      format?: num;
      fr?: num;
      from?: num;
      fx?: num;
      fy?: num;
      g1?: num;
      g2?: num;
      glyphName?: num;
      glyphOrientationHorizontal?: num;
      glyphOrientationVertical?: num;
      glyphRef?: num;
      gradientTransform?: string;
      gradientUnits?: string;
      hanging?: num;
      horizAdvX?: num;
      horizOriginX?: num;
      href?: string;
      ideographic?: num;
      imageRendering?: num;
      in2?: num;
      in?: string;
      intercept?: num;
      k1?: num;
      k2?: num;
      k3?: num;
      k4?: num;
      k?: num;
      kernelMatrix?: num;
      kernelUnitLength?: num;
      kerning?: num;
      keyPoints?: num;
      keySplines?: num;
      keyTimes?: num;
      lengthAdjust?: num;
      letterSpacing?: num;
      lightingColor?: num;
      limitingConeAngle?: num;
      local?: num;
      markerEnd?: string;
      markerHeight?: num;
      markerMid?: string;
      markerStart?: string;
      markerUnits?: num;
      markerWidth?: num;
      mask?: string;
      maskContentUnits?: num;
      maskUnits?: num;
      mathematical?: num;
      mode?: num;
      numOctaves?: num;
      offset?: num;
      opacity?: num;
      operator?: num;
      order?: num;
      orient?: num;
      orientation?: num;
      origin?: num;
      overflow?: num;
      overlinePosition?: num;
      overlineThickness?: num;
      paintOrder?: num;
      panose1?: num;
      path?: string;
      pathLength?: num;
      patternContentUnits?: string;
      patternTransform?: num;
      patternUnits?: string;
      pointerEvents?: num;
      points?: string;
      pointsAtX?: num;
      pointsAtY?: num;
      pointsAtZ?: num;
      preserveAlpha?: bool;
      preserveAspectRatio?: string;
      primitiveUnits?: num;
      r?: num;
      radius?: num;
      refX?: num;
      refY?: num;
      renderingIntent?: num;
      repeatCount?: num;
      repeatDur?: num;
      requiredExtensions?: num;
      requiredFeatures?: num;
      restart?: num;
      result?: string;
      rotate?: num;
      rx?: num;
      ry?: num;
      scale?: num;
      seed?: num;
      shapeRendering?: num;
      slope?: num;
      spacing?: num;
      specularConstant?: num;
      specularExponent?: num;
      speed?: num;
      spreadMethod?: string;
      startOffset?: num;
      stdDeviation?: num;
      stemh?: num;
      stemv?: num;
      stitchTiles?: num;
      stopColor?: string;
      stopOpacity?: num;
      strikethroughPosition?: num;
      strikethroughThickness?: num;
      string?: num;
      stroke?: string;
      strokeDasharray?: string | number;
      strokeDashoffset?: string | number;
      strokeLinecap?: "butt" | "round" | "square" | "inherit";
      strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
      strokeMiterlimit?: num;
      strokeOpacity?: num;
      strokeWidth?: num;
      surfaceScale?: num;
      systemLanguage?: num;
      tableValues?: num;
      targetX?: num;
      targetY?: num;
      textAnchor?: string;
      textDecoration?: num;
      textLength?: num;
      textRendering?: num;
      to?: num;
      transform?: string;
      u1?: num;
      u2?: num;
      underlinePosition?: num;
      underlineThickness?: num;
      unicode?: num;
      unicodeBidi?: num;
      unicodeRange?: num;
      unitsPerEm?: num;
      vAlphabetic?: num;
      values?: string;
      vectorEffect?: num;
      version?: string;
      vertAdvY?: num;
      vertOriginX?: num;
      vertOriginY?: num;
      vHanging?: num;
      vIdeographic?: num;
      viewBox?: string;
      viewTarget?: num;
      visibility?: num;
      vMathematical?: num;
      widths?: num;
      wordSpacing?: num;
      writingMode?: num;
      x1?: num;
      x2?: num;
      x?: num;
      xChannelSelector?: string;
      xHeight?: num;
      xlinkActuate?: string;
      xlinkArcrole?: string;
      xlinkHref?: string;
      xlinkRole?: string;
      xlinkShow?: string;
      xlinkTitle?: string;
      xlinkType?: string;
      xmlBase?: string;
      xmlLang?: string;
      xmlns?: string;
      xmlnsXlink?: string;
      xmlSpace?: string;
      y1?: num;
      y2?: num;
      y?: num;
      yChannelSelector?: string;
      z?: num;
      zoomAndPan?: string;
    }

    interface SVG extends svgElement<SVGElement> { }
    interface SVGCircle extends svgElement<SVGCircleElement> { }
    interface SVGClipPath extends svgElement<SVGClipPathElement> { }
    interface SVGDefs extends svgElement<SVGDefsElement> { }
    interface SVGDesc extends svgElement<SVGDescElement> { }
    interface SVGEllipse extends svgElement<SVGEllipseElement> { }
    interface SVGFEBlend extends svgElement<SVGFEBlendElement> { }
    interface SVGFEColorMatrix extends svgElement<SVGFEColorMatrixElement> { }
    interface SVGFEComponentTransfer extends svgElement<SVGFEComponentTransferElement> { }
    interface SVGFEComposite extends svgElement<SVGFECompositeElement> { }
    interface SVGFEConvolveMatrix extends svgElement<SVGFEConvolveMatrixElement> { }
    interface SVGFEDiffuseLighting extends svgElement<SVGFEDiffuseLightingElement> { }
    interface SVGFEDisplacementMap extends svgElement<SVGFEDisplacementMapElement> { }
    interface SVGFEDistantLight extends svgElement<SVGFEDistantLightElement> { }
    interface SVGFEDropShadow extends svgElement<SVGFEDropShadowElement> { }
    interface SVGFEFlood extends svgElement<SVGFEFloodElement> { }
    interface SVGFEFunc extends svgElement<SVGElement> { }
    interface SVGFEGaussianBlur extends svgElement<SVGFEGaussianBlurElement> { }
    interface SVGFEImage extends svgElement<SVGFEImageElement> { }
    interface SVGFEMerge extends svgElement<SVGFEMergeElement> { }
    interface SVGFEMergeNode extends svgElement<SVGFEMergeNodeElement> { }
    interface SVGFEMorphology extends svgElement<SVGFEMorphologyElement> { }
    interface SVGFEOffset extends svgElement<SVGFEOffsetElement> { }
    interface SVGFEPointLight extends svgElement<SVGFEPointLightElement> { }
    interface SVGFESpecularLighting extends svgElement<SVGFESpecularLightingElement> { }
    interface SVGFESpotLight extends svgElement<SVGFESpotLightElement> { }
    interface SVGFETile extends svgElement<SVGFETileElement> { }
    interface SVGFETurbulence extends svgElement<SVGFETurbulenceElement> { }
    interface SVGFilter extends svgElement<SVGFilterElement> { }
    interface SVGForeignObject extends svgElement<SVGForeignObjectElement> { }
    interface SVGG extends svgElement<SVGGElement> { }
    interface SVGImage extends svgElement<SVGImageElement> { }
    interface SVGLine extends svgElement<SVGLineElement> { }
    interface SVGLinearGradient extends svgElement<SVGLinearGradientElement> { }
    interface SVGMarker extends svgElement<SVGMarkerElement> { }
    interface SVGMask extends svgElement<SVGMaskElement> { }
    interface SVGMetadata extends svgElement<SVGMetadataElement> { }
    interface SVGPath extends svgElement<SVGPathElement> { }
    interface SVGPattern extends svgElement<SVGPatternElement> { }
    interface SVGPolygon extends svgElement<SVGPolygonElement> { }
    interface SVGPolyline extends svgElement<SVGPolylineElement> { }
    interface SVGRadialGradient extends svgElement<SVGRadialGradientElement> { }
    interface SVGRect extends svgElement<SVGRectElement> { }
    interface SVGStop extends svgElement<SVGStopElement> { }
    interface SVGSwitch extends svgElement<SVGSwitchElement> { }
    interface SVGSymbol extends svgElement<SVGSymbolElement> { }
    interface SVGText extends svgElement<SVGTextElement> { }
    interface SVGTextPath extends svgElement<SVGTextPathElement> { }
    interface SVGTSpan extends svgElement<SVGTSpanElement> { }
    interface SVGUse extends svgElement<SVGUseElement> { }
    interface SVGView extends svgElement<SVGViewElement> { }
  }
}