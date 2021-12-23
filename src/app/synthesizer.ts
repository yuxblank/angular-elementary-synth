import {Inject, Injectable} from '@angular/core';
import {Oscillator} from "./osciallator";
import {BehaviorSubject, filter} from "rxjs";
import {cloneDeep, merge} from 'lodash';


class SynthesizerState {
  oscAFreq?: number = 0
  oscBFreq?: number = 0
  filter?: {
    cutOff? : number
    resonance? : number
  } = {
    resonance: 0,
    cutOff: 0
  }
}


@Injectable({
  providedIn: 'root'
})
export class Synthesizer {
  private state: BehaviorSubject<SynthesizerState> = new BehaviorSubject<SynthesizerState>(new SynthesizerState())

  constructor(private oscillator: Oscillator, @Inject("elementary.core") private core: any, @Inject("elementary.el") private el: any) {

    this.state
      .pipe(
      ).subscribe(
      next => {
        this.core.render(...this.outputs())
      }
    )
  }

  update(state: SynthesizerState) {
    let current = this.state.getValue();
    merge(current, state);
    this.state.next(current)
  }

  private outputs(): any {


    let current = this.state.getValue();


    const tone1 = this.oscillator.sine(
      this.el.add(this.el.phasor(
        current.oscAFreq
      ))
    )

    const tone2 = this.oscillator.sine(
      this.el.add(this.el.phasor(
        current.oscBFreq
      ))
    )


    let out = this.el.add(tone1, tone2)
    if (current.filter) {
      out = this.el.lowpass(current.filter.cutOff, current.filter.resonance, out);
    }
    return [out, out]
  }
}
