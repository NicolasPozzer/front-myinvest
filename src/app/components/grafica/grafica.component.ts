import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { SInversionService } from '../../services/s-inversion.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Inversion } from '../../model/inversion';
import { interval, Subject } from 'rxjs';
import { takeUntil, switchMap, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
})
export class GraficaComponent implements OnInit, AfterViewInit, OnDestroy {
  total: number;
  historial: number[] = [];
  canvas: any;
  ctx: any;
  chart: Chart;
  listaInversiones: Inversion[] = [];
  destroy$: Subject<void> = new Subject<void>(); // Para desuscribirse de interval

  constructor(
    private sInversionService: SInversionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.getTotalDeCartera();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarGrafica();
      // Actualizar la gráfica cada 5 minutos (ajusta el intervalo según tus necesidades)
      interval(2000) // 300,000 milisegundos = 5 minutos
        .pipe(
          takeUntil(this.destroy$),
          switchMap(() => this.sInversionService.getInversiones()), // Cambiar a switchMap para manejar la lógica de reinicio
          take(1) // Tomar solo el primer conjunto de inversiones
        )
        .subscribe(data => {
          if (data.length === 0) {
            // Detener el intervalo si no hay nuevas inversiones
            this.destroy$.next();
            this.destroy$.complete();
          } else {
            this.listaInversiones = data;
            this.acumularValores();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTotalDeCartera() {
    this.sInversionService.getTotalDeCartera().subscribe(data => {
      this.total = data;
      this.historial.push(0); // Iniciar desde cero
      this.actualizarGrafica();
    });
  }

  inicializarGrafica(): void {
    this.canvas = document.getElementById('lineChart');
    this.ctx = this.canvas.getContext('2d');

    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['1'],
        datasets: [
          {
            label: 'Historial de Capital en Cartera',
            data: this.historial,
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            fill: false
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          },
          y: {
            type: 'linear',
            position: 'left'
          }
        }
      }
    });
  }

  actualizarGrafica(): void {
    if (this.chart) {
      // Actualizar las etiquetas y crear un nuevo conjunto de datos para evitar problemas de referencia
      const newLabel = (this.chart.data.labels.length + 1).toString();
      this.chart.data.labels.push(newLabel);
  
      const newData = [...this.historial]; // Crear una nueva copia del historial
      this.chart.data.datasets[0].data = newData;
  
      this.chart.update();
    }
  }

  acumularValores(): void {
    // Acumular el historial con las nuevas inversiones
    let acumulado = 0;
    for (const inversion of this.listaInversiones) {
      acumulado += inversion.cantInvertida;
      this.historial.push(acumulado);
      this.actualizarGrafica();
    }
  }
}
