import { Component, OnInit } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';


 @Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[] = DISHES;

  selectedDish: Dish;
  constructor(private dishService: DishService) { }
       
  ngOnInit() {
    this.dishes = this.dishService.getDishes();
  }
   onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

}
