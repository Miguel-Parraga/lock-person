import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { Habit, JournalDataResponse } from '../../models/habit';

declare const flatpickr: any;
declare const monthSelectPlugin: any;
declare const Chart: any;

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  mantra: string = '';
  newHabitName: string = '';
  
  habits: Habit[] = [];
  days: string[] = [];
  dailyEvents: { [key: string]: string } = {};
  trackingData: { [habitId: string]: string[] } = {};
  
  private datePicker: any;
  private habitsChart: any;

  constructor(private journalService: JournalService) {}

  ngOnInit() {
    this.initializeMonth();
    this.loadJournalData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeDatePicker();
      this.initializeChart();
    }, 100);
  }

  initializeMonth() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
  }

  loadJournalData() {
    this.journalService.getJournalData(this.currentYear, this.currentMonth - 1)
      .subscribe({
        next: (data: JournalDataResponse) => {
          if (data.status === 'success') {
            this.habits = data.habits;
            this.days = data.days;
            this.trackingData = data.tracking_data;
            this.dailyEvents = {};
            this.updateChart();
          }
        },
        error: (error: any) => {
          console.error('Error loading journal data:', error);
          this.createMockData();
        }
      });
  }

  createMockData() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    
    this.habits = [
      { id: '1', name: 'Ejercicio', userId: '1' },
      { id: '2', name: 'Leer', userId: '1' }
    ];
    
    this.trackingData = {
      '1': ['1', '3', '5'],
      '2': ['2', '4', '6']
    };
    
    this.dailyEvents = {};
    this.updateChart();
  }

  initializeDatePicker() {
    const trigger = document.getElementById('date-picker-trigger');
    if (trigger) {
      this.datePicker = flatpickr(trigger, {
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
          const date = selectedDates[0];
          this.currentYear = date.getFullYear();
          this.currentMonth = date.getMonth() + 1;
          this.loadJournalData();
        }
      });
      
      trigger.textContent = `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
    }
  }

  getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1];
  }

  initializeChart() {
    const ctx = document.getElementById('habits-chart') as HTMLCanvasElement;
    if (ctx) {
      this.habitsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.habits.map(h => h.name),
          datasets: [{
            label: 'Días completados',
            data: this.habits.map(h => 
              this.trackingData[h.id] ? this.trackingData[h.id].length : 0
            ),
            backgroundColor: '#9c27b0'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: this.days.length,
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

  isHabitChecked(habitId: string, day: string): boolean {
    return this.trackingData[habitId] && this.trackingData[habitId].includes(day);
  }

  toggleHabit(habitId: string, day: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const completed = checkbox.checked;
    
    this.journalService.trackHabit({
      habit_id: habitId,
      year: this.currentYear,
      month: this.currentMonth,
      day: day,
      completed: completed
    }).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          if (completed) {
            if (!this.trackingData[habitId]) this.trackingData[habitId] = [];
            if (!this.trackingData[habitId].includes(day)) this.trackingData[habitId].push(day);
          } else {
            if (this.trackingData[habitId]) {
              this.trackingData[habitId] = this.trackingData[habitId].filter(d => d !== day);
            }
          }
          this.updateChart();
        }
      },
      error: (error: any) => console.error('Error tracking habit:', error)
    });
  }

  addHabit() {
    if (!this.newHabitName.trim()) return;

    this.journalService.addHabit({ name: this.newHabitName })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.newHabitName = '';
            this.loadJournalData();
          }
        },
        error: (error: any) => console.error('Error adding habit:', error)
      });
  }

  updateChart() {
    if (this.habitsChart) {
      this.habitsChart.data.labels = this.habits.map(h => h.name);
      this.habitsChart.data.datasets[0].data = this.habits.map(h => 
        this.trackingData[h.id] ? this.trackingData[h.id].length : 0
      );
      this.habitsChart.update();
    }
  }
}