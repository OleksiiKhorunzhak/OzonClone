import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { PilotComponent } from './pages/pilot/pilot.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PpoComponent } from './pages/ppo/ppo.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OptionsComponent } from './pages/admin/components/options/options.component';
import { UsersComponent } from './pages/admin/components/users/users.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { FlightsStatsComponent } from './pages/admin/components/flights-stats/flights-stats.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { BoardingStatusComponent } from './pages/admin/components/options/boarding-status/boarding-status.component';
import { DronAppointmentComponent } from './pages/admin/components/options/dron-appointment/dron-appointment.component';
import { DiscordStatusComponent } from './pages/admin/components/options/discord/discord.component';
import { DronModelComponent } from './pages/admin/components/options/dron-model/dron-model.component';
import { FlightStatusComponent } from './pages/admin/components/options/flight-status/flight-status.component';
import { PilotStartComponent } from './pages/pilot/start/start.component';
import { PilotFlightComponent } from './pages/pilot/flight/flight.component';
import { PilotLbzForwardComponent } from './pages/pilot/lbz-forward/lbz-forward.component';
import { PilotLbzHomeComponent } from './pages/pilot/lbz-home/lbz-home.component';
import { PilotReturnComponent } from './pages/pilot/return/return.component';
import { PilotReductionComponent } from './pages/pilot/reduction/reduction.component';
import { PilotEndComponent } from './pages/pilot/end/end.component';
import { WaitingApprovalComponent } from './pages/pilot/waiting-approval/waiting-approval.component';
import { FlightCardComponent } from './pages/shared/flight-card/flight-card.component';
import { SortDirective } from './directives/sort.directive';
import { FlightTemplateComponent } from './pages/personal-info/flight-templates/flight-templates.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { YesNoModalComponent } from './pages/shared/yes-no-modal/yes-no-modal.component';
import { ConfirmModalComponent } from './pages/shared/confirm-modal/confirm.component';
import { GlobalToastComponent } from './pages/shared/global-toast/global-toast.component';
import { ToastsContainerComponent } from './pages/shared/toasts-container/toasts-container.component';
import { AppErrorHandler } from './utils/error-handler';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { BrigadeComponent } from './pages/brigade/brigade.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    PilotComponent,
    PilotStartComponent,
    WaitingApprovalComponent,
    PilotFlightComponent,
    PilotLbzForwardComponent,
    PilotReturnComponent,
    PilotLbzHomeComponent,
    PilotReductionComponent,
    PilotEndComponent,
    PpoComponent,
    BrigadeComponent,
    AdminComponent,
    OptionsComponent,
    UsersComponent,
    PersonalInfoComponent,
    FlightTemplateComponent,
    FlightsStatsComponent,
    BoardingStatusComponent,
    DronAppointmentComponent,
    DiscordStatusComponent,
    DronModelComponent,
    FlightStatusComponent,
    FlightCardComponent,
    SortDirective,
    GlobalToastComponent,
    ToastsContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxMaskDirective,
    HttpClientModule,
    ColorPickerModule,
    NgbModule,
    YesNoModalComponent,
    ConfirmModalComponent
  ],
  providers: [provideNgxMask(),
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
