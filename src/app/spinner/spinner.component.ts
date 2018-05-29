import {ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';

/** Possible mode for a progress spinner. */
export type ProgressSpinnerMode = 'determinate' | 'indeterminate';

/** Possible mode for a progress spinner. */
export type ProgressSpinnerColor = 'primary' | 'white';

/**
 * Base reference size of the spinner.
 * @docs-private
 */
const BASE_SIZE = 40;

/**
 * Base reference stroke width of the spinner.
 * @docs-private
 */
const BASE_STROKE_WIDTH = 4;


/**
 *  @example <app-spinner *ngIf="true" [value]="50" [mode]="'determinate'"></app-spinner>
 */
@Component({
  moduleId: module.id,
  selector: 'app-spinner',
  exportAs: 'appSpinner',
  host: {
    'role': 'progressbar',
    'class': 'app-spinner',
    '[style.width.px]': 'diameter',
    '[style.height.px]': 'diameter',
    '[attr.aria-valuemin]': 'mode === "determinate" ? 0 : null',
    '[attr.aria-valuemax]': 'mode === "determinate" ? 100 : null',
    '[attr.aria-valuenow]': 'value',
    '[attr.mode]': 'mode',
  },
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {

  private _value = 0;
  private _strokeWidth: number;

  /** Tracks diameters of existing instances to de-dupe generated styles (default d = 100) */
  private static diameters = new Set<number>([BASE_SIZE]);

  /** The diameter of the progress spinner (will set width and height of svg). */
  @Input()
  get diameter(): number { return this._diameter; }
  set diameter(size: number) {
    this._diameter = Math.ceil(size);
  }
  private _diameter = BASE_SIZE;

  /** Stroke width of the progress spinner. */
  @Input()
  get strokeWidth(): number {
    return this._strokeWidth || this.diameter / 10;
  }
  set strokeWidth(value: number) {
    this._strokeWidth = Math.ceil(value);
  }


  /** Mode of the progress circle */
  @Input() mode: ProgressSpinnerMode = 'indeterminate';

  @Input() color: ProgressSpinnerColor = 'primary';

  /** Value of the progress circle. */
  @Input()
  get value(): number {
    return this.mode === 'determinate' ? this._value : 0;
  }
  set value(newValue: number) {
    this._value = Math.max(0, Math.min(100, Math.floor(newValue)));
  }

  constructor(
    public _elementRef: ElementRef,
  ) {

    // On IE and Edge, we can't animate the `stroke-dashoffset`
    // reliably so we fall back to a non-spec animation.
    const animationClass = `app-progress-spinner-indeterminate-animation`;

    _elementRef.nativeElement.classList.add(animationClass);
  }

  /** The radius of the spinner, adjusted for stroke width. */
  get _circleRadius() {
    return (this.diameter - BASE_STROKE_WIDTH) / 2;
  }

  /** The view box of the spinner's svg element. */
  get _viewBox() {
    const viewBox = this._circleRadius * 2 + this.strokeWidth;
    return `0 0 ${viewBox} ${viewBox}`;
  }

  /** The stroke circumference of the svg circle. */
  get _strokeCircumference(): number {
    return 2 * Math.PI * this._circleRadius;
  }

  /** The dash offset of the svg circle. */
  get _strokeDashOffset() {
    if (this.mode === 'determinate') {
      return this._strokeCircumference * (100 - this._value) / 100;
    }

    return null;
  }

  /** Stroke width of the circle in percent. */
  get _circleStrokeWidth() {
    return this.strokeWidth / this.diameter * 100;
  }

  get _strokeColor() {
    return this.color === 'primary' ? '#1275ab' : '#FFFFFF';
  }
}
