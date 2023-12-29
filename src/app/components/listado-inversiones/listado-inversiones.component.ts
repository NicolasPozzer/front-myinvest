import { Component, OnInit } from '@angular/core';
import { SInversionService } from '../../services/s-inversion.service';
import { Router } from '@angular/router';
import { Inversion } from '../../model/inversion';

@Component({
  selector: 'app-listado-inversiones',
  templateUrl: './listado-inversiones.component.html',
  styleUrls: ['./listado-inversiones.component.css']
})
export class ListadoInversionesComponent implements OnInit {

  listaInversiones: Inversion[] = [];
  listaInversion: Inversion[] = [];
  liveApi: string = '';
  listaAgrupados: { nombre: string, inversiones: Inversion[] }[] = [];
  total: number;
  totalPorMoneda: { nombre: string, total: number, mostrado?: boolean }[] = [];
  promedioEntrada: { nombree: string, totall: number, mostradoo?: boolean }[] = [];

  constructor(private sInversionService: SInversionService, private router: Router) { }

  ngOnInit(): void {
    this.getTotalDeCartera();
    this.getInversiones();
    this.agruparInversiones();
  }

  getInversiones(): void {
    this.sInversionService.getInversiones().subscribe(data => {
      this.listaInversiones = data;

      
    });
  }

  agruparInversiones(): void {
    this.sInversionService.getInversiones().subscribe(data => {
      this.listaAgrupados = [];

      data.forEach(inversion => {
        const grupoExistente = this.listaAgrupados.find(grupo => grupo.nombre === inversion.nombre);
        if (grupoExistente) {
          grupoExistente.inversiones.push(inversion);
        } else {
          this.listaAgrupados.push({ nombre: inversion.nombre, inversiones: [inversion] });

          this.sInversionService.getTotalPorMoneda(inversion.nombre).subscribe(total => {
            this.totalPorMoneda.push({ nombre: inversion.nombre, total: total });
          });
          
          this.sInversionService.getPromedioEntrada(inversion.nombre).subscribe(total => {
            this.promedioEntrada.push({ nombree: inversion.nombre, totall: total });
          });
        }
      });
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

  getInversionesPorActivo(activoNombre: string) {
    const grupo = this.listaAgrupados.find(grupo => grupo.nombre === activoNombre);
    return grupo ? grupo.inversiones : [];
  }

  getTotalDeCartera() {
    this.sInversionService.getTotalDeCartera().subscribe(data => {
      this.total = data;
    });
  }
}
