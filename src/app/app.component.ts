import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import * as gifshot from 'gifshot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dragover = false;
  progress = 0;
  @ViewChild('video') video: ElementRef;
  form = new FormGroup({});
  data = {
    image: null,
  };
  videoUrl = null;
  imageSrc = null;
  downloadLink = null;

  constructor(
    private sanitizer: DomSanitizer,
    _cd: ChangeDetectorRef,
  ) {
    // TODO: until fix zone bug
    setInterval(() => _cd.markForCheck(), 200);
  }

  handlePhotoInputChange(e: Event) {
    const target: HTMLInputElement = (e.target || e.srcElement) as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.setFile(file);
    }
  }

  setFile(file: File) {
    const gifs: any = gifshot;
    const videoUrl = (window.URL || (<any>window).webkitURL).createObjectURL(file);
    this.imageSrc = null;
    this.downloadLink = null;
    this.progress = 0;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    const gif = gifs.createGIF({
      gifWidth: 426,
      gifHeight: 284,
      video: [
        videoUrl,
      ],
      // interval: 0.1,
      numFrames: 30,
      frameDuration: 1,
      // fontWeight: 'normal',
      // fontSize: '16px',
      // fontFamily: 'sans-serif',
      // fontColor: '#ffffff',
      // textAlign: 'center',
      // textBaseline: 'bottom',
      // sampleInterval: 50,
      // offset: 10,
      progressCallback: (captureProgress) => this.progress = captureProgress * 98,
      numWorkers: 4
    }, obj => {
      if (!obj.error) {
        const image = obj.image;
        this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(image);
        this.downloadLink = this.sanitizer.bypassSecurityTrustUrl(image);
        this.progress = 100;
      }
    });
  }

  preventEvent(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  dragOver(event: DragEvent) {
    this.dragover = true;
    this.preventEvent(event);
  }
  dragEnd(event: DragEvent) {
    this.dragover = false;
    this.preventEvent(event);
  }
  drop(event: DragEvent) {
    const file = event.dataTransfer.files[0];
    this.setFile(file);
    this.dragover = false;
    this.preventEvent(event);
  }
}
