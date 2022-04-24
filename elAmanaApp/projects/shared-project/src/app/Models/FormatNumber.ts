import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  transform(num: any): string {
    let result=""
    if(num!=null){
        result=num.toLocaleString(undefined, {minimumFractionDigits: 3}).replace(/(?!^)(?=(?:\d{3})+$)/g,' ');
        
    }
    return result
  }
}