import { Component, OnInit, TemplateRef } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from 'src/models/Evento';
import { EventoService } from 'src/services/Evento.service';
import { Lote } from 'src/models/Lote';
import { LoteService } from 'src/services/lote.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';
  eventoId = 0 ;
  modalRef!:BsModalRef
  loteAtual = {id: 0, nome: '', indice: 0} ;
  file: File;

  imagemURl = '../../../../assets/upload.png';

  get modoEditar():boolean{
    return this.estadoSalvar === 'put'
  }

  get f(): any {
    return this.form.controls;
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm ',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(private fb: FormBuilder,
     private localeService: BsLocaleService,
     private activatedRouter: ActivatedRoute,
     private eventoService: EventoService,
     private loteService: LoteService,
     private spinner: NgxSpinnerService,
     private toastr: ToastrService,
     private router: Router,
     private modalService: BsModalService
     )
  {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();

  }

  public resetForm(): void {
    // event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null) : any {
    return { 'is-invalid': campoForm?.errors && campoForm?.touched };
  }

  public mudarValorData(value: Date, indice: number, campo: string):void{
    this.lotes.value[indice][campo] = value;
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
      imagemURL: [''],
      lotes: this.fb.array([])
    });
  }


  carregarEvento() : void{
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!;
    if(this.eventoId !== null && this.eventoId !== 0)
    {
      this.spinner.show();
      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento ) =>{
          this.evento = {...evento};
          this.form.patchValue(this.evento)
          if(this.evento.imagemURL !== ''){
            this.imagemURl = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
          this.carregarLote();
          // this.evento.lotes.forEach(lote =>{
          //     this.lotes.push(this.criarLote(lote));
          // });
        },
          (error: any) =>{
            this.toastr.error('Erro ao tentar carregar Evento.', 'Error!')
            console.log(error);
        }
        ).add(() => this.spinner.hide());
    }
  }

  public salvarEvento() : void{
    this.spinner.show();

    if(this.form.valid){
      if(this.estadoSalvar === 'post'){
        this.evento = {...this.form.value};
        this.eventoService['post'](this.evento).subscribe(
            (eventoRetorno: Evento) =>{
              this.toastr.success('Evento salvo com sucesso!','Sucesso');
              this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
            },
            (error: any) => {
              console.log(error);
              this.toastr.error('N??o ao salvar Evento!','Error');
            },
            () => this.spinner.hide()
        );

      }
      else{
        this.evento = {id: this.evento.id, ...this.form.value};
        this.eventoService['put'](this.evento).subscribe(
          (eventoRetorno: Evento) =>
          {
            this.toastr.success('Evento atualizado com sucesso!','Sucesso')
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
          (error: any) => {
            console.log(error);
            this.toastr.error('N??o ao salvar Evento!','Error');
          }
        ).add(() => this.spinner.hide());
      }

      // this.carregarEvento();
    }
  }

  adicionarLote(): void{
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup{
    return this.fb.group({
    id: [lote.id],
    nome: [lote.nome, Validators.required],
    preco: [lote.preco, Validators.required],
    quantidade: [lote.quantidade, Validators.required],
    dataInicio : [lote.dataInicio],
    dataFim: [lote.dataFim],
    });
  }

  public salvarLote(): void{
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
        () =>{
          this.toastr.success('Lote foi salvo com sucesso!', 'Sucesso')
        },
        (error: any) => {
          this.toastr.error('N??o foi poss??vel salvar Lote', 'Erro');
          console.log(error);
        },
      ).add(() => this.spinner.hide());
    }
  }

  carregarLote() : void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) =>{
          lotesRetorno.forEach(lote =>{
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error: any) =>{
        this.toastr.error('Erro ao carregar lotes','Error!')
        console.log(error);
      }
    ).add(()=>this.spinner.hide());
  }

  removerlote(template: TemplateRef<any>, indiceLote: number):void{
    this.loteAtual.id = this.lotes.get(indiceLote + ".id")?.value;
    this.loteAtual.nome = this.lotes.get(indiceLote + ".nome")?.value;
    this.loteAtual.indice = indiceLote;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  retornaTituloLote(nome: string) : string{
    return nome === null || nome === '' ? 'Nome do lote': nome;
  }

  confirmDeleteLote(): void {

    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId,this.loteAtual.id).subscribe(
      ()=>{
        this.toastr.success('Lote deletado com sucesso.','Sucesso!');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any)=>{
        console.log(error);
        this.toastr.error('Erro ao tentar deletar Lote.','Error!');
      }
    ).add(() => this.spinner.hide());
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }


  public onFileChange(event: any) : void{
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemURl = event.target.result;

    this.file = event.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImage();
  }

  uploadImage():void{
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.toastr.success('Imagem atualizada com sucesso','Sucesso!');
        this.carregarEvento();
      },
      (error: Error) =>
      {
        this.toastr.error('Erro ao salvar imagem','Erro!')
        console.log(error);
      },
    ).add(() => this.spinner.hide());
  }
}
