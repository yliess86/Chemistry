import { IconEye, IconPen } from "./icons"

export const Toggle = (value: boolean, toggle: () => boolean) => {
  const [eye, pen] = [IconEye(), IconPen()]
  const button = document.createElement("button")
  button.appendChild(value ? pen : eye)
  button.onclick = () => {
    const show = toggle()
    button.replaceChild(show ? pen: eye, show ? eye : pen)
  }
  return button
}