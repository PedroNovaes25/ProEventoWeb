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
  constructor() {}

  ngOnInit() {}
}
