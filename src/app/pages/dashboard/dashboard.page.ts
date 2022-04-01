import {Component, OnInit,ViewChild,Renderer2,ElementRef} from '@angular/core';
import {MenuController, Platform, NavController, IonSlides,ToastController,ModalController} from '@ionic/angular';
import {CategoriesService} from "../../services/categories.service";
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import {Storage} from "@ionic/storage";
import {SortandfilterComponent} from "../sortandfilter/sortandfilter.component";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonInfiniteScroll } from '@ionic/angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  returnAllProductsArray:any = [];
  returnAllProductsData:any;
  operationResult:any;
  countOfAllValues:any;
  countOfAllValuesDivOnTen:any;
  returnArrayAllProductsFromServer:any;
  stores:any=1;
  searchValues:any;
  returnCategoriesData:any;
  returnArrayCategoriesFromServer:any;
  returnCategoriesArray:any = [];
  categories:any;
  returnSubCategoriesData:any;
  returnArraySubCategoriesFromServer:any;
  returnSubCategoriesArray:any = [];
  subCategories:any;
  catId:any=0;
  subcatId:any=0;
  returnRegionsData:any;
  returnArrayRegionsFromServer:any;
  returnRegionsArray:any = [];
  regions:any;
  regionsId:any=0;
  proId:any;
  valColor:any;
  constructor(private activaterouter : ActivatedRoute,private toastCtrl: ToastController,private callNumber: CallNumber,public geolocation: Geolocation,private launchNavigator: LaunchNavigator,private renderer:Renderer2,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','stores');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  functionFeachDataFromServer(productId:any=0,valColor:any=0){
    this.storesService.dashboard(productId).then(data=>{
      this.returnAllProductsData = data;
      this.operationResult = this.returnAllProductsData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnAllProductsArray=[];
        this.returnArrayAllProductsFromServer = this.returnAllProductsData.Data.products;
        this.countOfAllValues = this.returnAllProductsData.Data.countOfData;
        for(let i = 0; i < this.returnArrayAllProductsFromServer.length;i++){
          this.returnAllProductsArray[i]=[];
          this.returnAllProductsArray[i]['id'] = this.returnArrayAllProductsFromServer[i].id;
          this.returnAllProductsArray[i]['storesName'] = this.returnArrayAllProductsFromServer[i].storesName;
          this.returnAllProductsArray[i]['title'] = this.returnArrayAllProductsFromServer[i].title;
          this.returnAllProductsArray[i]['price'] = this.returnArrayAllProductsFromServer[i].price;
          let dateUse= new Date();
          this.returnAllProductsArray[i]['date'] = dateUse.getHours()+":"+dateUse.getMinutes();
          if(valColor == 0){
            if(i%2 == 0)
              this.returnAllProductsArray[i]['class']="colorClassGreen";
            else
              this.returnAllProductsArray[i]['class']="colorClassRed";
            this.valColor = 1
          }else{
            if(i%2 == 0)
              this.returnAllProductsArray[i]['class']="colorClassRed";
            else
              this.returnAllProductsArray[i]['class']="colorClassGreen";
            this.valColor = 0
          }
        }
        let countOfData = this.returnAllProductsArray.length;
        if(countOfData == 0){
          this.stores = 0;
        }
        else{
          this.functionDataSetTime();
          this.stores = countOfData;
        }
      }else
        this.stores = 0;
    });
  }

  ngOnInit() {
    this.storesService.productDash().then(data=>{
      this.returnRegionsData = data;
      this.operationResult = this.returnRegionsData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayRegionsFromServer = this.returnRegionsData.Data.productDash;
        for(let i = 0; i < this.returnArrayRegionsFromServer.length;i++) {
          this.returnRegionsArray[i]=[];
          this.returnRegionsArray[i]['id'] = this.returnArrayRegionsFromServer[i].id;
          this.returnRegionsArray[i]['title'] = this.returnArrayRegionsFromServer[i].title;
        }
        let countOfData = this.returnRegionsArray.length;
        if(countOfData == 0)
          this.regions = 0;
        else{
          this.regions = 1;
        }
      }else
        this.regions = 0;
    });
    this.functionFeachDataFromServer();
  }
  functionSelectProduct(proId:any){
    this.proId = proId;
    this.functionFeachDataFromServer(proId)
  }
  functionDataSetTime(){
    setTimeout(()=>{
      this.functionFeachDataFromServer(this.proId,this.valColor)
    },1000);
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
  async functionStoreInformation(proId:any){
    this.router.navigate(['/dashboardstores', {proId:proId}])
  }
  openSearchPage(){
    this.navCtrl.navigateRoot("/search");
  }
}
