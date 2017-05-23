import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage implements OnInit {

  selections : Array<any>;
  images : Array<string> = [];
  summary : Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert : AlertController, private storage : Storage) {
  }

  ngOnInit() : void {
    console.log("Loading storage");
    
    this.storage.get('drinkList').then((storage) => {
      let existingVotes = [];

      if (storage) {
        existingVotes = JSON.parse(storage);
      }

      this.selections = existingVotes;

      let tmpSummary = this.selections.reduce((acc, cv, i) => {
        if (!acc[cv.drink]) {
          acc[cv.drink] = 0;
        }

        acc[cv.drink] = acc[cv.drink] + 1;

        console.log(acc);

        return acc;
      }, {});

      for (let i in tmpSummary) {
        if (!tmpSummary.hasOwnProperty(i)) {
          continue;
        }
        this.summary.push({name : i, count : tmpSummary[i]});
      }
    });
  }

  clearStorage() : void {
    let alert = this.alert.create({
      title: 'You Sure you want to do that?',
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
          this.storage.clear();
        }
      }
      ]
    });

    alert.present();
  }
}
