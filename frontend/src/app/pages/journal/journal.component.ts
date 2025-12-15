import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { Habito, DatosDiarioResponse, SeguimientoHabitoRequest, CrearHabitoRequest } from '../../models/habito';

// Declarar tipos globales para librerías externas
declare var flatpickr: any;
declare var monthSelectPlugin: any;
declare var Chart: any;

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit, AfterViewInit {
  añoActual: number = new Date().getFullYear();
  mesActual: number = new Date().getMonth() + 1;
  mantra: string = '';
  nuevoHabitoNombre: string = '';
  
  habitos: Habito[] = [];
  dias: string[] = [];
  eventosDiarios: { [key: string]: string } = {};
  datosSeguimiento: { [habitoId: string]: string[] } = {};
  
  private selectorFecha: any;
  private graficoHabitos: any;

  constructor(private journalService: JournalService) {}

  ngOnInit() {
    this.inicializarMes();
    this.cargarDatosDiario();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inicializarSelectorFecha();
      this.inicializarGrafico();
    }, 100);
  }

  inicializarMes() {
    const ahora = new Date();
    this.añoActual = ahora.getFullYear();
    this.mesActual = ahora.getMonth() + 1;
  }

  cargarDatosDiario() {
    this.journalService.getJournalData(this.añoActual, this.mesActual - 1)
      .subscribe({
        next: (data: DatosDiarioResponse) => {
          if (data.estado === 'success') {
            this.habitos = data.habitos;
            this.dias = data.dias;
            this.datosSeguimiento = data.datosSeguimiento;
            this.eventosDiarios = {};
            this.actualizarGrafico();
          }
        },
        error: (error: any) => {
          console.error('Error cargando datos del diario:', error);
          this.crearDatosMock();
        }
      });
  }

  crearDatosMock() {
    const diasEnMes = new Date(this.añoActual, this.mesActual, 0).getDate();
    this.dias = Array.from({ length: diasEnMes }, (_, i) => (i + 1).toString());
    
    this.habitos = [
      { 
        id: 1, 
        nombre: 'Ejercicio', 
        usuarioId: 1,
        color: '#3498db',
        metaDiaria: 1,
        descripcion: '30 minutos de ejercicio'
      },
      { 
        id: 2, 
        nombre: 'Leer', 
        usuarioId: 1,
        color: '#2ecc71',
        metaDiaria: 1,
        descripcion: 'Leer 20 páginas'
      } 
    ];
    
    this.datosSeguimiento = {
      '1': ['1', '3', '5', '7', '10'],
      '2': ['2', '4', '6', '8', '12']
    };
    
    this.eventosDiarios = {};
    this.actualizarGrafico();
  }

  inicializarSelectorFecha() {
    const trigger = document.getElementById('date-picker-trigger');
    if (trigger) {
      this.selectorFecha = flatpickr(trigger, {
        locale: {
          firstDayOfWeek: 1,
          months: {
            longhand: [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]
          }
        },
        plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: "F Y" })],
        defaultDate: new Date(),
        onChange: (selectedDates: Date[]) => {
          const fecha = selectedDates[0];
          this.añoActual = fecha.getFullYear();
          this.mesActual = fecha.getMonth() + 1;
          this.cargarDatosDiario();
        }
      });
      
      trigger.textContent = `${this.obtenerNombreMes(this.mesActual)} ${this.añoActual}`;
    }
  }

  obtenerNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  }

  inicializarGrafico() {
    const ctx = document.getElementById('habits-chart') as HTMLCanvasElement;
    if (ctx) {
      this.graficoHabitos = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.habitos.map(h => h.nombre),
          datasets: [{
            label: 'Días completados',
            data: this.habitos.map(h => 
              this.datosSeguimiento[h.id.toString()] ? this.datosSeguimiento[h.id.toString()].length : 0
            ),
            backgroundColor: '#9c27b0'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: this.dias.length,
              ticks: { color: '#ffffff' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: '#ffffff' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
          },
          plugins: {
            legend: {
              labels: { color: '#ffffff' }
            }
          }
        }
      });
    }
  }

  estaHabitoMarcado(habitoId: string, dia: string): boolean {
    return this.datosSeguimiento[habitoId] && this.datosSeguimiento[habitoId].includes(dia);
  }

  alternarHabito(habitoId: string, dia: string, evento: Event) {
    const checkbox = evento.target as HTMLInputElement;
    const completado = checkbox.checked;
    
    const solicitud: SeguimientoHabitoRequest = {
      habitoId: parseInt(habitoId),
      fecha: `${this.añoActual}-${this.mesActual.toString().padStart(2, '0')}-${dia.padStart(2, '0')}`,
      completado: completado
    };
    
    this.journalService.trackHabit(solicitud).subscribe({
      next: (respuesta: any) => {
        if (respuesta.estado === 'success') {
          if (completado) {
            if (!this.datosSeguimiento[habitoId]) this.datosSeguimiento[habitoId] = [];
            if (!this.datosSeguimiento[habitoId].includes(dia)) this.datosSeguimiento[habitoId].push(dia);
          } else {
            if (this.datosSeguimiento[habitoId]) {
              this.datosSeguimiento[habitoId] = this.datosSeguimiento[habitoId].filter(d => d !== dia);
            }
          }
          this.actualizarGrafico();
        }
      },
      error: (error: any) => console.error('Error alternando hábito:', error)
    });
  }

  agregarHabito() {
    if (!this.nuevoHabitoNombre.trim()) return;

    const nuevoHabito: CrearHabitoRequest = {
      nombre: this.nuevoHabitoNombre,
      descripcion: '',
      color: '#3498db',
      metaDiaria: 1
    };

    this.journalService.addHabit(nuevoHabito)
      .subscribe({
        next: (respuesta: any) => {
          if (respuesta.estado === 'success') {
            this.nuevoHabitoNombre = '';
            this.cargarDatosDiario();
          }
        },
        error: (error: any) => console.error('Error agregando hábito:', error)
      });
  }

  actualizarGrafico() {
    if (this.graficoHabitos) {
      this.graficoHabitos.data.labels = this.habitos.map(h => h.nombre);
      this.graficoHabitos.data.datasets[0].data = this.habitos.map(h => 
        this.datosSeguimiento[h.id.toString()] ? this.datosSeguimiento[h.id.toString()].length : 0
      );
      this.graficoHabitos.update();
    }
  }
}