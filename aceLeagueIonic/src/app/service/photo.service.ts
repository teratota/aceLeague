import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  private PHOTO_STORAGE = 'photos';

  public base2 : any;

  public image: any;
  public blob: any;
  public base:any;

  constructor( private sanitizer: DomSanitizer,public platform: Platform) { }



  public async addNewToGallery(file = null) {
    
    this.photos=[]
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      //source: CameraSource.Camera,
      quality: 50
    });

    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(capturedPhoto && (capturedPhoto.webPath));
    this.blob = await fetch(capturedPhoto.webPath).then(r => r.blob());

    this.base = await this.readAsBase64(capturedPhoto);

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos.map(p => {
              const photoCopy = { ...p };
              delete photoCopy.base64;
              return photoCopy;
              }))
    });

    return savedImageFile;

  }

  saveuploadfile(file){
    var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    

    let url = "./"
    let platform = this.platform.platforms()
    
    if(platform[0]=="electron"){
      const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Documents
      });

      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }else {
      const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Data
      });
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })

  public async loadSaved() {
    const photos = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photos.value) || [];
    let platform = this.platform.platforms()
    if(platform[0]=="electron"){
    for (const photo of this.photos) {
            const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Documents
        });
            photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
      }
    }else{
      for (const photo of this.photos) {
        const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: FilesystemDirectory.Data
      });
        photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async takePicture() {
    const takenImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      quality: 85
    });
    
  }

  public async deletePicture(photo: Photo, position: number) {
    this.photos.splice(position, 1);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    let platform = this.platform.platforms()
    if(platform[0]=="electron"){
    const filename = photo.filepath
    .substr(photo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Documents
    });
    }else{
      const filename = photo.filepath
      .substr(photo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
    }
  }

}



interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}
