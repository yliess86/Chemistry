import { Handle } from "../../components/handle"
import { Remove } from "../../components/remove"
import { Toggle } from "../../components/toggle"

export type ElectronVisuals = {
  header: {
    handle: HTMLElement
    toggle: HTMLElement
    remove: HTMLElement
  }
  content: HTMLElement
}

export type ElectronData = Record<string, any>
export class Electron {
  type: string
  data: ElectronData
  readonly: boolean
  className: string
  show: boolean

  element: HTMLElement
  visuals: ElectronVisuals

  constructor (type: string, data: ElectronData, className: string, readonly?: boolean, show?: boolean) {
    this.type = type
    this.data = data
    this.className = className
    this.readonly = readonly ?? false
    this.show = show ?? false
    this._visuals()
    this._content()
  }

  serialize = () => ({ type: this.type, data: this.data })

  editor: () => HTMLElement[] = () => []
  shower: () => HTMLElement[] = () => []

  toggle = () => {
    this.show = !this.show
    this.data.show = this.show
    this._content()
    return this.show
  }

  _visuals = () => {
    const handle = Handle("horizontal")
    handle.className = "electron-handle"

    const toggle = Toggle(this.show, this.toggle)
    toggle.className = "electron-toggle"

    const type = document.createElement("div")
    type.innerHTML = `.: ${this.type} :.`
    
    const left = document.createElement("div")
    left.className = "electron-header-left"
    left.appendChild(handle)
    left.appendChild(toggle)
    left.appendChild(type)

    const remove = Remove()
    remove.className = "electron-remove"
    
    const right = document.createElement("div")
    right.className = "electron-header-right"
    right.appendChild(remove)

    const header = document.createElement("div")
    header.className = "electron-header"
    header.appendChild(left)
    header.appendChild(right)

    const content = document.createElement("div")
    content.className = this.className
    content.classList.add("electron-content")

    const element = document.createElement("div")
    element.className = "electron"
    element.appendChild(header)
    element.appendChild(content)

    this.element = element
    this.visuals = { header: { handle: handle, toggle: toggle, remove: remove }, content: content }
  }

  _content = () => {
    const content = this.visuals.content
    Array.from(content.children).forEach(child => content.removeChild(child))
    const elements = this.show ? this.shower() : this.editor()
    elements.forEach(element => content.appendChild(element))
  }
}