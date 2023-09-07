import { insert } from "../../utils"
import { Electron } from "./electron"

export class Atom {
  electrons: Electron[]

  constructor () { this.electrons = [] }

  get = (idx: number) => this.electrons[idx]
  isEmpty = () => this.electrons.length === 0

  serialize = () => ({ electrons: this.electrons.map(e => e.serialize()) })
  register = (electron: Electron, idx?: number) => { this.electrons = insert(this.electrons, electron, idx) }
  unregister = (electron: Electron) => { this.electrons.splice(this.electrons.indexOf(electron), 1) }
}