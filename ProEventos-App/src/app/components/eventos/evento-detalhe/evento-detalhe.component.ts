import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Evento } from 'src/models/Evento';
import { EventoService } from 'src/services/Evento.service';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as Evento;
  form!: FormGroup;

  estadoSalvar = 'post';

  get f(): any {
    return this.form.controls;
  }


  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default'
    };
  }

  constructor(private fb: FormBuilder,
     private localeService: BsLocaleService,
     private router: ActivatedRoute,
     private eventoService: EventoService,
     private spinner: NgxSpinnerService,
     private toastr: ToastrService
     )
  {
    this.localeService.use('pt-br');
  }

  carregarEvento() : void{
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if(eventoIdParam != null)
    {
      this.spinner.show();
      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento ) =>{
          this.evento = {...evento};
          this.form.patchValue(this.evento)
        },
          (error: any) =>{
            this.spinner.hide();
            this.toastr.error('Erro ao tentar carregar Evento.', 'Error!')
            console.error(error);
        }
        ).add(() => this.spinner.hide());
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();

  }

  public validation() {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
    });
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracoes() : void{
    this.spinner.show();

    if(this.form.valid){
      if(this.estadoSalvar === 'post'){
        this.evento = {...this.form.value};
        this.eventoService['post'](this.evento).subscribe(
            () => this.toastr.success('Evento salvo com sucesso!','Sucesso'),
            (error: any) => {
              console.error(error);
              this.toastr.error('Não ao salvar Evento!','Error');
            },
            () => this.spinner.hide()
        );
      }
      else{
        this.evento = {id: this.evento.id, ...this.form.value};
        this.eventoService['put'](this.evento).subscribe(
          () => this.toastr.success('Evento salvo com sucesso!','Sucesso'),
          (error: any) => {
            console.error(error);
            this.toastr.error('Não ao salvar Evento!','Error');
          }
        ).add(() => this.spinner.hide());
      }

    }
  }


  // public salvarAlteracoes() : void{
  //   this.spinner.show();

  //   if(this.form.valid){

  //     if(this.estadoSalvar === 'post'){
  //       this.evento = {...this.form.value};
  //     }
  //     else{
  //       this.evento = {id: this.evento.id, ...this.form.value};
  //     }

  //     this.eventoService[this.estadoSalvar](this.evento).subscribe(
  //       () => this.toastr.success('Evento salvo com sucesso!','Sucesso'),
  //       (error: any) => {
  //         console.error(error);
  //         this.spinner.hide();
  //         this.toastr.error('Não ao salvar Evento!','Error');
  //       },
  //       () => this.spinner.hide()
  //     );

  //   }
  // }
}
