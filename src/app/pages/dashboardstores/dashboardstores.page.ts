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
  selector: 'app-dashboardstores',
  templateUrl: './dashboardstores.page.html',
  styleUrls: ['./dashboardstores.page.scss'],
})
export class DashboardstoresPage implements OnInit {
  storesStoreSkeleton:boolean=true;
  loopingNumber:any = 1;
  countOfAllValuesDivOnTen:any;
  lastAllStoresSortSelect:any;
  catSelected:any = [];
  subCatSelected:any = [];
  countOfAllValues:any;
  categoriesSkeleton:boolean=true;
  returnCategoriesArray:any = [];
  categories:any=1;
  subCategoriesSkeleton:boolean=true;
  returnSubCategoriesArray:any = [];
  subCategories:any=1;
  selectedTypaOfOperationFilter:any=0;
  lightFilter:any="filterIconNew";
  filterLight:any="filterNotLight";
  fullNameLogin:any;
  emailLogin:any;
  showLinkFavourite:any=0;
  stores:any=1;
  returnAllStoresArray:any = [];
  returnAllStoresDataNext :any;
  operationResult:any;
  returnArrayAllStoresNextFromServer:any;
  region:any=[];
  returnAllStoresData:any;
  returnArrayAllStoresFromServer:any;
  returnAllStoresNewData:any;
  returnArrayAllStoresNewFromServer:any = [];
  returnStoresHomeData:any;
  returnArrayStoresHomeFromServer:any;
  returnStoresForeData:any;
  returnArrayStoresForeFromServer:any;
  message:any;
  regionsStoreSelected:any;
  regionCount:any = "المناطق";
  showTypeOfShowData:any="filterIconNewLight";
  showTypeOfShowDataTow:any="filterIconShowData";
  typeShow:any=1;
  userId:any;
  homeCategories:any = 0;
  selectedCatValFromHome:any = 0;
  storageCat:any;
  storageSubCat:any;
  storageragion:any;
  countOfStoresFav:any
  proId:any;
  returnAllProductsArray:any = [];
  returnAllProductsData:any;
  returnArrayAllProductsFromServer:any;
  searchValues:any;
  returnCategoriesData:any;
  returnArrayCategoriesFromServer:any;
  returnSubCategoriesData:any;
  returnArraySubCategoriesFromServer:any;
  catId:any=0;
  subcatId:any=0;
  returnRegionsData:any;
  returnArrayRegionsFromServer:any;
  returnRegionsArray:any = [];
  regions:any;
  regionsId:any=0;
  valColor:any;
  constructor(private activaterouter : ActivatedRoute,private toastCtrl: ToastController,private callNumber: CallNumber,public geolocation: Geolocation,private launchNavigator: LaunchNavigator,private renderer:Renderer2,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','stores');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/dashboard");
    });
  }
  functionFeachDataFromServer(proId:any){
    this.storesService.dashboardStores(proId).then(data=>{
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
          this.returnAllProductsArray[i]['title'] = this.returnArrayAllProductsFromServer[i].productTitle;
          this.returnAllProductsArray[i]['price'] = this.returnArrayAllProductsFromServer[i].price;
        }
        let countOfData = this.returnAllProductsArray.length;
        if(countOfData == 0){
          this.stores = 0;
        }
        else{
          this.stores = countOfData;
        }
      }else
        this.stores = 0;
    });
  }
  ngOnInit() {
    this.activaterouter.params.subscribe(params => {
      this.proId = params['proId'];
    });
    this.functionFeachDataFromServer(this.proId);
  }
  async functionStoreInformation(storeId:any){
    this.router.navigate(['/storedetails', {storeId:storeId,pageBack:1}])
  }
  functionGoToStores(){
    this.navCtrl.navigateRoot("/stores");
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  functionAllProducts(){
    this.navCtrl.navigateRoot("/products");
  }
  functionOpenMenue(){
    this.menu.enable(true,"main-content");
    this.menu.open("main-content");
  }
  openSearchPage(){
    this.navCtrl.navigateRoot("/search");
  }
}
