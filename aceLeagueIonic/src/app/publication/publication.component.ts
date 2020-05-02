import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/service/publication.service';
import { PhotoService } from 'src/app/service/photo.service';
import { ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  publicationForm = new FormGroup({
    description:new FormControl('',[
      Validators.required
    ])                                                            
  });

  publication : any;

  constructor(private PublicationService: PublicationService, private photoService: PhotoService,  public actionSheetController: ActionSheetController) { }

  ngOnInit() {}

  photo(){
    this.photoService.addNewToGallery()
  }

  send(){
    console.log(this.photoService.blob)
    console.log(this.photoService.base)
    this.PublicationService.uploadPublication(this.photoService.base, this.publicationForm.value).subscribe(response => {
      this.publication = response;
      console.log(this.publication);
      return this.publication;
    });
  }

  public async showActionSheet(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }
}
