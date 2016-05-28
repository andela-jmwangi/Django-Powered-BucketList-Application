import {Component, ElementRef, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignUpComponent } from '../auth/signup/signup.component';
import { Router } from '@angular/router';
import { BucketService } from '../bucketlist/bucketlist.service';
import { Bucketlist } from '../bucketlist/bucketlist';
import { BucketItem } from '../bucketlist/bucketitem';
import { HTTP_PROVIDERS } from '@angular/http';
import {CanActivate} from '@angular/router-deprecated';
declare var jQuery: JQueryStatic;

@Component({
    selector: 'home-page',
    providers: [BucketService, HTTP_PROVIDERS],
    directives: [LoginComponent],
    templateUrl: 'app/home/home.component.html',
    styleUrls: ['assets/css/grid.css']
})


export class HomeComponent implements OnInit{
    openPage: string;
    editing = false;
    @Input() bucketlist: Bucketlist[];
    @Input() bucketitem: BucketItem[];
    @Input() bucket: Bucketlist;
    @Input() itemcount: number;
    @Input() hasItems: boolean = false;
    currentTitle: string;
    @Input() public selectedBucket: Bucketlist;

    private bctlst:Bucketlist[];
    constructor(private el: ElementRef, private _router: Router, private bucketService: BucketService) {
        this.openPage = "login";
    }
    ngOnInit(){
        var token = localStorage.getItem('auth_token');
        if (token){
            this.bucketService.getBucketLists().subscribe(
                data => this.onComplete(data),
                err => this.logError(err),
                () => console.log('Authentication Complete')
            );
        }
    }
    onSelect(bucketitem: Bucketlist) {
        this.selectedBucket = bucketitem;
        this.itemcount = Object.keys(bucketitem.items).length;
        console.log(this.selectedBucket);
    }
    logError(err: any) {
        console.log(err["_body"]);
    }
    onComplete(data: any) {
        console.log(data["results"]);
        this.bucketlist = data["results"];
    }
    addItem(itemname: string) {
        var index=this.bucketlist.indexOf(this.selectedBucket);
        var item = new BucketItem;
        item.name = itemname;
        this.selectedBucket.items.push(item)
        var token = localStorage.getItem('auth_token');
        if (token){
            this.bucketService.saveBucketItem.subscribe(
                data => this.onComplete(data),
                err => this.logError(err),
                () => console.log('Authentication Complete')
            );
        }
    }


    // getHeroes() {
    //     this.bucketService.getBucketlists().then(bucketlist => {
    //         this.bucketlist = bucketlist;
    //         console.log(this.bucket.name);

    //         if (this.bucketlist.length > 0) {
    //             console.log(bucketlist[7].name);
    //             this.hasItems = true;
    //         }else{
    //             this.hasItems = false;
    //         }
    //     });
    // }
    editCard() {
        this.editing = true;
        this.currentTitle = this.bucket.name;
        let textArea = this.el.nativeElement.getElementsByTagName('textarea')[0];
        setTimeout(function() {
            textArea.focus();
        }, 0);
    }
    togglenav(event:any){
        event.preventDefault();
        jQuery(this.el.nativeElement)
            .find('#wrapper').toggleClass("toggled");
    }
    blurOnEnter(event:any) {
        if (event.keyCode === 13) {
            event.target.blur();
        } else if (event.keyCode === 27) {
            this.bucket.name = this.currentTitle;
            this.editing = false;
        }
    }
    updateCard() {
        if (!this.bucket.name || this.bucket.name.trim() === '') {
            this.bucket.name = this.currentTitle;
        }
        // this._cardService.put(this.card).then(res => {
        //     this._ws.updateCard(this.card.boardId, this.card);
        // });
        this.editing = false;
    }
}

