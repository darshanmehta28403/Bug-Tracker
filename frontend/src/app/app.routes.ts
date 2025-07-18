import { Routes } from '@angular/router';
import { BugsComponent } from './Components/bugs/bugs.component';
import { ProjectComponent } from './Components/project/project.component';
import { UsersComponent } from './Components/users/users.component';
import { SigninComponent } from './Components/Authentication/signin/signin.component';
import { RegisterComponent } from './Components/Authentication/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProjectComponent } from './Components/project/add-project/add-project.component';
import { ViewProjectComponent } from './Components/project/view-project/view-project.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AdminGuard } from './Guards/admin.guard';
import { AddBugComponent } from './Components/bugs/add-bug/add-bug.component';
import { AdminPanelComponent } from './Components/Admin/admin-panel.component';

export const routes: Routes = [
    {
        path: '',
        component: ProjectComponent
    },
    {
        path: 'bugs',
        component: BugsComponent
    },
    {
        path: 'project',
        component: ProjectComponent
    },
    {
        path: 'user',
        component: UsersComponent
    },
    {
        path: 'signin',
        component: SigninComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'addProject',
        component: AddProjectComponent
    },
    {
        path: 'addBug',
        component: AddBugComponent
    },
    {
        path: 'viewProject/:id',
        component: ViewProjectComponent
    },
    {
        path: 'dasbboard',
        component: DashboardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'adminPanel',
        component: AdminPanelComponent,
        canActivate: [AdminGuard]
    },
    //Changes here....
];


