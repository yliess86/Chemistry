const addClass = (element: HTMLElement, cls: string) => { if (!element.classList.contains(cls)) { element.classList.add(cls) } }
const removeClass = (element: HTMLElement, cls: string) => { if (element.classList.contains(cls)) { element.classList.remove(cls) } }

export type DraggerCbk = (ctx: DraggerCtx) => void
export type DraggerCtx = { obj?: Draggable, zone?: DropZone }

export class Draggable {
  element: HTMLElement
  handle: HTMLElement
  cls: string

  constructor (element: HTMLElement, handle: HTMLElement, cls: string = "dragged") {
    this.element = element
    this.handle = handle
    this.cls = cls

    this.handle.onmousedown = () => { this.element.draggable = true }
    this.handle.onmouseup = () => { this.element.draggable = false }
  }

  registerListeners = (ctx: DraggerCtx) => {
    this.element.ondragstart = () => this.onDragStart(ctx)
    this.element.ondragend = () => this.onDragStop(ctx)
    return this
  }

  onDragStart = (ctx: DraggerCtx) => {
    if (this.element.draggable) {
      ctx.obj = this
      addClass(this.element, this.cls)
    }
  }
  onDragStop = (ctx: DraggerCtx) => {
    if (this.element.draggable) {
      ctx.obj = undefined
      removeClass(this.element, this.cls)
      this.element.draggable = false
    }
  }
}

export class DropZone {
  element: HTMLElement
  cls: string
  
  constructor (element: HTMLElement, cls: string = "overed") {
    this.element = element
    this.cls = cls
  }

  registerListeners = (ctx: DraggerCtx, cbk: DraggerCbk) => {
    this.element.ondragenter = () => this.onEnter(ctx)
    this.element.ondragover = e => { e.preventDefault(); this.onEnter(ctx) }
    this.element.ondragleave = () => this.onLeave(ctx)
    this.element.ondrop = () => { cbk(ctx); this.onLeave(ctx) }
    return this
  }

  onEnter = (ctx: DraggerCtx) => {
    if (ctx.obj) {
      ctx.zone = this
      addClass(this.element, this.cls)
    }
  }
  onLeave = (ctx: DraggerCtx) => {
    if (ctx.obj) {
      ctx.zone = undefined
      removeClass(this.element, this.cls)
    }
  }
}

export class Dragger {
  ctx: DraggerCtx
  cbk: DraggerCbk
  objs: Draggable[]
  zones: DropZone[]

  constructor (cbk: DraggerCbk) {
    this.cbk = cbk
    this.reset()
  }

  reset = () => {
    this.ctx = { obj: undefined, zone: undefined }
    this.objs = []
    this.zones = []
  }

  registerObj = (obj: Draggable) => { this.objs.push(obj.registerListeners(this.ctx)) }
  registerZone = (zone: DropZone) => { this.zones.push(zone.registerListeners(this.ctx, this.cbk)) }
}