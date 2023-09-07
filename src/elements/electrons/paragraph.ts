import { Electron } from "../models/electron"
import { InputText } from "../../components/inputs"

export type ParagraphData = { text: string }
export class Paragraph extends Electron {
  constructor (data: ParagraphData, readonly?: boolean, show?: boolean) {
    super("Paragraph", data, "electron-element-paragraph", readonly, show)
    this._visuals()
    this._content()
  }

  editor = () => [
    InputText(this.data.text, "Enter text", (value: string) => this.data.text = value),
  ]

  shower = () => {
    const shower = document.createElement("p")
    shower.innerHTML = this.data.text
    return [shower]
  }
}