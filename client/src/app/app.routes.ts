import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { EventComponent } from './event/event.component';


export const routes: Routes = [

    {path:"", component:HomeComponent},
    {path:"search", component:SearchComponent},
    {path:"event/:id", component:EventComponent},

];