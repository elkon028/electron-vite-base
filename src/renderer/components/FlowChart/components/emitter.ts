import mitt, { Emitter } from 'mitt'

declare type MittType = {
  blankClick?: string
}

const emitter: Emitter<MittType> = mitt<MittType>()
export default emitter
