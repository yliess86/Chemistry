import { Electron } from "./models/electron"
import { Atom } from "./models/atom"
import { Molecule } from "./models/molecule"

import { Header } from "./electrons/header"
import { Paragraph } from "./electrons/paragraph"
import { ImageMedia } from "./electrons/image"

export const electronMap = {
  ["Header"]: Header,
  ["Paragraph"]: Paragraph,
  ["Image"]: ImageMedia,
}

export const deserialize = (data: Record<string, any>) => {
  const molecule = new Molecule()
  for (const atomData of data.atoms) {
    const atom = new Atom()
    for (const electronData of atomData.electrons) {
      const electron = new electronMap[electronData.type](electronData.data, electronData.readonly)
      atom.register(electron)
    }
    molecule.register(atom)
  }
  return molecule
}

export { Electron, Atom, Molecule }