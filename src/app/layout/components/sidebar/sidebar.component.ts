import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginsService } from '../../../login/login.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;

  @Output() collapsedEvent = new EventEmitter<boolean>();
  public LoggedInUser:any ={};
  constructor(private translate: TranslateService, public router: Router,public LoginsService: LoginsService) {

    this.translate.addLangs(['ar', 'en']);
    this.translate.setDefaultLang('ar');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/ar|en/) ? browserLang : 'ar');
    this.changeLang(browserLang);
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';

    this.LoginsService.getLoggedInData().subscribe(response=>{
      this.LoggedInUser = response;
  });

  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }


  changeLang(language: string) {
    const dom: any = document.querySelector('body');
    if (language === 'ar' && dom.classList.toggle('rtl') !== true) {
      dom.classList.toggle('rtl');
    }
    if (language === 'en' && dom.classList.toggle('rtl') !== false) {
      dom.classList.toggle('rtl');
    }
    this.translate.use(language);
  }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
  }
}
