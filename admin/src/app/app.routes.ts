import { Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventsCreateComponent } from './events-create/events-create.component';
import { EventsUpdateComponent } from './events-update/events-update.component';


export const routes: Routes = [

    {path:"", component:AdminHomeComponent},
    {path:"event-list", component:EventsListComponent},
    {path:"event-create", component:EventsCreateComponent},
    {path:"event-update/:id", component:EventsUpdateComponent},

];