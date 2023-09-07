import { IconDrag, IconDragHorizontal, IconDragVertical } from "./icons"

const handleMap = {
  "vertical": IconDragVertical,
  "horizontal": IconDragHorizontal,
  "default": IconDrag,
}

export const Handle = (mode: string = "default") => {
  const handle = document.createElement("div")
  handle.appendChild(handleMap[mode]())
  return handle
}