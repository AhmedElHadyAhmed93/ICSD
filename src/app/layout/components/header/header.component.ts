import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../../shared/services/datatable-language.service';
import { TicketService } from '../../../ticket/ticket.service';
import { LoginsService } from '../../../login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public pushRightClass: string;
  LoggedInUser: any ={};
  constructor(private translate: TranslateService,
    public  LoginsService : LoginsService,
    private serviceApi: TicketService,
     public router: Router ,
      private DataTable: DataTableLanguageService) {

    this.translate.addLangs(['ar', 'en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('ar');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/ar|en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'ar');
    this.changeLang( browserLang);


    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  
  }

  ngOnInit() {
    this.pushRightClass = 'push-left';
    this.loadLoggedInData();
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
    //   dom.classList.addLangs('rtl');
    // dom.classList.removeItem('rtl');
  }

  onLoggedout() {
    this.LoginsService.logout().subscribe(resut=>{
      localStorage.removeItem('access_token');
      this.router.navigate(['/login']);
  });   
    localStorage.removeItem('isLoggedin');
  }

  changeLang(language: string) {
    const dom: any = document.querySelector('body');
    this.DataTable.language = {};
    if (language === 'ar') {
      this.DataTable.paginate = {
        first: 'الأول',
        last: 'الأخير',
        next: 'السابق',
        previous: 'التالي'
      };
      this.DataTable.language = {
        search :  'ابحث:',
        emptyTable : 'لم يُعثر على أية سجلات',
        infoEmpty : 'يعرض 0 إلى 0 من أصل 0 سجلّ',
        processing : 'جاري التحميل...',
        lengthMenu  : 'أظهر مُدخلات _MENU_',
        infoFiltered : '(منتقاة من مجموع _MAX_ مُدخل)',
        info : 'إظهار _START_ إلى _END_ من أصل _TOTAL_ مُدخل',
        paginate :  this.DataTable.paginate
      };
    } else {
      this.DataTable.paginate = {
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous'
      };
      this.DataTable.language = {
        search :  'Search:',
        emptyTable : 'No data available in table',
        infoEmpty : 'Showing 0 to 0 of 0 entries',
        processing : 'Loading...',
        lengthMenu  : 'Show _MENU_ entries',
        infoFiltered : '(filtered from _MAX_ total entries)',
        info : 'Showing _START_ to _END_ of _TOTAL_ entries',
        paginate :  this.DataTable.paginate
      };
    }
    if (language === 'ar' && dom.classList.toggle('rtl') !== true) {
      dom.classList.toggle('rtl');
    }
    if (language === 'en' && dom.classList.toggle('rtl') !== false) {
      dom.classList.toggle('rtl');
    }
    this.translate.use(language);
    this.serviceApi.ChangeLang(language).subscribe(list => {
         ;
    });
  }


  

  loadLoggedInData() {
    this.LoginsService.getLoggedInData().subscribe(response=>{
     
       this.LoggedInUser = response;
       console.log(this.LoggedInUser);
        this.LoginsService.save(response.data);
       this.router.navigate(['/']);

    });
}

logout () {
  
    this.LoginsService.logout().subscribe(resut=>{
        localStorage.removeItem('access_token');
        //$state.go('authentication.signin');
        this.router.navigate(['/login']);
    });              
}
}
