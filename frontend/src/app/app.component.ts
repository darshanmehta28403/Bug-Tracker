import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './shared/material.module';
import { SideNavComponent } from "./Components/side-nav/side-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MaterialModule, SideNavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bug Tracker';
}
