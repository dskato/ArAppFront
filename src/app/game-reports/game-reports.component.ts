import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
//-- Interfaces
import { SFRResponse } from 'src/Interfaces/SFRResponse';
import { ClassItem } from 'src/Interfaces/ClassItem';
import { UserItem } from 'src/Interfaces/UserItem';
import { BarChartsInterface } from 'src/Interfaces/BarChartsInterface';
//-- Services
import { ApiHandlerService } from 'src/services/api-handler.service';
import { ApiConsumerService } from 'src/services/api-consumer.service';

@Component({
  selector: 'app-game-reports',
  templateUrl: './game-reports.component.html',
  styleUrls: ['./game-reports.component.css'],
})
export class GameReportsComponent implements OnInit {
  globalUrl = this.apiHandler.apiUrl;

  //Reports Options
  reportOptions: string[] = [
    'Ratio entre aciertos y fallos en los intentos de cada juego por clase y alumno',
    'Juego con el índice más alto de fallos',
    'Juego con el índice más alto de aciertos',
    'Tiempo empleado en finalizar el juego por clase y alumno',
    'Ranking en base de tiempo empleado de alumnos por juego y aula',
  ];
  sReportOption!: string;

  //f-r form
  searchTextClass!: string;
  searchTextUser!: string;
  classOptions: ClassItem[] = [];
  selectedClass: ClassItem = {} as ClassItem;
  userOptions: UserItem[] = [];
  selectedUser: UserItem = {} as UserItem;
  filterOption: string[] = ['Clase', 'Usuario'];
  reportByOption!: string;
  selectedTypeOfChart!: string;
  typeOfChartOption: string[] = [
    'Barras Verticales',
    'Barras Horizontales Apiladas',
    'Area de Barras',
    'Líneas de Barras',
  ];
  difficultyOptions: string[] = ['EASY', 'MEDIUM', 'HARD'];
  difficultyOption!: string;

  //div visibility variables
  vvFailRatioCont = true;
  vvIsFilterByClass = false;
  vvIsFilterByUser = false;
  vvButtonGenerateReport = false;

  //charts visibility variables
  vvBarVertical2d = true;
  vvBarHorizontalStacked = false;
  vvBarArea = false;
  vvBarLines = false;

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Ratio Aciertos Fallos';
  legendTitle: string = '';
  timeline: boolean = true;
  view: [number, number] = [800, 480];
  colorScheme: Color = {
    domain: ['#151515', '#fe5115'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  sfr: BarChartsInterface[] = [];

  ngOnInit(): void {}
  constructor(
    private http: HttpClient,
    private apiHandler: ApiHandlerService,
    private apiConsumer: ApiConsumerService
  ) {
    //Object.assign(this, { this.sfr });
  }

  onSearchClassChange(): void {
    console.log(this.searchTextClass);
    this.classOptions = this.apiConsumer.fetchClasessByTxt(
      this.searchTextClass
    );
  }
  onSearchUserChange(): void {
    this.userOptions = this.apiConsumer.fetchUsersByTxt(this.searchTextUser);
  }

  validateOption(): void {
    if (this.sReportOption == this.reportOptions[0]) {
      this.vvFailRatioCont = true;
    } else {
      this.vvFailRatioCont = false;
    }
  }

  validateGenerateButtonVisibility() {
    if (this.vvIsFilterByClass == true) {
      if (this.selectedClass == null) {
        this.vvButtonGenerateReport = false;
      } else {
        this.vvButtonGenerateReport = true;
      }
    }
    if (this.vvIsFilterByUser == true) {
      if (this.selectedUser == null) {
        this.vvButtonGenerateReport = false;
      } else {
        this.vvButtonGenerateReport = true;
      }
    }
  }

  validateReportByOption(): void {
    this.vvButtonGenerateReport = false;
    this.sfr = [];
    this.selectedClass = {} as ClassItem;
    this.selectedUser = {} as UserItem;

    if (this.reportByOption == this.filterOption[0]) {
      //Filter by class
      this.vvIsFilterByClass = true;
      this.vvIsFilterByUser = false;
    } else {
      // Filter by user
      this.vvIsFilterByClass = false;
      this.vvIsFilterByUser = true;
    }
  }

  changeChart() {
    this.setAllChartsInvisible();
    if (this.selectedTypeOfChart == this.typeOfChartOption[0]) {
      // Barras verticales
      this.vvBarVertical2d = true;
      this.xAxisLabel = 'Clase';
      this.legendTitle = 'Estudiantes';
    }
    if (this.selectedTypeOfChart == this.typeOfChartOption[1]) {
      // Barras horizontales
      this.vvBarHorizontalStacked = true;
      this.xAxisLabel = 'Estudiante';
      this.legendTitle = 'Clases';
    }
    if (this.selectedTypeOfChart == this.typeOfChartOption[2]) {
      // Area de Barras
      this.vvBarArea = true;
      this.xAxisLabel = 'Estudiantes';
      this.legendTitle = 'Clases';
    }
    if (this.selectedTypeOfChart == this.typeOfChartOption[3]) {
      // Area de Lineas
      this.vvBarLines = true;
    }
  }

  generateReportBarCharts() {
    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null &&
      this.difficultyOption != null
    ) {
      this.sfr = this.apiConsumer.getSuccesFailRatioByClassId(
        this.selectedClass.id,
        this.difficultyOption
      );
    }
    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null &&
      this.difficultyOption != null
    ) {
      this.sfr = this.apiConsumer.getSuccesFailRatioByUserId(
        this.selectedUser.id,
        this.difficultyOption
      );
    }
    console.log(this.selectedClass.id);
    console.log(this.selectedUser.id);
  }

  //Charts functions
  onSelect(data: any): void {}

  onActivate(data: any): void {}

  onDeactivate(data: any): void {}

  setAllChartsInvisible() {
    this.vvBarHorizontalStacked = false;
    this.vvBarVertical2d = false;
    this.vvBarArea = false;
    this.vvBarLines = false;
  }
}
