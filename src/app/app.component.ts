import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dragover = false;
  loading = false;
  image: HTMLImageElement;
  form = new FormGroup({});
  data = {
    image: null,
  };

  handlePhotoInputChange(e: Event) {
    const target: HTMLInputElement = (e.target || e.srcElement) as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      this.setFile(file);
    }
  }

  setFile(file: File) {
    console.log(file);
    const image: HTMLImageElement = new Image();
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
    };

    myReader.readAsDataURL(file);
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
