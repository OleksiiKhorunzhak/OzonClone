import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, Template, UserRole } from 'src/app/models/user';
import { ToastsService } from 'src/app/services/toasts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  userInfo: User = {
    userOptions: {
      nickName: '',
      unitNumber: '',
      dronType: '',
      dronModel: '',
      dronAppointment: '',
      unit: '',
      templates: []
    }
  };

  userRole?: UserRole;
  oldPassword = '';
  newPassword = '';

  private toastService = inject(ToastsService);

  constructor(private router: Router,
              private userService: UserService) { }


  ngOnInit(): void {
    this.initUserInfo();
  }

  async saveChanges() {

    await this.userService.updateUser(this.userInfo);

    var ui = this.userService.getUserInfo();

    if (ui) {
      this.userInfo = ui;
      this.userRole = ui.role;
    }
  }

  async changePassword() {

    if (this.oldPassword === this.userInfo.password) {
      this.userInfo.password = this.newPassword;
      await this.userService.updateUser(this.userInfo);

      var ui = this.userService.getUserInfo();

      if (ui) {
        this.userInfo = ui;
      }

      // alert('Пароль було змінено');
      this.toastService.showSuccess('Пароль було змінено.');
      this.newPassword = '';
      this.oldPassword = '';

    } else {
      // alert('Невірний пароль!');
      this.toastService.showError('Невірний пароль!');
    }
  }

  public async removeTemplate(templateId: string) {
    await this.userService.removeTemplate(templateId);
    this.initUserInfo();
  }

  editTemplate(templateId: string) {
    this.router.navigate(["template/" + templateId]);
  }

  public createTemplate() {
    this.router.navigate(["template"]);
  }

  private async initUserInfo() {
    var ui = this.userService.getUserInfo();
    if (ui) {
      this.userInfo = ui;
      this.userRole = ui.role;
      if(!this.userInfo.userOptions) {
        this.userInfo.userOptions = {}
      }
    }
  }

  public get UserRoles() {
    return UserRole;
  }
}
