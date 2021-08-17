import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalVerificacionComponent } from '../modal-verificacion/modal-verificacion.component';

import { AngularFireDatabase } from '@angular/fire/database';

import { FormBuilder } from '@angular/forms';

interface Pregunta {
  idx: number;
  tipo: number;
  txt: string;
  obligaria: boolean;
  resp: string;
}

interface Requisicion {
  id: number
  nombre: string;
  cntPregunta: number;
  preguntas: Pregunta[];
}

interface Respuestas {
  id: number,
  resp: any,
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  slctdTab = 0;
  slctTipo = 0;
  arrDatos: Respuestas[] = [];
  resps: any = ""
  event: any;

  load_show = true;

  //Tipos: 0 Select, 1 DatePicker, 2 text area, 3 Checkbox, 4input, 5URL o archivos

  requis: any;;
  nueva_requi_form = this.formBuilder.group({})

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,

    private db: AngularFireDatabase,
  ) { }

  ngOnInit(): void {

    let getInfo = this.db.database.ref('Requis_Tipos/').once('value').then(
      snapshot => {
        this.requis = [];
        Object.entries(snapshot.val()).forEach(cada_tipo_requi => {
          this.requis.push(cada_tipo_requi);
        })
        setTimeout(() => {
          this.getOtherLists();
        }, 500)

      }
    )
  }

  changeTab(idx: number) {
    this.load_show = true;
    this.slctdTab = idx;
    this.getOtherLists();
  }

  openVerificacion() {
    const dialogRef = this.dialog.open(ModalVerificacionComponent)
    //dialogRef.componentInstance.infoArr =  this.requis[this.slctTipo].preguntas

  }

  saveAnswers(idx: number, value: any) {
    this.arrDatos.push({ id: idx, resp: value })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onSubmit() {
    console.log("Requi,", this.nueva_requi_form)
  }

  getOtherLists() {
    for (let i = 0; i < this.requis[this.slctTipo][1].preguntas.length; i++) {
      let cada_pregunta = this.requis[this.slctTipo][1].preguntas[i];
      if(Object.keys(cada_pregunta).includes('ref')){
        let get_info = this.db.database.ref(cada_pregunta.ref.toString() + '/').once('value').then(
          snapshot => {
            this.requis[this.slctTipo][1].preguntas[i].opciones = snapshot.val()
          })
      };
      this.load_show=false;
    }

  }
}
