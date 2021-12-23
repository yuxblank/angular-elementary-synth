import {ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {Synthesizer, SynthesizerState} from "./synthesizer";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {Observable, take, tap} from "rxjs";
import {Key} from "./keys/keys.component";




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'elementary-angular';
  @Output() audioActive = new EventEmitter<boolean>()
  initialSnapshot: SynthesizerState;


  constructor(
    @Inject("AudioContext") private ctx: AudioContext,
    private synth: Synthesizer) {
    this.initialSnapshot = this.synth.stateSnapshot
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
              this.synth.isActive = true;
            }
          }
        })
      )
      .subscribe()
  }


  oscAFreqChange($event: MatSliderChange) {

    this.synth.patch({
      oscAFreq: $event.value ? $event.value : 200
    })
  }

  toggleAudio($event: MatSlideToggleChange) {
    this.audioActive.emit($event.checked)
  }

  oscBFreqChange($event: any) {
    this.synth.patch({
      oscBFreq: $event.value ? $event.value : 200
    })
  }

  filterCutOffChange($event: any) {
    this.synth.patch({
      filter: {
        cutOff: $event.value
      }
    })
  }

  filterResoChange($event: any) {
    this.synth.patch({
      filter: {
        resonance: $event.value
      }
    })
  }

  onKeyDown($event: Key) {

  }

  onKeyUp($event: Key) {

  }
}
