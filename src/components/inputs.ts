export const InputText = (
  value: string,
  placeholder: string,
  setValue: (value: string) => void,
  prevent?: boolean,
) => {
  const preventDefault = prevent ?? false
  const empty = (x: string) => x === "" || x === "<br>"
  
  const holder = document.createElement("div")
  holder.style.position = "relative"
  holder.className = "input-text"
  
  const place = document.createElement("div")
  place.style.pointerEvents = "none"
  place.style.position = "absolute"
  place.style.top = "0px"
  place.style.left = "0px"
  place.style.display = empty(value.trim()) ? "block" : "none"
  place.className = "input-placeholder"
  place.innerHTML = placeholder
  
  const input = document.createElement("div")
  input.style.whiteSpace = "pre-wrap"
  input.contentEditable = "true"
  input.innerHTML = value
  input.onkeydown = e => { if (e.key === "Enter" && preventDefault) e.preventDefault() }
  input.oninput = () => {
    setValue(input.innerHTML.trim())
    place.style.display = empty(input.innerHTML) ? "block" : "none"
  }
  input.onpaste = e => {
    if (e.clipboardData.types.length === 1 && e.clipboardData.types[0] === "text/plain") return true
    else e.preventDefault()
  }
  
  holder.appendChild(input)
  holder.appendChild(place)
  
  return holder
}

export const InputNumber = (
  value: number,
  min: number,
  max: number,
  setValue: (value: number) => void,
) => {
  const holder = document.createElement("div")
  holder.className = "input-number"
  holder.style.display = "flex"
  holder.style.flexDirection = "row"

  const input = document.createElement("input")
  input.setAttribute("type", "number")
  input.setAttribute("min", String(min))
  input.setAttribute("max", String(max))
  input.setAttribute("value", String(value))
  input.onkeydown = e => e.preventDefault()
  
  const up = document.createElement("button")
  up.innerHTML = "+"
  up.onclick = () => { input.stepUp(); setValue(Number(input.value)) }
  
  const down = document.createElement("button")
  down.innerHTML = "-"
  down.onclick = () => { input.stepDown(); setValue(Number(input.value)) }
  
  holder.appendChild(down)
  holder.appendChild(input)
  holder.appendChild(up)
  
  return holder
}