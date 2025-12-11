import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var flatpickr: any;
declare var Chart: any;

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {
  mantra: string = '';
  days: number[] = [];
  habits: any[] = [];
  events: { [key: number]: string } = {};
  trackingData: { [key: string]: number[] } = {};
  newHabitName: string = '';
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  private fp: any;
  private habitsChart: any;

  ngOnInit(): void {
    this.initDatePicker();
    this.initChart();
    this.updateJournalView(new Date());
  }

  private initDatePicker(): void {
    this.fp = flatpickr('#date-picker-trigger', {
      locale: { 
        firstDayOfWeek: 1, 
        months: { 
          longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] 
        } 
      },
      plugins: [ new (window as any).monthSelectPlugin({ shorthand: true, dateFormat: "F Y" }) ],
      defaultDate: new Date(),
      onChange: (selectedDates: Date[]) => this.updateJournalView(selectedDates[0]),
    });
  }

  private initChart(): void {
    const ctx = document.getElementById('habits-chart') as HTMLCanvasElement;
    this.habitsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completados', 'Pendientes'],
        datasets: [{
          data: [0, 100],
          backgroundColor: ['#9c27b0', '#343a40'],
          borderColor: '#1e1e1e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  updateJournalView(date: Date): void {
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth() + 1; // JS month is 0-11
    const monthName = this.fp.formatDate(date, "F");

    const datePickerTrigger = document.getElementById('date-picker-trigger');
    if (datePickerTrigger) {
        datePickerTrigger.textContent = `${monthName} ${this.currentYear}`;
    }

    // Simulate fetching data
    const data = this.getSimulatedData(this.currentYear, this.currentMonth);
    this.days = data.days;
    this.habits = data.habits;
    this.trackingData = data.tracking_data;
    this.updateChart();
  }

  addHabit(): void {
    if (!this.newHabitName.trim()) return;
    // Simulate adding a habit
    const newHabit = { _id: `habit_${this.habits.length + 1}`, name: this.newHabitName };
    this.habits.push(newHabit);
    this.newHabitName = '';
    this.updateChart();
  }

  trackHabit(habitId: string, day: number, event: any): void {
    const completed = event.target.checked;
    if (completed) {
      if (!this.trackingData[habitId]) {
        this.trackingData[habitId] = [];
      }
      this.trackingData[habitId].push(day);
    } else {
      if (this.trackingData[habitId]) {
        this.trackingData[habitId] = this.trackingData[habitId].filter(d => d !== day);
      }
    }
    this.updateChart();
  }

  isHabitChecked(habitId: string, day: number): boolean {
    return this.trackingData[habitId] && this.trackingData[habitId].includes(day);
  }

  private updateChart(): void {
    let completedCount = 0;
    let totalTrackable = this.habits.length * this.days.length;

    if (totalTrackable === 0) {
        this.habitsChart.data.datasets[0].data = [0, 100];
        this.habitsChart.update();
        return;
    }

    for (const habitId in this.trackingData) {
        completedCount += this.trackingData[habitId].length;
    }

    const completedPercentage = (completedCount / totalTrackable) * 100;
    this.habitsChart.data.datasets[0].data = [completedPercentage, 100 - completedPercentage];
    this.habitsChart.update();
  }
  
  saveMantra() {}
  saveEvent(day: number) {}

  private getSimulatedData(year: number, month: number): any {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return {
      days: daysArray,
      habits: [
        { _id: 'habit_1', name: 'Leer' },
        { _id: 'habit_2', name: 'Hacer ejercicio' },
      ],
      tracking_data: {
        'habit_1': [1, 2, 3],
        'habit_2': [2, 4]
      }
    };
  }
}
