import {Inject, Injectable} from '@angular/core';
import {Oscillator} from "./osciallator";
import {
  BehaviorSubject,
  combineLatest,
  filter,
  iif,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
  takeWhile,
  tap
} from "rxjs";
import {cloneDeep, merge} from 'lodash';


export class SynthesizerState {

  isActive: boolean = false
  oscAFreq: number = 200
  oscBFreq: number = 200
  filter: {
    cutOff: number
    resonance: number
  } = {
    resonance: 0.5,
    cutOff: 200
  }
}

interface Voice { gate: number, freq: number };

@Injectable({
  providedIn: 'root'
})
export class Synthesizer {
  private _state: BehaviorSubject<SynthesizerState> = new BehaviorSubject<SynthesizerState>(new SynthesizerState())
  private _voices: BehaviorSubject<Voice[]> = new BehaviorSubject<Voice[]>([])

  constructor(private oscillator: Oscillator, @Inject("elementary.core") private core: any, @Inject("elementary.el") private el: any) {


    combineLatest(this._state, this._voices)
      .pipe(
        filter(([s, v]) => s.isActive),
        tap(([s, v]) => {
          this.core.render(...this.outputs(s))
        })
      ).subscribe()
  }


  get stateSnapshot(): SynthesizerState {
    return this._state.getValue()
  }


  set isActive(value: boolean) {
    let st = this._state.getValue();
    st.isActive = value;
    this._state.next(st)
  }

  patch(patch: any) {
    let current = this._state.getValue();
    merge(current, patch);
    this._state.next(current)
  }

  private outputs(current: SynthesizerState): any {

    const tone1 = this.oscillator.sine(
      this.el.phasor(
        current.oscAFreq
      )
    )

    const tone2 = this.oscillator.sine(
      this.el.phasor(
        current.oscBFreq
      )
    )

    let out = this.el.add(tone1, tone2)
    if (current.filter) {
      out = this.el.lowpass(current.filter.cutOff, current.filter.resonance, out);
    }
    return [out, out]
  }

  private synth(vs: { gate: number, freq: number }[]) {
    return this.el.add(vs.map(v => {
        return this.el.mul(v.gate, this.el.cycle(v.freq));
      })
    )
  }
}
