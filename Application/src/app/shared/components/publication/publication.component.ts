import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from './../../service/publication.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {
//   public formData = new FormData();
// ReqJson: any = {};

  publicationForm = new FormGroup({
    description:new FormControl('',[
      Validators.required
    ]),
    image:new FormControl('',[
      Validators.required
    ])                                                                    
  });

//   constructor() { }

//   ngOnInit() {
//   }
// progress: number;
//   infoMessage: any;
//   isUploading: boolean = false;
   file: File;
   publication: any;

   imageUrl: string | ArrayBuffer =
     "https://bulma.io/images/placeholders/480x480.png";
   fileName: string = "No file selected";

  constructor( private PublicationService: PublicationService) {}

  ngOnInit() {
    /*this.uploader.progressSource.subscribe(progress => {
      this.progress = progress;
    });*/
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;
      console.log(this.file);
    }
  }
   imageError: string;
   isImageSaved: boolean;
   cardImageBase64: string;


  fileChangeEvent() {
    console.log(this.publicationForm.value);
      this.imageError = null;
      if (this.file) {
          // Size Filter Bytes
          const max_size = 2097152000000;
          const allowed_types = ['image/png', 'image/jpeg'];
          const max_height = 15200;
          const max_width = 25600;

         if (this.file.size > max_size) {
              this.imageError =
                  'Maximum size allowed is ' + max_size / 1000 + 'Mb';

              return false;
          }

          if (!_.includes(allowed_types, this.file.type)) {
              this.imageError = 'Only Images are allowed ( JPG | PNG )';
              return false;
          }
          const reader = new FileReader();
          reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = rs => {
                  const img_height = rs.currentTarget['height'];
                  const img_width = rs.currentTarget['width'];

                  console.log(img_height, img_width);


                  if (img_height > max_height && img_width > max_width) {
                      this.imageError =
                          'Maximum dimentions allowed ' +
                          max_height +
                          '*' +
                          max_width +
                          'px';
                      return false;
                  } else {
                      const imgBase64Path = e.target.result;
                      this.cardImageBase64 = imgBase64Path;
                      console.log(this.cardImageBase64);
                      this.isImageSaved = true;
                      this.PublicationService.uploadPublication(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
                        this.publication = response;
                        console.log(this.publication);
                        return this.publication;
                      });
                      // this.previewImagePath = imgBase64Path;
                  }
              };
          };

          reader.readAsDataURL(this.file);
      }
  }

  removeImage() {
      this.cardImageBase64 = null;
      this.isImageSaved = false;
  }

}
