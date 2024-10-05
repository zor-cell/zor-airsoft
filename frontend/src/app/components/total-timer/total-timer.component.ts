import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-total-timer',
  templateUrl: './total-timer.component.html',
  styleUrl: './total-timer.component.css'
})
export class TotalTimerComponent implements AfterViewInit {
  private _color: string = 'rgba(0, 0, 0, 0)';
  @Input() set color(value: string) {
    this._color = value;
  }
  get color(): string {
    if(this.increment === 0) {
      const rgbaMatch = this._color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      if (rgbaMatch) {
        const [_, r, g, b] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${0.7})`;
      }
    }

    return this._color;
  }

  @Input() totalTimerId!: number;
  @Input() maxSeconds!: number;
  @Output() timerFullEvent = new EventEmitter<number>;

  @ViewChild('timeDisplay') timeDisplay!: ElementRef;
  @ViewChild('timerContainer') timerContainer!: ElementRef;
  percentOffset: number = 0;

  timerIsFull: boolean = false;
  secondsPassed: number = 0;

  //can be seen as shared variable
  //increment 
  increment: number = 0;

  get calcWidth() {
    if(!this.maxSeconds) return `${this.percentOffset}px`;

    if(!this.timerIsFull && this.secondsPassed >= this.maxSeconds) {
      this.timerFullEvent.emit(this.totalTimerId);
      this.timerIsFull = true;
    }

    return `calc(${this.percentOffset}% + ${Math.min(this.secondsPassed / this.maxSeconds, 1) * (100 - this.percentOffset)}%)`;
  }
  
  constructor(private ref: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {  
    this.updatePercentOffset();
  }

  @HostListener('window:resize', ['$event']) 
  onResize(event:any) {
    this.updatePercentOffset();
  }

  private updatePercentOffset(): void {
    this.percentOffset = (this.timeDisplay.nativeElement.offsetWidth / this.ref.nativeElement.offsetWidth) * 100;

    this.cdr.detectChanges();
  }
}
