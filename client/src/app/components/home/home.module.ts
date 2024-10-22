import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from 'src/app/home/home-routing.module';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';

const routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'photos',
    component: PhotosComponent,
  },
];

@NgModule({
  declarations: [HomeComponent, PhotosComponent, ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class HomeModule {}
