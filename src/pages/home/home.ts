import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { ResultsPage } from '../results/results';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  options : CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: this.camera.Direction.FRONT
  }

  selectedDrink: string;

  selectorImage : string;

  drinkList : Array<string> = [
    'Felix Felicis',
    'Dementor\'s Kiss',
    'Giggle Water',
    'Voldemort\'s Taint',
    'Always',
    'I Should Not Have Said That',
    'Draught of Living Death',
    'Lockhart\'s Demise',
    'Goblet of Fire',
    'Infusion of Gurdyroots',
    'Ogden\'s Old Firewhisky',
  ];

  constructor(public navCtrl: NavController, private camera: Camera, private alert : AlertController, private storage :Storage) {

  }

  ngOnInit() : void {

  }

  viewResults() : void {
    let alert = this.alert.create({
      title: 'What is your quest?',
      inputs: [{
        name: 'password',
        placeholder: 'Well?',
        type : 'password'
      }],
      buttons: [
         {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Go!',
        handler: data => {
          if (data.password === 'mammon') {
            this.navCtrl.push(ResultsPage);
          } else {
            return false;
          }
        }
      }
      ]
    });

    alert.present();
  }

  selectDrink() : void {
    console.log(this.selectedDrink);
    this.summonCamera();
  }

  summonCamera() : void {
    this.camera.getPicture(this.options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.selectorImage = base64Image;
    }, (err) => {
      console.log(err);
    });
  }

  saveSelection() : void {
    this.storage.get('drinkList').then((item) => {
      let existingVotes = [];

      if (item) {
        existingVotes = JSON.parse(item);
      }

      existingVotes.push({drink: this.selectedDrink, image: this.selectorImage});
      this.storage.set('drinkList', JSON.stringify(existingVotes));

      this.setupForNextGuest();
    });
  }

  cancel() : void {
    this.selectedDrink = null;
    this.selectorImage = null;
  }

  setupForNextGuest() : void {
    this.selectedDrink = null;
    this.selectorImage = null;

    let alert = this.alert.create({
      title: 'Success!',
      subTitle: 'The booze sorting hat has noted your vote.',
      buttons: ['OK']
    });
    alert.present();
  }
}