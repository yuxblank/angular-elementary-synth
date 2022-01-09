function octavesToSemi(octave: number) {
  return (5-octave) * 12
}

function detune(fine:number, pitchOffset: number) {
  return (pitchOffset / 12) ^ 2 + fine
}

export function detuner(el: any, source: any, fine: number, octave: number = 0, semi: number = 0) {

  return el.mul(
    source, detune(fine, (octave+semi))
  )
}
