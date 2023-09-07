import { InputText } from "../../components/inputs"
import { Electron } from "../models/electron"

export type ImageMediaData = { src: string, alt: string }
export class ImageMedia extends Electron {
  constructor (data: ImageMediaData, readonly?: boolean, show?: boolean) {
    super("Image", data, "electron-element-image", readonly, show)
    this._visuals()
    this._content()
  }

  editor = () => [
    InputText(this.data.src, "Enter image url", (value: string) => this.data.src = value, true),
    InputText(this.data.alt, "Enter image caption", (value: string) => this.data.alt = value, true),
  ]

  shower = () => {
    const shower = document.createElement("figure")
    
    const img = document.createElement("img")
    img.setAttribute("src", this.data.src)
    shower.appendChild(img)
    
    const caption = document.createElement("figcaption")
    caption.innerHTML = this.data.alt
    shower.appendChild(caption)
    
    return [shower]
  }
}