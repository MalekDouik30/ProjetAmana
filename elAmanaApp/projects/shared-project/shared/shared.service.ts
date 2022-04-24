import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';  // npm i xlsx

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  exportToExcel(fileName:string,dataToExport:any,header:any) {
    const workBook = XLSX.utils.book_new(); 
    // const workSheet = XLSX.utils.json_to_sheet(dataToExport, {header: header,skipHeader:true} );
    const workSheet = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); 
    XLSX.writeFile(workBook,fileName); 
  }

}
