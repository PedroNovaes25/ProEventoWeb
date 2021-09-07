import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {


  @Input()titulo!: String;
  @Input()iconClass: String = 'fa fa-user';
  @Input()Subtitulo: String = 'Desde 2011';
  @Input()botaoListar: Boolean = false;


  constructor(private router: Router) { }

  ngOnInit() {
  }

  listar(): void{
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`])
  }

}
