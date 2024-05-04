import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string, selectedCategory: string): any[] {
    if (value == null || value == undefined || value.length == 0 || !searchTerm) {
      return [];
    }
    return value.filter((element: any) => {
      const searchTermNormalized = this.normalizeText(searchTerm);
      if (selectedCategory === 'category' && element.categoriesVideo && element.categoriesVideo.nameCategory) {
        return this.normalizeText(element.categoriesVideo.nameCategory).includes(searchTermNormalized);
      } else if (element[selectedCategory]) {
        return this.normalizeText(element[selectedCategory]).includes(searchTermNormalized);
      } else {
        return false;
      }
    });
  }

  normalizeText(text: string): string {
    return text.toLowerCase()
               .normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "");
  }
}
