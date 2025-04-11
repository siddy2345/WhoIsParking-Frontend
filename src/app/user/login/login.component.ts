import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AccountProcessOption } from './login.model';
import {
  AccessTokenResponse,
  API_BASE_URL,
  IdentityClient,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
} from '../../services/whoIsParking-api.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AUTH_TOKEN_LOCAL_STORAGE,
  REFRESH_TOKEN_LOCAL_STORAGE,
} from '../../models/shared.models';
import { Router } from '@angular/router';
import { AuthEventService } from '../../services/auth/auth-event.service';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  protected userReactiveForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])(.{6,})$/
      ),
    ]),
  });

  protected accountProcessOptions = AccountProcessOption;

  protected accountProcessOptionsSig = signal(AccountProcessOption.Login);

  private readonly identityService = inject(IdentityClient);
  private readonly authEventService = inject(AuthEventService);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    const authToken = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE);

    if (
      (authToken !== null && refreshToken !== null) ||
      refreshToken !== null
    ) {
      this.router.navigate([`${this.authEventService.desiredRouteSig()}`]);
    }
  }

  public onRegister(): void {
    const email = this.userReactiveForm.controls.email.value;
    const password = this.userReactiveForm.controls.password.value;
    if (
      this.userReactiveForm.valid &&
      typeof email === 'string' &&
      typeof password === 'string'
    )
      this.identityService
        .register(new RegisterRequest({ email, password }))
        .subscribe({
          error: (err) => console.log(err), //FIXME: do better
        });
  }

  public onLogin(): void {
    const email = this.userReactiveForm.controls.email.value;
    const password = this.userReactiveForm.controls.password.value;
    if (
      this.userReactiveForm.valid &&
      typeof email === 'string' &&
      typeof password === 'string'
    )
      this.identityService
        .login(new LoginRequest({ email, password }))
        .subscribe({
          next: (tokenResponse) => {
            this.handleTokenResponse(tokenResponse);
            this.router.navigate([this.authEventService.desiredRouteSig()]);
          },
          error: (err) => {
            console.log(err); //FIXME: do better
          },
        });
  }

  public onChangeAccProcessOption(
    accountProcessOption: AccountProcessOption
  ): void {
    accountProcessOption === AccountProcessOption.Login
      ? this.accountProcessOptionsSig.set(AccountProcessOption.Login)
      : this.accountProcessOptionsSig.set(AccountProcessOption.Register);
  }

  private handleTokenResponse(tokenResponse: AccessTokenResponse): void {
    if (!tokenResponse.accessToken || !tokenResponse.refreshToken)
      throw new Error('Response tokens not valid to store.');

    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE, tokenResponse.accessToken!);
    localStorage.setItem(
      REFRESH_TOKEN_LOCAL_STORAGE,
      tokenResponse.refreshToken!
    );
  }
}
