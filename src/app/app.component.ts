import {ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {Synthesizer} from "./synthesizer";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {tap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'elementary-angular';
  @Output() audioActive = new EventEmitter<boolean>()


  constructor(
    @Inject("AudioContext") private ctx: AudioContext,
    private synth: Synthesizer) {
  }

  ngOnInit(): void {

    this.audioActive.emit(false);

    this.audioActive.asObservable()
      .pipe(
        tap(active => {
          switch (active) {
            case false :{
              this.ctx.suspend().then(r => {
                console.log("suspend");
              });
              break;
            }
            default:{
              this.ctx.resume().then(r => {
                console.log("start");
              });
            }
          }
        })
      )
      .subscribe()
  }


  startAudio() {

  }

  stopAudio() {

  }

  oscAFreqChange($event: MatSliderChange) {

    this.synth.update({
      oscAFreq: $event.value ? $event.value : 200
    })
  }

  toggleAudio($event: MatSlideToggleChange) {
    this.audioActive.emit($event.checked)
  }

  oscBFreqChange($event: any) {
    this.synth.update({
      oscBFreq: $event.value ? $event.value : 200
    })
  }

  filterCutOffChange($event: any) {
    this.synth.update({
      filter: {
        cutOff: $event.value
      }
    })
  }

  filterResoChange($event: any) {
    this.synth.update({
      filter: {
        resonance: $event.value
      }
    })
  }
}
