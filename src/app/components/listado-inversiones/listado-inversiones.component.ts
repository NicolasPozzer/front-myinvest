import { Component, OnInit } from '@angular/core';
import { SInversionService } from '../../services/s-inversion.service';
import { Router } from '@angular/router';
import { Inversion } from '../../model/inversion';

@Component({
  selector: 'app-listado-inversiones',
  templateUrl: './listado-inversiones.component.html',
  styleUrl: './listado-inversiones.component.css'
})
export class ListadoInversionesComponent implements OnInit {

  listaInversiones: Inversion[] = [];
  liveApi: string = '';
  listaAgrupados: { nombre: string, inversiones: Inversion[] }[] = [];

  constructor(private sInversionService: SInversionService, private router: Router) {}

  ngOnInit(): void {
    this.getInversiones();
    this.agruparInversiones();
  }

  getInversiones(): void {
    this.sInversionService.getInversiones().subscribe(data => {
      this.listaInversiones = data;
    });
  }

  deleteInversion(id?: number) {
    if (id != undefined) {
      this.sInversionService.deleteInversion(id).subscribe(
        data => {
          this.getInversiones();
        }
      )
    }
  }

  agruparInversiones(): void {
    this.sInversionService.getInversiones().subscribe(data => {
      // Limpiar listaAgrupados
      this.listaAgrupados = [];

      // Agrupar inversiones por nombre
      data.forEach(inversion => {
        const grupoExistente = this.listaAgrupados.find(grupo => grupo.nombre === inversion.nombre);
        if (grupoExistente) {
          grupoExistente.inversiones.push(inversion);
        } else {
          this.listaAgrupados.push({ nombre: inversion.nombre, inversiones: [inversion] });
        }
      });
    });
  }

  getInversionesPorActivo(activoNombre: string) {
    const grupo = this.listaAgrupados.find(grupo => grupo.nombre === activoNombre);
    return grupo ? grupo.inversiones : [];
  }
}
