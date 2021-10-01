import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form!: FormGroup;

  get f() : any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder){

  }

  ngOnInit(): void {
    this.validation();
  }

  public validation()
  {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmarSenha')
    };

    this.form = this.fb.group(
      {
        primeiroNome : ['',[Validators.required, Validators.minLength(4)]],
        ultimoNome : ['',[Validators.required, Validators.minLength(4)]],
        email : ['', [Validators.required, Validators.email]],
        usuario : ['',[Validators.required, Validators.minLength(4)]],
        senha : ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha : ['', Validators.required],
      }, formOptions);
  }
}
