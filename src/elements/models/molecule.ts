import { insert } from "../../utils"
import { Atom } from "./atom"

export class Molecule {
  atoms: Atom[]

  constructor () { this.atoms = [] }

  get = (idx: number) => this.atoms[idx]
  isEmpty = () => this.atoms.length === 0

  serialize = () => ({ atoms: this.atoms.map(a => a.serialize()) })
  register = (atom: Atom, idx?: number) => { this.atoms = insert(this.atoms, atom, idx) }
  unregister = (atom: Atom) => { this.atoms.splice(this.atoms.indexOf(atom), 1) }
  discarge = () => { this.atoms.map(atom => { if (atom.isEmpty()) { this.unregister(atom) } }) }
}