import { IconClose } from "./icons"

export const Remove = () => {
  const remove = document.createElement("div")
  remove.appendChild(IconClose())
  return remove
}