import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './services/guards/auth.guard';
import { PilotComponent } from './pages/pilot/pilot.component';
import { PpoComponent } from './pages/ppo/ppo.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RoleGuard } from './services/guards/role.guard';
import { UserRole } from './models/user';
import { OptionsComponent } from './pages/admin/components/options/options.component';
import { UsersComponent } from './pages/admin/components/users/users.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { FlightsStatsComponent } from './pages/admin/components/flights-stats/flights-stats.component';
import { WaitingApprovalComponent } from './pages/pilot/waiting-approval/waiting-approval.component';
import { PilotStartComponent } from './pages/pilot/start/start.component';
import { PilotFlightComponent } from './pages/pilot/flight/flight.component';
import { PilotLbzForwardComponent } from './pages/pilot/lbz-forward/lbz-forward.component';
import { PilotReturnComponent } from './pages/pilot/return/return.component';
import { PilotLbzHomeComponent } from './pages/pilot/lbz-home/lbz-home.component';
import { PilotReductionComponent } from './pages/pilot/reduction/reduction.component';
import { PilotEndComponent } from './pages/pilot/end/end.component';
import { FLIGHT_ROUTES } from './consts/consts';
import { FlightTemplateComponent } from './pages/personal-info/flight-templates/flight-templates.component';
import { BrigadeComponent } from './pages/brigade/brigade.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'personal-info',
        pathMatch: 'full',
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'template',
        component: FlightTemplateComponent
      },
      {
        path: 'template/:id',
        component: FlightTemplateComponent
      },
      {
        path: 'flight',
        component: PilotComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.PILOT] },
        children:[
          {
            path: FLIGHT_ROUTES.START + '/:usePrev',
            component: PilotStartComponent
          },
          {
            path: FLIGHT_ROUTES.WAITING_APPROVAL,
            component: WaitingApprovalComponent
          },
          {
            path: FLIGHT_ROUTES.FLIGHT,
            component: PilotFlightComponent
          },
          {
            path: FLIGHT_ROUTES.LBZ_FORWARD,
            component: PilotLbzForwardComponent
          },
          {
            path: FLIGHT_ROUTES.RETURN,
            component: PilotReturnComponent
          },
          {
            path: FLIGHT_ROUTES.LBZ_HOME,
            component: PilotLbzHomeComponent
          },
          {
            path: FLIGHT_ROUTES.REDUCTION,
            component: PilotReductionComponent
          },          {
            path: FLIGHT_ROUTES.END,
            component: PilotEndComponent
          }
        ]
      },
      {
        path: 'ppo',
        component: PpoComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.PPO, UserRole.REB] }
      },
      {
        path: 'brigade',
        component: BrigadeComponent,
        canActivate: [RoleGuard],
        data: { roles: [UserRole.BRIGADE_ADMIN, UserRole.BRIGADE_PPO, UserRole.BRIGADE_REB] }
      },
      {
        path: 'admin',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'options',
            pathMatch: 'full'
          },
          {
            path: 'options',
            component: OptionsComponent,

          },
          {
            path: 'users',
            component: UsersComponent,
          },
          {
            path: 'flights',
            component: FlightsStatsComponent,
          },
        ],
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
