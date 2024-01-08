import type { Emitter } from 'mitt'
import mitt from 'mitt'

declare interface MittType {
  blankClick?: string
}

const emitter: Emitter<MittType> = mitt<MittType>()

export default emitter
