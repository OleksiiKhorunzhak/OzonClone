import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { User, UserRole } from 'src/app/models/user';
import { ToastsService } from 'src/app/services/toasts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  UserRoles = UserRole;

  users: User[] = [];

  login: string = '';
  password: string = '';
  role?: UserRole = UserRole.NOT_SELECTED;

	private toastService = inject(ToastsService);

  constructor(private userService: UserService) {}


  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getAllUsers();
  }

  async removeUser(id: string | undefined) {
    if(!id) return;

    await this.userService.removeUser(id);
    // alert('Користувач був видалений');
    this.toastService.showSuccess('Користувач був видалений.');

    this.users = await this.userService.getAllUsers();
  }

  async addNewUser() {
    try {
      const res = await this.userService.addUser({
        login: this.login,
        password: this.password,
        role: this.role,
        userOptions:{
          nickName: this.login
        }
      })
    } catch (error) {
      if(error instanceof HttpErrorResponse){
        if(error.status != 200){
          this.toastService.showError(`Користувач з позивним ${this.login} вже існує.`);
        }
      }
    }

    this.users = await this.userService.getAllUsers();
    this.toastService.showSuccess(`Користувач з позивним ${this.login} був створений`);
    this.login = '';
    this.password = '';
    this.role = UserRole.NOT_SELECTED;
  }

}
