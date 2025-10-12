import { Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventsCreateComponent } from './events-create/events-create.component';
import { EventsUpdateComponent } from './events-update/events-update.component';


export const routes: Routes = [

    {path:"admin", component:AdminHomeComponent},
    {path:"admin/event-list", component:EventsListComponent},
    {path:"admin/event-create", component:EventsCreateComponent},
    {path:"admin/event-edit/:id", component:EventsUpdateComponent},

];