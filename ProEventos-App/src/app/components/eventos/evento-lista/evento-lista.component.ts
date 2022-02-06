import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from 'src/models/Evento';
import { EventoService } from 'src/services/Evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;

  public eventos : Evento[] = [];
  public eventosFiltrados : Evento[] = [];
  public eventoId: number = 0;

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
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  public ngOnInit(): void {

    this.spinner.show();
    this.carregarEventos();
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

  public carregarImagemEvento(imagemUrl: string): string{
    return imagemUrl !=='' ? `${environment.apiURL}resources/images/${imagemUrl}`
    : '../../../../assets/semImagem.png'
  }

  public carregarEventos() : void
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

  openModal(event: any,template: TemplateRef<any>, eventoId: number) : void{
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if(result.message === 'Deletado'){
            this.toastr.success('O evento foi deletado com sucesso', 'Deletado!');
            this.carregarEventos();
        }

      },
      (error: any) => {
        console.log(error);
        this.toastr.error(`Error ao tentar deletar o evento ${this.eventoId}!`, 'Error');
      }
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void
  {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }



}
