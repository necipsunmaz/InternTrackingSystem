import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  goToFeatures() {
    document.getElementById('features').scrollIntoView({
      behavior: 'smooth'
    });
  }
}
