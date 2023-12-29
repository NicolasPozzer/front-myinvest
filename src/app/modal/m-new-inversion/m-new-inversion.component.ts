import { Component } from '@angular/core';
import { SInversionService } from '../../services/s-inversion.service';
import { Router } from '@angular/router';
import { Inversion } from '../../model/inversion';

@Component({
  selector: 'app-m-new-inversion',
  templateUrl: './m-new-inversion.component.html',
  styleUrl: './m-new-inversion.component.css'
})
export class MNewInversionComponent {
  nombre: string = '';
  precioEntrada: number;
  cantInvertida: number;

  constructor(private sInversion: SInversionService, private router: Router) { }

  ngOnInit(): void {
  }

  onCreate(): void {
    const inversion = new Inversion(this.nombre, this.precioEntrada, this.cantInvertida);
    this.sInversion.saveInversion(inversion).subscribe(
      data => {
      }, err => {
        alert("Inversion Añadida!!");
        window.location.reload();
      }
    )
  }

}
