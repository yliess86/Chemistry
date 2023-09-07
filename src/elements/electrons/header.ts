import { Electron } from "../models/electron"
import { InputNumber, InputText } from "../../components/inputs"

export type HeaderData = { text: string, level: number }
export class Header extends Electron {
  constructor (data: HeaderData, readonly?: boolean, show?: boolean) {
    super("Header", data, "electron-element-header", readonly, show)
    this._visuals()
    this._content()
  }

  editor = () => [
    InputNumber(this.data.level, 1, 3, (value: number) => this.data.level = value),
    InputText(this.data.text, "Enter header", (value: string) => this.data.text = value, true),
  ]

  shower = () => {
    const shower = document.createElement(`h${this.data.level}`)
    shower.innerHTML = this.data.text
    return [shower]
  }
}