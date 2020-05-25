import { Component, OnInit,Inject} from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';




 @Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

     dishes: Dish[];
     errMess: string;
  // selectedDish: Dish;

  constructor(private dishService: DishService,
     @Inject('BaseURL') private BaseURL) { }
       
  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes);

    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }
  //  onSelect(dish: Dish) {
  //   this.selectedDish = dish;
  // }

}
