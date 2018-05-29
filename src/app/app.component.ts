import {Component, ElementRef, ViewChild} from '@angular/core';
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
  loading = false;
  @ViewChild('video') video: ElementRef;
  form = new FormGroup({});
  data = {
    image: null,
  };
  videoUrl = null;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  handlePhotoInputChange(e: Event) {
    const target: HTMLInputElement = (e.target || e.srcElement) as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.setFile(file);
    }
  }

  setFile(file: File) {
    const gifs: any = gifshot;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl((window.URL || (<any>window).webkitURL).createObjectURL(file));
    console.log(this.videoUrl);
    gifs.createGIF({
      gifWidth: 200,
      gifHeight: 200,
      video: [
        this.videoUrl.changingThisBreaksApplicationSecurity,
      ],
      // interval: 0.1,
      numFrames: 300,
      frameDuration: 1,
      // fontWeight: 'normal',
      // fontSize: '16px',
      // fontFamily: 'sans-serif',
      // fontColor: '#ffffff',
      // textAlign: 'center',
      // textBaseline: 'bottom',
      // sampleInterval: 50,
      // offset: 10,
      numWorkers: 4
    }, obj => {
      if (!obj.error) {
        const image = obj.image;
        const animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
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
