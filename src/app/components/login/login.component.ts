import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from 'src/app/shared/model/user';
import { TitleService } from 'src/app/core/services/title.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public error = '';
  public loading = false;
  private returnUrl: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              public titleService: TitleService) {
    titleService.setToolbarTitle('Anmelden', true);

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get form() { return this.loginForm.controls; }

  public onSubmit() {
    this.error = '';

    this.loading = true;
    this.authenticationService.login(this.form.username.value, this.form.password.value, false).subscribe(
      (user: User) => {
        this.router.navigate(['']);
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
  }
}
