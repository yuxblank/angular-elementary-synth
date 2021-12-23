import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Oscillator {

  constructor(@Inject("elementary.el") private el: any) { }


  sine(sampleRate?: number) {
    return this.el.sin(this.el.mul(2 * Math.PI, sampleRate));
  }
}
