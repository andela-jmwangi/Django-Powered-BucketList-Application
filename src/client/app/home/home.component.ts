import {Component, ElementRef, Input} from '@angular/core';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignUpComponent } from '../auth/signup/signup.component';
import { Router } from '@angular/router';
import { BucketService } from '../bucketlist/bucketlist.service';
import { Bucketlist } from '../bucketlist/bucketlist';

declare var jQuery: JQueryStatic;

@Component({
    selector: 'home-page',
    providers: [BucketService],
    directives: [LoginComponent],
    templateUrl: 'app/home/home.component.html',
    styleUrls: ['assets/css/grid.css']
})

export class HomeComponent {
    openPage: string;
    editing = false;
    @Input() bucketlist: Bucketlist[];
    @Input() bucket: Bucketlist;
    @Input() hasItems: boolean = false;
    currentTitle: string;
    @Input() public selectedBucket: Bucketlist;
    constructor(private el: ElementRef, private _router: Router, private bucketService: BucketService) {
        this.openPage = "login";
        this.getHeroes();


    }
    onSelect(bucketitem: Bucketlist) {
        this.selectedBucket = bucketitem;
        console.log(this.selectedBucket);
    }
    getHeroes() {
        this.bucketService.getBucketlists().then(bucketlist => {
            this.bucketlist = bucketlist;
            console.log(this.bucket.name);

            if (this.bucketlist.length > 0) {
                console.log(bucketlist[7].name);
                this.hasItems = true;
            }
        });
    }
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
