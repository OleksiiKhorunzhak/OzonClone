import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DroneOptions } from 'src/app/models/options';
import { User, Template } from 'src/app/models/user';
import { OptionsService } from 'src/app/services/options.service';
import { ToastsService } from 'src/app/services/toasts.service';
import { UserService } from 'src/app/services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-flight-template',
  templateUrl: './flight-templates.component.html',
  styleUrls: ['./flight-templates.component.scss']
})
export class FlightTemplateComponent implements OnInit, OnDestroy {
  template: Template = {
    templateName: '',

  };
  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  sub: Subscription | null = null;
  templateId: string | null = null;
  ui: User | null = null;
  
  private toastService = inject(ToastsService);

  constructor(private userService: UserService,
    private optionsService: OptionsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();
    this.ui = this.userService.getUserInfo();


    this.sub = this.route.params.subscribe(params => {
      this.templateId = params['id'];

      if (this.templateId) {
        const template = this.ui?.userOptions?.templates?.find(x => x.id === this.templateId);
        if (template) {
          this.template.assignment = this.options.dronAppointment?.find(x => x.name.toUpperCase() == template.assignment?.name?.toUpperCase());
          this.template.model = this.options.dronModels?.find(x => x.name.toUpperCase() == template.model?.name?.toUpperCase());

          this.template.controlRange = template.controlRange;
          this.template.templateName = template.templateName;
          this.template.videoRange = template.videoRange;
          this.template.workingHeight = template.workingHeight;
          this.template.id = template.id;
        }
      }
    });
  }

  async editTemplate() {
    await this.userService.editTemplate(this.template);

    // alert(`Шаблон з іменем ${this.template.templateName} було успішно змінено.`);
    this.toastService.showSuccess(`Шаблон з іменем ${this.template.templateName} було успішно змінено.`);

    this.router.navigate(["personal-info"]);

    this.template = {
      templateName: '',
    };
  }

  async createTemplate() {
    this.template.id = uuidv4();
    await this.userService.addTemplate(this.template);

    // alert(`Шаблон з іменем ${this.template.templateName} було успішно створено.`);
    this.toastService.showSuccess(`Шаблон з іменем ${this.template.templateName} було успішно створено.`);

    this.router.navigate(["personal-info"]);

    this.template = {
      templateName: '',
    };
  }

  validateTemplate() {
    return this.template.templateName === null || this.template.templateName === ''
      || this.template.assignment == null
      || this.template.model == null
  }
}
