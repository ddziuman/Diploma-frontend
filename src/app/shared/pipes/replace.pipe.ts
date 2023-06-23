import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
})
export class ReplacePipe implements PipeTransform {
  transform(
    value: string,
    strToReplace: string,
    replacementString: string
  ): string {
    if (!value || !strToReplace || !replacementString) {
      return value;
    }

    return value.replace(new RegExp(strToReplace, 'g'), replacementString);
  }
}
