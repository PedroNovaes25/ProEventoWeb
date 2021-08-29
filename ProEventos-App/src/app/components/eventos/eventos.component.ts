import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from 'src/models/Evento';
import { EventoService } from 'src/services/Evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  // providers: [EventoService] Permite a Classe EventoService ser injetada neesse componente
})
export class EventosComponent implements OnInit {

  modalRef!: BsModalRef;

  public eventos : Evento[] = [];
  public eventosFiltrados : Evento[] = [];

  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem: boolean = true;

  private filtroListado = '';
  public get filtroLista() : string
  {
    return this.filtroListado;
  }
  public set filtroLista(value: string)
  {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  constructor(
    private eventoService : EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
    ) { }

  public ngOnInit(): void {

    this.spinner.show();
    this.getEventos();
  }

  public filtrarEventos(filtrarPor: string) : Evento[]
  {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return  this.eventos.filter(
      (evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public alterarImagem() : void
  {
    this.exibirImagem = !this.exibirImagem
  }

  public getEventos() : void
  {
    const observer ={
      next: (_eventos: Evento[]) =>
      {
        this.eventos = _eventos,
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) =>
      {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar eventos!', 'Erro!');
      },
      complete: () => this.spinner.hide()
    }

    this.eventoService.getEventos().subscribe(observer);
  }

  openModal(template: TemplateRef<any>) : void{
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O evento foi deletado com sucesso', 'Deletado!');
  }

  decline(): void {
    this.modalRef.hide();
  }

}
