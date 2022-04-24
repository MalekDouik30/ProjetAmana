import * as XLSX from "xlsx"
import { MatTableExporterDirective } from 'mat-table-exporter';
import { Injectable, ViewChild } from "@angular/core";

@Injectable()
export class ExportExcel {
    @ViewChild(MatTableExporterDirective) matTableExporter: MatTableExporterDirective;
    
    exporterExcelWithIdTable(idDiv:string,nameFile:string) : void{
    
    let element = document.getElementById(idDiv);
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const timeSpan = new Date().toISOString();
    const fileName = `${nameFile}-${timeSpan}`;
 
    XLSX.writeFile(wb, fileName);
    }

}