import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'divertidafront';
  showArrow: boolean = false;
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showArrow = window.scrollY > 300;
  }

  scrollToTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' }); 
  }
}
