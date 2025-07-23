import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IdentityClient,
  InfoRequest,
} from '../../services/whoIsParking-api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly loginService = inject(IdentityClient);

  public userReactiveForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])(.{6,})$/
      ),
    ]),
  });

  public onSubmit(): void {
    const newEmail = this.userReactiveForm.controls.email.value;
    const oldPassword = this.userReactiveForm.controls.oldPassword.value;
    const newPassword = this.userReactiveForm.controls.newPassword.value;

    if (
      !this.userReactiveForm.valid ||
      typeof newEmail !== 'string' ||
      typeof oldPassword !== 'string' ||
      typeof newPassword !== 'string'
    )
      return;

    this.loginService
      .infoPOST(new InfoRequest({ newEmail, oldPassword, newPassword }))
      .subscribe({
        next: () => {
          this.userReactiveForm.reset();
        },
        error: (err) => {
          console.log(err); //FIXME: do better
        },
      });
  }
}
