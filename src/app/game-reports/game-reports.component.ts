import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, catchError, forkJoin, of, switchMap, tap } from 'rxjs';

//-- Interfaces
import { ClassItem } from 'src/Interfaces/ClassItem';
import { UserItem } from 'src/Interfaces/UserItem';
import { BarChartsInterface } from 'src/Interfaces/BarChartsInterface';
import { GamesInterface } from 'src/Interfaces/GamesInterface';
import { ChartsInterface } from 'src/Interfaces/ChartsInterface';
//-- Services
import { ApiHandlerService } from 'src/services/api-handler.service';
import { ApiConsumerService } from 'src/services/api-consumer.service';
import { TokenService } from 'src/services/token.service';

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

  difficultyOptionsReal: string[] = ['EASY', 'MEDIUM', 'HARD'];
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
  vvButtonShowGeneralInfo = false;

  //charts visibility variables
  vvGeneralCharts = true;
  vvBarVertical2d = true;
  vvBarHorizontalStacked = true;
  vvBarArea = false;
  vvBarLines = false;

  //VERTICAL, HORIZONTAL AND AREA CHARTS OPTIONS
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  legendTitle: string = '';
  timeline: boolean = true;
  view!: [number, number]; //W H
  colorScheme: Color = {
    domain: [
      '#30BB7D',
      '#E75255',
      '#BEECFC',
      '#202020',
      '#00BFF3',
      '#F7ACAE',
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
      '#aec7e8',
      '#ffbb78',
      '#98df8a',
      '#ff9896',
      '#c5b0d5',
    ],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Generated Reports',
  };
  //PIE, CARDS AND ANOTHER CHARTS
  cardColor: string = '#AAAAAA';

  sfr: BarChartsInterface[] = [];
  observables: Observable<BarChartsInterface>[] = [];
  reportInformation!: string;

  //GeneralReportData
  //-- General Info
  sfrOtherCharts: ChartsInterface[] = [];
  observablesGI: Observable<ChartsInterface>[] = [];
  //-- getTeacherStudentsFailOrSuccessCount
  observablesF: Observable<ChartsInterface>[] = [];
  observablesS: Observable<ChartsInterface>[] = [];
  sfrFails: ChartsInterface[] = [];
  sfrSuccess: ChartsInterface[] = [];
  //-- getTeacherStudentsFailOrSuccessCount
  observablesGC: Observable<ChartsInterface>[] = [];
  sfrGameCount: ChartsInterface[] = [];
  //-- GetTeacherStudentsGamesScores
  observablesGS: Observable<ChartsInterface>[] = [];
  sfrGameScore: ChartsInterface[] = [];

  ngOnInit(): void {
    this.changeVerticalAndHorizontalBarsVisibility(false);
    this.generateGeneralInfo().subscribe(() => {});
    this.generateGameCounts().subscribe(() => {});
    this.generateGameScores().subscribe(() => {});

    this.generateTSFoS(1).subscribe(() => {});
    this.generateTSFoS(0).subscribe(() => {});
  }

  getSize() {
    const divElement =
      this.elementRef.nativeElement.querySelector('#graphic-cont');
    const width = divElement.offsetWidth;
    const height = divElement.offsetHeight;
    if (
      localStorage.getItem('f_width') == null ||
      localStorage.getItem('f_height') == null
    ) {
      localStorage.setItem('f_width', width);
      localStorage.setItem('f_height', height);
      const f_width = localStorage.getItem('f_width');
      const f_height = localStorage.getItem('f_height');

      if (f_width !== null && f_height !== null) {
        this.view = [Number(f_width), Number(f_height)];
      }
    }
  }

  constructor(
    private apiHandler: ApiHandlerService,
    private apiConsumer: ApiConsumerService,
    private elementRef: ElementRef,
    private tokenService: TokenService
  ) {}

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
    this.showGeneralReport();

    this.sfr = [];
    this.selectedClass = {} as ClassItem;
    this.selectedUser = {} as UserItem;
    this.gameOption = {} as GamesInterface;
    this.failOrSuccessOption = {} as any;
    this.vvButtonGenerateReport = false;

    if (this.sReportOption == this.reportOptions[0]) {
      //---
      this.vvFailRatioCont = true;
      this.vvGameList = false;
      this.vvFoS = false;
      this.reportInformation =
        '<br>Formula usada: <br><br>((Suma de intentos exitosos) / (Suma de intentos exitosos + Suma de intentos fallidos)) * 100';
    }
    if (this.sReportOption == this.reportOptions[1]) {
      //--
      this.fillGameOptions();
      this.vvFailRatioCont = true;
      this.vvGameList = true;
      this.vvFoS = true;
      this.reportInformation =
        '<br>Formula usada: <br><br>Sumatoria de los aciertos o fallos.';
    }
    if (this.sReportOption == this.reportOptions[2]) {
      //--
      this.fillGameOptions();
      this.vvFailRatioCont = true;
      this.vvGameList = false;
      this.vvFoS = false;
      this.reportInformation =
        '<br>Formula usada: <br><br>Sumatoria del tiempo empleado en cada intento.';
    }
    if (this.sReportOption == this.reportOptions[3]) {
      this.fillGameOptions();
      this.vvGameList = true;
      this.reportInformation =
        '<br>Peso de los valores:<br><br>Peso del tiempo 30%. <br>Peso intentos fallidos 10%. <br>Peso del puntaje 40%. <br>Peso intentos satisfactorios 20%.<br><br>Formula usada:<br><br>((0.4 * Puntaje) + (Peso del Tiempo) + (0.2 * (Intento Satisfactorio)) + (Peso de las fallas)) ';
    }
  }

  validateGenerateButtonVisibility() {
    if (
      this.sReportOption == this.reportOptions[0] ||
      this.sReportOption == this.reportOptions[2] ||
      this.sReportOption == this.reportOptions[3]
    ) {
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
    if (this.sReportOption == this.reportOptions[1]) {
      if (this.vvIsFilterByClass == true) {
        if (
          this.selectedClass == null ||
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
    this.validateGenerateButtonVisibility();
    this.vvButtonGenerateReport = false;
    this.sfr = [];
    this.observables = [];
    this.selectedClass = {} as ClassItem;
    this.selectedUser = {} as UserItem;
    //this.changeXYAxis();

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

  showGeneralReport() {
    this.vvButtonShowGeneralInfo = false;
    this.vvGeneralCharts = true;
    this.changeVerticalAndHorizontalBarsVisibility(false);
  }
  generateReportBarCharts() {
    this.vvButtonShowGeneralInfo = true;
    this.vvGeneralCharts = false;
    this.changeVerticalAndHorizontalBarsVisibility(true);

    this.sfr = [];
    this.observables = [];

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
      this.generateGeneralRanking();
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

  //-- Api consuptiom ----------------------------------------------------------------------------------------

  generateGeneralInfo(): Observable<ChartsInterface[]> {
    this.observablesGI = [];
    this.sfrOtherCharts = [];

    return this.apiConsumer.getGeneralInfo().pipe(
      tap((response: ChartsInterface[]) => {
        this.sfrOtherCharts = response;
        this.sfrOtherCharts.forEach((chart) => {
          const chartObservable = of(chart);
          this.observablesGI.push(chartObservable);
        });
      }),
      switchMap(() => this.joinReportListOtherCharts(this.observablesGI)),
      catchError((error) => {
        console.error('Error fetching sfrOtherCharts:', error);
        this.sfrOtherCharts = [];
        return of([]);
      })
    );
  }

  generateTSFoS(failOrSuccess: number): Observable<ChartsInterface[]> {
    this.observablesF = [];
    this.observablesS = [];
    this.sfrFails = [];
    this.sfrSuccess = [];

    return this.apiConsumer
      .getTeacherStudentsFailOrSuccessCount(failOrSuccess)
      .pipe(
        tap((response: ChartsInterface[]) => {
          if (failOrSuccess == 1) {
            this.sfrFails = response;
            this.sfrFails.forEach((chart) => {
              const chartObservable = of(chart);
              this.observablesF.push(chartObservable);
            });
          } else {
            this.sfrSuccess = response;
            this.sfrSuccess.forEach((chart) => {
              const chartObservable = of(chart);
              this.observablesS.push(chartObservable);
            });
          }
        }),
        switchMap(() =>
          this.joinReportListFoS(
            failOrSuccess == 1 ? this.observablesF : this.observablesS,
            failOrSuccess
          )
        ),
        catchError((error) => {
          console.error('Error fetching sfrFoS:', error);
          failOrSuccess == 1 ? (this.sfrFails = []) : (this.sfrSuccess = []);
          return of([]);
        })
      );
  }

  generateGameCounts(): Observable<ChartsInterface[]> {
    this.observablesGC = [];
    this.sfrGameCount = [];

    return this.apiConsumer.getTeacherStudentsGamesPlayedCount().pipe(
      tap((response: ChartsInterface[]) => {
        this.sfrGameCount = response;
        this.sfrGameCount.forEach((chart) => {
          const chartObservable = of(chart);
          this.observablesGC.push(chartObservable);
        });
      }),
      switchMap(() => this.joinReportListGameCount(this.observablesGC)),
      catchError((error) => {
        console.error('Error fetching sfrGameCount:', error);
        this.sfrGameCount = [];
        return of([]);
      })
    );
  }

  generateGameScores(): Observable<ChartsInterface[]> {
    this.observablesGS = [];
    this.sfrGameScore = [];

    return this.apiConsumer.getTeacherStudentsGamesPlayedCount().pipe(
      tap((response: ChartsInterface[]) => {
        this.sfrGameScore = response;
        this.sfrGameScore.forEach((chart) => {
          const chartObservable = of(chart);
          this.observablesGS.push(chartObservable);
        });
      }),
      switchMap(() => this.joinReportListGameScore(this.observablesGS)),
      catchError((error) => {
        console.error('Error fetching sfrGameScore:', error);
        this.sfrGameCount = [];
        return of([]);
      })
    );
  }

  generateRatioReport() {
    var isUser = this.isUserSelected();
    var uocId = this.getUserOrClassId();

    this.difficultyOptionsReal.forEach((option) => {
      const observable = this.apiConsumer.getSuccesFailRatioByClassOrUserId(
        isUser,
        uocId,
        option
      );
      this.observables.push(observable);
    });
    this.joinReportList(this.observables);
  }

  generateFailSuccessIndex() {
    var userOrClass: any;
    var failOrSuccess: any;
    var isUser = this.isUserSelected();
    var uocId = this.getUserOrClassId();

    isUser ? (userOrClass = 0) : (userOrClass = 1);
    this.failOrSuccessOption == this.failOrSuccessOptions[0]
      ? (failOrSuccess = 0)
      : (failOrSuccess = 1);

    this.difficultyOptionsReal.forEach((option) => {
      const observable = this.apiConsumer.getMostFailsOrSuccessByClassOrUser(
        userOrClass,
        failOrSuccess,
        this.gameOption.id,
        option,
        uocId
      );
      this.observables.push(observable);
    });

    this.joinReportList(this.observables);
  }

  generateElapsedTimeByClassOrUser() {
    var userOrClass: any;
    var isUser = this.isUserSelected();
    var uocId = this.getUserOrClassId();

    isUser ? (userOrClass = 0) : (userOrClass = 1);

    this.difficultyOptionsReal.forEach((option) => {
      const observable = this.apiConsumer.getElapsedTimeByClassOrUser(
        userOrClass,
        option,
        uocId
      );
      this.observables.push(observable);
    });
    this.joinReportList(this.observables);
  }

  generateGeneralRanking() {
    var userOrClass: any;
    var isUser = this.isUserSelected();
    var uocId = this.getUserOrClassId();
    isUser ? (userOrClass = 0) : (userOrClass = 1);

    this.difficultyOptionsReal.forEach((option) => {
      const observable = this.apiConsumer.GeneralRanking(
        userOrClass,
        this.gameOption.id,
        option,
        uocId
      );
      this.observables.push(observable);
    });
    this.joinReportList(this.observables);
  }

  // Add the observables responses to the sfrOtherCharts
  joinReportListOtherCharts(
    observables: Observable<ChartsInterface>[]
  ): Observable<ChartsInterface[]> {
    return forkJoin(observables).pipe(
      tap((results: ChartsInterface[]) => {
        results[4].value = parseFloat((results[4].value / 3600).toFixed(2));
        this.sfrOtherCharts = results;
      }),
      catchError((error) => {
        console.error('Error fetching sfrOtherCharts:', error);
        this.sfrOtherCharts = [];
        return of([]);
      })
    );
  }
  //--
  joinReportListFoS(
    observables: Observable<ChartsInterface>[],
    fos: number
  ): Observable<ChartsInterface[]> {
    return forkJoin(observables).pipe(
      tap((results: ChartsInterface[]) => {
        fos == 1 ? (this.sfrFails = results) : (this.sfrSuccess = results);
      }),
      catchError((error) => {
        console.error('Error fetching sfrOtherCharts:', error);
        fos == 1 ? (this.sfrFails = []) : (this.sfrSuccess = []);
        return of([]);
      })
    );
  }

  joinReportListGameCount(
    observables: Observable<ChartsInterface>[]
  ): Observable<ChartsInterface[]> {
    return forkJoin(observables).pipe(
      tap((results: ChartsInterface[]) => {
        this.sfrGameCount = results;
      }),
      catchError((error) => {
        console.error('Error fetching sfrGameCount:', error);
        this.sfrGameCount = [];
        return of([]);
      })
    );
  }

  joinReportListGameScore(
    observables: Observable<ChartsInterface>[]
  ): Observable<ChartsInterface[]> {
    return forkJoin(observables).pipe(
      tap((results: ChartsInterface[]) => {
        this.sfrGameScore = results;
      }),
      catchError((error) => {
        console.error('Error fetching sfrGameScore:', error);
        this.sfrGameScore = [];
        return of([]);
      })
    );
  }

  // Add the observables responses to the SFR
  joinReportList(observables: Observable<BarChartsInterface>[]) {
    forkJoin(observables).subscribe(
      (results: BarChartsInterface[]) => {
        this.sfr = results;
      },
      (error) => {
        console.error('Error fetching sfr:', error);
        this.sfr = [];
      }
    );
  }

  // Validate if the option is user or class and return the ID
  getUserOrClassId(): number {
    var uocId = 0;
    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null
    ) {
      uocId = this.selectedUser.id;
    }
    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null
    ) {
      uocId = this.selectedClass.id;
    }

    return uocId;
  }

  isUserSelected(): boolean {
    var isUoC: any;

    if (
      this.selectedUser &&
      this.selectedUser.id !== undefined &&
      this.selectedUser.id !== null
    ) {
      isUoC = true;
    }
    if (
      this.selectedClass &&
      this.selectedClass.id !== undefined &&
      this.selectedClass.id !== null
    ) {
      isUoC = false;
    }
    return isUoC;
  }

  //Visibility functions
  changeVerticalAndHorizontalBarsVisibility(vv: boolean) {
    this.vvBarVertical2d = vv;
    this.vvBarHorizontalStacked = vv;
  }
}
