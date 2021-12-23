import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {Log, Logger, LoggerFactory} from "rng-logger";
import {Observable, tap} from "rxjs";

export interface Key {
  key: "b" | "as" | "a" | "gs" | "g" | "fs" | "f" | "e" | "ds" | "d" | "cs" | "c",
  type: "white" | "black",
  freq: number
  control: string
}

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {

  private readonly logger = LoggerFactory()

  @Output() onKeyDown = new EventEmitter<Key>()
  @Output() onKeyUp = new EventEmitter<Key>()


  keys: Key[] = [
    {
      key: "c",
      type: "white",
      freq: 130.81,
      control: "a"
    },
    {
      key: "cs",
      type: "black",
      freq: 138.59,
      control: "w"
    },
    {
      key: "d",
      type: "white",
      freq: 146.83,
      control: "s"
    },
    {
      key: "ds",
      type: "black",
      freq: 155.56,
      control: "e"
    },
    {
      key: "e",
      type: "white",
      freq: 164.81,
      control: "d"
    },
    {
      key: "f",
      type: "white",
      freq: 174.61,
      control: "r"
    }, {
      key: "fs",
      type: "black",
      freq: 185.00,
      control: "f"
    },
    {
      key: "g",
      type: "white",
      freq: 196.00,
      control: "g"
    },
    {
      key: "gs",
      type: "black",
      freq: 207.65,
      control: "y"
    },
    {
      key: "a",
      type: "white",
      freq: 220.00,
      control: "h"
    },
    {
      key: "as",
      type: "black",
      freq: 233.08,
      control: "u"
    },
    {
      key: "b",
      type: "white",
      freq: 246.94,
      control: "j"
    },
  ]
  private keyDown$?: Observable<Key>;

  constructor() {
  }

  ngOnInit(): void {
    this.onKeyUp
      .asObservable()
      .pipe(
        tap(e => this.logger.debug(e))
      )
      .subscribe()

    this.onKeyDown
      .pipe(
        tap(e => this.logger.debug(e))
      )
      .subscribe()
  }

  @HostListener('window:keyup', ['$event'])
  @Log()
  keyUp(kbdEvent: KeyboardEvent) {
    let ctrl = this.keys.find(k => k.control === kbdEvent.key);
    if (!ctrl) {
      return;
    }
    this.onKeyUp.next(ctrl)
  }

  @HostListener('window:keydown', ['$event'])
  @Log()
  keyDown(kbdEvent: KeyboardEvent) {
    let ctrl = this.keys.find(k => k.control === kbdEvent.key);
    if (!ctrl) {
      return;
    }
    this.onKeyDown.next(ctrl)
  }

  onClick($event: MouseEvent, key: Key) {

    console.log($event)
    console.log(key)
  }
}
