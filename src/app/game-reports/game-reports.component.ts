import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { ApiHandlerService } from 'src/services/api-handler.service';

export interface SFRResponse {
  code: number;
  message: string | null;
  data: BarChartsInterface[];
  codeText: string;
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

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Estudiantes';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Ratio Aciertos Fallos';
  legendTitle: string = 'Estudiantes';

  colorScheme: Color = {
    domain: ['#151515', '#fe5115'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  sfr: BarChartsInterface[] = [];
  view: [number, number] = [900, 500];

  ngOnInit(): void {
    this.getSuccesFailRatioByClassId()
  }

  constructor(private http: HttpClient, private apiHandler: ApiHandlerService) {
    //Object.assign(this, { this.sfr });
  }

  getSuccesFailRatioByClassId(): void {
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyclassid/1')
      .subscribe(
        (response: SFRResponse) => {
          this.sfr = this.sfr.concat(response.data);
          console.log(this.sfr);
        },
        (error) => {
          console.error('Error fetching sfr:', error);
        }
      );
  }






  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }




}
