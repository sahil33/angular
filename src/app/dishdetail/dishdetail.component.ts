import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Comment } from '../shared/comment';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-dishdetail',  
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  visibility = 'shown';
  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
  'author': {
    'required':      'Name is required.',
    'minlength':     'Name must be at least 2 characters long.',
    'maxlength':     'Name cannot be more than 25 characters long.'
  },
  'comment': {
    'required':      'Comment is required.',
    'minlength':     'Comment must be at least 2 characters long.'
  },
 };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();

    }
   

  // ngOnInit() {
  //   const id = this.route.snapshot.params['id'];
  //   this.dishservice.getDish(id)
  //   .subscribe(dish => this.dish = dish);
  // }
  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id);},
    errmess => this.errMess = <any>errmess );

    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
        
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
  
  createForm() {
    this.commentForm = this.fb.group({
     author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
     comment: ['', [Validators.required, Validators.minLength(2)] ],
     rating: [5]
  });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }

   onValueChanged(data?: any) {
     if (!this.commentForm) { return; }
 const form = this.commentForm;
 for (const field in this.formErrors) {
   // clear previous error message (if any)
   this.formErrors[field] = '';
   const control = form.get(field);
   if (control && control.dirty && !control.valid) {
     const messages = this.validationMessages[field];
     for (const key in control.errors) {
       this.formErrors[field] += messages[key] + ' ';
     }
   }
 }
 }

   onSubmit() {
     this.comment = this.commentForm.value;
     console.log(this.comment);
     this.dish.comments.push(this.comment);
     this.comment.date = new Date().toISOString();
     this.commentForm.reset({
       name: '',
       comment: '',
       rating: 5,
     });
     this.dishcopy.comments.push(this.comment);
     this.dishservice.putDish(this.dishcopy)
       .subscribe(dish => {
         this.dish = dish; this.dishcopy = dish;
       },
       errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
   }

  
}