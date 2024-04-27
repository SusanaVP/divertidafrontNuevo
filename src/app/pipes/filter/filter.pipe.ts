import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string, selectedCategory: string): any[] {
    if (value == null || value == undefined || value.length == 0) {
      return [];
    }
    return value.filter((element: any) => {
      if (selectedCategory === 'category' && element.categoriesVideo && element.categoriesVideo.nameCategory) {
        return element.categoriesVideo.nameCategory.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (element[selectedCategory]) {
        return element[selectedCategory].toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return false;
      }
    });
  }
}
