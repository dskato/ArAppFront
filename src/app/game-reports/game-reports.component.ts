import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { ApiHandlerService } from 'src/services/api-handler.service';

export interface SFRResponse {
  code: number;
  message: string | null;
  data: any[];
  codeText: string;
}
interface ClassItem {
  id: number;
  className: string;
  grade: string;
  code: string;
}

interface UserItem {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  role: string;
  status: string;
  token: string | null;
  createDate: string;
}


export interface BarChartsInterface {
  name: string;
  series: {
    name: string;
    value: number;
  };
}

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
    'Ranking en base de tiempo empleado de alumnos por juego y aula'
  ];
  sReportOption!: string;

  //f-r form -
  searchTextClass!: string;
  searchTextUser!: string;
  classOptions: ClassItem[] = [];
  selectedClass: ClassItem = {} as ClassItem;
  userOptions: UserItem[] = [];
  selectedUser: UserItem = {} as UserItem;
  filterOption: string[] = [
    'Clase', 'Usuario'
  ];
  reportByOption!: string;
  selectedTypeOfChart!: string;
  typeOfChartOption: string[] = [
    'Barras Verticales', 'Barras Horizontales Apiladas', 'Area de Barras', 'Líneas de Barras'
  ];


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



  ngOnInit(): void {

  }

  constructor(private http: HttpClient, private apiHandler: ApiHandlerService) {
    //Object.assign(this, { this.sfr });
  }

  getSuccesFailRatioByClassId(classId: number): void {
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyclassid/' + encodeURIComponent(classId))
      .subscribe(
        (response: SFRResponse) => {
          this.sfr = [];
          this.sfr = this.sfr.concat(response.data);
          console.log(this.sfr);
        },
        (error) => {
          console.error('Error fetching sfr: ', error);
        }
      );
  }

  getSuccesFailRatioByUserId(userId: number): void {
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyuserid/' + encodeURIComponent(userId))
      .subscribe(
        (response: SFRResponse) => {
          this.sfr = [];
          this.sfr = this.sfr.concat(response.data);
          console.log(this.sfr);
        },
        (error) => {
          console.error('Error fetching sfr:', error);
        }
      );
  }

  fetchClasessByTxt(): void {
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-GetAllClassesByTextSearch/' + encodeURIComponent(this.searchTextClass))
      .subscribe(
        (response: SFRResponse) => {
          this.classOptions = this.classOptions.concat(response.data);
        },
        (error) => {
          console.error('Error fetching clasess:', error);
        }
      );
  }

  fetchUsersByTxt(): void {
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-GetAllUsersByTextSearch/' + encodeURIComponent(this.searchTextUser))
      .subscribe(
        (response: SFRResponse) => {
          this.userOptions = this.userOptions.concat(response.data);
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  onSearchClassChange(): void {
    this.fetchClasessByTxt();
  }
  onSearchUserChange(): void {
    this.fetchUsersByTxt();
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

    if (this.reportByOption == this.filterOption[0]) { //Filter by class
      this.vvIsFilterByClass = true;
      this.vvIsFilterByUser = false;
      
    } else { // Filter by user
      this.vvIsFilterByClass = false;
      this.vvIsFilterByUser = true;
      
    }

  }

  changeChart() {

    this.setAllChartsInvisible();
    if (this.selectedTypeOfChart == this.typeOfChartOption[0]) { // Barras verticales
      this.vvBarVertical2d = true;
      this.xAxisLabel = "Clase";
      this.legendTitle = "Estudiantes";
    }
    if (this.selectedTypeOfChart == this.typeOfChartOption[1]) { // Barras horizontales
      this.vvBarHorizontalStacked = true;  
      this.xAxisLabel = "Estudiante";
      this.legendTitle = "Clases";
    }
    if (this.selectedTypeOfChart == this.typeOfChartOption[2]) { // Area de Barras
      this.vvBarArea = true;
      this.xAxisLabel = "Estudiantes";
      this.legendTitle = "Clases";
    }
    if (this.selectedTypeOfChart == this.typeOfChartOption[3]) { // Area de Lineas
      this.vvBarLines = true;
    }
  };

  generateReportBarCharts() {
    if (this.selectedClass && this.selectedClass.id !== undefined && this.selectedClass.id !== null) {
      this.getSuccesFailRatioByClassId(this.selectedClass.id);

    }
    if (this.selectedUser && this.selectedUser.id !== undefined && this.selectedUser.id !== null) {
      this.getSuccesFailRatioByUserId(this.selectedUser.id);

    }
    console.log(this.selectedClass.id);
    console.log(this.selectedUser.id);
  }


  onSelect(data: any): void {

  }

  onActivate(data: any): void {
  }

  onDeactivate(data: any): void {
  }


  setAllChartsInvisible() {
    this.vvBarHorizontalStacked = false;
    this.vvBarVertical2d = false;
    this.vvBarArea = false;
    this.vvBarLines = false;
  }


}

