import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  fullName:any;
  errorFullName:any="";
  isErrorFullName:any = 1;

  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;

  msg:any;
  errorMsg:any="";
  isErrorMsg:any = 1;

  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  loadingShow:any = 0;
  returnFullName:any;
  returnNumber:any;
  storeId:any;
  email:any;
  dates:any;
  constructor(private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController,private router : Router,private activaterouter : ActivatedRoute) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','home');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
  }
  async ngOnInit() {
    this.activaterouter.params.subscribe(params => {
      this.storeId = params['storeId'];
    });
  }
  checkdate(event){
    this.dates = event;
  }
  async reservation(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','connectus');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.loadingShow = 1;
    if(this.fullName != undefined && this.number != undefined && this.email != undefined){
      this.usersService.reservation(this.storeId,this.fullName,this.number,this.email,this.dates).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.message = "?????? ?????????? ?????????? ??????????";
          this.displayResult(this.message);
          this.loadingShow = 0;
          this.msg = "";
        }
        else if(this.operationResult==2){
          this.message = "???? ?????? ?????????? ?????????? ??????????...???????????????? ??????????";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }
        else{
          this.message = "???? ?????? ?????????? ?????????? ??????????...???????? ?????? ????????";
          this.displayResult(this.message);
          this.loadingShow = 0;
        }
      }).catch(e=>{
        this.message = "???? ?????? ?????????? ?????????? ??????????...???????? ?????? ???????? ???????? ??????";
        this.displayResult(this.message);
        this.loadingShow = 0;
      })
      this.isdisabled = true;
    }
  }
  async displayResult(message){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToStores(){
    this.navCtrl.navigateRoot("/stores");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  functionOpenMenue(){
    this.menu.enable(true,"main-content");
    this.menu.open("main-content");
  }
}
