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
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
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
  subCategories:any=0;
  catId:any=0;
  subcatId:any=0;
  returnRegionsData:any;
  returnArrayRegionsFromServer:any;
  returnRegionsArray:any = [];
  regions:any;
  regionsId:any=0;
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
  functionFeachDataFromServer(catId:any=0,subCat:any=0,serchDataId:any=0,regionsId:any=0){
    this.storesService.allProducts(catId,subCat,serchDataId,regionsId).then(data=>{
      this.returnAllProductsData = data;
      this.operationResult = this.returnAllProductsData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnAllProductsArray=[];
        this.returnArrayAllProductsFromServer = this.returnAllProductsData.Data.products;
        this.countOfAllValues = this.returnAllProductsData.Data.countOfData;
        for(let i = 0; i < this.returnArrayAllProductsFromServer.length;i++){
          this.returnAllProductsArray[i]=[];
          this.returnAllProductsArray[i]['id'] = this.returnArrayAllProductsFromServer[i].id;
          this.returnAllProductsArray[i]['storeId'] = this.returnArrayAllProductsFromServer[i].storeId;
          this.returnAllProductsArray[i]['storesName'] = this.returnArrayAllProductsFromServer[i].storesName;
          this.returnAllProductsArray[i]['storesCatName'] = this.returnArrayAllProductsFromServer[i].storesCatName;
          this.returnAllProductsArray[i]['storesSubCatName'] = this.returnArrayAllProductsFromServer[i].storesSubCatName;
          this.returnAllProductsArray[i]['title'] = this.returnArrayAllProductsFromServer[i].title;
          this.returnAllProductsArray[i]['smallImage'] = this.returnArrayAllProductsFromServer[i].smallImage;
          this.returnAllProductsArray[i]['price'] = this.returnArrayAllProductsFromServer[i].price;
          this.returnAllProductsArray[i]['offerPrice'] = this.returnArrayAllProductsFromServer[i].offerPrice;
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
  searchAllValues(){
    this.functionFeachDataFromServer(0,this.searchValues)
  }
  async ngOnInit() {
    this.categoriesService.regions().then(data=>{
      this.returnRegionsData = data;
      this.operationResult = this.returnRegionsData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayRegionsFromServer = this.returnRegionsData.Data.regions;
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
    this.storesService.productsCategories().then(data=>{
      this.returnCategoriesData = data;
      this.operationResult = this.returnCategoriesData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayCategoriesFromServer = this.returnCategoriesData.Data.productsCategories;
        for(let i = 0; i < this.returnArrayCategoriesFromServer.length;i++) {
          this.returnCategoriesArray[i]=[];
          this.returnCategoriesArray[i]['id'] = this.returnArrayCategoriesFromServer[i].id;
          this.returnCategoriesArray[i]['title'] = this.returnArrayCategoriesFromServer[i].title;
        }
        let countOfData = this.returnCategoriesArray.length;
        if(countOfData == 0)
          this.categories = 0;
        else{
          this.categories = 1;
        }
      }else
        this.categories = 0;
    });
    this.functionFeachDataFromServer();
  }
  functionSelectCat(catId:any){
    this.catId = catId;
    this.returnSubCategoriesArray=[];
    this.storesService.productsSubCat(catId).then(data=>{
      this.returnSubCategoriesData = data;
      this.operationResult = this.returnSubCategoriesData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArraySubCategoriesFromServer = this.returnSubCategoriesData.Data.productsSubCat;
        for(let i = 0; i < this.returnArraySubCategoriesFromServer.length;i++) {
          this.returnSubCategoriesArray[i]=[];
          this.returnSubCategoriesArray[i]['id'] = this.returnArraySubCategoriesFromServer[i].id;
          this.returnSubCategoriesArray[i]['title'] = this.returnArraySubCategoriesFromServer[i].title;
        }
        let countOfData = this.returnSubCategoriesArray.length;
        if(countOfData == 0)
          this.subCategories = 0;
        else{
          this.subCategories = 1;
        }
      }else
        this.subCategories = 0;
    });
    this.subcatId = 0;
    this.functionFeachDataFromServer(this.catId,this.subcatId,this.searchValues,this.regionsId);
  }
  functionSelectSubCat(subcatId:any){
    this.subcatId = subcatId;
    this.functionFeachDataFromServer(this.catId,this.subcatId,this.searchValues,this.regionsId);
  }
  functionSelectregions(regions:any){
    this.regionsId = regions;
    this.functionFeachDataFromServer(this.catId,this.subcatId,this.searchValues,this.regionsId);
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
  functionProductsInformation(productsId:any,storeId:any){
    this.router.navigate(['/productsdetails', {proId:productsId,storeId:storeId,operation:1 }]);
  }
  functionAllProducts(){
    this.navCtrl.navigateRoot("/products");
  }
  functionOpenMenue(){
    this.menu.enable(true,"main-content");
    this.menu.open("main-content");
  }
}
