import { Dragger, DraggerCtx, Draggable, DropZone } from "./dragger"
import { Molecule, Atom, electronMap } from "./elements"
import { Handle } from "./components/handle"
import { Remove } from "./components/remove"

const createSelector = () => new electronMap["Paragraph"]({ text: "" })

const createDragzoneVertical = (atomIdx: number) => {
  const zone = document.createElement("div")
  zone.setAttribute("atomidx", String(atomIdx))
  zone.className = "dropzone-vertical"
  return zone
}

const createDragzoneHorizontal = (atomIdx: number, electronIdx: number) => {
  const zone = document.createElement("div")
  zone.setAttribute("atomidx", String(atomIdx))
  zone.setAttribute("electronIdx", String(electronIdx))
  zone.className = "dropzone-horizontal"
  return zone
}

export class Chemistry {
  dragger: Dragger
  molecule: Molecule
  element: HTMLElement

  constructor (chemistryId: string = "chemistry") {
    this.dragger = new Dragger(this.drop)
    this.molecule = new Molecule()
    this.element = document.querySelector(`#${chemistryId}`)
    window.requestAnimationFrame(this.render)
  }

  addVertical = (atomIdx: number) => {
    const atom = new Atom()
    atom.register(createSelector())
    this.molecule.register(atom, atomIdx)
    window.requestAnimationFrame(this.render)
  }
  
  addHorizontal = (atom: Atom, electronIdx: number) => {
    atom.register(createSelector(), electronIdx)
    window.requestAnimationFrame(this.render)
  }
  
  removeVertical = (atom: Atom) => {
    this.molecule.unregister(atom)
    window.requestAnimationFrame(this.render)
  }
  
  removeHorizontal = (atom: Atom, electronIdx: number) => {
    atom.unregister(atom.get(electronIdx))
    window.requestAnimationFrame(this.render)
  }

  drop = (ctx: DraggerCtx) => {
    const [draggable, dropZone] = [ctx.obj.element, ctx.zone.element]
    
    const dAtomIdx = Number(dropZone.getAttribute("atomIdx"))
    const dElectronIdx = Number(dropZone.getAttribute("electronIdx"))

    const sAtomIdx = Number(draggable.getAttribute("atomIdx"))
    const sElectronIdx = Number(draggable.getAttribute("electronIdx"))

    if (draggable.classList.contains("electron")) {
      const sAtom = this.molecule.get(sAtomIdx)
      const electron = sAtom.get(sElectronIdx)
      
      if (dropZone.classList.contains("dropzone-vertical")) {
        const dstAtom = new Atom()
        this.molecule.register(dstAtom, dAtomIdx)
        sAtom.unregister(electron)
        dstAtom.register(electron, dElectronIdx)
      }

      if (dropZone.classList.contains("dropzone-horizontal")) {
        const dstAtom = this.molecule.get(dAtomIdx)
        if (sElectronIdx >  dElectronIdx) sAtom.unregister(electron)
        dstAtom.register(electron, dElectronIdx)
        if (sElectronIdx <= dElectronIdx) sAtom.unregister(electron)
      }
    }

    else if (draggable.classList.contains("atom")) {
      if (dropZone.classList.contains("dropzone-vertical")) {
        const atom = this.molecule.get(sAtomIdx)
        if (sAtomIdx >  dAtomIdx) this.molecule.unregister(atom)
        this.molecule.register(atom, dAtomIdx)
        if (sAtomIdx <= dAtomIdx) this.molecule.unregister(atom)
      }
    }
    
    window.requestAnimationFrame(this.render)
  }

  clear = () => {
    Array.from(this.element.children).forEach(child => this.element.removeChild(child))
    this.dragger.reset()
    this.molecule.discarge()
  }

  render = () => {
    this.clear()

    const moleculeHolder = document.createElement("div")
    moleculeHolder.className = "molecule"
    this.element.appendChild(moleculeHolder)
    
    {
      const dropZone = createDragzoneVertical(0)
      dropZone.onclick = () => this.addVertical(0)
      this.dragger.registerZone(new DropZone(dropZone))
      moleculeHolder.appendChild(dropZone)
    }
    
    for (const [atomIdx, atom] of this.molecule.atoms.entries()) {
      const atomHolder = document.createElement("div")
      atomHolder.className = "atom"
      atomHolder.setAttribute("atomIdx", String(atomIdx))

      {
        const dragHandle = Handle("vertical")
        dragHandle.className = "atom-handle"
        this.dragger.registerObj(new Draggable(atomHolder, dragHandle))
        atomHolder.appendChild(dragHandle)
      }
      {
        const dropZone = createDragzoneHorizontal(atomIdx, 0)
        dropZone.onclick = () => this.addHorizontal(atom, 0)
        this.dragger.registerZone(new DropZone(dropZone))
        atomHolder.appendChild(dropZone)
      }

      for (const [electronIdx, electron] of atom.electrons.entries()) {
        const draggable = electron.element
        electron.visuals.header.remove.onclick = () => this.removeHorizontal(atom, electronIdx)
        draggable.setAttribute("atomIdx", String(atomIdx))
        draggable.setAttribute("electronIdx", String(electronIdx))
        atomHolder.appendChild(draggable)
        this.dragger.registerObj(new Draggable(draggable, electron.visuals.header.handle))
      
        const dropZone = createDragzoneHorizontal(atomIdx, electronIdx + 1)
        dropZone.onclick = () => this.addHorizontal(atom, electronIdx + 1)
        this.dragger.registerZone(new DropZone(dropZone))
        atomHolder.appendChild(dropZone)
      }

      {
        const remove = Remove()
        remove.className = "atom-remove"
        remove.onclick = () => this.removeVertical(atom)
        atomHolder.appendChild(remove)
      }

      moleculeHolder.appendChild(atomHolder)
      
      {
        const dropZone = createDragzoneVertical(atomIdx + 1)
        dropZone.onclick = () => this.addVertical(atomIdx + 1)
        this.dragger.registerZone(new DropZone(dropZone))
        moleculeHolder.appendChild(dropZone)
      }
    }
  }
}