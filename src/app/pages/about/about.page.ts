import { Component, OnInit } from '@angular/core';
import {MenuController, NavController, Platform} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  description:any;
  isThere:any = 1;
  returnData:any;
  operationResult:any;
  loadingShow:any = 0;
  constructor(private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','about');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  ngOnInit() {
    this.loadingShow = 1;
    this.usersService.aboutApp().then(data=>{
      this.returnData = data;
      this.operationResult = this.returnData.Error.ErrorCode;
      if(this.operationResult==1){
       this.description = this.returnData.Data.description;
       if(this.description)
         this.isThere = 1;
       else
         this.isThere = 0;
      }
      else if(this.operationResult==2){
        this.isThere = 0;
      }
      this.loadingShow = 0;
    });
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToStores(){
    this.navCtrl.navigateRoot("/stores");
  }
  functionAllProducts(){
    this.navCtrl.navigateRoot("/products");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  functionOpenMenue(){
    this.menu.enable(true,"main-content");
    this.menu.open("main-content");
  }
}
