import { Component, OnInit,Input  } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from 'src/app/shared/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { yearMinValue,yearMaxValue,runtimeMinValue,runtimeMaxValue, defaultImage } from '../../shared/models/consts'
import { ValidateTitleNotExist } from 'src/app/validators/title-not-exist.validator';
import { AlertService } from 'src/app/services/alert.service';
import { HttpClient } from '@angular/common/http';
import { WhitespaceValidator } from 'src/app/validators/whitespace.validator';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

 @Input() movie:Movie;
 movieForm : FormGroup;
 yearMinValue:number;
 yearMaxValue:number;
 runtimeMinValue:number;
 runtimeMaxValue:number;

  constructor(private movieService:MovieService,
              public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private alertService:AlertService,
              private httpClient:HttpClient)
 { 
  this.yearMinValue=yearMinValue;
  this.yearMaxValue=yearMaxValue;
  this.runtimeMinValue=runtimeMinValue;
  this.runtimeMaxValue=runtimeMaxValue;
 }

  ngOnInit() {

    if (this.movie.id==="") {
      this.movie.id=this.movieService.getRandomId()
    }

     this.movieForm=this.fb.group({
    id:[{value:this.movie.id, disabled:true}],
    title:    [this.movie.title, Validators.compose([Validators.required, Validators.minLength(2),WhitespaceValidator]) , 
                                                     ValidateTitleNotExist.createValidator(this.movieService,this.movie.title)],                                                          
    year:     [this.movie.year, [  Validators.required,
                                   Validators.min(yearMinValue),
                                   Validators.max(yearMaxValue) ]],
    runtime:  [this.movie.runtime, [ Validators.required,
                                     Validators.min(runtimeMinValue),
                                     Validators.max(runtimeMaxValue) ]],
    genre:    [this.movie.genre, Validators.required],
    director: [this.movie.director, Validators.required],
    poster:   [this.movie.poster, Validators.required]
    });
  }
  get id() {
    return this.movieForm.get('id');
  }
  get title() {
    return this.movieForm.get('title');
  }
  get year() {
    return this.movieForm.get('year');
  }
  get runtime() {
    return this.movieForm.get('runtime');
  }
  get genre() {
    return this.movieForm.get('genre');
  }
  get director() {
    return this.movieForm.get('director');
  }
  get poster() {
    return this.movieForm.get('poster');
  }

  deleteConfirmation(){
    const modalRef = this.modalService.open(DeleteConfirmationComponent, { size: 'sm' });
    modalRef.componentInstance.movie = this.movie;
    modalRef.result.then(result=>{
      if (result==='delete click') {
        this.movieService.emitMovieRemoving(this.movie);
        this.alertService.emitMessage( 'success',`Movie ${this.title.value} was removed localy successfully`);
        this.modalService.dismissAll();
      }
    })
 }

 updateMovie():void{
    if (this.movieForm.valid) {    
     this.movieService.emitMovieUpdater(this.movieForm.getRawValue());
     this.alertService.emitMessage('success',`Movie ${this.movie.title} was added localy successfully`);
     this.modalService.dismissAll();                                  
    }
 }
//  setMovieImage(imageUrl:string){
//    if (imageUrl && imageUrl!=='') {
//      this.movie.poster=imageUrl;
//    }
 //}
 
}
