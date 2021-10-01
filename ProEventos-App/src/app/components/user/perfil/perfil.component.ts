import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form!: FormGroup;

  get f() : any{
    return this.form.controls
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.validation()
  }

  onSubmit() : void {
    if(this.form.invalid){
      return;
    }
  }

  public validation(){

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmarSenha')
    };

    this.form = this.fb.group(
      {
        primeiroNome : ['',[Validators.required, Validators.minLength(4)]],
        ultimoNome : ['',[Validators.required, Validators.minLength(4)]],
        email : ['', [Validators.required, Validators.email]],
        telefone : ['', [Validators.required, Validators.minLength(11)]],
        descricao : ['',[Validators.required, Validators.minLength(4)]],
        senha : ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha : ['', Validators.required],
      }, formOptions);
  }

  public resetForm(event:any) : void
  {
    event.preventDefault();
    this.form.reset();
  }
}
