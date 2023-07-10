import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
//-- Interfaces
import { ClassItem } from 'src/Interfaces/ClassItem';
import { UserItem } from 'src/Interfaces/UserItem';
import { BarChartsInterface } from 'src/Interfaces/BarChartsInterface';
import { GamesInterface } from 'src/Interfaces/GamesInterface';
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
    'Juego con el índice más alto de aciertos o fallos por clase y alumno',
    'Tiempo empleado en finalizar el juego por clase y alumno',
    'Ranking en base al tiempo, puntaje, fallos y aciertos',
  ];
  sReportOption!: string;

  //f-r form -
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
  difficultyOptions: string[] = ['Facil', 'Intermedio', 'Dificil'];
  difficultyOption!: string;
  difficultyOptionFinal!: string;
  gamesOptions!: GamesInterface[];
  gameOption!: GamesInterface;
  failOrSuccessOptions: string[] = ['Aciertos', 'Fallos'];
  failOrSuccessOption!: string;
  //div visibility variables
  vvFailRatioCont = true;
  vvIsFilterByClass = false;
  vvIsFilterByUser = false;
  vvButtonGenerateReport = false;
  vvGameList = false;
  vvFoS = false;

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
  view: [number, number] = [900, 500];
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
    this.apiConsumer.fetchClasessByTxt(this.searchTextClass).subscribe(
      (classes: ClassItem[]) => {
        this.classOptions = classes;
      },
      (error) => {
        console.error('Error fetching classes:', error);
        this.classOptions = [];
      }
    );
  }

  onSearchUserChange(): void {
    this.apiConsumer.fetchUsersByTxt(this.searchTextUser).subscribe(
      (classes: UserItem[]) => {
        this.userOptions = classes;
      },
      (error) => {
        console.error('Error fetching classes:', error);
        this.userOptions = [];
      }
    );
  }

  validateOption(): void {
    this.sfr = [];
    this.selectedClass = {} as ClassItem;
    this.selectedUser = {} as UserItem;
    this.gameOption = {} as GamesInterface;
    this.vvButtonGenerateReport = false;

    if (this.sReportOption == this.reportOptions[0]) {
      //---
      this.vvFailRatioCont = true;
      this.vvGameList = false;
      this.vvFoS = false;
    }
    if (this.sReportOption == this.reportOptions[1]) {
      //--
      this.fillGameOptions();
      this.vvFailRatioCont = true;
      this.vvGameList = true;
      this.vvFoS = true;
    }
    if (this.sReportOption == this.reportOptions[2]) {
      //--
      this.fillGameOptions();
      this.vvFailRatioCont = true;
      this.vvGameList = false;
      this.vvFoS = false;
    }
  }

  validateGenerateButtonVisibility() {
    if (
      this.sReportOption == this.reportOptions[0] ||
      this.sReportOption == this.reportOptions[2] ||
      this.sReportOption == this.reportOptions[3]
    ) {
      if (this.vvIsFilterByClass == true) {
        if (this.selectedClass == null || this.difficultyOption.trim() === '') {
          this.vvButtonGenerateReport = false;
        } else {
          this.vvButtonGenerateReport = true;
        }
      }
      if (this.vvIsFilterByUser == true) {
        if (this.selectedUser == null || this.difficultyOption.trim() === '') {
          this.vvButtonGenerateReport = false;
        } else {
          this.vvButtonGenerateReport = true;
        }
      }
    }
    if (this.sReportOption == this.reportOptions[1]) {
      if (this.vvIsFilterByClass == true) {
        if (
          this.selectedClass == null ||
          this.difficultyOption.trim() === '' ||
          this.gameOption == null ||
          this.gameOption.id == null ||
          this.gameOption.id == undefined ||
          this.failOrSuccessOption == null
        ) {
          this.vvButtonGenerateReport = false;
        } else {
          this.vvButtonGenerateReport = true;
        }
      }
      if (this.vvIsFilterByUser == true) {
        if (
          this.selectedUser == null ||
          this.difficultyOption.trim() === '' ||
          this.gameOption == null ||
          this.gameOption.id == null ||
          this.gameOption.id == undefined ||
          this.failOrSuccessOption == null
        ) {
          this.vvButtonGenerateReport = false;
        } else {
          this.vvButtonGenerateReport = true;
        }
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
    this.sfr = [];
    this.homologateSelections();
    if (this.sReportOption == this.reportOptions[0]) {
      this.generateRatioReport();
    }
    if (this.sReportOption == this.reportOptions[1]) {
      this.generateFailSuccessIndex();
    }
    if (this.sReportOption == this.reportOptions[2]) {
      this.generateElapsedTimeByClassOrUser();
    }
    if (this.sReportOption == this.reportOptions[3]) {
      this.generateElapsedTimeByClassOrUser();
    }
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

  homologateSelections() {
    if (this.difficultyOption != null) {
      if (this.difficultyOption == 'Facil') {
        this.difficultyOptionFinal = 'EASY';
      }
      if (this.difficultyOption == 'Intermedio') {
        this.difficultyOptionFinal = 'MEDIUM';
      }
      if (this.difficultyOption == 'Dificil') {
        this.difficultyOptionFinal = 'HARD';
      }
    }
  }

  fillGameOptions() {
    this.apiConsumer.fetchAllGames().subscribe(
      (games: GamesInterface[]) => {
        this.gamesOptions = games;
      },
      (error) => {
        console.error('Error fetching games:', error);
        this.classOptions = [];
      }
    );
  }

  //-- Api consuptiom
  generateRatioReport() {
    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null &&
      this.difficultyOption != null
    ) {
      this.apiConsumer
        .getSuccesFailRatioByClassId(
          this.selectedClass.id,
          this.difficultyOptionFinal
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null &&
      this.difficultyOption != null
    ) {
      this.apiConsumer
        .getSuccesFailRatioByUserId(
          this.selectedUser.id,
          this.difficultyOptionFinal
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
  }

  generateFailSuccessIndex() {
    var userOrClass;
    var failOrSuccess;

    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null &&
      this.difficultyOption !== null &&
      this.gameOption !== null
    ) {
      userOrClass = 1;
      if (this.failOrSuccessOption == this.failOrSuccessOptions[0]) {
        failOrSuccess = 0;
      } else {
        failOrSuccess = 1;
      }

      this.apiConsumer
        .getMostFailsOrSuccessByClassOrUser(
          userOrClass,
          failOrSuccess,
          this.gameOption.id,
          this.difficultyOptionFinal,
          this.selectedClass.id
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }

    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null &&
      this.difficultyOption !== null &&
      this.gameOption !== null
    ) {
      userOrClass = 0;
      if (this.failOrSuccessOption == this.failOrSuccessOptions[0]) {
        failOrSuccess = 0;
      } else {
        failOrSuccess = 1;
      }

      this.apiConsumer
        .getMostFailsOrSuccessByClassOrUser(
          userOrClass,
          failOrSuccess,
          this.gameOption.id,
          this.difficultyOptionFinal,
          this.selectedUser.id
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
  }

  generateElapsedTimeByClassOrUser() {
    var userOrClass;
    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null &&
      this.difficultyOption !== null
    ) {
      userOrClass = 1;
      this.apiConsumer
        .getElapsedTimeByClassOrUser(
          userOrClass,
          this.difficultyOptionFinal,
          this.selectedClass.id
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null &&
      this.difficultyOption !== null
    ) {
      userOrClass = 0;
      this.apiConsumer
        .getElapsedTimeByClassOrUser(
          userOrClass,
          this.difficultyOptionFinal,
          this.selectedUser.id
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
  }

  generateGeneralRanking() {
    var userOrClass;
    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null &&
      this.gameOption.id !== null &&
      this.difficultyOption !== null
    ) {
      userOrClass = 1;
      this.apiConsumer
        .GeneralRanking(
          userOrClass,
          this.gameOption.id,
          this.difficultyOptionFinal,
          this.selectedClass.id
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null &&
      this.gameOption.id !== null &&
      this.difficultyOption !== null
    ) {
      userOrClass = 0;
      this.apiConsumer
        .GeneralRanking(
          userOrClass,
          this.gameOption.id,
          this.difficultyOptionFinal,
          this.selectedUser.id
        )
        .subscribe(
          (sfr: BarChartsInterface | BarChartsInterface[]) => {
            this.sfr = Array.isArray(sfr) ? sfr : [sfr];
          },
          (error) => {
            console.error('Error fetching sfr:', error);
            this.sfr = [];
          }
        );
    }
  }
}
